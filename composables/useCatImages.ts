import type { CatImage, CatImagesComposable, CacheEntry } from '~/types';

// Cache for storing fetched images with TTL

const imageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

/**
 * Simplified composable for fetching cat images with direct URLs
 * Provides reactive state management, error handling, and caching
 */
export function useCatImages(): CatImagesComposable {
	const images = ref<CatImage[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const requestAbortController = ref<AbortController | null>(null);

	// Try to get preloaded images from provide/inject
	const injectedImages = inject('preloadedImages', null) as CatImage[] | null;

	/**
	 * Cache management utilities
	 */
	const getCacheKey = (count: number) => `cat-images-${count}`;

	const getCachedImages = (count: number): CatImage[] | null => {
		const key = getCacheKey(count);
		const cached = imageCache.get(key);

		if (!cached) return null;

		const now = Date.now();
		if (now - cached.timestamp > cached.ttl) {
			imageCache.delete(key);
			return null;
		}

		return cached.images;
	};

	const setCachedImages = (count: number, imageList: CatImage[]) => {
		const key = getCacheKey(count);

		// Implement LRU cache behavior
		if (imageCache.size >= MAX_CACHE_SIZE) {
			const entries = Array.from(imageCache.keys());
			if (entries.length > 0) {
				const firstKey = entries[0]!;
				imageCache.delete(firstKey);
			}
		}

		imageCache.set(key, {
			images: imageList,
			timestamp: Date.now(),
			ttl: CACHE_TTL,
		});
	};

	// Initialize with preloaded images if available
	if (injectedImages && injectedImages.length > 0 && images.value.length === 0) {
		images.value = injectedImages;
		// Cache the preloaded images
		setCachedImages(injectedImages.length, injectedImages);
	}

	/**
	 * Fetch a single cat image with retry logic and return direct URL
	 */
	const fetchSingleCatImage = async (retries = 3, abortSignal?: AbortSignal): Promise<CatImage | null> => {
		try {
			// Add timeout to prevent hanging requests
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			// Use the provided abort signal if available, otherwise use timeout controller
			const combinedSignal = abortSignal || controller.signal;

			// Create unique URL with timestamp and random parameter to ensure different images
			const uniqueParam = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const imageUrl = `https://cataas.com/cat?t=${uniqueParam}`;

			const response = await fetch(imageUrl, {
				signal: combinedSignal,
				headers: {
					Accept: 'image/*',
				},
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
			}

			return {
				id: `cat-${uniqueParam}`,
				url: imageUrl,
				timestamp: Date.now(),
			};
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
			console.warn(`Failed to fetch cat image (attempt ${4 - retries}/3):`, errorMessage);

			if (retries > 0) {
				// Exponential backoff for retries
				const delay = Math.min(1000 * Math.pow(2, 3 - retries), 5000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return fetchSingleCatImage(retries - 1, abortSignal);
			}

			return null;
		}
	};

	/**
	 * Fetch multiple cat images with SSR support and caching
	 */
	const fetchCatImages = async (count = 3): Promise<void> => {
		// Check cache first
		const cachedImages = getCachedImages(count);
		if (cachedImages && cachedImages.length > 0) {
			images.value = cachedImages;
			return;
		}

		// Cancel any existing request
		if (requestAbortController.value) {
			requestAbortController.value.abort();
		}

		requestAbortController.value = new AbortController();
		loading.value = true;
		error.value = null;

		try {
			// Use server API endpoint for better performance and SSR support
			const { data } = await $fetch('/api/cat-images', {
				query: { count: Math.min(count, 5) },
				signal: requestAbortController.value.signal,
			});

			if (!data || data.length === 0) {
				throw new Error('No cat images received from server');
			}

			// Filter out null values and ensure proper typing
			const validData = data.filter((item): item is CatImage => item !== null);
			images.value = validData;

			// Cache the results
			setCachedImages(count, validData);
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				// Request was cancelled, don't update error state
				return;
			}

			// Fallback to client-side fetching if server API fails
			console.warn('Server API failed, falling back to client-side fetching:', err);

			try {
				// Fetch images concurrently with a reasonable limit
				const fetchPromises = Array.from({ length: Math.min(count, 5) }, () =>
					fetchSingleCatImage(3, requestAbortController.value!.signal)
				);
				const results = await Promise.allSettled(fetchPromises);

				// Process results and collect any errors
				const validImages: CatImage[] = [];
				const errors: string[] = [];

				results.forEach((result, index) => {
					if (result.status === 'fulfilled' && result.value) {
						validImages.push(result.value);
					} else if (result.status === 'rejected') {
						errors.push(`Image ${index + 1}: ${result.reason?.message || 'Unknown error'}`);
					}
				});

				if (validImages.length === 0) {
					const errorMsg =
						errors.length > 0 ? `Failed to fetch any images. Errors: ${errors.join(', ')}` : 'Failed to fetch any cat images';
					throw new Error(errorMsg);
				}

				// Log partial failures but continue
				if (errors.length > 0 && validImages.length > 0) {
					console.warn(`Partial failure: ${errors.length} images failed to load:`, errors);
				}

				images.value = validImages;

				// Cache the results
				setCachedImages(count, validImages);
			} catch (fallbackErr) {
				const errorMessage = fallbackErr instanceof Error ? fallbackErr.message : 'Failed to fetch cat images';
				console.error('Error fetching cat images (fallback also failed):', fallbackErr);
				error.value = errorMessage;
				images.value = [];
			}
		} finally {
			loading.value = false;
			requestAbortController.value = null;
		}
	};

	/**
	 * Refetch images (public API)
	 */
	const refetch = async (): Promise<void> => {
		images.value = [];
		imageCache.clear();
		await fetchCatImages();
	};

	return {
		images: readonly(images),
		loading: readonly(loading),
		error: readonly(error),
		refetch,
	};
}

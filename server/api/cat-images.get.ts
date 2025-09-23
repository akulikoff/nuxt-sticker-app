import type { CatImage, CatImagesQuery, CatImagesResponse, FetchResult } from '~/types';

export default defineEventHandler(async (event): Promise<CatImagesResponse> => {
	try {
		// Get count from query params, default to 3
		const query = getQuery<CatImagesQuery>(event);
		const countParam = typeof query.count === 'string' ? parseInt(query.count, 10) : query.count || 3;
		const count = Math.min(Math.max(countParam, 1), 5); // Min 1, Max 5 images

		// Fetch multiple cat images concurrently
		const fetchPromises: Promise<FetchResult>[] = Array.from({ length: count }, async (): Promise<FetchResult> => {
			const uniqueParam = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			const imageUrl = `https://cataas.com/cat?t=${uniqueParam}`;

			try {
				const response = await fetch(imageUrl, {
					headers: {
						Accept: 'image/*',
					},
					// Add timeout for server-side requests
					signal: AbortSignal.timeout(5000), // 5 second timeout
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const catImage: CatImage = {
					id: `cat-${uniqueParam}`,
					url: imageUrl,
					timestamp: Date.now(),
				};

				return catImage;
			} catch (error) {
				console.warn('Failed to fetch cat image on server:', error);
				return null;
			}
		});

		const results = await Promise.allSettled(fetchPromises);

		// Filter out failed requests and null values
		const validImages: CatImage[] = results
			.filter((result): result is PromiseFulfilledResult<CatImage> => result.status === 'fulfilled' && result.value !== null)
			.map(result => result.value);

		if (validImages.length === 0) {
			throw createError({
				statusCode: 503,
				statusMessage: 'Failed to fetch cat images from external API',
			});
		}

		return {
			success: true,
			data: validImages,
			count: validImages.length,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Server error fetching cat images:', errorMessage);

		throw createError({
			statusCode: 500,
			statusMessage: 'Internal server error while fetching cat images',
		});
	}
});

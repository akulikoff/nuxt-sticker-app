<template>
	<div
		ref="containerRef"
		class="animated-sticker"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
	>
		<!-- Trigger Button -->
		<button
			class="animated-sticker__trigger"
			:class="{
				'animated-sticker__trigger--expanded': isExpanded,
				'animated-sticker__trigger--loading': loading,
				'animated-sticker__trigger--error': error,
			}"
			@click="handleTriggerClick($event)"
			@touchend="handleTouchEnd"
			:aria-label="isExpanded ? 'Close cat sticker' : 'Open cat sticker'"
		>
			<!-- Loading state -->
			<div
				v-if="loading"
				class="animated-sticker__trigger-spinner"
			/>

			<!-- Error state -->
			<svg
				v-else-if="error"
				class="animated-sticker__trigger-icon"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle
					cx="12"
					cy="12"
					r="10"
				/>
				<line
					x1="12"
					y1="8"
					x2="12"
					y2="12"
				/>
				<line
					x1="12"
					y1="16"
					x2="12.01"
					y2="16"
				/>
			</svg>

			<!-- Normal state - Simple outline Cat face -->
			<svg
				v-else
				class="animated-sticker__trigger-icon"
				width="50"
				height="50"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<!-- Cat head circle -->
				<circle
					cx="12"
					cy="12"
					r="6"
				/>
				<!-- Left ear -->
				<path d="M7 8 L9 4 L11 8" />
				<!-- Right ear -->
				<path d="M13 8 L15 4 L17 8" />
				<!-- Eyes -->
				<circle
					cx="10"
					cy="10"
					r="0.5"
				/>
				<circle
					cx="14"
					cy="10"
					r="0.5"
				/>
				<!-- Nose -->
				<path d="M12 13 L11.5 13.5 L12.5 13.5 Z" />
				<!-- Mouth -->
				<path d="M12 14 Q10.5 15 9.5 14.5 M12 14 Q13.5 15 14.5 14.5" />
			</svg>
		</button>

		<!-- Content Cards -->
		<div
			class="animated-sticker__content"
			:class="{ 'animated-sticker__content--expanded': showContent }"
		>
			<div class="animated-sticker__cards">
				<!-- Error message -->
				<div
					v-if="error && !loading"
					class="animated-sticker__error"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle
							cx="12"
							cy="12"
							r="10"
						/>
						<line
							x1="15"
							y1="9"
							x2="9"
							y2="15"
						/>
						<line
							x1="9"
							y1="9"
							x2="15"
							y2="15"
						/>
					</svg>
					<span>{{ error }}</span>
					<button
						@click="refetch"
						class="animated-sticker__retry-btn"
					>
						Retry
					</button>
				</div>

				<!-- Loading cards -->
				<div
					v-else-if="loading"
					class="animated-sticker__loading-cards"
				>
					<div
						v-for="n in 3"
						:key="`loading-${n}`"
						class="animated-sticker__loading"
					>
						<div class="animated-sticker__loading-spinner" />
					</div>
				</div>

				<!-- Image cards -->
				<StickerCard
					v-for="(image, index) in typedImages"
					:key="image.id"
					:image="image"
					:index="Number(index)"
					:is-visible="showContent"
					class="animated-sticker__card"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { CatImage } from '~/types';

// Component for the main animated sticker functionality
const { images, loading, error, refetch } = useCatImages();

// Component state
const isExpanded = ref(false);
const isHovered = ref(false);
const containerRef = ref<HTMLElement>();
const isTouchDevice = ref(false);

// Touch state management
const touchState = ref({
	startTime: 0,
	startPosition: { x: 0, y: 0 },
	isValidTap: false,
	preventNextClick: false,
});

// Debouncing state
const lastTapTime = ref(0);
const debounceDelay = 300; // ms

// Computed properties
const showContent = computed(() => isExpanded.value);

// Explicitly typed reactive images for template
const typedImages = computed<CatImage[]>(() => [...images.value]);

// Enhanced device detection
const detectTouchDevice = () => {
	// Define interface for legacy touch properties
	interface NavigatorWithLegacyTouch extends Navigator {
		msMaxTouchPoints?: number;
	}

	// Multiple methods to detect touch capability
	const hasTouchStart = 'ontouchstart' in window;
	const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
	const nav = navigator as NavigatorWithLegacyTouch;
	const hasTouchPoints = 'msMaxTouchPoints' in navigator && (nav.msMaxTouchPoints || 0) > 0;
	const hasPointerEvents = 'onpointerdown' in window;

	isTouchDevice.value = hasTouchStart || hasMaxTouchPoints || hasTouchPoints;

	// Log device capabilities in development
	if (import.meta.dev) {
		console.log('Device detection:', {
			isTouchDevice: isTouchDevice.value,
			hasTouchStart,
			hasMaxTouchPoints,
			hasTouchPoints,
			hasPointerEvents,
			userAgent: navigator.userAgent,
		});
	}
};

// Handle trigger interactions
const handleTriggerClick = (event?: Event) => {
	const now = Date.now();

	// Prevent ghost clicks on touch devices
	if (touchState.value.preventNextClick && event) {
		event.preventDefault();
		return;
	}

	// Debounce rapid successive taps
	if (now - lastTapTime.value < debounceDelay) {
		if (import.meta.dev) {
			console.log('Tap debounced - too rapid');
		}
		return;
	}

	lastTapTime.value = now;

	// Toggle expansion state
	isExpanded.value = !isExpanded.value;

	// Log interaction in development
	if (import.meta.dev) {
		console.log('Sticker interaction:', {
			expanded: isExpanded.value,
			isTouchDevice: isTouchDevice.value,
			timestamp: now,
		});
	}

	// Load images in background if expanding and no images
	if (isExpanded.value && images.value.length === 0 && !loading.value) {
		refetch();
	}
};

const handleMouseEnter = () => {
	// Only handle mouse events on non-touch devices or hybrid devices with hover capability
	if (isTouchDevice.value && !window.matchMedia('(hover: hover)').matches) return;

	isHovered.value = true;
	if (!isExpanded.value) {
		isExpanded.value = true;
	}

	// Load images in background if not loaded
	if (images.value.length === 0 && !loading.value) {
		refetch();
	}
};

const handleMouseLeave = () => {
	// Only handle mouse events on non-touch devices or hybrid devices with hover capability
	if (isTouchDevice.value && !window.matchMedia('(hover: hover)').matches) return;

	isHovered.value = false;
	// Keep expanded for a short time to allow interaction
	setTimeout(() => {
		if (!isHovered.value && containerRef.value) {
			isExpanded.value = false;
		}
	}, 300);
};

const handleTouchStart = (event: TouchEvent) => {
	const touch = event.touches[0];
	if (!touch) return;

	touchState.value = {
		startTime: Date.now(),
		startPosition: { x: touch.clientX, y: touch.clientY },
		isValidTap: true,
		preventNextClick: false,
	};

	// Prevent mouse events from firing on touch devices
	event.preventDefault();
};

const handleTouchMove = (event: TouchEvent) => {
	if (!touchState.value.isValidTap) return;

	const touch = event.touches[0];
	if (!touch) return;

	const touchDistance = Math.sqrt(
		Math.pow(touch.clientX - touchState.value.startPosition.x, 2) + Math.pow(touch.clientY - touchState.value.startPosition.y, 2)
	);

	// If user moves more than 10px, it's likely scrolling - invalidate the tap
	if (touchDistance > 10) {
		touchState.value.isValidTap = false;
	}
};

const handleTouchEnd = (event: TouchEvent) => {
	const touch = event.changedTouches[0];
	if (!touch || !touchState.value.isValidTap) {
		if (import.meta.dev && !touchState.value.isValidTap) {
			console.log('Touch end ignored - invalid tap state');
		}
		return;
	}

	const touchDuration = Date.now() - touchState.value.startTime;
	const touchDistance = Math.sqrt(
		Math.pow(touch.clientX - touchState.value.startPosition.x, 2) + Math.pow(touch.clientY - touchState.value.startPosition.y, 2)
	);

	// Validate touch: quick tap (< 500ms) with minimal movement (< 10px)
	const isValidTap = touchDuration < 500 && touchDistance < 10;

	// Log touch validation in development
	if (import.meta.dev) {
		console.log('Touch validation:', {
			duration: touchDuration,
			distance: touchDistance,
			isValid: isValidTap,
			threshold: { maxDuration: 500, maxDistance: 10 },
		});
	}

	if (isValidTap) {
		event.preventDefault();
		touchState.value.preventNextClick = true;

		// Prevent ghost clicks by temporarily ignoring click events
		setTimeout(() => {
			touchState.value.preventNextClick = false;
			if (import.meta.dev) {
				console.log('Ghost click prevention disabled');
			}
		}, 300);

		handleTriggerClick();
	}

	// Reset touch state
	touchState.value.isValidTap = false;
};

// Handle click outside to close
const handleClickOutside = (event: Event) => {
	if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
		isExpanded.value = false;
		isHovered.value = false;
	}
};

// Handle touch outside to close (for mobile)
const handleTouchOutside = (event: Event) => {
	const touchEvent = event as TouchEvent;
	const target = touchEvent.touches?.[0]?.target || touchEvent.target;
	if (containerRef.value && target && !containerRef.value.contains(target as Node)) {
		isExpanded.value = false;
		isHovered.value = false;
	}
};

// Load images and set up event listeners on mount
onMounted(() => {
	// Detect if this is a touch device
	detectTouchDevice();

	// Load initial images in background
	if (images.value.length === 0) {
		refetch().then(() => {
			// Images are loaded, no additional preloading needed with NuxtImg
			console.log('Cat images loaded successfully');
		});
	}

	// Add event listeners for closing on outside click/touch
	document.addEventListener('click', handleClickOutside);
	document.addEventListener('touchend', handleTouchOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
	document.removeEventListener('touchend', handleTouchOutside);

	// Reset touch state on unmount
	touchState.value = {
		startTime: 0,
		startPosition: { x: 0, y: 0 },
		isValidTap: false,
		preventNextClick: false,
	};
});
</script>

<style lang="scss" scoped>
// Styles are defined in the main SCSS architecture
// Using the .animated-sticker class from assets/styles/critical.scss
</style>

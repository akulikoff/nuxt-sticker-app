// Type definitions for the Nuxt Sticker App
// Using Vue's built-in types for better compatibility and type safety

import type { Ref } from 'vue';

// Cat Image Interface
export interface CatImage {
	id: string;
	url: string;
	timestamp: number;
}

// Sticker State Interface
export interface StickerState {
	isExpanded: boolean;
	isHovered: boolean;
	images: CatImage[];
	loading: boolean;
	error: string | null;
}

// Animation Configuration Interface
export interface AnimationConfig {
	duration: number;
	easing: string;
	stagger: number;
	transforms: {
		scale: number;
		translateX: number;
		translateY: number;
	};
}

// API Response Interface
export interface ApiResponse<T> {
	data: T;
	success: boolean;
	message?: string;
}

// API Query parameters interface
export interface CatImagesQuery {
	count?: string | number;
}

// API Response interface for cat images
export interface CatImagesResponse {
	success: boolean;
	data: CatImage[];
	count: number;
}

// Internal fetch result type
export type FetchResult = CatImage | null;

// Composable Return Types
export interface CatImagesComposable {
	images: Readonly<Ref<readonly CatImage[]>>;
	loading: Readonly<Ref<boolean>>;
	error: Readonly<Ref<string | null>>;
	refetch: () => Promise<void>;
}

// Internal cache entry type for composables
export interface CacheEntry {
	images: CatImage[];
	timestamp: number;
	ttl: number;
}

// Component Props Types
export interface StickerCardProps {
	image: CatImage;
	index: number;
	isVisible: boolean;
}

// Navigation Types
export interface NavigationItem {
	name: string;
	path: string;
	isActive?: boolean;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Error Types
export interface AppError {
	message: string;
	code?: number;
	timestamp: number;
}

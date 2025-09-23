// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	// Enable SSR and modern features
	ssr: true,

	// Modules for enhanced functionality
	modules: ['@nuxt/image'],

	// CSS Configuration - FOUC prevention strategy
	// Load critical styles first, then enhanced styles
	css: ['~/assets/styles/critical.scss', '~/assets/styles/main.scss'],

	// PostCSS configuration
	postcss: {
		plugins: {
			autoprefixer: {},
		},
	},

	typescript: {
		strict: true,
		typeCheck: true,
	},

	// App Configuration with FOUC prevention
	app: {
		head: {
			title: 'Nuxt Sticker App',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
				{
					name: 'description',
					content: 'Interactive animated sticker application built with Nuxt 4',
				},
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'preconnect', href: 'https://cataas.com', crossorigin: '' },
			],
			script: [
				{
					innerHTML: `
            // Minimal FOUC and CLS prevention
            if (document.documentElement) {
              document.documentElement.style.fontSize = '16px';
              document.documentElement.style.boxSizing = 'border-box';
              document.documentElement.style.overflowX = 'hidden';
            }
          `,
				},
			],
		},
	},

	// Runtime Configuration
	runtimeConfig: {
		public: {
			apiBase: 'https://cataas.com',
		},
	},

	// Image optimization configuration
	image: {
		// Configure image formats - prioritize JPEG for faster loading
		format: ['jpeg', 'webp', 'png'],

		// Set default quality for faster loading
		quality: 85,

		// Enable lazy loading by default for better performance
		loading: 'lazy',

		// Use none provider for direct image loading (faster)
		provider: 'none',

		// Disable densities for faster loading
		densities: [1],

		// Disable placeholder for faster initial load
		placeholder: false,

		// Simplified presets for faster processing
		presets: {
			sticker: {
				modifiers: {
					format: 'jpeg',
					quality: 85,
					width: 120,
					height: 120,
					fit: 'cover',
				},
			},
		},
	},

	// Build optimizations with enhanced Nitro configuration
	nitro: {
		preset: 'node-server',
		prerender: {
			routes: ['/'],
			crawlLinks: true,
		},
		// Enable compression
		compressPublicAssets: true,
		// Enable minification
		minify: true,
		// Enable advanced optimizations
		experimental: {
			wasm: true,
		},
		// Route rules for better caching
		routeRules: {
			'/': {
				headers: {
					'Cache-Control': 's-maxage=31536000',
				},
			},
			'/_nuxt/**': {
				headers: {
					'Cache-Control': 'public, max-age=31536000, immutable',
				},
			},
			'/images/**': {
				headers: {
					'Cache-Control': 'public, max-age=31536000, immutable',
				},
			},
			'/api/**': {
				cors: true,
				headers: {
					'Cache-Control': 'max-age=300',
				},
			},
		},
	},

	// Experimental features for Nuxt 4
	experimental: {
		// Disable payload extraction; can add extra payload processing on mobile
		payloadExtraction: false,
		// Keep islands/view transitions disabled to reduce JS
		componentIslands: false,
		viewTransition: false,
	},

	// Vite build optimization with enhanced chunking
	vite: {
		build: {
			rollupOptions: {
				output: {},
			},
			chunkSizeWarningLimit: 500, // 500kb limit
			cssCodeSplit: true,
			// Enable minification
			minify: 'terser',
			// Terser options for better compression
			terserOptions: {
				compress: {
					drop_console: true, // Remove console.log in production
					drop_debugger: true,
				},
			},
		},

		// Disable CSS sourcemaps to reduce CSS bytes in production
		css: {
			devSourcemap: false,
		},
	},
});

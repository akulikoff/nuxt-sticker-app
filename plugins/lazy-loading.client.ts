/**
 * Client-side lazy loading plugin
 * Implements intersection observer for enhanced performance
 */

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		// Initialize intersection observer for lazy loading
		const initLazyLoading = () => {
			const imageObserver = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							const img = entry.target as HTMLImageElement;
							if (img.dataset.src) {
								img.src = img.dataset.src;
								img.classList.remove('lazy-loading');
								img.classList.add('lazy-loaded');
								imageObserver.unobserve(img);
							}
						}
					});
				},
				{
					rootMargin: '50px 0px',
					threshold: 0.1,
				}
			);

			// Observe all images with lazy loading
			const lazyImages = document.querySelectorAll('img[data-src]');
			lazyImages.forEach(img => imageObserver.observe(img));

			// Component lazy loading observer
			const componentObserver = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							const element = entry.target as HTMLElement;
							if (element.dataset.component) {
								// Trigger component loading
								element.classList.add('component-visible');
								componentObserver.unobserve(element);
							}
						}
					});
				},
				{
					rootMargin: '100px 0px',
					threshold: 0.05,
				}
			);

			// Observe components with lazy loading
			const lazyComponents = document.querySelectorAll('[data-component]');
			lazyComponents.forEach(component => componentObserver.observe(component));
		};

		// Initialize on DOM ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initLazyLoading);
		} else {
			initLazyLoading();
		}

		// Re-initialize on route changes for SPA navigation
		useRouter().afterEach(() => {
			nextTick(() => {
				initLazyLoading();
			});
		});
	}
});

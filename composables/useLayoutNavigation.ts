import { computed } from 'vue';
import { useRoute } from '#app';

export function useLayoutNavigation() {
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Sticker Demo', path: '/sticker' },
  ] as const;

  const route = useRoute();

  const currentPageTitle = computed(() => {
    const currentItem = navigationItems.find(item => item.path === route.path);
    return currentItem?.name || 'Page';
  });

  const skipToMainContent = (event: Event) => {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    navigationItems,
    route,
    currentPageTitle,
    skipToMainContent,
  };
}

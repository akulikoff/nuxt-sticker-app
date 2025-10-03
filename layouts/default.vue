<template>
  <div class="app-layout">
    <!-- Navigation with enhanced accessibility -->
    <nav
      class="navigation"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="navigation__container">
        <div class="navigation__content">
          <!-- Logo with proper heading -->
          <NuxtLink
            to="/"
            class="navigation__logo"
            aria-label="Nuxt Sticker - Go to homepage"
          >
            <h1 class="navigation__logo-text">Nuxt Sticker</h1>
          </NuxtLink>

          <!-- Desktop Menu with skip link -->
          <a
            href="#main-content"
            class="skip-link"
            @click="skipToMainContent"
          >
            Skip to main content
          </a>

          <ul
            class="navigation__menu"
            role="menubar"
            ref="menuRef"
            @keydown="handleKeyNavigation"
            @focusin="onMenuFocus"
            @focusout="onMenuBlur"
          >
            <li
              v-for="(item, index) in navigationItems"
              :key="item.path"
              role="none"
            >
              <NuxtLink
                :to="item.path"
                class="navigation__link"
                :class="{ 'navigation__link--active': route.path === item.path }"
                role="menuitem"
                :aria-current="route.path === item.path ? 'page' : undefined"
                @focus="onItemFocus(index)"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content with proper landmarks -->
    <main
      id="main-content"
      class="main-content"
      role="main"
      :aria-label="`${currentPageTitle} - Main content`"
      tabindex="-1"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const menuRef = ref<HTMLElement | null>(null);
const isMenuFocused = ref(false);
const focusedIndex = ref(-1);

const { navigationItems, route, currentPageTitle, skipToMainContent } = useLayoutNavigation();

// Обработчик фокуса меню
const onMenuFocus = () => {
  isMenuFocused.value = true;
  // Устанавливаем фокус на первый элемент, если ни один не активен
  if (focusedIndex.value === -1) {
    focusedIndex.value = 0;
    updateFocus();
  }
};

const onMenuBlur = () => {
  isMenuFocused.value = false;
};

const onItemFocus = (index: number) => {
  focusedIndex.value = index;
};

// Улучшенная навигация клавишами
const handleKeyNavigation = (event: KeyboardEvent) => {
  if (!isMenuFocused.value) return;

  const items = menuRef.value?.querySelectorAll('[role="menuitem"]') || [];
  const currentIndex = focusedIndex.value;
  const totalItems = items.length;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      focusedIndex.value = (currentIndex + 1) % totalItems;
      updateFocus();
      break;

    case 'ArrowLeft':
      event.preventDefault();
      focusedIndex.value = (currentIndex - 1 + totalItems) % totalItems;
      updateFocus();
      break;

    case 'Home':
      event.preventDefault();
      focusedIndex.value = 0;
      updateFocus();
      break;

    case 'End':
      event.preventDefault();
      focusedIndex.value = totalItems - 1;
      updateFocus();
      break;

    case 'Enter':
    case ' ':
      event.preventDefault();
      const currentItem = items[currentIndex] as HTMLAnchorElement;
      if (currentItem) {
        currentItem.click();
      }
      break;
  }
};

// Обновление фокуса на элементе
const updateFocus = () => {
  nextTick(() => {
    const items = menuRef.value?.querySelectorAll('[role="menuitem"]') || [];
    const targetItem = items[focusedIndex.value] as HTMLElement;
    if (targetItem) {
      targetItem.focus();
    }
  });
};
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;

  &:focus {
    outline: none;
  }
}

.navigation__logo-text {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

// Skip link for accessibility
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1100;
  transition: top 0.3s;

  &:focus {
    top: 6px;
  }
}

// Enhanced menu accessibility
.navigation__menu {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
}

.navigation__menu:focus {
  outline: none;
}

// Desktop navigation: use background highlight instead of outline (match mobile)
.navigation__link {
  display: inline-block;
  padding: 8px 12px;
  outline: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
}

.navigation__link:focus-visible,
.navigation__link:hover,
.navigation__link--active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .navigation__menu {
    flex-direction: column;
  }
}
</style>

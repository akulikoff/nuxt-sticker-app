<template>
  <div
    ref="containerRef"
    class="animated-sticker"
    :class="{ 'animated-sticker--is-hovered': isExpanded }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleTriggerClick"
  >
    <div class="animated-sticker__title">Консультация эксперта</div>
    <div class="animated-sticker__image">
      <div
        v-for="(image, index) in typedImages.slice(0, 3)"
        :key="image.id"
        class="animated-sticker__image-photo"
      >
        <NuxtImg
          :src="image.url"
          alt="фото эксперта"
        />
      </div>
    </div>
    <svg
      class="animated-sticker__icon"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.82506 9.00006L9.42506 14.6001L8.00006 16.0001L6.10352e-05 8.00006L8.00006 6.10352e-05L9.42506 1.40006L3.82506 7.00006H16.0001V9.00006H3.82506Z"
        fill="currentColor"
      />
    </svg>

    <button
      class="animated-sticker__action"
      type="button"
      :aria-expanded="isExpanded"
      @click.stop
    >
      <span class="app-button__label">
        <span class="app-button__text">Получить консультацию</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CatImage } from '~/types';
import { useCatImages } from '~/composables/useCatImages';
const { images, loading, refetch } = useCatImages();
const isExpanded = ref(false);
const containerRef = ref<HTMLElement>();
const typedImages = computed<CatImage[]>(() => [...images.value]);
const hasUserInteracted = ref(false); // был ли клик или тач?

const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  if (isExpanded.value && containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isExpanded.value = false;
    hasUserInteracted.value = true;
  }
};
const maybeRefetchImages = () => {
  if (images.value.length === 0 && !loading.value) {
    refetch();
  }
};

const handleMouseEnter = () => {
  // Ховер работает ТОЛЬКО если пользователь ещё не взаимодействовал (десктоп)
  if (!hasUserInteracted.value) {
    isExpanded.value = true;
    maybeRefetchImages();
  }
};

const handleMouseLeave = () => {
  if (!hasUserInteracted.value) {
    isExpanded.value = false;
  }
};

const handleTriggerClick = (e: MouseEvent) => {
  // Предотвращаем конфликт с ховером на десктопе
  e.stopPropagation();
  e.preventDefault();

  hasUserInteracted.value = true;
  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    maybeRefetchImages();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('touchstart', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.animated-sticker {
  height: 16.625rem;
  display: flex;
  padding-top: 0.1rem;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  background-color: var(--hover-gray);
  border-bottom-left-radius: 1.4rem;
  border-top-left-radius: 1.4rem;
  box-shadow: 0 0.4rem 2rem rgba(var(--default-shadow-rgba));
  cursor: pointer;
  transition: width 0.4s ease-in-out;
  width: 4.25rem;
  transform: translateY(-50%);
  will-change: transform;

  // Элементы
  &__title {
    // В свернутом состоянии заголовок скрыт
    max-width: 8rem;
    opacity: 0;
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    font-size: 23px;
    font-weight: 600;
    line-height: 1.3;
    text-align: center;
    white-space: nowrap;
    transition: width 0.3s ease-in-out;
  }

  &__image {
    transition: 0.2s ease-in-out;

    &-photo {
      outline: 0.3rem solid var(--hover-gray);
      border-radius: 1rem;
      height: 4rem;
      width: 4rem;

      &:nth-child(2) {
        transform: translateY(-1.5rem);
      }

      &:nth-child(3) {
        transform: translateY(-3rem);
      }

      img {
        border-radius: 1rem;
        height: 100%;
        object-fit: cover;
        width: 100%;
        transition: 0.3s ease-in-out;
      }
    }
  }

  &__icon {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
    width: 16px;
    height: 16px;
  }

  &__action {
    bottom: -5rem;
    position: absolute;
    border: 0.1rem solid transparent;
    box-shadow: 0 0.4rem 2rem rgba(var(--default-shadow-rgba));
    transition:
      box-shadow 0.3s ease,
      -webkit-box-shadow 0.3s ease;
    pointer-events: none;
  }

  // Модификаторы
  &--is-hovered {
    width: 16.625rem;
    padding-top: 1.5rem;
    padding-bottom: 6rem; // Место для кнопки

    .animated-sticker__icon {
      opacity: 0; // Скрываем иконку в развернутом состоянии
      pointer-events: none;
    }

    .animated-sticker__title {
      opacity: 1;
      max-width: 10rem;
      max-height: 2rem;
      margin-bottom: 1.5rem;
      visibility: visible;
      white-space: normal;
      font-size: 23px;
    }

    .animated-sticker__image {
      // display: block;
      height: 5rem;
      // margin-top: 1.5rem;
      // margin-bottom: 0;
      margin-left: 7rem;
      transform: rotate(90deg);
    }

    .animated-sticker__image-photo {
      display: block;
      position: relative;

      &:nth-child(2) {
        transform: translateY(0);
      }

      &:nth-child(3) {
        transform: translateY(0);
      }

      img {
        transform: rotate(-90deg);
      }
    }

    .animated-sticker__action {
      background-color: var(--background-color);
      padding: 0.8rem 1.6rem;
      bottom: 2rem;
      border-radius: var(--border-radius-sm);
      opacity: 1;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: auto;
      white-space: nowrap;
    }
  }
}
</style>

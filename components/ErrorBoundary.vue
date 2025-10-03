<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    <div
      v-else
      class="error-boundary__content"
    >
      <div class="error-boundary__icon">
        <svg
          width="48"
          height="48"
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
      </div>
      <h3 class="error-boundary__title">{{ errorTitle }}</h3>
      <p class="error-boundary__message">{{ errorMessage }}</p>
      <div class="error-boundary__actions">
        <button
          @click="handleRetry"
          class="error-boundary__button error-boundary__button--primary"
          :disabled="retrying"
        >
          <span v-if="retrying">Retrying...</span>
          <span v-else>Try Again</span>
        </button>
        <button
          @click="handleReload"
          class="error-boundary__button error-boundary__button--secondary"
        >
          Reload Page
        </button>
      </div>
      <details
        v-if="showDetails && errorDetails"
        class="error-boundary__details"
      >
        <summary>Technical Details</summary>
        <pre class="error-boundary__stack">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppError } from '~/types';

interface Props {
  fallback?: string;
  showDetails?: boolean;
  onRetry?: () => Promise<void> | void;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Something went wrong',
  showDetails: false,
  onRetry: undefined,
});

// Component state
const hasError = ref(false);
const errorTitle = ref('Oops! Something went wrong');
const errorMessage = ref(props.fallback);
const errorDetails = ref<string>('');
const retrying = ref(false);

// Handle different types of errors
const handleError = (error: Error | AppError | unknown) => {
  hasError.value = true;

  if (error instanceof Error) {
    errorMessage.value = error.message || props.fallback;
    errorDetails.value = error.stack || error.toString();
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    const appError = error as AppError;
    errorMessage.value = appError.message || props.fallback;
    errorDetails.value = `Error Code: ${appError.code || 'Unknown'}\nTimestamp: ${new Date(appError.timestamp || Date.now()).toISOString()}`;
  } else {
    errorMessage.value = props.fallback;
    errorDetails.value = String(error);
  }

  // Log error for debugging
  console.error('Error caught by ErrorBoundary:', error);
};

// Reset error state
const resetError = () => {
  hasError.value = false;
  errorMessage.value = props.fallback;
  errorDetails.value = '';
  retrying.value = false;
};

// Handle retry action
const handleRetry = async () => {
  if (props.onRetry) {
    retrying.value = true;
    try {
      await props.onRetry();
      resetError();
    } catch (error) {
      handleError(error);
    } finally {
      retrying.value = false;
    }
  } else {
    resetError();
  }
};

// Handle page reload
const handleReload = () => {
  window.location.reload();
};

// Vue error handling
onErrorCaptured((error: Error) => {
  handleError(error);
  return false; // Prevent error from propagating
});

// Global error handling for unhandled promise rejections
if (import.meta.client) {
  window.addEventListener('unhandledrejection', event => {
    handleError(event.reason);
    event.preventDefault();
  });
}

// Expose methods for parent components
defineExpose({
  handleError,
  resetError,
  hasError: readonly(hasError),
});
</script>

<style lang="scss" scoped>
.error-boundary {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    text-align: center;
    min-height: 200px;
    background-color: var(--background-color);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  &__icon {
    color: #ef4444;
    margin-bottom: var(--spacing-lg);
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }

  &__message {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xl);
    max-width: 400px;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  &__button {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--animation-duration-normal);
    border: none;

    &--primary {
      background-color: var(--primary-color);
      color: white;

      &:hover:not(:disabled) {
        background-color: #1e40af;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--secondary {
      background-color: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--text-muted);

      &:hover {
        background-color: var(--background-color);
        border-color: var(--text-secondary);
      }
    }
  }

  &__details {
    max-width: 500px;
    text-align: left;

    summary {
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: var(--spacing-sm);

      &:hover {
        color: var(--text-primary);
      }
    }
  }

  &__stack {
    background-color: var(--background-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
    color: var(--text-secondary);
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>

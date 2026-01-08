import { ref, readonly, onMounted, onBeforeUnmount } from 'vue';

/**
 * Composable for monitoring network connectivity status.
 * Tracks online/offline state and provides callbacks for status changes.
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onOnline - Callback when network is restored
 * @param {Function} options.onOffline - Callback when network is lost
 * @returns {Object} Object with isOnline ref and wasOffline flag
 */
export function useNetworkStatus(options = {}) {
  const { onOnline, onOffline } = options;

  const isOnline = ref(navigator.onLine);
  const wasOffline = ref(false);

  function handleOnline() {
    console.log('[NetworkStatus] Network connection restored');
    isOnline.value = true;

    if (wasOffline.value && onOnline) {
      console.log('[NetworkStatus] Triggering recovery callback');
      onOnline();
    }
  }

  function handleOffline() {
    console.log('[NetworkStatus] Network connection lost');
    isOnline.value = false;
    wasOffline.value = true;

    if (onOffline) {
      onOffline();
    }
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Log initial state
    console.log('[NetworkStatus] Initial state:', isOnline.value ? 'online' : 'offline');
  });

  onBeforeUnmount(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline: readonly(isOnline),
    wasOffline: readonly(wasOffline)
  };
}

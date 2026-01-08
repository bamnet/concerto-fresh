import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Composable for managing the Screen Wake Lock API.
 * Prevents the screen from dimming or locking on digital signage displays.
 *
 * The wake lock is automatically requested on mount and released on unmount.
 * It also handles visibility changes (re-acquires lock when page becomes visible).
 *
 * @returns {Object} Object with isSupported, isActive, and error refs
 */
export function useWakeLock() {
  const isSupported = ref('wakeLock' in navigator);
  const isActive = ref(false);
  const error = ref(null);

  let wakeLock = null;

  /**
   * Request a screen wake lock.
   * Will silently fail if not supported or already active.
   */
  async function request() {
    if (!isSupported.value) {
      console.log('[WakeLock] API not supported in this browser');
      return;
    }

    if (wakeLock !== null) {
      // Already have an active wake lock
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen');
      isActive.value = true;
      error.value = null;

      console.log('[WakeLock] Screen wake lock acquired');

      // Listen for the wake lock being released (e.g., by the system)
      wakeLock.addEventListener('release', () => {
        console.log('[WakeLock] Screen wake lock released');
        isActive.value = false;
        wakeLock = null;
      });
    } catch (err) {
      error.value = err;
      isActive.value = false;
      console.error('[WakeLock] Failed to acquire wake lock:', err.message);
    }
  }

  /**
   * Release the current wake lock.
   */
  async function release() {
    if (wakeLock !== null) {
      try {
        await wakeLock.release();
        wakeLock = null;
        isActive.value = false;
        console.log('[WakeLock] Wake lock manually released');
      } catch (err) {
        console.error('[WakeLock] Error releasing wake lock:', err);
      }
    }
  }

  /**
   * Handle visibility change events.
   * Re-acquire wake lock when page becomes visible again.
   */
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      console.log('[WakeLock] Page visible, re-acquiring wake lock');
      request();
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    // Request wake lock immediately
    request();

    // Re-acquire wake lock when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    release();
  });

  return {
    isSupported,
    isActive,
    error,
    request,
    release
  };
}

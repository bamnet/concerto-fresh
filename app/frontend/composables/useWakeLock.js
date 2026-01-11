import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable for managing Screen Wake Lock API to prevent display sleep.
 * Automatically handles visibility changes and releases/reacquires the lock
 * when the page becomes hidden/visible.
 *
 * The Screen Wake Lock API prevents the screen from dimming or locking when
 * the application is idle, which is essential for digital signage displays.
 *
 * @returns {Object} Object with isSupported and isActive refs
 */
export function useWakeLock() {
  const isSupported = ref(false);
  const isActive = ref(false);
  let wakeLock = null;

  /**
   * Requests a screen wake lock from the browser.
   * @returns {Promise<void>}
   */
  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen');
      isActive.value = true;
      console.log('[WakeLock] Screen wake lock acquired');

      // Listen for wake lock release (can happen if tab becomes inactive)
      wakeLock.addEventListener('release', () => {
        console.log('[WakeLock] Screen wake lock released');
        isActive.value = false;
      });
    } catch (err) {
      console.error('[WakeLock] Failed to acquire wake lock:', err);
      isActive.value = false;
    }
  };

  /**
   * Releases the current wake lock if one exists.
   * @returns {Promise<void>}
   */
  const releaseWakeLock = async () => {
    if (wakeLock !== null) {
      try {
        await wakeLock.release();
        wakeLock = null;
        isActive.value = false;
      } catch (err) {
        console.error('[WakeLock] Failed to release wake lock:', err);
      }
    }
  };

  /**
   * Handles visibility change events.
   * Reacquires the wake lock when the page becomes visible again.
   */
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  };

  // Initialize wake lock on mount
  onMounted(async () => {
    // Check if Wake Lock API is supported
    if ('wakeLock' in navigator) {
      isSupported.value = true;
      await requestWakeLock();

      // Re-acquire wake lock when page becomes visible
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      console.warn('[WakeLock] Screen Wake Lock API is not supported in this browser');
    }
  });

  // Clean up on unmount
  onUnmounted(async () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    await releaseWakeLock();
  });

  return {
    isSupported,
    isActive,
  };
}

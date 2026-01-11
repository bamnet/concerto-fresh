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
  let isRequesting = false;

  /**
   * Handler for wake lock release events.
   */
  const handleRelease = () => {
    console.log('[WakeLock] Screen wake lock released');
    isActive.value = false;
    wakeLock = null;
  };

  /**
   * Requests a screen wake lock from the browser.
   * Prevents overlapping requests to avoid race conditions.
   * @returns {Promise<void>}
   */
  const requestWakeLock = async () => {
    // Prevent overlapping requests
    if (isRequesting || wakeLock !== null) {
      return;
    }

    isRequesting = true;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      isActive.value = true;
      console.log('[WakeLock] Screen wake lock acquired');

      // Listen for wake lock release (can happen if tab becomes inactive)
      wakeLock.addEventListener('release', handleRelease);
    } catch (err) {
      console.error('[WakeLock] Failed to acquire wake lock:', err);
      isActive.value = false;
      wakeLock = null;
    } finally {
      isRequesting = false;
    }
  };

  /**
   * Releases the current wake lock if one exists.
   * @returns {Promise<void>}
   */
  const releaseWakeLock = async () => {
    if (wakeLock !== null) {
      // Remove event listener to prevent memory leak
      wakeLock.removeEventListener('release', handleRelease);

      try {
        await wakeLock.release();
      } catch (err) {
        console.error('[WakeLock] Failed to release wake lock:', err);
      } finally {
        // Ensure state is reset even if release fails
        wakeLock = null;
        isActive.value = false;
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

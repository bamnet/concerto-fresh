/**
 * Fetch with timeout support using AbortController.
 * Prevents fetch calls from hanging indefinitely on flaky networks.
 *
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} options.timeout - Timeout in milliseconds (default: 30000)
 * @param {Object} options.fetchOptions - Additional fetch options
 * @returns {Promise<Response>} The fetch response
 * @throws {Error} Throws if request times out or fails
 */
export async function fetchWithTimeout(url, { timeout = 30000, ...fetchOptions } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Default timeout values for different request types.
 */
export const TIMEOUTS = {
  API: 30000,      // 30 seconds for API requests
  MEDIA: 60000,    // 60 seconds for media (images, videos)
  CONFIG: 15000    // 15 seconds for configuration requests
};

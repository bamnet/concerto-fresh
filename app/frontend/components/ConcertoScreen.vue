<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ConcertoField from './ConcertoField.vue'
import { useConfigVersion } from '../composables/useConfigVersion.js'
import { useWakeLock } from '../composables/useWakeLock.js'
import { useNetworkStatus } from '../composables/useNetworkStatus.js'
import { fetchWithTimeout, TIMEOUTS } from '../utils/fetchWithTimeout.js'

// Retry configuration
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 10000;
const LONG_RETRY_DELAY_MS = 60000;

const props = defineProps({
  apiUrl: {type: String, required: true}
});

const backgroundImage = ref("");
const positions = ref([]);
let loadConfigRetryTimer = null;

// Track config version to detect changes
const { check: checkConfigVersion } = useConfigVersion('Screen');

// Prevent screen from sleeping on digital signage displays
useWakeLock();

// Monitor network connectivity and trigger refresh when connection is restored
const { isOnline } = useNetworkStatus({
  onOnline: () => {
    console.log('[Screen] Network restored, refreshing configuration');
    // Clear any pending retry and refresh immediately
    clearTimeout(loadConfigRetryTimer);
    loadConfig(0);
  },
  onOffline: () => {
    console.log('[Screen] Network lost, will use cached content');
  }
});

const backgroundImageStyle = computed(() => {
  return backgroundImage.value ? `url(${backgroundImage.value})` : 'none';
});

async function loadConfig(retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);

  // Skip fetch attempts if we know we're offline (service worker will handle cached responses)
  if (!isOnline.value && retryCount > 0) {
    console.debug('[Screen] Offline, delaying retry');
    loadConfigRetryTimer = setTimeout(() => loadConfig(retryCount), LONG_RETRY_DELAY_MS);
    return;
  }

  try {
    const resp = await fetchWithTimeout(props.apiUrl, { timeout: TIMEOUTS.CONFIG });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    // Check for config version changes and reload if needed
    if (checkConfigVersion(resp)) {
      return; // Stop processing since page is reloading
    }

    const screen = await resp.json();
    backgroundImage.value = screen.template.background_uri;
    positions.value = screen.positions;
  } catch (error) {
    console.error(`Failed to load screen configuration (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);

    if (retryCount < maxRetries) {
      console.debug(`Retrying in ${retryDelay}ms...`);
      loadConfigRetryTimer = setTimeout(() => loadConfig(retryCount + 1), retryDelay);
    } else {
      console.error('Max retries reached. Screen configuration loading failed.');
      // Schedule another attempt after a longer delay
      loadConfigRetryTimer = setTimeout(() => loadConfig(0), LONG_RETRY_DELAY_MS);
    }
  }
}

// lifecycle hooks
onMounted(() => {
  loadConfig();
})

onBeforeUnmount(() => {
  clearTimeout(loadConfigRetryTimer);
  loadConfigRetryTimer = null;
})
</script>

<template>
  <div class="screen">
    <ConcertoField
      v-for="position in positions"
      :key="position.id"
      :api-url="position.content_uri"
      :field-style="position.style"
      :is-online="isOnline"
      :style="{
        top: (100 * position.top).toFixed(2) + '%',
        left: (100 * position.left).toFixed(2) + '%',
        height: (100 * (position.bottom-position.top)).toFixed(2) + '%',
        width: (100 * (position.right-position.left)).toFixed(2) + '%',
      }"
    />
    <div id="background" />
  </div>
</template>

<style scoped>
  .screen {
    height: 100%;
    width: 100%;
    overflow: hidden;
    /* cursor: none; */
  }

  #background {
    height: 100%;
    width: 100%;
    background-image: v-bind('backgroundImageStyle');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>

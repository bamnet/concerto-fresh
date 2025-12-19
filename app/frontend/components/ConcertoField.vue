<script setup>
import { onMounted, onBeforeUnmount, ref, shallowRef, computed, nextTick } from 'vue'

import ConcertoGraphic from './ConcertoGraphic.vue';
import ConcertoRichText from './ConcertoRichText.vue';
import ConcertoVideo from './ConcertoVideo.vue';

// Content is shown for 10 seconds if it does not have it's own duration.
const defaultDuration = 10;

// Disable any timers used to advance content.
// This is helpful when debugging when you need to "freeze" the frontend.
const disableTimer = false;

// Show debug border only in development mode
const isDevelopment = import.meta.env.DEV;

// Retry configuration
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 10000;
const LONG_RETRY_DELAY_MS = 60000;

const contentTypeMap = new Map([
  ["Graphic", ConcertoGraphic],
  ["RichText", ConcertoRichText],
  ["Video", ConcertoVideo]
]);

const props = defineProps({
  /**
   * API endpoint which will load content for this field.
   *
   * This typically looks like /frontend/screens/:screen_id/fields/:field_id/content.json.
   */
  apiUrl: {type: String, required: true},

  /**
   * CSS style to be applied to the field.
   *
   * This is often used to set font family and color to align with the template.
   */
  fieldStyle: {type: String, required: false, default: ''},
});

const currentContent = shallowRef(null);
const currentContentConfig = ref({});

// Used for manual fade-through transitions when recycling components (like Video).
const manualTransitionVisible = ref(true);

const contentKey = computed(() => {
  // Reuse the video component to avoid destroying/recreating iframes (expensive).
  if (currentContentConfig.value?.type === 'Video') {
    return 'persistent-video-player';
  }
  return currentContentConfig.value?.id;
});

const contentQueue = [];
let nextContentTimer = null;
let loadContentRetryTimer = null;

async function loadContent(retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);

  try {
    const resp = await fetch(props.apiUrl);

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const contents = await resp.json();
    contentQueue.push(...contents);

    if (contentQueue.length > 0) {
      showNextContent();
    }
  } catch (error) {
    console.error(`Failed to load content (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);

    if (retryCount < maxRetries) {
      console.debug(`Retrying in ${retryDelay}ms...`);
      loadContentRetryTimer = setTimeout(() => loadContent(retryCount + 1), retryDelay);
    } else {
      console.error('Max retries reached. Content loading failed.');
      // Schedule another attempt after a longer delay
      loadContentRetryTimer = setTimeout(() => loadContent(0), LONG_RETRY_DELAY_MS);
    }
  }
}

async function showNextContent() {
  clearTimeout(nextContentTimer);

  const nextContent = contentQueue.shift();
  if (!nextContent) {
    next(); // Should trigger loadContent via next() logic
    return;
  }

  const nextContentType = contentTypeMap.get(nextContent.type);
  if (!nextContentType) {
    console.error(`Unknown content type: ${nextContent.type}`);
    next();
    return;
  }

  // Check if we are transitioning between two Videos (reused component).
  const isVideoToVideo = (currentContentConfig.value?.type === 'Video' && nextContent.type === 'Video');

  if (isVideoToVideo) {
    // Perform manual "Fade-Through" transition.
    // 1. Fade out
    manualTransitionVisible.value = false;
    
    // Wait for fade out to complete (500ms matches CSS transition)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 2. Swap content while hidden
    currentContent.value = nextContentType;
    currentContentConfig.value = nextContent;

    // Small delay to allow component to update props
    await nextTick();
    
    // 3. Fade in
    manualTransitionVisible.value = true;
  } else {
    // Normal transition (Vue <Transition> handles it)
    currentContent.value = nextContentType;
    currentContentConfig.value = nextContent;
    manualTransitionVisible.value = true; // Ensure visible
  }
  
  const duration = (nextContent?.duration || defaultDuration) * 1000;
  if (!disableTimer) {
    nextContentTimer = setTimeout(next, duration);
  } else {
    console.debug(`Timer disabled, but would have waited ${duration}.`)
  }
}

function next() {
  if (contentQueue.length > 0) {
    showNextContent();
  } else {
    loadContent();
  }
}

// The content has requested control of the next content timer.
// This is useful for content that has a timer of its own, such as video.
function delegateTimerToContent() {
  console.debug('Delegating timer to content');
  clearTimeout(nextContentTimer);
  nextContentTimer = null;
}

// lifecycle hooks
onMounted(() => {
  loadContent();
})

onBeforeUnmount(() => {
  clearTimeout(nextContentTimer);
  nextContentTimer = null;
  clearTimeout(loadContentRetryTimer);
  loadContentRetryTimer = null;
})
</script>

<template>
  <div
    class="field"
    :class="{ 'dev-border': isDevelopment }"
    :style="fieldStyle"
  >
    <Transition>
      <div
        class="content-wrapper"
        :class="{ 'faded-out': !manualTransitionVisible }"
      >
        <component
          :is="currentContent"
          :key="contentKey"
          :content="currentContentConfig"
          @click="next"
          @take-over-timer="delegateTimerToContent"
          @next="next"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .field {
    position: absolute;
    box-sizing: border-box;
  }

  .dev-border {
    border: 1px dashed yellow;
  }

  .content-wrapper {
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease;
    opacity: 1;
  }

  .content-wrapper.faded-out {
    opacity: 0;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
    position: absolute;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
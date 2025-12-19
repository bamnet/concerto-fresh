<script setup>
import { ref, onMounted, computed } from 'vue'
import ConcertoField from './ConcertoField.vue'

const props = defineProps({
  apiUrl: {type: String, required: true}
});

const backgroundImage = ref("");
const positions = ref([]);

const backgroundImageStyle = computed(() => {
  return `url(${backgroundImage.value})`;
});

async function loadConfig(retryCount = 0) {
  const maxRetries = 3;
  const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s

  try {
    const resp = await fetch(props.apiUrl);

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const screen = await resp.json();
    backgroundImage.value = screen.template.background_uri;
    positions.value = screen.positions;
  } catch (error) {
    console.error(`Failed to load screen configuration (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);

    if (retryCount < maxRetries) {
      console.debug(`Retrying in ${retryDelay}ms...`);
      setTimeout(() => loadConfig(retryCount + 1), retryDelay);
    } else {
      console.error('Max retries reached. Screen configuration loading failed.');
      // Schedule another attempt after a longer delay
      setTimeout(() => loadConfig(0), 60000); // Retry after 1 minute
    }
  }
}

// lifecycle hooks
onMounted(() => {
  loadConfig();
})
</script>

<template>
  <div class="screen">
    <ConcertoField
      v-for="position in positions"
      :key="position.id"
      :api-url="position.content_uri"
      :field-style="position.style"
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
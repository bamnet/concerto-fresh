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

async function loadConfig() {
  const resp = await fetch(props.apiUrl);
  const screen = await resp.json();
  backgroundImage.value = screen.template.background_uri;

  positions.value = [];

  screen.positions.forEach(position => {
    positions.value.push(position);
  });
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
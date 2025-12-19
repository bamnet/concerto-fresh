<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  content: { type: Object, required: true }
});

const hasDuration = computed(() => {
  return props.content.duration && props.content.duration > 0;
});

const emit = defineEmits(['takeOverTimer', 'next'])

const videoUrl = computed(() => {
  return `https://www.youtube-nocookie.com/embed/${props.content.video_id}?rel=0&iv_load_policy=3&autoplay=1&controls=0&playsinline=1&mute=1&enablejsapi=1`;
})

const playerRef = ref(null);
let player = null;

function isYTAPILoaded() {
  /* global YT */
  return (window.YT && window.YT.Player);
}

async function loadYTAPI() {
  return new Promise((resolve) => {
    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) {
      // Script exists but API might still be loading
      // Wait for it to be ready
      const checkReady = setInterval(() => {
        if (isYTAPILoaded()) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      console.debug('YouTube Iframe API loaded');
      resolve();
      // Clean up the global function after it's called
      delete window.onYouTubeIframeAPIReady;
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
}

function onPlayerStateChange(event) {
  switch (event.data) {
  case YT.PlayerState.PLAYING:
    console.debug('Video is playing');
    if (!hasDuration.value) {
      emit('takeOverTimer', {});
    } else {
      console.debug('Video has a duration, not taking over timer');
    }
    break;
  case YT.PlayerState.PAUSED:
    console.debug('Video is paused');
    break;
  case YT.PlayerState.ENDED:
    console.debug('Video has ended');
    if (!hasDuration.value) {
      emit('next', {});
    }
    break;
  default:
    console.debug('Video state changed:', event.data);
  }
}

onMounted(async () => {
  if (!isYTAPILoaded()) {
    await loadYTAPI();
  }

  player = new YT.Player(playerRef.value, {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
})

onBeforeUnmount(() => {
  if (player && typeof player.destroy === 'function') {
    player.destroy();
    player = null;
  }
})
</script>

<template>
  <iframe
    ref="playerRef"
    class="player"
    type="text/html"
    frameborder="0"
    allow="autoplay"
    :src="videoUrl"
  />
</template>

<style scoped>
.player {
  height: 100%;
  width: 100%;
}
</style>

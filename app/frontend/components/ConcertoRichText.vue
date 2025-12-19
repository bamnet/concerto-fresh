<script setup>
import { onMounted, ref } from 'vue'


/**
 * @typedef {object} RichTextContent
 * @property {string} render_as - The format of the text, either 'plaintext' or 'html'.
 * @property {string} text - The actual text content to be rendered. May be plain text or HTML.
 */

const props = defineProps({
  /** @type {RichTextContent} */
  content: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['plaintext', 'html'].includes(value.render_as) && typeof value.text === 'string';
    },
  },
});

// A container stretched to fill the entire field.
const container = ref();
// The main div which holds the text.
const child = ref();

async function resizeText() {
  const containerElement = container.value;
  const contentElement = child.value;

  const fieldHeight = containerElement.offsetHeight;
  const initialHeight = contentElement.scrollHeight;

  if (initialHeight === 0 || fieldHeight === 0) {
    // Nothing to do.
    console.error('Cannot resize text: zero height detected.');
    return;
  }

  console.debug(`Field height: ${fieldHeight}, Initial content height: ${initialHeight}`);

  // Use binary search to find optimal font size
  // This reduces layout reflows from O(n) to O(log n)
  let minSize = 1;
  let maxSize = 500; // Maximum 500% font size
  let bestSize = 100;

  // Binary search for the largest font size that fits
  while (minSize <= maxSize) {
    const midSize = Math.floor((minSize + maxSize) / 2);

    // Set the font size and measure once
    containerElement.style.fontSize = `${midSize}%`;
    const currentHeight = containerElement.scrollHeight;

    if (currentHeight <= fieldHeight) {
      // This size fits, try larger
      bestSize = midSize;
      minSize = midSize + 1;
    } else {
      // Too large, try smaller
      maxSize = midSize - 1;
    }
  }

  // Apply the best size found
  containerElement.style.fontSize = `${bestSize}%`;

  console.debug(`Optimal font size: ${bestSize}% (found in ${Math.ceil(Math.log2(500))} iterations vs ~${Math.abs(bestSize - 100)} with linear search)`);
}

// lifecycle hooks
onMounted(() => {
  resizeText();
})

</script>

<template>
  <div
    ref="container"
    class="richtext"
  >
    <div ref="child">
      <div
        v-if="props.content.render_as == 'plaintext'"
        class="plaintext"
      >
        {{ props.content.text }}
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="props.content.render_as == 'html'"
        class="html"
        v-html="props.content.text"
      />
      <!--eslint-enable-->
    </div>
  </div>
</template>

<style scoped>
  .richtext {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-size: 100%; /* Initial font size. */
  }
</style>
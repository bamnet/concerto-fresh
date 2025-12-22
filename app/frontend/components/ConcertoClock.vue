<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
// TODO: Migrate from date-fns to the Temporal API (https://tc39.es/proposal-temporal/docs/)
// once it has broad browser support. Temporal provides native date/time formatting
// and manipulation without requiring a third-party library.
import { format as formatDate } from 'date-fns'
import { useTextResize } from '../composables/useTextResize'

// How frequently the clock updates.
const UPDATE_INTERVAL_MS = 1000;

/**
 * MULTI-LINE FORMAT SUPPORT
 *
 * The Clock component supports multi-line displays using the {br} delimiter token.
 * This allows users to create clocks that span multiple lines without requiring HTML.
 *
 * How it works:
 * 1. The format string is split on the literal text "{br}"
 * 2. Each segment is formatted independently using date-fns
 * 3. Each formatted segment becomes a separate line in the display
 *
 * Example format strings:
 * - Single line:   "h:mm:ss a"           → "2:34:56 PM"
 * - Two lines:     "M/d/yyyy{br}h:mm a"  → "12/22/2025"
 *                                           "2:34 PM"
 * - Three lines:   "EEEE{br}M/d{br}h:mm a" → "Sunday"
 *                                             "12/22"
 *                                             "2:34 PM"
 *
 * Important notes:
 * - {br} is case-sensitive (must be lowercase)
 * - {br} is removed from the output (acts as delimiter only)
 * - Each segment is formatted separately, so each must be valid date-fns format
 * - Whitespace around {br} is preserved in each segment
 * - If no {br} is present, the entire string is treated as a single line
 *
 * Why {br} instead of \n or <br>?
 * - {br} is explicit and visible in text inputs
 * - Doesn't require HTML rendering (no v-html, safer)
 * - Won't get stripped by form handling
 * - Easy to document and explain to users
 */

/**
 * @typedef {object} ClockContent
 * @property {string} format - The date-fns format string for displaying the time.
 *                             Can include {br} tokens for multi-line display.
 */

const props = defineProps({
  /** @type {ClockContent} */
  content: {
    type: Object,
    required: true,
    validator: (value) => {
      return typeof value.format === 'string' && value.format.length > 0;
    },
  },
});

// Store formatted time as array of lines (supports multi-line via {br} delimiter)
const currentTimeLines = ref([]);
let updateInterval = null;

// Use the text resize composable
const { containerRef, childRef, resizeText } = useTextResize()

/**
 * Updates the displayed time by formatting the current date/time.
 *
 * If the format string contains {br} delimiters, it splits the format
 * and formats each segment independently, creating a multi-line display.
 */
async function updateTime() {
  try {
    const now = new Date();

    // Split format string on {br} delimiter for multi-line support
    // Example: "M/d/yyyy{br}h:mm a" becomes ["M/d/yyyy", "h:mm a"]
    const formatSegments = props.content.format.split('{br}');

    // Format each segment separately using date-fns
    // This allows each line to have its own independent format string
    const newTimeLines = formatSegments.map(segment =>
      formatDate(now, segment.trim())
    );

    // Compare arrays by joining to string (simple equality check)
    // Only update if the formatted time has actually changed
    const newTimeString = newTimeLines.join('|');
    const currentTimeString = currentTimeLines.value.join('|');

    if (newTimeString !== currentTimeString) {
      currentTimeLines.value = newTimeLines;

      // Wait for DOM update, then resize to fit the (potentially multi-line) content
      await nextTick();
      resizeText();
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    // On error, show a single line with error message
    currentTimeLines.value = ['Invalid format'];
  }
}

onMounted(() => {
  // Update immediately on mount
  updateTime();

  // Then update every UPDATE_INTERVAL_MS
  updateInterval = setInterval(updateTime, UPDATE_INTERVAL_MS);
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="concerto-clock"
  >
    <div
      ref="childRef"
      class="clock-display"
    >
      <!-- Render each line separately for multi-line support -->
      <!-- Single-line formats will have one line, multi-line will have multiple -->
      <div
        v-for="(line, index) in currentTimeLines"
        :key="index"
        class="clock-line"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.concerto-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 100%; /* Initial font size */
}

.clock-display {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  text-align: center;
}

.clock-line {
  /* Each line in a multi-line clock */
  white-space: nowrap;
}
</style>

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

import ConcertoField from '~/components/ConcertoField.vue'
import ConcertoGraphic from '~/components/ConcertoGraphic.vue'
import ConcertoRichText from '~/components/ConcertoRichText.vue'

const fieldContentUrl = 'http://server/field_content.json';
const fieldUnknownContentUrl = 'http://server/field_unknown_content.json';

const fieldContent = [
  {
    "id": 1,
    "duration": 30,
    "type": "Graphic",
    "image": "poster.png"
  },
  {
    "id": 2,
    "duration": null,
    "type": "RichText",
    "render_as": "plaintext",
    "text": "Welcome to Concerto!"
  }, {
    "id": 3,
    "duration": 25,
    "type": "Graphic",
    "image": "welcome.jpg"
  },
];

const fieldUnknownContent = [
  {
    "id": 1,
    "duration": null,
    "type": "Graphic",
    "image": "poster.png"
  },
  {
    "id": 2,
    "type": "UnknownContentType",
  },
  {
    "id": 3,
    "duration": null,
    "type": "Graphic",
    "image": "welcome.png"
  }, 
];

  
export const httpHandlers = [
  http.get(fieldContentUrl, () => {
    return HttpResponse.json(fieldContent);
  }),
  http.get(fieldUnknownContentUrl, () => {
    return HttpResponse.json(fieldUnknownContent);
  }),
];

const server = setupServer(...httpHandlers);

// Start server before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Close server after all tests.
afterAll(() => server.close());

// Reset handlers after each test.
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  server.resetHandlers();
});

describe('ConcertoField', () => {
  it('fetches and displays first content', async () => {
    const wrapper = mount(ConcertoField, {
      props: { apiUrl: fieldContentUrl },
      global: {
        stubs: {
          transition: false,
        }
      }
    });

    await flushPromises();

    expect(wrapper.findComponent(ConcertoGraphic).props()).toEqual(
      {
        content: fieldContent[0]
      }
    );
  });

  it('advances to the next content after duration', async () => {
    vi.useFakeTimers();

    const wrapper = mount(ConcertoField, {
      props: { apiUrl: fieldContentUrl },
      global: {
        stubs: {
          transition: false,
        }
      }
    });

    await flushPromises();

    // First Load -> Graphic.
    expect(wrapper.findComponent(ConcertoGraphic).exists()).toBe(true);
    expect(wrapper.findComponent(ConcertoRichText).exists()).toBe(false);

    vi.advanceTimersToNextTimer();
    await nextTick();

    // Graphic -> RichText.
    expect(wrapper.findComponent(ConcertoGraphic).exists()).toBe(false);
    expect(wrapper.findComponent(ConcertoRichText).exists()).toBe(true);

    vi.advanceTimersToNextTimer();
    await nextTick();

    // RichText -> Graphic.
    expect(wrapper.findComponent(ConcertoGraphic).exists()).toBe(true);
    expect(wrapper.findComponent(ConcertoRichText).exists()).toBe(false);
  });

  it('skips over unknown content types', async () => {
    const wrapper = mount(ConcertoField, {
      props: { apiUrl: fieldUnknownContentUrl },
      global: {
        stubs: {
          transition: false,
        }
      }
    });

    await flushPromises();

    // First load displays the initial graphic.
    expect(wrapper.findComponent(ConcertoGraphic).props()).toEqual(
      {
        content: fieldUnknownContent[0]
      }
    );

    const vm = wrapper.vm;
    // Advance to the next content.
    vm.next();

    await nextTick();

    // Skips over the unknown content type and renders the graphic.
    expect(wrapper.findComponent(ConcertoGraphic).props()).toEqual(
      {
        content: fieldUnknownContent[2]
      }
    );
  });
})
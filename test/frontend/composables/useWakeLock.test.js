import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useWakeLock } from '../../../app/frontend/composables/useWakeLock.js';

describe('useWakeLock', () => {
  let mockWakeLock;
  let originalNavigator;

  beforeEach(() => {
    // Save original navigator
    originalNavigator = global.navigator;

    // Create mock wake lock
    mockWakeLock = {
      release: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Mock navigator.wakeLock.request
    global.navigator = {
      ...originalNavigator,
      wakeLock: {
        request: vi.fn().mockResolvedValue(mockWakeLock),
      },
    };

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    vi.restoreAllMocks();
  });

  it('requests wake lock when mounted and API is supported', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { isSupported, isActive } = useWakeLock();
        return { isSupported, isActive };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isSupported).toBe(true);
    expect(navigator.wakeLock.request).toHaveBeenCalledWith('screen');
    expect(console.log).toHaveBeenCalledWith('[WakeLock] Screen wake lock acquired');
  });

  it('handles unsupported browsers gracefully', async () => {
    global.navigator = { ...originalNavigator };
    delete global.navigator.wakeLock;

    const TestComponent = defineComponent({
      setup() {
        const { isSupported, isActive } = useWakeLock();
        return { isSupported, isActive };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isSupported).toBe(false);
    expect(wrapper.vm.isActive).toBe(false);
    expect(console.warn).toHaveBeenCalledWith('[WakeLock] Screen Wake Lock API is not supported in this browser');
  });

  it('releases wake lock on unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        useWakeLock();
        return {};
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    wrapper.unmount();

    expect(mockWakeLock.removeEventListener).toHaveBeenCalledWith('release', expect.any(Function));
    expect(mockWakeLock.release).toHaveBeenCalled();
  });

  it('reacquires wake lock when page becomes visible', async () => {
    const TestComponent = defineComponent({
      setup() {
        useWakeLock();
        return {};
      },
      template: '<div></div>',
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 0));

    // Clear the initial request
    navigator.wakeLock.request.mockClear();

    // Simulate visibility change to visible
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      configurable: true,
      value: 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.wakeLock.request).toHaveBeenCalledWith('screen');
  });

  it('handles wake lock request errors', async () => {
    navigator.wakeLock.request.mockRejectedValueOnce(new Error('Permission denied'));

    const TestComponent = defineComponent({
      setup() {
        const { isActive } = useWakeLock();
        return { isActive };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isActive).toBe(false);
    expect(console.error).toHaveBeenCalledWith('[WakeLock] Failed to acquire wake lock:', expect.any(Error));
  });
});

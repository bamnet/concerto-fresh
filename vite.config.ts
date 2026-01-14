import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    // Target older browsers for embedded devices (Smart TVs, kiosks, etc.)
    // See: https://github.com/bamnet/concerto-fresh/issues/608
    target: ['chrome64', 'firefox69', 'safari13.1']
  },
  plugins: [
    RubyPlugin(),
    vue(),
  ],
})

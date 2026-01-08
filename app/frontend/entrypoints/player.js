import { createApp } from 'vue'
import App from '../components/ConcertoScreen.vue'

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('[Player] ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('[Player] ServiceWorker registration failed:', error);
      });
  });
}

const div = document.getElementById('screen');
const apiUrl = div.dataset.apiUrl;

createApp(App, {apiUrl: apiUrl}).mount(div);

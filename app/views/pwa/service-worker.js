// Concerto Player Service Worker
// Provides offline resilience for digital signage displays

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `concerto-static-${CACHE_VERSION}`;
const CONTENT_CACHE = `concerto-content-${CACHE_VERSION}`;

// Static assets to cache on install (app shell)
const STATIC_ASSETS = [
  '/icon.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('concerto-') && name !== STATIC_CACHE && name !== CONTENT_CACHE)
          .map((name) => {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests (JSON) - network first, cache fallback
  if (request.headers.get('Accept')?.includes('application/json') ||
      url.pathname.includes('/frontend/')) {
    event.respondWith(networkFirstWithCache(request, CONTENT_CACHE));
    return;
  }

  // Image/media requests - cache first, network fallback
  if (request.destination === 'image' ||
      request.destination === 'video' ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|mp4|webm)$/i)) {
    event.respondWith(cacheFirstWithNetwork(request, CONTENT_CACHE));
    return;
  }

  // Static assets - cache first
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(cacheFirstWithNetwork(request, STATIC_CACHE));
    return;
  }

  // All other requests - network first
  event.respondWith(networkFirstWithCache(request, CONTENT_CACHE));
});

/**
 * Network-first strategy with cache fallback.
 * Best for API requests where fresh data is preferred but cached data is acceptable offline.
 */
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Clone the response since it can only be consumed once
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[ServiceWorker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // No cache available - return a basic error response for JSON requests
    if (request.headers.get('Accept')?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'offline', cached: false }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    throw error;
  }
}

/**
 * Cache-first strategy with network fallback.
 * Best for images and media that don't change frequently.
 */
async function cacheFirstWithNetwork(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached response immediately
    // Optionally refresh cache in background (stale-while-revalidate)
    refreshCache(request, cacheName);
    return cachedResponse;
  }

  // Not in cache - fetch from network and cache
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Network failed and no cache for:', request.url);
    throw error;
  }
}

/**
 * Background cache refresh for stale-while-revalidate pattern.
 */
async function refreshCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silently fail - we already have a cached version
  }
}

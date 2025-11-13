/* ========================================
   STOPTHECHARGE - Service Worker
   Progressive Web App Caching & Offline Support
   ======================================== */

// Cache name and version
const CACHE_NAME = 'stopthecharge-v1';
const STATIC_ASSETS = [
    '/',
    'index.html',
    '../css/style.css',
    '../js/app.js',
    'manifest.json'
];

/* ========================================
   INSTALL EVENT
   ========================================
   Pre-cache core application files
   ======================================== */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing StopTheCharge PWA...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching core files');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Skipping waiting, activating immediately');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/* ========================================
   ACTIVATE EVENT
   ========================================
   Clean up old caches
   ======================================== */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Ready to handle requests');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('[Service Worker] Activation failed:', error);
            })
    );
});

/* ========================================
   FETCH EVENT
   ========================================
   Cache-First Strategy for offline support
   ======================================== */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests and non-GET requests
    if (url.origin !== location.origin || request.method !== 'GET') {
        return;
    }

    // Cache-first strategy: try cache first, fallback to network
    event.respondWith(
        caches.match(request)
            .then((response) => {
                if (response) {
                    console.log('[Service Worker] Serving from cache:', request.url);
                    return response;
                }

                console.log('[Service Worker] Fetching from network:', request.url);
                return fetch(request)
                    .then((response) => {
                        // Only cache successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response to cache it
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch failed:', error);
                        // Return a fallback response for offline scenarios
                        // You can create a custom offline page and return it here
                        throw error;
                    });
            })
            .catch((error) => {
                console.error('[Service Worker] Error handling fetch:', error);
                // Optional: return an offline page here
                // return caches.match('/offline.html');
            })
    );
});

/* ========================================
   MESSAGE EVENT
   ========================================
   Handle messages from clients
   ======================================== */
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[Service Worker] Skip waiting signal received');
        self.skipWaiting();
    }
});

/* ========================================
   BACKGROUND SYNC (Optional Future Enhancement)
   ========================================
   Add support for background sync
   ======================================== */
// Uncomment when implementing background sync
// self.addEventListener('sync', (event) => {
//     console.log('[Service Worker] Background sync event:', event.tag);
//     if (event.tag === 'sync-subscriptions') {
//         event.waitUntil(syncSubscriptions());
//     }
// });

/* ========================================
   PUSH NOTIFICATIONS (Optional Future Enhancement)
   ========================================
   Add support for push notifications
   ======================================== */
// Uncomment when implementing push notifications
// self.addEventListener('push', (event) => {
//     console.log('[Service Worker] Push notification received');
//     const options = {
//         body: event.data ? event.data.text() : 'StopTheCharge notification',
//         icon: '/images/icon-192x192.png',
//         badge: '/images/badge-72x72.png',
//         tag: 'stopthecharge',
//         requireInteraction: false
//     };
//     event.waitUntil(
//         self.registration.showNotification('StopTheCharge', options)
//     );
// });

console.log('[Service Worker] Script loaded successfully');

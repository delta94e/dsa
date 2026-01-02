// Service Worker for Push Notifications & Offline Support
// English Speaking App

const CACHE_NAME = 'english-app-v2';
const STATIC_CACHE = 'english-app-static-v1';

// App shell files to cache for offline
const APP_SHELL = [
  '/',
  '/offline',
  '/notification-icon.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(APP_SHELL).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
    ])
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] 🔔 Push event received!');
  console.log('[SW] Push data:', event.data ? event.data.text() : 'no data');

  // Notify all clients that push was received (for debugging)
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PUSH_RECEIVED',
        timestamp: new Date().toISOString()
      });
    });
  });

  let data = {
    title: 'English Speaking App',
    body: 'You have a new notification!',
    icon: '/notification-icon.png',
    badge: '/notification-icon.png',
    tag: 'default',
    data: { url: '/' },
  };

  // Parse push data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[SW] Parsed payload:', JSON.stringify(payload));
      data = {
        ...data,
        ...payload,
      };
    } catch (e) {
      console.log('[SW] Failed to parse JSON, using text');
      // If not JSON, use text as body
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/notification-icon.png',
    badge: data.badge || '/notification-icon.png',
    tag: data.tag || 'default-' + Date.now(), // Use unique tag to avoid deduplication
    data: data.data || { url: '/' },
    vibrate: [100, 50, 100],
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    requireInteraction: data.requireInteraction || false,
  };

  console.log('[SW] Showing notification:', data.title, options);

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => console.log('[SW] ✅ Notification shown successfully'))
      .catch(err => console.error('[SW] ❌ Failed to show notification:', err))
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  // Handle action buttons
  if (event.action === 'dismiss') {
    return;
  }

  // Get the URL to open
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if (urlToOpen !== '/') {
            client.navigate(urlToOpen);
          }
          return;
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event - track dismissals
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event);
  // Could send analytics here
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

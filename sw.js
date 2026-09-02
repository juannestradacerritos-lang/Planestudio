// Cambiamos a v2 para obligar al teléfono a descargar el nuevo index.html
const CACHE_NAME = 'papeleria-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Instalar Service Worker y cachear recursos estáticos
self.addEventListener('install', event => {
  // Forzar al service worker a activarse inmediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Actualizar el Service Worker y limpiar cachés antiguos (Aquí borra la v1)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

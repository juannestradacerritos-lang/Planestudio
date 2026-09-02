const CACHE_NAME = 'papeleria-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la instalación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia: "Internet primero, luego Caché" (Ideal para ver cambios en vivo)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, obtenemos la versión más reciente y la guardamos en caché
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Si NO hay internet, entonces sacamos la versión guardada en la caché
        return caches.match(event.request);
      })
  );
});

// Limpiar cachés antiguas
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

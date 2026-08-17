// Service worker minimal : met en cache la coquille de l'app (HTML/CSS/JS statiques)
// pour un chargement instantane et une installabilite PWA. Ne met JAMAIS en cache
// les appels /api/* ni le websocket : les messages doivent toujours venir du reseau.
const CACHE_NAME = 'messagerie-shell-v1';
const SHELL_FILES = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/js/crypto.js',
  '/vendor/libsodium.js',
  '/vendor/libsodium-wrappers.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname === '/ws' || url.pathname.startsWith('/attachments/')) {
    return; // toujours reseau, jamais de cache
  }
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

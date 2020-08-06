const mycache = 'cache1';
const urlsToCache = [
  '/static/style.css',
  '/static/script.js',
  '/static/jquery.min.js',
  '/static/css/font-awesome.min.css',
  '/static/bootstrap/bootstrap.min.js',
  '/static/bootstrap/bootstrap.min.css'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(mycache);
  await cache.addAll(urlsToCache);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
}); 

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(mycache);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(mycache);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
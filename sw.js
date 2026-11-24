// 离线缓存：有网时优先取最新版本（方便更新），没网时用缓存（离线可玩）
const C = 'pixel-farm-v3.0';
const FILES = ['./', './index.html', './manifest.webmanifest', 'icon192.png', 'icon512.png', 'icon180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(resp => {
    if (resp && resp.ok) { const cp = resp.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return resp;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});

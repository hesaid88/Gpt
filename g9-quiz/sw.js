const CACHE = "g9-quiz-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./g9-bank.json",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k))))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(net => {
      const clone = net.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
      return net;
    }).catch(()=>caches.match("./index.html")))
  );
});
const CACHE_NAME = "ecommerce-cache-v1";

const filesToCache = [
  "/",
  "index.html",
  "script.js",
  "iphone.jpg",
  "PS5.jpg",
  "Dell.jpg",
  "AirPods.jpg"
 
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
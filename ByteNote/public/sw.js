// Service Worker for offline support
const CACHE_NAME = "bytenote-v2";
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const urlsToCache = [
  "/",
  "/notes",
  "/auth/login",
  "/auth/register"
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 在开发模式下，不缓存 Next.js 的静态资源
      if (isDevelopment) {
        return cache.addAll(urlsToCache.filter(url => !url.includes('_next')));
      }
      return cache.addAll(urlsToCache);
    })
  );
  // 立即激活新的 Service Worker
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  
  // 在开发模式下，不缓存 Next.js 的静态资源（这些资源路径会变化）
  if (isDevelopment && (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/next/') ||
    url.pathname.includes('/static/') ||
    url.pathname.includes('/chunks/')
  )) {
    // 直接请求网络，不缓存
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(event.request).then((response) => {
          // Don't cache API requests
          if (event.request.url.includes("/api/")) {
            return response;
          }
          
          // 在开发模式下，不缓存 Next.js 静态资源
          if (isDevelopment && (
            url.pathname.startsWith('/_next/') ||
            url.pathname.startsWith('/next/') ||
            url.pathname.includes('/static/') ||
            url.pathname.includes('/chunks/')
          )) {
            return response;
          }
          
          // Cache static assets
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
      );
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});


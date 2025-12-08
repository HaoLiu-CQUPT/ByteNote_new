// 在 Edge 浏览器控制台中运行此脚本来清除 Service Worker 和缓存
(async () => {
  console.log('开始清除 Service Worker 和缓存...');
  
  // 注销所有 Service Worker
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
    console.log('已注销 Service Worker:', registration.scope);
  }
  
  // 清除所有缓存
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName);
    console.log('已删除缓存:', cacheName);
  }
  
  console.log('清除完成！请刷新页面（F5）');
  console.log('如果问题仍然存在，请按 Ctrl+Shift+Delete 清除浏览器缓存');
})();

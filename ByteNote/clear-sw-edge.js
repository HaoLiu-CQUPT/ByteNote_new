// 在 Edge 浏览器控制台运行此代码来清除 Service Worker
(async () => {
  console.log('开始清除所有 Service Worker...');
  
  try {
    // 获取所有注册的 Service Worker
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`找到 ${registrations.length} 个 Service Worker`);
    
    // 注销所有 Service Worker
    for (const registration of registrations) {
      const unregistered = await registration.unregister();
      console.log(`已注销: ${registration.scope} - ${unregistered ? '成功' : '失败'}`);
    }
    
    // 清除所有缓存
    const cacheNames = await caches.keys();
    console.log(`找到 ${cacheNames.length} 个缓存`);
    
    for (const cacheName of cacheNames) {
      const deleted = await caches.delete(cacheName);
      console.log(`已删除缓存: ${cacheName} - ${deleted ? '成功' : '失败'}`);
    }
    
    console.log('✅ 清除完成！');
    console.log('请关闭并重新打开浏览器标签页，然后刷新页面（F5）');
  } catch (error) {
    console.error('清除过程中出错:', error);
  }
})();

const CACHE_NAME = 'synth-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

// インストール：新しいファイルをキャッシュに保存
self.addEventListener('install', (event) => {
  // skipWaiting() を呼ぶことで、古いSWが終了するのを待たずに即座に新しいSWを有効化する
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// アクティベート：古いバージョンのキャッシュを自動削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // 現在の CACHE_NAME 以外はすべて削除する
          if (cache !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// フェッチ：キャッシュがあればそれを返し、なければネットワークへ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

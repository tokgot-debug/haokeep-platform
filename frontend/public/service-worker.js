const CACHE_NAME = 'cleanpulse-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/main.css',
    './css/mobile.css',
    './css/components.css',
    './js/state.js',
    './js/ledger.js',
    './js/etims.js',
    './js/dispatch.js',
    './js/sync.js',
    './js/ai.js',
    './js/ui/housekeeperView.js',
    './js/ui/ownerView.js',
    './js/ui/agencyView.js',
    './js/ui/financeView.js',
    './js/ui/adminView.js',
    './js/ui/landingView.js',
    './js/subscription.js',
    './js/export.js',
    './js/enroll.js',
    './js/app.js',
    './assets/cleanpulse_icon.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

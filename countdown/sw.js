// Nama dan versi cache.
// PENTING: Tukar nombor versi ini (cth: v1.4.2) setiap kali anda membuat perubahan pada mana-mana fail di bawah.
const CACHE_NAME = 'ramadan-countdown-v1.4.1';

// Senarai fail "app shell" yang penting untuk dicache semasa pemasangan PWA.
const urlsToCache = [
  '/',
  'index.html',
  'info.html',
  'style.css',
  'script.js',
  'media/background/pattern.svg',
  'media/icon/download.svg',
  'media/image/ramadan-kareem.svg',
  'media/preview/link-preview.jpg',
  'media/template/template-hijri.png',
  'media/template/template-masihi.png',
  // Fail-fail Favicon
  'media/favicon/favicon.ico',
  'media/favicon/favicon.svg',
  'media/favicon/apple-touch-icon.png',
  'media/favicon/favicon-96x96.png',
  'media/favicon/favicon-192x192.png',
  'media/favicon/favicon-512x512.png',
  'media/favicon/site.webmanifest'
];

// 1. Proses Pemasangan (Install)
self.addEventListener('install', (event) => {
  // Tunggu sehingga semua fail penting selesai dicache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka. Menyimpan fail app shell...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Proses Pengaktifan (Activate)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Jika nama cache sedia ada tidak sama dengan nama cache yang baharu, padamkannya.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Memadamkan cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Proses 'Fetch' (Apabila aplikasi meminta fail)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Cuba cari fail yang diminta di dalam cache terlebih dahulu
    caches.match(event.request)
      .then((response) => {
        // Jika fail ditemui dalam cache, pulangkan ia.
        if (response) {
          return response;
        }
        // Jika tidak ditemui, buat permintaan ke rangkaian (network).
        return fetch(event.request);
      }
    )
  );
});
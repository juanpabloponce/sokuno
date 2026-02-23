const CACHE_NAME = 'sokuno-v43';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/calculator.css',
  '/css/worldmap.css',
  '/css/dialogue.css',
  '/css/freestyle.css',
  '/js/worlds-data.js',
  '/js/dialogues-data.js',
  '/js/storage.js',
  '/js/audio.js',
  '/js/problems.js',
  '/js/sleepbar.js',
  '/js/powers.js',
  '/js/progression.js',
  '/js/dialogue.js',
  '/js/lore.js',
  '/js/calculator.js',
  '/js/freestyle.js',
  '/js/game.js',
  '/assets/icon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/kid.svg',
  '/assets/book.svg',
  '/assets/correct.svg',
  '/assets/final-stage.svg',
  '/assets/lock.svg',
  '/assets/star-empty.svg',
  '/assets/star-full.svg',
  '/assets/yumemori.svg',
  '/assets/guardians/abyss.svg',
  '/assets/guardians/cosmos.svg',
  '/assets/guardians/fire.svg',
  '/assets/guardians/ice.svg',
  '/assets/guardians/nature.svg',
  '/assets/guardians/ocean.svg',
  '/assets/guardians/psy.svg',
  '/assets/fonts/Leander.ttf',
  '/assets/fonts/Ransom.ttf',
  '/assets/fonts/Schoolbell-Regular.ttf',
  '/assets/mixtape.svg',
  '/js/mixtape.js',
  '/assets/intro-song.mp3',
  '/audio/music/world-1.mp3',
  '/audio/music/world-2.mp3',
  '/audio/music/world-3.mp3',
  '/assets/space-song_1.mp3',
  '/assets/volcano-song.mp3',
  '/assets/ocean-song.mp3',
  '/assets/abyss-song.mp3',
  '/assets/endless-dream.mp3'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

const CACHE_NAME = 'sokuno-v30';

const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/calculator.css',
  '/css/worldmap.css',
  '/css/dialogue.css',
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
  '/js/game.js',
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
  '/assets/intro-song.mp3',
  '/audio/music/world-1.mp3',
  '/audio/music/world-2.mp3',
  '/audio/music/world-3.mp3',
  '/assets/space-song_1.mp3',
  '/assets/volcano-song.mp3',
  '/assets/ocean-song.mp3',
  '/assets/abyss-song.mp3'
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

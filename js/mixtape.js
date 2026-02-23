// mixtape.js — Mixtape music player for unlocked world songs

const Mixtape = (() => {
  // Track definitions: id, name, origin label, audio source, unlock condition
  const TRACKS = [
    { id: 1, name: "It's Just a Dream",        origin: 'Intro',        src: 'assets/intro-song.mp3',       unlockWorld: 0 },  // always unlocked
    { id: 2, name: 'On the Rocks, Please',     origin: 'World 1 — Ice',     src: 'audio/music/world-1.mp3',     unlockWorld: 1 },
    { id: 3, name: 'Mind Your Own',            origin: 'World 2 — Psychic', src: 'audio/music/world-2.mp3',     unlockWorld: 2 },
    { id: 4, name: "San Pedro's Jungle",       origin: 'World 3 — Jungle',  src: 'audio/music/world-3.mp3',     unlockWorld: 3 },
    { id: 5, name: 'We Are All Connected',     origin: 'World 4 — Cosmos',  src: 'assets/space-song_1.mp3',     unlockWorld: 4 },
    { id: 6, name: 'Bring the Fire',           origin: 'World 5 — Volcano', src: 'assets/volcano-song.mp3',     unlockWorld: 5 },
    { id: 7, name: 'How Deep Is Your Thought', origin: 'World 6 — Ocean',   src: 'assets/ocean-song.mp3',       unlockWorld: 6 },
    { id: 8, name: 'Did You Really Make It?',  origin: 'World 7 — Abyss',   src: 'assets/abyss-song.mp3',       unlockWorld: 7 },
    { id: 9, name: 'Never Ending Dream',       origin: 'The Endless Dream', src: 'assets/endless-dream.mp3',    unlockWorld: 'freestyle' },
  ];

  let mixtapePlayer = null;
  let currentTrackId = null;
  let fadeInterval = null;
  const MIXTAPE_VOLUME = 0.45;
  const FADE_DURATION = 1500; // ms

  // Check if a track is unlocked based on save data
  function isTrackUnlocked(track, saveData, debugUnlockAll) {
    if (debugUnlockAll) return true;
    if (track.unlockWorld === 0) return true; // intro always unlocked
    if (track.unlockWorld === 'freestyle') return saveData.freestyle && saveData.freestyle.unlocked;
    return saveData.worlds[track.unlockWorld] && saveData.worlds[track.unlockWorld].unlocked;
  }

  // Render the track list into the DOM
  function renderList(saveData, debugUnlockAll) {
    const container = document.getElementById('mixtape-list');
    if (!container) return;
    container.innerHTML = '';

    TRACKS.forEach(track => {
      const unlocked = isTrackUnlocked(track, saveData, debugUnlockAll);
      const isPlaying = currentTrackId === track.id && mixtapePlayer && !mixtapePlayer.paused;

      const el = document.createElement('div');
      el.className = `mixtape-track ${unlocked ? 'unlocked' : 'locked'} ${isPlaying ? 'playing' : ''}`;
      el.dataset.trackId = track.id;

      if (unlocked) {
        el.innerHTML = `
          <div class="mixtape-track-number">${track.id}</div>
          <div class="mixtape-track-info">
            <div class="mixtape-track-name">${track.name}</div>
            <div class="mixtape-track-origin">${track.origin}</div>
          </div>
          <button class="mixtape-track-btn" data-action="${isPlaying ? 'pause' : 'play'}" title="${isPlaying ? 'Pause' : 'Play'}">
            ${isPlaying ? '❚❚' : '▶'}
          </button>
        `;

        // Play/pause button handler
        const btn = el.querySelector('.mixtape-track-btn');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          Audio.resume();
          if (isPlaying) {
            pause();
          } else {
            playTrack(track, saveData, debugUnlockAll);
          }
        });

        // Tap on row also plays
        el.addEventListener('click', () => {
          Audio.resume();
          if (isPlaying) {
            pause();
          } else {
            playTrack(track, saveData, debugUnlockAll);
          }
        });
      } else {
        el.innerHTML = `
          <div class="mixtape-track-number">${track.id}</div>
          <div class="mixtape-track-info">
            <div class="mixtape-track-name">???</div>
            <div class="mixtape-track-origin">${track.origin}</div>
          </div>
          <img src="assets/lock.svg" class="mixtape-track-lock" alt="Locked">
        `;
      }

      container.appendChild(el);
    });
  }

  // Play a track with fade-in, fading out intro music first
  function playTrack(track, saveData, debugUnlockAll) {
    // If already playing this track, do nothing
    if (currentTrackId === track.id && mixtapePlayer && !mixtapePlayer.paused) return;

    // Fade out intro music
    Audio.stopIntroMusic(true);
    // Fade out any world music
    Audio.stopMusic(true);

    // Stop current mixtape track (if different)
    if (mixtapePlayer && currentTrackId !== track.id) {
      fadeOut(() => {
        startNewTrack(track, saveData, debugUnlockAll);
      });
    } else if (mixtapePlayer && mixtapePlayer.paused) {
      // Resume paused same track
      mixtapePlayer.play().then(() => {
        fadeIn();
        currentTrackId = track.id;
        updateNowPlaying(track);
        renderList(saveData, debugUnlockAll);
      }).catch(() => {});
    } else {
      startNewTrack(track, saveData, debugUnlockAll);
    }
  }

  function startNewTrack(track, saveData, debugUnlockAll) {
    if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
    if (mixtapePlayer) {
      mixtapePlayer.pause();
      mixtapePlayer = null;
    }

    currentTrackId = track.id;
    mixtapePlayer = new window.Audio(track.src);
    mixtapePlayer.loop = true;
    mixtapePlayer.volume = 0;

    mixtapePlayer.play().then(() => {
      fadeIn();
      updateNowPlaying(track);
      renderList(saveData, debugUnlockAll);
    }).catch(e => {
      console.log('Mixtape playback blocked:', e);
    });
  }

  function pause() {
    if (!mixtapePlayer || mixtapePlayer.paused) return;
    fadeOut(() => {
      if (mixtapePlayer) mixtapePlayer.pause();
    });
    // Update UI immediately for responsiveness
    updateNowPlayingPaused();
    // Re-render with small delay
    setTimeout(() => {
      const container = document.getElementById('mixtape-list');
      if (container) {
        const playing = container.querySelectorAll('.mixtape-track.playing');
        playing.forEach(el => el.classList.remove('playing'));
      }
    }, 100);
  }

  // Stop completely and go back to intro music
  function stop() {
    if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
    if (mixtapePlayer) {
      fadeOut(() => {
        if (mixtapePlayer) {
          mixtapePlayer.pause();
          mixtapePlayer.currentTime = 0;
          mixtapePlayer = null;
        }
        currentTrackId = null;
        // Resume intro music
        Audio.playIntroMusic();
      });
    } else {
      currentTrackId = null;
      Audio.playIntroMusic();
    }
    hideNowPlaying();
  }

  function fadeIn() {
    if (fadeInterval) clearInterval(fadeInterval);
    if (!mixtapePlayer) return;

    const steps = 20;
    const stepTime = FADE_DURATION / steps;
    const stepSize = MIXTAPE_VOLUME / steps;
    let current = 0;
    let step = 0;

    mixtapePlayer.volume = 0;

    fadeInterval = setInterval(() => {
      step++;
      current += stepSize;
      if (mixtapePlayer) mixtapePlayer.volume = Math.min(current, MIXTAPE_VOLUME);
      if (step >= steps) {
        clearInterval(fadeInterval);
        fadeInterval = null;
        if (mixtapePlayer) mixtapePlayer.volume = MIXTAPE_VOLUME;
      }
    }, stepTime);
  }

  function fadeOut(onDone) {
    if (fadeInterval) clearInterval(fadeInterval);
    if (!mixtapePlayer) { if (onDone) onDone(); return; }

    const steps = 20;
    const stepTime = FADE_DURATION / steps;
    const startVol = mixtapePlayer.volume;
    const stepSize = startVol / steps;
    let current = startVol;
    let step = 0;

    fadeInterval = setInterval(() => {
      step++;
      current -= stepSize;
      if (mixtapePlayer) mixtapePlayer.volume = Math.max(0, current);
      if (step >= steps) {
        clearInterval(fadeInterval);
        fadeInterval = null;
        if (onDone) onDone();
      }
    }, stepTime);
  }

  function updateNowPlaying(track) {
    const bar = document.getElementById('mixtape-now-playing');
    const title = document.getElementById('now-playing-title');
    if (bar && title) {
      title.textContent = track.name;
      bar.classList.remove('hidden');
    }
  }

  function updateNowPlayingPaused() {
    // Keep now-playing visible but could add paused indicator
  }

  function hideNowPlaying() {
    const bar = document.getElementById('mixtape-now-playing');
    if (bar) bar.classList.add('hidden');
  }

  // Check if mixtape is currently playing (used to not restart intro)
  function isPlaying() {
    return mixtapePlayer && !mixtapePlayer.paused;
  }

  // Stop mixtape when entering a world (world music takes over)
  function stopForWorld() {
    if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
    if (mixtapePlayer) {
      const dyingPlayer = mixtapePlayer;
      const dyingVol = dyingPlayer.volume;
      mixtapePlayer = null;
      currentTrackId = null;

      const steps = 20;
      const stepTime = 1000 / steps;
      const stepSize = dyingVol / steps;
      let current = dyingVol;
      let step = 0;
      const dyingFade = setInterval(() => {
        step++;
        current -= stepSize;
        dyingPlayer.volume = Math.max(0, current);
        if (step >= steps) {
          clearInterval(dyingFade);
          dyingPlayer.pause();
          dyingPlayer.currentTime = 0;
        }
      }, stepTime);
    }
    hideNowPlaying();
  }

  function getCurrentTrackId() {
    return currentTrackId;
  }

  return { TRACKS, renderList, playTrack, pause, stop, stopForWorld, isPlaying, getCurrentTrackId, hideNowPlaying };
})();

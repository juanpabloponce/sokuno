// audio.js — Sound effects using Web Audio API

const Audio = (() => {
  let ctx = null;
  let enabled = true;

  // --- FX nodes (created once, reused) ---
  let reverbNode = null;   // ConvolverNode
  let reverbGain = null;   // wet level
  let delayNode = null;    // DelayNode
  let delayFeedback = null; // feedback gain
  let delayGain = null;    // wet level
  let dryGain = null;      // dry level
  let fxReady = false;

  function getContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  // Build a synthetic impulse response for reverb (dreamy hall)
  function buildReverbIR(c) {
    const rate = c.sampleRate;
    const length = rate * 1.6; // 1.6s tail
    const ir = c.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Exponential decay with slight randomness per channel
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    return ir;
  }

  // Initialize FX chain: source → dry + (delay → reverb → wet)
  function initFX() {
    if (fxReady) return;
    try {
      const c = getContext();

      // Dry path
      dryGain = c.createGain();
      dryGain.gain.value = 0.75;
      dryGain.connect(c.destination);

      // Delay: short slapback
      delayNode = c.createDelay(1.0);
      delayNode.delayTime.value = 0.18; // 180ms delay
      delayFeedback = c.createGain();
      delayFeedback.gain.value = 0.25; // subtle feedback
      delayGain = c.createGain();
      delayGain.gain.value = 0.3; // delay wet level

      // Delay feedback loop
      delayNode.connect(delayFeedback);
      delayFeedback.connect(delayNode);
      delayNode.connect(delayGain);

      // Reverb
      reverbNode = c.createConvolver();
      reverbNode.buffer = buildReverbIR(c);
      reverbGain = c.createGain();
      reverbGain.gain.value = 0.4; // reverb wet level

      // Delay feeds into reverb
      delayGain.connect(reverbNode);
      reverbNode.connect(reverbGain);
      reverbGain.connect(c.destination);

      fxReady = true;
    } catch (e) {
      fxReady = false;
    }
  }

  // Play tone through FX chain (reverb + delay)
  function playToneWet(freq, duration, type, volume) {
    if (!enabled) return;
    try {
      const c = getContext();
      initFX();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
      osc.connect(gain);
      // Dry path
      gain.connect(dryGain);
      // Wet path (into delay → reverb)
      gain.connect(delayNode);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) {}
  }

  // Play tone dry (no FX) — for UI sounds
  function playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!enabled) return;
    try {
      const c = getContext();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) {}
  }

  function correct() {
    playToneWet(800, 0.15, 'sine', 0.2);
    setTimeout(() => playToneWet(1000, 0.15, 'sine', 0.18), 80);
  }

  function wrong() {
    playToneWet(200, 0.15, 'sine', 0.1);
  }

  function buttonPress() {
    playToneWet(520, 0.12, 'sine', 0.1);
  }

  function powerUsed() {
    // Whoosh-like sound through FX
    if (!enabled) return;
    try {
      const c = getContext();
      initFX();
      const bufferSize = c.sampleRate * 0.3;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = c.createBufferSource();
      source.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.frequency.exponentialRampToValueAtTime(3000, c.currentTime + 0.3);
      const gain = c.createGain();
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.3);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(dryGain);
      gain.connect(delayNode);
      source.start(c.currentTime);
    } catch (e) {}
  }

  function victory() {
    // Ascending arpeggio with reverb
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playToneWet(freq, 0.25, 'sine', 0.2), i * 120);
    });
  }

  function defeat() {
    // Descending tone with reverb
    playToneWet(400, 0.35, 'sine', 0.2);
    setTimeout(() => playToneWet(250, 0.5, 'sine', 0.18), 200);
  }

  function toggle() {
    enabled = !enabled;
    if (!enabled) {
      stopIntroMusic(false);
      stopMusic(false);
    }
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  // Resume audio context on user interaction
  function resume() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // === Intro/Title Music ===
  let introPlayer = null;
  let introFadeInterval = null;
  const INTRO_MUSIC_SRC = 'assets/intro-song.mp3';
  const INTRO_MUSIC_VOLUME = 0.35;

  function playIntroMusic() {
    if (!enabled) return;
    if (introPlayer && !introPlayer.paused) return;

    introPlayer = new window.Audio(INTRO_MUSIC_SRC);
    introPlayer.loop = true;
    introPlayer.volume = 0;

    introPlayer.play().then(() => {
      // Fade in over 2 seconds
      if (introFadeInterval) clearInterval(introFadeInterval);
      const steps = 20;
      const stepTime = 2000 / steps;
      const stepSize = INTRO_MUSIC_VOLUME / steps;
      let current = 0;
      let step = 0;
      introFadeInterval = setInterval(() => {
        step++;
        current += stepSize;
        if (introPlayer) introPlayer.volume = Math.min(current, INTRO_MUSIC_VOLUME);
        if (step >= steps) {
          clearInterval(introFadeInterval);
          introFadeInterval = null;
          if (introPlayer) introPlayer.volume = INTRO_MUSIC_VOLUME;
        }
      }, stepTime);
    }).catch(e => {
      console.log('Intro music autoplay blocked');
    });
  }

  function stopIntroMusic(fade = true) {
    if (introFadeInterval) {
      clearInterval(introFadeInterval);
      introFadeInterval = null;
    }
    if (!introPlayer) return;

    if (fade && !introPlayer.paused) {
      // Fade out over 1 second
      const steps = 20;
      const stepTime = 1000 / steps;
      const startVol = introPlayer.volume;
      const stepSize = startVol / steps;
      let current = startVol;
      let step = 0;
      introFadeInterval = setInterval(() => {
        step++;
        current -= stepSize;
        if (introPlayer) introPlayer.volume = Math.max(0, current);
        if (step >= steps) {
          clearInterval(introFadeInterval);
          introFadeInterval = null;
          if (introPlayer) {
            introPlayer.pause();
            introPlayer.currentTime = 0;
            introPlayer = null;
          }
        }
      }, stepTime);
    } else {
      introPlayer.pause();
      introPlayer.currentTime = 0;
      introPlayer = null;
    }
  }

  // === World Music System ===
  let musicPlayer = null;
  let currentMusicWorld = null;
  let musicVolume = 0.4;
  let fadeInterval = null;

  // Map of world IDs to music files (add more as you get them)
  const WORLD_MUSIC = {
    1: 'audio/music/world-1.mp3',
    2: 'audio/music/world-2.mp3',
    3: 'audio/music/world-3.mp3',
    4: 'assets/space-song_1.mp3',
    5: 'assets/volcano-song.mp3',
    6: 'assets/ocean-song.mp3',
    7: 'assets/abyss-song.mp3',
    freestyle: 'assets/endless-dream.mp3',
  };

  function playWorldMusic(worldId) {
    if (!enabled) return;

    // Already playing this world's music
    if (currentMusicWorld === worldId && musicPlayer && !musicPlayer.paused) return;

    // Crossfade: fade out intro smoothly (runs on its own timer)
    stopIntroMusic(true);
    // Fade out any current world music smoothly
    stopMusic(true);

    const src = WORLD_MUSIC[worldId];
    if (!src) return; // No music for this world yet

    currentMusicWorld = worldId;
    musicPlayer = new window.Audio(src);
    musicPlayer.loop = true;
    musicPlayer.volume = 0;

    musicPlayer.play().then(() => {
      // Fade in over 2s (overlaps with the fade out for crossfade effect)
      fadeMusic(0, musicVolume, 2000);
    }).catch(e => {
      console.log('Music autoplay blocked, will play on interaction');
    });
  }

  function playFreestyleMusic() {
    playWorldMusic('freestyle');
  }

  function stopMusic(fade = true) {
    if (!musicPlayer) {
      if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
      return;
    }

    if (fade && !musicPlayer.paused) {
      // Capture reference so crossfade works (new player can start while old fades)
      const dyingPlayer = musicPlayer;
      const dyingVol = dyingPlayer.volume;
      musicPlayer = null;
      currentMusicWorld = null;

      // Clear any existing fade on this track
      if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }

      // Fade out the dying player on its own timer
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
    } else {
      if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
      musicPlayer.pause();
      musicPlayer.currentTime = 0;
      musicPlayer = null;
      currentMusicWorld = null;
    }
  }

  function fadeMusic(from, to, duration, onDone) {
    if (fadeInterval) clearInterval(fadeInterval);
    if (!musicPlayer) return;

    const steps = 20;
    const stepTime = duration / steps;
    const stepSize = (to - from) / steps;
    let current = from;
    let step = 0;

    musicPlayer.volume = Math.max(0, Math.min(1, from));

    fadeInterval = setInterval(() => {
      step++;
      current += stepSize;
      if (musicPlayer) {
        musicPlayer.volume = Math.max(0, Math.min(1, current));
      }
      if (step >= steps) {
        clearInterval(fadeInterval);
        fadeInterval = null;
        if (musicPlayer) musicPlayer.volume = Math.max(0, Math.min(1, to));
        if (onDone) onDone();
      }
    }, stepTime);
  }

  function setMusicVolume(vol) {
    musicVolume = Math.max(0, Math.min(1, vol));
    if (musicPlayer && !musicPlayer.paused) {
      musicPlayer.volume = musicVolume;
    }
  }

  return { correct, wrong, buttonPress, powerUsed, victory, defeat, toggle, isEnabled, resume, playIntroMusic, stopIntroMusic, playWorldMusic, playFreestyleMusic, stopMusic, setMusicVolume };
})();

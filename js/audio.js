// audio.js — Sound effects using Web Audio API

const Audio = (() => {
  let ctx = null;
  let enabled = true;

  function getContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

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
    } catch (e) {
      // Silently fail if audio not available
    }
  }

  function correct() {
    playTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(1000, 0.1, 'sine', 0.2), 80);
  }

  function wrong() {
    playTone(200, 0.15, 'square', 0.15);
  }

  function buttonPress() {
    playTone(600, 0.05, 'sine', 0.1);
  }

  function powerUsed() {
    // Whoosh-like sound
    if (!enabled) return;
    try {
      const c = getContext();
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
      gain.connect(c.destination);
      source.start(c.currentTime);
    } catch (e) {}
  }

  function victory() {
    // Ascending arpeggio
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 120);
    });
  }

  function defeat() {
    // Descending tone
    playTone(400, 0.3, 'sine', 0.2);
    setTimeout(() => playTone(250, 0.4, 'sine', 0.2), 200);
  }

  function toggle() {
    enabled = !enabled;
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

  return { correct, wrong, buttonPress, powerUsed, victory, defeat, toggle, isEnabled, resume };
})();

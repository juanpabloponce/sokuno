// sleepbar.js — Sleep bar mechanics

const SleepBar = (() => {
  let value = 50;        // percentage 0-100
  let drainRate = 0.5;   // % per second
  let difficultyMultiplier = 1.0; // easy=0.5, normal=1.0, hard=1.5
  let frozen = false;
  let freezeTimer = null;
  let drainInterval = null;
  let onUpdate = null;
  let onEmpty = null;
  let onFull = null;
  let streak = 0;

  function init(options = {}) {
    value = options.startValue || 50;
    drainRate = options.drainRate || 0.5;
    streak = 0;
    frozen = false;
    if (freezeTimer) clearTimeout(freezeTimer);
    if (drainInterval) clearInterval(drainInterval);
    onUpdate = options.onUpdate || null;
    onEmpty = options.onEmpty || null;
    onFull = options.onFull || null;
    update();
  }

  function startDrain() {
    if (drainInterval) clearInterval(drainInterval);
    drainInterval = setInterval(() => {
      if (!frozen) {
        value = Math.max(0, value - (drainRate * difficultyMultiplier / 10));
        update();
        if (value <= 0 && onEmpty) {
          stopDrain();
          onEmpty();
        }
      }
    }, 100); // tick every 100ms
  }

  function stopDrain() {
    if (drainInterval) {
      clearInterval(drainInterval);
      drainInterval = null;
    }
  }

  function correctAnswer() {
    streak++;
    const bonus = Math.min(streak, 5); // max streak bonus of 5
    const gain = 2.5 + bonus;
    value = Math.min(100, value + gain);
    update();
    if (value >= 100 && onFull) {
      stopDrain();
      onFull();
    }
  }

  function correctAnswerScaled(multiplier) {
    streak++;
    var bonus = Math.min(streak, 5);
    var gain = (2.5 + bonus) * multiplier;
    value = Math.min(100, value + gain);
    update();
    if (value >= 100 && onFull) {
      stopDrain();
      onFull();
    }
  }

  function wrongAnswer() {
    streak = 0;
    value = Math.max(0, value - 6);
    update();
    if (value <= 0 && onEmpty) {
      stopDrain();
      onEmpty();
    }
  }

  function wrongAnswerCustom(penalty) {
    streak = 0;
    value = Math.max(0, value - penalty);
    update();
    if (value <= 0 && onEmpty) {
      stopDrain();
      onEmpty();
    }
  }

  function freeze(duration = 5000) {
    frozen = true;
    if (freezeTimer) clearTimeout(freezeTimer);
    freezeTimer = setTimeout(() => {
      frozen = false;
      freezeTimer = null;
    }, duration);
  }

  function restore(amount = 20) {
    value = Math.min(100, value + amount);
    update();
  }

  function update() {
    if (onUpdate) onUpdate(value, frozen);
  }

  function getValue() {
    return value;
  }

  function getStreak() {
    return streak;
  }

  function setDrainRate(rate) {
    drainRate = rate;
  }

  function setDifficultyMultiplier(mult) {
    difficultyMultiplier = Math.max(0.1, mult);
  }

  function getDrainConfig(worldId, stageNum) {
    // Base drain rates scale with difficulty
    let rate;
    if (stageNum <= 3) rate = 0.515;
    else if (stageNum <= 6) rate = 0.773;
    else if (stageNum <= 9) rate = 1.16;
    else rate = 1.675; // stage 10

    // Worlds get progressively harder
    rate += (worldId - 1) * 0.13;

    let startValue = stageNum === 10 ? 25 : 45;

    // The Abyss (World 7) — custom difficulty per stage from design doc
    if (worldId === 7) {
      var abyssConfigs = [
        null,
        { startValue: 30, drainRate: 1.2 },   // Stage 1
        { startValue: 28, drainRate: 1.4 },   // Stage 2
        { startValue: 25, drainRate: 1.6 },   // Stage 3
        { startValue: 22, drainRate: 1.8 },   // Stage 4
        { startValue: 20, drainRate: 2.0 },   // Stage 5
        { startValue: 18, drainRate: 2.2 },   // Stage 6
        { startValue: 17, drainRate: 2.3 },   // Stage 7
        { startValue: 16, drainRate: 2.4 },   // Stage 8
        { startValue: 15, drainRate: 2.45 },  // Stage 9
        { startValue: 15, drainRate: 2.5 }    // Stage 10 (Final Battle)
      ];
      return abyssConfigs[stageNum] || { startValue: 20, drainRate: 2.0 };
    }

    return { drainRate: rate, startValue };
  }

  function destroy() {
    stopDrain();
    if (freezeTimer) clearTimeout(freezeTimer);
  }

  return {
    init, startDrain, stopDrain, correctAnswer, correctAnswerScaled,
    wrongAnswer, wrongAnswerCustom,
    freeze, restore, getValue, getStreak, setDrainRate,
    setDifficultyMultiplier, getDrainConfig, destroy, update
  };
})();

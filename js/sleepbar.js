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

    // Ocean (World 6) — custom difficulty per stage (reduced 15%)
    if (worldId === 6) {
      var oceanConfigs = [
        null,
        { startValue: 52, drainRate: 0.99 },   // Stage 1
        { startValue: 52, drainRate: 1.05 },   // Stage 2
        { startValue: 52, drainRate: 1.1 },    // Stage 3
        { startValue: 52, drainRate: 1.21 },   // Stage 4
        { startValue: 52, drainRate: 1.3 },    // Stage 5
        { startValue: 52, drainRate: 1.38 },   // Stage 6
        { startValue: 52, drainRate: 1.46 },   // Stage 7
        { startValue: 52, drainRate: 1.5 },    // Stage 8
        { startValue: 52, drainRate: 1.54 },   // Stage 9
        { startValue: 29, drainRate: 1.98 }    // Stage 10
      ];
      return oceanConfigs[stageNum] || { startValue: 52, drainRate: 1.3 };
    }

    // The Abyss (World 7) — custom difficulty per stage (reduced 15%)
    if (worldId === 7) {
      var abyssConfigs = [
        null,
        { startValue: 35, drainRate: 1.02 },   // Stage 1
        { startValue: 32, drainRate: 1.19 },   // Stage 2
        { startValue: 29, drainRate: 1.36 },   // Stage 3
        { startValue: 25, drainRate: 1.53 },   // Stage 4
        { startValue: 23, drainRate: 1.7 },    // Stage 5
        { startValue: 21, drainRate: 1.87 },   // Stage 6
        { startValue: 20, drainRate: 1.96 },   // Stage 7
        { startValue: 18, drainRate: 2.04 },   // Stage 8
        { startValue: 17, drainRate: 2.08 },   // Stage 9
        { startValue: 17, drainRate: 2.13 }    // Stage 10 (Final Battle)
      ];
      return abyssConfigs[stageNum] || { startValue: 23, drainRate: 1.7 };
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

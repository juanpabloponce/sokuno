// powers.js — Guardian powers system with charge bar mechanics

const Powers = (() => {
  let usesRemaining = {};
  let chargeState = {};
  let onPowerUsed = null;
  let chosenGuardianId = null; // only one guardian active per world
  let activeWorldId = null;    // current world for resonance checks

  const POWER_DEFS = {
    freeze:      { id: 'freeze',      name: 'Freeze',       icon: 'assets/guardians/ice.svg',    guardian: 'Fubuki', desc: 'Stops bar drain for 5 seconds', maxUses: 3, chargeCost: 5,  worldUnlock: 1 },
    insight:     { id: 'insight',     name: 'Insight',      icon: 'assets/guardians/psy.svg',    guardian: 'Omoi',   desc: 'Reveals first half of answer', maxUses: 2, chargeCost: 6,  worldUnlock: 2 },
    restore:     { id: 'restore',     name: 'Restore',      icon: 'assets/guardians/nature.svg', guardian: 'Midori', desc: 'Recovers 20% of sleep bar', maxUses: 2, chargeCost: 8,  worldUnlock: 3 },
    cosmicSolve: { id: 'cosmicSolve', name: 'Cosmic Solve', icon: 'assets/guardians/cosmos.svg', guardian: 'Uchū',   desc: 'Auto-completes current problem', maxUses: 1, chargeCost: 12, worldUnlock: 4 },
    blazeSkip:   { id: 'blazeSkip',   name: 'Blaze Skip',   icon: 'assets/guardians/fire.svg',   guardian: 'Kaen',   desc: 'Skips problem without penalty', maxUses: 3, chargeCost: 5,  worldUnlock: 5 },
    simplify:    { id: 'simplify',    name: 'Simplify',     icon: 'assets/guardians/ocean.svg',  guardian: 'Nami',   desc: 'Reduces problem to easier numbers', maxUses: 2, chargeCost: 6,  worldUnlock: 6 }
  };

  // Map worldId -> powerId (native guardian of that world)
  const WORLD_NATIVE = { 1: 'freeze', 2: 'insight', 3: 'restore', 4: 'cosmicSolve', 5: 'blazeSkip', 6: 'simplify' };

  // --- Guardian Resonance ---
  // When a guardian fights in their home world, charge cost is reduced (~35%)
  // World 7 (The Abyss) has NO resonance — all guardians are away from home
  const RESONANCE_REDUCTION = 0.65; // effective cost = base * 0.65 (35% faster charge)

  function setActiveWorld(worldId) {
    activeWorldId = worldId;
  }

  function getActiveWorld() {
    return activeWorldId;
  }

  function isResonant(powerId, worldId) {
    const wId = worldId !== undefined ? worldId : activeWorldId;
    if (!wId || wId === 7) return false; // No resonance in The Abyss
    return WORLD_NATIVE[wId] === powerId;
  }

  function getEffectiveChargeCost(powerId) {
    const baseCost = POWER_DEFS[powerId].chargeCost;
    if (isResonant(powerId)) {
      return Math.round(baseCost * RESONANCE_REDUCTION);
    }
    return baseCost;
  }

  function init(saveData, callback) {
    onPowerUsed = callback;
    chosenGuardianId = null;
    resetUses();
  }

  function setChosenGuardian(powerId) {
    chosenGuardianId = powerId;
  }

  function getChosenGuardian() {
    return chosenGuardianId;
  }

  function getNativePower(worldId) {
    return WORLD_NATIVE[worldId] || null;
  }

  function getUnlockedPowers(saveData) {
    const result = [];
    for (const key of Object.keys(POWER_DEFS)) {
      if (isUnlocked(key, saveData)) {
        result.push(key);
      }
    }
    return result;
  }

  function resetUses() {
    for (const key of Object.keys(POWER_DEFS)) {
      usesRemaining[key] = POWER_DEFS[key].maxUses;
      chargeState[key] = {
        currentCharge: 0,
        timesUsed: 0,
        isReady: false,
        isExhausted: false
      };
    }
  }

  function isUnlocked(powerId, saveData) {
    return saveData.powers[powerId] && saveData.powers[powerId].unlocked;
  }

  function isChosenGuardian(powerId) {
    return chosenGuardianId === powerId || chosenGuardianId === 'all';
  }

  function canUse(powerId, saveData) {
    const state = chargeState[powerId];
    return isChosenGuardian(powerId) && isUnlocked(powerId, saveData)
      && state && state.isReady && !state.isExhausted;
  }

  function use(powerId) {
    const state = chargeState[powerId];
    if (!state || !state.isReady || state.isExhausted) return false;

    state.timesUsed++;
    state.currentCharge = 0;
    state.isReady = false;

    if (state.timesUsed >= POWER_DEFS[powerId].maxUses) {
      state.isExhausted = true;
    }

    // Keep usesRemaining in sync for any legacy references
    usesRemaining[powerId] = POWER_DEFS[powerId].maxUses - state.timesUsed;

    if (onPowerUsed) onPowerUsed(powerId, usesRemaining[powerId]);
    return true;
  }

  function getUses(powerId) {
    return usesRemaining[powerId] || 0;
  }

  function getDef(powerId) {
    return POWER_DEFS[powerId];
  }

  function getAllDefs() {
    return POWER_DEFS;
  }

  function unlockPower(powerId, saveData) {
    if (saveData.powers[powerId]) {
      saveData.powers[powerId].unlocked = true;
    }
    return saveData;
  }

  // --- Charge Bar System ---

  function calculateCharge(isCorrect, answerTimeMs, currentStreak, isAbyssMode) {
    if (!isCorrect) return 0;

    let charge = 1.0;

    // Fast answer bonus (≤ 3 seconds)
    if (answerTimeMs <= 3000) {
      charge += 0.5;
    }

    // Streak bonus (3+ consecutive correct)
    if (currentStreak >= 3) {
      charge += 0.25;
    }

    // Abyss mode reduction (60% speed across 6 bars)
    if (isAbyssMode) {
      charge *= 0.6;
    }

    return charge;
  }

  function addCharge(powerId, chargeAmount) {
    const state = chargeState[powerId];
    if (!state || state.isExhausted) return state;

    const effectiveCost = getEffectiveChargeCost(powerId);
    state.currentCharge = Math.min(state.currentCharge + chargeAmount, effectiveCost);

    if (state.currentCharge >= effectiveCost) {
      state.isReady = true;
    }

    return state;
  }

  function getChargeState(powerId) {
    return chargeState[powerId] || null;
  }

  function getChargePercent(powerId) {
    const state = chargeState[powerId];
    if (!state) return 0;
    const effectiveCost = getEffectiveChargeCost(powerId);
    return Math.min(1, state.currentCharge / effectiveCost);
  }

  return {
    init, resetUses, isUnlocked, canUse, use, getUses, getDef, getAllDefs,
    unlockPower, setChosenGuardian, getChosenGuardian, getNativePower,
    getUnlockedPowers, isChosenGuardian,
    calculateCharge, addCharge, getChargeState, getChargePercent,
    setActiveWorld, getActiveWorld, isResonant, getEffectiveChargeCost
  };
})();

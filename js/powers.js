// powers.js — Guardian powers system

const Powers = (() => {
  let usesRemaining = {};
  let onPowerUsed = null;
  let chosenGuardianId = null; // only one guardian active per world

  const POWER_DEFS = {
    freeze:      { id: 'freeze',      name: 'Freeze',       icon: 'assets/guardians/ice.svg',    guardian: 'Fubuki', desc: 'Stops bar drain for 5 seconds', maxUses: 2, worldUnlock: 1 },
    insight:     { id: 'insight',     name: 'Insight',      icon: 'assets/guardians/psy.svg',    guardian: 'Omoi',   desc: 'Reveals first half of answer', maxUses: 2, worldUnlock: 2 },
    restore:     { id: 'restore',     name: 'Restore',      icon: 'assets/guardians/nature.svg', guardian: 'Midori', desc: 'Recovers 20% of sleep bar', maxUses: 2, worldUnlock: 3 },
    cosmicSolve: { id: 'cosmicSolve', name: 'Cosmic Solve', icon: 'assets/guardians/cosmos.svg', guardian: 'Uchū',   desc: 'Auto-completes current problem', maxUses: 1, worldUnlock: 4 },
    blazeSkip:   { id: 'blazeSkip',   name: 'Blaze Skip',   icon: 'assets/guardians/fire.svg',   guardian: 'Kaen',   desc: 'Skips problem without penalty', maxUses: 2, worldUnlock: 5 },
    simplify:    { id: 'simplify',    name: 'Simplify',     icon: 'assets/guardians/ocean.svg',  guardian: 'Nami',   desc: 'Reduces problem to easier numbers', maxUses: 2, worldUnlock: 6 }
  };

  // Map worldId -> powerId (native guardian of that world)
  const WORLD_NATIVE = { 1: 'freeze', 2: 'insight', 3: 'restore', 4: 'cosmicSolve', 5: 'blazeSkip', 6: 'simplify' };

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
    // Returns list of power IDs the player has unlocked
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
    }
  }

  function isUnlocked(powerId, saveData) {
    return saveData.powers[powerId] && saveData.powers[powerId].unlocked;
  }

  function isChosenGuardian(powerId) {
    return chosenGuardianId === powerId || chosenGuardianId === 'all';
  }

  function canUse(powerId, saveData) {
    return isChosenGuardian(powerId) && isUnlocked(powerId, saveData) && usesRemaining[powerId] > 0;
  }

  function use(powerId) {
    if (usesRemaining[powerId] <= 0) return false;
    usesRemaining[powerId]--;
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

  return {
    init, resetUses, isUnlocked, canUse, use, getUses, getDef, getAllDefs,
    unlockPower, setChosenGuardian, getChosenGuardian, getNativePower,
    getUnlockedPowers, isChosenGuardian
  };
})();

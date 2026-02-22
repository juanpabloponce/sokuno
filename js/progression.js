// progression.js — Stage/World/Star progression

const Progression = (() => {

  function completeStage(saveData, worldId, stageNum, errors) {
    const worldKey = String(worldId);
    const stageKey = String(stageNum);

    if (!saveData.worlds[worldKey]) {
      saveData.worlds[worldKey] = { unlocked: true, stages: {} };
    }

    // Calculate stars
    let stars;
    if (errors === 0) stars = 3;
    else if (errors <= 3) stars = 2;
    else stars = 1;

    // Only update if new star count is higher
    const existing = saveData.worlds[worldKey].stages[stageKey];
    if (!existing || existing.stars < stars) {
      saveData.worlds[worldKey].stages[stageKey] = { completed: true, stars };
    } else {
      saveData.worlds[worldKey].stages[stageKey].completed = true;
    }

    // Unlock next world if stage 10 completed
    if (stageNum === 10 && worldId < 7) {
      const nextWorld = String(worldId + 1);
      if (!saveData.worlds[nextWorld]) {
        saveData.worlds[nextWorld] = { unlocked: true, stages: {} };
      }
      saveData.worlds[nextWorld].unlocked = true;

      // Unlock the guardian power (worlds 1-6 only, world 7 has no guardian power)
      const powerMap = { 1: 'freeze', 2: 'insight', 3: 'restore', 4: 'cosmicSolve', 5: 'blazeSkip', 6: 'simplify' };
      const powerId = powerMap[worldId];
      if (powerId && saveData.powers[powerId]) {
        saveData.powers[powerId].unlocked = true;
      }
    }

    return { saveData, stars };
  }

  function isStageUnlocked(saveData, worldId, stageNum) {
    const worldKey = String(worldId);
    if (!saveData.worlds[worldKey] || !saveData.worlds[worldKey].unlocked) return false;
    if (stageNum === 1) return true;
    // Previous stage must be completed
    const prevStage = saveData.worlds[worldKey].stages[String(stageNum - 1)];
    return prevStage && prevStage.completed;
  }

  function isWorldUnlocked(saveData, worldId) {
    const worldKey = String(worldId);
    return saveData.worlds[worldKey] && saveData.worlds[worldKey].unlocked;
  }

  function getStageStars(saveData, worldId, stageNum) {
    const worldKey = String(worldId);
    const stageKey = String(stageNum);
    const stage = saveData.worlds[worldKey]?.stages[stageKey];
    return stage ? stage.stars : 0;
  }

  function getWorldTotalStars(saveData, worldId) {
    const worldKey = String(worldId);
    const stages = saveData.worlds[worldKey]?.stages || {};
    let total = 0;
    for (const key of Object.keys(stages)) {
      total += stages[key].stars || 0;
    }
    return total;
  }

  function getTotalStars(saveData) {
    let total = 0;
    for (let w = 1; w <= 7; w++) {
      total += getWorldTotalStars(saveData, w);
    }
    return total;
  }

  function isWorldComplete(saveData, worldId) {
    const worldKey = String(worldId);
    const stages = saveData.worlds[worldKey]?.stages || {};
    return stages['10'] && stages['10'].completed;
  }

  function isGameComplete(saveData) {
    for (let w = 1; w <= 7; w++) {
      if (!isWorldComplete(saveData, w)) return false;
    }
    return true;
  }

  return {
    completeStage, isStageUnlocked, isWorldUnlocked,
    getStageStars, getWorldTotalStars, getTotalStars,
    isWorldComplete, isGameComplete
  };
})();

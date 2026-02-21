// game.js — Main game controller

const Game = (() => {
  let saveData = null;
  let worldsData = null;
  let currentProblem = null;
  let currentWorld = 1;
  let currentStage = 1;
  let stageErrors = 0;
  let stageProblems = 0;
  let chosenGuardian = null;
  let gameState = 'title'; // title, worldmap, guardian-pick, stageselect, playing, victory, defeat

  async function init() {
    saveData = Storage.load();

    // Load world data
    try {
      const resp = await fetch('data/worlds.json');
      worldsData = await resp.json();
    } catch (e) {
      console.warn('Failed to load worlds data:', e);
    }

    await Dialogue.loadDialogues();
    Powers.init(saveData, onPowerUsed);

    showScreen('title');
    bindGlobalEvents();
  }

  function bindGlobalEvents() {
    // Title screen
    document.getElementById('btn-start').addEventListener('click', () => {
      Audio.resume();
      Audio.buttonPress();
      if (!saveData.storyProgress.introSeen) {
        saveData.storyProgress.introSeen = true;
        Storage.save(saveData);
        Dialogue.show('intro', () => {
          // Reload saveData to get the playerName that was entered during intro
          saveData = Storage.load();
          showWorldMap();
        });
      } else {
        showWorldMap();
      }
    });

    // Sound toggle
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      const enabled = Audio.toggle();
      document.getElementById('btn-sound').textContent = enabled ? '🔊' : '🔇';
    });

    // Back buttons
    document.getElementById('btn-back-worldmap')?.addEventListener('click', () => {
      Audio.buttonPress();
      showGuardianPicker(currentWorld);
    });

    document.getElementById('btn-back-guardian')?.addEventListener('click', () => {
      Audio.buttonPress();
      showWorldMap();
    });

    // Reset (hold for 3 seconds in title)
    let resetTimer = null;
    document.getElementById('btn-reset')?.addEventListener('mousedown', () => {
      resetTimer = setTimeout(() => {
        saveData = Storage.reset();
        location.reload();
      }, 3000);
    });
    document.getElementById('btn-reset')?.addEventListener('mouseup', () => {
      clearTimeout(resetTimer);
    });
  }

  // --- Screen Management ---

  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('screen-enter');
    });
    const target = document.getElementById(`screen-${screenId}`);
    target.classList.remove('hidden');
    // Trigger entrance animation
    void target.offsetWidth; // force reflow
    target.classList.add('screen-enter');
    gameState = screenId;
  }

  // --- World Map ---

  function showWorldMap() {
    showScreen('worldmap');
    renderWorldMap();
  }

  function renderWorldMap() {
    const container = document.getElementById('world-list');
    container.innerHTML = '';

    const worlds = worldsData.worlds;
    worlds.forEach(world => {
      const unlocked = Progression.isWorldUnlocked(saveData, world.id);
      const complete = Progression.isWorldComplete(saveData, world.id);
      const stars = Progression.getWorldTotalStars(saveData, world.id);

      const div = document.createElement('div');
      div.className = `world-card ${unlocked ? 'unlocked' : 'locked'} ${complete ? 'complete' : ''}`;
      div.style.setProperty('--world-primary', world.colors.primary);
      div.style.setProperty('--world-secondary', world.colors.secondary);
      div.style.setProperty('--world-accent', world.colors.accent);

      div.innerHTML = `
        <div class="world-emoji">${world.guardianEmoji}</div>
        <div class="world-info">
          <div class="world-name">${world.name}</div>
          <div class="world-guardian">${world.guardian}</div>
          <div class="world-stars">${'⭐'.repeat(Math.min(stars, 30))} ${stars}/30</div>
        </div>
        ${!unlocked ? '<div class="world-lock">🔒</div>' : ''}
      `;

      if (unlocked) {
        div.addEventListener('click', () => {
          Audio.buttonPress();
          currentWorld = world.id;
          showGuardianPicker(world.id);
        });
      }

      container.appendChild(div);
    });
  }

  // --- Guardian Picker ---

  function showGuardianPicker(worldId) {
    currentWorld = worldId;
    const unlockedPowers = Powers.getUnlockedPowers(saveData);
    const nativePower = Powers.getNativePower(worldId);

    // If no guardians unlocked yet, skip picker and go directly to stages with no power
    if (unlockedPowers.length === 0) {
      chosenGuardian = null;
      Powers.setChosenGuardian(null);
      showStageSelect(worldId);
      return;
    }

    showScreen('guardian-pick');
    const container = document.getElementById('guardian-pick-list');
    container.innerHTML = '';

    const allDefs = Powers.getAllDefs();

    // Build a sorted list: native guardian first, then unlocked, then locked
    const powerKeys = Object.keys(allDefs);
    const sorted = powerKeys.sort((a, b) => {
      const aIsNative = a === nativePower;
      const bIsNative = b === nativePower;
      const aUnlocked = unlockedPowers.includes(a);
      const bUnlocked = unlockedPowers.includes(b);

      if (aIsNative && !bIsNative) return -1;
      if (!aIsNative && bIsNative) return 1;
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return allDefs[a].worldUnlock - allDefs[b].worldUnlock;
    });

    sorted.forEach(key => {
      const def = allDefs[key];
      const unlocked = unlockedPowers.includes(key);
      const isNative = key === nativePower;

      const div = document.createElement('div');
      div.className = `guardian-option ${unlocked ? '' : 'locked'} ${isNative && unlocked ? 'native' : ''}`;

      div.innerHTML = `
        <div class="guardian-opt-emoji">${def.emoji}</div>
        <div class="guardian-opt-info">
          <div class="guardian-opt-name">${def.guardian}</div>
          <div class="guardian-opt-power">${def.name}</div>
          <div class="guardian-opt-desc">${def.desc}</div>
        </div>
        ${isNative && unlocked ? '<span class="guardian-opt-tag">Native</span>' : ''}
        ${!unlocked ? '<span class="guardian-opt-lock">🔒</span>' : ''}
      `;

      if (unlocked) {
        div.addEventListener('click', () => {
          Audio.buttonPress();
          chosenGuardian = key;
          Powers.setChosenGuardian(key);
          showStageSelect(worldId);
        });
      }

      container.appendChild(div);
    });
  }

  // --- Stage Select ---

  function showStageSelect(worldId) {
    showScreen('stageselect');
    currentWorld = worldId;
    const world = worldsData.worlds[worldId - 1];

    document.getElementById('stage-world-name').textContent = `${world.guardianEmoji} ${world.name} Realm`;
    document.getElementById('stage-world-name').style.color = world.colors.primary;

    // Show chosen companion badge
    const companionEl = document.getElementById('stage-companion');
    if (chosenGuardian) {
      const def = Powers.getDef(chosenGuardian);
      companionEl.innerHTML = `
        <span class="companion-emoji">${def.emoji}</span>
        Companion: <span class="companion-name">${def.guardian}</span>
      `;
    } else {
      companionEl.innerHTML = '<span style="opacity:0.5;">No companion</span>';
    }

    const container = document.getElementById('stage-list');
    container.innerHTML = '';

    for (let s = 1; s <= 10; s++) {
      const unlocked = Progression.isStageUnlocked(saveData, worldId, s);
      const stars = Progression.getStageStars(saveData, worldId, s);

      const div = document.createElement('div');
      div.className = `stage-card ${unlocked ? 'unlocked' : 'locked'} ${s === 10 ? 'boss' : ''}`;
      div.style.setProperty('--world-accent', world.colors.accent);

      div.innerHTML = `
        <div class="stage-number">${s === 10 ? '👑' : s}</div>
        <div class="stage-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        ${!unlocked ? '<div class="stage-lock">🔒</div>' : ''}
      `;

      if (unlocked) {
        div.addEventListener('click', () => {
          Audio.buttonPress();
          currentStage = s;
          startStage(worldId, s);
        });
      }

      container.appendChild(div);
    }
  }

  // --- Start Stage ---

  function startStage(worldId, stageNum) {
    currentWorld = worldId;
    currentStage = stageNum;
    stageErrors = 0;
    stageProblems = 0;
    Problems.resetHistory();

    const introKey = `world${worldId}IntroSeen`;

    // Check if world intro needs showing
    if (!saveData.storyProgress[introKey] && stageNum === 1) {
      saveData.storyProgress[introKey] = true;
      Storage.save(saveData);
      Dialogue.show(`worldIntro_${worldId}`, () => {
        beginGameplay(worldId, stageNum);
      });
      return;
    }

    // Check if stage 10 intro needs showing
    if (stageNum === 10) {
      Dialogue.show(`stage10Intro_${worldId}`, () => {
        beginGameplay(worldId, stageNum);
      });
      return;
    }

    beginGameplay(worldId, stageNum);
  }

  function beginGameplay(worldId, stageNum) {
    showScreen('game');
    applyWorldTheme(worldId);

    // Setup sleep bar
    const config = SleepBar.getDrainConfig(worldId, stageNum);
    SleepBar.init({
      startValue: config.startValue,
      drainRate: config.drainRate,
      onUpdate: updateSleepBarUI,
      onEmpty: onStageFailed,
      onFull: onStageComplete
    });

    // Setup calculator
    Calculator.init(onAnswerSubmit);

    // Setup powers — only the chosen guardian
    Powers.resetUses();
    renderPowerButtons();

    // Show world/stage info
    const world = worldsData.worlds[worldId - 1];
    document.getElementById('game-world-label').textContent = `${world.guardianEmoji} ${world.name} — Stage ${stageNum}`;

    // Generate first problem
    nextProblem();

    // Start the bar drain
    SleepBar.startDrain();
  }

  function applyWorldTheme(worldId) {
    const world = worldsData.worlds[worldId - 1];
    const gameScreen = document.getElementById('screen-game');
    gameScreen.style.setProperty('--world-primary', world.colors.primary);
    gameScreen.style.setProperty('--world-secondary', world.colors.secondary);
    gameScreen.style.setProperty('--world-accent', world.colors.accent);
  }

  // --- Problem Flow ---

  function nextProblem() {
    currentProblem = Problems.generateProblem(currentWorld, currentStage);
    renderProblem();
    Calculator.clear();
    Calculator.setDisabled(false);
  }

  function renderProblem() {
    const el = document.getElementById('problem-display');
    el.textContent = `${currentProblem.a} ${currentProblem.symbol} ${currentProblem.b} = ?`;
  }

  function onAnswerSubmit(playerAnswer) {
    Calculator.setDisabled(true);
    stageProblems++;
    saveData.stats.totalProblems++;

    if (playerAnswer === currentProblem.answer) {
      // Correct
      saveData.stats.totalCorrect++;
      Audio.correct();
      Calculator.showFeedback(true);
      SleepBar.correctAnswer();
      showParticles(true);
      // Combo scale boost on streak
      if (SleepBar.getStreak() >= 3) {
        const answerEl = document.getElementById('answer-display');
        answerEl.classList.add('combo-boost');
        setTimeout(() => answerEl.classList.remove('combo-boost'), 350);
      }
    } else {
      // Wrong
      stageErrors++;
      Audio.wrong();
      Calculator.showFeedback(false);
      SleepBar.wrongAnswer();
      showParticles(false);
    }

    Storage.save(saveData);

    // Next problem after brief delay
    setTimeout(() => {
      if (gameState === 'game') {
        nextProblem();
      }
    }, 350);
  }

  // --- Stage End ---

  function onStageComplete() {
    gameState = 'victory';
    SleepBar.stopDrain();
    Calculator.setDisabled(true);
    Audio.victory();

    const result = Progression.completeStage(saveData, currentWorld, currentStage, stageErrors);
    saveData = result.saveData;
    Storage.save(saveData);

    // Check if this was stage 10 (awakening)
    if (currentStage === 10) {
      Dialogue.show(`awakening_${currentWorld}`, () => {
        // Check if game is complete
        if (Progression.isGameComplete(saveData)) {
          Dialogue.show('finale', () => showVictoryScreen(result.stars));
        } else {
          showVictoryScreen(result.stars);
        }
      });
    } else {
      showVictoryScreen(result.stars);
    }
  }

  function showVictoryScreen(stars) {
    showScreen('victory');
    document.getElementById('victory-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('victory-errors').textContent = `Errors: ${stageErrors}`;
    document.getElementById('victory-problems').textContent = `Problems solved: ${stageProblems}`;

    document.getElementById('btn-next-stage').onclick = () => {
      Audio.buttonPress();
      if (currentStage < 10) {
        startStage(currentWorld, currentStage + 1);
      } else {
        showWorldMap();
      }
    };

    document.getElementById('btn-victory-worldmap').onclick = () => {
      Audio.buttonPress();
      showWorldMap();
    };
  }

  function onStageFailed() {
    gameState = 'defeat';
    SleepBar.stopDrain();
    Calculator.setDisabled(true);
    Audio.defeat();

    showScreen('defeat');
    document.getElementById('defeat-message').textContent = 'The Nightmares wake you up...';

    document.getElementById('btn-retry').onclick = () => {
      Audio.buttonPress();
      startStage(currentWorld, currentStage);
    };

    document.getElementById('btn-defeat-worldmap').onclick = () => {
      Audio.buttonPress();
      showWorldMap();
    };
  }

  // --- Powers ---

  function renderPowerButtons() {
    const container = document.getElementById('power-buttons');
    container.innerHTML = '';

    // Only show the chosen guardian's power
    if (!chosenGuardian) return;

    const def = Powers.getDef(chosenGuardian);
    if (!def) return;

    const uses = Powers.getUses(chosenGuardian);

    const btn = document.createElement('button');
    btn.className = 'power-btn unlocked';
    btn.dataset.power = chosenGuardian;
    btn.innerHTML = `
      <span class="power-emoji">${def.emoji}</span>
      <span class="power-uses">${uses}</span>
    `;
    btn.title = `${def.name}`;

    if (uses > 0) {
      btn.addEventListener('click', () => {
        Audio.resume();
        usePower(chosenGuardian);
      });
    } else {
      btn.classList.add('spent');
    }

    container.appendChild(btn);
  }

  function usePower(powerId) {
    if (!Powers.canUse(powerId, saveData)) return;

    switch (powerId) {
      case 'freeze':
        Powers.use(powerId);
        SleepBar.freeze(5000);
        Audio.powerUsed();
        showPowerEffect('❄️ Freeze!');
        break;

      case 'insight': {
        Powers.use(powerId);
        Audio.powerUsed();
        const ansStr = String(currentProblem.answer);
        const half = ansStr.substring(0, Math.ceil(ansStr.length / 2));
        Calculator.setAnswer(half);
        showPowerEffect('🔮 Insight!');
        break;
      }

      case 'restore':
        Powers.use(powerId);
        SleepBar.restore(20);
        Audio.powerUsed();
        showPowerEffect('🌿 Restore!');
        break;

      case 'cosmicSolve':
        Powers.use(powerId);
        Audio.powerUsed();
        Calculator.setAnswer(currentProblem.answer);
        showPowerEffect('👾 Cosmic Solve!');
        setTimeout(() => onAnswerSubmit(currentProblem.answer), 500);
        break;

      case 'blazeSkip':
        Powers.use(powerId);
        Audio.powerUsed();
        showPowerEffect('🔥 Blaze Skip!');
        setTimeout(() => nextProblem(), 300);
        break;

      case 'simplify':
        Powers.use(powerId);
        Audio.powerUsed();
        currentProblem = Problems.simplifyProblem(currentProblem);
        renderProblem();
        Calculator.clear();
        showPowerEffect('🌊 Simplify!');
        break;
    }

    renderPowerButtons();
  }

  function onPowerUsed(powerId, remaining) {
    // Callback from Powers module
  }

  function showPowerEffect(text) {
    const el = document.getElementById('power-effect');
    el.textContent = text;
    el.classList.remove('hidden');
    el.classList.add('show');
    setTimeout(() => {
      el.classList.remove('show');
      el.classList.add('hidden');
    }, 1000);
  }

  // --- UI Updates ---

  function updateSleepBarUI(value, frozen) {
    const bar = document.getElementById('sleep-bar-fill');
    const container = document.getElementById('sleep-bar');
    if (!bar) return;

    bar.style.width = `${value}%`;

    // Color gradient based on value
    if (value > 70) {
      bar.style.background = 'linear-gradient(90deg, #9B5DE5, #FFD700)';
    } else if (value > 40) {
      bar.style.background = 'linear-gradient(90deg, #9B5DE5, #5BC0EB)';
    } else {
      bar.style.background = 'linear-gradient(90deg, #4a0e4e, #9B5DE5)';
    }

    // Frozen effect
    container.classList.toggle('frozen', frozen);

    // Pulse when rising
    if (value > 80) {
      bar.classList.add('pulse');
    } else {
      bar.classList.remove('pulse');
    }
  }

  function showParticles(correct) {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < (correct ? 6 : 3); i++) {
      const particle = document.createElement('div');
      particle.className = `particle ${correct ? 'correct' : 'wrong'}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 0.2}s`;
      particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }

  return { init };
})();

// Start game on load
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});

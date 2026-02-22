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
  let finalBattlePhase = 0; // 0 = not in final battle, 1-3 for phases

  // DEBUG: set to true to unlock all worlds/stages/powers for testing, false for normal play
  const DEBUG_UNLOCK_ALL = false;

  function init() {
    saveData = Storage.load();

    // Generate title screen stars (comic-style per-star rhythm)
    createStars('title-stars', 80, null);

    // Load world data from inline script
    worldsData = WORLDS_DATA;

    // v4 narrative migration: reset story flags so existing players see new content
    if (saveData.storyProgress.introV3Seen && !saveData.storyProgress.introV4Seen) {
      saveData.storyProgress.gatheringSeen = false;
      saveData.storyProgress.world7MidpointSeen = false;
      saveData.storyProgress.endingSeen = false;
      for (let w = 1; w <= 7; w++) {
        saveData.storyProgress[`world${w}IntroSeen`] = false;
      }
      Storage.save(saveData);
    }

    Dialogue.loadDialogues();
    Powers.init(saveData, onPowerUsed);

    startWakeupSequence();
    bindGlobalEvents();
  }

  function startWakeupSequence() {
    const wakeup = document.getElementById('screen-wakeup');
    const textEl = document.getElementById('wakeup-text');
    const tapEl = document.querySelector('.wakeup-tap');

    // Type out the message letter by letter
    const lines = ['Hey...', 'Are you there?'];
    let lineIdx = 0;
    let charIdx = 0;
    let html = '';

    function typeNext() {
      if (lineIdx >= lines.length) {
        // Done typing — show tap hint
        setTimeout(() => tapEl.classList.add('visible'), 400);
        return;
      }
      const line = lines[lineIdx];
      if (charIdx === 0 && lineIdx > 0) html += '<br>';
      html += line[charIdx];
      textEl.innerHTML = html;
      textEl.classList.add('visible');
      charIdx++;
      if (charIdx >= line.length) {
        lineIdx++;
        charIdx = 0;
        setTimeout(typeNext, 600);
      } else {
        setTimeout(typeNext, 70 + Math.random() * 40);
      }
    }

    // Start typing after a brief pause from black
    setTimeout(typeNext, 800);

    // On tap — activate audio, fade out, go to title
    let tapped = false;
    function onWakeupTap() {
      if (tapped) return;
      tapped = true;

      // Activate audio
      Audio.resume();
      Audio.playIntroMusic();

      // Fade out wakeup screen
      wakeup.classList.add('fade-out');

      // Show title screen behind
      const title = document.getElementById('screen-title');
      title.classList.remove('hidden');

      // Remove wakeup after fade
      setTimeout(() => {
        wakeup.style.display = 'none';
        gameState = 'title';
      }, 1500);

      wakeup.removeEventListener('click', onWakeupTap);
      wakeup.removeEventListener('touchstart', onWakeupTap);
    }
    wakeup.addEventListener('click', onWakeupTap);
    wakeup.addEventListener('touchstart', onWakeupTap);
  }

  function bindGlobalEvents() {

    document.getElementById('btn-start').addEventListener('click', () => {
      Audio.resume();
      Audio.buttonPress();
      if (!saveData.storyProgress.introV4Seen) {
        saveData.storyProgress.introV4Seen = true;
        saveData.storyProgress.introSeen = true;
        Storage.save(saveData);
        Dialogue.show('intro', () => {
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
      const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
      // Skip guardian picker if: World 7 (all guardians), or no guardians unlocked yet
      if (currentWorld === 7 || unlockedPowers.length === 0) {
        showWorldMap();
      } else {
        showGuardianPicker(currentWorld);
      }
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
    // Clear star containers of hidden screens to reduce DOM weight
    ['title-stars', 'worldmap-stars', 'stageselect-stars', 'game-stars'].forEach(id => clearStars(id));

    const target = document.getElementById(`screen-${screenId}`);
    target.classList.remove('hidden');
    // Trigger entrance animation
    void target.offsetWidth; // force reflow
    target.classList.add('screen-enter');
    gameState = screenId;
  }

  // --- World Map ---

  function showWorldMap() {
    Audio.stopMusic();
    Audio.playIntroMusic();
    showScreen('worldmap');
    createStars('worldmap-stars', 40, null);
    renderWorldMap();
  }

  function renderWorldMap() {
    const container = document.getElementById('world-list');
    container.innerHTML = '';

    if (!worldsData || !worldsData.worlds) {
      container.innerHTML = '<div style="padding:2rem;text-align:center;color:#f66;">Failed to load worlds. Please refresh the page.</div>';
      return;
    }

    const worlds = worldsData.worlds;
    worlds.forEach(world => {
      const unlocked = DEBUG_UNLOCK_ALL || Progression.isWorldUnlocked(saveData, world.id);
      const complete = Progression.isWorldComplete(saveData, world.id);
      const stars = Progression.getWorldTotalStars(saveData, world.id);

      const div = document.createElement('div');
      div.className = `world-card ${unlocked ? 'unlocked' : 'locked'} ${complete ? 'complete' : ''}`;
      div.dataset.world = world.id;
      div.style.setProperty('--world-primary', world.colors.primary);
      div.style.setProperty('--world-secondary', world.colors.secondary);
      div.style.setProperty('--world-accent', world.colors.accent);

      const icon = WORLD_ICONS[world.id] || `<img src="${world.guardianIcon}" class="guardian-seal" alt="${world.guardian}">`;
      div.innerHTML = `
        <div class="world-icon">${icon}</div>
        <div class="world-info">
          <div class="world-name">${world.name}</div>
          <div class="world-guardian">${world.guardian}</div>
          <div class="world-orbs">${worldOrbs(world.id)}</div>
        </div>
        ${!unlocked ? '<div class="world-lock"><img src="assets/lock.svg" class="lock-icon" alt="Locked"></div>' : ''}
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
    const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
    const nativePower = Powers.getNativePower(worldId);

    // If no guardians unlocked yet, skip picker and go directly to stages with no power
    if (unlockedPowers.length === 0) {
      chosenGuardian = null;
      Powers.setChosenGuardian(null);
      showStageSelect(worldId);
      return;
    }

    // World 7 (The Abyss) — all unlocked guardians accompany you, skip picker
    if (worldId === 7) {
      chosenGuardian = 'all';
      Powers.setChosenGuardian('all');
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
        <div class="guardian-opt-emoji"><img src="${def.icon}" class="guardian-seal" alt="${def.guardian}"></div>
        <div class="guardian-opt-info">
          <div class="guardian-opt-name">${def.guardian}</div>
          <div class="guardian-opt-power">${def.name}</div>
          <div class="guardian-opt-desc">${def.desc}</div>
        </div>
        ${isNative && unlocked ? '<span class="guardian-opt-tag">Native</span>' : ''}
        ${!unlocked ? '<span class="guardian-opt-lock"><img src="assets/lock.svg" class="lock-icon-sm" alt="Locked"></span>' : ''}
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
    document.getElementById('screen-stageselect').dataset.world = worldId;
    createStars('stageselect-stars', 40, getWorldStarColor(worldId));
    currentWorld = worldId;
    const world = worldsData.worlds[worldId - 1];

    const stageTitle = document.getElementById('stage-world-name');
    stageTitle.innerHTML = '';
    if (WORLD_ICONS[world.id]) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'world-icon-inline';
      iconSpan.innerHTML = WORLD_ICONS[world.id];
      stageTitle.appendChild(iconSpan);
    }
    stageTitle.appendChild(document.createTextNode(` ${world.name} Realm`));
    // Use accent color for dark worlds (like Cosmos and Abyss) so title is visible
    const titleColor = (worldId === 4 || worldId === 7) ? world.colors.accent : world.colors.primary;
    document.getElementById('stage-world-name').style.color = titleColor;

    // Show chosen companion badge
    const companionEl = document.getElementById('stage-companion');
    if (chosenGuardian === 'all') {
      // World 7: all guardians accompany you
      const allDefs = Powers.getAllDefs();
      const icons = Object.values(allDefs).map(d => `<img src="${d.icon}" class="companion-seal" alt="${d.guardian}">`).join('');
      companionEl.innerHTML = `
        <span class="companion-emoji">${icons}</span>
        All Guardians
      `;
    } else if (chosenGuardian) {
      const def = Powers.getDef(chosenGuardian);
      companionEl.innerHTML = `
        <span class="companion-emoji"><img src="${def.icon}" class="companion-seal" alt="${def.guardian}"></span>
        Companion: <span class="companion-name">${def.guardian}</span>
      `;
    } else {
      companionEl.innerHTML = '<span style="opacity:0.5;">No companion</span>';
    }

    const container = document.getElementById('stage-list');
    container.innerHTML = '';

    for (let s = 1; s <= 10; s++) {
      const unlocked = DEBUG_UNLOCK_ALL || Progression.isStageUnlocked(saveData, worldId, s);
      const stars = Progression.getStageStars(saveData, worldId, s);

      const div = document.createElement('div');
      div.className = `stage-card ${unlocked ? 'unlocked' : 'locked'} ${s === 10 ? 'boss' : ''}`;
      div.style.setProperty('--world-accent', world.colors.accent);

      div.innerHTML = `
        <div class="stage-number">${s === 10 ? '<img src="assets/final-stage.svg" class="final-stage-icon" alt="Boss">' : s}</div>
        <div class="stage-stars">${starIcons(stars, 3)}</div>
        ${!unlocked ? '<div class="stage-lock"><img src="assets/lock.svg" class="lock-icon-sm" alt="Locked"></div>' : ''}
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
    finalBattlePhase = 0;
    Problems.resetHistory();

    const introKey = `world${worldId}IntroSeen`;

    // World 7: Show gathering scene before first entry
    if (worldId === 7 && !saveData.storyProgress.gatheringSeen && stageNum === 1) {
      saveData.storyProgress.gatheringSeen = true;
      Storage.save(saveData);
      Dialogue.show('gathering', () => {
        // Then show world intro
        if (!saveData.storyProgress[introKey]) {
          saveData.storyProgress[introKey] = true;
          Storage.save(saveData);
          Dialogue.show(`worldIntro_${worldId}`, () => {
            beginGameplay(worldId, stageNum);
          });
        } else {
          beginGameplay(worldId, stageNum);
        }
      });
      return;
    }

    // Check if world intro needs showing
    if (!saveData.storyProgress[introKey] && stageNum === 1) {
      saveData.storyProgress[introKey] = true;
      Storage.save(saveData);
      Dialogue.show(`worldIntro_${worldId}`, () => {
        beginGameplay(worldId, stageNum);
      });
      return;
    }

    // World 7 Stage 5: Abyss midpoint dialogue
    if (worldId === 7 && stageNum === 5 && !saveData.storyProgress.world7MidpointSeen) {
      saveData.storyProgress.world7MidpointSeen = true;
      Storage.save(saveData);
      Dialogue.show('abyssMidpoint', () => {
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
    document.getElementById('screen-game').dataset.world = worldId;
    applyWorldTheme(worldId);
    createStars('game-stars', 25, getWorldStarColor(worldId));

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
    const gameLabel = document.getElementById('game-world-label');
    gameLabel.innerHTML = '';
    if (WORLD_ICONS[world.id]) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'world-icon-small';
      iconSpan.innerHTML = WORLD_ICONS[world.id];
      gameLabel.appendChild(iconSpan);
    }
    gameLabel.appendChild(document.createTextNode(` ${world.name} — Stage ${stageNum}`));

    // Start world music
    Audio.playWorldMusic(worldId);

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

      // Final battle Phase 3: guardians give extra recovery
      if (finalBattlePhase === 3) {
        SleepBar.correctAnswer();
        SleepBar.restore(2); // extra recovery from guardian support
      } else {
        SleepBar.correctAnswer();
      }

      showParticles(true);
      // Combo scale boost on streak
      if (SleepBar.getStreak() >= 3) {
        const answerEl = document.getElementById('answer-display');
        answerEl.classList.add('combo-boost');
        setTimeout(() => answerEl.classList.remove('combo-boost'), 350);
      }

      // Final battle phase advancement
      if (currentWorld === 7 && currentStage === 10) {
        updateFinalBattlePhase();
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

  function updateFinalBattlePhase() {
    const val = SleepBar.getValue();
    const oldPhase = finalBattlePhase;

    if (val >= 70) {
      finalBattlePhase = 3;
    } else if (val >= 40) {
      finalBattlePhase = 2;
    } else {
      finalBattlePhase = 1;
    }

    // Phase transitions: increase drain rate for phases 2-3
    if (finalBattlePhase !== oldPhase) {
      if (finalBattlePhase === 2) {
        SleepBar.setDrainRate(SleepBar.getDrainConfig(7, 10).drainRate * 1.3);
      } else if (finalBattlePhase === 3) {
        SleepBar.setDrainRate(SleepBar.getDrainConfig(7, 10).drainRate * 1.5);
      }
    }
  }

  // --- Stage End ---

  function onStageComplete() {
    gameState = 'victory';
    SleepBar.stopDrain();
    Calculator.setDisabled(true);
    // Music keeps playing between stages — only stops on world exit or defeat
    Audio.victory();

    const result = Progression.completeStage(saveData, currentWorld, currentStage, stageErrors);
    saveData = result.saveData;
    Storage.save(saveData);

    // World 7 Stage 10: Final battle victory — special dialogue chain
    if (currentWorld === 7 && currentStage === 10) {
      Dialogue.show('finalBattleVictory', () => {
        if (!saveData.storyProgress.endingSeen) {
          saveData.storyProgress.endingSeen = true;
          Storage.save(saveData);
          Dialogue.show('finale', () => showVictoryScreen(result.stars));
        } else {
          showVictoryScreen(result.stars);
        }
      });
      return;
    }

    // Check if this was stage 10 (awakening) for worlds 1-6
    if (currentStage === 10 && currentWorld <= 6) {
      Dialogue.show(`awakening_${currentWorld}`, () => {
        showVictoryScreen(result.stars);
      });
    } else {
      showVictoryScreen(result.stars);
    }
  }

  function showVictoryScreen(stars) {
    // Keep world music playing during victory — no music change between stages
    showScreen('victory');
    document.getElementById('victory-stars').innerHTML = starIcons(stars, 3);
    document.getElementById('victory-errors').textContent = `Errors: ${stageErrors}`;
    document.getElementById('victory-problems').textContent = `Problems solved: ${stageProblems}`;

    document.getElementById('btn-next-stage').onclick = () => {
      Audio.buttonPress();
      if (currentStage < 10) {
        // Same world — music keeps playing
        startStage(currentWorld, currentStage + 1);
      } else if (currentWorld < 7 && Progression.isWorldUnlocked(saveData, currentWorld + 1)) {
        // Moving to next world — stop current music, resume intro
        Audio.stopMusic();
        Audio.playIntroMusic();
        currentWorld = currentWorld + 1;
        showGuardianPicker(currentWorld);
      } else {
        // Back to world map — stopMusic called in showWorldMap
        showWorldMap();
      }
    };

    document.getElementById('btn-victory-worldmap').onclick = () => {
      Audio.buttonPress();
      // Back to world map — stopMusic called in showWorldMap
      showWorldMap();
    };
  }

  function onStageFailed() {
    gameState = 'defeat';
    SleepBar.stopDrain();
    Calculator.setDisabled(true);
    Audio.stopMusic();
    Audio.playIntroMusic();
    Audio.defeat();

    showScreen('defeat');
    document.getElementById('defeat-message').textContent = 'The Nightmares have woken you up... You have left the Dream World.';

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

    if (!chosenGuardian) return;

    // World 7 (The Abyss): show all unlocked powers
    if (chosenGuardian === 'all') {
      const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
      unlockedPowers.forEach(powerId => {
        const def = Powers.getDef(powerId);
        if (!def) return;
        const uses = Powers.getUses(powerId);

        const btn = document.createElement('button');
        btn.className = 'power-btn unlocked';
        btn.dataset.power = powerId;
        btn.innerHTML = `
          <span class="power-emoji"><img src="${def.icon}" class="power-seal" alt="${def.name}"></span>
          <span class="power-uses">${uses}</span>
        `;
        btn.title = `${def.name}`;

        if (uses > 0) {
          btn.addEventListener('click', () => {
            Audio.resume();
            usePower(powerId);
          });
        } else {
          btn.classList.add('spent');
        }

        container.appendChild(btn);
      });
      return;
    }

    // Normal worlds: only show the chosen guardian's power
    const def = Powers.getDef(chosenGuardian);
    if (!def) return;

    const uses = Powers.getUses(chosenGuardian);

    const btn = document.createElement('button');
    btn.className = 'power-btn unlocked';
    btn.dataset.power = chosenGuardian;
    btn.innerHTML = `
      <span class="power-emoji"><img src="${def.icon}" class="power-seal" alt="${def.name}"></span>
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
    if (!DEBUG_UNLOCK_ALL && !Powers.canUse(powerId, saveData)) return;
    if (DEBUG_UNLOCK_ALL && Powers.getUses(powerId) <= 0) return;

    switch (powerId) {
      case 'freeze':
        Powers.use(powerId);
        SleepBar.freeze(5000);
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('freeze'), 'Freeze!');
        break;

      case 'insight': {
        Powers.use(powerId);
        Audio.powerUsed();
        const ansStr = String(currentProblem.answer);
        const half = ansStr.substring(0, Math.ceil(ansStr.length / 2));
        Calculator.setAnswer(half);
        showPowerEffect(Powers.getDef('insight'), 'Insight!');
        break;
      }

      case 'restore':
        Powers.use(powerId);
        SleepBar.restore(20);
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('restore'), 'Restore!');
        break;

      case 'cosmicSolve':
        Powers.use(powerId);
        Audio.powerUsed();
        Calculator.setAnswer(currentProblem.answer);
        showPowerEffect(Powers.getDef('cosmicSolve'), 'Cosmic Solve!');
        setTimeout(() => onAnswerSubmit(currentProblem.answer), 500);
        break;

      case 'blazeSkip':
        Powers.use(powerId);
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('blazeSkip'), 'Blaze Skip!');
        setTimeout(() => nextProblem(), 300);
        break;

      case 'simplify':
        Powers.use(powerId);
        Audio.powerUsed();
        currentProblem = Problems.simplifyProblem(currentProblem);
        renderProblem();
        Calculator.clear();
        showPowerEffect(Powers.getDef('simplify'), 'Simplify!');
        break;
    }

    renderPowerButtons();
  }

  function onPowerUsed(powerId, remaining) {
    // Callback from Powers module
  }

  function showPowerEffect(def, text) {
    const el = document.getElementById('power-effect');
    el.innerHTML = `<img src="${def.icon}" class="power-effect-seal" alt="${def.name}"> ${text}`;
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

  // --- Star Rating Icons ---

  function starIcons(filled, total) {
    let html = '';
    for (let i = 0; i < filled; i++) {
      html += '<img src="assets/star-full.svg" class="star-rating full" alt="★">';
    }
    for (let i = filled; i < total; i++) {
      html += '<img src="assets/star-empty.svg" class="star-rating empty" alt="☆">';
    }
    return html;
  }

  function worldOrbs(worldId) {
    let html = '';
    for (let s = 1; s <= 10; s++) {
      const stars = Progression.getStageStars(saveData, worldId, s);
      // 0 = not completed, 1 = completed, 2 = ≤3 errors, 3 = perfect
      let cls = 'world-orb';
      if (stars >= 1) cls += ' filled';
      if (stars >= 2) cls += ' good';
      if (stars >= 3) cls += ' perfect';
      html += `<span class="${cls}"></span>`;
    }
    return html;
  }

  // --- Animated Star Field ---

  // World tint colors for stars (accent color for each world)
  const WORLD_STAR_COLORS = {
    1: '#A8D5E5',  // Ice — icy blue
    2: '#9B5DE5',  // Psychic — purple
    3: '#57CC99',  // Jungle — green
    4: '#E94560',  // Cosmos — red (accent, primary is too dark)
    5: '#FF6B35',  // Volcano — orange
    6: '#00B4D8',  // Ocean — aqua
    7: '#FFD700',  // Abyss — gold (accent, primary is black)
  };

  function getWorldStarColor(worldId) {
    return WORLD_STAR_COLORS[worldId] || null;
  }

  function clearStars(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
  }

  /**
   * Create animated stars with per-star rhythm via CSS custom properties.
   * @param {string} containerId - DOM id of the star container
   * @param {number} count - Number of stars to create
   * @param {string|null} worldColor - Optional world accent color for tinted stars
   */
  function createStars(containerId, count, worldColor) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; // Clear existing stars

    const baseColors = [
      '#ffffff',           // white
      'rgb(200,180,255)',  // lavender
      'rgb(126,200,227)',  // sky blue
    ];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Position: random X, exponential Y bias toward top
      const yRand = Math.random();
      const y = yRand * yRand * 90;
      const x = Math.random() * 100;

      // Size: 1-3px, slightly larger near top
      const topFactor = 1 - (y / 90);
      const size = 1 + Math.random() * 2 * topFactor;

      // Per-star animation properties (comic's approach — unique rhythm per star)
      const dur = 2 + Math.random() * 4;       // 2-6 seconds
      const maxOp = 0.3 + Math.random() * 0.5;  // 0.3-0.8
      const delay = Math.random() * dur;         // random phase offset

      // Color: 75% white/soft, 25% world-tinted if worldColor provided
      let color;
      if (worldColor && Math.random() < 0.25) {
        color = worldColor;
      } else {
        const baseIdx = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * baseColors.length);
        color = baseColors[baseIdx];
      }

      star.style.left = x + '%';
      star.style.top = y + '%';
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.color = color;
      star.style.setProperty('--dur', dur + 's');
      star.style.setProperty('--max-op', maxOp.toString());
      star.style.setProperty('--delay', delay + 's');

      // Glow for larger stars
      if (size > 2.2) {
        star.style.boxShadow = `0 0 ${size * 2}px currentColor`;
      }

      container.appendChild(star);
    }
  }

  return { init };
})();

// Start game on load
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});

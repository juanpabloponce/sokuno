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
  let gameState = 'title'; // title, worldmap, guardian-pick, stageselect, playing, victory, defeat, freestyle-select, freestyle-guardian, freestyle-results
  let finalBattlePhase = 0; // 0 = not in final battle, 1-3 for phases
  let problemStartTime = 0; // timestamp when current problem was shown
  let freestyleSubmode = null; // 'pure' or 'guardian'
  let freestyleGuardianId = null;

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

    // Sync lore unlocks on load and show badge if needed
    Lore.syncUnlocks(saveData);
    Storage.save(saveData);
    Lore.updateLoreUnreadBadge(saveData);

    // Show freestyle button if unlocked
    updateFreestyleButton();

    startWakeupSequence();
    bindGlobalEvents();
  }

  function updateFreestyleButton() {
    const btn = document.getElementById('btn-freestyle');
    if (!btn) return;
    btn.classList.remove('hidden'); // always visible (locked or unlocked)
    const unlocked = DEBUG_UNLOCK_ALL || (saveData.freestyle && saveData.freestyle.unlocked);
    if (unlocked) {
      btn.classList.remove('locked');
      btn.disabled = false;
    } else {
      btn.classList.add('locked');
      btn.disabled = true;
    }
  }

  function startWakeupSequence() {
    const wakeup = document.getElementById('screen-wakeup');
    const textEl = document.getElementById('wakeup-text');
    const tapEl = document.querySelector('.wakeup-tap');

    // Type out the message letter by letter
    const lines = ['You are asleep...', 'good. Now we can speak.'];
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
          const newCh = Lore.syncUnlocks(saveData);
          Storage.save(saveData);
          Lore.updateLoreUnreadBadge(saveData);
          if (newCh.length > 0) {
            Lore.showChapterNotification(newCh[0], () => showWorldMap());
          } else {
            showWorldMap();
          }
        });
      } else {
        Lore.syncUnlocks(saveData);
        Storage.save(saveData);
        Lore.updateLoreUnreadBadge(saveData);
        showWorldMap();
      }
    });

    // Lore button
    document.getElementById('btn-lore')?.addEventListener('click', () => {
      Audio.buttonPress();
      Lore.syncUnlocks(saveData);
      Storage.save(saveData);
      showScreen('lore');
      Lore.renderLoreScreen(saveData);
    });

    document.getElementById('btn-back-lore')?.addEventListener('click', () => {
      Audio.buttonPress();
      // Reset reader view so next open shows chapter list
      document.getElementById('lore-reader')?.classList.add('hidden');
      document.getElementById('lore-list-container')?.classList.remove('hidden');
      showScreen('title');
    });

    // Mixtape button
    document.getElementById('btn-mixtape')?.addEventListener('click', () => {
      Audio.buttonPress();
      showScreen('mixtape');
      Mixtape.renderList(saveData, DEBUG_UNLOCK_ALL);
    });

    document.getElementById('btn-back-mixtape')?.addEventListener('click', () => {
      Audio.buttonPress();
      showScreen('title');
    });

    // Stop button in now-playing bar
    document.getElementById('mixtape-btn-stop')?.addEventListener('click', () => {
      Audio.buttonPress();
      Mixtape.stop();
      Mixtape.renderList(saveData, DEBUG_UNLOCK_ALL);
    });

    // Sound toggle
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      const enabled = Audio.toggle();
      document.getElementById('btn-sound').textContent = enabled ? '🔊' : '🔇';
    });

    // Back buttons
    document.getElementById('btn-back-title')?.addEventListener('click', () => {
      Audio.buttonPress();
      Audio.stopMusic();
      // Only restart intro music if mixtape is not playing
      if (!Mixtape.isPlaying()) {
        Audio.playIntroMusic();
      }
      showScreen('title');
      createStars('title-stars', 80, null);
    });

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

    document.getElementById('btn-back-game')?.addEventListener('click', () => {
      Audio.buttonPress();
      if (Freestyle.isActive()) {
        // End freestyle session and show results
        onFreestyleSessionEnd();
      } else {
        showStageSelect(currentWorld);
      }
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

    // --- Freestyle Mode Events ---

    document.getElementById('btn-freestyle')?.addEventListener('click', () => {
      Audio.resume();
      Audio.buttonPress();
      showFreestyleSelect();
    });

    document.getElementById('btn-back-freestyle')?.addEventListener('click', () => {
      Audio.buttonPress();
      Audio.stopMusic();
      if (!Mixtape.isPlaying()) {
        Audio.playIntroMusic();
      }
      showScreen('title');
      createStars('title-stars', 80, null);
    });

    document.getElementById('freestyle-card-pure')?.addEventListener('click', () => {
      Audio.buttonPress();
      freestyleSubmode = 'pure';
      freestyleGuardianId = null;
      beginFreestyleGameplay('pure', null);
    });

    document.getElementById('freestyle-card-guardian')?.addEventListener('click', () => {
      Audio.buttonPress();
      freestyleSubmode = 'guardian';
      showFreestyleGuardianPicker();
    });

    document.getElementById('btn-back-freestyle-guardian')?.addEventListener('click', () => {
      Audio.buttonPress();
      showFreestyleSelect();
    });

    document.getElementById('btn-freestyle-again')?.addEventListener('click', () => {
      Audio.buttonPress();
      if (freestyleSubmode === 'guardian' && freestyleGuardianId) {
        beginFreestyleGameplay('guardian', freestyleGuardianId);
      } else if (freestyleSubmode === 'pure') {
        beginFreestyleGameplay('pure', null);
      } else {
        showFreestyleSelect();
      }
    });

    document.getElementById('btn-freestyle-exit')?.addEventListener('click', () => {
      Audio.buttonPress();
      Audio.stopMusic();
      if (!Mixtape.isPlaying()) {
        Audio.playIntroMusic();
      }
      showScreen('title');
      createStars('title-stars', 80, null);
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

    // Hide freestyle HUD when leaving game screen
    if (screenId !== 'game') {
      document.getElementById('freestyle-hud')?.classList.add('hidden');
    }

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
    // Only play intro music if mixtape isn't playing
    if (!Mixtape.isPlaying()) {
      Audio.playIntroMusic();
    }
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
    document.getElementById('screen-guardian-pick').dataset.world = worldId;
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
      const hasResonance = isNative && unlocked && worldId !== 7;

      const div = document.createElement('div');
      div.className = `guardian-option ${unlocked ? '' : 'locked'} ${hasResonance ? 'resonant' : ''}`;

      div.innerHTML = `
        <div class="guardian-opt-emoji${hasResonance ? ' resonant-aura' : ''}"><img src="${def.icon}" class="guardian-seal" alt="${def.guardian}"></div>
        <div class="guardian-opt-info">
          <div class="guardian-opt-name">${def.guardian}</div>
          <div class="guardian-opt-power">${def.name}</div>
          <div class="guardian-opt-desc">${def.desc}</div>
        </div>
        ${hasResonance ? '<span class="guardian-opt-tag resonance-tag">Resonance</span>' : ''}
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

    // World description
    const descEl = document.getElementById('stage-description');
    if (descEl) {
      descEl.textContent = world.description || '';
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
      const gatherChapters = Lore.syncUnlocks(saveData);
      Storage.save(saveData);
      Lore.updateLoreUnreadBadge(saveData);
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
    Powers.setActiveWorld(worldId);
    Powers.resetUses();
    renderPowerBarUI();

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

    // Stop mixtape if playing, then start world music
    Mixtape.stopForWorld();
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
    problemStartTime = Date.now();
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

    const answerTimeMs = Date.now() - problemStartTime;

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

      // Charge the power bar on correct answers
      chargePowerBar(answerTimeMs);

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
      // Refresh power bar UI (streak resets)
      renderPowerBarUI();
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

    // Check for newly unlocked lore chapters
    const newChapters = Lore.syncUnlocks(saveData);
    Storage.save(saveData);
    Lore.updateLoreUnreadBadge(saveData);

    // Helper: show lore notification for new chapters, then callback
    function showLoreNotifs(chapters, cb) {
      if (chapters.length === 0) { cb(); return; }
      const ch = chapters.shift();
      Lore.showChapterNotification(ch, () => showLoreNotifs(chapters, cb));
    }

    // Unlock Freestyle Mode after completing World 7 Stage 10
    if (currentWorld === 7 && currentStage === 10 && saveData.freestyle) {
      saveData.freestyle.unlocked = true;
      Storage.save(saveData);
      updateFreestyleButton();
    }

    // World 7 Stage 10: Final battle victory — special dialogue chain
    if (currentWorld === 7 && currentStage === 10) {
      Dialogue.show('finalBattleVictory', () => {
        const shouldShowFinale = !saveData.storyProgress.endingSeen || !saveData.storyProgress.freestyleUnlockSeen;
        if (shouldShowFinale) {
          saveData.storyProgress.endingSeen = true;
          saveData.storyProgress.freestyleUnlockSeen = true;
          Storage.save(saveData);
          // Re-sync after ending seen
          const moreChapters = Lore.syncUnlocks(saveData);
          Storage.save(saveData);
          const allNew = newChapters.concat(moreChapters);
          Dialogue.show('finale', () => {
            showLoreNotifs(allNew, () => {
              // "Enter the Endless Dream" — go to Freestyle select
              Audio.stopMusic();
              showFreestyleSelect();
            });
          });
        } else {
          showLoreNotifs(newChapters, () => showVictoryScreen(result.stars));
        }
      });
      return;
    }

    // Check if this was stage 10 (awakening) for worlds 1-6
    if (currentStage === 10 && currentWorld <= 6) {
      Dialogue.show(`awakening_${currentWorld}`, () => {
        showLoreNotifs(newChapters, () => showVictoryScreen(result.stars));
      });
    } else {
      showLoreNotifs(newChapters, () => showVictoryScreen(result.stars));
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

  function chargePowerBar(answerTimeMs) {
    const isAbyssMode = currentWorld === 7;
    const streak = SleepBar.getStreak();

    if (chosenGuardian === 'all') {
      // World 7: charge ALL unlocked guardians
      const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
      unlockedPowers.forEach(powerId => {
        const charge = Powers.calculateCharge(true, answerTimeMs, streak, true);
        Powers.addCharge(powerId, charge);
      });
    } else if (chosenGuardian) {
      // Normal worlds: charge only the chosen guardian
      const charge = Powers.calculateCharge(true, answerTimeMs, streak, false);
      Powers.addCharge(chosenGuardian, charge);
    }

    renderPowerBarUI();
  }

  function renderPowerBarUI() {
    // --- Top: charge bar indicator (below sleep bar) ---
    const barContainer = document.getElementById('power-buttons');
    barContainer.innerHTML = '';

    // --- Bottom: action buttons (below calculator) ---
    const btnContainer = document.getElementById('power-action-buttons');
    btnContainer.innerHTML = '';

    if (!chosenGuardian) return;

    // World 7 (The Abyss): all unlocked powers
    if (chosenGuardian === 'all') {
      barContainer.className = 'power-bar power-bar--multi';
      const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
      unlockedPowers.forEach(powerId => {
        barContainer.appendChild(createChargeBarElement(powerId, true));
        btnContainer.appendChild(createPowerButton(powerId));
      });
      return;
    }

    // Normal worlds: single guardian
    barContainer.className = 'power-bar power-bar--single';
    barContainer.appendChild(createChargeBarElement(chosenGuardian, false));
    btnContainer.appendChild(createPowerButton(chosenGuardian));
  }

  function createChargeBarElement(powerId, compact) {
    const def = Powers.getDef(powerId);
    const state = Powers.getChargeState(powerId);
    const percent = Powers.getChargePercent(powerId);

    const bar = document.createElement('div');
    bar.className = `charge-bar ${compact ? 'charge-bar--compact' : ''}`;
    bar.dataset.power = powerId;

    if (state.isExhausted) {
      bar.classList.add('charge-bar--exhausted');
    } else if (state.isReady) {
      bar.classList.add('charge-bar--ready');
    } else {
      bar.classList.add('charge-bar--charging');
    }

    // Guardian color — use accent for dark worlds (Cosmos, Abyss)
    const worldId = def.worldUnlock;
    const world = worldsData.worlds[worldId - 1];
    const guardianColor = (worldId === 4 || worldId === 7) ? world.colors.accent : world.colors.primary;

    // Dynamic glow intensity based on charge percentage
    const glowIntensity = Math.max(0.2, percent);
    const innerGlow = Math.round(8 + percent * 14);    // 8px → 22px
    const outerGlow = Math.round(16 + percent * 24);   // 16px → 40px
    const farGlow   = Math.round(percent * 20);         // 0px → 20px

    const fillStyle = [
      `width: ${percent * 100}%`,
      `background: ${guardianColor}`,
      `color: ${guardianColor}`,
      `box-shadow: 0 0 ${innerGlow}px ${guardianColor}, 0 0 ${outerGlow}px ${guardianColor}${farGlow > 0 ? `, 0 0 ${farGlow}px rgba(255,255,255,0.08)` : ''}`,
    ].join('; ');

    bar.innerHTML = `
      <div class="charge-bar__icon">
        <img src="${def.icon}" class="charge-bar__seal" alt="${def.guardian}">
      </div>
      <div class="charge-bar__track">
        <div class="charge-bar__fill" style="${fillStyle}"></div>
      </div>
    `;

    return bar;
  }

  function createPowerButton(powerId) {
    const def = Powers.getDef(powerId);
    const state = Powers.getChargeState(powerId);

    const btn = document.createElement('button');
    btn.className = 'power-btn';
    btn.dataset.power = powerId;

    if (state.isExhausted) {
      btn.classList.add('power-btn--exhausted');
      btn.innerHTML = `
        <img src="${def.icon}" class="power-seal" alt="${def.name}">
        <span class="power-btn__x">&times;</span>
      `;
    } else if (state.isReady) {
      btn.classList.add('power-btn--ready');
      btn.innerHTML = `
        <img src="${def.icon}" class="power-seal" alt="${def.name}">
        <span class="power-uses">${def.name}</span>
      `;
      btn.addEventListener('click', () => {
        Audio.resume();
        usePower(powerId);
      });
    } else {
      btn.classList.add('power-btn--charging');
      btn.innerHTML = `
        <img src="${def.icon}" class="power-seal" alt="${def.name}">
      `;
    }

    return btn;
  }

  function usePower(powerId) {
    const chargeState = Powers.getChargeState(powerId);
    if (!chargeState || !chargeState.isReady || chargeState.isExhausted) return;
    if (!DEBUG_UNLOCK_ALL && !Powers.canUse(powerId, saveData)) return;

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

    renderPowerBarUI();
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

  // ============================================
  // === FREESTYLE MODE
  // ============================================

  function showFreestyleSelect() {
    Audio.stopMusic();
    if (!Mixtape.isPlaying()) {
      Audio.playIntroMusic();
    }
    showScreen('freestyle-select');
    gameState = 'freestyle-select';
    renderFreestyleRecords();
  }

  function renderFreestyleRecords() {
    const el = document.getElementById('freestyle-records');
    if (!el || !saveData.freestyle) return;
    const p = saveData.freestyle.pure;
    const g = saveData.freestyle.guardian;
    const hasPure = p.totalSessions > 0;
    const hasGuardian = g.totalSessions > 0;
    if (!hasPure && !hasGuardian) {
      el.innerHTML = '';
      return;
    }
    let html = '<div class="freestyle-records-title">Personal Records</div>';
    if (hasPure) {
      html += `<div class="freestyle-record-row"><span class="freestyle-record-label">Pure — Best Chain:</span> <span class="freestyle-record-val">${p.bestChain}</span> <span class="freestyle-record-sep">|</span> <span class="freestyle-record-label">Total:</span> <span class="freestyle-record-val">${p.bestTotal}</span></div>`;
    }
    if (hasGuardian) {
      html += `<div class="freestyle-record-row"><span class="freestyle-record-label">Guardian — Best Chain:</span> <span class="freestyle-record-val">${g.bestChain}</span> <span class="freestyle-record-sep">|</span> <span class="freestyle-record-label">Total:</span> <span class="freestyle-record-val">${g.bestTotal}</span></div>`;
    }
    el.innerHTML = html;
  }

  function showFreestyleGuardianPicker() {
    showScreen('freestyle-guardian');
    gameState = 'freestyle-guardian';
    const container = document.getElementById('freestyle-guardian-list');
    container.innerHTML = '';

    const unlockedPowers = DEBUG_UNLOCK_ALL ? Object.keys(Powers.getAllDefs()) : Powers.getUnlockedPowers(saveData);
    const allDefs = Powers.getAllDefs();

    Object.keys(allDefs).forEach(key => {
      const def = allDefs[key];
      const unlocked = unlockedPowers.includes(key);

      const div = document.createElement('div');
      div.className = `guardian-option ${unlocked ? '' : 'locked'}`;

      div.innerHTML = `
        <div class="guardian-opt-emoji"><img src="${def.icon}" class="guardian-seal" alt="${def.guardian}"></div>
        <div class="guardian-opt-info">
          <div class="guardian-opt-name">${def.guardian}</div>
          <div class="guardian-opt-power">${def.name}</div>
          <div class="guardian-opt-desc">${def.desc}</div>
        </div>
        ${!unlocked ? '<span class="guardian-opt-lock"><img src="assets/lock.svg" class="lock-icon-sm" alt="Locked"></span>' : ''}
      `;

      if (unlocked) {
        div.addEventListener('click', () => {
          Audio.buttonPress();
          freestyleGuardianId = key;
          beginFreestyleGameplay('guardian', key);
        });
      }

      container.appendChild(div);
    });
  }

  function beginFreestyleGameplay(mode, guardianId) {
    freestyleSubmode = mode;
    freestyleGuardianId = guardianId;

    // Init Freestyle session
    Freestyle.startSession(mode, guardianId);

    // Show game screen with Freestyle theme
    showScreen('game');
    gameState = 'game';
    const gameScreen = document.getElementById('screen-game');
    gameScreen.dataset.world = 'freestyle';
    gameScreen.style.setProperty('--world-primary', '#0D0D0D');
    gameScreen.style.setProperty('--world-secondary', '#1A1A2E');
    gameScreen.style.setProperty('--world-accent', '#A89CD8');
    createStars('game-stars', 25, '#A89CD8');

    // Setup sleep bar with tier 1 drain
    const drainRate = Freestyle.getDrainRateForTier(1);
    SleepBar.init({
      startValue: 50,
      drainRate: drainRate,
      onUpdate: updateSleepBarUI,
      onEmpty: onFreestyleSessionEnd,
      onFull: null // Freestyle: bar never "completes" — it just keeps going
    });

    // Setup calculator with freestyle handler
    Calculator.init(onFreestyleAnswerSubmit);

    // Setup powers for guardian mode
    if (mode === 'guardian' && guardianId) {
      chosenGuardian = guardianId;
      Powers.setChosenGuardian(guardianId);
      Powers.setActiveWorld(7);
      Powers.resetUses();
      // Override: start with power not ready (needs 15-correct charge)
      renderFreestylePowerUI();
    } else {
      chosenGuardian = null;
      Powers.setChosenGuardian(null);
      document.getElementById('power-buttons').innerHTML = '';
      document.getElementById('power-action-buttons').innerHTML = '';
    }

    // Show freestyle HUD
    const hud = document.getElementById('freestyle-hud');
    if (hud) {
      hud.classList.remove('hidden');
      document.getElementById('freestyle-streak-count').textContent = '0';
      document.getElementById('freestyle-tier-display').textContent = 'Warm Up';
    }

    // Show game label
    const gameLabel = document.getElementById('game-world-label');
    gameLabel.innerHTML = '';
    gameLabel.textContent = '✦ The Endless Dream';

    // Stop mixtape, start freestyle music
    Mixtape.stopForWorld();
    Audio.playFreestyleMusic();

    // Show first problem
    currentProblem = Freestyle.getCurrentProblem();
    problemStartTime = Date.now();
    renderProblem();
    Calculator.clear();
    Calculator.setDisabled(false);

    // Start drain
    SleepBar.startDrain();
  }

  function onFreestyleAnswerSubmit(playerAnswer) {
    Calculator.setDisabled(true);
    saveData.stats.totalProblems++;

    if (playerAnswer === currentProblem.answer) {
      // Correct
      saveData.stats.totalCorrect++;
      Audio.correct();
      Calculator.showFeedback(true);

      const result = Freestyle.onCorrectAnswer();

      // Recovery with tier scaling
      const recoveryMult = result.recoveryMultiplier || 1;
      // Manual recovery: base 2.5 + streak bonus (capped at 5), scaled by tier
      const streakBonus = Math.min(result.streak, 5);
      const recovery = (2.5 + streakBonus) * recoveryMult;
      SleepBar.restore(recovery);

      // Streak milestones
      if (result.isStreakMilestone5) {
        SleepBar.restore(5); // bonus burst
      }
      if (result.isStreakMilestone10) {
        showParticles(true);
        showParticles(true); // extra particles
      }

      showParticles(true);

      // Combo visual
      if (result.streak >= 3) {
        const answerEl = document.getElementById('answer-display');
        answerEl.classList.add('combo-boost');
        setTimeout(() => answerEl.classList.remove('combo-boost'), 350);
      }

      // Update tier
      if (result.tierChanged) {
        SleepBar.setDrainRate(result.drainRate);
        const tierEl = document.getElementById('freestyle-tier-display');
        if (tierEl) {
          tierEl.textContent = Freestyle.getTierName();
          tierEl.classList.add('tier-change');
          setTimeout(() => tierEl.classList.remove('tier-change'), 1000);
        }
      }

      // Update streak display
      document.getElementById('freestyle-streak-count').textContent = result.streak;

      // Guardian mode: update charge UI
      if (freestyleSubmode === 'guardian') {
        renderFreestylePowerUI();
      }

      Storage.save(saveData);

      // Chain transition: animate answer sliding into next problem
      const answerBox = document.getElementById('answer-display');
      answerBox.classList.add('chain-slide');

      setTimeout(() => {
        answerBox.classList.remove('chain-slide');
        if (gameState === 'game' && Freestyle.isActive()) {
          currentProblem = Freestyle.getCurrentProblem();
          problemStartTime = Date.now();
          renderProblem();
          Calculator.clear();
          Calculator.setDisabled(false);
        }
      }, 300);
    } else {
      // Wrong
      Audio.wrong();
      Calculator.showFeedback(false);

      const result = Freestyle.onWrongAnswer();
      SleepBar.wrongAnswer();

      showParticles(false);

      // Update streak display
      document.getElementById('freestyle-streak-count').textContent = '0';

      // Guardian mode: reset charge UI
      if (freestyleSubmode === 'guardian') {
        renderFreestylePowerUI();
      }

      Storage.save(saveData);

      setTimeout(() => {
        if (gameState === 'game' && Freestyle.isActive()) {
          currentProblem = Freestyle.getCurrentProblem();
          problemStartTime = Date.now();
          renderProblem();
          Calculator.clear();
          Calculator.setDisabled(false);
        }
      }, 350);
    }
  }

  function onFreestyleSessionEnd() {
    gameState = 'freestyle-results';
    SleepBar.stopDrain();
    Calculator.setDisabled(true);
    Audio.defeat();

    const result = Freestyle.endSession();
    const modeKey = result.submode; // 'pure' or 'guardian'
    const record = saveData.freestyle[modeKey];

    // Check for new records
    let newBestChain = false, newBestTotal = false, newBestTier = false;

    if (result.bestChain > record.bestChain) {
      record.bestChain = result.bestChain;
      newBestChain = true;
    }
    if (result.totalCorrect > record.bestTotal) {
      record.bestTotal = result.totalCorrect;
      newBestTotal = true;
    }
    if (result.highestTier > record.highestTier) {
      record.highestTier = result.highestTier;
      newBestTier = true;
    }
    record.totalSessions++;
    Storage.save(saveData);

    // Populate results screen
    showScreen('freestyle-results');

    document.getElementById('freestyle-result-chain').textContent = result.bestChain;
    document.getElementById('freestyle-result-total').textContent = result.totalCorrect;
    document.getElementById('freestyle-result-tier').textContent = result.tierName;
    document.getElementById('freestyle-result-quote').textContent = `"${result.quote}"`;

    // Show "NEW BEST!" badges
    const badgeChain = document.getElementById('freestyle-badge-chain');
    const badgeTotal = document.getElementById('freestyle-badge-total');
    const badgeTier = document.getElementById('freestyle-badge-tier');

    badgeChain.classList.toggle('hidden', !newBestChain);
    badgeTotal.classList.toggle('hidden', !newBestTotal);
    badgeTier.classList.toggle('hidden', !newBestTier);

    // Hide freestyle HUD
    document.getElementById('freestyle-hud')?.classList.add('hidden');
  }

  // --- Freestyle Power UI ---

  function renderFreestylePowerUI() {
    const barContainer = document.getElementById('power-buttons');
    const btnContainer = document.getElementById('power-action-buttons');
    barContainer.innerHTML = '';
    btnContainer.innerHTML = '';

    if (freestyleSubmode !== 'guardian' || !freestyleGuardianId) return;

    const def = Powers.getDef(freestyleGuardianId);
    if (!def) return;

    const chargePercent = Freestyle.getGuardianCharge();
    const isReady = Freestyle.isGuardianReady();

    // Charge bar
    barContainer.className = 'power-bar power-bar--single';
    const bar = document.createElement('div');
    bar.className = `charge-bar ${isReady ? 'charge-bar--ready' : 'charge-bar--charging'}`;

    const world = worldsData.worlds[def.worldUnlock - 1];
    const guardianColor = (def.worldUnlock === 4 || def.worldUnlock === 7) ? world.colors.accent : world.colors.primary;
    const percent = chargePercent;
    const innerGlow = Math.round(8 + percent * 14);
    const outerGlow = Math.round(16 + percent * 24);

    const fillStyle = [
      `width: ${percent * 100}%`,
      `background: ${guardianColor}`,
      `color: ${guardianColor}`,
      `box-shadow: 0 0 ${innerGlow}px ${guardianColor}, 0 0 ${outerGlow}px ${guardianColor}`,
    ].join('; ');

    bar.innerHTML = `
      <div class="charge-bar__icon">
        <img src="${def.icon}" class="charge-bar__seal" alt="${def.guardian}">
      </div>
      <div class="charge-bar__track">
        <div class="charge-bar__fill" style="${fillStyle}"></div>
      </div>
    `;
    barContainer.appendChild(bar);

    // Action button
    const btn = document.createElement('button');
    btn.className = 'power-btn';

    if (isReady) {
      btn.classList.add('power-btn--ready');
      btn.innerHTML = `
        <img src="${def.icon}" class="power-seal" alt="${def.name}">
        <span class="power-uses">${def.name}</span>
      `;
      btn.addEventListener('click', () => {
        Audio.resume();
        useFreestylePower(freestyleGuardianId);
      });
    } else {
      btn.classList.add('power-btn--charging');
      btn.innerHTML = `
        <img src="${def.icon}" class="power-seal" alt="${def.name}">
      `;
    }

    btnContainer.appendChild(btn);
  }

  function useFreestylePower(powerId) {
    if (!Freestyle.isGuardianReady()) return;
    if (!Freestyle.useGuardianPower()) return;

    switch (powerId) {
      case 'freeze':
        SleepBar.freeze(5000);
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('freeze'), 'Freeze!');
        break;

      case 'insight': {
        Audio.powerUsed();
        const prob = Freestyle.getCurrentProblem();
        const ansStr = String(prob.answer);
        const half = ansStr.substring(0, Math.ceil(ansStr.length / 2));
        Calculator.setAnswer(half);
        showPowerEffect(Powers.getDef('insight'), 'Insight!');
        break;
      }

      case 'restore':
        SleepBar.restore(15); // Reduced from 20 in Story Mode
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('restore'), 'Restore!');
        break;

      case 'cosmicSolve': {
        Audio.powerUsed();
        showPowerEffect(Powers.getDef('cosmicSolve'), 'Cosmic Solve!');
        const prob = Freestyle.getCurrentProblem();
        Calculator.setAnswer(prob.answer);
        setTimeout(() => onFreestyleAnswerSubmit(prob.answer), 500);
        break;
      }

      case 'blazeSkip':
        Audio.powerUsed();
        Freestyle.skipCurrentProblem();
        showPowerEffect(Powers.getDef('blazeSkip'), 'Blaze Skip!');
        currentProblem = Freestyle.getCurrentProblem();
        renderProblem();
        Calculator.clear();
        break;

      case 'simplify':
        Audio.powerUsed();
        Freestyle.simplifyCurrentProblem();
        currentProblem = Freestyle.getCurrentProblem();
        renderProblem();
        Calculator.clear();
        showPowerEffect(Powers.getDef('simplify'), 'Simplify!');
        break;
    }

    renderFreestylePowerUI();
  }

  return { init, startStage };
})();

// Start game on load
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});

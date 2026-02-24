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
  let isRetrying = false; // true when player retries after defeat — skip dialogues
  let problemStartTime = 0; // timestamp when current problem was shown
  let freestyleSubmode = null; // 'pure' or 'guardian'
  let freestyleGuardianId = null;

  // --- Abyss Interference State ---
  let interferenceTimers = [];
  let interferenceActive = false;
  let baseDrainForInterference = 0; // store base drain rate for interference modifications
  let witherProgress = 0; // 0→1 for Wither (Stage 3) interference

  // --- Remember Me State ---
  let rememberMeActive = false;
  let rememberMeCount = 0;

  // DEBUG: set to true to unlock all worlds/stages/powers for testing, false for normal play
  const DEBUG_UNLOCK_ALL = true;

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
        // Stop sleep bar drain so it doesn't trigger defeat after leaving
        SleepBar.destroy();
        // Clean up world visual effects
        clearEmbers();
        clearAurora();
        clearPsychic();
        clearCosmos();
        clearOcean();
        clearJungle();
        clearAbyss();
        clearEndlessDream();
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
    // Filter out rememberMe — it's a special Abyss-only power, not a selectable guardian
    const powerKeys = Object.keys(allDefs).filter(k => k !== 'rememberMe');
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
      // World 7: all guardians accompany you (exclude rememberMe — special power)
      const allDefs = Powers.getAllDefs();
      const icons = Object.entries(allDefs).filter(([k]) => k !== 'rememberMe').map(([, d]) => `<img src="${d.icon}" class="companion-seal" alt="${d.guardian}">`).join('');
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

    // On retry: skip all dialogues, go straight to gameplay
    if (isRetrying) {
      isRetrying = false;
      beginGameplay(worldId, stageNum);
      return;
    }

    const introKey = `world${worldId}IntroSeen`;

    // Helper: show Abyss pre-stage dialogue then begin gameplay
    function beginAbyssWithPreDialogue(wId, sNum) {
      if (sNum >= 1 && sNum <= 6) {
        Dialogue.show('abyssStage_' + sNum + '_pre', function() {
          beginGameplay(wId, sNum);
        });
      } else {
        beginGameplay(wId, sNum);
      }
    }

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
            beginAbyssWithPreDialogue(worldId, stageNum);
          });
        } else {
          beginAbyssWithPreDialogue(worldId, stageNum);
        }
      });
      return;
    }

    // Check if world intro needs showing
    if (!saveData.storyProgress[introKey] && stageNum === 1) {
      saveData.storyProgress[introKey] = true;
      Storage.save(saveData);
      Dialogue.show(`worldIntro_${worldId}`, () => {
        if (worldId === 7) {
          beginAbyssWithPreDialogue(worldId, stageNum);
        } else {
          beginGameplay(worldId, stageNum);
        }
      });
      return;
    }

    // World 7 Stage 5: Abyss midpoint dialogue (first time) then pre-stage dialogue
    if (worldId === 7 && stageNum === 5 && !saveData.storyProgress.world7MidpointSeen) {
      saveData.storyProgress.world7MidpointSeen = true;
      Storage.save(saveData);
      Dialogue.show('abyssMidpoint', () => {
        beginAbyssWithPreDialogue(worldId, stageNum);
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

    // World 7 stages 2-6 (and replays of stage 1): show pre-stage dialogue
    if (worldId === 7 && stageNum >= 1 && stageNum <= 6) {
      beginAbyssWithPreDialogue(worldId, stageNum);
      return;
    }

    beginGameplay(worldId, stageNum);
  }

  function beginGameplay(worldId, stageNum) {
    showScreen('game');
    document.getElementById('screen-game').dataset.world = worldId;
    applyWorldTheme(worldId);
    createStars('game-stars', 25, getWorldStarColor(worldId));

    // World-specific effects
    clearEmbers();
    clearAurora();
    clearPsychic();
    clearCosmos();
    clearOcean();
    clearJungle();
    clearAbyss();
    clearEndlessDream();
    if (worldId === 1) createAurora();
    if (worldId === 2) createPsychic();
    if (worldId === 3) createJungle();
    if (worldId === 4) createCosmos();
    if (worldId === 5) createEmbers(40);
    if (worldId === 6) createOcean();
    if (worldId === 7) createAbyss();

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

    // Setup powers
    Powers.setActiveWorld(worldId);
    if (worldId === 7) {
      // Abyss: cumulative powers — unlock one per stage completed
      Powers.resetUsesAbyss(stageNum);
    } else {
      Powers.resetUses();
    }
    renderPowerBarUI();

    // Reset Remember Me state
    rememberMeActive = false;
    rememberMeCount = 0;

    // Clear leftover battle toasts from previous stage
    battleToastQueue = [];
    battleToastRunning = false;

    // Start Abyss interference system
    if (worldId === 7) {
      // Final battle (stage 10) starts at phase 1
      if (stageNum === 10) {
        finalBattlePhase = 1;
        baseDrainForInterference = 2.5;
        SleepBar.setDrainRate(2.5); // Phase 1: brutal
        // Phase 1 toasts (delayed so player sees the game first)
        setTimeout(function() {
          queueBattleToasts([
            { speaker: 'Kurayami', emoji: '🌑', text: 'Six guardians. One dreamer. One broken old man.', duration: 4000 },
            { speaker: 'Kurayami', emoji: '🌑', text: 'Is this all?', duration: 3000 },
            { speaker: 'Kurayami', emoji: '🌑', text: 'I was the best. And THEY FORGOT ME.', duration: 5000 }
          ]);
        }, 3000);
      }
      startInterference(stageNum);
    }

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

  // --- Abyss Difficulty Helpers ---

  function getAbyssRecoveryMultiplier(stageNum, phase) {
    // Stage 10 phase 3 = 120% recovery (light wins)
    if (stageNum === 10 && phase === 3) return 1.2;
    if (stageNum === 10 && phase === 2) return 0.9;
    if (stageNum === 10) return 0.7; // phase 1 brutal
    var multipliers = [null, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.75, 0.75];
    return multipliers[stageNum] || 0.75;
  }

  function getAbyssPenalty(stageNum) {
    var penalties = [null, 5, 6, 7, 8, 9, 10, 11, 11, 11, 12];
    return penalties[stageNum] || 10;
  }

  // --- Kurayami Interference System ---

  function startInterference(stageNum) {
    stopInterference();
    interferenceActive = true;
    var gameScreen = document.getElementById('screen-game');
    // For stage 10, baseDrainForInterference is pre-set by beginGameplay (phase system controls it)
    if (stageNum !== 10) {
      var config = SleepBar.getDrainConfig(7, stageNum);
      baseDrainForInterference = config.drainRate;
    }
    witherProgress = 0;

    if (stageNum === 1) {
      // Stage 1: Frost Drain — every 20s, drain ×1.5 for 5s
      var frostTimer = setInterval(function() {
        if (!interferenceActive) return;
        SleepBar.setDrainRate(baseDrainForInterference * 1.5);
        gameScreen.classList.add('frost-drain-active');
        var revertTimer = setTimeout(function() {
          if (interferenceActive) {
            SleepBar.setDrainRate(baseDrainForInterference);
          }
          gameScreen.classList.remove('frost-drain-active');
        }, 5000);
        interferenceTimers.push(revertTimer);
      }, 20000);
      interferenceTimers.push(frostTimer);

    } else if (stageNum === 2) {
      // Stage 2: Doubt — every 25s, show ghost number for 1s
      var doubtTimer = setInterval(function() {
        if (!interferenceActive) return;
        showDoubtGhost();
      }, 25000);
      interferenceTimers.push(doubtTimer);

    } else if (stageNum === 3) {
      // Stage 3: Wither — recovery degrades over time (tracked via witherProgress)
      // witherProgress is incremented in onAnswerSubmit for correct answers

    } else if (stageNum === 4) {
      // Stage 4: Void Pulse — every 30s, darken screen for 2s
      var voidTimer = setInterval(function() {
        if (!interferenceActive) return;
        gameScreen.classList.add('void-pulse-active');
        var revertTimer = setTimeout(function() {
          gameScreen.classList.remove('void-pulse-active');
        }, 2000);
        interferenceTimers.push(revertTimer);
      }, 30000);
      interferenceTimers.push(voidTimer);

    } else if (stageNum === 5) {
      // Stage 5: Provoke — random micro-spikes every 8-12s for 2s
      function scheduleProvoke() {
        var delay = 8000 + Math.random() * 4000;
        var provokeTimer = setTimeout(function() {
          if (!interferenceActive) return;
          SleepBar.setDrainRate(baseDrainForInterference * 1.8);
          gameScreen.classList.add('provoke-flash');
          var revertTimer = setTimeout(function() {
            if (interferenceActive) {
              SleepBar.setDrainRate(baseDrainForInterference);
            }
            gameScreen.classList.remove('provoke-flash');
            if (interferenceActive) scheduleProvoke();
          }, 2000);
          interferenceTimers.push(revertTimer);
        }, delay);
        interferenceTimers.push(provokeTimer);
      }
      scheduleProvoke();

    } else if (stageNum === 6) {
      // Stage 6: Undercurrent — drain fluctuates like waves
      var waveStart = Date.now();
      var waveTimer = setInterval(function() {
        if (!interferenceActive) return;
        var elapsed = (Date.now() - waveStart) / 1000;
        var waveFactor = 1.0 + 0.3 * Math.sin(elapsed * 0.8); // oscillates between 0.7 and 1.3
        SleepBar.setDrainRate(baseDrainForInterference * waveFactor);
      }, 200);
      interferenceTimers.push(waveTimer);

    } else if (stageNum >= 7 && stageNum <= 9) {
      // Stages 7-9: Mix — random interference at 50% frequency/duration
      startMixInterference(stageNum);

    } else if (stageNum === 10) {
      // Stage 10: Handled by updateInterferenceFinalBattle()
      startMixInterference(stageNum);
    }
  }

  function startMixInterference(stageNum) {
    // Mix of previous interferences at reduced intensity
    var gameScreen = document.getElementById('screen-game');
    var freqMultiplier = (stageNum === 10) ? 1.5 : 2.0; // less frequent

    // Frost drain (reduced)
    var frostTimer = setInterval(function() {
      if (!interferenceActive) return;
      SleepBar.setDrainRate(baseDrainForInterference * 1.3);
      gameScreen.classList.add('frost-drain-active');
      var revert = setTimeout(function() {
        if (interferenceActive) SleepBar.setDrainRate(baseDrainForInterference);
        gameScreen.classList.remove('frost-drain-active');
      }, 3000);
      interferenceTimers.push(revert);
    }, 30000 * freqMultiplier);
    interferenceTimers.push(frostTimer);

    // Void pulse (reduced)
    var voidTimer = setInterval(function() {
      if (!interferenceActive) return;
      gameScreen.classList.add('void-pulse-active');
      var revert = setTimeout(function() {
        gameScreen.classList.remove('void-pulse-active');
      }, 1500);
      interferenceTimers.push(revert);
    }, 45000 * freqMultiplier);
    interferenceTimers.push(voidTimer);

    // Doubt ghost (reduced)
    var doubtTimer = setInterval(function() {
      if (!interferenceActive) return;
      showDoubtGhost();
    }, 35000 * freqMultiplier);
    interferenceTimers.push(doubtTimer);
  }

  function showDoubtGhost() {
    var answerDisplay = document.getElementById('answer-display');
    if (!answerDisplay) return;
    // Generate a random wrong number
    var ghostNum = Math.floor(Math.random() * 900) + 100;
    var ghost = document.createElement('span');
    ghost.className = 'doubt-ghost';
    ghost.textContent = ghostNum;
    answerDisplay.style.position = 'relative';
    answerDisplay.appendChild(ghost);
    setTimeout(function() {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }, 1000);
  }

  function updateInterferenceFinalBattle(phase) {
    if (phase === 2) {
      // Interferencias desaparecen — Kurayami se debilita
      stopInterference();
      interferenceActive = false;
    } else if (phase === 3) {
      // Sin interferencias — victoria inevitable
      stopInterference();
      interferenceActive = false;
    }
  }

  function stopInterference() {
    interferenceActive = false;
    for (var i = 0; i < interferenceTimers.length; i++) {
      clearTimeout(interferenceTimers[i]);
      clearInterval(interferenceTimers[i]);
    }
    interferenceTimers = [];
    // Clean up CSS classes
    var gameScreen = document.getElementById('screen-game');
    if (gameScreen) {
      gameScreen.classList.remove('frost-drain-active');
      gameScreen.classList.remove('void-pulse-active');
      gameScreen.classList.remove('provoke-flash');
    }
  }

  // --- Battle Toast System (non-blocking phase dialogue) ---

  function showBattleToast(speaker, emoji, text, duration) {
    var gameScreen = document.getElementById('screen-game');
    if (!gameScreen) return;
    // Remove existing toast
    var existing = gameScreen.querySelector('.battle-toast');
    if (existing) existing.parentNode.removeChild(existing);

    var toast = document.createElement('div');
    toast.className = 'battle-toast';

    var TOAST_ICONS = {
      '🌑': 'assets/guardians/abyss.svg',
      '👁️': 'assets/yumemori.svg',
      '✨': 'assets/guardians/abyss.svg'
    };
    var iconSrc = TOAST_ICONS[emoji];
    var iconHtml = iconSrc
      ? '<img src="' + iconSrc + '" class="battle-toast-icon" alt="">'
      : '<span class="battle-toast-emoji">' + (emoji || '') + '</span>';

    toast.innerHTML = iconHtml + '<span class="battle-toast-speaker">' + speaker + ':</span> ' + text;
    gameScreen.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('battle-toast--fade-out');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }, (duration || 4000) - 500);
  }

  // Show sequential battle toasts for final battle phases
  var battleToastQueue = [];
  var battleToastRunning = false;

  function queueBattleToasts(toasts) {
    battleToastQueue = battleToastQueue.concat(toasts);
    if (!battleToastRunning) runNextBattleToast();
  }

  function runNextBattleToast() {
    if (battleToastQueue.length === 0) {
      battleToastRunning = false;
      return;
    }
    battleToastRunning = true;
    var t = battleToastQueue.shift();
    showBattleToast(t.speaker, t.emoji, t.text, t.duration || 4000);
    setTimeout(runNextBattleToast, (t.duration || 4000) + 1000);
  }

  // --- Problem Flow ---

  function nextProblem() {
    currentProblem = Problems.generateProblem(currentWorld, currentStage);
    problemStartTime = Date.now();
    renderProblem();
    Calculator.clear();
    Calculator.setDisabled(false);
  }

  // Remember Me: Yumemori auto-solves 5 problems in rapid golden bursts
  function autoSolveWithGoldenLight(answer) {
    var answerDisplay = document.getElementById('answer-display');
    var gameScreen = document.getElementById('screen-game');

    // INSTANT — slam the answer, golden flash, submit
    Calculator.setAnswer(String(answer));
    if (answerDisplay) answerDisplay.classList.add('golden-autosolve');
    if (gameScreen) gameScreen.classList.add('remember-me-burst');

    // Inline dialogue on specific counts
    if (rememberMeCount === 4) {
      showBattleToast('Kurayami', '🌑', '...Father... stop. You don\'t have the strength for this.', 3000);
    } else if (rememberMeCount === 2) {
      showBattleToast('Yumemori', '👁️', 'I have enough. To protect the one I love.', 3000);
    }

    rememberMeCount--;

    // Submit after a tiny flash (just enough to see the golden number)
    setTimeout(function() {
      if (answerDisplay) answerDisplay.classList.remove('golden-autosolve');
      if (gameScreen) gameScreen.classList.remove('remember-me-burst');

      if (rememberMeCount <= 0) {
        rememberMeActive = false;
        showBattleToast('Kurayami', '🌑', 'Always giving everything for others. You never kept anything for yourself.', 5000);
        renderPowerBarUI();
      }

      // Direct submit — bypasses the normal 350ms delay for next problem
      rememberMeSubmit(answer);
    }, 180);
  }

  function rememberMeSubmit(answer) {
    Calculator.setDisabled(true);
    stageProblems++;
    saveData.stats.totalProblems++;
    saveData.stats.totalCorrect++;
    Audio.correct();
    Calculator.showFeedback(true);

    // Boosted recovery — Yumemori's answers heal more
    SleepBar.correctAnswerScaled(1.5);
    showParticles(true);
    chargePowerBar(100); // fast answer time = max charge

    if (currentWorld === 7 && currentStage === 10) {
      updateFinalBattlePhase();
    }

    Storage.save(saveData);

    // Chain next problem FAST — no 350ms wait
    setTimeout(function() {
      if (gameState !== 'game') return;
      if (rememberMeActive && rememberMeCount > 0) {
        // Keep going — next problem, immediate auto-solve
        currentProblem = Problems.generateProblem(currentWorld, currentStage);
        problemStartTime = Date.now();
        renderProblem();
        Calculator.clear();
        autoSolveWithGoldenLight(currentProblem.answer);
      } else {
        // Done — return control to player
        nextProblem();
      }
    }, 220);
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

      // Abyss (World 7): scaled recovery per stage/phase
      if (currentWorld === 7) {
        var recoveryMult = getAbyssRecoveryMultiplier(currentStage, finalBattlePhase);
        // Stage 3 Wither: additional recovery degradation over time
        if (currentStage === 3 && interferenceActive) {
          witherProgress = Math.min(1, witherProgress + 0.05);
          recoveryMult *= (1.0 - witherProgress * 0.2); // degrades from 100% to 80%
        }
        SleepBar.correctAnswerScaled(recoveryMult);
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

      // Abyss (World 7): escalating penalty per stage
      if (currentWorld === 7) {
        SleepBar.wrongAnswerCustom(getAbyssPenalty(currentStage));
      } else {
        SleepBar.wrongAnswer();
      }

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
    var val = SleepBar.getValue();
    var oldPhase = finalBattlePhase;

    // Inverted arc: starts brutal, softens as player progresses
    // One-way ratchet — phases only advance, never regress
    if (val >= 66 && finalBattlePhase < 3) {
      finalBattlePhase = 3;
    } else if (val >= 33 && finalBattlePhase < 2) {
      finalBattlePhase = 2;
    }

    if (finalBattlePhase !== oldPhase && oldPhase > 0) {
      if (finalBattlePhase === 1) {
        // Phase 1: BRUTAL — highest drain, lowest recovery
        SleepBar.setDrainRate(2.5);
        baseDrainForInterference = 2.5;
      } else if (finalBattlePhase === 2) {
        // Phase 2: softens — Kurayami weakens, interferences stop
        SleepBar.setDrainRate(2.0);
        baseDrainForInterference = 2.0;
        updateInterferenceFinalBattle(2);
        // Phase transition toasts
        queueBattleToasts([
          { speaker: 'Kurayami', emoji: '🌑', text: 'Why... why do you keep fighting?', duration: 4000 },
          { speaker: 'Kurayami', emoji: '🌑', text: 'Why won\'t you give up?', duration: 4000 },
          { speaker: 'Kurayami', emoji: '🌑', text: 'I gave up. And I was stronger than any of you.', duration: 5000 }
        ]);
      } else if (finalBattlePhase === 3) {
        // Phase 3: the light wins — low drain, boosted recovery
        SleepBar.setDrainRate(1.5);
        baseDrainForInterference = 1.5;
        updateInterferenceFinalBattle(3);
        // Phase transition toasts
        queueBattleToasts([
          { speaker: 'Kurayami', emoji: '🌑', text: 'Stop... stop...', duration: 4000 },
          { speaker: 'Kurayami', emoji: '🌑', text: 'I don\'t want... I didn\'t want...', duration: 4000 },
          { speaker: 'Kurayami', emoji: '🌑', text: 'Father... I\'m sorry...', duration: 5000 }
        ]);
      }
    }
  }

  // --- Stage End ---

  function onStageComplete() {
    gameState = 'victory';
    SleepBar.destroy();
    stopInterference();
    clearEmbers();
    clearAurora();
    clearPsychic();
    clearCosmos();
    clearOcean();
    clearJungle();
    clearAbyss();
    clearEndlessDream();
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

    // World 7 stages 1-6: show post-stage dialogue before victory screen
    if (currentWorld === 7 && currentStage >= 1 && currentStage <= 6) {
      Dialogue.show('abyssStage_' + currentStage + '_post', function() {
        showLoreNotifs(newChapters, () => showVictoryScreen(result.stars));
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
    SleepBar.destroy();
    stopInterference();
    clearEmbers();
    clearAurora();
    clearPsychic();
    clearCosmos();
    clearOcean();
    clearJungle();
    clearAbyss();
    clearEndlessDream();
    Calculator.setDisabled(true);
    Audio.stopMusic();
    Audio.playIntroMusic();
    Audio.defeat();

    showScreen('defeat');
    document.getElementById('defeat-message').textContent = 'The Nightmares have woken you up... You have left the Dream World.';

    document.getElementById('btn-retry').onclick = () => {
      Audio.buttonPress();
      isRetrying = true;
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
      // World 7: charge only the powers available at this Abyss stage
      var abyssPowers = Powers.getAbyssAvailablePowers(currentStage);
      abyssPowers.forEach(powerId => {
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

    // World 7 (The Abyss): cumulative powers — only available ones for this stage
    if (chosenGuardian === 'all') {
      barContainer.className = 'power-bar power-bar--multi';
      var abyssPowers = Powers.getAbyssAvailablePowers(currentStage);
      abyssPowers.forEach(powerId => {
        barContainer.appendChild(createChargeBarElement(powerId, true));
        btnContainer.appendChild(createPowerButton(powerId));
      });
      // Stage 10: Add Remember Me button (special golden button, no charge needed)
      if (currentStage === 10 && !rememberMeActive) {
        var rmState = Powers.getChargeState('rememberMe');
        if (rmState && !rmState.isExhausted) {
          btnContainer.appendChild(createRememberMeButton());
        }
      }
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

  function createRememberMeButton() {
    var def = Powers.getDef('rememberMe');
    var btn = document.createElement('button');
    btn.className = 'power-btn power-btn--remember-me power-btn--ready';
    btn.dataset.power = 'rememberMe';
    btn.innerHTML = '<img src="' + def.icon + '" class="power-seal" alt="Remember Me"><span class="power-uses">Remember Me</span>';
    btn.addEventListener('click', function() {
      Audio.resume();
      usePower('rememberMe');
    });
    return btn;
  }

  function triggerRememberMeWave() {
    // Removed — wave effect was clipped on mobile
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

      case 'rememberMe':
        Powers.use(powerId);
        Audio.powerUsed();
        rememberMeActive = true;
        rememberMeCount = 5;
        showPowerEffect(Powers.getDef('rememberMe'), 'Remember Me!');
        showBattleToast('Yumemori', '👁️', 'One more time. Just one more time.', 3000);
        // Power shockwave from button position
        triggerRememberMeWave();
        // INSTANT — freeze drain briefly then unleash Yumemori
        SleepBar.freeze(3000);
        Calculator.setDisabled(true);
        setTimeout(function() {
          autoSolveWithGoldenLight(currentProblem.answer);
        }, 600);
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

  // --- Aurora Borealis (World 1 — Ice) ---

  let auroraSurgeInterval = null;

  function createAurora() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    // Aurora container with mix-blend-mode: screen
    const ac = document.createElement('div');
    ac.className = 'aurora-container';
    ac.id = 'aurora-fx';

    // 6 aurora bands (render order: 5, 3, 2, 1, 4, 6 for proper layering)
    [5, 3, 2, 1, 4, 6].forEach(n => {
      const band = document.createElement('div');
      band.className = 'aurora-band aurora-band--' + n;
      ac.appendChild(band);
    });

    // Curtain streaks
    const curtain = document.createElement('div');
    curtain.style.cssText = 'position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;';
    const streakColors = [
      { color: 'rgba(80,255,150,0.12)', mid: 'rgba(100,255,170,0.2)' },
      { color: 'rgba(50,200,220,0.1)', mid: 'rgba(60,220,240,0.16)' },
      { color: 'rgba(120,80,220,0.08)', mid: 'rgba(140,100,240,0.14)' },
      { color: 'rgba(100,255,180,0.1)', mid: 'rgba(120,255,200,0.18)' },
    ];
    for (let i = 0; i < 25; i++) {
      const s = document.createElement('div');
      s.className = 'curtain-streak';
      const c = streakColors[Math.floor(Math.random() * streakColors.length)];
      s.style.cssText = `
        --streak-width:${randomBetween(1,4)}px;--streak-height:${randomBetween(20,45)}%;
        --streak-top:${randomBetween(5,20)}%;--streak-left:${randomBetween(8,92)}%;
        --streak-color:${c.color};--streak-color-mid:${c.mid};
        --streak-blur:${randomBetween(3,8)}px;--streak-duration:${randomBetween(6,14)}s;
        --streak-delay:${randomBetween(0,10)}s;--streak-sway:${randomBetween(2,10)}px;
      `;
      curtain.appendChild(s);
    }
    ac.appendChild(curtain);
    container.appendChild(ac);

    // Ground reflection
    const refl = document.createElement('div');
    refl.className = 'aurora-reflection';
    container.appendChild(refl);

    // Snowfall — gentle ice particles
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'ice-particle';
      const size = randomBetween(1.5, 4);
      const iceOp = randomBetween(0.15, 0.4);
      p.style.cssText = `
        width:${size}px;height:${size}px;left:${randomBetween(0,100)}%;top:-10px;
        --ice-opacity:${iceOp};--snow-drift:${randomBetween(-80,80)}px;
        --snow-fall:${window.innerHeight + 20}px;--snow-rotate:${randomBetween(90,360)}deg;
        animation:snowfall ${randomBetween(8,18)}s linear ${randomBetween(0,12)}s infinite;
      `;
      container.appendChild(p);
    }

    // Brightness surges every 4s
    if (auroraSurgeInterval) clearInterval(auroraSurgeInterval);
    auroraSurgeInterval = setInterval(() => {
      const auroraEl = document.getElementById('aurora-fx');
      if (!auroraEl || Math.random() > 0.5) return;
      const surge = randomBetween(1.2, 1.8);
      auroraEl.style.transition = 'filter ' + randomBetween(1.5, 3) + 's ease-in-out';
      auroraEl.style.filter = 'brightness(' + surge + ')';
      setTimeout(() => {
        if (auroraEl) {
          auroraEl.style.transition = 'filter ' + randomBetween(2, 4) + 's ease-in-out';
          auroraEl.style.filter = 'brightness(1)';
        }
      }, randomBetween(1500, 4000));
    }, 4000);
  }

  function clearAurora() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    container.querySelectorAll('.aurora-container, .aurora-reflection, .ice-particle').forEach(el => el.remove());
    if (auroraSurgeInterval) {
      clearInterval(auroraSurgeInterval);
      auroraSurgeInterval = null;
    }
  }

  // --- Volcano Ember Particles ---

  let emberBurstInterval = null;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createEmbers(count) {
    const container = document.getElementById('game-embers');
    if (!container) return;
    container.innerHTML = '';

    // Add fire glow elements
    const glow = document.createElement('div');
    glow.className = 'volcano-glow';
    container.appendChild(glow);
    const glowInner = document.createElement('div');
    glowInner.className = 'volcano-glow-inner';
    container.appendChild(glowInner);

    const heat = document.getElementById('game-heat');
    if (heat) heat.classList.remove('hidden');

    const types = ['bright', 'warm', 'dim', 'spark'];
    const weights = [0.15, 0.3, 0.3, 0.25];

    function pickType() {
      let r = Math.random();
      for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0) return types[i];
      }
      return types[types.length - 1];
    }

    for (let i = 0; i < count; i++) {
      const type = pickType();
      const ember = document.createElement('div');
      ember.className = 'ember ember--' + type;

      let size;
      if (type === 'bright') size = randomBetween(4, 8);
      else if (type === 'warm') size = randomBetween(3, 6);
      else if (type === 'dim') size = randomBetween(2, 5);
      else size = randomBetween(1, 3);

      const centerBias = Math.random() < 0.6;
      const startX = centerBias ? randomBetween(25, 75) : randomBetween(5, 95);
      const driftX = randomBetween(-120, 120);
      const driftY = -(window.innerHeight * randomBetween(0.5, 1.1));
      const duration = randomBetween(4, 10) + (size * 0.3);
      const delay = randomBetween(0, 8);
      const peakOpacity = type === 'bright' ? randomBetween(0.8, 1) : randomBetween(0.5, 0.8);
      const midOpacity = type === 'spark' ? randomBetween(0.1, 0.3) : randomBetween(0.2, 0.5);
      const endScale = randomBetween(0.1, 0.4);
      const endRotation = randomBetween(90, 540) * (Math.random() < 0.5 ? 1 : -1);

      ember.style.cssText = `
        width:${size}px;height:${size}px;left:${startX}%;
        --drift-x:${driftX}px;--drift-y:${driftY}px;
        --peak-opacity:${peakOpacity};--mid-opacity:${midOpacity};
        --end-scale:${endScale};--end-rotation:${endRotation}deg;
        animation:emberRise ${duration}s ease-out ${delay}s infinite;
      `;

      if (type === 'bright' || (type === 'warm' && Math.random() < 0.3)) {
        const flkDur = randomBetween(0.3, 1.2);
        ember.style.animation += `, emberFlicker ${flkDur}s ease-in-out ${delay}s infinite`;
      }

      container.appendChild(ember);
    }

    // Spark bursts every 3s
    if (emberBurstInterval) clearInterval(emberBurstInterval);
    emberBurstInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        const burstCount = Math.floor(randomBetween(3, 8));
        const burstX = randomBetween(30, 70);
        for (let j = 0; j < burstCount; j++) {
          const spark = document.createElement('div');
          spark.className = 'ember ember--spark';
          const s = randomBetween(1, 3);
          const dx = randomBetween(-60, 60);
          const dy = -(window.innerHeight * randomBetween(0.3, 0.7));
          const dur = randomBetween(2, 5);
          spark.style.cssText = `
            width:${s}px;height:${s}px;left:${burstX + randomBetween(-5, 5)}%;
            --drift-x:${dx}px;--drift-y:${dy}px;
            --peak-opacity:1;--mid-opacity:0.3;
            --end-scale:0.1;--end-rotation:${randomBetween(90, 360)}deg;
            animation:emberRise ${dur}s ease-out 0s 1;
          `;
          container.appendChild(spark);
          setTimeout(() => spark.remove(), dur * 1000);
        }
      }
    }, 3000);
  }

  function clearEmbers() {
    const container = document.getElementById('game-embers');
    if (container) container.innerHTML = '';
    const heat = document.getElementById('game-heat');
    if (heat) heat.classList.add('hidden');
    if (emberBurstInterval) {
      clearInterval(emberBurstInterval);
      emberBurstInterval = null;
    }
  }

  // --- Cosmos (World 4 — Canvas Star Warp + Nebula Clouds) ---

  let cosmosRAF = null;

  function createCosmos() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    // Main cosmos container
    const cc = document.createElement('div');
    cc.className = 'cosmos-container';
    cc.id = 'cosmos-fx';

    // Canvas for star warp
    const canvas = document.createElement('canvas');
    canvas.className = 'cosmos-canvas';
    canvas.id = 'cosmos-canvas';
    cc.appendChild(canvas);

    // 5 nebula clouds on top of canvas
    for (let n = 1; n <= 5; n++) {
      const cloud = document.createElement('div');
      cloud.className = 'nebula-cloud nebula-cloud--' + n;
      cc.appendChild(cloud);
    }

    container.appendChild(cc);

    // --- Canvas star warp system ---
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas._resizeHandler = resizeCanvas;

    // Star config
    const STAR_COUNT = 500;
    const MAX_DEPTH = 1500;
    const SPEED = 3.5; // tuned for ~80 BPM feel

    const STAR_COLORS = [
      [190, 210, 255],  // cool blue-white
      [220, 230, 255],  // bright white-blue
      [255, 245, 240],  // warm white
      [210, 195, 255],  // lavender
      [255, 225, 210],  // peach hint
      [180, 220, 255],  // ice blue
      [240, 240, 255],  // pure white
    ];

    // Star pool
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * Math.max(W, H) * 0.8;
      const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      stars.push({
        x: Math.cos(angle) * spread,
        y: Math.sin(angle) * spread,
        z: Math.random() * MAX_DEPTH,
        color: c,
        baseSize: 0.3 + Math.random() * 0.7
      });
    }

    function resetStar(s) {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * Math.max(W, H) * 0.8;
      s.x = Math.cos(angle) * spread;
      s.y = Math.sin(angle) * spread;
      s.z = MAX_DEPTH;
      s.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      s.baseSize = 0.3 + Math.random() * 0.7;
    }

    // Background — purple-tinted, not too dark
    const BG_R = 8, BG_G = 5, BG_B = 28;

    // Nebula glow zones (drawn on canvas for extra depth)
    const nebulaZones = [
      { xr: 0.3, yr: 0.35, rxr: 0.3, ryr: 0.25, r: 30, g: 12, b: 55, a: 0.018 },
      { xr: 0.7, yr: 0.25, rxr: 0.25, ryr: 0.3, r: 15, g: 18, b: 45, a: 0.015 },
      { xr: 0.5, yr: 0.75, rxr: 0.35, ryr: 0.2, r: 35, g: 10, b: 40, a: 0.012 },
      { xr: 0.15, yr: 0.6, rxr: 0.2, ryr: 0.2, r: 20, g: 15, b: 50, a: 0.01 },
    ];

    let lastTime = performance.now();

    function animate(now) {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      // Clear with purple-tinted background
      ctx.fillStyle = `rgb(${BG_R},${BG_G},${BG_B})`;
      ctx.fillRect(0, 0, W, H);

      // Draw subtle nebula glow zones
      for (const n of nebulaZones) {
        const nx = n.xr * W, ny = n.yr * H;
        const nr = Math.max(n.rxr * W, n.ryr * H);
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        grad.addColorStop(0, `rgba(${n.r},${n.g},${n.b},${n.a})`);
        grad.addColorStop(0.5, `rgba(${n.r},${n.g},${n.b},${n.a * 0.5})`);
        grad.addColorStop(1, `rgba(${n.r},${n.g},${n.b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Center vanishing point glow
      const pulse = 1 + Math.sin(now * 0.0005) * 0.15;
      const cRadius = 100 * pulse;
      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cRadius);
      cGrad.addColorStop(0, 'rgba(120, 100, 180, 0.025)');
      cGrad.addColorStop(0.3, 'rgba(90, 70, 150, 0.012)');
      cGrad.addColorStop(1, 'rgba(50, 30, 100, 0)');
      ctx.fillStyle = cGrad;
      ctx.fillRect(cx - cRadius, cy - cRadius, cRadius * 2, cRadius * 2);

      // Update & draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= SPEED * dt;
        if (s.z <= 0) resetStar(s);

        // Project 3D → 2D
        const scale = 800 / s.z;
        const sx = cx + s.x * scale;
        const sy = cy + s.y * scale;

        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) continue;

        const depthRatio = 1 - s.z / MAX_DEPTH;
        const size = s.baseSize + depthRatio * 3;
        const alpha = 0.05 + depthRatio * depthRatio * 0.95;

        const [r, g, b] = s.color;

        // Motion blur streak for closer stars
        const streakFactor = depthRatio * depthRatio;
        if (streakFactor > 0.15) {
          const dx = (sx - cx) * 0.015 * streakFactor;
          const dy = (sy - cy) * 0.015 * streakFactor;
          const streakLen = Math.sqrt(dx * dx + dy * dy);
          if (streakLen > 0.5) {
            const gradient = ctx.createLinearGradient(
              sx - dx * 3, sy - dy * 3, sx, sy
            );
            gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
            gradient.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.3})`);
            gradient.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.7})`);
            ctx.beginPath();
            ctx.moveTo(sx - dx * 3, sy - dy * 3);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = size * 0.6;
            ctx.stroke();
          }
        }

        // Star point
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Glow for brighter stars
        if (alpha > 0.5 && size > 1.5) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 1.5, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 1.5);
          glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.25})`);
          glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      cosmosRAF = requestAnimationFrame(animate);
    }

    cosmosRAF = requestAnimationFrame(animate);
  }

  function clearCosmos() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    // Remove resize listener
    const canvas = document.getElementById('cosmos-canvas');
    if (canvas && canvas._resizeHandler) {
      window.removeEventListener('resize', canvas._resizeHandler);
    }
    // Cancel animation
    if (cosmosRAF) {
      cancelAnimationFrame(cosmosRAF);
      cosmosRAF = null;
    }
    container.querySelectorAll('.cosmos-container').forEach(el => el.remove());
  }

  // --- Ocean (World 6 — God rays, caustics, plankton, debris, depth fog) ---

  let oceanCausticRAF = null;
  let oceanPlanktonTimer = null;
  let oceanDebrisTimer = null;
  let oceanRaySurgeInterval = null;

  function createOcean() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    const oc = document.createElement('div');
    oc.className = 'ocean-container';
    oc.id = 'ocean-fx';

    // Ocean depth gradient overlay
    const depth = document.createElement('div');
    depth.className = 'ocean-depth';
    oc.appendChild(depth);

    // Surface light
    const surface = document.createElement('div');
    surface.className = 'ocean-surface-light';
    oc.appendChild(surface);

    // --- God rays ---
    const raysContainer = document.createElement('div');
    raysContainer.className = 'ocean-rays';
    raysContainer.id = 'ocean-rays';

    const RAY_COUNT = 7;
    const rayAnims = ['rayWave1', 'rayWave2', 'rayWave3'];
    for (let i = 0; i < RAY_COUNT; i++) {
      const ray = document.createElement('div');
      ray.className = 'god-ray';

      const width = randomBetween(80, 220);
      const height = randomBetween(80, 110);
      const left = randomBetween(5, 85);
      const baseAngle = randomBetween(-12, 12);
      const blur = randomBetween(6, 18);
      const lo = randomBetween(0.3, 0.5);
      const hi = randomBetween(0.7, 1);
      const midO = randomBetween(0.4, 0.65);
      const hue = randomBetween(180, 200);
      const sat = randomBetween(60, 90);
      const topA = randomBetween(0.03, 0.06);
      const midA = topA * 0.6;
      const lowA = topA * 0.25;
      const anim = rayAnims[Math.floor(Math.random() * rayAnims.length)];
      const dur = randomBetween(10, 22);

      ray.style.cssText = `
        left:${left}%;width:${width}px;height:${height}vh;
        --ray-base:${baseAngle}deg;--ray-blur:${blur}px;
        --ray-lo:${lo};--ray-hi:${hi};--ray-mid-o:${midO};
        --ray-top:hsla(${hue},${sat}%,55%,${topA});
        --ray-mid:hsla(${hue},${sat}%,45%,${midA});
        --ray-low:hsla(${hue},${sat}%,35%,${lowA});
        animation:${anim} ${dur}s ease-in-out ${randomBetween(0, 8)}s infinite;
        opacity:${lo};
      `;

      const inner = document.createElement('div');
      inner.className = 'god-ray-inner';
      ray.appendChild(inner);
      raysContainer.appendChild(ray);
    }
    oc.appendChild(raysContainer);

    // --- Caustics canvas ---
    const causticsCanvas = document.createElement('canvas');
    causticsCanvas.className = 'ocean-caustics';
    causticsCanvas.id = 'ocean-caustics';
    oc.appendChild(causticsCanvas);

    // --- Plankton layer ---
    const planktonLayer = document.createElement('div');
    planktonLayer.className = 'ocean-plankton-layer';
    planktonLayer.id = 'ocean-plankton';
    oc.appendChild(planktonLayer);

    // --- Debris layer ---
    const debrisLayer = document.createElement('div');
    debrisLayer.className = 'ocean-plankton-layer';
    debrisLayer.id = 'ocean-debris';
    oc.appendChild(debrisLayer);

    // --- Depth fog ---
    const fog = document.createElement('div');
    fog.className = 'ocean-depth-fog';
    oc.appendChild(fog);

    container.appendChild(oc);

    // --- Caustics canvas animation ---
    const cCtx = causticsCanvas.getContext('2d');
    let cW, cH;

    function resizeCaustics() {
      const rect = causticsCanvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cW = rect.width;
      cH = rect.height;
      causticsCanvas.width = cW * dpr;
      causticsCanvas.height = cH * dpr;
      cCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCaustics();
    window.addEventListener('resize', resizeCaustics);
    causticsCanvas._resizeHandler = resizeCaustics;

    // Caustic nodes
    const CAUSTIC_NODES = 18;
    const nodes = [];
    for (let i = 0; i < CAUSTIC_NODES; i++) {
      nodes.push({
        x: randomBetween(0, cW), y: randomBetween(0, cH),
        vx: randomBetween(-0.15, 0.15), vy: randomBetween(-0.12, 0.12),
        phase: randomBetween(0, Math.PI * 2),
        freq: randomBetween(0.003, 0.008),
      });
    }

    let causticTime = 0;
    function drawCaustics() {
      causticTime += 16;
      cCtx.clearRect(0, 0, cW, cH);

      // Update node positions
      for (const n of nodes) {
        n.x += n.vx + Math.sin(causticTime * n.freq + n.phase) * 0.3;
        n.y += n.vy + Math.cos(causticTime * n.freq * 0.7 + n.phase) * 0.25;
        if (n.x < -50) n.x = cW + 50;
        if (n.x > cW + 50) n.x = -50;
        if (n.y < -50) n.y = cH + 50;
        if (n.y > cH + 50) n.y = -50;
      }

      // Draw connections
      const maxDist = 280;
      cCtx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.06;
            const midX = (nodes[i].x + nodes[j].x) / 2 + Math.sin(causticTime * 0.002 + i) * 8;
            const midY = (nodes[i].y + nodes[j].y) / 2 + Math.cos(causticTime * 0.0015 + j) * 6;
            cCtx.beginPath();
            cCtx.moveTo(nodes[i].x, nodes[i].y);
            cCtx.quadraticCurveTo(midX, midY, nodes[j].x, nodes[j].y);
            cCtx.strokeStyle = `rgba(0, 190, 220, ${alpha})`;
            cCtx.stroke();
          }
        }
      }

      // Draw node glows
      for (const n of nodes) {
        const pulse = 0.7 + Math.sin(causticTime * n.freq * 2 + n.phase) * 0.3;
        const radius = 30 * pulse;
        const grad = cCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius);
        grad.addColorStop(0, `rgba(0, 200, 230, ${0.025 * pulse})`);
        grad.addColorStop(1, 'rgba(0, 150, 190, 0)');
        cCtx.fillStyle = grad;
        cCtx.fillRect(n.x - radius, n.y - radius, radius * 2, radius * 2);
      }

      oceanCausticRAF = requestAnimationFrame(drawCaustics);
    }
    oceanCausticRAF = requestAnimationFrame(drawCaustics);

    // --- Plankton particles ---
    const planktonColors = [
      (o) => ({ bg: `rgba(0,180,216,${o})`, glow: `rgba(0,180,216,${o * 0.4})` }),
      (o) => ({ bg: `rgba(0,150,200,${o})`, glow: `rgba(0,150,200,${o * 0.35})` }),
      (o) => ({ bg: `rgba(0,200,230,${o * 0.8})`, glow: `rgba(0,200,230,${o * 0.3})` }),
      (o) => ({ bg: `rgba(120,220,240,${o * 0.6})`, glow: `rgba(120,220,240,${o * 0.25})` }),
      (o) => ({ bg: `rgba(80,255,200,${o * 0.5})`, glow: `rgba(80,255,200,${o * 0.2})` }),
    ];

    function spawnPlankton() {
      const pl = document.getElementById('ocean-plankton');
      if (!pl) return;

      const p = document.createElement('div');
      p.className = 'plankton';

      const size = randomBetween(1, 3.5);
      const opacity = randomBetween(0.15, 0.45);
      const dur = randomBetween(15, 30);
      const cFn = planktonColors[Math.floor(Math.random() * planktonColors.length)];
      const c = cFn(opacity);

      const startLeft = Math.random() < 0.6;
      const sx = startLeft ? randomBetween(-10, 5) : randomBetween(-5, 80);
      const sy = randomBetween(5, 95);
      const ex = sx + randomBetween(25, 60);
      const ey = sy + randomBetween(-15, 5);
      const mx = (sx + ex) / 2 + randomBetween(-8, 8);
      const my = (sy + ey) / 2 + randomBetween(-10, 10);

      p.style.cssText = `
        width:${size}px;height:${size}px;left:0;top:0;
        background:radial-gradient(circle, ${c.bg} 0%, transparent 70%);
        box-shadow:0 0 ${size * 2}px ${size * 0.5}px ${c.glow};
        --p-sx:${sx}vw;--p-sy:${sy}vh;
        --p-mx:${mx}vw;--p-my:${my}vh;
        --p-ex:${ex}vw;--p-ey:${ey}vh;
        --p-peak:${opacity};--p-mid:${opacity * 0.7};
        animation:oceanDrift ${dur}s ease-in-out forwards;
      `;

      pl.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 200);
    }

    function schedulePlankton() {
      spawnPlankton();
      oceanPlanktonTimer = setTimeout(schedulePlankton, randomBetween(300, 900));
    }
    schedulePlankton();

    // --- Floating debris ---
    function spawnDebris() {
      const dl = document.getElementById('ocean-debris');
      if (!dl) return;

      const d = document.createElement('div');
      d.className = 'ocean-debris';

      const w = randomBetween(3, 8);
      const h = randomBetween(2, 5);
      const opacity = randomBetween(0.06, 0.15);
      const dur = randomBetween(25, 50);

      const startLeft = Math.random() < 0.5;
      const sx = startLeft ? randomBetween(-5, 10) : randomBetween(10, 70);
      const sy = randomBetween(10, 90);
      const ex = sx + randomBetween(20, 50);
      const ey = sy + randomBetween(-10, 5);
      const mx = (sx + ex) / 2 + randomBetween(-10, 10);
      const my = (sy + ey) / 2 + randomBetween(-12, 8);
      const rot = randomBetween(30, 180);

      d.style.cssText = `
        width:${w}px;height:${h}px;left:0;top:0;
        background:radial-gradient(ellipse, rgba(0,160,190,${opacity}) 0%, rgba(0,120,150,${opacity * 0.4}) 50%, transparent 100%);
        --db-sx:${sx}vw;--db-sy:${sy}vh;
        --db-mx:${mx}vw;--db-my:${my}vh;
        --db-ex:${ex}vw;--db-ey:${ey}vh;
        --db-rot:${rot}deg;--db-o:${opacity};
        animation:debrisDrift ${dur}s ease-in-out forwards;
      `;

      dl.appendChild(d);
      setTimeout(() => d.remove(), dur * 1000 + 200);
    }

    function scheduleDebris() {
      spawnDebris();
      oceanDebrisTimer = setTimeout(scheduleDebris, randomBetween(2000, 5000));
    }
    scheduleDebris();

    // --- Ray intensity surges ---
    oceanRaySurgeInterval = setInterval(() => {
      const raysEl = document.getElementById('ocean-rays');
      if (!raysEl || Math.random() > 0.3) return;
      const rays = raysEl.querySelectorAll('.god-ray');
      if (rays.length === 0) return;
      const ray = rays[Math.floor(Math.random() * rays.length)];
      const brightness = randomBetween(1.3, 2);
      const dur = randomBetween(3, 7);
      ray.style.transition = `filter ${dur}s ease-in-out`;
      ray.style.filter = `brightness(${brightness})`;
      setTimeout(() => {
        ray.style.transition = `filter ${randomBetween(4, 8)}s ease-in-out`;
        ray.style.filter = '';
      }, dur * 1000);
    }, 5000);
  }

  function clearOcean() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    // Remove resize listener
    const canvas = document.getElementById('ocean-caustics');
    if (canvas && canvas._resizeHandler) {
      window.removeEventListener('resize', canvas._resizeHandler);
    }
    // Cancel animation frames & timers
    if (oceanCausticRAF) {
      cancelAnimationFrame(oceanCausticRAF);
      oceanCausticRAF = null;
    }
    if (oceanPlanktonTimer) {
      clearTimeout(oceanPlanktonTimer);
      oceanPlanktonTimer = null;
    }
    if (oceanDebrisTimer) {
      clearTimeout(oceanDebrisTimer);
      oceanDebrisTimer = null;
    }
    if (oceanRaySurgeInterval) {
      clearInterval(oceanRaySurgeInterval);
      oceanRaySurgeInterval = null;
    }
    container.querySelectorAll('.ocean-container').forEach(el => el.remove());
  }

  // --- Jungle (World 3 — Forest silhouettes, vines, canopy rays, fireflies, spores, bioluminescence) ---

  let jungleFireflyRAF = null;
  let jungleSporeTimer = null;
  let jungleCanopySurgeInterval = null;
  let jungleBioSurgeInterval = null;

  function createJungle() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    const jc = document.createElement('div');
    jc.className = 'jungle-container';
    jc.id = 'jungle-fx';

    function rand(a, b) { return a + Math.random() * (b - a); }

    // --- SVG Forest Silhouettes ---

    // FAR layer
    const farSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    farSVG.setAttribute('class', 'forest-layer forest-layer--far');
    farSVG.setAttribute('viewBox', '0 0 1920 1080');
    farSVG.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    farSVG.innerHTML = `
      <defs><linearGradient id="farTrunk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1f10" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#071509" stop-opacity="0.9"/>
      </linearGradient></defs>
      <path d="M120,1080 L115,600 Q110,500 118,400 Q122,300 116,180 L124,180 Q130,300 126,400 Q120,500 128,600 L135,1080Z" fill="url(#farTrunk)"/>
      <path d="M320,1080 L318,650 Q315,550 320,420 Q325,320 318,200 L326,195 Q332,320 327,420 Q322,550 328,650 L332,1080Z" fill="url(#farTrunk)"/>
      <path d="M550,1080 L545,580 Q542,460 548,340 Q552,240 546,120 L556,115 Q560,240 555,340 Q548,460 556,580 L562,1080Z" fill="url(#farTrunk)"/>
      <path d="M780,1080 L776,620 Q773,500 778,380 Q783,260 777,150 L786,145 Q790,260 785,380 Q780,500 787,620 L792,1080Z" fill="url(#farTrunk)"/>
      <path d="M1020,1080 L1016,590 Q1012,470 1018,350 Q1024,230 1017,100 L1027,95 Q1032,230 1026,350 Q1020,470 1028,590 L1034,1080Z" fill="url(#farTrunk)"/>
      <path d="M1250,1080 L1246,640 Q1242,520 1248,400 Q1254,290 1247,160 L1257,155 Q1262,290 1256,400 Q1250,520 1258,640 L1264,1080Z" fill="url(#farTrunk)"/>
      <path d="M1450,1080 L1447,560 Q1444,440 1449,310 Q1453,200 1448,80 L1457,75 Q1461,200 1456,310 Q1451,440 1458,560 L1462,1080Z" fill="url(#farTrunk)"/>
      <path d="M1680,1080 L1676,610 Q1673,490 1678,370 Q1682,250 1677,130 L1686,125 Q1690,250 1685,370 Q1680,490 1688,610 L1692,1080Z" fill="url(#farTrunk)"/>
      <path d="M1850,1080 L1846,570 Q1843,450 1848,330 Q1852,220 1847,90 L1856,85 Q1860,220 1855,330 Q1850,450 1857,570 L1862,1080Z" fill="url(#farTrunk)"/>
      <path d="M118,380 Q80,340 50,350" stroke="#0a1f10" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M548,300 Q510,260 480,275" stroke="#0a1f10" stroke-width="2" fill="none" opacity="0.35"/>
      <path d="M1018,320 Q1060,275 1090,285" stroke="#0a1f10" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M1448,270 Q1410,230 1385,245" stroke="#0a1f10" stroke-width="2" fill="none" opacity="0.35"/>
    `;
    jc.appendChild(farSVG);

    // MID layer
    const midSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    midSVG.setAttribute('class', 'forest-layer forest-layer--mid');
    midSVG.setAttribute('viewBox', '0 0 1920 1080');
    midSVG.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    midSVG.innerHTML = `
      <defs><linearGradient id="midTrunk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#081a0d" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#061208" stop-opacity="1"/>
      </linearGradient></defs>
      <path d="M60,1080 L52,550 Q46,400 55,280 Q60,180 52,60 L68,55 Q75,180 68,280 Q60,400 72,550 L78,1080Z" fill="url(#midTrunk)"/>
      <path d="M400,1080 L394,600 Q388,460 396,340 Q402,220 395,80 L412,74 Q418,220 410,340 Q402,460 412,600 L420,1080Z" fill="url(#midTrunk)"/>
      <path d="M700,1080 L693,560 Q686,420 695,300 Q702,180 694,50 L712,44 Q718,180 710,300 Q702,420 714,560 L722,1080Z" fill="url(#midTrunk)"/>
      <path d="M1100,1080 L1094,580 Q1088,440 1096,310 Q1102,190 1095,40 L1112,34 Q1118,190 1110,310 Q1102,440 1114,580 L1120,1080Z" fill="url(#midTrunk)"/>
      <path d="M1500,1080 L1493,540 Q1486,400 1495,270 Q1502,150 1494,20 L1512,14 Q1518,150 1510,270 Q1502,400 1514,540 L1522,1080Z" fill="url(#midTrunk)"/>
      <path d="M1800,1080 L1794,600 Q1788,460 1796,340 Q1802,210 1795,70 L1812,64 Q1818,210 1810,340 Q1802,460 1814,600 L1820,1080Z" fill="url(#midTrunk)"/>
      <path d="M55,250 Q10,200 -20,220 Q-30,222 -20,218" stroke="#081a0d" stroke-width="3" fill="none" opacity="0.5"/>
      <path d="M60,400 Q100,350 130,365" stroke="#081a0d" stroke-width="2.5" fill="none" opacity="0.4"/>
      <path d="M396,300 Q350,250 320,270" stroke="#081a0d" stroke-width="3" fill="none" opacity="0.45"/>
      <path d="M402,200 Q440,150 470,165" stroke="#081a0d" stroke-width="2.5" fill="none" opacity="0.4"/>
      <path d="M695,260 Q650,210 620,230" stroke="#081a0d" stroke-width="3" fill="none" opacity="0.45"/>
      <path d="M1096,280 Q1140,230 1170,248" stroke="#081a0d" stroke-width="2.5" fill="none" opacity="0.4"/>
      <path d="M1495,230 Q1450,180 1420,200" stroke="#081a0d" stroke-width="3" fill="none" opacity="0.45"/>
      <path d="M1796,300 Q1840,250 1870,268" stroke="#081a0d" stroke-width="2.5" fill="none" opacity="0.4"/>
      <path d="M52,1080 Q30,1040 10,1060 Q-5,1075 0,1080" fill="url(#midTrunk)" opacity="0.5"/>
      <path d="M78,1080 Q100,1045 120,1065 Q130,1078 125,1080" fill="url(#midTrunk)" opacity="0.5"/>
      <path d="M394,1080 Q370,1035 350,1058 Q340,1072 335,1080" fill="url(#midTrunk)" opacity="0.45"/>
      <path d="M420,1080 Q445,1040 465,1060 Q475,1075 470,1080" fill="url(#midTrunk)" opacity="0.45"/>
    `;
    jc.appendChild(midSVG);

    // --- Hanging Vines SVG ---
    const vinesSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    vinesSVG.setAttribute('class', 'vines-layer');
    vinesSVG.setAttribute('viewBox', '0 0 1920 1080');
    vinesSVG.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    vinesSVG.innerHTML = `
      <defs>
        <linearGradient id="vineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1f10" stop-opacity="0.5"/>
          <stop offset="50%" stop-color="#081a0d" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#071509" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="vineGradThin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1f10" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="#081a0d" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#071509" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
      <g class="vine-group vine-group--1">
        <path d="M80,-10 Q75,50 85,120 Q92,200 78,280 Q68,360 82,430 Q90,480 76,530" stroke="url(#vineGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M82,280 Q65,310 55,300" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
        <path d="M78,430 Q60,450 50,440" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
      </g>
      <g class="vine-group vine-group--2">
        <path d="M160,-10 Q155,70 165,160 Q172,260 158,350 Q148,420 162,490 Q170,550 155,610 Q145,660 158,700" stroke="url(#vineGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M158,350 Q140,375 130,365" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
        <path d="M155,610 Q138,635 128,620" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
      <g class="vine-group vine-group--3">
        <path d="M310,-10 Q305,80 315,170 Q322,250 308,330 Q298,400 312,460" stroke="url(#vineGradThin)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M308,330 Q290,350 282,338" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
      <g class="vine-group vine-group--4">
        <path d="M520,-10 Q516,90 525,190 Q532,290 518,380 Q508,460 522,540 Q530,600 516,660 Q508,710 520,760 Q528,800 515,840" stroke="url(#vineGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M518,380 Q498,410 488,395" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
        <path d="M516,660 Q500,685 490,672" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
      <g class="vine-group vine-group--5">
        <path d="M1080,-10 Q1075,60 1085,140 Q1092,220 1078,300 Q1068,370 1082,430" stroke="url(#vineGradThin)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M1078,300 Q1058,325 1050,312" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
      <g class="vine-group vine-group--6">
        <path d="M1380,-10 Q1375,80 1385,180 Q1393,280 1378,370 Q1368,450 1382,530 Q1390,600 1376,670 Q1368,730 1380,790" stroke="url(#vineGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M1378,370 Q1360,398 1350,385" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
        <path d="M1376,670 Q1358,695 1348,680" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
      <g class="vine-group vine-group--7">
        <path d="M1650,-10 Q1645,70 1655,160 Q1662,250 1648,330 Q1638,400 1652,470 Q1660,530 1645,580" stroke="url(#vineGrad)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M1648,330 Q1630,355 1620,342" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
      </g>
      <g class="vine-group vine-group--8">
        <path d="M1820,-10 Q1816,100 1825,210 Q1832,310 1818,400 Q1808,480 1822,560 Q1830,630 1815,700 Q1805,760 1818,810 Q1826,860 1812,900" stroke="url(#vineGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M1818,400 Q1800,428 1790,415" stroke="url(#vineGradThin)" stroke-width="1.5" fill="none"/>
        <path d="M1815,700 Q1798,725 1788,710" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
        <path d="M1812,900 Q1800,920 1790,910" stroke="url(#vineGradThin)" stroke-width="1" fill="none"/>
      </g>
    `;
    jc.appendChild(vinesSVG);

    // --- Canopy light rays ---
    const canopyEl = document.createElement('div');
    canopyEl.className = 'canopy-container';
    const CANOPY_RAYS = 5;
    for (let i = 0; i < CANOPY_RAYS; i++) {
      const ray = document.createElement('div');
      ray.className = 'canopy-ray';
      const width = rand(60, 180);
      const height = rand(70, 100);
      const left = rand(8, 80);
      const baseAngle = rand(-8, 8);
      const blur = rand(10, 22);
      const lo = rand(0.2, 0.4);
      const hi = rand(0.6, 0.9);
      const midO = (lo + hi) / 2;
      const hue = rand(95, 140);
      const sat = rand(40, 70);
      const light = rand(45, 60);
      const topA = rand(0.025, 0.05);
      const anim = Math.random() < 0.5 ? 'canopyWave1' : 'canopyWave2';
      const dur = rand(12, 25);
      ray.style.cssText = `
        left: ${left}%;
        width: ${width}px;
        height: ${height}vh;
        --cr-base: ${baseAngle}deg;
        --cr-blur: ${blur}px;
        --cr-lo: ${lo};
        --cr-hi: ${hi};
        --cr-mid-o: ${midO};
        --cr-top: hsla(${hue}, ${sat}%, ${light}%, ${topA});
        --cr-mid: hsla(${hue}, ${sat}%, ${light - 10}%, ${topA * 0.5});
        --cr-low: hsla(${hue}, ${sat}%, ${light - 20}%, ${topA * 0.15});
        animation: ${anim} ${dur}s ease-in-out ${rand(0, 8)}s infinite;
        opacity: ${lo};
      `;
      const inner = document.createElement('div');
      inner.className = 'canopy-ray-inner';
      ray.appendChild(inner);
      canopyEl.appendChild(ray);
    }
    jc.appendChild(canopyEl);

    // --- Ground bioluminescence ---
    const bioEl = document.createElement('div');
    bioEl.className = 'ground-glow';
    const BIO_PATCHES = 12;
    for (let i = 0; i < BIO_PATCHES; i++) {
      const patch = document.createElement('div');
      patch.className = 'bio-patch';
      const size = rand(60, 200);
      const left = rand(-5, 95);
      const bottom = rand(-5, 15);
      const lo = rand(0.15, 0.3);
      const hi = rand(0.5, 0.8);
      const hue = rand(120, 170);
      const sat = rand(50, 80);
      const baseA = rand(0.02, 0.045);
      patch.style.cssText = `
        width: ${size}px;
        height: ${size * rand(0.5, 0.8)}px;
        left: ${left}%;
        bottom: ${bottom}%;
        background: radial-gradient(ellipse, hsla(${hue}, ${sat}%, 50%, ${baseA}) 0%, hsla(${hue}, ${sat}%, 40%, ${baseA * 0.4}) 40%, transparent 70%);
        filter: blur(${rand(15, 30)}px);
        --bio-lo: ${lo};
        --bio-hi: ${hi};
        --bio-scale: ${rand(1.02, 1.1)};
        animation: bioPulse ${rand(5, 12)}s ease-in-out ${rand(0, 6)}s infinite;
      `;
      bioEl.appendChild(patch);
    }
    jc.appendChild(bioEl);

    // --- Mist layers ---
    const mistNames = ['low', 'mid', 'high'];
    for (const m of mistNames) {
      const mist = document.createElement('div');
      mist.className = 'jungle-mist jungle-mist--' + m;
      jc.appendChild(mist);
    }

    // --- Spores (rising particles) ---
    const sporesEl = document.createElement('div');
    sporesEl.className = 'spore-container';
    jc.appendChild(sporesEl);

    function createSpore() {
      const s = document.createElement('div');
      s.className = 'spore';
      const size = rand(1.5, 4);
      const opacity = rand(0.2, 0.5);
      const dur = rand(12, 28);
      const colors = [
        { bg: `rgba(220, 190, 80, ${opacity})`, glow: `rgba(220, 190, 80, ${opacity * 0.4})` },
        { bg: `rgba(200, 180, 70, ${opacity * 0.9})`, glow: `rgba(200, 180, 70, ${opacity * 0.35})` },
        { bg: `rgba(240, 210, 100, ${opacity * 0.8})`, glow: `rgba(240, 210, 100, ${opacity * 0.3})` },
        { bg: `rgba(180, 200, 80, ${opacity * 0.7})`, glow: `rgba(180, 200, 80, ${opacity * 0.25})` },
      ];
      const c = colors[Math.floor(rand(0, colors.length))];
      const sx = rand(5, 95);
      const sy = rand(75, 100);
      const ey = sy - rand(40, 75);
      const ex = sx + rand(-15, 15);
      const mx = (sx + ex) / 2 + rand(-10, 10);
      const my = (sy + ey) / 2 + rand(-5, 5);
      s.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${sx}%;
        top: ${sy}%;
        background: radial-gradient(circle, ${c.bg} 0%, transparent 70%);
        box-shadow: 0 0 ${size * 2.5}px ${size * 0.6}px ${c.glow};
        --sp-mx: ${mx - sx}vw;
        --sp-my: ${my - sy}vh;
        --sp-ex: ${ex - sx}vw;
        --sp-ey: ${ey - sy}vh;
        --sp-peak: ${opacity};
        --sp-mid: ${opacity * 0.6};
        animation: sporeRise ${dur}s ease-in-out forwards;
      `;
      sporesEl.appendChild(s);
      setTimeout(() => s.remove(), dur * 1000 + 200);
    }

    function scheduleSpore() {
      createSpore();
      jungleSporeTimer = setTimeout(scheduleSpore, rand(400, 1200));
    }
    scheduleSpore();

    // --- Fireflies (Canvas) ---
    const ffCanvas = document.createElement('canvas');
    ffCanvas.className = 'jungle-fireflies';
    ffCanvas.id = 'jungle-fireflies-canvas';
    jc.appendChild(ffCanvas);

    const ffCtx = ffCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let fW, fH;

    function resizeFF() {
      fW = window.innerWidth;
      fH = window.innerHeight;
      ffCanvas.width = fW * dpr;
      ffCanvas.height = fH * dpr;
      ffCanvas.style.width = fW + 'px';
      ffCanvas.style.height = fH + 'px';
      ffCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeFF();
    ffCanvas._resizeHandler = resizeFF;
    window.addEventListener('resize', resizeFF);

    // Firefly objects
    const FIREFLY_COUNT = 30;
    const fireflies = [];

    function createFirefly() {
      return {
        x: rand(fW * 0.05, fW * 0.95),
        y: rand(fH * 0.1, fH * 0.85),
        size: rand(1.5, 3.5),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.15, 0.15),
        wanderAngle: rand(0, Math.PI * 2),
        wanderSpeed: rand(0.008, 0.02),
        phase: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.015, 0.04),
        minGlow: rand(0.05, 0.15),
        maxGlow: rand(0.4, 0.8),
        bloomTimer: rand(200, 800),
        blooming: false,
        bloomBrightness: 0,
        r: Math.round(rand(80, 180)),
        g: Math.round(rand(200, 255)),
        b: Math.round(rand(80, 180)),
        currentAlpha: 0,
        currentSize: 1.5,
      };
    }

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const ff = createFirefly();
      // Some blue-ish fireflies
      if (Math.random() < 0.25) {
        ff.r = Math.round(rand(50, 120));
        ff.g = Math.round(rand(180, 240));
        ff.b = Math.round(rand(180, 255));
      }
      fireflies.push(ff);
    }

    function updateFirefly(ff) {
      ff.wanderAngle += rand(-0.08, 0.08);
      ff.vx += Math.cos(ff.wanderAngle) * ff.wanderSpeed;
      ff.vy += Math.sin(ff.wanderAngle) * ff.wanderSpeed;
      ff.vx *= 0.98;
      ff.vy *= 0.98;
      ff.x += ff.vx;
      ff.y += ff.vy;
      const margin = 30;
      if (ff.x < margin) ff.vx += 0.05;
      if (ff.x > fW - margin) ff.vx -= 0.05;
      if (ff.y < margin) ff.vy += 0.05;
      if (ff.y > fH - margin) ff.vy -= 0.05;
      ff.phase += ff.pulseSpeed;
      const basePulse = ff.minGlow + (ff.maxGlow - ff.minGlow) * (0.5 + 0.5 * Math.sin(ff.phase));
      ff.bloomTimer--;
      if (ff.bloomTimer <= 0 && !ff.blooming) {
        ff.blooming = true;
        ff.bloomBrightness = 0;
      }
      if (ff.blooming) {
        ff.bloomBrightness += 0.06;
        if (ff.bloomBrightness >= 1) {
          ff.blooming = false;
          ff.bloomTimer = rand(300, 1000);
        }
      } else {
        ff.bloomBrightness *= 0.97;
      }
      const bloomCurve = Math.sin(ff.bloomBrightness * Math.PI);
      ff.currentAlpha = basePulse + bloomCurve * 0.5;
      ff.currentSize = ff.size + bloomCurve * 2;
    }

    function drawFirefly(ctx, ff) {
      const alpha = Math.min(ff.currentAlpha, 1);
      if (alpha < 0.02) return;
      const glowRadius = ff.currentSize * 6;
      const glow = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, glowRadius);
      glow.addColorStop(0, `rgba(${ff.r},${ff.g},${ff.b},${alpha * 0.15})`);
      glow.addColorStop(0.3, `rgba(${ff.r},${ff.g},${ff.b},${alpha * 0.06})`);
      glow.addColorStop(1, `rgba(${ff.r},${ff.g},${ff.b},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(ff.x - glowRadius, ff.y - glowRadius, glowRadius * 2, glowRadius * 2);
      const coreRadius = ff.currentSize;
      const core = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, coreRadius);
      core.addColorStop(0, `rgba(255,255,240,${alpha * 0.8})`);
      core.addColorStop(0.4, `rgba(${ff.r},${ff.g},${ff.b},${alpha * 0.6})`);
      core.addColorStop(1, `rgba(${ff.r},${ff.g},${ff.b},0)`);
      ctx.beginPath();
      ctx.arc(ff.x, ff.y, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    }

    function animateFireflies() {
      ffCtx.clearRect(0, 0, fW, fH);
      for (const ff of fireflies) {
        updateFirefly(ff);
        drawFirefly(ffCtx, ff);
      }
      jungleFireflyRAF = requestAnimationFrame(animateFireflies);
    }
    jungleFireflyRAF = requestAnimationFrame(animateFireflies);

    // --- Canopy ray surges ---
    jungleCanopySurgeInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const rays = canopyEl.querySelectorAll('.canopy-ray');
        if (rays.length === 0) return;
        const ray = rays[Math.floor(rand(0, rays.length))];
        const brightness = rand(1.3, 1.8);
        const dur = rand(3, 6);
        ray.style.transition = `filter ${dur}s ease-in-out`;
        ray.style.filter = `brightness(${brightness})`;
        setTimeout(() => {
          ray.style.transition = `filter ${rand(4, 7)}s ease-in-out`;
          ray.style.filter = '';
        }, dur * 1000);
      }
    }, 5000);

    // --- Bio glow surges ---
    jungleBioSurgeInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        const patches = bioEl.querySelectorAll('.bio-patch');
        if (patches.length === 0) return;
        const patch = patches[Math.floor(rand(0, patches.length))];
        const brightness = rand(1.4, 2.2);
        patch.style.transition = `filter ${rand(2, 4)}s ease-in-out`;
        patch.style.filter = `brightness(${brightness})`;
        setTimeout(() => {
          patch.style.transition = `filter ${rand(3, 5)}s ease-in-out`;
          patch.style.filter = '';
        }, rand(2000, 5000));
      }
    }, 3000);

    container.appendChild(jc);
  }

  function clearJungle() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    // Remove canvas resize listener
    const canvas = document.getElementById('jungle-fireflies-canvas');
    if (canvas && canvas._resizeHandler) {
      window.removeEventListener('resize', canvas._resizeHandler);
    }
    // Cancel animation frame
    if (jungleFireflyRAF) {
      cancelAnimationFrame(jungleFireflyRAF);
      jungleFireflyRAF = null;
    }
    // Clear timers
    if (jungleSporeTimer) {
      clearTimeout(jungleSporeTimer);
      jungleSporeTimer = null;
    }
    if (jungleCanopySurgeInterval) {
      clearInterval(jungleCanopySurgeInterval);
      jungleCanopySurgeInterval = null;
    }
    if (jungleBioSurgeInterval) {
      clearInterval(jungleBioSurgeInterval);
      jungleBioSurgeInterval = null;
    }
    container.querySelectorAll('.jungle-container').forEach(el => el.remove());
  }

  // --- Endless Dream (Freestyle — flow streams toward vanishing point, speed dots, motes, pulse waves) ---

  let dreamRAF = null;
  let dreamTime = 0;
  let dreamPulseWaves = [];

  function triggerDreamPulse() {
    dreamPulseWaves.push({ birth: dreamTime, radius: 0, maxRadius: 0, speed: 4, opacity: 0.25 });
  }

  function createEndlessDream() {
    var container = document.getElementById('game-embers');
    if (!container) return;

    var dc = document.createElement('div');
    dc.className = 'dream-container';
    dc.id = 'dream-fx';

    var bgCanvas = document.createElement('canvas');
    bgCanvas.className = 'dream-canvas'; bgCanvas.id = 'dream-bg';
    dc.appendChild(bgCanvas);

    var flowCanvas = document.createElement('canvas');
    flowCanvas.className = 'dream-canvas'; flowCanvas.id = 'dream-flow';
    flowCanvas.style.zIndex = '1';
    dc.appendChild(flowCanvas);

    var fgCanvas = document.createElement('canvas');
    fgCanvas.className = 'dream-canvas'; fgCanvas.id = 'dream-fg';
    fgCanvas.style.zIndex = '2';
    dc.appendChild(fgCanvas);

    container.appendChild(dc);

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, cx, cy, playTop, playBot;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function lerp(a, b, t) { return a + (b - a) * t; }

    function measurePlayArea() {
      var header = document.querySelector('.game-header');
      var calc = document.querySelector('.calculator-grid');
      if (header && calc) {
        var hBot = header.getBoundingClientRect().bottom;
        var cTop = calc.getBoundingClientRect().top;
        if (cTop > hBot && (cTop - hBot) >= 50) {
          playTop = hBot;
          playBot = cTop;
          return;
        }
      }
      playTop = H * 0.08;
      playBot = H * 0.55;
    }

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      measurePlayArea();
      cx = W / 2;
      cy = playTop + (playBot - playTop) / 2;
      [bgCanvas, flowCanvas, fgCanvas].forEach(function(c) {
        c.width = W * DPR; c.height = H * DPR;
        c.style.width = W + 'px'; c.style.height = H + 'px';
        c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      });
    }
    resize();
    bgCanvas._resizeHandler = resize;
    window.addEventListener('resize', resize);
    requestAnimationFrame(resize);

    var bgCtx = bgCanvas.getContext('2d');
    var flowCtx = flowCanvas.getContext('2d');
    var fgCtx = fgCanvas.getContext('2d');
    bgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    flowCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // ---- Color System (brighter for mobile) ----
    function getFlowColor(time, offset, alpha) {
      var t = time * 0.00004 + offset;
      var cycle = t % 1;
      var r, g, b;
      if (cycle < 0.2) {
        var p = cycle / 0.2;
        r = lerp(160, 120, p); g = lerp(140, 160, p); b = lerp(255, 255, p);
      } else if (cycle < 0.4) {
        var p2 = (cycle - 0.2) / 0.2;
        r = lerp(120, 100, p2); g = lerp(160, 200, p2); b = lerp(255, 250, p2);
      } else if (cycle < 0.6) {
        var p3 = (cycle - 0.4) / 0.2;
        r = lerp(100, 240, p3); g = lerp(200, 210, p3); b = lerp(250, 120, p3);
      } else if (cycle < 0.8) {
        var p4 = (cycle - 0.6) / 0.2;
        r = lerp(240, 200, p4); g = lerp(210, 140, p4); b = lerp(120, 220, p4);
      } else {
        var p5 = (cycle - 0.8) / 0.2;
        r = lerp(200, 160, p5); g = lerp(140, 140, p5); b = lerp(220, 255, p5);
      }
      return 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + alpha + ')';
    }

    // ---- Pulse Waves ----
    dreamPulseWaves = [];

    // ---- Flow Streams (more and brighter for mobile) ----
    var STREAM_COUNT = 40;
    var streams = [];
    function resetStream(s) {
      var side = Math.random();
      if (side < 0.25) { s.ox = rand(0, W); s.oy = rand(-50, -10); }
      else if (side < 0.5) { s.ox = rand(0, W); s.oy = rand(H + 10, H + 50); }
      else if (side < 0.75) { s.ox = rand(-50, -10); s.oy = rand(0, H); }
      else { s.ox = rand(W + 10, W + 50); s.oy = rand(0, H); }
      s.progress = 0;
      s.speed = rand(0.0012, 0.005);
      s.width = rand(2, 7);
      s.baseOpacity = rand(0.06, 0.18);
      s.curveBias = rand(-60, 60);
      s.curveWobble = rand(0.001, 0.003);
      s.wobblePhase = rand(0, Math.PI * 2);
      s.trailLength = rand(0.15, 0.45);
    }
    for (var si = 0; si < STREAM_COUNT; si++) {
      var sObj = { colorOffset: si / STREAM_COUNT };
      resetStream(sObj);
      sObj.progress = rand(0, 1);
      streams.push(sObj);
    }

    function drawStream(ctx, s, time) {
      s.progress += s.speed;
      s.wobblePhase += s.curveWobble;
      if (s.progress > 1 + s.trailLength) resetStream(s);

      var segments = 30;
      var trailStart = Math.max(0, s.progress - s.trailLength);
      var trailEnd = Math.min(1, s.progress);
      if (trailEnd <= trailStart) return;

      var wobble = Math.sin(s.wobblePhase) * s.curveBias;
      ctx.beginPath();
      var started = false;
      for (var i = 0; i <= segments; i++) {
        var t = trailStart + (trailEnd - trailStart) * (i / segments);
        if (t < 0 || t > 1) continue;
        var ease = t * t;
        var curveOff = Math.sin(t * Math.PI) * wobble * (1 - t);
        var x = lerp(s.ox, cx, ease) + curveOff;
        var y = lerp(s.oy, cy, ease) + curveOff * 0.5;
        if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
      }

      var headT = Math.min(1, s.progress);
      var perspFade = 1 - headT * headT * 0.6;
      var alpha = s.baseOpacity * perspFade;
      if (alpha < 0.005) return;
      var headW = s.width * (1 - headT * 0.7);

      ctx.strokeStyle = getFlowColor(time, s.colorOffset, alpha);
      ctx.lineWidth = Math.max(0.8, headW);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();

      // Bright core line
      if (alpha > 0.015) {
        ctx.strokeStyle = getFlowColor(time, s.colorOffset, Math.min(alpha * 2, 0.35));
        ctx.lineWidth = Math.max(0.4, headW * 0.4);
        ctx.stroke();
      }

      // Glow on thicker streams
      if (s.width > 4 && alpha > 0.04) {
        ctx.save();
        ctx.shadowColor = getFlowColor(time, s.colorOffset, 0.3);
        ctx.shadowBlur = 12;
        ctx.strokeStyle = getFlowColor(time, s.colorOffset, alpha * 0.4);
        ctx.lineWidth = Math.max(0.3, headW * 0.3);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ---- Speed Dots (brighter, tighter distribution) ----
    var SPEED_DOT_COUNT = 90;
    var speedDots = [];
    function resetDot(d) {
      var angle = rand(0, Math.PI * 2);
      // Tighter distribution — keep more visible on mobile screen
      var maxDist = Math.min(W, H) * 0.55;
      var dist = rand(maxDist * 0.25, maxDist);
      d.x = cx + Math.cos(angle) * dist;
      d.y = cy + Math.sin(angle) * dist;
      d.speed = rand(0.6, 2.2);
      d.size = rand(1, 3);
      d.opacity = rand(0.15, 0.45);
      d.colorOffset = rand(0, 1);
      d.prevX = d.x; d.prevY = d.y;
      d.alive = true; d.currentOpacity = d.opacity;
    }
    for (var di = 0; di < SPEED_DOT_COUNT; di++) {
      var dObj = {};
      resetDot(dObj);
      var da = rand(0, Math.PI * 2);
      var dd = rand(20, Math.min(W, H) * 0.5);
      dObj.x = cx + Math.cos(da) * dd;
      dObj.y = cy + Math.sin(da) * dd;
      dObj.prevX = dObj.x; dObj.prevY = dObj.y;
      speedDots.push(dObj);
    }

    function updateDot(d) {
      d.prevX = d.x; d.prevY = d.y;
      var dx = cx - d.x, dy = cy - d.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8) { d.alive = false; return; }
      var accel = 1 + (1 - dist / Math.max(W, H)) * 3;
      var nx = dx / dist, ny = dy / dist;
      d.x += nx * d.speed * accel;
      d.y += ny * d.speed * accel;
      d.currentOpacity = d.opacity * Math.min(1, dist / (Math.max(W, H) * 0.1));
    }

    function drawDot(ctx, d, time) {
      if (d.currentOpacity < 0.01) return;
      // Trail line
      ctx.beginPath(); ctx.moveTo(d.prevX, d.prevY); ctx.lineTo(d.x, d.y);
      ctx.strokeStyle = getFlowColor(time, d.colorOffset, d.currentOpacity);
      ctx.lineWidth = d.size; ctx.lineCap = 'round'; ctx.stroke();
      // Head dot
      ctx.beginPath(); ctx.arc(d.x, d.y, d.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = getFlowColor(time, d.colorOffset, Math.min(d.currentOpacity * 1.8, 0.6));
      ctx.fill();
    }

    // ---- Ambient Motes (brighter, concentrated in play area) ----
    var MOTE_COUNT = 50;
    var motes = [];
    for (var mi = 0; mi < MOTE_COUNT; mi++) {
      // 70% in play area, 30% everywhere
      var inPlay = mi < MOTE_COUNT * 0.7;
      motes.push({
        x: rand(0, W),
        y: inPlay ? rand(playTop, playBot) : rand(0, H),
        size: rand(1, 2.5),
        opacity: rand(0.06, 0.18),
        driftX: rand(-0.12, 0.12),
        driftY: rand(-0.18, -0.04),
        pulsePhase: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.015, 0.04),
        colorOffset: rand(0, 1)
      });
    }

    function drawMote(ctx, m, time) {
      m.x += m.driftX; m.y += m.driftY; m.pulsePhase += m.pulseSpeed;
      if (m.y < -5) m.y = H + 5;
      if (m.x < -5) m.x = W + 5;
      if (m.x > W + 5) m.x = -5;
      var pulse = 0.5 + 0.5 * Math.sin(m.pulsePhase);
      var a = m.opacity * pulse;
      if (a < 0.008) return;
      // Outer glow
      var glowR = m.size * 6;
      var glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, glowR);
      glow.addColorStop(0, getFlowColor(time, m.colorOffset, a * 0.5));
      glow.addColorStop(0.6, getFlowColor(time, m.colorOffset, a * 0.15));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(m.x - glowR, m.y - glowR, glowR * 2, glowR * 2);
      // Bright core
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = getFlowColor(time, m.colorOffset, Math.min(a * 1.3, 0.3));
      ctx.fill();
    }

    // ---- Background (brighter for mobile) ----
    function drawBackground(time) {
      bgCtx.fillStyle = '#050510';
      bgCtx.fillRect(0, 0, W, H);

      // Depth zones — centered around play area, brighter
      var zones = [
        [cx * 0.7, cy * 0.8, 0.45],
        [cx * 1.3, cy * 1.15, 0.4],
        [cx, cy, 0.35]
      ];
      for (var i = 0; i < zones.length; i++) {
        var z = zones[i];
        var a = 0.035 + 0.02 * Math.sin(time * 0.0003 + i * 2);
        var g = bgCtx.createRadialGradient(z[0], z[1], 0, z[0], z[1], Math.max(W, H) * z[2]);
        g.addColorStop(0, getFlowColor(time, i * 0.33, a));
        g.addColorStop(0.5, getFlowColor(time, i * 0.33, a * 0.4));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        bgCtx.fillStyle = g; bgCtx.fillRect(0, 0, W, H);
      }

      // Vanishing point glow — stronger and warmer
      var vpA = 0.07 + 0.025 * Math.sin(time * 0.0005);
      var vpGlow = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.35);
      vpGlow.addColorStop(0, getFlowColor(time, 0.5, vpA));
      vpGlow.addColorStop(0.25, getFlowColor(time, 0.5, vpA * 0.5));
      vpGlow.addColorStop(0.6, getFlowColor(time, 0.5, vpA * 0.15));
      vpGlow.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = vpGlow; bgCtx.fillRect(0, 0, W, H);

      // Secondary ambient glow — adds warmth to the play area
      var ambA = 0.025 + 0.01 * Math.sin(time * 0.0003 + 1.5);
      var ambGlow = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
      ambGlow.addColorStop(0, getFlowColor(time, 0.2, ambA));
      ambGlow.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = ambGlow; bgCtx.fillRect(0, 0, W, H);

      // Soft vignette — gentle framing, not crushing
      var vig = bgCtx.createRadialGradient(cx, cy, Math.min(W, H) * 0.35, cx, cy, Math.max(W, H) * 0.7);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.6, 'rgba(0,0,0,0.1)');
      vig.addColorStop(1, 'rgba(0,0,0,0.4)');
      bgCtx.fillStyle = vig; bgCtx.fillRect(0, 0, W, H);
    }

    // ---- Overlay (pulses + UI fades) ----
    function drawOverlay(time) {
      fgCtx.clearRect(0, 0, W, H);
      for (var i = dreamPulseWaves.length - 1; i >= 0; i--) {
        var p = dreamPulseWaves[i];
        if (p.maxRadius === 0) p.maxRadius = Math.max(W, H) * 0.8;
        p.radius += p.speed;
        var progress = p.radius / p.maxRadius;
        var alpha = p.opacity * (1 - progress) * (1 - progress);
        if (alpha < 0.002 || progress > 1) { dreamPulseWaves.splice(i, 1); continue; }
        var ringW = 30 + progress * 40;
        var innerR = Math.max(0, p.radius - ringW);
        var ring = fgCtx.createRadialGradient(cx, cy, innerR, cx, cy, p.radius);
        ring.addColorStop(0, 'rgba(0,0,0,0)');
        ring.addColorStop(0.3, getFlowColor(time, 0.5, alpha * 0.4));
        ring.addColorStop(0.7, getFlowColor(time, 0.5, alpha * 1.2));
        ring.addColorStop(1, 'rgba(0,0,0,0)');
        fgCtx.fillStyle = ring;
        fgCtx.beginPath(); fgCtx.arc(cx, cy, p.radius, 0, Math.PI * 2); fgCtx.fill();
        // Bright inner edge
        var bRing = fgCtx.createRadialGradient(cx, cy, Math.max(0, p.radius - 10), cx, cy, p.radius + 3);
        bRing.addColorStop(0, 'rgba(0,0,0,0)');
        bRing.addColorStop(0.5, getFlowColor(time, 0.5, alpha * 0.7));
        bRing.addColorStop(1, 'rgba(0,0,0,0)');
        fgCtx.fillStyle = bRing;
        fgCtx.beginPath(); fgCtx.arc(cx, cy, p.radius, 0, Math.PI * 2); fgCtx.fill();
        // Center flash on birth
        if (progress < 0.06) {
          var flash = fgCtx.createRadialGradient(cx, cy, 0, cx, cy, 80);
          flash.addColorStop(0, getFlowColor(time, 0.5, 0.12 * (1 - progress / 0.06)));
          flash.addColorStop(1, 'rgba(0,0,0,0)');
          fgCtx.fillStyle = flash; fgCtx.fillRect(cx - 80, cy - 80, 160, 160);
        }
      }
      // Gentle top/bottom fade for UI space
      var topFade = fgCtx.createLinearGradient(0, 0, 0, H * 0.1);
      topFade.addColorStop(0, 'rgba(5,5,16,0.35)'); topFade.addColorStop(1, 'rgba(5,5,16,0)');
      fgCtx.fillStyle = topFade; fgCtx.fillRect(0, 0, W, H * 0.1);
      var botFade = fgCtx.createLinearGradient(0, H * 0.9, 0, H);
      botFade.addColorStop(0, 'rgba(5,5,16,0)'); botFade.addColorStop(1, 'rgba(5,5,16,0.25)');
      fgCtx.fillStyle = botFade; fgCtx.fillRect(0, H * 0.9, W, H * 0.1);
    }

    // ---- Animation loop ----
    dreamTime = 0;

    function animate() {
      dreamTime += 16;
      // Background (not every frame)
      if (dreamTime % 64 < 17) drawBackground(dreamTime);
      // Flow layer
      flowCtx.clearRect(0, 0, W, H);
      for (var mi2 = 0; mi2 < motes.length; mi2++) drawMote(flowCtx, motes[mi2], dreamTime);
      for (var si2 = 0; si2 < streams.length; si2++) drawStream(flowCtx, streams[si2], dreamTime);
      for (var di2 = 0; di2 < speedDots.length; di2++) {
        updateDot(speedDots[di2]);
        if (!speedDots[di2].alive) resetDot(speedDots[di2]);
        drawDot(flowCtx, speedDots[di2], dreamTime);
      }
      // Overlay
      drawOverlay(dreamTime);
      dreamRAF = requestAnimationFrame(animate);
    }

    dreamRAF = requestAnimationFrame(animate);
  }

  function clearEndlessDream() {
    var container = document.getElementById('game-embers');
    if (!container) return;
    var bgC = document.getElementById('dream-bg');
    if (bgC && bgC._resizeHandler) window.removeEventListener('resize', bgC._resizeHandler);
    if (dreamRAF) { cancelAnimationFrame(dreamRAF); dreamRAF = null; }
    dreamTime = 0;
    dreamPulseWaves = [];
    container.querySelectorAll('.dream-container').forEach(function(el) { el.remove(); });
  }

  // --- Abyss (World 7 — Vortex black hole, spiraling particles, shadow souls) ---

  let abyssRAF = null;
  let abyssTime = 0;

  function createAbyss() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    const ac = document.createElement('div');
    ac.className = 'abyss-container';
    ac.id = 'abyss-fx';

    // Three canvases like the original demo — bg, mid (elements+lightning), fg (overlay)
    const bgCanvas = document.createElement('canvas');
    bgCanvas.className = 'abyss-canvas';
    bgCanvas.id = 'abyss-bg';
    ac.appendChild(bgCanvas);

    const midCanvas = document.createElement('canvas');
    midCanvas.className = 'abyss-canvas';
    midCanvas.id = 'abyss-main';
    midCanvas.style.zIndex = '1';
    ac.appendChild(midCanvas);

    const fgCanvas = document.createElement('canvas');
    fgCanvas.className = 'abyss-canvas';
    fgCanvas.id = 'abyss-overlay';
    fgCanvas.style.zIndex = '2';
    ac.appendChild(fgCanvas);

    // Scanlines overlay
    const scanlines = document.createElement('div');
    scanlines.className = 'abyss-scanlines';
    ac.appendChild(scanlines);

    // Glitch bands
    const gb1 = document.createElement('div');
    gb1.className = 'abyss-glitch-band';
    ac.appendChild(gb1);
    const gb2 = document.createElement('div');
    gb2.className = 'abyss-glitch-band';
    ac.appendChild(gb2);

    container.appendChild(ac);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, cx, cy;
    // Play area bounds — visible region between header and calculator
    let playTop = 0, playBot = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      cx = W / 2;
      cy = H / 2;
      [bgCanvas, midCanvas, fgCanvas].forEach(function(c) {
        c.width = W * DPR;
        c.height = H * DPR;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      });
      // Detect play area from game header and calculator
      var header = document.querySelector('.game-header');
      var calc = document.querySelector('.calculator-grid');
      if (header && calc) {
        var hRect = header.getBoundingClientRect();
        var cRect = calc.getBoundingClientRect();
        playTop = hRect.bottom;
        playBot = cRect.top;
      } else {
        playTop = H * 0.12;
        playBot = H * 0.62;
      }
    }

    resize();
    bgCanvas._resizeHandler = resize;
    window.addEventListener('resize', resize);
    // Deferred re-measure after layout settles
    requestAnimationFrame(resize);

    var bgCtx = bgCanvas.getContext('2d');
    var midCtx = midCanvas.getContext('2d');
    var fgCtx = fgCanvas.getContext('2d');
    bgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    midCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // ---- Heartbeat System ----
    const HEART_RATE = 0.0025;
    function getHeartbeat(t) {
      const hp = t * HEART_RATE;
      const th = hp % (Math.PI * 2);
      const beat1 = Math.max(0, Math.sin(th * 2) * Math.exp(-th * 0.8));
      const beat2 = Math.max(0, Math.sin((th - 0.4) * 2) * Math.exp(-(th - 0.4) * 1.2) * 0.6);
      return Math.min(1, beat1 + beat2);
    }

    // ---- Nightmare Eyes ----
    // More eyes, bigger, brighter — must be visible on small mobile screen
    const MAX_EYES = 20;
    const eyes = [];

    function resetEye(e) {
      e.x = rand(W * 0.02, W * 0.98);
      // 80% of eyes spawn in visible play area, 20% anywhere
      e.y = Math.random() < 0.8 ? rand(playTop, playBot) : rand(H * 0.05, H * 0.95);
      e.size = rand(8, 28);
      e.maxOpen = rand(0.5, 1);
      e.openness = 0;
      e.state = 'waiting';
      e.waitTime = rand(40, 300);
      e.stareTime = rand(60, 300);
      e.timer = 0;
      const intensity = rand(0.7, 1);
      e.cr = rand(200, 255) * intensity;
      e.cg = rand(5, 40) * intensity;
      e.cb = rand(10, 50) * intensity;
      e.pupilSize = rand(0.2, 0.45);
      e.glowR = e.size * rand(5, 10);
      e.driftX = rand(-0.03, 0.03);
      e.driftY = rand(-0.015, 0.015);
      e.lookX = (cx - e.x) * 0.0003;
      e.lookY = (cy - e.y) * 0.0003;
      e.alive = true;
    }

    for (let i = 0; i < MAX_EYES; i++) {
      const e = {};
      resetEye(e);
      e.waitTime = rand(0, 200);
      eyes.push(e);
    }

    function updateEye(e) {
      e.timer++;
      e.x += e.driftX;
      e.y += e.driftY;
      switch (e.state) {
        case 'waiting':
          if (e.timer > e.waitTime) { e.state = 'opening'; e.timer = 0; } break;
        case 'opening':
          e.openness += 0.03;
          if (e.openness >= e.maxOpen) { e.openness = e.maxOpen; e.state = 'staring'; e.timer = 0; } break;
        case 'staring':
          e.openness = e.maxOpen + Math.sin(e.timer * 0.1) * 0.04;
          if (e.timer > e.stareTime) { e.state = 'closing'; e.timer = 0; } break;
        case 'closing':
          e.openness -= 0.02;
          if (e.openness <= 0) { e.openness = 0; e.alive = false; } break;
      }
    }

    function drawEye(c, e) {
      if (e.openness < 0.01) return;
      const o = e.openness, s = e.size;
      // Ambient glow — much brighter
      const glow = c.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.glowR);
      glow.addColorStop(0, 'rgba(' + (e.cr|0) + ',' + (e.cg|0) + ',' + (e.cb|0) + ',' + (o * 0.15) + ')');
      glow.addColorStop(0.4, 'rgba(' + (e.cr|0) + ',' + (e.cg|0) + ',' + (e.cb|0) + ',' + (o * 0.05) + ')');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = glow;
      c.fillRect(e.x - e.glowR, e.y - e.glowR, e.glowR * 2, e.glowR * 2);
      c.save();
      c.translate(e.x, e.y);
      // Eye socket
      c.beginPath();
      c.ellipse(0, 0, s, s * o * 0.5, 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(' + (e.cr * 0.2 | 0) + ',' + (e.cg * 0.1 | 0) + ',' + (e.cb * 0.1 | 0) + ',' + (o * 0.8) + ')';
      c.fill();
      const irisR = s * 0.6 * o;
      if (irisR > 0.5) {
        // Iris
        const iG = c.createRadialGradient(e.lookX * s, e.lookY * s, 0, e.lookX * s, e.lookY * s, irisR);
        iG.addColorStop(0, 'rgba(' + (e.cr|0) + ',' + (e.cg|0) + ',' + (e.cb|0) + ',' + (o * 0.95) + ')');
        iG.addColorStop(0.6, 'rgba(' + (e.cr * 0.6 | 0) + ',' + (e.cg * 0.3 | 0) + ',' + (e.cb * 0.5 | 0) + ',' + (o * 0.8) + ')');
        iG.addColorStop(1, 'rgba(' + (e.cr * 0.2 | 0) + ',0,' + (e.cb * 0.2 | 0) + ',' + (o * 0.4) + ')');
        c.beginPath();
        c.arc(e.lookX * s, e.lookY * s, irisR, 0, Math.PI * 2);
        c.fillStyle = iG;
        c.fill();
        // Slit pupil
        c.beginPath();
        c.ellipse(e.lookX * s, e.lookY * s, irisR * e.pupilSize * 0.35, irisR * e.pupilSize, 0, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0,0,0,' + (o * 0.95) + ')';
        c.fill();
        // Specular highlight
        c.beginPath();
        c.arc(e.lookX * s + irisR * 0.25, e.lookY * s - irisR * 0.2, irisR * 0.15, 0, Math.PI * 2);
        c.fillStyle = 'rgba(255,200,200,' + (o * 0.5) + ')';
        c.fill();
      }
      c.restore();
    }

    // ---- Broken Geometry ----
    const SHAPE_COUNT = 20;
    const shapes = [];

    function resetShape(sh, initial) {
      sh.x = rand(-50, W + 50);
      sh.y = initial ? rand(0, H) : rand(-60, -20);
      sh.size = rand(15, 60);
      sh.rotation = rand(0, Math.PI * 2);
      sh.rotSpeed = rand(-0.008, 0.008);
      sh.driftX = rand(-0.15, 0.15);
      sh.driftY = rand(0.05, 0.25);
      sh.opacity = rand(0.06, 0.18);
      sh.sides = Math.floor(rand(3, 7));
      sh.broken = rand(0.2, 0.6);
      sh.lineWidth = rand(0.8, 2.5);
      const type = Math.random();
      if (type < 0.4) sh.color = [rand(140,220)|0, rand(10,50)|0, rand(30,80)|0];
      else if (type < 0.7) sh.color = [rand(100,160)|0, rand(0,30)|0, rand(120,200)|0];
      else sh.color = [rand(80,130)|0, rand(80,130)|0, rand(80,130)|0];
    }

    for (let i = 0; i < SHAPE_COUNT; i++) { const sh = {}; resetShape(sh, true); shapes.push(sh); }

    function drawShape(c, sh) {
      sh.x += sh.driftX; sh.y += sh.driftY; sh.rotation += sh.rotSpeed;
      if (sh.y > H + 80) resetShape(sh, false);
      if (sh.opacity < 0.01) return;
      c.save(); c.translate(sh.x, sh.y); c.rotate(sh.rotation);
      c.beginPath();
      let started = false;
      for (let i = 0; i <= sh.sides; i++) {
        const angle = (i / sh.sides) * Math.PI * 2;
        const px = Math.cos(angle) * sh.size, py = Math.sin(angle) * sh.size;
        if ((Math.sin(i * 137.5 + sh.size) * 0.5 + 0.5) < sh.broken) { started = false; continue; }
        if (!started) { c.moveTo(px, py); started = true; } else { c.lineTo(px, py); }
      }
      c.strokeStyle = 'rgba(' + sh.color[0] + ',' + sh.color[1] + ',' + sh.color[2] + ',' + sh.opacity + ')';
      c.lineWidth = sh.lineWidth; c.stroke();
      const glow = c.createRadialGradient(0, 0, 0, 0, 0, sh.size * 0.8);
      glow.addColorStop(0, 'rgba(' + sh.color[0] + ',' + sh.color[1] + ',' + sh.color[2] + ',' + (sh.opacity * 0.25) + ')');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = glow; c.fillRect(-sh.size, -sh.size, sh.size * 2, sh.size * 2);
      c.restore();
    }

    // ---- Static Noise ----
    const STATIC_COUNT = 150;
    const statics = [];
    function resetStatic(st) {
      st.x = rand(0, W);
      st.y = Math.random() < 0.7 ? rand(playTop, playBot) : rand(0, H);
      st.life = rand(2, 12); st.maxLife = st.life; st.size = rand(1, 3);
      const bright = Math.random() < 0.2 ? rand(150, 255) : rand(30, 100);
      st.r = bright * (0.8 + Math.random() * 0.4);
      st.g = bright * (Math.random() * 0.3);
      st.b = bright * (0.3 + Math.random() * 0.5);
    }
    for (let i = 0; i < STATIC_COUNT; i++) { const st = {}; resetStatic(st); statics.push(st); }

    // ---- Shadow Tendrils ----
    const edgeNames = ['top', 'bottom', 'left', 'right'];
    const tendrils = [];
    function resetTendril(td) {
      switch (td.edge) {
        case 'top': td.x = rand(0, W); td.y = 0; td.dx = rand(-0.3, 0.3); td.dy = rand(0.2, 0.6); break;
        case 'bottom': td.x = rand(0, W); td.y = H; td.dx = rand(-0.3, 0.3); td.dy = rand(-0.6, -0.2); break;
        case 'left': td.x = 0; td.y = rand(0, H); td.dx = rand(0.2, 0.6); td.dy = rand(-0.3, 0.3); break;
        case 'right': td.x = W; td.y = rand(0, H); td.dx = rand(-0.6, -0.2); td.dy = rand(-0.3, 0.3); break;
      }
      td.length = rand(100, 300); td.segments = 8; td.width = rand(10, 30);
      td.opacity = rand(0.08, 0.2); td.phase = rand(0, Math.PI * 2);
      td.speed = rand(0.008, 0.02); td.breathPhase = rand(0, Math.PI * 2);
      td.breathSpeed = rand(0.005, 0.015);
    }
    for (let i = 0; i < 16; i++) { const td = { edge: edgeNames[i % 4] }; resetTendril(td); tendrils.push(td); }

    function drawTendril(c, td) {
      td.phase += td.speed; td.breathPhase += td.breathSpeed;
      const breath = 0.6 + 0.4 * Math.sin(td.breathPhase);
      const a = td.opacity * breath;
      if (a < 0.01) return;
      c.beginPath();
      let px = td.x, py = td.y; c.moveTo(px, py);
      for (let i = 1; i <= td.segments; i++) {
        const t = i / td.segments;
        const wave = Math.sin(td.phase + i * 0.8) * (25 * t);
        px = td.x + td.dx * td.length * t + wave * (td.edge === 'top' || td.edge === 'bottom' ? 1 : 0);
        py = td.y + td.dy * td.length * t + wave * (td.edge === 'left' || td.edge === 'right' ? 1 : 0);
        c.lineTo(px, py);
      }
      const grad = c.createLinearGradient(td.x, td.y, px, py);
      grad.addColorStop(0, 'rgba(25,3,35,' + a + ')');
      grad.addColorStop(0.5, 'rgba(40,8,50,' + (a * 0.5) + ')');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      c.strokeStyle = grad; c.lineWidth = td.width * breath;
      c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    }

    // ---- Color Bleeds ----
    const BLEED_COUNT = 10;
    const bleeds = [];
    function resetBleed(bl) {
      bl.x = rand(0, W);
      bl.y = Math.random() < 0.7 ? rand(playTop, playBot) : rand(0, H);
      bl.r = rand(80, 250);
      bl.type = Math.floor(rand(0, 3)); bl.opacity = rand(0.02, 0.07);
      bl.life = rand(60, 200); bl.maxLife = bl.life;
      bl.driftX = rand(-0.3, 0.3); bl.driftY = rand(-0.2, 0.2);
    }
    for (let i = 0; i < BLEED_COUNT; i++) { const bl = {}; resetBleed(bl); bleeds.push(bl); }

    function drawBleed(c, bl) {
      bl.x += bl.driftX; bl.y += bl.driftY; bl.life--;
      if (bl.life <= 0) resetBleed(bl);
      const progress = bl.life / bl.maxLife;
      const a = bl.opacity * Math.sin(progress * Math.PI);
      if (a < 0.003) return;
      let color;
      if (bl.type === 0) color = '200,0,30'; else if (bl.type === 1) color = '0,30,200'; else color = '0,180,150';
      const g = c.createRadialGradient(bl.x, bl.y, 0, bl.x, bl.y, bl.r);
      g.addColorStop(0, 'rgba(' + color + ',' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g; c.fillRect(bl.x - bl.r, bl.y - bl.r, bl.r * 2, bl.r * 2);
    }

    // ---- Lightning ----
    let lnActive = false, lnSegs = [], lnBranches = [], lnLife = 0, lnMaxLife = 0, lnFlash = 0;
    let lnCooldown = rand(120, 350);

    function triggerLightning() {
      lnActive = true; lnLife = 0; lnMaxLife = rand(10, 22);
      lnFlash = rand(0.12, 0.3); lnSegs = []; lnBranches = [];
      // Re-measure play area every time to guarantee valid bounds
      const header = document.querySelector('.game-header');
      const calc = document.querySelector('.calculator-grid');
      let pT, pB;
      if (header && calc) {
        const hR = header.getBoundingClientRect();
        const cR = calc.getBoundingClientRect();
        pT = hR.bottom;
        pB = cR.top;
      }
      // Fallback if bounds are bad
      if (!pT || !pB || pB <= pT || (pB - pT) < 50) {
        pT = H * 0.1;
        pB = H * 0.6;
      }
      const pH = pB - pT;
      // Start from top of play area, end at bottom
      const sx = rand(W * 0.1, W * 0.9);
      const sy = rand(pT, pT + pH * 0.2);
      const ex = sx + rand(-W * 0.2, W * 0.2);
      const ey = rand(pT + pH * 0.6, pB);
      const n = Math.floor(rand(6, 12));
      const jitterMax = Math.min(50, W * 0.12);
      let px = sx, py = sy;
      for (let i = 0; i <= n; i++) {
        const t = i / n, jitter = (1 - Math.abs(t - 0.5) * 2) * jitterMax;
        px = sx + (ex - sx) * t + rand(-jitter, jitter);
        py = sy + (ey - sy) * t + rand(-3, 3);
        lnSegs.push({ x: px, y: py });
        if (i > 1 && i < n - 1 && Math.random() < 0.4) {
          const br = []; let bx = px, by = py;
          const bDir = Math.random() < 0.5 ? -1 : 1;
          for (let j = 0; j < Math.floor(rand(2, 5)); j++) {
            bx += rand(8, 25) * bDir; by += rand(8, 25);
            if (by > pB) by = pB;
            br.push({ x: bx, y: by });
          }
          lnBranches.push({ startIdx: i, points: br });
        }
      }
    }

    function drawBolt(c, segs, width, alpha) {
      if (segs.length < 2 || alpha < 0.01) return;
      // Wide outer glow — dark red halo with canvas shadow
      c.save();
      c.beginPath(); c.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < segs.length; i++) c.lineTo(segs[i].x, segs[i].y);
      c.strokeStyle = 'rgba(180,30,60,' + (alpha * 0.5) + ')';
      c.lineWidth = width * 12; c.lineCap = 'round'; c.lineJoin = 'round';
      c.shadowColor = 'rgba(255,50,80,0.6)'; c.shadowBlur = 40;
      c.stroke();
      c.restore();
      // Mid glow — bright magenta/red
      c.beginPath(); c.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < segs.length; i++) c.lineTo(segs[i].x, segs[i].y);
      c.strokeStyle = 'rgba(255,80,120,' + (alpha * 0.8) + ')';
      c.lineWidth = width * 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
      // Hot white core — the actual visible bolt
      c.beginPath(); c.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < segs.length; i++) c.lineTo(segs[i].x, segs[i].y);
      c.strokeStyle = 'rgba(255,240,250,' + alpha + ')';
      c.lineWidth = width * 2; c.stroke();
    }

    // ---- Glitch Band Controller ----
    let glitchTimer = 0, glitchOn = false;
    function updateGlitchBands() {
      glitchTimer--;
      if (glitchTimer <= 0 && !glitchOn && Math.random() < 0.02) {
        glitchOn = true; glitchTimer = rand(4, 20);
        gb1.style.top = rand(0, H) + 'px'; gb1.style.height = rand(2, 8) + 'px'; gb1.style.opacity = rand(0.5, 1);
        if (Math.random() < 0.6) { gb2.style.top = rand(0, H) + 'px'; gb2.style.height = rand(2, 6) + 'px'; gb2.style.opacity = rand(0.3, 0.7); }
      }
      if (glitchOn && glitchTimer <= 0) { glitchOn = false; gb1.style.opacity = 0; gb2.style.opacity = 0; glitchTimer = rand(20, 100); }
    }

    // ---- Main render (3-canvas like original demo) ----
    abyssTime = 0;

    function animate() {
      abyssTime += 16;
      const beat = getHeartbeat(abyssTime);

      // === BG CANVAS — background only (redrawn for heartbeat pulse) ===
      const rBase = 18 + beat * 25;
      const gBase = 2 + beat * 4;
      const bBase = 8 + beat * 12;
      bgCtx.fillStyle = 'rgb(' + (rBase|0) + ',' + (gBase|0) + ',' + (bBase|0) + ')';
      bgCtx.fillRect(0, 0, W, H);

      var zones = [[0.3, 0.35, 0.55], [0.7, 0.55, 0.5], [0.5, 0.25, 0.4], [0.2, 0.65, 0.35], [0.5, 0.5, 0.6]];
      for (var zi = 0; zi < zones.length; zi++) {
        var z = zones[zi];
        var za = (0.06 + beat * 0.08) * (0.7 + 0.3 * Math.sin(abyssTime * 0.0004 + zi * 2));
        var zg = bgCtx.createRadialGradient(W * z[0], H * z[1], 0, W * z[0], H * z[1], Math.max(W, H) * z[2]);
        zg.addColorStop(0, 'rgba(100,8,30,' + za + ')');
        zg.addColorStop(0.4, 'rgba(60,4,25,' + (za * 0.5) + ')');
        zg.addColorStop(1, 'rgba(0,0,0,0)');
        bgCtx.fillStyle = zg; bgCtx.fillRect(0, 0, W, H);
      }

      var purp = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.5);
      purp.addColorStop(0, 'rgba(45,8,65,' + (0.12 + beat * 0.06) + ')');
      purp.addColorStop(0.5, 'rgba(25,4,40,0.06)');
      purp.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = purp; bgCtx.fillRect(0, 0, W, H);

      var vig = bgCtx.createRadialGradient(cx, cy, Math.max(W, H) * 0.3, cx, cy, Math.max(W, H) * 0.8);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      vig.addColorStop(0.8, 'rgba(0,0,0,0.25)');
      vig.addColorStop(1, 'rgba(0,0,0,0.45)');
      bgCtx.fillStyle = vig; bgCtx.fillRect(0, 0, W, H);

      // === MID CANVAS — all elements + lightning (cleared each frame) ===
      midCtx.clearRect(0, 0, W, H);

      // Shadow tendrils
      for (var ti = 0; ti < tendrils.length; ti++) drawTendril(midCtx, tendrils[ti]);
      // Color bleeds
      for (var bi = 0; bi < bleeds.length; bi++) drawBleed(midCtx, bleeds[bi]);
      // Broken geometry
      for (var si = 0; si < shapes.length; si++) drawShape(midCtx, shapes[si]);
      // Nightmare eyes
      for (var ei = 0; ei < eyes.length; ei++) {
        updateEye(eyes[ei]); drawEye(midCtx, eyes[ei]);
        if (!eyes[ei].alive) resetEye(eyes[ei]);
      }
      // Static noise
      for (var ni = 0; ni < statics.length; ni++) {
        statics[ni].life--;
        if (statics[ni].life <= 0) resetStatic(statics[ni]);
        var st = statics[ni], sa = (st.life / st.maxLife) * 0.5;
        midCtx.fillStyle = 'rgba(' + (st.r|0) + ',' + (st.g|0) + ',' + (st.b|0) + ',' + sa + ')';
        midCtx.fillRect(st.x, st.y, st.size, st.size);
      }
      // Lightning — drawn on mid canvas, never erased by background
      lnCooldown--;
      if (lnCooldown <= 0 && !lnActive) { triggerLightning(); lnCooldown = rand(80, 250); }
      if (lnActive) {
        lnLife++;
        if (lnLife > lnMaxLife) { lnActive = false; }
        else {
          var fade = 1 - (lnLife / lnMaxLife);
          var flicker = lnLife < 4 ? 1 : fade * (0.6 + Math.random() * 0.4);
          // Screen flash on impact — on mid canvas so it layers over everything
          if (lnLife < 5) { midCtx.fillStyle = 'rgba(200,150,220,' + (lnFlash * flicker * 1.5) + ')'; midCtx.fillRect(0, 0, W, H); }
          drawBolt(midCtx, lnSegs, 3 * flicker, flicker);
          for (var li = 0; li < lnBranches.length; li++) {
            var lbr = lnBranches[li];
            drawBolt(midCtx, [lnSegs[lbr.startIdx]].concat(lbr.points), 1.5 * flicker, flicker * 0.7);
          }
        }
      }

      // === FG CANVAS — overlay (heartbeat flash + vignette) ===
      fgCtx.clearRect(0, 0, W, H);
      if (beat > 0.2) {
        fgCtx.fillStyle = 'rgba(120,0,20,' + (beat * 0.1) + ')';
        fgCtx.fillRect(0, 0, W, H);
      }
      var ev = fgCtx.createRadialGradient(cx, cy, Math.max(W, H) * 0.25, cx, cy, Math.max(W, H) * 0.7);
      ev.addColorStop(0, 'rgba(0,0,0,0)');
      ev.addColorStop(0.5, 'rgba(0,0,0,' + (0.02 + beat * 0.03) + ')');
      ev.addColorStop(0.8, 'rgba(10,0,5,' + (0.08 + beat * 0.05) + ')');
      ev.addColorStop(1, 'rgba(5,0,3,' + (0.25 + beat * 0.08) + ')');
      fgCtx.fillStyle = ev; fgCtx.fillRect(0, 0, W, H);

      // Glitch bands
      updateGlitchBands();

      abyssRAF = requestAnimationFrame(animate);
    }

    abyssRAF = requestAnimationFrame(animate);
  }

  function clearAbyss() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    // Remove resize listener from bg canvas
    const bgCanvas = document.getElementById('abyss-bg');
    if (bgCanvas && bgCanvas._resizeHandler) {
      window.removeEventListener('resize', bgCanvas._resizeHandler);
    }
    // Cancel animation frame
    if (abyssRAF) {
      cancelAnimationFrame(abyssRAF);
      abyssRAF = null;
    }
    abyssTime = 0;
    container.querySelectorAll('.abyss-container').forEach(el => el.remove());
  }

  // --- Psychic Vortex (World 2 — Spinning rings, pulse waves, thought particles) ---

  let psychicThoughtTimer = null;
  let psychicRingShiftInterval = null;
  let psychicBreathRAF = null;

  function createPsychic() {
    const container = document.getElementById('game-embers');
    if (!container) return;

    // Main psychic container
    const pc = document.createElement('div');
    pc.className = 'psychic-container';
    pc.id = 'psychic-fx';

    // --- Mist layers (behind everything) ---
    for (let i = 1; i <= 3; i++) {
      const mist = document.createElement('div');
      mist.className = 'psychic-mist psychic-mist--' + i;
      pc.appendChild(mist);
    }

    // --- Vortex: 9 concentric spinning rings + core glow ---
    const vortex = document.createElement('div');
    vortex.className = 'psychic-vortex';
    vortex.id = 'psychic-vortex';

    for (let n = 1; n <= 9; n++) {
      const ring = document.createElement('div');
      ring.className = 'vortex-ring vortex-ring--' + n;
      vortex.appendChild(ring);
    }

    const core = document.createElement('div');
    core.className = 'psychic-core';
    vortex.appendChild(core);

    pc.appendChild(vortex);

    // --- Pulse rings (expanding waves from center) ---
    const pulseContainer = document.createElement('div');
    pulseContainer.className = 'psychic-pulse-container';

    const pulseDur = 14;
    for (let i = 0; i < 4; i++) {
      const pulse = document.createElement('div');
      pulse.className = 'psychic-pulse';
      pulse.style.setProperty('--pulse-dur', pulseDur + 's');
      pulse.style.setProperty('--pulse-delay', (i * (pulseDur / 4)) + 's');
      pulseContainer.appendChild(pulse);
    }
    pc.appendChild(pulseContainer);

    // --- Thought particle spawner ---
    const thoughtLayer = document.createElement('div');
    thoughtLayer.className = 'psychic-thought-layer';
    thoughtLayer.id = 'psychic-thoughts';
    thoughtLayer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    pc.appendChild(thoughtLayer);

    container.appendChild(pc);

    // Thought particle colors
    const thoughtColors = [
      { r: 155, g: 93, b: 229 },   // purple
      { r: 130, g: 80, b: 210 },   // deep purple
      { r: 180, g: 140, b: 240 },  // lavender
      { r: 100, g: 160, b: 230 },  // cyan accent
      { r: 200, g: 170, b: 255 },  // pale purple
    ];

    function spawnThought() {
      const tl = document.getElementById('psychic-thoughts');
      if (!tl) return;

      const t = document.createElement('div');
      t.className = 'psychic-thought';

      const size = randomBetween(2, 6);
      const opacity = randomBetween(0.2, 0.5);
      const c = thoughtColors[Math.floor(Math.random() * thoughtColors.length)];
      const bg = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
      const glow = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity * 0.4})`;

      // Start from edges, drift inward with wandering path
      const angle = randomBetween(0, Math.PI * 2);
      const startDist = randomBetween(40, 55);
      const sx = Math.cos(angle) * startDist;
      const sy = Math.sin(angle) * startDist;

      // End closer to center
      const endDist = randomBetween(5, 15);
      const endAngle = angle + randomBetween(-0.8, 0.8);
      const ex = Math.cos(endAngle) * endDist;
      const ey = Math.sin(endAngle) * endDist;

      // Midpoints — wandering path
      const m1d = randomBetween(25, 40);
      const m1a = angle + randomBetween(-0.4, 0.4);
      const m2d = randomBetween(15, 28);
      const m2a = angle + randomBetween(-0.6, 0.6);
      const m3d = randomBetween(8, 20);
      const m3a = endAngle + randomBetween(-0.3, 0.3);

      const duration = randomBetween(12, 25);

      t.style.cssText = `
        width:${size}px;height:${size}px;left:50%;top:50%;
        background:radial-gradient(circle, ${bg} 0%, transparent 70%);
        box-shadow:0 0 ${size * 2}px ${size * 0.5}px ${glow};
        --t-sx:${sx}vmin;--t-sy:${sy}vmin;
        --t-ex:${ex}vmin;--t-ey:${ey}vmin;
        --t-mx1:${Math.cos(m1a) * m1d}vmin;--t-my1:${Math.sin(m1a) * m1d}vmin;
        --t-mx2:${Math.cos(m2a) * m2d}vmin;--t-my2:${Math.sin(m2a) * m2d}vmin;
        --t-mx3:${Math.cos(m3a) * m3d}vmin;--t-my3:${Math.sin(m3a) * m3d}vmin;
        --t-peak:${opacity};--t-mid:${opacity * 0.6};--t-ms:${randomBetween(0.7, 1.1)};
        animation:psychicThoughtFloat ${duration}s ease-in-out forwards;
      `;

      tl.appendChild(t);
      setTimeout(() => t.remove(), duration * 1000 + 200);
    }

    // Steady stream of thought particles
    function scheduleThought() {
      spawnThought();
      psychicThoughtTimer = setTimeout(scheduleThought, randomBetween(600, 1800));
    }
    scheduleThought();

    // --- Vortex breathing (subtle scale + opacity oscillation via rAF) ---
    let breathPhase = 0;
    function breathe() {
      const v = document.getElementById('psychic-vortex');
      if (!v) return;
      breathPhase += 0.008;
      const scale = 1 + Math.sin(breathPhase) * 0.015 + Math.sin(breathPhase * 0.7) * 0.008;
      const op = 0.85 + Math.sin(breathPhase * 0.5) * 0.15;
      v.style.transform = `translate(-50%, -50%) scale(${scale})`;
      v.style.opacity = op;
      psychicBreathRAF = requestAnimationFrame(breathe);
    }
    psychicBreathRAF = requestAnimationFrame(breathe);

    // --- Ring intensity shifts (random brightness pulses on individual rings) ---
    if (psychicRingShiftInterval) clearInterval(psychicRingShiftInterval);
    psychicRingShiftInterval = setInterval(() => {
      const v = document.getElementById('psychic-vortex');
      if (!v || Math.random() > 0.35) return;
      const rings = v.querySelectorAll('.vortex-ring');
      if (rings.length === 0) return;
      const ring = rings[Math.floor(Math.random() * rings.length)];
      const brightness = randomBetween(1.3, 2);
      ring.style.transition = 'filter ' + randomBetween(3, 6) + 's ease-in-out';
      ring.style.filter = 'brightness(' + brightness + ')';
      setTimeout(() => {
        ring.style.transition = 'filter ' + randomBetween(4, 7) + 's ease-in-out';
        ring.style.filter = '';
      }, randomBetween(3000, 6000));
    }, 4000);
  }

  function clearPsychic() {
    const container = document.getElementById('game-embers');
    if (!container) return;
    container.querySelectorAll('.psychic-container').forEach(el => el.remove());
    if (psychicThoughtTimer) {
      clearTimeout(psychicThoughtTimer);
      psychicThoughtTimer = null;
    }
    if (psychicRingShiftInterval) {
      clearInterval(psychicRingShiftInterval);
      psychicRingShiftInterval = null;
    }
    if (psychicBreathRAF) {
      cancelAnimationFrame(psychicBreathRAF);
      psychicBreathRAF = null;
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

    // Filter out rememberMe — it's a special Abyss-only power, not a selectable guardian
    Object.keys(allDefs).filter(k => k !== 'rememberMe').forEach(key => {
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
    clearEmbers();
    clearAurora();
    clearPsychic();
    clearCosmos();
    clearOcean();
    clearJungle();
    clearAbyss();
    clearEndlessDream();
    createEndlessDream();

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
      triggerDreamPulse();

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
    SleepBar.destroy();
    clearEmbers();
    clearAurora();
    clearPsychic();
    clearCosmos();
    clearOcean();
    clearJungle();
    clearAbyss();
    clearEndlessDream();
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

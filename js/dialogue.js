// dialogue.js — Story and dialogue system

const Dialogue = (() => {
  let dialogueData = null;
  let currentSequence = [];
  let currentIndex = 0;
  let isTyping = false;
  let typewriterTimer = null;
  let onComplete = null;
  let fullText = '';

  function loadDialogues() {
    // Load from inline script data
    dialogueData = DIALOGUES_DATA;
  }

  // Replace {playerName} in text with actual player name
  function replaceVariables(text) {
    const saveData = Storage.load();
    const name = saveData.playerName || 'Dreamer';
    return text.replace(/\{playerName\}/g, name);
  }

  function show(sequenceKey, callback) {
    onComplete = callback;
    let i18nPath = '';

    if (sequenceKey === 'intro') {
      currentSequence = dialogueData.intro || [];
      i18nPath = 'intro';
    } else if (sequenceKey === 'finale') {
      currentSequence = dialogueData.finale || [];
      i18nPath = 'finale';
    } else if (sequenceKey === 'gathering') {
      currentSequence = dialogueData.gathering || [];
      i18nPath = 'gathering';
    } else if (sequenceKey === 'abyssMidpoint') {
      currentSequence = dialogueData.abyssMidpoint || [];
      i18nPath = 'abyssMidpoint';
    } else if (sequenceKey.startsWith('abyssStage_')) {
      var abParts = sequenceKey.split('_');
      var abStageNum = abParts[1];
      var abTiming = abParts[2]; // 'pre' or 'post'
      if (dialogueData.abyssStages && dialogueData.abyssStages[abStageNum]) {
        currentSequence = dialogueData.abyssStages[abStageNum][abTiming] || [];
      } else {
        currentSequence = [];
      }
      i18nPath = 'abyssStages.' + abStageNum + '.' + abTiming;
    } else if (sequenceKey === 'finalBattleVictory') {
      currentSequence = dialogueData.finalBattleVictory || [];
      i18nPath = 'finalBattleVictory';
    } else if (sequenceKey.startsWith('worldIntro_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.worldIntros[wId] || [];
      i18nPath = 'worldIntros.' + wId;
    } else if (sequenceKey.startsWith('stage10Intro_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.stage10Intros[wId] || [];
      i18nPath = 'stage10Intros.' + wId;
    } else if (sequenceKey.startsWith('awakening_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.awakenings[wId] || [];
      i18nPath = 'awakenings.' + wId;
    } else {
      currentSequence = [];
    }

    // Overlay translated text/button from i18n (keeps speaker, emoji, type from original)
    if (i18nPath) {
      const translated = I18n.getSection('dialogues.' + i18nPath);
      if (translated && Array.isArray(translated)) {
        currentSequence = currentSequence.map((line, idx) => {
          const tLine = translated[idx];
          if (!tLine) return line;
          return Object.assign({}, line, {
            text: tLine.text || line.text,
            button: tLine.button || line.button
          });
        });
      }
    }

    if (currentSequence.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    currentIndex = 0;
    showDialogueOverlay();
    showLine(currentIndex);
  }

  function showDialogueOverlay() {
    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.remove('hidden');

    // Determine if this sequence has a nameInput line (intro) — don't show skip for those
    var hasNameInput = currentSequence.some(function(line) { return line.type === 'nameInput'; });

    overlay.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">
          <span class="dialogue-emoji"></span>
          <span class="dialogue-name"></span>
        </div>
        <div class="dialogue-text"></div>
        <div class="dialogue-input-area hidden">
          <input type="text" class="dialogue-name-input" placeholder="${I18n.t('ui.yourName')}" maxlength="20" autocomplete="off" />
        </div>
        <button class="dialogue-continue-btn">${I18n.t('ui.continue_')}</button>
      </div>
      ${hasNameInput ? '' : '<button class="dialogue-skip-btn">' + I18n.t('ui.skip') + '</button>'}
    `;

    const btn = overlay.querySelector('.dialogue-continue-btn');
    btn.addEventListener('click', () => {
      Audio.resume();
      Audio.buttonPress();
      handleContinueClick();
    });

    // Skip button — jumps to the end of the dialogue
    const skipBtn = overlay.querySelector('.dialogue-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        Audio.resume();
        Audio.buttonPress();
        clearTimeout(typewriterTimer);
        isTyping = false;
        hide();
        if (onComplete) onComplete();
      });
    }

    // Allow pressing Enter on the name input to submit
    const nameInput = overlay.querySelector('.dialogue-name-input');
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        Audio.resume();
        Audio.buttonPress();
        handleContinueClick();
      }
    });
  }

  function handleContinueClick() {
    const overlay = document.getElementById('dialogue-overlay');
    const line = currentSequence[currentIndex];

    // Check if current line is a name input type
    if (line && line.type === 'nameInput') {
      const input = overlay.querySelector('.dialogue-name-input');
      const name = input.value.trim();
      if (!name) {
        // Shake the input if empty
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
        input.focus();
        return;
      }
      // Save the player name
      const saveData = Storage.load();
      saveData.playerName = name;
      Storage.save(saveData);
      advance();
      return;
    }

    if (isTyping) {
      // Skip typewriter, show full text
      clearTimeout(typewriterTimer);
      isTyping = false;
      overlay.querySelector('.dialogue-text').textContent = fullText;
    } else {
      advance();
    }
  }

  function showLine(index) {
    const line = currentSequence[index];
    if (!line) return;

    const overlay = document.getElementById('dialogue-overlay');
    const nameEl = overlay.querySelector('.dialogue-name');
    const emojiEl = overlay.querySelector('.dialogue-emoji');
    const textEl = overlay.querySelector('.dialogue-text');
    const btn = overlay.querySelector('.dialogue-continue-btn');
    const inputArea = overlay.querySelector('.dialogue-input-area');
    const nameInput = overlay.querySelector('.dialogue-name-input');

    // Apply variable replacement to text
    const processedText = replaceVariables(line.text);

    // Set speaker icon (all guardians use their SVG seal)
    const SPEAKER_ICONS = {
      '👁️': 'assets/yumemori.svg',
      '❄️': 'assets/guardians/ice.svg',
      '🔮': 'assets/guardians/psy.svg',
      '🌿': 'assets/guardians/nature.svg',
      '👾': 'assets/guardians/cosmos.svg',
      '🔥': 'assets/guardians/fire.svg',
      '🌊': 'assets/guardians/ocean.svg',
      '🌑': 'assets/guardians/abyss.svg',
      '✨': 'assets/guardians/abyss.svg',
    };
    function setSpeakerIcon(el, emoji) {
      if (!emoji) { el.innerHTML = ''; return; }
      const svgPath = SPEAKER_ICONS[emoji];
      if (svgPath) {
        el.innerHTML = `<img src="${svgPath}" class="dialogue-speaker-icon" alt="">`;
      } else {
        el.textContent = emoji;
      }
    }

    // Hide input area by default
    inputArea.classList.add('hidden');

    if (line.type === 'nameInput') {
      // Name input mode
      nameEl.textContent = line.speaker;
      setSpeakerIcon(emojiEl, line.emoji);
      textEl.className = 'dialogue-text';
      typewriterEffect(textEl, processedText, () => {
        // Show input area after typewriter finishes
        inputArea.classList.remove('hidden');
        nameInput.value = '';
        nameInput.focus();
      });
      btn.textContent = line.button || I18n.t('ui.continue_');
    } else if (line.speaker === 'system') {
      nameEl.textContent = '';
      setSpeakerIcon(emojiEl, '');
      textEl.className = 'dialogue-text power-unlock';
      typewriterEffect(textEl, processedText);
      btn.textContent = line.button || I18n.t('ui.continue_');
    } else {
      nameEl.textContent = line.speaker;
      setSpeakerIcon(emojiEl, line.emoji);
      textEl.className = 'dialogue-text';
      typewriterEffect(textEl, processedText);
      btn.textContent = line.button || I18n.t('ui.continue_');
    }
  }

  function typewriterEffect(element, text, onFinish) {
    fullText = text;
    element.textContent = '';
    isTyping = true;
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        typewriterTimer = setTimeout(type, 25);
      } else {
        isTyping = false;
        if (onFinish) onFinish();
      }
    }
    type();
  }

  function advance() {
    currentIndex++;
    if (currentIndex >= currentSequence.length) {
      hide();
      if (onComplete) onComplete();
    } else {
      showLine(currentIndex);
    }
  }

  function hide() {
    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    currentSequence = [];
    currentIndex = 0;
  }

  function isLoaded() {
    return dialogueData !== null;
  }

  return { loadDialogues, show, hide, isLoaded };
})();

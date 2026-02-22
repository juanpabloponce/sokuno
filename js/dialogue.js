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

    if (sequenceKey === 'intro') {
      currentSequence = dialogueData.intro || [];
    } else if (sequenceKey === 'finale') {
      currentSequence = dialogueData.finale || [];
    } else if (sequenceKey === 'gathering') {
      currentSequence = dialogueData.gathering || [];
    } else if (sequenceKey === 'abyssMidpoint') {
      currentSequence = dialogueData.abyssMidpoint || [];
    } else if (sequenceKey === 'finalBattleVictory') {
      currentSequence = dialogueData.finalBattleVictory || [];
    } else if (sequenceKey.startsWith('worldIntro_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.worldIntros[wId] || [];
    } else if (sequenceKey.startsWith('stage10Intro_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.stage10Intros[wId] || [];
    } else if (sequenceKey.startsWith('awakening_')) {
      const wId = sequenceKey.split('_')[1];
      currentSequence = dialogueData.awakenings[wId] || [];
    } else {
      currentSequence = [];
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
    overlay.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">
          <span class="dialogue-emoji"></span>
          <span class="dialogue-name"></span>
        </div>
        <div class="dialogue-text"></div>
        <div class="dialogue-input-area hidden">
          <input type="text" class="dialogue-name-input" placeholder="Your name..." maxlength="20" autocomplete="off" />
        </div>
        <button class="dialogue-continue-btn">Continue</button>
      </div>
    `;

    const btn = overlay.querySelector('.dialogue-continue-btn');
    btn.addEventListener('click', () => {
      Audio.resume();
      Audio.buttonPress();
      handleContinueClick();
    });

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
      btn.textContent = line.button || 'Continue';
    } else if (line.speaker === 'system') {
      nameEl.textContent = '';
      setSpeakerIcon(emojiEl, '');
      textEl.className = 'dialogue-text power-unlock';
      typewriterEffect(textEl, processedText);
      btn.textContent = 'Continue';
    } else {
      nameEl.textContent = line.speaker;
      setSpeakerIcon(emojiEl, line.emoji);
      textEl.className = 'dialogue-text';
      typewriterEffect(textEl, processedText);
      btn.textContent = line.button || 'Continue';
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

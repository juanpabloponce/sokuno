// lore.js — Lore/Story chapter system

const Lore = (() => {

  const CHAPTERS = [
    { id: 1,  name: 'Before Light',              color: '#FFD700', dialogueKey: 'intro',               unlockCheck: (save) => save.storyProgress.introSeen },
    { id: 2,  name: 'The First to Fall',         color: '#5BC0EB', dialogueKey: 'awakenings.1',        unlockCheck: (save) => isWorldBossComplete(save, 1) },
    { id: 3,  name: 'The Weight of Knowing',     color: '#9B5DE5', dialogueKey: 'awakenings.2',        unlockCheck: (save) => isWorldBossComplete(save, 2) },
    { id: 4,  name: 'Seeds in Dark Soil',        color: '#57CC99', dialogueKey: 'awakenings.3',        unlockCheck: (save) => isWorldBossComplete(save, 3) },
    { id: 5,  name: 'The Space Between Stars',   color: '#E94560', dialogueKey: 'awakenings.4',        unlockCheck: (save) => isWorldBossComplete(save, 4) },
    { id: 6,  name: 'What Burns Inside',         color: '#FF6B35', dialogueKey: 'awakenings.5',        unlockCheck: (save) => isWorldBossComplete(save, 5) },
    { id: 7,  name: 'Sunlight on Water',         color: '#00B4D8', dialogueKey: 'awakenings.6',        unlockCheck: (save) => isWorldBossComplete(save, 6) },
    { id: 8,  name: 'Six Lights, One Dark',      color: '#FFD700', dialogueKey: 'gathering',           unlockCheck: (save) => save.storyProgress.gatheringSeen || (save.worlds['7'] && save.worlds['7'].unlocked) },
    { id: 9,  name: 'If I Cannot Shine',         color: '#333333', dialogueKey: 'abyssMidpoint',       unlockCheck: (save) => save.storyProgress.world7MidpointSeen || isWorldStageComplete(save, 7, 5), border: '#FFD700' },
    { id: 10, name: 'A Small Golden Spark',      color: '#FFD700', dialogueKey: 'finale',              unlockCheck: (save) => save.storyProgress.endingSeen || isWorldBossComplete(save, 7), glow: true }
  ];

  const SPEAKER_COLORS = {
    'Yumemori': '#c8b4ff',
    'Fubuki':   '#5BC0EB',
    'Omoi':     '#9B5DE5',
    'Midori':   '#57CC99',
    'Uch\u016B': '#E94560',
    'Kaen':     '#FF6B35',
    'Nami':     '#00B4D8',
    'Kurayami': '#888',
    'system':   '#FFD700'
  };

  function isWorldBossComplete(save, worldId) {
    const w = save.worlds[String(worldId)];
    return w && w.stages && w.stages['10'] && w.stages['10'].completed;
  }

  function isWorldStageComplete(save, worldId, stageNum) {
    const w = save.worlds[String(worldId)];
    return w && w.stages && w.stages[String(stageNum)] && w.stages[String(stageNum)].completed;
  }

  function getDialogueLines(key) {
    const parts = key.split('.');
    let data = DIALOGUES_DATA;
    for (const p of parts) {
      if (!data) return [];
      data = data[p];
    }
    return Array.isArray(data) ? data : [];
  }

  // Check and update lore unlock states based on current save
  function syncUnlocks(saveData) {
    if (!saveData.lore) saveData.lore = {};
    let newlyUnlocked = [];

    CHAPTERS.forEach(ch => {
      if (!saveData.lore[ch.id]) {
        saveData.lore[ch.id] = { unlocked: false, seen: false };
      }
      if (!saveData.lore[ch.id].unlocked && ch.unlockCheck(saveData)) {
        saveData.lore[ch.id].unlocked = true;
        newlyUnlocked.push(ch);
      }
    });

    return newlyUnlocked;
  }

  function hasUnread(saveData) {
    if (!saveData.lore) return false;
    for (const ch of CHAPTERS) {
      const entry = saveData.lore[ch.id];
      if (entry && entry.unlocked && !entry.seen) return true;
    }
    return false;
  }

  function markSeen(saveData, chapterId) {
    if (!saveData.lore) saveData.lore = {};
    if (!saveData.lore[chapterId]) saveData.lore[chapterId] = { unlocked: true, seen: false };
    saveData.lore[chapterId].seen = true;
  }

  // Render lore screen
  function renderLoreScreen(saveData) {
    const list = document.getElementById('lore-chapter-list');
    if (!list) return;
    list.innerHTML = '';

    CHAPTERS.forEach(ch => {
      const entry = saveData.lore ? saveData.lore[ch.id] : null;
      const unlocked = entry && entry.unlocked;
      const seen = entry && entry.seen;

      const div = document.createElement('div');
      div.className = `lore-chapter ${unlocked ? 'unlocked' : 'locked'} ${!seen && unlocked ? 'unread' : ''}`;

      if (ch.border) {
        div.style.borderColor = ch.border;
      }

      const dotStyle = unlocked
        ? `background: ${ch.color}; box-shadow: 0 0 8px ${ch.color}${ch.glow ? ', 0 0 16px ' + ch.color : ''};`
        : 'background: rgba(255,255,255,0.1);';

      const chapterName = I18n.t('lore.' + ch.id) || ch.name;
      div.innerHTML = `
        <span class="lore-dot" style="${dotStyle}"></span>
        <span class="lore-chapter-name">${chapterName}</span>
        ${!unlocked ? '<img src="assets/lock.svg" class="lore-lock" alt="Locked">' : ''}
        ${!seen && unlocked ? '<span class="lore-unread-badge"></span>' : ''}
      `;

      if (unlocked) {
        div.addEventListener('click', () => {
          Audio.buttonPress();
          markSeen(saveData, ch.id);
          Storage.save(saveData);
          updateLoreUnreadBadge(saveData);
          showChapterReader(ch, saveData);
        });
      }

      list.appendChild(div);
    });
  }

  function showChapterReader(chapter, saveData) {
    const screen = document.getElementById('screen-lore');
    const reader = document.getElementById('lore-reader');
    const listEl = document.getElementById('lore-list-container');

    listEl.classList.add('hidden');
    reader.classList.remove('hidden');

    let lines = getDialogueLines(chapter.dialogueKey);
    // Overlay translated text from i18n
    const translated = I18n.getSection('dialogues.' + chapter.dialogueKey);
    if (translated && Array.isArray(translated)) {
      lines = lines.map((line, idx) => {
        const tLine = translated[idx];
        if (!tLine) return line;
        return Object.assign({}, line, { text: tLine.text || line.text });
      });
    }
    const titleEl = document.getElementById('lore-reader-title');
    const bodyEl = document.getElementById('lore-reader-body');

    titleEl.textContent = I18n.t('lore.' + chapter.id) || chapter.name;
    titleEl.style.color = chapter.color;

    bodyEl.innerHTML = '';

    if (lines.length === 0) {
      bodyEl.innerHTML = '<div class="lore-line"><span class="lore-line-text" style="opacity:0.5;">' + I18n.t('lore.chapterStoryNotWritten') + '</span></div>';
    } else {
      lines.forEach(line => {
        if (line.speaker === 'system') return; // skip system messages in lore view
        const div = document.createElement('div');
        div.className = 'lore-line';
        const speakerColor = SPEAKER_COLORS[line.speaker] || '#fff';

        // Replace {playerName} in text
        let text = line.text || '';
        text = text.replace(/\{playerName\}/g, saveData.playerName || 'Dreamer');

        div.innerHTML = `
          <span class="lore-line-speaker" style="color: ${speakerColor};">${line.speaker}</span>
          <span class="lore-line-text">${text}</span>
        `;
        bodyEl.appendChild(div);
      });
    }

    // Back button in reader
    document.getElementById('btn-lore-reader-back').onclick = () => {
      Audio.buttonPress();
      reader.classList.add('hidden');
      listEl.classList.remove('hidden');
      renderLoreScreen(saveData); // refresh unread states
    };

    // Chapter navigation buttons
    const prevBtn = document.getElementById('btn-lore-prev');
    const nextBtn = document.getElementById('btn-lore-next');
    const currentIdx = CHAPTERS.findIndex(c => c.id === chapter.id);

    // Find previous unlocked chapter
    let prevChapter = null;
    for (let i = currentIdx - 1; i >= 0; i--) {
      const entry = saveData.lore ? saveData.lore[CHAPTERS[i].id] : null;
      if (entry && entry.unlocked) {
        prevChapter = CHAPTERS[i];
        break;
      }
    }

    if (prevChapter) {
      prevBtn.classList.remove('hidden');
      prevBtn.onclick = () => {
        Audio.buttonPress();
        bodyEl.scrollTop = 0;
        showChapterReader(prevChapter, saveData);
      };
    } else {
      prevBtn.classList.add('hidden');
    }

    // Find next unlocked chapter
    let nextChapter = null;
    for (let i = currentIdx + 1; i < CHAPTERS.length; i++) {
      const entry = saveData.lore ? saveData.lore[CHAPTERS[i].id] : null;
      if (entry && entry.unlocked) {
        nextChapter = CHAPTERS[i];
        break;
      }
    }

    if (nextChapter) {
      nextBtn.classList.remove('hidden');
      nextBtn.onclick = () => {
        Audio.buttonPress();
        markSeen(saveData, nextChapter.id);
        Storage.save(saveData);
        updateLoreUnreadBadge(saveData);
        bodyEl.scrollTop = 0;
        showChapterReader(nextChapter, saveData);
      };
    } else {
      nextBtn.classList.add('hidden');
    }
  }

  function updateLoreUnreadBadge(saveData) {
    const badge = document.getElementById('lore-unread-dot');
    if (badge) {
      badge.style.display = hasUnread(saveData) ? 'block' : 'none';
    }
  }

  // Show "New Chapter Unlocked" notification
  function showChapterNotification(chapter, onContinue) {
    const overlay = document.getElementById('lore-notification');
    if (!overlay) { if (onContinue) onContinue(); return; }

    document.getElementById('lore-notif-name').textContent = I18n.t('lore.' + chapter.id) || chapter.name;
    overlay.classList.remove('hidden');
    overlay.classList.add('lore-notif-enter');

    document.getElementById('btn-lore-notif-continue').onclick = () => {
      Audio.buttonPress();
      overlay.classList.add('hidden');
      overlay.classList.remove('lore-notif-enter');
      if (onContinue) onContinue();
    };
  }

  return {
    CHAPTERS,
    syncUnlocks,
    hasUnread,
    markSeen,
    renderLoreScreen,
    updateLoreUnreadBadge,
    showChapterNotification
  };
})();

// storage.js — Save/Load system using LocalStorage

const Storage = (() => {
  const SAVE_KEY = 'sokuno_save';

  function getDefaultSave() {
    return {
      playerName: '',
      currentWorld: 1,
      currentStage: 1,
      worlds: {
        1: { unlocked: true, stages: {} },
        2: { unlocked: false, stages: {} },
        3: { unlocked: false, stages: {} },
        4: { unlocked: false, stages: {} },
        5: { unlocked: false, stages: {} },
        6: { unlocked: false, stages: {} },
        7: { unlocked: false, stages: {} }
      },
      powers: {
        freeze: { unlocked: false, uses: 3 },
        insight: { unlocked: false, uses: 2 },
        restore: { unlocked: false, uses: 2 },
        cosmicSolve: { unlocked: false, uses: 1 },
        blazeSkip: { unlocked: false, uses: 3 },
        simplify: { unlocked: false, uses: 2 },
        rememberMe: { unlocked: false, uses: 1 }
      },
      stats: {
        totalProblems: 0,
        totalCorrect: 0,
        totalPlayTime: 0
      },
      storyProgress: {
        introSeen: false,
        introV3Seen: false,
        introV4Seen: false,
        world1IntroSeen: false,
        world2IntroSeen: false,
        world3IntroSeen: false,
        world4IntroSeen: false,
        world5IntroSeen: false,
        world6IntroSeen: false,
        world7IntroSeen: false,
        world7MidpointSeen: false,
        gatheringSeen: false,
        endingSeen: false,
        freestyleUnlockSeen: false
      },
      lore: {
        1:  { unlocked: false, seen: false },
        2:  { unlocked: false, seen: false },
        3:  { unlocked: false, seen: false },
        4:  { unlocked: false, seen: false },
        5:  { unlocked: false, seen: false },
        6:  { unlocked: false, seen: false },
        7:  { unlocked: false, seen: false },
        8:  { unlocked: false, seen: false },
        9:  { unlocked: false, seen: false },
        10: { unlocked: false, seen: false }
      },
      freestyle: {
        unlocked: false,
        pure: { bestChain: 0, bestTotal: 0, highestTier: 0, totalSessions: 0 },
        guardian: { bestChain: 0, bestTotal: 0, highestTier: 0, totalSessions: 0 }
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return getDefaultSave();
      const data = JSON.parse(raw);
      // Merge with defaults to handle missing keys from updates
      const defaults = getDefaultSave();
      return deepMerge(defaults, data);
    } catch (e) {
      console.warn('Failed to load save data, using defaults:', e);
      return getDefaultSave();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  }

  function reset() {
    localStorage.removeItem(SAVE_KEY);
    return getDefaultSave();
  }

  function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  return { load, save, reset, getDefaultSave };
})();

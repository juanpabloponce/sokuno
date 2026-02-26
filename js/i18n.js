// i18n.js — Internationalization engine for Sokuno

const I18n = (() => {
  const STORAGE_KEY = 'sokuno_lang';
  const DEFAULT_LANG = 'en';

  const SUPPORTED = [
    { code: 'en',    name: 'English',    nativeName: 'English',    dir: 'ltr', flag: '🇬🇧' },
    { code: 'es',    name: 'Spanish',    nativeName: 'Español',    dir: 'ltr', flag: '🇪🇸' },
    { code: 'fr',    name: 'French',     nativeName: 'Français',   dir: 'ltr', flag: '🇫🇷' },
    { code: 'de',    name: 'German',     nativeName: 'Deutsch',    dir: 'ltr', flag: '🇩🇪' },
    { code: 'it',    name: 'Italian',    nativeName: 'Italiano',   dir: 'ltr', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português',  dir: 'ltr', flag: '🇧🇷' },
    { code: 'ru',    name: 'Russian',    nativeName: 'Русский',    dir: 'ltr', flag: '🇷🇺' },
    { code: 'tr',    name: 'Turkish',    nativeName: 'Türkçe',     dir: 'ltr', flag: '🇹🇷' },
    { code: 'ar',    name: 'Arabic',     nativeName: 'العربية',    dir: 'rtl', flag: '🇸🇦' },
    { code: 'ja',    name: 'Japanese',   nativeName: '日本語',      dir: 'ltr', flag: '🇯🇵' },
    { code: 'zh-CN', name: 'Chinese',    nativeName: '简体中文',    dir: 'ltr', flag: '🇨🇳' },
    { code: 'ko',    name: 'Korean',     nativeName: '한국어',      dir: 'ltr', flag: '🇰🇷' },
  ];

  // Map code -> global variable name
  const LANG_VARS = {
    'en': 'LANG_EN', 'es': 'LANG_ES', 'fr': 'LANG_FR', 'de': 'LANG_DE',
    'it': 'LANG_IT', 'pt-BR': 'LANG_PT_BR', 'ru': 'LANG_RU', 'tr': 'LANG_TR',
    'ar': 'LANG_AR', 'ja': 'LANG_JA', 'zh-CN': 'LANG_ZH_CN', 'ko': 'LANG_KO',
  };

  let currentLang = DEFAULT_LANG;
  let strings = null;   // current language object
  let fallback = null;  // English fallback (always loaded)
  let rtlStylesheet = null;

  // Resolve a dot-path key on an object: 'ui.tap' -> obj.ui.tap
  function resolve(obj, key) {
    if (!obj || !key) return undefined;
    const parts = key.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }

  // Get translated string by key, with placeholder replacement
  function t(key, ...args) {
    let val = resolve(strings, key);
    if (val === undefined || val === null) val = resolve(fallback, key);
    if (val === undefined || val === null) return key;
    if (typeof val !== 'string') return val;
    args.forEach((arg, i) => {
      val = val.replace(new RegExp('\\{' + i + '\\}', 'g'), arg);
    });
    return val;
  }

  // Get an entire section/subtree
  function getSection(key) {
    let val = resolve(strings, key);
    if (val === undefined || val === null) val = resolve(fallback, key);
    return val || null;
  }

  // Apply translations to all elements with data-i18n attribute
  function applyToDOM() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    });
    // Handle data-i18n-placeholder for inputs
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translated = t(key);
      if (translated && translated !== key) {
        el.placeholder = translated;
      }
    });
    // Handle data-i18n-title for title attributes
    const titled = document.querySelectorAll('[data-i18n-title]');
    titled.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translated = t(key);
      if (translated && translated !== key) {
        el.title = translated;
      }
    });

    // Format calculator number buttons for Arabic numerals
    const calcBtns = document.querySelectorAll('.calc-btn.number');
    calcBtns.forEach(btn => {
      const val = btn.dataset.value;
      if (val !== undefined) btn.textContent = formatNum(val);
    });
  }

  // Safely get a global variable by name (works with both var and const)
  function getGlobal(name) {
    try { return (0, eval)(name); } catch (e) { return undefined; }
  }

  // Load a language file dynamically
  function loadLang(code, callback) {
    // If it's English, it's already loaded synchronously
    if (code === 'en') {
      var enObj = getGlobal('LANG_EN');
      callback(enObj || null);
      return;
    }

    const varName = LANG_VARS[code];
    if (!varName) { callback(null); return; }

    // Check if already loaded
    var existing = getGlobal(varName);
    if (existing) {
      callback(existing);
      return;
    }

    // Load dynamically
    const script = document.createElement('script');
    script.src = 'lang/' + code + '.js?v=3';
    script.onload = () => {
      callback(getGlobal(varName) || null);
    };
    script.onerror = () => {
      console.warn('Failed to load language:', code);
      callback(null);
    };
    document.head.appendChild(script);
  }

  // Set RTL/LTR
  function applyDirection(dir) {
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;

    if (dir === 'rtl') {
      if (!rtlStylesheet) {
        rtlStylesheet = document.createElement('link');
        rtlStylesheet.rel = 'stylesheet';
        rtlStylesheet.href = 'css/rtl.css?v=1';
        document.head.appendChild(rtlStylesheet);
      }
    } else {
      if (rtlStylesheet) {
        rtlStylesheet.remove();
        rtlStylesheet = null;
      }
    }
  }

  // Set language, persist, apply
  function setLang(code, callback) {
    const langInfo = SUPPORTED.find(l => l.code === code);
    if (!langInfo) { if (callback) callback(); return; }

    currentLang = code;
    localStorage.setItem(STORAGE_KEY, code);

    if (code === 'en') {
      strings = fallback;
      applyDirection('ltr');
      applyToDOM();
      if (callback) callback();
      return;
    }

    loadLang(code, (langObj) => {
      if (langObj) {
        strings = langObj;
      } else {
        strings = fallback; // fallback to English
      }
      applyDirection(langInfo.dir);
      applyToDOM();
      if (callback) callback();
    });
  }

  // Initialize: set English as fallback
  function init(callback) {
    if (typeof LANG_EN !== 'undefined') {
      fallback = LANG_EN;
      strings = LANG_EN;
    }

    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && savedLang !== 'en') {
      setLang(savedLang, callback);
    } else if (savedLang === 'en') {
      currentLang = 'en';
      strings = fallback;
      if (callback) callback();
    } else {
      // No language saved — first launch
      if (callback) callback();
    }
  }

  function getLang() { return currentLang; }
  function getSavedLang() { return localStorage.getItem(STORAGE_KEY); }
  function isRTL() { return currentLang === 'ar'; }
  function getDir() { return isRTL() ? 'rtl' : 'ltr'; }
  function getSupportedLanguages() { return SUPPORTED; }

  // Convert Western digits (0-9) to Eastern Arabic digits (٠-٩) when lang is Arabic
  const EASTERN_ARABIC = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  function formatNum(val) {
    if (currentLang !== 'ar') return String(val);
    return String(val).replace(/[0-9]/g, d => EASTERN_ARABIC[d]);
  }

  return {
    init, t, getSection, setLang, applyToDOM, loadLang,
    getLang, getSavedLang, isRTL, getDir, getSupportedLanguages, resolve, formatNum
  };
})();

// calculator.js — Calculator UI logic

const Calculator = (() => {
  let currentInput = '';
  let onSubmit = null;
  let disabled = false;

  function init(submitCallback) {
    onSubmit = submitCallback;
    currentInput = '';
    disabled = false;
    render();
    bindEvents();
  }

  function render() {
    const display = document.getElementById('answer-display');
    if (display) {
      display.textContent = currentInput ? I18n.formatNum(currentInput) : '';
      // Show cursor blink when empty
      display.classList.toggle('empty', currentInput.length === 0);
    }
  }

  function bindEvents() {
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(btn => {
      // Remove old listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        if (disabled) return;
        Audio.resume();
        const val = newBtn.dataset.value;
        handleInput(val);
      });

      // Touch support
      newBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (disabled) return;
        Audio.resume();
        newBtn.classList.add('pressed');
        const val = newBtn.dataset.value;
        handleInput(val);
      });

      newBtn.addEventListener('touchend', () => {
        newBtn.classList.remove('pressed');
      });
    });

    // Keyboard support
    document.removeEventListener('keydown', handleKeyboard);
    document.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(e) {
    if (disabled) return;
    // Don't capture if dialogue is open
    const dialogueOverlay = document.getElementById('dialogue-overlay');
    if (dialogueOverlay && !dialogueOverlay.classList.contains('hidden')) return;
    // Don't capture if game screen not visible
    const gameScreen = document.getElementById('screen-game');
    if (!gameScreen || gameScreen.classList.contains('hidden')) return;

    Audio.resume();
    if (e.key >= '0' && e.key <= '9') {
      handleInput(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleInput('C');
    } else if (e.key === 'Enter') {
      handleInput('submit');
    }
  }

  function handleInput(val) {
    if (val === 'C') {
      currentInput = '';
      Audio.buttonPress();
    } else if (val === 'submit') {
      if (currentInput.length > 0 && onSubmit) {
        onSubmit(parseInt(currentInput, 10));
      }
    } else {
      // Number input — max 4 digits
      if (currentInput.length < 4) {
        currentInput += val;
        Audio.buttonPress();
      }
    }
    render();
  }

  function clear() {
    currentInput = '';
    render();
  }

  function setDisabled(val) {
    disabled = val;
  }

  function showFeedback(correct) {
    const display = document.getElementById('answer-display');
    if (!display) return;

    display.classList.add(correct ? 'correct-flash' : 'wrong-flash');
    setTimeout(() => {
      display.classList.remove('correct-flash', 'wrong-flash');
    }, 300);
  }

  function setAnswer(value) {
    currentInput = String(value);
    render();
  }

  return { init, clear, setDisabled, showFeedback, setAnswer, handleInput };
})();

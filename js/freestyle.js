// freestyle.js — Freestyle Mode: "The Endless Dream"
// Chain problem generator + session controller + tier system

const Freestyle = (() => {
  // --- Session State ---
  let active = false;
  let submode = null;        // 'pure' or 'guardian'
  let selectedGuardian = null;
  let chainValue = 0;
  let currentProblem = null;
  let streak = 0;
  let bestChain = 0;
  let totalCorrect = 0;
  let currentTier = 1;
  let lastOps = [];          // last 2 operations for variety check
  let guardianCharge = 0;    // 0-15 counter for guardian mode
  let guardianReady = false;

  // --- Tier Definitions ---
  const TIERS = [
    { tier: 1, name: 'Warm Up',    threshold: 0,   ops: ['addition', 'subtraction'],                                    maxB: 10 },
    { tier: 2, name: 'Building',   threshold: 16,  ops: ['addition', 'subtraction', 'multiplication'],                  maxB: 12 },
    { tier: 3, name: 'Flowing',    threshold: 36,  ops: ['addition', 'subtraction', 'multiplication', 'division'],      maxB: 15 },
    { tier: 4, name: 'Deep Dream', threshold: 61,  ops: ['addition', 'subtraction', 'multiplication', 'division'],      maxB: 20 },
    { tier: 5, name: 'Infinite',   threshold: 100, ops: ['addition', 'subtraction', 'multiplication', 'division'],      maxB: 25 },
  ];

  // Tier names for display
  const TIER_NAMES = ['', 'Warm Up', 'Building', 'Flowing', 'Deep Dream', 'Infinite'];

  // Drain rates mapped to existing world drain configs
  // Tier 1 → World 1 stages 1-3, Tier 2 → World 3 stages 4-6, etc.
  const TIER_DRAIN_RATES = {
    1: 0.515,                      // World 1 base
    2: 0.515 + 2 * 0.13,          // World 3 base (~0.775)
    3: 0.515 + 4 * 0.13,          // World 5 base (~1.035)
    4: 0.515 + 5 * 0.13,          // World 6 base (~1.165)
    5: (0.515 + 6 * 0.13) * 1.3,  // World 7 base × 1.3 (~1.68)
  };

  // Recovery multiplier per tier (reduces bar recovery at higher tiers)
  const TIER_RECOVERY = {
    1: 1.0,
    2: 0.9,
    3: 0.8,
    4: 0.7,
    5: 0.6,
  };

  // Yumemori quotes based on highest tier reached
  const RESULT_QUOTES = {
    1: 'Every dream starts small. You will grow stronger.',
    2: 'Every dream starts small. You will grow stronger.',
    3: 'Your light reaches further than you know.',
    4: 'The Dream World shines brighter with you in it.',
    5: 'You are Sokunō. The Fast Brain. The Nightmares fear you.',
  };

  // --- Utility ---
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // --- Tier System ---
  function getTier(correct) {
    let t = 1;
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (correct >= TIERS[i].threshold) {
        t = TIERS[i].tier;
        break;
      }
    }
    return t;
  }

  function getTierConfig(tier) {
    return TIERS[tier - 1] || TIERS[0];
  }

  function getDrainRate(tier) {
    return TIER_DRAIN_RATES[tier] || TIER_DRAIN_RATES[1];
  }

  function getRecoveryMultiplier(tier) {
    return TIER_RECOVERY[tier] || 1.0;
  }

  // --- Chain Problem Generator ---
  function generateChainProblem(cv, tier, ops) {
    const config = getTierConfig(tier);
    const availableOps = config.ops.slice(); // copy
    const maxB = config.maxB;
    const MAX_ATTEMPTS = 50;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // Pick operation
      let operation = pickOperation(cv, availableOps, ops, tier);

      // Generate second operand and compute answer
      let b, answer, symbol;

      switch (operation) {
        case 'addition':
          b = randInt(1, maxB);
          answer = cv + b;
          symbol = '+';
          break;

        case 'subtraction':
          // Ensure result > 0
          b = randInt(1, Math.min(cv - 1, maxB));
          if (b < 1) continue; // cv is 1 — can't subtract, retry
          answer = cv - b;
          symbol = '−';
          break;

        case 'multiplication':
          b = randInt(2, maxB);
          answer = cv * b;
          symbol = '×';
          break;

        case 'division': {
          // Find valid divisors of cv within range
          const divisors = [];
          for (let d = 2; d <= Math.min(cv, maxB); d++) {
            if (cv % d === 0 && cv / d > 0) {
              divisors.push(d);
            }
          }
          if (divisors.length === 0) continue; // no valid division, retry
          b = divisors[randInt(0, divisors.length - 1)];
          answer = cv / b;
          symbol = '÷';
          break;
        }

        default:
          b = randInt(1, maxB);
          answer = cv + b;
          symbol = '+';
          operation = 'addition';
      }

      // Safety checks
      if (answer <= 0) continue;        // must be positive
      if (answer !== Math.floor(answer)) continue; // must be integer
      if (answer === 0) continue;        // zero avoidance

      return { a: cv, b, answer, symbol, operation };
    }

    // Fallback: simple addition to keep game going
    const b = randInt(1, 5);
    return { a: cv, b, answer: cv + b, symbol: '+', operation: 'addition' };
  }

  function pickOperation(cv, availableOps, lastTwoOps, tier) {
    let candidates = availableOps.slice();

    // Operation variety: don't allow 3 consecutive same operation
    if (lastTwoOps.length >= 2 && lastTwoOps[0] === lastTwoOps[1]) {
      candidates = candidates.filter(op => op !== lastTwoOps[0]);
    }

    // Runaway prevention
    if (cv > 150) {
      // Force subtraction or division only
      candidates = candidates.filter(op => op === 'subtraction' || op === 'division');
      if (candidates.length === 0) candidates = ['subtraction'];
    } else if (cv > 100) {
      // Bias heavily toward subtraction and division
      const reduced = candidates.filter(op => op === 'subtraction' || op === 'division');
      if (reduced.length > 0 && Math.random() < 0.75) {
        candidates = reduced;
      }
    }

    // Chain value of 1: can't subtract or divide meaningfully
    if (cv === 1) {
      candidates = candidates.filter(op => op === 'addition' || op === 'multiplication');
      if (candidates.length === 0) candidates = ['addition'];
    }

    // Chain value of 2: subtraction would give 1 (ok) but no meaningful division
    if (cv <= 1) {
      candidates = candidates.filter(op => op !== 'division');
    }

    // Tier 5: weight toward multiplication and division
    if (tier === 5 && Math.random() < 0.4) {
      const hardOps = candidates.filter(op => op === 'multiplication' || op === 'division');
      if (hardOps.length > 0) candidates = hardOps;
    }

    if (candidates.length === 0) candidates = ['addition'];

    return candidates[randInt(0, candidates.length - 1)];
  }

  // --- Session Management ---
  function startSession(mode, guardianId) {
    active = true;
    submode = mode; // 'pure' or 'guardian'
    selectedGuardian = mode === 'guardian' ? guardianId : null;
    streak = 0;
    bestChain = 0;
    totalCorrect = 0;
    currentTier = 1;
    lastOps = [];
    guardianCharge = 0;
    guardianReady = false;

    // Generate initial seed
    chainValue = randInt(2, 10);
    currentProblem = generateChainProblem(chainValue, currentTier, lastOps);
  }

  function onCorrectAnswer() {
    streak++;
    totalCorrect++;
    if (streak > bestChain) bestChain = streak;

    // Track chain value from the answer
    chainValue = currentProblem.answer;

    // Track last operations for variety
    lastOps.push(currentProblem.operation);
    if (lastOps.length > 2) lastOps.shift();

    // Check tier transition
    const newTier = getTier(totalCorrect);
    const tierChanged = newTier !== currentTier;
    currentTier = newTier;

    // Guardian charge (15 consecutive correct)
    if (submode === 'guardian') {
      if (!guardianReady) {
        guardianCharge++;
        if (guardianCharge >= 15) {
          guardianReady = true;
        }
      }
    }

    // Generate next problem in the chain
    currentProblem = generateChainProblem(chainValue, currentTier, lastOps);

    return {
      tierChanged,
      tier: currentTier,
      drainRate: getDrainRate(currentTier),
      recoveryMultiplier: getRecoveryMultiplier(currentTier),
      streak,
      totalCorrect,
      isStreakMilestone5: streak % 5 === 0,
      isStreakMilestone10: streak % 10 === 0,
      guardianReady,
      guardianChargePercent: guardianReady ? 1 : guardianCharge / 15,
    };
  }

  function onWrongAnswer() {
    streak = 0;
    lastOps = [];

    // Guardian charge resets
    guardianCharge = 0;
    guardianReady = false;

    // New seed appropriate for current tier
    const config = getTierConfig(currentTier);
    chainValue = randInt(2, Math.min(10, config.maxB));
    currentProblem = generateChainProblem(chainValue, currentTier, lastOps);

    return {
      tier: currentTier,
      totalCorrect,
      guardianChargePercent: 0,
    };
  }

  function useGuardianPower() {
    if (!guardianReady) return false;
    guardianReady = false;
    guardianCharge = 0;
    return true;
  }

  function endSession() {
    active = false;
    return {
      submode,
      bestChain,
      totalCorrect,
      highestTier: currentTier,
      tierName: TIER_NAMES[currentTier] || 'Unknown',
      quote: RESULT_QUOTES[currentTier] || RESULT_QUOTES[1],
      guardian: selectedGuardian,
    };
  }

  // --- Nami Simplify for Freestyle ---
  function simplifyCurrentProblem() {
    if (!currentProblem) return;
    // Replace with easier operation on same chain value
    const easyOps = ['addition', 'subtraction'];
    const op = easyOps[randInt(0, 1)];
    let b, answer, symbol;
    if (op === 'addition') {
      b = randInt(1, 5);
      answer = chainValue + b;
      symbol = '+';
    } else {
      b = randInt(1, Math.min(chainValue - 1, 5));
      if (b < 1) { b = 1; }
      answer = chainValue - b;
      if (answer <= 0) {
        b = 1;
        answer = chainValue + b;
        symbol = '+';
      } else {
        symbol = '−';
      }
    }
    currentProblem = { a: chainValue, b, answer, symbol, operation: op };
  }

  // --- Blaze Skip for Freestyle ---
  function skipCurrentProblem() {
    // Generate new chain seed, streak preserved
    chainValue = randInt(2, 10);
    lastOps = [];
    currentProblem = generateChainProblem(chainValue, currentTier, lastOps);
  }

  // --- Cosmic Solve for Freestyle ---
  function cosmicSolveCurrentProblem() {
    // Auto-complete: move chain value forward as if answered correctly
    chainValue = currentProblem.answer;
    lastOps.push(currentProblem.operation);
    if (lastOps.length > 2) lastOps.shift();
    streak++;
    totalCorrect++;
    if (streak > bestChain) bestChain = streak;

    // Check tier transition
    const newTier = getTier(totalCorrect);
    const tierChanged = newTier !== currentTier;
    currentTier = newTier;

    // Generate next problem
    currentProblem = generateChainProblem(chainValue, currentTier, lastOps);

    return {
      tierChanged,
      tier: currentTier,
      drainRate: getDrainRate(currentTier),
      streak,
      totalCorrect,
      isStreakMilestone5: streak % 5 === 0,
      isStreakMilestone10: streak % 10 === 0,
    };
  }

  // --- Getters ---
  function isActive() { return active; }
  function getSubmode() { return submode; }
  function getSelectedGuardian() { return selectedGuardian; }
  function getCurrentProblem() { return currentProblem; }
  function getChainValue() { return chainValue; }
  function getStreak() { return streak; }
  function getBestChain() { return bestChain; }
  function getTotalCorrect() { return totalCorrect; }
  function getCurrentTier() { return currentTier; }
  function getTierName() { return TIER_NAMES[currentTier] || ''; }
  function getGuardianCharge() { return guardianReady ? 1 : guardianCharge / 15; }
  function isGuardianReady() { return guardianReady; }
  function getResultQuote(tier) { return RESULT_QUOTES[tier] || RESULT_QUOTES[1]; }
  function getDrainRateForTier(tier) { return getDrainRate(tier); }

  return {
    startSession, onCorrectAnswer, onWrongAnswer, endSession,
    useGuardianPower, simplifyCurrentProblem, skipCurrentProblem, cosmicSolveCurrentProblem,
    isActive, getSubmode, getSelectedGuardian,
    getCurrentProblem, getChainValue, getStreak, getBestChain,
    getTotalCorrect, getCurrentTier, getTierName,
    getGuardianCharge, isGuardianReady, getResultQuote,
    getDrainRateForTier, generateChainProblem, getTier,
  };
})();

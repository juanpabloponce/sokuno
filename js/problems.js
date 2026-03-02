// problems.js — Math problem generation

const Problems = (() => {
  const HISTORY_SIZE = 8; // remember last N problems to avoid repeats
  let history = [];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function resetHistory() {
    history = [];
  }

  function problemKey(a, b, operation) {
    return `${a}|${operation}|${b}`;
  }

  function isDuplicate(a, b, operation) {
    const key = problemKey(a, b, operation);
    return history.includes(key);
  }

  function addToHistory(a, b, operation) {
    history.push(problemKey(a, b, operation));
    if (history.length > HISTORY_SIZE) {
      history.shift();
    }
  }

  function generateSingle(config) {
    const operation = config.operations[randInt(0, config.operations.length - 1)];
    let a, b, answer, symbol;

    switch (operation) {
      case 'addition':
        a = randInt(config.min, config.max);
        b = randInt(config.min, config.max);
        answer = a + b;
        symbol = '+';
        break;

      case 'subtraction':
        a = randInt(config.min, config.max);
        b = randInt(config.min, a); // ensure non-negative result
        answer = a - b;
        symbol = '-';
        break;

      case 'multiplication':
        a = randInt(config.min, config.max);
        b = randInt(config.min, config.max);
        answer = a * b;
        symbol = '\u00d7';
        break;

      case 'division':
        b = randInt(config.min === 0 ? 1 : config.min, config.max);
        answer = randInt(1, config.max);
        a = b * answer; // ensure clean division
        symbol = '\u00f7';
        break;

      default:
        a = randInt(1, 10);
        b = randInt(1, 10);
        answer = a + b;
        symbol = '+';
    }

    return { a, b, answer, symbol, operation };
  }

  function generateProblem(worldId, stageNum) {
    const config = getStageConfig(worldId, stageNum);
    const MAX_ATTEMPTS = 20;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const problem = generateSingle(config);
      if (!isDuplicate(problem.a, problem.b, problem.operation)) {
        addToHistory(problem.a, problem.b, problem.operation);
        return problem;
      }
    }

    // Fallback: if all attempts produced duplicates, return anyway
    const problem = generateSingle(config);
    addToHistory(problem.a, problem.b, problem.operation);
    return problem;
  }

  function getStageConfig(worldId, stageNum) {
    let operations, min, max;

    switch (worldId) {
      case 1: // Ice — Addition, Subtraction
        operations = ['addition', 'subtraction'];
        if (stageNum <= 3) { min = 1; max = 5; }
        else if (stageNum <= 6) { min = 2; max = 8; }
        else if (stageNum <= 9) { min = 3; max = 12; }
        else { min = 2; max = 12; }
        break;

      case 2: // Psychic — Addition, Subtraction
        operations = ['addition', 'subtraction'];
        if (stageNum <= 3) { min = 2; max = 10; }
        else if (stageNum <= 6) { min = 4; max = 16; }
        else if (stageNum <= 9) { min = 5; max = 22; }
        else { min = 2; max = 22; }
        break;

      case 3: // Jungle — Multiplication, tables 1-6
        operations = ['multiplication'];
        if (stageNum <= 3) { min = 1; max = 4; }
        else if (stageNum <= 6) { min = 2; max = 5; }
        else if (stageNum <= 9) { min = 2; max = 6; }
        else { min = 2; max = 6; }
        break;

      case 4: // Cosmos — Division, tables 1-6
        operations = ['division'];
        if (stageNum <= 3) { min = 1; max = 4; }
        else if (stageNum <= 6) { min = 2; max = 5; }
        else if (stageNum <= 9) { min = 2; max = 6; }
        else { min = 2; max = 6; }
        break;

      case 5: // Volcano — Multiplication & Division, tables 1-11
        operations = ['multiplication', 'division'];
        if (stageNum <= 3) { min = 2; max = 6; }
        else if (stageNum <= 6) { min = 3; max = 8; }
        else if (stageNum <= 9) { min = 4; max = 11; }
        else { min = 2; max = 11; }
        break;

      case 6: // Ocean — All operations mixed
        operations = ['addition', 'subtraction', 'multiplication', 'division'];
        if (stageNum <= 3) { min = 2; max = 9; }
        else if (stageNum <= 6) { min = 3; max = 14; }
        else if (stageNum <= 9) { min = 3; max = 17; }
        else { min = 2; max = 19; }
        break;

      case 7: // The Abyss — All operations, extreme, unpredictable
        operations = ['addition', 'subtraction', 'multiplication', 'division'];
        if (stageNum <= 3) { min = 2; max = 12; }
        else if (stageNum <= 6) { min = 3; max = 15; }
        else if (stageNum <= 9) { min = 4; max = 19; }
        else { min = 3; max = 21; } // Stage 10: Final battle
        break;

      default:
        operations = ['addition'];
        min = 1; max = 10;
    }

    return { operations, min, max };
  }

  function simplifyProblem(problem) {
    // For the Nami "Simplify" power — reduce numbers
    const halfA = Math.max(1, Math.ceil(problem.a / 2));
    const halfB = Math.max(1, Math.ceil(problem.b / 2));
    return generateSimplified(halfA, halfB, problem.operation);
  }

  function generateSimplified(maxA, maxB, operation) {
    let a = randInt(1, maxA);
    let b = randInt(1, maxB);
    let answer, symbol;

    switch (operation) {
      case 'addition':
        answer = a + b; symbol = '+'; break;
      case 'subtraction':
        if (b > a) [a, b] = [b, a];
        answer = a - b; symbol = '-'; break;
      case 'multiplication':
        answer = a * b; symbol = '\u00d7'; break;
      case 'division':
        if (b === 0) b = 1;
        answer = a;
        a = a * b;
        symbol = '\u00f7'; break;
      default:
        answer = a + b; symbol = '+';
    }

    return { a, b, answer, symbol, operation };
  }

  return { generateProblem, simplifyProblem, resetHistory };
})();

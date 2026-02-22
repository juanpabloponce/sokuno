// worlds-data.js — Inline world definitions (avoids fetch for file:// protocol)

// Guardian seal icons for each world (img tags referencing SVG files)
const WORLD_ICONS = {
  1: `<img src="assets/guardians/ice.svg" class="guardian-seal" alt="Fubuki">`,
  2: `<img src="assets/guardians/psy.svg" class="guardian-seal" alt="Omoi">`,
  3: `<img src="assets/guardians/nature.svg" class="guardian-seal" alt="Midori">`,
  4: `<img src="assets/guardians/cosmos.svg" class="guardian-seal" alt="Uchū">`,
  5: `<img src="assets/guardians/fire.svg" class="guardian-seal" alt="Kaen">`,
  6: `<img src="assets/guardians/ocean.svg" class="guardian-seal" alt="Nami">`,
  7: `<img src="assets/guardians/abyss.svg" class="guardian-seal" alt="Kurayami">`
};

const WORLDS_DATA = {
  "worlds": [
    {
      "id": 1,
      "name": "Ice",
      "guardian": "Fubuki",
      "guardianMeaning": "Blizzard",
      "guardianIcon": "assets/guardians/ice.svg",
      "powerName": "Freeze",
      "powerEffect": "Stops bar drain for 5 seconds",
      "description": "A frozen realm trapped in eternal winter. Fubuki, the ice guardian, sleeps beneath the glaciers — waiting to be awakened.",
      "operations": ["addition", "subtraction"],
      "numberRange": [1, 10],
      "colors": {
        "primary": "#A8D5E5",
        "secondary": "#E8F4F8",
        "accent": "#5BC0EB"
      },
      "stages": 10
    },
    {
      "id": 2,
      "name": "Psychic",
      "guardian": "Omoi",
      "guardianMeaning": "Thought",
      "guardianIcon": "assets/guardians/psy.svg",
      "powerName": "Insight",
      "powerEffect": "Reveals first half of answer",
      "description": "A realm of shifting thoughts and illusions. Omoi, the psychic guardian, is lost within a maze of the mind.",
      "operations": ["addition", "subtraction"],
      "numberRange": [1, 20],
      "colors": {
        "primary": "#9B5DE5",
        "secondary": "#F0E6FF",
        "accent": "#00BBF9"
      },
      "stages": 10
    },
    {
      "id": 3,
      "name": "Jungle",
      "guardian": "Midori",
      "guardianMeaning": "Green",
      "guardianIcon": "assets/guardians/nature.svg",
      "powerName": "Restore",
      "powerEffect": "Recovers 20% of sleep bar",
      "description": "An ancient jungle overgrown by Nightmares. Midori, the nature guardian, has been consumed by the wild.",
      "operations": ["multiplication"],
      "numberRange": [1, 5],
      "colors": {
        "primary": "#57CC99",
        "secondary": "#E8F5E9",
        "accent": "#80ED99"
      },
      "stages": 10
    },
    {
      "id": 4,
      "name": "Cosmos",
      "guardian": "Uch\u016B",
      "guardianMeaning": "Universe",
      "guardianIcon": "assets/guardians/cosmos.svg",
      "powerName": "Cosmic Solve",
      "powerEffect": "Auto-completes current problem correctly",
      "description": "The vast void between stars, where silence reigns. Uchū, the cosmic guardian, drifts through infinite darkness.",
      "operations": ["division"],
      "numberRange": [1, 5],
      "colors": {
        "primary": "#1A1A2E",
        "secondary": "#16213E",
        "accent": "#E94560"
      },
      "stages": 10
    },
    {
      "id": 5,
      "name": "Volcano",
      "guardian": "Kaen",
      "guardianMeaning": "Flame",
      "guardianIcon": "assets/guardians/fire.svg",
      "powerName": "Blaze Skip",
      "powerEffect": "Skips current problem without penalty",
      "description": "A scorching land of molten fury. Kaen, the fire guardian, burns within the heart of the volcano.",
      "operations": ["multiplication", "division"],
      "numberRange": [1, 10],
      "colors": {
        "primary": "#FF6B35",
        "secondary": "#FFF3E0",
        "accent": "#F7931E"
      },
      "stages": 10
    },
    {
      "id": 6,
      "name": "Ocean",
      "guardian": "Nami",
      "guardianMeaning": "Wave",
      "guardianIcon": "assets/guardians/ocean.svg",
      "powerName": "Simplify",
      "powerEffect": "Reduces current problem to easier numbers",
      "description": "An endless sea swallowed by storms. Nami, the ocean guardian, is trapped beneath the crushing depths.",
      "operations": ["addition", "subtraction", "multiplication", "division"],
      "numberRange": [1, 20],
      "colors": {
        "primary": "#00B4D8",
        "secondary": "#CAF0F8",
        "accent": "#0077B6"
      },
      "stages": 10
    },
    {
      "id": 7,
      "name": "The Abyss",
      "guardian": "Kurayami",
      "guardianMeaning": "Darkness",
      "guardianIcon": "assets/guardians/abyss.svg",
      "powerName": null,
      "powerEffect": null,
      "description": "The source of all Nightmares. Kurayami awaits at the bottom — the final dream, and the final truth.",
      "operations": ["addition", "subtraction", "multiplication", "division"],
      "numberRange": [1, 20],
      "colors": {
        "primary": "#0D0D0D",
        "secondary": "#1A1A1A",
        "accent": "#FFD700"
      },
      "stages": 10
    }
  ]
};

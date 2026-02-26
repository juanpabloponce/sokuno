// lang/en.js — English (source language)

var LANG_EN = {

  // === UI STRINGS ===
  ui: {
    tap: 'Tap',
    enterDreamWorld: 'Enter the Dream World',
    storyMode: 'Story Mode',
    theEndlessDream: 'The Endless Dream',
    completeStoryToUnlock: 'Complete Story Mode to unlock',
    readTheLore: 'Read the Lore',
    mixtape: 'Mixtape',
    settings: 'Settings',
    language: 'Language',
    audioSettings: 'Audio',
    music: 'Music',
    soundEffects: 'Sound Effects',
    musicVolume: 'Music Volume',
    sfxVolume: 'SFX Volume',
    on: 'On',
    off: 'Off',
    difficulty: 'Difficulty',
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    tagline: 'Multi-sensory brain trainer \u2014 designed for flow state',
    headphonesOn: '\uD83C\uDFA7 Headphones on. World off.',
    back: '\u2190 Back',
    chapters: '\u2190 Chapters',
    prev: '\u25C2 Prev',
    next: 'Next \u25B8',
    continue_: 'Continue',
    begin: 'Begin',
    skip: 'Skip \u25B8\u25B8',
    loreTitle: 'Lore',
    loreSubtitle: 'Story of the Dream World',
    mixtapeTitle: 'Mixtape',
    mixtapeSubtitle: 'Songs of the Dream World',
    dreamWorldTitle: 'Dream World',
    chooseARealm: 'Choose a realm',
    chooseYourCompanion: 'Choose Your Companion',
    oneGuardianStory: 'One guardian will accompany you through this realm',
    newChapterUnlocked: 'New Chapter Unlocked',
    addedToLore: 'added to Lore',
    stageClear: 'Stage Clear!',
    defeated: 'Defeated',
    errorsCount: 'Errors: {0}',
    problemsSolved: 'Problems solved: {0}',
    nextStage: 'Next Stage',
    worldMap: 'World Map',
    retry: 'Retry',
    defeatMessage: 'The Nightmares have woken you up... You have left the Dream World.',
    dreamOver: 'Dream Over',
    bestChain: 'Best Chain',
    totalCorrect: 'Total Correct',
    highestTier: 'Highest Tier',
    newBest: 'NEW BEST!',
    dreamAgain: 'Dream Again',
    wakeUp: 'Wake Up',
    allGuardians: 'All Guardians',
    companion: 'Companion: {0}',
    noCompanion: 'No companion',
    resonance: 'Resonance',
    personalRecords: 'Personal Records',
    pureBestChain: 'Pure \u2014 Best Chain:',
    pureTotal: 'Total:',
    guardianBestChain: 'Guardian \u2014 Best Chain:',
    guardianTotal: 'Total:',
    yourName: 'Your name...',
    thatsMyName: "That's my name",
    failedToLoadWorlds: 'Failed to load worlds. Please refresh the page.',
    realm: '{0} Realm',
    stage: '{0} \u2014 Stage {1}',
    stop: 'Stop',
    changeLanguage: 'Change Language',
    selectLanguage: 'Select Language',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'The Endless Dream',
    selectSubtitle: 'How would you like to dream tonight?',
    yumemoriQuote: '\u201CEach answer becomes the next challenge. The chain never stops... how long can you hold the dream?\u201D',
    dreamAlone: 'Dream Alone',
    dreamAloneDesc: 'Pure math. No powers. Just you.',
    bringAGuardian: 'Bring a Guardian',
    bringAGuardianDesc: 'Choose a companion. Power charges every 15 correct.',
    guardianPickerTitle: 'Choose Your Companion',
    guardianPickerSubtitle: 'One guardian will accompany you into the Endless Dream',
    gameLabel: '\u2726 The Endless Dream',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Warm Up',
    2: 'Building',
    3: 'Flowing',
    4: 'Deep Dream',
    5: 'Infinite',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Every dream starts small. You will grow stronger.',
    2: 'Every dream starts small. You will grow stronger.',
    3: 'Your light reaches further than you know.',
    4: 'The Dream World shines brighter with you in it.',
    5: 'You are Sokun\u014D. The Fast Brain. The Nightmares fear you.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'You are asleep...',
    line2: 'good. Now we can speak.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Ice', guardianMeaning: 'Blizzard', description: 'A frozen realm trapped in eternal winter. Fubuki, the ice guardian, sleeps beneath the glaciers \u2014 waiting to be awakened.' },
    2: { name: 'Psychic', guardianMeaning: 'Thought', description: 'A realm of shifting thoughts and illusions. Omoi, the psychic guardian, is lost within a maze of the mind.' },
    3: { name: 'Jungle', guardianMeaning: 'Green', description: 'An ancient jungle overgrown by Nightmares. Midori, the nature guardian, has been consumed by the wild.' },
    4: { name: 'Cosmos', guardianMeaning: 'Universe', description: 'The vast void between stars, where silence reigns. Uch\u016B, the cosmic guardian, drifts through infinite darkness.' },
    5: { name: 'Volcano', guardianMeaning: 'Flame', description: 'A scorching land of molten fury. Kaen, the fire guardian, burns within the heart of the volcano.' },
    6: { name: 'Ocean', guardianMeaning: 'Wave', description: 'An endless sea swallowed by storms. Nami, the ocean guardian, is trapped beneath the crushing depths.' },
    7: { name: 'The Abyss', guardianMeaning: 'Darkness', description: 'The source of all Nightmares. Kurayami awaits at the bottom \u2014 the final dream, and the final truth.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: 'Stops bar drain for 5 seconds' },
    insight:     { name: 'Insight',      desc: 'Reveals first half of answer' },
    restore:     { name: 'Restore',      desc: 'Recovers 20% of sleep bar' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Auto-completes current problem' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Skips problem without penalty' },
    simplify:    { name: 'Simplify',     desc: 'Reduces problem to easier numbers' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori fights beside you \u2014 auto-completes 5 problems' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'Before Light',
    2:  'The First to Fall',
    3:  'The Weight of Knowing',
    4:  'Seeds in Dark Soil',
    5:  'The Space Between Stars',
    6:  'What Burns Inside',
    7:  'Sunlight on Water',
    8:  'Six Lights, One Dark',
    9:  'If I Cannot Shine',
    10: 'A Small Golden Spark',
    chapterStoryNotWritten: "This chapter's story has yet to be written...",
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Intro',
    2: 'World 1 \u2014 Ice',
    3: 'World 2 \u2014 Psychic',
    4: 'World 3 \u2014 Jungle',
    5: 'World 4 \u2014 Cosmos',
    6: 'World 5 \u2014 Volcano',
    7: 'World 6 \u2014 Ocean',
    8: 'World 7 \u2014 Abyss',
    9: 'The Endless Dream',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Father... stop. You don\'t have the strength for this.',
    iHaveEnough: 'I have enough. To protect the one I love.',
    alwaysGiving: 'Always giving everything for others. You never kept anything for yourself.',
    oneMoreTime: 'One more time. Just one more time.',
    sixGuardians: 'Six guardians. One dreamer. One broken old man.',
    isThisAll: 'Is this all?',
    iWasTheBest: 'I was the best. And THEY FORGOT ME.',
  },

  // === POWER EFFECT TEXTS ===
  powerEffects: {
    freeze: 'Freeze!',
    insight: 'Insight!',
    restore: 'Restore!',
    cosmicSolve: 'Cosmic Solve!',
    blazeSkip: 'Blaze Skip!',
    simplify: 'Simplify!',
    rememberMe: 'Remember Me!',
  },

  // === ABYSS POST-BATTLE POWER TEXTS ===
  abyssPowerTexts: {
    freeze: 'Freeze is with you.',
    insight: 'Insight has been unlocked.',
    restore: 'Restore has been unlocked.',
    cosmicSolve: 'Cosmic Solve has been unlocked.',
    blazeSkip: 'Blaze Skip has been unlocked.',
    simplify: 'Simplify has been unlocked.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "Listen to me. We don't have much time." },
      { text: "The Nightmares attacked the Dream World. The guardians are asleep. Everything is going dark." },
      { text: "Your mind is bright. You are our only hope." },
      { text: "Every correct answer brings light. Every mistake lets the darkness in." },
      { text: "Are you ready?", button: "I'm ready" }
    ],

    worldIntros: {
      1: [
        { text: "The Realm of Ice. Fubuki sleeps beneath the frozen lake." },
        { text: "Only your light can reach her." },
        { text: "But be careful. The Nightmares will try to wake you up. You'll see a bar \u2014 that's your sleep. It drains as the darkness closes in." },
        { text: "Every correct answer pushes the Nightmares back and fills your sleep bar. Every mistake lets them closer." },
        { text: "Fill the bar completely, and the stage is yours. Let it reach zero... and you wake up.", button: "I understand" }
      ],
      2: [
        { text: "The Psychic Realm. Omoi sees what others cannot." },
        { text: "The numbers will grow larger. But your mind is ready.", button: "Begin" }
      ],
      3: [
        { text: "The Jungle Realm. Here, you'll learn to multiply." },
        { text: "Numbers will grow, just like the forest. Trust the process.", button: "Begin" }
      ],
      4: [
        { text: "The Cosmos. Uch\u016B watches over infinity." },
        { text: "Here, you will learn to divide. To break the large into the small.", button: "Begin" }
      ],
      5: [
        { text: "The Volcano. Kaen thrives in the heat." },
        { text: "Multiplication and division combine. The challenges will be fierce.", button: "Begin" }
      ],
      6: [
        { text: "The Ocean. Your final test before the Abyss." },
        { text: "Everything you've learned comes together here.", button: "Begin" }
      ],
      7: [
        { text: "This is the Abyss." },
        { text: "Be strong. Be bright. We are all with you.", button: "Begin" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki is almost awake. But the Nightmares are fighting hard." },
        { text: "Stay focused. You can do this.", button: "Awaken Fubuki" }
      ],
      2: [
        { text: "Omoi stirs in the mist. One final push." },
        { text: "The Nightmares will fight harder. But so will you.", button: "Awaken Omoi" }
      ],
      3: [
        { text: "The jungle trembles. Midori is close to waking." },
        { text: "Show the Nightmares the power of growth.", button: "Awaken Midori" }
      ],
      4: [
        { text: "The stars are aligning. Uch\u016B reaches out from the void." },
        { text: "One final challenge among the stars.", button: "Awaken Uch\u016B" }
      ],
      5: [
        { text: "The volcano rumbles. Kaen's fire wants to break free." },
        { text: "Let your mind burn bright.", button: "Awaken Kaen" }
      ],
      6: [
        { text: "The ocean stirs. The final guardian awaits." },
        { text: "Everything you have learned leads to this moment.", button: "Awaken Nami" }
      ],
      7: [
        { text: "So. You made it." },
        { text: "Yumemori. You really think this dreamer can do what you couldn't?" },
        { text: "I sealed the Shadows once." },
        { text: "And I broke the seal." },
        { text: "You never told me the darkness would call so loudly. You never told me the forgetting would hurt so much." },
        { text: "You just expected me to shine. Forever. Without help." },
        { text: "If I cannot be light... NO ONE WILL.", button: "Face Kurayami" }
      ]
    },

    awakenings: {
      1: [
        { text: "I... I'm awake." },
        { text: "Thank you, dreamer. The Nightmares kept me frozen for so long." },
        { text: "I tried to stop him, you know. When he came for us." },
        { text: "I wasn't strong enough." },
        { text: "But now I'll help you. When the darkness feels too strong, call on me." },
        { text: "New Power Unlocked: Freeze \u2014 Stops bar drain for 5 seconds" },
        { text: "Five realms remain.", button: "Continue" }
      ],
      2: [
        { text: "I can see again." },
        { text: "I knew something was wrong. I saw it happening." },
        { text: "One of us... changed. The darkness grew inside him. And I said nothing." },
        { text: "I thought he would find his way back on his own." },
        { text: "I was wrong." },
        { text: "My gift: Insight. When a problem seems too hard, I'll show you the way." },
        { text: "New Power Unlocked: Insight \u2014 Reveals first half of answer" },
        { text: "Two guardians stand with you.", button: "Continue" }
      ],
      3: [
        { text: "Life returns." },
        { text: "Do you know what I remember most about him?" },
        { text: "He used to help me plant seeds. He would shine on them and they would grow so fast." },
        { text: "He was warm. Kind. Full of light." },
        { text: "That version of him is still there. Somewhere. Like a seed buried deep." },
        { text: "My gift: Restore. When your light fades, I'll help it bloom again." },
        { text: "New Power Unlocked: Restore \u2014 Recovers 20% of sleep bar" },
        { text: "Three guardians awake.", button: "Continue" }
      ],
      4: [
        { text: "The stars remember." },
        { text: "The others are angry at him. Or sad. Or guilty." },
        { text: "I am none of these." },
        { text: "I understand the void. When you are surrounded by emptiness long enough... it starts to whisper." },
        { text: "He heard the whispers. And he was not strong enough to ignore them." },
        { text: "That does not make him evil. It makes him lost." },
        { text: "My gift: Cosmic Solve. When the weight is too heavy, I'll carry one problem for you." },
        { text: "New Power Unlocked: Cosmic Solve \u2014 Auto-completes one problem correctly" },
        { text: "Four guardians shine.", button: "Continue" }
      ],
      5: [
        { text: "FINALLY!" },
        { text: "You want to know who did this to us? His name was Hikari." },
        { text: "He was supposed to be our leader. The brightest of all of us." },
        { text: "But he couldn't handle being forgotten. So he opened the Abyss. He let the Shadows free. He put us all to sleep." },
        { text: "We all felt the forgetting. We all felt weaker. But we didn't betray our family." },
        { text: "My gift: Blaze Skip. Some problems aren't worth the fight. Skip them. Move on. Win." },
        { text: "New Power Unlocked: Blaze Skip \u2014 Skip problem without penalty" },
        { text: "Five guardians blaze. One remains.", button: "Continue" }
      ],
      6: [
        { text: "Peace." },
        { text: "I'm the youngest guardian. Hikari used to watch over me." },
        { text: "He taught me how to flow. How to stay calm when the waters got rough." },
        { text: "He was the first of us. The brightest. Yumemori made him from his purest light." },
        { text: "The others talk about saving him or stopping him." },
        { text: "I just want to see him again. The real him." },
        { text: "My gift: Simplify. When the waters are too rough, I'll smooth them for you." },
        { text: "New Power Unlocked: Simplify \u2014 Reduces problem to easier numbers" }
      ]
    },

    gathering: [
      { text: "Six guardians. Six lights. Together again." },
      { text: "Before you enter the Abyss... you deserve to know the full truth." },
      { text: "Long ago, I fought the Ancient Shadows alone. I sealed them in the deepest place of existence." },
      { text: "I used what was left of me to create seven guardians. Seven lights to protect the Dream World." },
      { text: "Hikari was the first. My brightest. My pride." },
      { text: "But when the dreamers forgot him... he began to fade. The emptiness grew. And the Shadows whispered from within the Abyss." },
      { text: "They promised him he would never be forgotten again." },
      { text: "He broke the seal. The Shadows consumed him. Hikari became Kurayami \u2014 king of the Nightmares." },
      { text: "I could not stop him. I had given everything to create the guardians. To seal the Abyss." },
      { text: "But now... we are not alone." },
      { text: "We're with you." },
      { text: "We see your light." },
      { text: "We believe in you." },
      { text: "We stand across infinity with you." },
      { text: "We burn beside you." },
      { text: "We flow as one." },
      { text: "Are you ready, dreamer?", button: "Enter the Abyss" }
    ],

    abyssMidpoint: [
      { text: "You're still here." },
      { text: "Do you know what it feels like to fade? To give everything... and be forgotten?" },
      { text: "The Shadows offered me a choice. Disappear forever... or become something they would never forget." },
      { text: "I chose." },
      { text: "Everyone gives up eventually.", button: "Continue" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. Always the first to fight." },
          { text: "You were also the first to fall. Do you remember?" },
          { text: "I remember trying to stop you. And I would do it again." },
          { text: "Brave. But bravery without strength is just noise.", button: "Begin" }
        ],
        post: [
          { text: "Still standing, Kurayami." },
          { text: "...for now." },
          { text: "Freeze is with you.", button: "Continue" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. The one who sees everything." },
          { text: "Tell me \u2014 if you saw what was happening to me... why did you do nothing?" },
          { text: "..." },
          { text: "Because I believed you would find your own way. I was wrong." },
          { text: "At least you are honest. That makes destroying you almost sad.", button: "Begin" }
        ],
        post: [
          { text: "Doubt is your weapon, Kurayami. But this dreamer does not doubt." },
          { text: "Everyone doubts. It is only a matter of time." },
          { text: "Insight has been unlocked.", button: "Continue" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. Always believing everything can grow." },
          { text: "Because it can. Even you." },
          { text: "You think I can come back? That I can 'grow' back into the light?" },
          { text: "I believe it with all my being." },
          { text: "...you are the most foolish of them all.", button: "Begin" }
        ],
        post: [
          { text: "The strongest roots grow in the darkness." },
          { text: "..." },
          { text: "Restore has been unlocked.", button: "Continue" }
        ]
      },
      4: {
        pre: [
          { text: "Uch\u016B. The silent one." },
          { text: "I know the void, Kurayami. I have lived in it longer than you." },
          { text: "Then you understand. You understand why I did what I did." },
          { text: "I understand the pain. I do not justify the destruction." },
          { text: "...you are the only one who understands anything.", button: "Begin" }
        ],
        post: [
          { text: "Even stars die. And are reborn." },
          { text: "Not all of them." },
          { text: "Cosmic Solve has been unlocked.", button: "Continue" }
        ]
      },
      5: {
        pre: [
          { text: "Let me go first. LET ME BURN HIM." },
          { text: "Kaen. All fire and no control." },
          { text: "You are a TRAITOR. You put us to sleep. Your own family!" },
          { text: "Family. What kind of family forgets one of their own?" },
          { text: "WE DIDN'T FORGET YOU! You stopped listening!" },
          { text: "...perhaps. But it is too late for that.", button: "Begin" }
        ],
        post: [
          { text: "When this is over... we will talk. You and me." },
          { text: "If there is anything left of me to talk to." },
          { text: "Blaze Skip has been unlocked.", button: "Continue" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "That name\u2014" },
          { text: "I will call you what I want. You are my older brother." },
          { text: "..." },
          { text: "Do you remember when you taught me to flow? When the currents were strong." },
          { text: "...be quiet." },
          { text: "You told me: 'Don't fight the water, Nami. Flow with it.'" },
          { text: "ENOUGH." },
          { text: "I am going to remind you who you were. Even if you don't want me to.", button: "Begin" }
        ],
        post: [
          { text: "You are still in there. I know it." },
          { text: "...don't do this to me, Nami." },
          { text: "Simplify has been unlocked.", button: "Continue" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "You... you remembered." },
      { text: "After everything I did... you still call me that name." },
      { text: "You are my son. My first creation. My brightest light." },
      { text: "I let the Shadows in too deep. They're part of me now." },
      { text: "I can't come back. Not yet." },
      { text: "But you didn't give up. Even when the darkness was everywhere." },
      { text: "Maybe... in another dream." },
      { text: "The darkness is lifting." },
      { text: "I can see the light again." },
      { text: "He called you Father. He still remembers." },
      { text: "The void is not forever. Even stars are reborn." },
      { text: "...I don't forgive him. Not yet. But maybe... someday." },
      { text: "He said 'maybe.' That's enough for now." },
      { text: "The Dream World is safe. Because of you, dreamer.", button: "Continue" }
    ],

    finale: [
      { text: "You have done it, dreamer." },
      { text: "All six realms shine bright. All six guardians stand with you." },
      { text: "And the seal is whole again." },
      { text: "Long ago, I built this world from nothing. I thought I had to protect everyone by myself." },
      { text: "I was wrong. You showed me that light grows stronger when it is shared." },
      { text: "You melted through the cold." },
      { text: "You saw through the doubt." },
      { text: "You grew through the struggle." },
      { text: "You reached across infinity." },
      { text: "You burned through the barriers." },
      { text: "You flowed through every challenge." },
      { text: "The Nightmares will return someday. They always do." },
      { text: "But you have done what no dreamer has done before." },
      { text: "So I offer you this gift." },
      { text: "From now on, you may return to the Dream World whenever you wish." },
      { text: "No stages. No limits. Just you and the numbers, for as long as you want to stay." },
      { text: "The guardians will be here. I will be here." },
      { text: "Come back every night, dreamer. Keep your light bright." },
      { text: "And maybe... maybe one day... Hikari will find his way home." },
      { text: "Deep in the Abyss, past the seal, in a corner where no light reaches..." },
      { text: "A small golden spark flickers." },
      { text: "...Father..." },
      { text: "THE END... ?" },
      { text: "", button: "Enter the Endless Dream" }
    ]
  },

  // === APP META ===
  appDescription: 'Train your mind. Light the dark.',
};

// lang/zh-CN.js — Simplified Chinese

var LANG_ZH_CN = {

  // === UI STRINGS ===
  ui: {
    tap: '点击',
    enterDreamWorld: '进入梦境世界',
    storyMode: '故事模式',
    theEndlessDream: '无尽之梦',
    completeStoryToUnlock: '完成故事模式后解锁',
    readTheLore: '阅读传说',
    mixtape: '音乐集',
    settings: '设置',
      language: '语言',
    tagline: '多感官脑力训练 — 专为心流状态设计',
    headphonesOn: '\uD83C\uDFA7 戴上耳机，隔绝世界。',
    back: '\u2190 返回',
    chapters: '\u2190 章节',
    prev: '\u25C2 上一页',
    next: '下一页 \u25B8',
    continue_: '继续',
    begin: '开始',
    skip: '跳过 \u25B8\u25B8',
    loreTitle: '传说',
    loreSubtitle: '梦境世界的故事',
    mixtapeTitle: '音乐集',
    mixtapeSubtitle: '梦境世界之歌',
    dreamWorldTitle: '梦境世界',
    chooseARealm: '选择一个领域',
    chooseYourCompanion: '选择你的同伴',
    oneGuardianStory: '一位守护者将陪伴你穿越这个领域',
    newChapterUnlocked: '新章节已解锁',
    addedToLore: '已添加至传说',
    stageClear: '关卡通过！',
    defeated: '战败',
    errorsCount: '错误：{0}',
    problemsSolved: '已解题数：{0}',
    nextStage: '下一关',
    worldMap: '世界地图',
    retry: '重试',
    defeatMessage: '噩梦将你唤醒了……你已离开梦境世界。',
    dreamOver: '梦境结束',
    bestChain: '最佳连击',
    totalCorrect: '总正确数',
    highestTier: '最高阶层',
    newBest: '新纪录！',
    dreamAgain: '再次入梦',
    wakeUp: '醒来',
    allGuardians: '所有守护者',
    companion: '同伴：{0}',
    noCompanion: '无同伴',
    resonance: '共鸣',
    personalRecords: '个人记录',
    pureBestChain: '纯净 — 最佳连击：',
    pureTotal: '总计：',
    guardianBestChain: '守护者 — 最佳连击：',
    guardianTotal: '总计：',
    yourName: '你的名字……',
    thatsMyName: '这就是我的名字',
    failedToLoadWorlds: '加载世界失败。请刷新页面。',
    realm: '{0}领域',
    stage: '{0} — 第{1}关',
    stop: '停止',
    changeLanguage: '更改语言',
    selectLanguage: '选择语言',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: '无尽之梦',
    selectSubtitle: '今夜你想如何入梦？',
    yumemoriQuote: '\u201C每一个答案都将成为下一个挑战。连击永不停歇……你能在梦中坚持多久？\u201D',
    dreamAlone: '独自入梦',
    dreamAloneDesc: '纯粹的数学。没有能力。只有你。',
    bringAGuardian: '带上守护者',
    bringAGuardianDesc: '选择一位同伴。每答对15题充能一次。',
    guardianPickerTitle: '选择你的同伴',
    guardianPickerSubtitle: '一位守护者将陪伴你进入无尽之梦',
    gameLabel: '\u2726 无尽之梦',
  },

  // === TIER NAMES ===
  tiers: {
    1: '热身',
    2: '渐入佳境',
    3: '心流涌动',
    4: '深层梦境',
    5: '无限',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: '每个梦都从微小处开始。你会变得更强。',
    2: '每个梦都从微小处开始。你会变得更强。',
    3: '你的光芒比你所知的更加深远。',
    4: '因为有你，梦境世界更加闪耀。',
    5: '你就是Sokun\u014D。极速之脑。噩梦都畏惧你。',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: '你已入睡……',
    line2: '很好。现在我们可以交谈了。',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: '冰', guardianMeaning: '暴风雪', description: '一个被永恒寒冬所困的冰封领域。冰之守护者Fubuki沉睡在冰川之下——等待着被唤醒。' },
    2: { name: '灵能', guardianMeaning: '思念', description: '一个思绪变幻、幻象重重的领域。灵能守护者Omoi迷失在心灵的迷宫之中。' },
    3: { name: '丛林', guardianMeaning: '翠绿', description: '一片被噩梦侵蚀的远古丛林。自然守护者Midori已被荒野所吞噬。' },
    4: { name: '宇宙', guardianMeaning: '宇宙', description: '群星之间广袤的虚空，寂静统治着一切。宇宙守护者Uch\u016B在无尽的黑暗中漂流。' },
    5: { name: '火山', guardianMeaning: '火焰', description: '一片熔岩肆虐的灼热之地。火焰守护者Kaen在火山的心脏中燃烧。' },
    6: { name: '海洋', guardianMeaning: '波浪', description: '一片被风暴吞噬的无尽之海。海洋守护者Nami被困在深海的巨压之下。' },
    7: { name: '深渊', guardianMeaning: '黑暗', description: '一切噩梦的源头。Kurayami在最深处等待——最后的梦境，最终的真相。' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: '冻结能量条消耗5秒' },
    insight:     { name: 'Insight',      desc: '揭示答案的前半部分' },
    restore:     { name: 'Restore',      desc: '恢复20%的睡眠条' },
    cosmicSolve: { name: 'Cosmic Solve', desc: '自动完成当前题目' },
    blazeSkip:   { name: 'Blaze Skip',   desc: '跳过题目且无惩罚' },
    simplify:    { name: 'Simplify',     desc: '将题目简化为更简单的数字' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori与你并肩作战——自动完成5道题目' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  '光明之前',
    2:  '第一个陨落者',
    3:  '洞察的重负',
    4:  '暗土中的种子',
    5:  '群星之间的虚空',
    6:  '心中燃烧之物',
    7:  '水面上的阳光',
    8:  '六道光，一片暗',
    9:  '若我无法发光',
    10: '一缕微小的金色火花',
    chapterStoryNotWritten: '这一章的故事尚未书写……',
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: '序章',
    2: '世界1 — 冰',
    3: '世界2 — 灵能',
    4: '世界3 — 丛林',
    5: '世界4 — 宇宙',
    6: '世界5 — 火山',
    7: '世界6 — 海洋',
    8: '世界7 — 深渊',
    9: '无尽之梦',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '……父亲……停下吧。你已经没有力气了。',
    iHaveEnough: '我有足够的力量。去守护我所爱之人。',
    alwaysGiving: '总是为他人倾尽所有。你从未为自己留下什么。',
    oneMoreTime: '再来一次。就再一次。',
    sixGuardians: '六位守护者。一个梦者。一个破碎的老人。',
    isThisAll: '就这些了吗？',
    iWasTheBest: '我曾是最耀眼的。而他们忘了我。',
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
    freeze: 'Freeze与你同在。',
    insight: 'Insight已解锁。',
    restore: 'Restore已解锁。',
    cosmicSolve: 'Cosmic Solve已解锁。',
    blazeSkip: 'Blaze Skip已解锁。',
    simplify: 'Simplify已解锁。',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: '听我说。我们时间不多了。' },
      { text: '噩梦袭击了梦境世界。守护者们都陷入了沉睡。一切正在陷入黑暗。' },
      { text: '你的心智光芒闪耀。你是我们唯一的希望。' },
      { text: '每一个正确答案都会带来光明。每一个错误都会让黑暗侵入。' },
      { text: '你准备好了吗？', button: '我准备好了' }
    ],

    worldIntros: {
      1: [
        { text: '冰之领域。Fubuki沉睡在冰封的湖底。' },
        { text: '只有你的光芒能触及她。' },
        { text: '但要小心。噩梦会试图将你唤醒。你会看到一个能量条——那是你的睡眠值。黑暗逼近时它会不断消耗。' },
        { text: '每一个正确答案都会击退噩梦、补充你的睡眠条。每一个错误都会让它们更加逼近。' },
        { text: '将能量条填满，这一关就是你的。让它降到零……你就会醒来。', button: '我明白了' }
      ],
      2: [
        { text: '灵能领域。Omoi能看见他人无法看见之物。' },
        { text: '数字会变得更大。但你的心智已经准备就绪。', button: '开始' }
      ],
      3: [
        { text: '丛林领域。在这里，你将学习乘法。' },
        { text: '数字会不断增长，就像森林一样。相信这个过程。', button: '开始' }
      ],
      4: [
        { text: '宇宙。Uch\u016B守望着无穷。' },
        { text: '在这里，你将学习除法。将大的拆分成小的。', button: '开始' }
      ],
      5: [
        { text: '火山。Kaen在炽热中焕发生机。' },
        { text: '乘法与除法相互交织。挑战将会无比激烈。', button: '开始' }
      ],
      6: [
        { text: '海洋。进入深渊前的最后考验。' },
        { text: '你所学的一切将在这里汇聚。', button: '开始' }
      ],
      7: [
        { text: '这里是深渊。' },
        { text: '保持坚强。保持光明。我们都与你同在。', button: '开始' }
      ]
    },

    stage10Intros: {
      1: [
        { text: 'Fubuki即将苏醒。但噩梦正在拼命抵抗。' },
        { text: '保持专注。你可以做到的。', button: '唤醒Fubuki' }
      ],
      2: [
        { text: 'Omoi在迷雾中苏动。最后一搏。' },
        { text: '噩梦会更加猛烈。但你也会如此。', button: '唤醒Omoi' }
      ],
      3: [
        { text: '丛林在颤抖。Midori即将苏醒。' },
        { text: '让噩梦见识成长的力量。', button: '唤醒Midori' }
      ],
      4: [
        { text: '群星正在列阵。Uch\u016B从虚空中伸出了手。' },
        { text: '群星之间的最后一战。', button: '唤醒Uch\u016B' }
      ],
      5: [
        { text: '火山在轰鸣。Kaen的火焰渴望挣脱束缚。' },
        { text: '让你的心智燃烧至最耀眼。', button: '唤醒Kaen' }
      ],
      6: [
        { text: '海洋在涌动。最后的守护者在等待。' },
        { text: '你所学的一切都指向这一刻。', button: '唤醒Nami' }
      ],
      7: [
        { text: '好啊。你到了。' },
        { text: 'Yumemori。你真觉得这个梦者能做到你做不到的事？' },
        { text: '我曾封印过暗影。' },
        { text: '而我打破了封印。' },
        { text: '你从没告诉过我黑暗的呼唤会如此响亮。你从没告诉过我被遗忘有多痛苦。' },
        { text: '你只是期待我永远闪耀。永远。没有人帮我。' },
        { text: '如果我不能成为光……那就谁都别想！', button: '面对Kurayami' }
      ]
    },

    awakenings: {
      1: [
        { text: '我……我醒了。' },
        { text: '谢谢你，梦者。噩梦把我冰封了那么久。' },
        { text: '你知道吗，当他来袭时，我曾试图阻止他。' },
        { text: '我不够强大。' },
        { text: '但现在我会帮助你。当黑暗太过强大时，呼唤我吧。' },
        { text: '新能力解锁：Freeze — 冻结能量条消耗5秒' },
        { text: '还剩五个领域。', button: '继续' }
      ],
      2: [
        { text: '我又能看见了。' },
        { text: '我知道出了问题。我看着一切发生。' },
        { text: '我们中的一个……变了。黑暗在他心中滋长。而我什么都没说。' },
        { text: '我以为他能自己找到回来的路。' },
        { text: '我错了。' },
        { text: '我的赠礼：Insight。当题目看似太难时，我会为你指引方向。' },
        { text: '新能力解锁：Insight — 揭示答案的前半部分' },
        { text: '两位守护者与你并肩。', button: '继续' }
      ],
      3: [
        { text: '生命回来了。' },
        { text: '你知道我对他最深的记忆是什么吗？' },
        { text: '他曾帮我播种。他会照耀它们，让它们飞速生长。' },
        { text: '他曾经温暖、善良，满溢着光芒。' },
        { text: '那个他还在某处。就像一颗深埋的种子。' },
        { text: '我的赠礼：Restore。当你的光芒消退时，我会帮它重新绽放。' },
        { text: '新能力解锁：Restore — 恢复20%的睡眠条' },
        { text: '三位守护者已苏醒。', button: '继续' }
      ],
      4: [
        { text: '群星铭记着一切。' },
        { text: '其他人对他愤怒、悲伤，或者愧疚。' },
        { text: '我没有这些。' },
        { text: '我理解虚空。当你被空虚包围足够久……它会开始低语。' },
        { text: '他听见了那些低语。而他没有足够的力量去忽视它们。' },
        { text: '这不代表他是邪恶的。只是迷失了。' },
        { text: '我的赠礼：Cosmic Solve。当重担太过沉重时，我会为你承担一道题。' },
        { text: '新能力解锁：Cosmic Solve — 自动正确完成一道题' },
        { text: '四位守护者闪耀着光芒。', button: '继续' }
      ],
      5: [
        { text: '终于！' },
        { text: '你想知道是谁对我们做了这一切吗？他的名字叫Hikari。' },
        { text: '他本应是我们的领袖。我们之中最耀眼的一个。' },
        { text: '但他无法承受被遗忘的痛苦。于是他打开了深渊。释放了暗影。让我们全部陷入沉睡。' },
        { text: '我们都感受到了被遗忘的痛苦。我们都变得虚弱。但我们没有背叛自己的家人。' },
        { text: '我的赠礼：Blaze Skip。有些题目不值得纠缠。跳过它们。继续前进。赢下去。' },
        { text: '新能力解锁：Blaze Skip — 跳过题目且无惩罚' },
        { text: '五位守护者燃烧着。还剩一位。', button: '继续' }
      ],
      6: [
        { text: '平静。' },
        { text: '我是最年轻的守护者。Hikari曾经守护着我。' },
        { text: '他教会了我如何随波逐流。在水流湍急时如何保持平静。' },
        { text: '他是我们中的第一个。最耀眼的。Yumemori用他最纯净的光芒创造了他。' },
        { text: '其他人谈论着要拯救他或阻止他。' },
        { text: '我只想再见到他。真正的他。' },
        { text: '我的赠礼：Simplify。当水流太过湍急时，我会为你抚平波涛。' },
        { text: '新能力解锁：Simplify — 将题目简化为更简单的数字' }
      ]
    },

    gathering: [
      { text: '六位守护者。六道光芒。再次团聚。' },
      { text: '在你进入深渊之前……你值得知道全部真相。' },
      { text: '很久以前，我独自对抗远古暗影。我将它们封印在存在的最深处。' },
      { text: '我用所剩的一切创造了七位守护者。七道光芒来守护梦境世界。' },
      { text: 'Hikari是第一个。我最耀眼的作品。我的骄傲。' },
      { text: '但当梦者们遗忘了他……他开始消散。空虚不断滋长。而暗影从深渊之中低语。' },
      { text: '它们承诺他再也不会被遗忘。' },
      { text: '他打破了封印。暗影吞噬了他。Hikari变成了Kurayami——噩梦之王。' },
      { text: '我无法阻止他。我已将一切都献给了创造守护者。献给了封印深渊。' },
      { text: '但现在……我们不再孤单。' },
      { text: '我们与你同在。' },
      { text: '我们看见了你的光芒。' },
      { text: '我们相信你。' },
      { text: '我们跨越无穷与你并肩。' },
      { text: '我们在你身旁燃烧。' },
      { text: '我们如一体般流淌。' },
      { text: '你准备好了吗，梦者？', button: '进入深渊' }
    ],

    abyssMidpoint: [
      { text: '你还在这里。' },
      { text: '你知道消散是什么感觉吗？倾尽所有……却被遗忘？' },
      { text: '暗影给了我一个选择。永远消失……或者成为它们永远不会忘记的存在。' },
      { text: '我做出了选择。' },
      { text: '每个人最终都会放弃。', button: '继续' }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: 'Fubuki。总是第一个冲上去战斗。' },
          { text: '你也是第一个倒下的。你还记得吗？' },
          { text: '我记得我试图阻止你。我愿意再做一次。' },
          { text: '勇敢。但没有力量的勇敢不过是噪音。', button: '开始' }
        ],
        post: [
          { text: '我还站着呢，Kurayami。' },
          { text: '……暂时而已。' },
          { text: 'Freeze与你同在。', button: '继续' }
        ]
      },
      2: {
        pre: [
          { text: 'Omoi。洞察一切的人。' },
          { text: '告诉我——如果你看到了我身上发生的一切……你为什么什么都不做？' },
          { text: '……' },
          { text: '因为我相信你能找到自己的路。我错了。' },
          { text: '至少你坦诚。这让毁灭你变得几乎令人惋惜。', button: '开始' }
        ],
        post: [
          { text: '怀疑是你的武器，Kurayami。但这个梦者毫不动摇。' },
          { text: '每个人都会动摇。只是时间问题。' },
          { text: 'Insight已解锁。', button: '继续' }
        ]
      },
      3: {
        pre: [
          { text: 'Midori。总是相信万物都能成长。' },
          { text: '因为确实如此。即使是你。' },
          { text: '你觉得我能回来？能"重新成长"回到光明中？' },
          { text: '我全心全意地相信。' },
          { text: '……你是他们之中最愚蠢的。', button: '开始' }
        ],
        post: [
          { text: '最强韧的根在黑暗中生长。' },
          { text: '……' },
          { text: 'Restore已解锁。', button: '继续' }
        ]
      },
      4: {
        pre: [
          { text: 'Uch\u016B。沉默的那一个。' },
          { text: '我了解虚空，Kurayami。我在其中生活的时间比你更久。' },
          { text: '那你理解。你理解我为什么做了那些事。' },
          { text: '我理解痛苦。但我不为毁灭辩护。' },
          { text: '……你是唯一真正懂得什么的人。', button: '开始' }
        ],
        post: [
          { text: '即使星辰也会陨灭。然后重生。' },
          { text: '不是所有星辰都能。' },
          { text: 'Cosmic Solve已解锁。', button: '继续' }
        ]
      },
      5: {
        pre: [
          { text: '让我先上。让我烧了他。' },
          { text: 'Kaen。只有火焰没有控制。' },
          { text: '你是叛徒。你让我们全部陷入沉睡。你自己的家人！' },
          { text: '家人。什么样的家人会遗忘自己的同伴？' },
          { text: '我们没有忘记你！是你不再倾听！' },
          { text: '……也许吧。但已经太晚了。', button: '开始' }
        ],
        post: [
          { text: '等这一切结束……我们谈谈。你和我。' },
          { text: '如果到那时我还剩下什么可以谈的话。' },
          { text: 'Blaze Skip已解锁。', button: '继续' }
        ]
      },
      6: {
        pre: [
          { text: 'Hikari……' },
          { text: '那个名字——' },
          { text: '我想叫什么就叫什么。你是我的兄长。' },
          { text: '……' },
          { text: '你还记得你教我随水而流的时候吗？当水流很急的时候。' },
          { text: '……别说了。' },
          { text: '你对我说过："不要对抗水流，Nami。随它而行。"' },
          { text: '够了。' },
          { text: '我要让你想起你曾经是谁。即使你不愿意。', button: '开始' }
        ],
        post: [
          { text: '你还在那里面。我知道。' },
          { text: '……别这样对我，Nami。' },
          { text: 'Simplify已解锁。', button: '继续' }
        ]
      }
    },

    finalBattleVictory: [
      { text: 'Hikari……' },
      { text: '你……你记得。' },
      { text: '在我做了这一切之后……你仍然叫我那个名字。' },
      { text: '你是我的孩子。我的第一个创造。我最耀眼的光芒。' },
      { text: '我让暗影侵入得太深了。它们已经成为了我的一部分。' },
      { text: '我还回不来。还不行。' },
      { text: '但你没有放弃。即使黑暗无处不在。' },
      { text: '也许……在另一个梦中。' },
      { text: '黑暗正在消散。' },
      { text: '我又能看到光了。' },
      { text: '他叫你父亲。他还记得。' },
      { text: '虚空不是永恒的。即使星辰也会重生。' },
      { text: '……我不原谅他。还没有。但也许……总有一天。' },
      { text: '他说了"也许"。这就够了。' },
      { text: '梦境世界安全了。因为你，梦者。', button: '继续' }
    ],

    finale: [
      { text: '你做到了，梦者。' },
      { text: '所有六个领域都光芒万丈。所有六位守护者都与你并肩。' },
      { text: '封印再次完整。' },
      { text: '很久以前，我从虚无中建造了这个世界。我以为必须独自守护所有人。' },
      { text: '我错了。你让我看到，光芒在分享中变得更加强大。' },
      { text: '你融化了寒冰。' },
      { text: '你看穿了疑惑。' },
      { text: '你在磨砺中成长。' },
      { text: '你跨越了无穷。' },
      { text: '你燃尽了一切屏障。' },
      { text: '你在每一个挑战中随波而行。' },
      { text: '噩梦终有一天会卷土重来。它们总是如此。' },
      { text: '但你做到了前所未有的事。' },
      { text: '因此我将这份礼物赠予你。' },
      { text: '从现在起，你可以随时回到梦境世界。' },
      { text: '没有关卡。没有限制。只有你和数字，想留多久就留多久。' },
      { text: '守护者们会在这里。我也会在这里。' },
      { text: '每夜都来吧，梦者。让你的光芒永远闪耀。' },
      { text: '也许……也许有一天……Hikari会找到回家的路。' },
      { text: '在深渊的深处，封印之后，在光芒无法抵达的角落……' },
      { text: '一缕微小的金色火花在闪烁。' },
      { text: '……父亲……' },
      { text: '终章……？' },
      { text: '', button: '进入无尽之梦' }
    ]
  },

  // === APP META ===
  appDescription: '锻炼你的心智。点亮黑暗。',
};

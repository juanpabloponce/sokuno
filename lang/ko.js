// lang/ko.js — Korean

var LANG_KO = {

  // === UI STRINGS ===
  ui: {
    tap: '탭',
    enterDreamWorld: '꿈의 세계로 들어가기',
    storyMode: '스토리 모드',
    theEndlessDream: '끝없는 꿈',
    completeStoryToUnlock: '스토리 모드를 완료하면 잠금 해제',
    readTheLore: '이야기 읽기',
    mixtape: '믹스테이프',
    settings: '설정',
      language: '언어',
    tagline: '멀티 감각 두뇌 트레이너 — 몰입 상태를 위해 설계됨',
    headphonesOn: '\uD83C\uDFA7 헤드폰을 쓰세요. 세상을 잊으세요.',
    back: '\u2190 뒤로',
    chapters: '\u2190 챕터',
    prev: '\u25C2 이전',
    next: '다음 \u25B8',
    continue_: '계속하기',
    begin: '시작',
    skip: '건너뛰기 \u25B8\u25B8',
    loreTitle: '이야기',
    loreSubtitle: '꿈의 세계 이야기',
    mixtapeTitle: '믹스테이프',
    mixtapeSubtitle: '꿈의 세계의 노래',
    dreamWorldTitle: '꿈의 세계',
    chooseARealm: '영역을 선택하세요',
    chooseYourCompanion: '동료를 선택하세요',
    oneGuardianStory: '한 수호자가 이 영역에서 당신과 함께합니다',
    newChapterUnlocked: '새 챕터 잠금 해제',
    addedToLore: '이야기에 추가됨',
    stageClear: '스테이지 클리어!',
    defeated: '패배',
    errorsCount: '오류: {0}',
    problemsSolved: '해결한 문제: {0}',
    nextStage: '다음 스테이지',
    worldMap: '월드 맵',
    retry: '재도전',
    defeatMessage: '악몽이 당신을 깨웠습니다... 꿈의 세계에서 떠났습니다.',
    dreamOver: '꿈이 끝났습니다',
    bestChain: '최고 연속',
    totalCorrect: '총 정답 수',
    highestTier: '최고 단계',
    newBest: '신기록!',
    dreamAgain: '다시 꿈꾸기',
    wakeUp: '깨어나기',
    allGuardians: '모든 수호자',
    companion: '동료: {0}',
    noCompanion: '동료 없음',
    resonance: '공명',
    personalRecords: '개인 기록',
    pureBestChain: '퓨어 — 최고 연속:',
    pureTotal: '합계:',
    guardianBestChain: '수호자 — 최고 연속:',
    guardianTotal: '합계:',
    yourName: '이름을 입력하세요...',
    thatsMyName: "이것이 내 이름입니다",
    failedToLoadWorlds: '월드를 불러오지 못했습니다. 페이지를 새로고침해 주세요.',
    realm: '{0} 영역',
    stage: '{0} — 스테이지 {1}',
    stop: '중지',
    changeLanguage: '언어 변경',
    selectLanguage: '언어 선택',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: '끝없는 꿈',
    selectSubtitle: '오늘 밤은 어떤 꿈을 꾸고 싶으신가요?',
    yumemoriQuote: '\u201C하나의 답이 다음 도전이 됩니다. 연쇄는 멈추지 않아요... 얼마나 오래 꿈을 이어갈 수 있을까요?\u201D',
    dreamAlone: '혼자 꿈꾸기',
    dreamAloneDesc: '순수한 수학. 능력 없이. 오직 당신만.',
    bringAGuardian: '수호자와 함께',
    bringAGuardianDesc: '동료를 선택하세요. 15번 정답마다 능력이 충전됩니다.',
    guardianPickerTitle: '동료를 선택하세요',
    guardianPickerSubtitle: '한 수호자가 끝없는 꿈에서 당신과 함께합니다',
    gameLabel: '\u2726 끝없는 꿈',
  },

  // === TIER NAMES ===
  tiers: {
    1: '워밍업',
    2: '빌드업',
    3: '몰입',
    4: '깊은 꿈',
    5: '무한',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: '모든 꿈은 작게 시작됩니다. 당신은 더 강해질 거예요.',
    2: '모든 꿈은 작게 시작됩니다. 당신은 더 강해질 거예요.',
    3: '당신의 빛은 당신이 아는 것보다 더 멀리 닿고 있습니다.',
    4: '꿈의 세계는 당신이 있어 더 밝게 빛납니다.',
    5: '당신이 바로 Sokun\u014D. 빛나는 두뇌. 악몽들이 당신을 두려워합니다.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: '당신은 잠들어 있습니다...',
    line2: '좋아요. 이제 이야기할 수 있습니다.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: '얼음', guardianMeaning: '눈보라', description: '영원한 겨울에 갇힌 얼어붙은 영역. 얼음의 수호자 Fubuki가 빙하 아래에서 잠들어 있습니다 — 깨어나기를 기다리며.' },
    2: { name: '초능력', guardianMeaning: '생각', description: '변화하는 생각과 환상의 영역. 초능력의 수호자 Omoi가 마음의 미로 속에서 길을 잃었습니다.' },
    3: { name: '정글', guardianMeaning: '초록', description: '악몽에 뒤덮인 고대의 정글. 자연의 수호자 Midori가 야생에 삼켜졌습니다.' },
    4: { name: '우주', guardianMeaning: '우주', description: '별들 사이의 광활한 공허, 침묵이 지배하는 곳. 우주의 수호자 Uch\u016B가 무한한 어둠 속을 떠돌고 있습니다.' },
    5: { name: '화산', guardianMeaning: '화염', description: '용암의 분노로 타오르는 땅. 불의 수호자 Kaen이 화산의 심장부에서 불타고 있습니다.' },
    6: { name: '바다', guardianMeaning: '파도', description: '폭풍에 삼켜진 끝없는 바다. 바다의 수호자 Nami가 짓누르는 깊은 곳에 갇혀 있습니다.' },
    7: { name: '심연', guardianMeaning: '어둠', description: '모든 악몽의 근원. Kurayami가 바닥에서 기다리고 있습니다 — 마지막 꿈, 그리고 마지막 진실.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: '5초 동안 바 소모를 멈춥니다' },
    insight:     { name: 'Insight',      desc: '정답의 앞부분을 보여줍니다' },
    restore:     { name: 'Restore',      desc: '수면 바를 20% 회복합니다' },
    cosmicSolve: { name: 'Cosmic Solve', desc: '현재 문제를 자동으로 풀어줍니다' },
    blazeSkip:   { name: 'Blaze Skip',   desc: '패널티 없이 문제를 건너뜁니다' },
    simplify:    { name: 'Simplify',     desc: '문제를 더 쉬운 숫자로 줄여줍니다' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori가 당신 곁에서 싸웁니다 — 5개의 문제를 자동으로 풀어줍니다' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  '빛 이전에',
    2:  '처음 쓰러진 자',
    3:  '앎의 무게',
    4:  '어두운 흙 속의 씨앗',
    5:  '별과 별 사이의 공간',
    6:  '내면에 타오르는 것',
    7:  '수면 위의 햇빛',
    8:  '여섯 개의 빛, 하나의 어둠',
    9:  '내가 빛나지 못한다면',
    10: '작은 황금빛 불꽃',
    chapterStoryNotWritten: "이 챕터의 이야기는 아직 쓰이지 않았습니다...",
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: '인트로',
    2: '월드 1 — 얼음',
    3: '월드 2 — 초능력',
    4: '월드 3 — 정글',
    5: '월드 4 — 우주',
    6: '월드 5 — 화산',
    7: '월드 6 — 바다',
    8: '월드 7 — 심연',
    9: '끝없는 꿈',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...아버지... 멈추세요. 그럴 힘이 없잖아요.',
    iHaveEnough: '충분합니다. 내가 사랑하는 이를 지키기에는.',
    alwaysGiving: '항상 다른 이들을 위해 모든 것을 주었죠. 자신을 위해 남겨둔 건 없으면서.',
    oneMoreTime: '한 번만 더. 단 한 번만 더.',
    sixGuardians: '여섯 수호자. 한 명의 꿈꾸는 자. 한 명의 지친 노인.',
    isThisAll: '이게 전부인가?',
    iWasTheBest: '나는 최고였다. 그런데 그들은 나를 잊었다.',
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
    freeze: 'Freeze가 함께합니다.',
    insight: 'Insight가 해금되었습니다.',
    restore: 'Restore가 해금되었습니다.',
    cosmicSolve: 'Cosmic Solve가 해금되었습니다.',
    blazeSkip: 'Blaze Skip이 해금되었습니다.',
    simplify: 'Simplify가 해금되었습니다.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "내 말을 들어. 시간이 많지 않아." },
      { text: "악몽들이 꿈의 세계를 공격했어. 수호자들은 잠들어 있고. 모든 것이 어둠에 잠기고 있어." },
      { text: "네 마음은 밝아. 넌 우리의 유일한 희망이야." },
      { text: "정답 하나하나가 빛을 가져와. 하지만 실수 하나하나가 어둠을 불러들여." },
      { text: "준비됐어?", button: "준비됐어요" }
    ],

    worldIntros: {
      1: [
        { text: "얼음의 영역. Fubuki가 얼어붙은 호수 아래에서 잠들어 있어." },
        { text: "오직 네 빛만이 그녀에게 닿을 수 있어." },
        { text: "하지만 조심해. 악몽들이 너를 깨우려 할 거야. 바가 보일 거야 — 그게 네 수면이야. 어둠이 다가올수록 줄어들어." },
        { text: "정답을 맞힐 때마다 악몽이 물러나고 수면 바가 채워져. 틀릴 때마다 악몽이 더 가까이 다가와." },
        { text: "바를 완전히 채우면 스테이지를 클리어해. 0이 되면... 깨어나게 돼.", button: "알겠습니다" }
      ],
      2: [
        { text: "초능력의 영역. Omoi는 다른 이들이 볼 수 없는 것을 봐." },
        { text: "숫자가 더 커질 거야. 하지만 네 마음은 준비돼 있어.", button: "시작" }
      ],
      3: [
        { text: "정글의 영역. 여기서 곱셈을 배우게 될 거야." },
        { text: "숲처럼 숫자도 자라날 거야. 과정을 믿어.", button: "시작" }
      ],
      4: [
        { text: "우주. Uch\u016B가 무한 너머를 지켜보고 있어." },
        { text: "여기서 나눗셈을 배우게 될 거야. 큰 것을 작은 것으로 나누는 법을.", button: "시작" }
      ],
      5: [
        { text: "화산. Kaen은 열기 속에서 살아 숨 쉬어." },
        { text: "곱셈과 나눗셈이 결합돼. 도전은 더욱 거세질 거야.", button: "시작" }
      ],
      6: [
        { text: "바다. 심연에 들어가기 전 마지막 시험이야." },
        { text: "지금까지 배운 모든 것이 여기서 하나가 돼.", button: "시작" }
      ],
      7: [
        { text: "여기가 심연이야." },
        { text: "강하게. 밝게. 우리 모두가 너와 함께야.", button: "시작" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki가 거의 깨어나고 있어. 하지만 악몽들이 거세게 저항하고 있어." },
        { text: "집중해. 넌 할 수 있어.", button: "Fubuki를 깨우다" }
      ],
      2: [
        { text: "Omoi가 안개 속에서 움직이고 있어. 마지막 한 번만 더." },
        { text: "악몽들이 더 강하게 싸울 거야. 하지만 너도 마찬가지야.", button: "Omoi를 깨우다" }
      ],
      3: [
        { text: "정글이 떨리고 있어. Midori가 곧 깨어나." },
        { text: "악몽들에게 성장의 힘을 보여줘.", button: "Midori를 깨우다" }
      ],
      4: [
        { text: "별들이 정렬하고 있어. Uch\u016B가 공허 너머로 손을 뻗고 있어." },
        { text: "별들 사이에서의 마지막 도전.", button: "Uch\u016B를 깨우다" }
      ],
      5: [
        { text: "화산이 울리고 있어. Kaen의 불이 터져 나오려 하고 있어." },
        { text: "네 마음을 밝게 불태워.", button: "Kaen을 깨우다" }
      ],
      6: [
        { text: "바다가 움직이기 시작해. 마지막 수호자가 기다리고 있어." },
        { text: "네가 배운 모든 것이 이 순간으로 이끌었어.", button: "Nami를 깨우다" }
      ],
      7: [
        { text: "그래. 여기까지 왔구나." },
        { text: "Yumemori. 정말로 이 꿈꾸는 자가 네가 못한 걸 해낼 수 있다고 생각하나?" },
        { text: "나는 한때 그림자를 봉인했다." },
        { text: "그리고 내가 그 봉인을 풀었지." },
        { text: "넌 어둠이 그토록 크게 부를 거라고 말해주지 않았어. 잊혀지는 것이 그토록 아플 거라고도 말해주지 않았어." },
        { text: "넌 그저 내가 빛나길 바랐어. 영원히. 도움 없이." },
        { text: "내가 빛이 될 수 없다면... 아무도 빛나지 못할 것이다.", button: "Kurayami에 맞서다" }
      ]
    },

    awakenings: {
      1: [
        { text: "나... 깨어났어." },
        { text: "고마워, 꿈꾸는 자여. 악몽들이 오랫동안 나를 얼려놨었어." },
        { text: "그가 우리에게 왔을 때 막으려 했어, 알지." },
        { text: "충분히 강하지 못했어." },
        { text: "하지만 이제 널 도울게. 어둠이 너무 강하게 느껴지면 나를 불러." },
        { text: "새로운 능력 해금: Freeze — 5초 동안 바 소모를 멈춥니다" },
        { text: "다섯 영역이 남아있어.", button: "계속하기" }
      ],
      2: [
        { text: "다시 볼 수 있어." },
        { text: "무언가 잘못되었다는 걸 알고 있었어. 그것이 일어나는 걸 봤어." },
        { text: "우리 중 하나가... 변했어. 어둠이 그의 안에서 자랐어. 그런데 나는 아무 말도 하지 않았어." },
        { text: "혼자서 돌아올 거라 생각했거든." },
        { text: "내가 틀렸어." },
        { text: "내 선물: Insight. 문제가 너무 어려울 때 내가 길을 보여줄게." },
        { text: "새로운 능력 해금: Insight — 정답의 앞부분을 보여줍니다" },
        { text: "두 수호자가 네 곁에 서 있어.", button: "계속하기" }
      ],
      3: [
        { text: "생명이 돌아온다." },
        { text: "그에 대해 가장 기억나는 게 뭔지 알아?" },
        { text: "예전에 나와 함께 씨앗을 심었어. 그가 빛을 비추면 아주 빠르게 자랐지." },
        { text: "그는 따뜻했어. 다정했어. 빛으로 가득 찬 사람이었어." },
        { text: "그 모습이 아직 어딘가에 있어. 깊이 묻힌 씨앗처럼." },
        { text: "내 선물: Restore. 네 빛이 사그라들 때 다시 피어나게 도와줄게." },
        { text: "새로운 능력 해금: Restore — 수면 바를 20% 회복합니다" },
        { text: "세 수호자가 깨어났어.", button: "계속하기" }
      ],
      4: [
        { text: "별들이 기억하고 있어." },
        { text: "다른 이들은 그에게 화가 나거나. 슬퍼하거나. 죄책감을 느끼고 있어." },
        { text: "나는 그 어느 것도 아니야." },
        { text: "나는 공허를 이해해. 충분히 오래 공허에 둘러싸여 있으면... 속삭임이 들리기 시작하거든." },
        { text: "그는 그 속삭임을 들었어. 그리고 그것을 무시할 만큼 강하지 못했어." },
        { text: "그것이 그를 악하게 만드는 건 아니야. 길을 잃은 것일 뿐." },
        { text: "내 선물: Cosmic Solve. 짐이 너무 무거울 때 하나의 문제를 내가 대신 풀어줄게." },
        { text: "새로운 능력 해금: Cosmic Solve — 하나의 문제를 자동으로 풀어줍니다" },
        { text: "네 수호자가 빛나고 있어.", button: "계속하기" }
      ],
      5: [
        { text: "드디어!" },
        { text: "누가 우리에게 이런 짓을 했는지 알고 싶어? 그의 이름은 Hikari야." },
        { text: "우리의 지도자가 될 운명이었어. 우리 중 가장 밝은 빛이었지." },
        { text: "하지만 잊혀지는 걸 감당할 수 없었어. 그래서 심연을 열었어. 그림자를 풀어놨어. 우리 모두를 잠재웠어." },
        { text: "우리 모두 잊혀지는 걸 느꼈어. 우리 모두 약해지는 걸 느꼈어. 하지만 우리는 가족을 배신하지 않았어." },
        { text: "내 선물: Blaze Skip. 싸울 가치가 없는 문제도 있어. 건너뛰고. 나아가고. 이겨." },
        { text: "새로운 능력 해금: Blaze Skip — 패널티 없이 문제를 건너뜁니다" },
        { text: "다섯 수호자가 타오른다. 하나가 남았어.", button: "계속하기" }
      ],
      6: [
        { text: "평온." },
        { text: "나는 가장 어린 수호자야. Hikari가 나를 돌봐줬었어." },
        { text: "흐르는 법을 가르쳐줬어. 물결이 거세질 때 침착하게 있는 법을." },
        { text: "그는 우리 중 처음이었어. 가장 밝았어. Yumemori가 가장 순수한 빛으로 그를 만들었어." },
        { text: "다른 이들은 그를 구하거나 막는 것에 대해 이야기해." },
        { text: "나는 그냥 다시 보고 싶어. 진짜 그를." },
        { text: "내 선물: Simplify. 물결이 너무 거세질 때 내가 잔잔하게 만들어줄게." },
        { text: "새로운 능력 해금: Simplify — 문제를 더 쉬운 숫자로 줄여줍니다" }
      ]
    },

    gathering: [
      { text: "여섯 수호자. 여섯 개의 빛. 다시 함께." },
      { text: "심연에 들어가기 전에... 넌 모든 진실을 알 자격이 있어." },
      { text: "오래전, 나는 혼자서 고대의 그림자와 싸웠어. 존재의 가장 깊은 곳에 그것들을 봉인했지." },
      { text: "남은 힘을 다해 일곱 수호자를 만들었어. 꿈의 세계를 지킬 일곱 개의 빛을." },
      { text: "Hikari가 첫 번째였어. 가장 밝은 빛. 내 자부심." },
      { text: "하지만 꿈꾸는 자들이 그를 잊었을 때... 그는 희미해지기 시작했어. 공허가 자랐어. 그리고 그림자들이 심연 속에서 속삭였어." },
      { text: "그들은 그에게 다시는 잊히지 않을 거라고 약속했어." },
      { text: "그는 봉인을 깨뜨렸어. 그림자가 그를 삼켰어. Hikari는 Kurayami가 되었어 — 악몽의 왕." },
      { text: "나는 그를 막을 수 없었어. 수호자를 만들고 심연을 봉인하는 데 모든 것을 다 주었으니까." },
      { text: "하지만 이제... 우리는 혼자가 아니야." },
      { text: "우리가 함께할게." },
      { text: "네 빛이 보여." },
      { text: "널 믿어." },
      { text: "무한 너머에서 네 곁에 서 있어." },
      { text: "네 옆에서 불타고 있어." },
      { text: "하나가 되어 흐를게." },
      { text: "준비됐어, 꿈꾸는 자여?", button: "심연으로 들어가다" }
    ],

    abyssMidpoint: [
      { text: "아직 여기 있구나." },
      { text: "사라진다는 게 어떤 느낌인지 알아? 모든 것을 바치고도... 잊히는 것이?" },
      { text: "그림자들이 나에게 선택을 줬어. 영원히 사라지거나... 절대 잊히지 않을 존재가 되거나." },
      { text: "나는 선택했어." },
      { text: "결국 모두가 포기하지.", button: "계속하기" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. 항상 먼저 싸우는 아이." },
          { text: "네가 가장 먼저 쓰러지기도 했지. 기억나?" },
          { text: "널 막으려 했던 거 기억해. 그리고 다시 해도 그럴 거야." },
          { text: "용감해. 하지만 힘 없는 용기는 그저 소음일 뿐이야.", button: "시작" }
        ],
        post: [
          { text: "아직 서 있어, Kurayami." },
          { text: "...지금은." },
          { text: "Freeze가 함께합니다.", button: "계속하기" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. 모든 것을 보는 자." },
          { text: "말해봐 — 내게 무슨 일이 일어나는지 봤다면서... 왜 아무것도 안 한 거야?" },
          { text: "..." },
          { text: "네가 스스로 길을 찾을 거라 믿었으니까. 내가 틀렸어." },
          { text: "적어도 솔직하구나. 덕분에 널 부수는 게 거의 슬퍼질 지경이야.", button: "시작" }
        ],
        post: [
          { text: "의심이 네 무기지, Kurayami. 하지만 이 꿈꾸는 자는 의심하지 않아." },
          { text: "모두가 의심해. 시간문제일 뿐이야." },
          { text: "Insight가 해금되었습니다.", button: "계속하기" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. 항상 모든 것이 자랄 수 있다고 믿는 아이." },
          { text: "왜냐면 자랄 수 있으니까. 너도." },
          { text: "내가 돌아올 수 있다고 생각해? 빛으로 다시 '자라날' 수 있다고?" },
          { text: "온 마음을 다해 믿어." },
          { text: "...너야말로 그중 가장 어리석구나.", button: "시작" }
        ],
        post: [
          { text: "가장 강한 뿌리는 어둠 속에서 자라나." },
          { text: "..." },
          { text: "Restore가 해금되었습니다.", button: "계속하기" }
        ]
      },
      4: {
        pre: [
          { text: "Uch\u016B. 침묵하는 자." },
          { text: "나는 공허를 알아, Kurayami. 너보다 오래 그 안에서 살았어." },
          { text: "그렇다면 이해하겠지. 내가 왜 그렇게 했는지." },
          { text: "고통은 이해해. 파괴는 정당화하지 않아." },
          { text: "...넌 유일하게 뭐라도 이해하는 존재야.", button: "시작" }
        ],
        post: [
          { text: "별도 죽어. 그리고 다시 태어나지." },
          { text: "전부 다는 아니야." },
          { text: "Cosmic Solve가 해금되었습니다.", button: "계속하기" }
        ]
      },
      5: {
        pre: [
          { text: "내가 먼저 갈게. 내가 그를 태워버릴게." },
          { text: "Kaen. 불만 있고 자제력은 없구나." },
          { text: "넌 배신자야. 우리를 잠재웠어. 네 가족을!" },
          { text: "가족. 자기 식구를 잊는 게 무슨 가족이야?" },
          { text: "우리는 널 잊지 않았어! 네가 귀를 닫은 거야!" },
          { text: "...어쩌면. 하지만 이미 너무 늦었어.", button: "시작" }
        ],
        post: [
          { text: "이게 끝나면... 이야기하자. 너와 나." },
          { text: "이야기할 내가 남아있다면 말이지." },
          { text: "Blaze Skip이 해금되었습니다.", button: "계속하기" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "그 이름은—" },
          { text: "내가 부르고 싶은 대로 부를 거야. 넌 내 오빠니까." },
          { text: "..." },
          { text: "물살이 거셌을 때 흐르는 법을 가르쳐줬던 거 기억나?" },
          { text: "...조용히 해." },
          { text: "이렇게 말했잖아: '물에 맞서지 마, Nami. 함께 흘러가.'" },
          { text: "그만해." },
          { text: "네가 누구였는지 기억나게 해줄 거야. 네가 원하지 않더라도.", button: "시작" }
        ],
        post: [
          { text: "넌 아직 거기 있어. 나는 알아." },
          { text: "...이러지 마, Nami." },
          { text: "Simplify가 해금되었습니다.", button: "계속하기" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "너... 기억하고 있었구나." },
      { text: "내가 한 모든 일 이후에도... 아직 그 이름으로 부르다니." },
      { text: "넌 내 아들이야. 내 첫 번째 창조물. 내 가장 밝은 빛." },
      { text: "그림자를 너무 깊이 들여보냈어. 이제 그것들이 내 일부가 되어버렸어." },
      { text: "아직은 돌아갈 수 없어." },
      { text: "하지만 넌 포기하지 않았어. 어둠이 사방에 가득했는데도." },
      { text: "어쩌면... 다른 꿈에서." },
      { text: "어둠이 걷히고 있어." },
      { text: "다시 빛이 보여." },
      { text: "그가 아버지라고 불렀어. 아직 기억하고 있어." },
      { text: "공허는 영원하지 않아. 별도 다시 태어나니까." },
      { text: "...아직 용서하지 않아. 아직은. 하지만 어쩌면... 언젠가." },
      { text: "'어쩌면'이라고 했어. 지금은 그것으로 충분해." },
      { text: "꿈의 세계가 안전해. 네 덕분이야, 꿈꾸는 자여.", button: "계속하기" }
    ],

    finale: [
      { text: "해냈어, 꿈꾸는 자여." },
      { text: "여섯 영역 모두가 밝게 빛나. 여섯 수호자 모두가 네 곁에 서 있어." },
      { text: "그리고 봉인이 다시 온전해졌어." },
      { text: "오래전, 나는 무에서 이 세계를 만들었어. 모든 이를 혼자서 지켜야 한다고 생각했어." },
      { text: "틀렸어. 넌 빛은 나눌 때 더 강해진다는 걸 보여줬어." },
      { text: "추위를 녹여냈어." },
      { text: "의심을 꿰뚫어 봤어." },
      { text: "고난 속에서 성장했어." },
      { text: "무한 너머로 손을 뻗었어." },
      { text: "장벽을 불태워 넘겼어." },
      { text: "모든 도전을 흘러넘겼어." },
      { text: "악몽은 언젠가 돌아올 거야. 항상 그래왔으니까." },
      { text: "하지만 넌 어떤 꿈꾸는 자도 해내지 못한 일을 해냈어." },
      { text: "그래서 이 선물을 줄게." },
      { text: "이제부터 네가 원할 때면 언제든 꿈의 세계로 돌아올 수 있어." },
      { text: "스테이지도 없어. 제한도 없어. 오직 너와 숫자, 머물고 싶은 만큼." },
      { text: "수호자들이 여기 있을 거야. 나도 여기 있을 거야." },
      { text: "매일 밤 돌아와, 꿈꾸는 자여. 네 빛을 밝게 유지해." },
      { text: "그리고 어쩌면... 어쩌면 언젠가... Hikari가 집으로 돌아올지도 몰라." },
      { text: "심연 깊은 곳, 봉인 너머, 빛이 닿지 않는 구석에서..." },
      { text: "작은 황금빛 불꽃이 깜빡인다." },
      { text: "...아버지..." },
      { text: "끝... 인가?" },
      { text: "", button: "끝없는 꿈으로 들어가다" }
    ]
  },

  // === APP META ===
  appDescription: '마음을 단련하세요. 어둠을 밝히세요.',
};

// lang/tr.js — Turkish

var LANG_TR = {

  // === UI STRINGS ===
  ui: {
    tap: 'Dokun',
    enterDreamWorld: 'R\u00FCya D\u00FCnyas\u0131na Gir',
    storyMode: 'Hikaye Modu',
    theEndlessDream: 'Sonsuz R\u00FCya',
    completeStoryToUnlock: 'A\u00E7mak i\u00E7in Hikaye Modunu tamamla',
    readTheLore: 'Tarihi Oku',
    mixtape: 'Kar\u0131\u015F\u0131k Kaset',
    settings: 'Ayarlar',
      language: 'Dil',
    tagline: '\u00C7ok duyulu beyin antreman\u0131 \u2014 ak\u0131\u015F hali i\u00E7in tasarland\u0131',
    headphonesOn: '\uD83C\uDFA7 Kulakl\u0131klar\u0131 tak. D\u00FCnyay\u0131 kapat.',
    back: '\u2190 Geri',
    chapters: '\u2190 B\u00F6l\u00FCmler',
    prev: '\u25C2 \u00D6nceki',
    next: 'Sonraki \u25B8',
    continue_: 'Devam Et',
    begin: 'Ba\u015Fla',
    skip: 'Atla \u25B8\u25B8',
    loreTitle: 'Tarih',
    loreSubtitle: 'R\u00FCya D\u00FCnyas\u0131n\u0131n Hikayesi',
    mixtapeTitle: 'Kar\u0131\u015F\u0131k Kaset',
    mixtapeSubtitle: 'R\u00FCya D\u00FCnyas\u0131n\u0131n \u015Eark\u0131lar\u0131',
    dreamWorldTitle: 'R\u00FCya D\u00FCnyas\u0131',
    chooseARealm: 'Bir diyar se\u00E7',
    chooseYourCompanion: 'Yolda\u015F\u0131n\u0131 Se\u00E7',
    oneGuardianStory: 'Bu diyarda sana bir koruyucu e\u015Flik edecek',
    newChapterUnlocked: 'Yeni B\u00F6l\u00FCm A\u00E7\u0131ld\u0131',
    addedToLore: 'Tarihe eklendi',
    stageClear: 'A\u015Fama Tamamland\u0131!',
    defeated: 'Yenildin',
    errorsCount: 'Hatalar: {0}',
    problemsSolved: '\u00C7\u00F6z\u00FClen problemler: {0}',
    nextStage: 'Sonraki A\u015Fama',
    worldMap: 'D\u00FCnya Haritas\u0131',
    retry: 'Tekrar Dene',
    defeatMessage: 'Kabuslar seni uyand\u0131rd\u0131... R\u00FCya D\u00FCnyas\u0131ndan ayr\u0131ld\u0131n.',
    dreamOver: 'R\u00FCya Bitti',
    bestChain: 'En \u0130yi Zincir',
    totalCorrect: 'Toplam Do\u011Fru',
    highestTier: 'En Y\u00FCksek Kademe',
    newBest: 'YEN\u0130 REKOR!',
    dreamAgain: 'Tekrar R\u00FCya G\u00F6r',
    wakeUp: 'Uyan',
    allGuardians: 'T\u00FCm Koruyucular',
    companion: 'Yolda\u015F: {0}',
    noCompanion: 'Yolda\u015F yok',
    resonance: 'Rezonans',
    personalRecords: 'Ki\u015Fisel Rekorlar',
    pureBestChain: 'Saf \u2014 En \u0130yi Zincir:',
    pureTotal: 'Toplam:',
    guardianBestChain: 'Koruyucu \u2014 En \u0130yi Zincir:',
    guardianTotal: 'Toplam:',
    yourName: 'Ad\u0131n...',
    thatsMyName: "Bu benim ad\u0131m",
    failedToLoadWorlds: 'D\u00FCnyalar y\u00FCklenemedi. L\u00FCtfen sayfay\u0131 yenileyin.',
    realm: '{0} Diyar\u0131',
    stage: '{0} \u2014 A\u015Fama {1}',
    stop: 'Durdur',
    changeLanguage: 'Dili De\u011Fi\u015Ftir',
    selectLanguage: 'Dil Se\u00E7',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'Sonsuz R\u00FCya',
    selectSubtitle: 'Bu gece nas\u0131l r\u00FCya g\u00F6rmek istersin?',
    yumemoriQuote: '\u201CHer cevap bir sonraki meydan okumaya d\u00F6n\u00FC\u015F\u00FCr. Zincir asla durmaz... r\u00FCyay\u0131 ne kadar s\u00FCrd\u00FCrebilirsin?\u201D',
    dreamAlone: 'Yaln\u0131z R\u00FCya G\u00F6r',
    dreamAloneDesc: 'Saf matematik. G\u00FC\u00E7 yok. Sadece sen.',
    bringAGuardian: 'Bir Koruyucu Getir',
    bringAGuardianDesc: 'Bir yolda\u015F se\u00E7. G\u00FC\u00E7 her 15 do\u011Fruda \u015Farj olur.',
    guardianPickerTitle: 'Yolda\u015F\u0131n\u0131 Se\u00E7',
    guardianPickerSubtitle: 'Sonsuz R\u00FCya\u2019da sana bir koruyucu e\u015Flik edecek',
    gameLabel: '\u2726 Sonsuz R\u00FCya',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Is\u0131nma',
    2: 'Y\u00FCkseliyor',
    3: 'Ak\u0131\u015Fta',
    4: 'Derin R\u00FCya',
    5: 'Sonsuz',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Her r\u00FCya k\u00FC\u00E7\u00FCk ba\u015Flar. G\u00FC\u00E7leneceksin.',
    2: 'Her r\u00FCya k\u00FC\u00E7\u00FCk ba\u015Flar. G\u00FC\u00E7leneceksin.',
    3: '\u0130\u015F\u0131\u011F\u0131n sand\u0131\u011F\u0131ndan \u00E7ok daha \u00F6teye ula\u015F\u0131yor.',
    4: 'Sen i\u00E7indeyken R\u00FCya D\u00FCnyas\u0131 daha parlak parl\u0131yor.',
    5: 'Sen Sokun\u014D\u2019sun. H\u0131zl\u0131 Beyin. Kabuslar senden korkuyor.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'Uyuyorsun...',
    line2: 'g\u00FCzel. \u015Eimdi konu\u015Fabiliriz.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Buz', guardianMeaning: 'Kar F\u0131rt\u0131nas\u0131', description: 'Sonsuz k\u0131\u015Fa hapsedilmi\u015F donmu\u015F bir diyar. Buz koruyucusu Fubuki, buzullar\u0131n alt\u0131nda uyuyor \u2014 uyan\u0131\u015F\u0131n\u0131 bekliyor.' },
    2: { name: 'Psikik', guardianMeaning: 'D\u00FC\u015F\u00FCnce', description: 'De\u011Fi\u015Fen d\u00FC\u015F\u00FCnceler ve yan\u0131lsamalar diyar\u0131. Psikik koruyucu Omoi, zihnin labirentinde kaybolmu\u015F.' },
    3: { name: 'Orman', guardianMeaning: 'Ye\u015Fil', description: 'Kabuslar\u0131n sard\u0131\u011F\u0131 kadim bir orman. Do\u011Fa koruyucusu Midori, vahsi do\u011Fan\u0131n i\u00E7inde yutulmu\u015F.' },
    4: { name: 'Kozmos', guardianMeaning: 'Evren', description: 'Y\u0131ld\u0131zlar aras\u0131ndaki engin bo\u015Fluk, sessizli\u011Fin h\u00FCk\u00FCm s\u00FCrd\u00FC\u011F\u00FC yer. Kozmik koruyucu Uch\u016B, sonsuz karanl\u0131kta s\u00FCr\u00FCkleniyor.' },
    5: { name: 'Yanarda\u011F', guardianMeaning: 'Alev', description: 'Eriyen \u00F6fkeyle kaplanan kavurucu bir diyar. Ate\u015F koruyucusu Kaen, yanarda\u011F\u0131n kalbinde yan\u0131yor.' },
    6: { name: 'Okyanus', guardianMeaning: 'Dalga', description: 'F\u0131rt\u0131nalar\u0131n yuttu\u011Fu sonsuz bir deniz. Okyanus koruyucusu Nami, ezici derinliklerin alt\u0131nda hapsolmu\u015F.' },
    7: { name: 'U\u00E7urum', guardianMeaning: 'Karanl\u0131k', description: 'T\u00FCm Kabuslar\u0131n kayna\u011F\u0131. Kurayami en dipte bekliyor \u2014 son r\u00FCya ve son ger\u00E7ek.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: '\u00C7ubu\u011Fun azalmas\u0131n\u0131 5 saniye durdurur' },
    insight:     { name: 'Insight',      desc: 'Cevab\u0131n ilk yar\u0131s\u0131n\u0131 g\u00F6sterir' },
    restore:     { name: 'Restore',      desc: 'Uyku \u00E7ubu\u011Funun %20\u2019sini geri kazan\u0131r' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Mevcut problemi otomatik \u00E7\u00F6zer' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Problemi cezas\u0131z atlar' },
    simplify:    { name: 'Simplify',     desc: 'Problemi daha kolay say\u0131lara d\u00FC\u015F\u00FCr\u00FCr' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori yan\u0131nda sava\u015F\u0131r \u2014 5 problemi otomatik \u00E7\u00F6zer' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'I\u015F\u0131ktan \u00D6nce',
    2:  'D\u00FC\u015Fen \u0130lk Ki\u015Fi',
    3:  'Bilmenin A\u011F\u0131rl\u0131\u011F\u0131',
    4:  'Karanl\u0131k Toprakta Tohumlar',
    5:  'Y\u0131ld\u0131zlar Aras\u0131ndaki Bo\u015Fluk',
    6:  '\u0130\u00E7inde Yanan \u015Eey',
    7:  'Suyun \u00DCzerinde G\u00FCne\u015F I\u015F\u0131\u011F\u0131',
    8:  'Alt\u0131 I\u015F\u0131k, Bir Karanl\u0131k',
    9:  'E\u011Fer Parlayam\u0131yorsam',
    10: 'K\u00FC\u00E7\u00FCk Bir Alt\u0131n K\u0131v\u0131lc\u0131m',
    chapterStoryNotWritten: "Bu b\u00F6l\u00FCm\u00FCn hikayesi hen\u00FCz yaz\u0131lmad\u0131...",
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Giri\u015F',
    2: 'D\u00FCnya 1 \u2014 Buz',
    3: 'D\u00FCnya 2 \u2014 Psikik',
    4: 'D\u00FCnya 3 \u2014 Orman',
    5: 'D\u00FCnya 4 \u2014 Kozmos',
    6: 'D\u00FCnya 5 \u2014 Yanarda\u011F',
    7: 'D\u00FCnya 6 \u2014 Okyanus',
    8: 'D\u00FCnya 7 \u2014 U\u00E7urum',
    9: 'Sonsuz R\u00FCya',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Baba... dur. Bunun i\u00E7in g\u00FCc\u00FCn yok.',
    iHaveEnough: 'Yeterli g\u00FCc\u00FCm var. Sevdi\u011Fimi korumak i\u00E7in.',
    alwaysGiving: 'Her zaman ba\u015Fkalar\u0131 i\u00E7in her \u015Feyini verdin. Kendine hi\u00E7bir \u015Fey saklamad\u0131n.',
    oneMoreTime: 'Bir kez daha. Sadece bir kez daha.',
    sixGuardians: 'Alt\u0131 koruyucu. Bir r\u00FCyac\u0131. Bir k\u0131r\u0131k ya\u015Fl\u0131 adam.',
    isThisAll: 'Hepsi bu mu?',
    iWasTheBest: 'En iyisiydim. Ve BEN\u0130 UNUTTULAR.',
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
    freeze: 'Freeze seninle.',
    insight: 'Insight a\u00E7\u0131ld\u0131.',
    restore: 'Restore a\u00E7\u0131ld\u0131.',
    cosmicSolve: 'Cosmic Solve a\u00E7\u0131ld\u0131.',
    blazeSkip: 'Blaze Skip a\u00E7\u0131ld\u0131.',
    simplify: 'Simplify a\u00E7\u0131ld\u0131.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "Beni dinle. \u00C7ok zaman\u0131m\u0131z yok." },
      { text: "Kabuslar R\u00FCya D\u00FCnyas\u0131na sald\u0131rd\u0131. Koruyucular uyuyor. Her yer karanl\u0131\u011Fa g\u00F6m\u00FCl\u00FCyor." },
      { text: "Zihnin parlak. Sen bizim tek umudumuzuz." },
      { text: "Her do\u011Fru cevap \u0131\u015F\u0131k getirir. Her hata karanl\u0131\u011F\u0131 i\u00E7eri al\u0131r." },
      { text: "Haz\u0131r m\u0131s\u0131n?", button: "Haz\u0131r\u0131m" }
    ],

    worldIntros: {
      1: [
        { text: "Buz Diyar\u0131. Fubuki donmu\u015F g\u00F6l\u00FCn alt\u0131nda uyuyor." },
        { text: "Ona sadece senin \u0131\u015F\u0131\u011F\u0131n ula\u015Fabilir." },
        { text: "Ama dikkatli ol. Kabuslar seni uyand\u0131rmaya \u00E7al\u0131\u015Facak. Bir \u00E7ubuk g\u00F6receksin \u2014 o senin uykun. Karanl\u0131k yakla\u015Ft\u0131k\u00E7a azal\u0131r." },
        { text: "Her do\u011Fru cevap Kabuslar\u0131 geri iter ve uyku \u00E7ubu\u011Funu doldurur. Her hata onlar\u0131 daha da yakla\u015Ft\u0131r\u0131r." },
        { text: "\u00C7ubu\u011Fu tamamen doldur ve a\u015Fama senin olsun. S\u0131f\u0131ra d\u00FC\u015Fs\u00FCn... ve uyan\u0131rs\u0131n.", button: "Anlad\u0131m" }
      ],
      2: [
        { text: "Psikik Diyar. Omoi ba\u015Fkalar\u0131n\u0131n g\u00F6remediklerini g\u00F6r\u00FCr." },
        { text: "Say\u0131lar b\u00FCy\u00FCyecek. Ama zihnin haz\u0131r.", button: "Ba\u015Fla" }
      ],
      3: [
        { text: "Orman Diyar\u0131. Burada \u00E7arpmay\u0131 \u00F6\u011Freneceksin." },
        { text: "Say\u0131lar b\u00FCy\u00FCyecek, t\u0131pk\u0131 orman gibi. S\u00FCrece g\u00FCven.", button: "Ba\u015Fla" }
      ],
      4: [
        { text: "Kozmos. Uch\u016B sonsuza g\u00F6z kulak olur." },
        { text: "Burada b\u00F6lmeyi \u00F6\u011Freneceksin. B\u00FCy\u00FC\u011F\u00FC k\u00FC\u00E7\u00FClte d\u00F6n\u00FC\u015Ft\u00FCrmek.", button: "Ba\u015Fla" }
      ],
      5: [
        { text: "Yanarda\u011F. Kaen ate\u015Fin i\u00E7inde g\u00FC\u00E7lenir." },
        { text: "\u00C7arpma ve b\u00F6lme birle\u015Fiyor. Meydan okumalar \u015Fiddetli olacak.", button: "Ba\u015Fla" }
      ],
      6: [
        { text: "Okyanus. U\u00E7urum\u2019dan \u00F6nceki son s\u0131nav\u0131n." },
        { text: "\u00D6\u011Frendi\u011Fin her \u015Fey burada birle\u015Fiyor.", button: "Ba\u015Fla" }
      ],
      7: [
        { text: "Buras\u0131 U\u00E7urum." },
        { text: "G\u00FC\u00E7l\u00FC ol. Parlak ol. Hepimiz seninleyiz.", button: "Ba\u015Fla" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki neredeyse uyanacak. Ama Kabuslar sert sava\u015F\u0131yor." },
        { text: "Odaklan. Yapabilirsin.", button: "Fubuki'yi Uyand\u0131r" }
      ],
      2: [
        { text: "Omoi sisin i\u00E7inde k\u0131m\u0131ld\u0131yor. Son bir hamle." },
        { text: "Kabuslar daha sert sava\u015Facak. Ama sen de \u00F6yle.", button: "Omoi'yi Uyand\u0131r" }
      ],
      3: [
        { text: "Orman titre\u015Fiyor. Midori uyanmaya yak\u0131n." },
        { text: "Kabuslara b\u00FCy\u00FCmenin g\u00FCc\u00FCn\u00FC g\u00F6ster.", button: "Midori'yi Uyand\u0131r" }
      ],
      4: [
        { text: "Y\u0131ld\u0131zlar hizalan\u0131yor. Uch\u016B bo\u015Fluktan uzanmaya \u00E7al\u0131\u015F\u0131yor." },
        { text: "Y\u0131ld\u0131zlar aras\u0131nda son bir meydan okuma.", button: "Uch\u016B'yu Uyand\u0131r" }
      ],
      5: [
        { text: "Yanarda\u011F g\u00FCrl\u00FCyor. Kaen\u2019in ate\u015Fi serbest kalmak istiyor." },
        { text: "Zihninin parlak yanmas\u0131na izin ver.", button: "Kaen'i Uyand\u0131r" }
      ],
      6: [
        { text: "Okyanus k\u0131p\u0131rdan\u0131yor. Son koruyucu bekliyor." },
        { text: "\u00D6\u011Frendi\u011Fin her \u015Fey bu ana \u00E7\u0131k\u0131yor.", button: "Nami'yi Uyand\u0131r" }
      ],
      7: [
        { text: "Demek geldin." },
        { text: "Yumemori. Ger\u00E7ekten bu r\u00FCyac\u0131n\u0131n senin yapamad\u0131\u011F\u0131n\u0131 yapabilece\u011Fine mi inan\u0131yorsun?" },
        { text: "G\u00F6lgeleri bir kez m\u00FCh\u00FCrlemi\u015Ftim." },
        { text: "Ve m\u00FChr\u00FC ben k\u0131rd\u0131m." },
        { text: "Karanl\u0131\u011F\u0131n bu kadar y\u00FCksek sesle \u00E7a\u011F\u0131raca\u011F\u0131n\u0131 hi\u00E7 s\u00F6ylemedin. Unutulman\u0131n bu kadar ac\u0131taca\u011F\u0131n\u0131 hi\u00E7 s\u00F6ylemedin." },
        { text: "Sadece parlamam\u0131 bekledin. Sonsuza dek. Yard\u0131ms\u0131z." },
        { text: "E\u011Fer \u0131\u015F\u0131k olam\u0131yorsam... K\u0130MSE OLAMAYACAK.", button: "Kurayami ile Y\u00FCzle\u015F" }
      ]
    },

    awakenings: {
      1: [
        { text: "Ben... uyand\u0131m." },
        { text: "Te\u015Fekk\u00FCrler, r\u00FCyac\u0131. Kabuslar beni \u00E7ok uzun s\u00FCre donmu\u015F tuttular." },
        { text: "Onu durdurmaya \u00E7al\u0131\u015Ft\u0131m, biliyorsun. Bize geldi\u011Finde." },
        { text: "Yeterince g\u00FC\u00E7l\u00FC de\u011Fildim." },
        { text: "Ama \u015Fimdi sana yard\u0131m edece\u011Fim. Karanl\u0131k \u00E7ok g\u00FC\u00E7l\u00FC geldi\u011Finde beni \u00E7a\u011F\u0131r." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Freeze \u2014 \u00C7ubu\u011Fun azalmas\u0131n\u0131 5 saniye durdurur" },
        { text: "Be\u015F diyar kald\u0131.", button: "Devam Et" }
      ],
      2: [
        { text: "Tekrar g\u00F6rebiliyorum." },
        { text: "Bir \u015Feylerin yanl\u0131\u015F oldu\u011Funu biliyordum. Oldu\u011Funu g\u00F6rd\u00FCm." },
        { text: "Bizden biri... de\u011Fi\u015Fti. Karanl\u0131k i\u00E7inde b\u00FCy\u00FCd\u00FC. Ve ben hi\u00E7bir \u015Fey s\u00F6ylemedim." },
        { text: "Kendi ba\u015F\u0131na yolunu bulaca\u011F\u0131n\u0131 d\u00FC\u015F\u00FCnd\u00FCm." },
        { text: "Yan\u0131lm\u0131\u015F\u0131m." },
        { text: "Hediyem: Insight. Bir problem \u00E7ok zor g\u00F6r\u00FCnd\u00FC\u011F\u00FCnde, sana yolu g\u00F6sterece\u011Fim." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Insight \u2014 Cevab\u0131n ilk yar\u0131s\u0131n\u0131 g\u00F6sterir" },
        { text: "\u0130ki koruyucu yan\u0131nda.", button: "Devam Et" }
      ],
      3: [
        { text: "Ya\u015Fam geri d\u00F6n\u00FCyor." },
        { text: "Onu en \u00E7ok neyi hat\u0131rlad\u0131\u011F\u0131m\u0131 biliyor musun?" },
        { text: "Benimle tohum ekerdi. \u00DCzerlerine parlard\u0131 ve \u00E7ok h\u0131zl\u0131 b\u00FCy\u00FCrlerdi." },
        { text: "S\u0131cakkanl\u0131yd\u0131. Nazikti. I\u015F\u0131k doluydu." },
        { text: "Onun o hali hala orada. Bir yerlerde. Derine g\u00F6m\u00FClm\u00FC\u015F bir tohum gibi." },
        { text: "Hediyem: Restore. I\u015F\u0131\u011F\u0131n s\u00F6nd\u00FC\u011F\u00FCnde, tekrar \u00E7i\u00E7ek a\u00E7mas\u0131na yard\u0131m edece\u011Fim." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Restore \u2014 Uyku \u00E7ubu\u011Funun %20\u2019sini geri kazan\u0131r" },
        { text: "\u00DC\u00E7 koruyucu uyand\u0131.", button: "Devam Et" }
      ],
      4: [
        { text: "Y\u0131ld\u0131zlar hat\u0131rl\u0131yor." },
        { text: "Di\u011Ferleri ona k\u0131zg\u0131n. Ya da \u00FCzg\u00FCn. Ya da su\u00E7luluk duyuyor." },
        { text: "Ben bunlar\u0131n hi\u00E7biri de\u011Filim." },
        { text: "Bo\u015Flu\u011Fu anl\u0131yorum. Yeterince uzun s\u00FCre bo\u015Flukla \u00E7evrili oldu\u011Funda... f\u0131s\u0131ldamaya ba\u015Flar." },
        { text: "O f\u0131s\u0131lt\u0131lar\u0131 duydu. Ve onlar\u0131 g\u00F6rmezden gelecek kadar g\u00FC\u00E7l\u00FC de\u011Fildi." },
        { text: "Bu onu k\u00F6t\u00FC yapmaz. Kaybolmu\u015F yapar." },
        { text: "Hediyem: Cosmic Solve. Y\u00FCk \u00E7ok a\u011F\u0131r oldu\u011Funda, senin i\u00E7in bir problemi ta\u015F\u0131yaca\u011F\u0131m." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Cosmic Solve \u2014 Bir problemi otomatik do\u011Fru \u00E7\u00F6zer" },
        { text: "D\u00F6rt koruyucu parl\u0131yor.", button: "Devam Et" }
      ],
      5: [
        { text: "SONUNDA!" },
        { text: "Bunu bize kimin yapt\u0131\u011F\u0131n\u0131 bilmek ister misin? Ad\u0131 Hikari\u2019ydi." },
        { text: "Liderimiz olmas\u0131 gerekiyordu. Hepimizin en parlak\u0131." },
        { text: "Ama unutulmaya dayanamad\u0131. Bu y\u00FCzden U\u00E7urum\u2019u a\u00E7t\u0131. G\u00F6lgeleri serbest b\u0131rakt\u0131. Hepimizi uyuttu." },
        { text: "Hepimiz unutulmay\u0131 hissettik. Hepimiz zay\u0131flad\u0131k. Ama ailemize ihanet etmedik." },
        { text: "Hediyem: Blaze Skip. Baz\u0131 problemler sava\u015Fmaya de\u011Fmez. Atla. Devam et. Kazan." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Blaze Skip \u2014 Problemi cezas\u0131z atlar" },
        { text: "Be\u015F koruyucu parlak yan\u0131yor. Bir tane kald\u0131.", button: "Devam Et" }
      ],
      6: [
        { text: "Huzur." },
        { text: "En gen\u00E7 koruyucuyum. Hikari bana g\u00F6z kulak olurdu." },
        { text: "Bana nas\u0131l akmay\u0131 \u00F6\u011Fretti. Sular sertlerine sert oldu\u011Funda nas\u0131l sakin kalmay\u0131." },
        { text: "Bizim ilkimizdi. En parlak\u0131. Yumemori onu en saf \u0131\u015F\u0131\u011F\u0131ndan yaratt\u0131." },
        { text: "Di\u011Ferleri onu kurtarmaktan ya da durdurmaktan bahsediyor." },
        { text: "Ben sadece onu tekrar g\u00F6rmek istiyorum. Ger\u00E7ek onu." },
        { text: "Hediyem: Simplify. Sular \u00E7ok sert oldu\u011Funda, senin i\u00E7in yumu\u015Fat\u0131r\u0131m." },
        { text: "Yeni G\u00FC\u00E7 A\u00E7\u0131ld\u0131: Simplify \u2014 Problemi daha kolay say\u0131lara d\u00FC\u015F\u00FCr\u00FCr" }
      ]
    },

    gathering: [
      { text: "Alt\u0131 koruyucu. Alt\u0131 \u0131\u015F\u0131k. Tekrar bir arada." },
      { text: "U\u00E7urum\u2019a girmeden \u00F6nce... t\u00FCm ger\u00E7e\u011Fi bilmeyi hak ediyorsun." },
      { text: "Uzun zaman \u00F6nce, Kadim G\u00F6lgelerle tek ba\u015F\u0131ma sava\u015Ft\u0131m. Onlar\u0131 var olu\u015Fun en derin yerine m\u00FCh\u00FCrledim." },
      { text: "Geriye kalan\u0131mla yedi koruyucu yaratt\u0131m. R\u00FCya D\u00FCnyas\u0131n\u0131 korumak i\u00E7in yedi \u0131\u015F\u0131k." },
      { text: "Hikari ilkiydi. En parlak\u0131m. Gururum." },
      { text: "Ama r\u00FCyac\u0131lar onu unuttu\u011Funda... solmaya ba\u015Flad\u0131. Bo\u015Fluk b\u00FCy\u00FCd\u00FC. Ve G\u00F6lgeler U\u00E7urum\u2019un i\u00E7inden f\u0131s\u0131ldad\u0131." },
      { text: "Ona bir daha asla unutulmayaca\u011F\u0131n\u0131 vaat ettiler." },
      { text: "M\u00FChr\u00FC k\u0131rd\u0131. G\u00F6lgeler onu yuttu. Hikari, Kurayami oldu \u2014 Kabuslar\u0131n kral\u0131." },
      { text: "Onu durduramad\u0131m. Koruyucular\u0131 yaratmak i\u00E7in her \u015Feyimi vermi\u015Ftim. U\u00E7urum\u2019u m\u00FCh\u00FCrlemek i\u00E7in." },
      { text: "Ama \u015Fimdi... yaln\u0131z de\u011Filiz." },
      { text: "Seninleyiz." },
      { text: "I\u015F\u0131\u011F\u0131n\u0131 g\u00F6r\u00FCyoruz." },
      { text: "Sana inan\u0131yoruz." },
      { text: "Sonsuzlu\u011Fun \u00F6tesinde seninle duruyoruz." },
      { text: "Yan\u0131nda yan\u0131yoruz." },
      { text: "Bir olarak ak\u0131yoruz." },
      { text: "Haz\u0131r m\u0131s\u0131n, r\u00FCyac\u0131?", button: "U\u00E7urum\u2019a Gir" }
    ],

    abyssMidpoint: [
      { text: "Hala buradasın." },
      { text: "Solman\u0131n nas\u0131l bir \u015Fey oldu\u011Funu biliyor musun? Her \u015Feyini vermek... ve unutulmak?" },
      { text: "G\u00F6lgeler bana bir se\u00E7enek sundu. Sonsuza dek yok ol... ya da asla unutmayacaklar\u0131 bir \u015Feye d\u00F6n\u00FC\u015F." },
      { text: "Se\u00E7imimi yapt\u0131m." },
      { text: "Herkes eninde sonunda vazge\u00E7er.", button: "Devam Et" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. Her zaman ilk sava\u015Fan." },
          { text: "Ayn\u0131 zamanda ilk d\u00FC\u015Fen de sendin. Hat\u0131rl\u0131yor musun?" },
          { text: "Seni durdurmaya \u00E7al\u0131\u015Ft\u0131\u011F\u0131m\u0131 hat\u0131rl\u0131yorum. Ve yine yapard\u0131m." },
          { text: "Cesur. Ama g\u00FC\u00E7s\u00FCz cesaret sadece g\u00FCr\u00FClt\u00FCd\u00FCr.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "Hala ayaktay\u0131m, Kurayami." },
          { text: "...\u015Fimdilik." },
          { text: "Freeze seninle.", button: "Devam Et" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. Her \u015Feyi g\u00F6ren." },
          { text: "S\u00F6yle bana \u2014 bana ne oldu\u011Funu g\u00F6rd\u00FCysen... neden hi\u00E7bir \u015Fey yapmad\u0131n?" },
          { text: "..." },
          { text: "\u00C7\u00FCnk\u00FC kendi yolunu bulaca\u011F\u0131na inand\u0131m. Yan\u0131ld\u0131m." },
          { text: "En az\u0131ndan d\u00FCr\u00FCsts\u00FCn. Bu, seni yok etmeyi neredeyse h\u00FCz\u00FCnl\u00FC k\u0131l\u0131yor.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "\u015E\u00FCphe senin silah\u0131n, Kurayami. Ama bu r\u00FCyac\u0131 \u015F\u00FCphe etmiyor." },
          { text: "Herkes \u015F\u00FCphe eder. Sadece zaman meselesi." },
          { text: "Insight a\u00E7\u0131ld\u0131.", button: "Devam Et" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. Her \u015Feyin b\u00FCy\u00FCyebilece\u011Fine her zaman inanan." },
          { text: "\u00C7\u00FCnk\u00FC b\u00FCy\u00FCyebilir. Sen bile." },
          { text: "Geri d\u00F6nebilece\u011Fimi mi san\u0131yorsun? I\u015F\u0131\u011Fa geri '\u00FCy\u00FCyebilece\u011Fimi' mi?" },
          { text: "T\u00FCm varl\u0131\u011F\u0131mla buna inan\u0131yorum." },
          { text: "...hepinizin en ahmak\u0131s\u0131n.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "En g\u00FC\u00E7l\u00FC k\u00F6kler karanl\u0131kta b\u00FCy\u00FCr." },
          { text: "..." },
          { text: "Restore a\u00E7\u0131ld\u0131.", button: "Devam Et" }
        ]
      },
      4: {
        pre: [
          { text: "Uch\u016B. Sessiz olan." },
          { text: "Bo\u015Flu\u011Fu tan\u0131yorum, Kurayami. Senden daha uzun s\u00FCre i\u00E7inde ya\u015Fad\u0131m." },
          { text: "O zaman anl\u0131yorsun. Yapt\u0131\u011F\u0131m\u0131 neden yapt\u0131\u011F\u0131m\u0131 anl\u0131yorsun." },
          { text: "Ac\u0131y\u0131 anl\u0131yorum. Y\u0131k\u0131m\u0131 me\u015Frula\u015Ft\u0131rm\u0131yorum." },
          { text: "...bir \u015Feyleri anlayan tek ki\u015Fi sensin.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "Y\u0131ld\u0131zlar bile \u00F6l\u00FCr. Ve yeniden do\u011Far." },
          { text: "Hepsi de\u011Fil." },
          { text: "Cosmic Solve a\u00E7\u0131ld\u0131.", button: "Devam Et" }
        ]
      },
      5: {
        pre: [
          { text: "\u0130lk ben gideyim. BIRAKYIN ONU YAKAYIM." },
          { text: "Kaen. Tamamen ate\u015F, s\u0131f\u0131r kontrol." },
          { text: "Sen bir HA\u0130NS\u0130N. Bizi uyuttun. Kendi aileni!" },
          { text: "Aile. Kendi bireylerinden birini unutan ne t\u00FCr bir aile?" },
          { text: "SEN\u0130 UNUTMADIK! Sen dinlemeyi b\u0131rakt\u0131n!" },
          { text: "...belki. Ama bunun i\u00E7in art\u0131k \u00E7ok ge\u00E7.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "Bu bitince... konu\u015Faca\u011F\u0131z. Sen ve ben." },
          { text: "E\u011Fer konu\u015Facak bir \u015Feyim kal\u0131rsa." },
          { text: "Blaze Skip a\u00E7\u0131ld\u0131.", button: "Devam Et" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "O isim\u2014" },
          { text: "Seni istedi\u011Fim gibi \u00E7a\u011F\u0131r\u0131r\u0131m. Sen benim a\u011Fabeyimsin." },
          { text: "..." },
          { text: "Bana akmay\u0131 \u00F6\u011Fretti\u011Fini hat\u0131rl\u0131yor musun? Ak\u0131nt\u0131lar g\u00FC\u00E7l\u00FC oldu\u011Funda." },
          { text: "...sus." },
          { text: "Bana dedin ki: 'Suyla sava\u015Fma, Nami. Onunla ak.'" },
          { text: "YETER." },
          { text: "Kim oldu\u011Funu sana hat\u0131rlataca\u011F\u0131m. \u0130stemesen bile.", button: "Ba\u015Fla" }
        ],
        post: [
          { text: "Hala oradas\u0131n. Biliyorum." },
          { text: "...bunu bana yapma, Nami." },
          { text: "Simplify a\u00E7\u0131ld\u0131.", button: "Devam Et" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "Siz... hat\u0131rlad\u0131n\u0131z." },
      { text: "Yapt\u0131\u011F\u0131m her \u015Feyden sonra... hala bana o isimle sesleniyorsun." },
      { text: "Sen benim o\u011Flumsun. \u0130lk yarat\u0131m\u0131m. En parlak \u0131\u015F\u0131\u011F\u0131m." },
      { text: "G\u00F6lgeleri i\u00E7ime \u00E7ok derinden ald\u0131m. Art\u0131k benim bir par\u00E7am." },
      { text: "Geri d\u00F6nemem. Hen\u00FCz de\u011Fil." },
      { text: "Ama vazge\u00E7medin. Karanl\u0131k her yerdeyken bile." },
      { text: "Belki... ba\u015Fka bir r\u00FCyada." },
      { text: "Karanl\u0131k kalk\u0131yor." },
      { text: "I\u015F\u0131\u011F\u0131 tekrar g\u00F6rebiliyorum." },
      { text: "Ona Baba dedi. Hala hat\u0131rl\u0131yor." },
      { text: "Bo\u015Fluk sonsuza dek s\u00FCrmez. Y\u0131ld\u0131zlar bile yeniden do\u011Far." },
      { text: "...onu affetmiyorum. Hen\u00FCz de\u011Fil. Ama belki... bir g\u00FCn." },
      { text: "'Belki' dedi. \u015Eimdilik bu yeter." },
      { text: "R\u00FCya D\u00FCnyas\u0131 g\u00FCvende. Senin sayende, r\u00FCyac\u0131.", button: "Devam Et" }
    ],

    finale: [
      { text: "Ba\u015Fard\u0131n, r\u00FCyac\u0131." },
      { text: "Alt\u0131 diyar\u0131n hepsi parlak parl\u0131yor. Alt\u0131 koruyucunun hepsi seninle." },
      { text: "Ve m\u00FCh\u00FCr tekrar b\u00FCt\u00FCn." },
      { text: "Uzun zaman \u00F6nce, bu d\u00FCnyay\u0131 yoktan in\u015Fa ettim. Herkesi tek ba\u015F\u0131ma korumam gerekti\u011Fini d\u00FC\u015F\u00FCnd\u00FCm." },
      { text: "Yan\u0131lm\u0131\u015F\u0131m. Bana \u0131\u015F\u0131\u011F\u0131n payla\u015F\u0131ld\u0131\u011F\u0131nda daha g\u00FC\u00E7l\u00FC b\u00FCy\u00FCd\u00FC\u011F\u00FCn\u00FC g\u00F6sterdin." },
      { text: "So\u011Fu\u011Fun i\u00E7inden erittin." },
      { text: "\u015E\u00FCphenin \u00F6tesini g\u00F6rd\u00FCn." },
      { text: "M\u00FCcadelenin i\u00E7inde b\u00FCy\u00FCd\u00FCn." },
      { text: "Sonsuzlu\u011Fun \u00F6tesine uzand\u0131n." },
      { text: "Engelleri yakarak a\u015Ft\u0131n." },
      { text: "Her zorlu\u011Fun i\u00E7inden akt\u0131n." },
      { text: "Kabuslar bir g\u00FCn geri d\u00F6necek. Her zaman d\u00F6nerler." },
      { text: "Ama hi\u00E7bir r\u00FCyac\u0131n\u0131n daha \u00F6nce yapmad\u0131\u011F\u0131n\u0131 yapt\u0131n." },
      { text: "Bu y\u00FCzden sana bu hediyeyi sunuyorum." },
      { text: "Bundan sonra R\u00FCya D\u00FCnyas\u0131na istedi\u011Fin zaman d\u00F6nebilirsin." },
      { text: "A\u015Fama yok. S\u0131n\u0131r yok. Sadece sen ve say\u0131lar, kalmak istedi\u011Fin s\u00FCrece." },
      { text: "Koruyucular burada olacak. Ben burada olaca\u011F\u0131m." },
      { text: "Her gece geri d\u00F6n, r\u00FCyac\u0131. I\u015F\u0131\u011F\u0131n\u0131 parlak tut." },
      { text: "Ve belki... belki bir g\u00FCn... Hikari evinin yolunu bulacak." },
      { text: "U\u00E7urum\u2019un derinliklerinde, m\u00FChr\u00FCn \u00F6tesinde, hi\u00E7bir \u0131\u015F\u0131\u011F\u0131n ula\u015Famad\u0131\u011F\u0131 bir k\u00F6\u015Fede..." },
      { text: "K\u00FC\u00E7\u00FCk bir alt\u0131n k\u0131v\u0131lc\u0131m titri\u015Fiyor." },
      { text: "...Baba..." },
      { text: "SON... ?" },
      { text: "", button: "Sonsuz R\u00FCyaya Gir" }
    ]
  },

  // === APP META ===
  appDescription: 'Zihnini e\u011Fit. Karanl\u0131\u011F\u0131 ayd\u0131nlat.',
};

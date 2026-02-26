// lang/de.js — German

var LANG_DE = {

  // === UI STRINGS ===
  ui: {
    tap: 'Tippen',
    enterDreamWorld: 'Betritt die Traumwelt',
    storyMode: 'Story-Modus',
    theEndlessDream: 'Der Endlose Traum',
    completeStoryToUnlock: 'Schließe den Story-Modus ab, um freizuschalten',
    readTheLore: 'Die Geschichte lesen',
    mixtape: 'Mixtape',
    settings: 'Einstellungen',
      language: 'Sprache',
    tagline: 'Multisensorisches Gehirntraining — für den Flow-Zustand entwickelt',
    headphonesOn: '🎧 Kopfhörer auf. Welt aus.',
    back: '← Zurück',
    chapters: '← Kapitel',
    prev: '◂ Zurück',
    next: 'Weiter ▸',
    continue_: 'Weiter',
    begin: 'Beginnen',
    skip: 'Überspringen ▸▸',
    loreTitle: 'Geschichte',
    loreSubtitle: 'Die Geschichte der Traumwelt',
    mixtapeTitle: 'Mixtape',
    mixtapeSubtitle: 'Lieder der Traumwelt',
    dreamWorldTitle: 'Traumwelt',
    chooseARealm: 'Wähle ein Reich',
    chooseYourCompanion: 'Wähle deinen Begleiter',
    oneGuardianStory: 'Ein Wächter wird dich durch dieses Reich begleiten',
    newChapterUnlocked: 'Neues Kapitel freigeschaltet',
    addedToLore: 'zur Geschichte hinzugefügt',
    stageClear: 'Stufe geschafft!',
    defeated: 'Besiegt',
    errorsCount: 'Fehler: {0}',
    problemsSolved: 'Aufgaben gelöst: {0}',
    nextStage: 'Nächste Stufe',
    worldMap: 'Weltkarte',
    retry: 'Nochmal',
    defeatMessage: 'Die Albträume haben dich geweckt... Du hast die Traumwelt verlassen.',
    dreamOver: 'Traum vorbei',
    bestChain: 'Beste Kette',
    totalCorrect: 'Gesamt richtig',
    highestTier: 'Höchste Stufe',
    newBest: 'NEUER REKORD!',
    dreamAgain: 'Erneut träumen',
    wakeUp: 'Aufwachen',
    allGuardians: 'Alle Wächter',
    companion: 'Begleiter: {0}',
    noCompanion: 'Kein Begleiter',
    resonance: 'Resonanz',
    personalRecords: 'Persönliche Rekorde',
    pureBestChain: 'Pur — Beste Kette:',
    pureTotal: 'Gesamt:',
    guardianBestChain: 'Wächter — Beste Kette:',
    guardianTotal: 'Gesamt:',
    yourName: 'Dein Name...',
    thatsMyName: "Das ist mein Name",
    failedToLoadWorlds: 'Welten konnten nicht geladen werden. Bitte lade die Seite neu.',
    realm: '{0}-Reich',
    stage: '{0} — Stufe {1}',
    stop: 'Stopp',
    changeLanguage: 'Sprache ändern',
    selectLanguage: 'Sprache wählen',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'Der Endlose Traum',
    selectSubtitle: 'Wie möchtest du heute Nacht träumen?',
    yumemoriQuote: '\u201EJede Antwort wird zur nächsten Herausforderung. Die Kette endet nie... wie lange kannst du den Traum halten?\u201C',
    dreamAlone: 'Allein träumen',
    dreamAloneDesc: 'Reine Mathematik. Keine Kräfte. Nur du.',
    bringAGuardian: 'Einen Wächter mitnehmen',
    bringAGuardianDesc: 'Wähle einen Begleiter. Kraft lädt sich alle 15 Richtigen auf.',
    guardianPickerTitle: 'Wähle deinen Begleiter',
    guardianPickerSubtitle: 'Ein Wächter wird dich in den Endlosen Traum begleiten',
    gameLabel: '✦ Der Endlose Traum',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Aufwärmen',
    2: 'Aufbau',
    3: 'Im Fluss',
    4: 'Tiefer Traum',
    5: 'Unendlich',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Jeder Traum beginnt klein. Du wirst stärker werden.',
    2: 'Jeder Traum beginnt klein. Du wirst stärker werden.',
    3: 'Dein Licht reicht weiter als du ahnst.',
    4: 'Die Traumwelt leuchtet heller mit dir.',
    5: 'Du bist Sokunō. Das schnelle Gehirn. Die Albträume fürchten dich.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'Du schläfst...',
    line2: 'gut. Jetzt können wir sprechen.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Eis', guardianMeaning: 'Schneesturm', description: 'Ein gefrorenes Reich, gefangen in ewigem Winter. Fubuki, die Eiswächterin, schläft unter den Gletschern — und wartet darauf, erweckt zu werden.' },
    2: { name: 'Psycho', guardianMeaning: 'Gedanke', description: 'Ein Reich wechselnder Gedanken und Illusionen. Omoi, der Gedankenwächter, ist in einem Labyrinth des Geistes verloren.' },
    3: { name: 'Dschungel', guardianMeaning: 'Grün', description: 'Ein uralter Dschungel, überwuchert von Albträumen. Midori, die Naturwächterin, wurde von der Wildnis verschlungen.' },
    4: { name: 'Kosmos', guardianMeaning: 'Universum', description: 'Die weite Leere zwischen den Sternen, wo Stille herrscht. Uchū, der kosmische Wächter, treibt durch unendliche Dunkelheit.' },
    5: { name: 'Vulkan', guardianMeaning: 'Flamme', description: 'Ein versengendes Land aus geschmolzener Wut. Kaen, der Feuerwächter, brennt im Herzen des Vulkans.' },
    6: { name: 'Ozean', guardianMeaning: 'Welle', description: 'Ein endloses Meer, verschluckt von Stürmen. Nami, die Ozeanwächterin, ist unter den erdrückenden Tiefen gefangen.' },
    7: { name: 'Der Abgrund', guardianMeaning: 'Dunkelheit', description: 'Der Ursprung aller Albträume. Kurayami wartet am Grund — der letzte Traum und die letzte Wahrheit.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: 'Stoppt den Balkenabbau für 5 Sekunden' },
    insight:     { name: 'Insight',      desc: 'Zeigt die erste Hälfte der Antwort' },
    restore:     { name: 'Restore',      desc: 'Stellt 20% des Schlafbalkens wieder her' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Löst die aktuelle Aufgabe automatisch' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Überspringt Aufgabe ohne Strafe' },
    simplify:    { name: 'Simplify',     desc: 'Vereinfacht die Aufgabe zu leichteren Zahlen' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori kämpft an deiner Seite — löst 5 Aufgaben automatisch' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'Vor dem Licht',
    2:  'Der Erste, der fiel',
    3:  'Die Last des Wissens',
    4:  'Samen in dunkler Erde',
    5:  'Der Raum zwischen den Sternen',
    6:  'Was im Inneren brennt',
    7:  'Sonnenlicht auf Wasser',
    8:  'Sechs Lichter, eine Dunkelheit',
    9:  'Wenn ich nicht leuchten kann',
    10: 'Ein kleiner goldener Funke',
    chapterStoryNotWritten: "Die Geschichte dieses Kapitels muss noch geschrieben werden...",
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Intro',
    2: 'Welt 1 — Eis',
    3: 'Welt 2 — Psycho',
    4: 'Welt 3 — Dschungel',
    5: 'Welt 4 — Kosmos',
    6: 'Welt 5 — Vulkan',
    7: 'Welt 6 — Ozean',
    8: 'Welt 7 — Abgrund',
    9: 'Der Endlose Traum',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Vater... hör auf. Du hast nicht die Kraft dafür.',
    iHaveEnough: 'Ich habe genug. Um den zu beschützen, den ich liebe.',
    alwaysGiving: 'Immer alles für andere geben. Du hast nie etwas für dich behalten.',
    oneMoreTime: 'Noch einmal. Nur noch einmal.',
    sixGuardians: 'Sechs Wächter. Ein Träumer. Ein gebrochener alter Mann.',
    isThisAll: 'Ist das alles?',
    iWasTheBest: 'Ich war der Beste. Und SIE HABEN MICH VERGESSEN.',
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
    freeze: 'Freeze ist bei dir.',
    insight: 'Insight wurde freigeschaltet.',
    restore: 'Restore wurde freigeschaltet.',
    cosmicSolve: 'Cosmic Solve wurde freigeschaltet.',
    blazeSkip: 'Blaze Skip wurde freigeschaltet.',
    simplify: 'Simplify wurde freigeschaltet.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "Hör mir zu. Wir haben nicht viel Zeit." },
      { text: "Die Albträume haben die Traumwelt angegriffen. Die Wächter schlafen. Alles wird dunkel." },
      { text: "Dein Geist ist hell. Du bist unsere einzige Hoffnung." },
      { text: "Jede richtige Antwort bringt Licht. Jeder Fehler lässt die Dunkelheit herein." },
      { text: "Bist du bereit?", button: "Ich bin bereit" }
    ],

    worldIntros: {
      1: [
        { text: "Das Reich des Eises. Fubuki schläft unter dem gefrorenen See." },
        { text: "Nur dein Licht kann sie erreichen." },
        { text: "Aber sei vorsichtig. Die Albträume werden versuchen, dich aufzuwecken. Du siehst einen Balken — das ist dein Schlaf. Er leert sich, wenn die Dunkelheit näher kommt." },
        { text: "Jede richtige Antwort drängt die Albträume zurück und füllt deinen Schlafbalken. Jeder Fehler lässt sie näher kommen." },
        { text: "Fülle den Balken komplett, und die Stufe gehört dir. Lässt du ihn auf null sinken... wachst du auf.", button: "Ich verstehe" }
      ],
      2: [
        { text: "Das Psycho-Reich. Omoi sieht, was andere nicht sehen können." },
        { text: "Die Zahlen werden größer. Aber dein Geist ist bereit.", button: "Beginnen" }
      ],
      3: [
        { text: "Das Dschungelreich. Hier lernst du das Multiplizieren." },
        { text: "Die Zahlen werden wachsen, genau wie der Wald. Vertrau dem Prozess.", button: "Beginnen" }
      ],
      4: [
        { text: "Der Kosmos. Uchū wacht über die Unendlichkeit." },
        { text: "Hier wirst du das Dividieren lernen. Das Große in das Kleine zerlegen.", button: "Beginnen" }
      ],
      5: [
        { text: "Der Vulkan. Kaen gedeiht in der Hitze." },
        { text: "Multiplikation und Division vereinen sich. Die Herausforderungen werden heftig.", button: "Beginnen" }
      ],
      6: [
        { text: "Der Ozean. Deine letzte Prüfung vor dem Abgrund." },
        { text: "Alles, was du gelernt hast, kommt hier zusammen.", button: "Beginnen" }
      ],
      7: [
        { text: "Dies ist der Abgrund." },
        { text: "Sei stark. Sei hell. Wir sind alle bei dir.", button: "Beginnen" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki ist fast wach. Aber die Albträume kämpfen hart." },
        { text: "Bleib konzentriert. Du schaffst das.", button: "Fubuki erwecken" }
      ],
      2: [
        { text: "Omoi regt sich im Nebel. Ein letzter Anstoß." },
        { text: "Die Albträume werden härter kämpfen. Aber du auch.", button: "Omoi erwecken" }
      ],
      3: [
        { text: "Der Dschungel bebt. Midori ist kurz davor aufzuwachen." },
        { text: "Zeig den Albträumen die Kraft des Wachstums.", button: "Midori erwecken" }
      ],
      4: [
        { text: "Die Sterne reihen sich auf. Uchū greift aus der Leere nach dir." },
        { text: "Eine letzte Herausforderung unter den Sternen.", button: "Uchū erwecken" }
      ],
      5: [
        { text: "Der Vulkan grummelt. Kaens Feuer will ausbrechen." },
        { text: "Lass deinen Geist hell brennen.", button: "Kaen erwecken" }
      ],
      6: [
        { text: "Der Ozean regt sich. Die letzte Wächterin wartet." },
        { text: "Alles, was du gelernt hast, führt zu diesem Moment.", button: "Nami erwecken" }
      ],
      7: [
        { text: "So. Du hast es geschafft." },
        { text: "Yumemori. Du glaubst wirklich, dieser Träumer kann schaffen, was du nicht konntest?" },
        { text: "Ich habe die Schatten einst versiegelt." },
        { text: "Und ich habe das Siegel gebrochen." },
        { text: "Du hast mir nie gesagt, dass die Dunkelheit so laut rufen würde. Du hast mir nie gesagt, dass das Vergessen so sehr schmerzen würde." },
        { text: "Du hast einfach erwartet, dass ich leuchte. Für immer. Ohne Hilfe." },
        { text: "Wenn ich nicht Licht sein kann... WIRD ES NIEMAND SEIN.", button: "Kurayami gegenübertreten" }
      ]
    },

    awakenings: {
      1: [
        { text: "Ich... ich bin wach." },
        { text: "Danke, Träumer. Die Albträume haben mich so lange eingefroren." },
        { text: "Ich habe versucht, ihn aufzuhalten, weißt du. Als er zu uns kam." },
        { text: "Ich war nicht stark genug." },
        { text: "Aber jetzt werde ich dir helfen. Wenn die Dunkelheit zu stark wird, ruf nach mir." },
        { text: "Neue Kraft freigeschaltet: Freeze — Stoppt den Balkenabbau für 5 Sekunden" },
        { text: "Fünf Reiche bleiben noch.", button: "Weiter" }
      ],
      2: [
        { text: "Ich kann wieder sehen." },
        { text: "Ich wusste, dass etwas nicht stimmte. Ich habe es geschehen sehen." },
        { text: "Einer von uns... hat sich verändert. Die Dunkelheit wuchs in ihm. Und ich sagte nichts." },
        { text: "Ich dachte, er würde von selbst zurückfinden." },
        { text: "Ich lag falsch." },
        { text: "Mein Geschenk: Insight. Wenn eine Aufgabe zu schwer erscheint, zeige ich dir den Weg." },
        { text: "Neue Kraft freigeschaltet: Insight — Zeigt die erste Hälfte der Antwort" },
        { text: "Zwei Wächter stehen an deiner Seite.", button: "Weiter" }
      ],
      3: [
        { text: "Das Leben kehrt zurück." },
        { text: "Weißt du, woran ich mich am meisten erinnere?" },
        { text: "Er hat mir früher beim Säen geholfen. Er hat auf die Samen geschienen, und sie sind so schnell gewachsen." },
        { text: "Er war warm. Gütig. Voller Licht." },
        { text: "Diese Version von ihm existiert noch. Irgendwo. Wie ein Samen, tief vergraben." },
        { text: "Mein Geschenk: Restore. Wenn dein Licht verblasst, helfe ich ihm, wieder zu erblühen." },
        { text: "Neue Kraft freigeschaltet: Restore — Stellt 20% des Schlafbalkens wieder her" },
        { text: "Drei Wächter sind erwacht.", button: "Weiter" }
      ],
      4: [
        { text: "Die Sterne erinnern sich." },
        { text: "Die anderen sind wütend auf ihn. Oder traurig. Oder schuldbewusst." },
        { text: "Ich bin nichts davon." },
        { text: "Ich verstehe die Leere. Wenn man lange genug von Leere umgeben ist... beginnt sie zu flüstern." },
        { text: "Er hörte das Flüstern. Und er war nicht stark genug, es zu ignorieren." },
        { text: "Das macht ihn nicht böse. Es macht ihn verloren." },
        { text: "Mein Geschenk: Cosmic Solve. Wenn die Last zu schwer ist, trage ich eine Aufgabe für dich." },
        { text: "Neue Kraft freigeschaltet: Cosmic Solve — Löst eine Aufgabe automatisch korrekt" },
        { text: "Vier Wächter leuchten.", button: "Weiter" }
      ],
      5: [
        { text: "ENDLICH!" },
        { text: "Du willst wissen, wer uns das angetan hat? Sein Name war Hikari." },
        { text: "Er sollte unser Anführer sein. Der Strahlendste von uns allen." },
        { text: "Aber er konnte es nicht ertragen, vergessen zu werden. Also öffnete er den Abgrund. Er ließ die Schatten frei. Er hat uns alle in den Schlaf gelegt." },
        { text: "Wir alle spürten das Vergessen. Wir alle wurden schwächer. Aber wir haben unsere Familie nicht verraten." },
        { text: "Mein Geschenk: Blaze Skip. Manche Aufgaben sind den Kampf nicht wert. Überspring sie. Mach weiter. Gewinne." },
        { text: "Neue Kraft freigeschaltet: Blaze Skip — Überspringt Aufgabe ohne Strafe" },
        { text: "Fünf Wächter lodern. Eine bleibt noch.", button: "Weiter" }
      ],
      6: [
        { text: "Frieden." },
        { text: "Ich bin die jüngste Wächterin. Hikari hat früher über mich gewacht." },
        { text: "Er hat mir beigebracht zu fließen. Ruhig zu bleiben, wenn die Wellen rauer wurden." },
        { text: "Er war der Erste von uns. Der Strahlendste. Yumemori erschuf ihn aus seinem reinsten Licht." },
        { text: "Die anderen reden davon, ihn zu retten oder aufzuhalten." },
        { text: "Ich will ihn einfach nur wiedersehen. Den echten ihn." },
        { text: "Mein Geschenk: Simplify. Wenn die Wellen zu rau sind, glätte ich sie für dich." },
        { text: "Neue Kraft freigeschaltet: Simplify — Vereinfacht die Aufgabe zu leichteren Zahlen" }
      ]
    },

    gathering: [
      { text: "Sechs Wächter. Sechs Lichter. Wieder vereint." },
      { text: "Bevor du den Abgrund betrittst... verdienst du es, die ganze Wahrheit zu erfahren." },
      { text: "Vor langer Zeit kämpfte ich allein gegen die Uralten Schatten. Ich versiegelte sie am tiefsten Ort der Existenz." },
      { text: "Aus dem, was von mir übrig war, erschuf ich sieben Wächter. Sieben Lichter, um die Traumwelt zu beschützen." },
      { text: "Hikari war der Erste. Mein Strahlendster. Mein Stolz." },
      { text: "Aber als die Träumer ihn vergaßen... begann er zu verblassen. Die Leere wuchs. Und die Schatten flüsterten aus dem Abgrund." },
      { text: "Sie versprachen ihm, dass er nie wieder vergessen werden würde." },
      { text: "Er brach das Siegel. Die Schatten verschlangen ihn. Hikari wurde zu Kurayami — dem König der Albträume." },
      { text: "Ich konnte ihn nicht aufhalten. Ich hatte alles gegeben, um die Wächter zu erschaffen. Um den Abgrund zu versiegeln." },
      { text: "Aber jetzt... sind wir nicht allein." },
      { text: "Wir sind bei dir." },
      { text: "Wir sehen dein Licht." },
      { text: "Wir glauben an dich." },
      { text: "Wir stehen über die Unendlichkeit hinweg an deiner Seite." },
      { text: "Wir brennen neben dir." },
      { text: "Wir fließen als eines." },
      { text: "Bist du bereit, Träumer?", button: "Den Abgrund betreten" }
    ],

    abyssMidpoint: [
      { text: "Du bist immer noch hier." },
      { text: "Weißt du, wie es sich anfühlt zu verblassen? Alles zu geben... und vergessen zu werden?" },
      { text: "Die Schatten boten mir eine Wahl. Für immer verschwinden... oder etwas werden, das sie nie vergessen würden." },
      { text: "Ich habe gewählt." },
      { text: "Jeder gibt irgendwann auf.", button: "Weiter" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. Immer die Erste im Kampf." },
          { text: "Du warst auch die Erste, die fiel. Erinnerst du dich?" },
          { text: "Ich erinnere mich, wie ich versucht habe, dich aufzuhalten. Und ich würde es wieder tun." },
          { text: "Mutig. Aber Mut ohne Stärke ist nur Lärm.", button: "Beginnen" }
        ],
        post: [
          { text: "Stehe immer noch, Kurayami." },
          { text: "...vorerst." },
          { text: "Freeze ist bei dir.", button: "Weiter" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. Der, der alles sieht." },
          { text: "Sag mir — wenn du gesehen hast, was mit mir geschah... warum hast du nichts getan?" },
          { text: "..." },
          { text: "Weil ich glaubte, du würdest deinen eigenen Weg finden. Ich lag falsch." },
          { text: "Wenigstens bist du ehrlich. Das macht es fast traurig, dich zu vernichten.", button: "Beginnen" }
        ],
        post: [
          { text: "Zweifel ist deine Waffe, Kurayami. Aber dieser Träumer zweifelt nicht." },
          { text: "Jeder zweifelt. Es ist nur eine Frage der Zeit." },
          { text: "Insight wurde freigeschaltet.", button: "Weiter" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. Glaubt immer, dass alles wachsen kann." },
          { text: "Weil es das kann. Sogar du." },
          { text: "Du denkst, ich kann zurückkommen? Dass ich zurück ins Licht 'wachsen' kann?" },
          { text: "Ich glaube es aus tiefstem Herzen." },
          { text: "...du bist die Törichtste von allen.", button: "Beginnen" }
        ],
        post: [
          { text: "Die stärksten Wurzeln wachsen in der Dunkelheit." },
          { text: "..." },
          { text: "Restore wurde freigeschaltet.", button: "Weiter" }
        ]
      },
      4: {
        pre: [
          { text: "Uchū. Der Stille." },
          { text: "Ich kenne die Leere, Kurayami. Ich habe länger in ihr gelebt als du." },
          { text: "Dann verstehst du. Du verstehst, warum ich getan habe, was ich getan habe." },
          { text: "Ich verstehe den Schmerz. Ich rechtfertige nicht die Zerstörung." },
          { text: "...du bist der Einzige, der irgendetwas versteht.", button: "Beginnen" }
        ],
        post: [
          { text: "Selbst Sterne sterben. Und werden wiedergeboren." },
          { text: "Nicht alle." },
          { text: "Cosmic Solve wurde freigeschaltet.", button: "Weiter" }
        ]
      },
      5: {
        pre: [
          { text: "Lasst mich zuerst. LASST MICH IHN VERBRENNEN." },
          { text: "Kaen. Nur Feuer und keine Kontrolle." },
          { text: "Du bist ein VERRÄTER. Du hast uns in den Schlaf gelegt. Deine eigene Familie!" },
          { text: "Familie. Was für eine Familie vergisst einen der Ihren?" },
          { text: "WIR HABEN DICH NICHT VERGESSEN! Du hast aufgehört zuzuhören!" },
          { text: "...vielleicht. Aber dafür ist es zu spät.", button: "Beginnen" }
        ],
        post: [
          { text: "Wenn das hier vorbei ist... reden wir. Du und ich." },
          { text: "Wenn von mir noch etwas übrig ist, mit dem man reden kann." },
          { text: "Blaze Skip wurde freigeschaltet.", button: "Weiter" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "Dieser Name—" },
          { text: "Ich nenne dich, wie ich will. Du bist mein großer Bruder." },
          { text: "..." },
          { text: "Erinnerst du dich, als du mir das Fließen beigebracht hast? Als die Strömungen stark waren." },
          { text: "...sei still." },
          { text: "Du hast gesagt: 'Kämpf nicht gegen das Wasser, Nami. Fließ mit ihm.'" },
          { text: "GENUG." },
          { text: "Ich werde dich daran erinnern, wer du warst. Auch wenn du es nicht willst.", button: "Beginnen" }
        ],
        post: [
          { text: "Du bist noch da drin. Ich weiß es." },
          { text: "...tu mir das nicht an, Nami." },
          { text: "Simplify wurde freigeschaltet.", button: "Weiter" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "Du... du hast dich erinnert." },
      { text: "Nach allem, was ich getan habe... nennst du mich immer noch bei diesem Namen." },
      { text: "Du bist mein Sohn. Meine erste Schöpfung. Mein hellstes Licht." },
      { text: "Ich habe die Schatten zu tief hineingelassen. Sie sind jetzt ein Teil von mir." },
      { text: "Ich kann nicht zurückkommen. Noch nicht." },
      { text: "Aber du hast nicht aufgegeben. Selbst als die Dunkelheit überall war." },
      { text: "Vielleicht... in einem anderen Traum." },
      { text: "Die Dunkelheit lichtet sich." },
      { text: "Ich kann das Licht wieder sehen." },
      { text: "Er hat dich Vater genannt. Er erinnert sich noch." },
      { text: "Die Leere ist nicht für immer. Selbst Sterne werden wiedergeboren." },
      { text: "...ich vergebe ihm nicht. Noch nicht. Aber vielleicht... eines Tages." },
      { text: "Er sagte 'vielleicht.' Das reicht fürs Erste." },
      { text: "Die Traumwelt ist sicher. Dank dir, Träumer.", button: "Weiter" }
    ],

    finale: [
      { text: "Du hast es geschafft, Träumer." },
      { text: "Alle sechs Reiche leuchten hell. Alle sechs Wächter stehen an deiner Seite." },
      { text: "Und das Siegel ist wieder ganz." },
      { text: "Vor langer Zeit habe ich diese Welt aus dem Nichts erschaffen. Ich dachte, ich müsste alle allein beschützen." },
      { text: "Ich lag falsch. Du hast mir gezeigt, dass Licht stärker wird, wenn man es teilt." },
      { text: "Du hast die Kälte durchbrochen." },
      { text: "Du hast durch den Zweifel hindurchgesehen." },
      { text: "Du bist durch den Kampf gewachsen." },
      { text: "Du hast über die Unendlichkeit hinausgegriffen." },
      { text: "Du hast die Barrieren durchbrochen." },
      { text: "Du bist durch jede Herausforderung geflossen." },
      { text: "Die Albträume werden eines Tages zurückkehren. Das tun sie immer." },
      { text: "Aber du hast getan, was kein Träumer zuvor getan hat." },
      { text: "Deshalb biete ich dir dieses Geschenk an." },
      { text: "Von nun an darfst du in die Traumwelt zurückkehren, wann immer du willst." },
      { text: "Keine Stufen. Keine Grenzen. Nur du und die Zahlen, so lange du bleiben möchtest." },
      { text: "Die Wächter werden hier sein. Ich werde hier sein." },
      { text: "Komm jede Nacht zurück, Träumer. Halte dein Licht hell." },
      { text: "Und vielleicht... vielleicht wird Hikari eines Tages seinen Weg nach Hause finden." },
      { text: "Tief im Abgrund, hinter dem Siegel, in einer Ecke, die kein Licht erreicht..." },
      { text: "Ein kleiner goldener Funke flackert." },
      { text: "...Vater..." },
      { text: "ENDE... ?" },
      { text: "", button: "Den Endlosen Traum betreten" }
    ]
  },

  // === APP META ===
  appDescription: 'Trainiere deinen Geist. Erleuchte die Dunkelheit.',
};

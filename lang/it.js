// lang/it.js — Italian

var LANG_IT = {

  // === UI STRINGS ===
  ui: {
    tap: 'Tocca',
    enterDreamWorld: 'Entra nel Mondo dei Sogni',
    storyMode: 'Modalit\u00e0 Storia',
    theEndlessDream: 'Il Sogno Infinito',
    completeStoryToUnlock: 'Completa la Modalit\u00e0 Storia per sbloccare',
    readTheLore: 'Leggi la Leggenda',
    mixtape: 'Mixtape',
    settings: 'Impostazioni',
      language: 'Lingua',
    tagline: 'Allenamento cerebrale multisensoriale \u2014 progettato per lo stato di flow',
    headphonesOn: '\uD83C\uDFA7 Cuffie accese. Mondo spento.',
    back: '\u2190 Indietro',
    chapters: '\u2190 Capitoli',
    prev: '\u25C2 Prec',
    next: 'Succ \u25B8',
    continue_: 'Continua',
    begin: 'Inizia',
    skip: 'Salta \u25B8\u25B8',
    loreTitle: 'Leggenda',
    loreSubtitle: 'Storia del Mondo dei Sogni',
    mixtapeTitle: 'Mixtape',
    mixtapeSubtitle: 'Canzoni del Mondo dei Sogni',
    dreamWorldTitle: 'Mondo dei Sogni',
    chooseARealm: 'Scegli un reame',
    chooseYourCompanion: 'Scegli il Tuo Compagno',
    oneGuardianStory: 'Un guardiano ti accompagner\u00e0 attraverso questo reame',
    newChapterUnlocked: 'Nuovo Capitolo Sbloccato',
    addedToLore: 'aggiunto alla Leggenda',
    stageClear: 'Stadio Superato!',
    defeated: 'Sconfitto',
    errorsCount: 'Errori: {0}',
    problemsSolved: 'Problemi risolti: {0}',
    nextStage: 'Prossimo Stadio',
    worldMap: 'Mappa del Mondo',
    retry: 'Riprova',
    defeatMessage: 'Gli Incubi ti hanno svegliato... Hai lasciato il Mondo dei Sogni.',
    dreamOver: 'Sogno Finito',
    bestChain: 'Miglior Catena',
    totalCorrect: 'Totale Corretti',
    highestTier: 'Livello Pi\u00f9 Alto',
    newBest: 'NUOVO RECORD!',
    dreamAgain: 'Sogna Ancora',
    wakeUp: 'Svegliati',
    allGuardians: 'Tutti i Guardiani',
    companion: 'Compagno: {0}',
    noCompanion: 'Nessun compagno',
    resonance: 'Risonanza',
    personalRecords: 'Record Personali',
    pureBestChain: 'Puro \u2014 Miglior Catena:',
    pureTotal: 'Totale:',
    guardianBestChain: 'Guardiano \u2014 Miglior Catena:',
    guardianTotal: 'Totale:',
    yourName: 'Il tuo nome...',
    thatsMyName: 'Questo \u00e8 il mio nome',
    failedToLoadWorlds: 'Impossibile caricare i mondi. Per favore ricarica la pagina.',
    realm: 'Reame {0}',
    stage: '{0} \u2014 Stadio {1}',
    stop: 'Ferma',
    changeLanguage: 'Cambia Lingua',
    selectLanguage: 'Seleziona Lingua',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'Il Sogno Infinito',
    selectSubtitle: 'Come vuoi sognare stanotte?',
    yumemoriQuote: '\u201COgni risposta diventa la sfida successiva. La catena non si ferma mai... quanto a lungo riesci a reggere il sogno?\u201D',
    dreamAlone: 'Sogna da Solo',
    dreamAloneDesc: 'Pura matematica. Nessun potere. Solo tu.',
    bringAGuardian: 'Porta un Guardiano',
    bringAGuardianDesc: 'Scegli un compagno. Il potere si carica ogni 15 risposte corrette.',
    guardianPickerTitle: 'Scegli il Tuo Compagno',
    guardianPickerSubtitle: 'Un guardiano ti accompagner\u00e0 nel Sogno Infinito',
    gameLabel: '\u2726 Il Sogno Infinito',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Riscaldamento',
    2: 'Costruzione',
    3: 'Flusso',
    4: 'Sogno Profondo',
    5: 'Infinito',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Ogni sogno inizia in piccolo. Diventerai pi\u00f9 forte.',
    2: 'Ogni sogno inizia in piccolo. Diventerai pi\u00f9 forte.',
    3: 'La tua luce arriva pi\u00f9 lontano di quanto pensi.',
    4: 'Il Mondo dei Sogni brilla di pi\u00f9 con te al suo interno.',
    5: 'Tu sei Sokun\u014D. Il Cervello Veloce. Gli Incubi ti temono.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'Stai dormendo...',
    line2: 'bene. Ora possiamo parlare.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Ghiaccio', guardianMeaning: 'Bufera', description: 'Un reame ghiacciato intrappolato in un inverno eterno. Fubuki, la guardiana del ghiaccio, dorme sotto i ghiacciai \u2014 in attesa di essere risvegliata.' },
    2: { name: 'Psichico', guardianMeaning: 'Pensiero', description: 'Un reame di pensieri mutevoli e illusioni. Omoi, il guardiano psichico, \u00e8 perso in un labirinto della mente.' },
    3: { name: 'Giungla', guardianMeaning: 'Verde', description: 'Un\'antica giungla invasa dagli Incubi. Midori, la guardiana della natura, \u00e8 stata divorata dalla natura selvaggia.' },
    4: { name: 'Cosmo', guardianMeaning: 'Universo', description: 'Il vasto vuoto tra le stelle, dove regna il silenzio. Uch\u016B, il guardiano cosmico, vaga nell\'oscurit\u00e0 infinita.' },
    5: { name: 'Vulcano', guardianMeaning: 'Fiamma', description: 'Una terra bruciante di furia fusa. Kaen, il guardiano del fuoco, arde nel cuore del vulcano.' },
    6: { name: 'Oceano', guardianMeaning: 'Onda', description: 'Un mare senza fine inghiottito dalle tempeste. Nami, la guardiana dell\'oceano, \u00e8 intrappolata sotto le profondit\u00e0 schiaccianti.' },
    7: { name: 'L\'Abisso', guardianMeaning: 'Oscurit\u00e0', description: 'La fonte di tutti gli Incubi. Kurayami attende sul fondo \u2014 l\'ultimo sogno e l\'ultima verit\u00e0.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: 'Ferma il consumo della barra per 5 secondi' },
    insight:     { name: 'Insight',      desc: 'Rivela la prima met\u00e0 della risposta' },
    restore:     { name: 'Restore',      desc: 'Recupera il 20% della barra del sonno' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Completa automaticamente il problema corrente' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Salta il problema senza penalit\u00e0' },
    simplify:    { name: 'Simplify',     desc: 'Riduce il problema a numeri pi\u00f9 semplici' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori combatte al tuo fianco \u2014 completa automaticamente 5 problemi' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'Prima della Luce',
    2:  'Il Primo a Cadere',
    3:  'Il Peso del Sapere',
    4:  'Semi nella Terra Oscura',
    5:  'Lo Spazio tra le Stelle',
    6:  'Ci\u00f2 che Brucia Dentro',
    7:  'Luce del Sole sull\'Acqua',
    8:  'Sei Luci, Un\'Oscurit\u00e0',
    9:  'Se Non Posso Brillare',
    10: 'Una Piccola Scintilla Dorata',
    chapterStoryNotWritten: 'La storia di questo capitolo deve ancora essere scritta...',
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Intro',
    2: 'Mondo 1 \u2014 Ghiaccio',
    3: 'Mondo 2 \u2014 Psichico',
    4: 'Mondo 3 \u2014 Giungla',
    5: 'Mondo 4 \u2014 Cosmo',
    6: 'Mondo 5 \u2014 Vulcano',
    7: 'Mondo 6 \u2014 Oceano',
    8: 'Mondo 7 \u2014 Abisso',
    9: 'Il Sogno Infinito',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Padre... fermati. Non hai la forza per questo.',
    iHaveEnough: 'Ne ho abbastanza. Per proteggere chi amo.',
    alwaysGiving: 'Sempre a dare tutto per gli altri. Non hai mai tenuto nulla per te.',
    oneMoreTime: 'Ancora una volta. Solo un\'altra volta.',
    sixGuardians: 'Sei guardiani. Un sognatore. Un vecchio distrutto.',
    isThisAll: '\u00c8 tutto qui?',
    iWasTheBest: 'Ero il migliore. E MI HANNO DIMENTICATO.',
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
    freeze: 'Freeze \u00e8 con te.',
    insight: 'Insight \u00e8 stato sbloccato.',
    restore: 'Restore \u00e8 stato sbloccato.',
    cosmicSolve: 'Cosmic Solve \u00e8 stato sbloccato.',
    blazeSkip: 'Blaze Skip \u00e8 stato sbloccato.',
    simplify: 'Simplify \u00e8 stato sbloccato.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "Ascoltami. Non abbiamo molto tempo." },
      { text: "Gli Incubi hanno attaccato il Mondo dei Sogni. I guardiani dormono. Tutto si sta oscurando." },
      { text: "La tua mente \u00e8 brillante. Sei la nostra unica speranza." },
      { text: "Ogni risposta corretta porta luce. Ogni errore lascia entrare l'oscurit\u00e0." },
      { text: "Sei pronto?", button: "Sono pronto" }
    ],

    worldIntros: {
      1: [
        { text: "Il Reame del Ghiaccio. Fubuki dorme sotto il lago ghiacciato." },
        { text: "Solo la tua luce pu\u00f2 raggiungerla." },
        { text: "Ma stai attento. Gli Incubi cercheranno di svegliarti. Vedrai una barra \u2014 quello \u00e8 il tuo sonno. Si consuma man mano che l'oscurit\u00e0 si avvicina." },
        { text: "Ogni risposta corretta respinge gli Incubi e riempie la tua barra del sonno. Ogni errore li avvicina." },
        { text: "Riempi la barra completamente e lo stadio \u00e8 tuo. Lascia che arrivi a zero... e ti sveglierai.", button: "Ho capito" }
      ],
      2: [
        { text: "Il Reame Psichico. Omoi vede ci\u00f2 che gli altri non possono." },
        { text: "I numeri diventeranno pi\u00f9 grandi. Ma la tua mente \u00e8 pronta.", button: "Inizia" }
      ],
      3: [
        { text: "Il Reame della Giungla. Qui imparerai a moltiplicare." },
        { text: "I numeri cresceranno, proprio come la foresta. Fidati del processo.", button: "Inizia" }
      ],
      4: [
        { text: "Il Cosmo. Uch\u016B veglia sull'infinito." },
        { text: "Qui imparerai a dividere. A spezzare il grande nel piccolo.", button: "Inizia" }
      ],
      5: [
        { text: "Il Vulcano. Kaen prospera nel calore." },
        { text: "Moltiplicazione e divisione si uniscono. Le sfide saranno feroci.", button: "Inizia" }
      ],
      6: [
        { text: "L'Oceano. La tua ultima prova prima dell'Abisso." },
        { text: "Tutto ci\u00f2 che hai imparato si unisce qui.", button: "Inizia" }
      ],
      7: [
        { text: "Questo \u00e8 l'Abisso." },
        { text: "Sii forte. Sii luminoso. Siamo tutti con te.", button: "Inizia" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki \u00e8 quasi sveglia. Ma gli Incubi stanno lottando con tutte le forze." },
        { text: "Resta concentrato. Ce la puoi fare.", button: "Risveglia Fubuki" }
      ],
      2: [
        { text: "Omoi si agita nella nebbia. Un ultimo sforzo." },
        { text: "Gli Incubi lotteranno pi\u00f9 forte. Ma anche tu.", button: "Risveglia Omoi" }
      ],
      3: [
        { text: "La giungla trema. Midori \u00e8 vicina al risveglio." },
        { text: "Mostra agli Incubi il potere della crescita.", button: "Risveglia Midori" }
      ],
      4: [
        { text: "Le stelle si stanno allineando. Uch\u016B tende la mano dal vuoto." },
        { text: "Un'ultima sfida tra le stelle.", button: "Risveglia Uch\u016B" }
      ],
      5: [
        { text: "Il vulcano rimbomba. Il fuoco di Kaen vuole liberarsi." },
        { text: "Lascia che la tua mente bruci di luce.", button: "Risveglia Kaen" }
      ],
      6: [
        { text: "L'oceano si agita. L'ultimo guardiano attende." },
        { text: "Tutto ci\u00f2 che hai imparato conduce a questo momento.", button: "Risveglia Nami" }
      ],
      7: [
        { text: "Allora. Ce l'hai fatta." },
        { text: "Yumemori. Pensi davvero che questo sognatore possa fare ci\u00f2 che tu non sei riuscito a fare?" },
        { text: "Ho sigillato le Ombre una volta." },
        { text: "E io ho rotto il sigillo." },
        { text: "Non mi hai mai detto che l'oscurit\u00e0 avrebbe chiamato cos\u00ec forte. Non mi hai mai detto che l'essere dimenticato avrebbe fatto cos\u00ec male." },
        { text: "Ti aspettavi solo che io brillassi. Per sempre. Senza aiuto." },
        { text: "Se non posso essere luce... NESSUNO LO SAR\u00c0.", button: "Affronta Kurayami" }
      ]
    },

    awakenings: {
      1: [
        { text: "Io... sono sveglia." },
        { text: "Grazie, sognatore. Gli Incubi mi hanno tenuta congelata per cos\u00ec tanto tempo." },
        { text: "Ho cercato di fermarlo, sai. Quando \u00e8 venuto per noi." },
        { text: "Non ero abbastanza forte." },
        { text: "Ma ora ti aiuter\u00f2. Quando l'oscurit\u00e0 sembra troppo forte, chiamami." },
        { text: "Nuovo Potere Sbloccato: Freeze \u2014 Ferma il consumo della barra per 5 secondi" },
        { text: "Restano cinque reami.", button: "Continua" }
      ],
      2: [
        { text: "Riesco a vedere di nuovo." },
        { text: "Sapevo che qualcosa non andava. L'ho visto accadere." },
        { text: "Uno di noi... \u00e8 cambiato. L'oscurit\u00e0 \u00e8 cresciuta dentro di lui. E io non ho detto nulla." },
        { text: "Pensavo che avrebbe ritrovato la strada da solo." },
        { text: "Mi sbagliavo." },
        { text: "Il mio dono: Insight. Quando un problema sembra troppo difficile, ti mostrer\u00f2 la via." },
        { text: "Nuovo Potere Sbloccato: Insight \u2014 Rivela la prima met\u00e0 della risposta" },
        { text: "Due guardiani sono al tuo fianco.", button: "Continua" }
      ],
      3: [
        { text: "La vita ritorna." },
        { text: "Sai cosa ricordo di pi\u00f9 di lui?" },
        { text: "Aiutava me a piantare semi. Brillava su di loro e crescevano cos\u00ec in fretta." },
        { text: "Era caldo. Gentile. Pieno di luce." },
        { text: "Quella versione di lui \u00e8 ancora l\u00ec. Da qualche parte. Come un seme sepolto in profondit\u00e0." },
        { text: "Il mio dono: Restore. Quando la tua luce si affievolisce, la aiuter\u00f2 a fiorire di nuovo." },
        { text: "Nuovo Potere Sbloccato: Restore \u2014 Recupera il 20% della barra del sonno" },
        { text: "Tre guardiani svegli.", button: "Continua" }
      ],
      4: [
        { text: "Le stelle ricordano." },
        { text: "Gli altri sono arrabbiati con lui. O tristi. O in colpa." },
        { text: "Io non sono nessuna di queste cose." },
        { text: "Conosco il vuoto. Quando sei circondato dal nulla abbastanza a lungo... inizia a sussurrare." },
        { text: "Lui ha sentito i sussurri. E non era abbastanza forte per ignorarli." },
        { text: "Questo non lo rende malvagio. Lo rende perduto." },
        { text: "Il mio dono: Cosmic Solve. Quando il peso \u00e8 troppo grande, porter\u00f2 un problema per te." },
        { text: "Nuovo Potere Sbloccato: Cosmic Solve \u2014 Completa automaticamente un problema" },
        { text: "Quattro guardiani brillano.", button: "Continua" }
      ],
      5: [
        { text: "FINALMENTE!" },
        { text: "Vuoi sapere chi ci ha fatto questo? Il suo nome era Hikari." },
        { text: "Doveva essere il nostro leader. Il pi\u00f9 luminoso di tutti noi." },
        { text: "Ma non riusciva a sopportare di essere dimenticato. Cos\u00ec ha aperto l'Abisso. Ha liberato le Ombre. Ci ha messi tutti a dormire." },
        { text: "Tutti abbiamo sentito l'essere dimenticati. Tutti ci siamo sentiti pi\u00f9 deboli. Ma non abbiamo tradito la nostra famiglia." },
        { text: "Il mio dono: Blaze Skip. Alcuni problemi non valgono la lotta. Saltali. Vai avanti. Vinci." },
        { text: "Nuovo Potere Sbloccato: Blaze Skip \u2014 Salta il problema senza penalit\u00e0" },
        { text: "Cinque guardiani ardono. Ne resta uno.", button: "Continua" }
      ],
      6: [
        { text: "Pace." },
        { text: "Sono la guardiana pi\u00f9 giovane. Hikari si prendeva cura di me." },
        { text: "Mi ha insegnato a fluire. Come restare calma quando le acque si facevano agitate." },
        { text: "Era il primo di noi. Il pi\u00f9 luminoso. Yumemori lo cre\u00f2 dalla sua luce pi\u00f9 pura." },
        { text: "Gli altri parlano di salvarlo o fermarlo." },
        { text: "Io voglio solo rivederlo. Il vero lui." },
        { text: "Il mio dono: Simplify. Quando le acque sono troppo agitate, le calmer\u00f2 per te." },
        { text: "Nuovo Potere Sbloccato: Simplify \u2014 Riduce il problema a numeri pi\u00f9 semplici" }
      ]
    },

    gathering: [
      { text: "Sei guardiani. Sei luci. Di nuovo insieme." },
      { text: "Prima di entrare nell'Abisso... meriti di conoscere tutta la verit\u00e0." },
      { text: "Molto tempo fa, ho combattuto le Ombre Antiche da solo. Le ho sigillate nel luogo pi\u00f9 profondo dell'esistenza." },
      { text: "Ho usato ci\u00f2 che restava di me per creare sette guardiani. Sette luci per proteggere il Mondo dei Sogni." },
      { text: "Hikari fu il primo. Il mio pi\u00f9 luminoso. Il mio orgoglio." },
      { text: "Ma quando i sognatori lo dimenticarono... cominci\u00f2 a svanire. Il vuoto crebbe. E le Ombre sussurrarono dall'interno dell'Abisso." },
      { text: "Gli promisero che non sarebbe mai pi\u00f9 stato dimenticato." },
      { text: "Ruppe il sigillo. Le Ombre lo consumarono. Hikari divenne Kurayami \u2014 il re degli Incubi." },
      { text: "Non potevo fermarlo. Avevo dato tutto per creare i guardiani. Per sigillare l'Abisso." },
      { text: "Ma ora... non siamo soli." },
      { text: "Siamo con te." },
      { text: "Vediamo la tua luce." },
      { text: "Crediamo in te." },
      { text: "Siamo con te attraverso l'infinito." },
      { text: "Bruciamo al tuo fianco." },
      { text: "Fluiamo come uno." },
      { text: "Sei pronto, sognatore?", button: "Entra nell'Abisso" }
    ],

    abyssMidpoint: [
      { text: "Sei ancora qui." },
      { text: "Sai cosa si prova a svanire? A dare tutto... e venire dimenticato?" },
      { text: "Le Ombre mi offrirono una scelta. Scomparire per sempre... o diventare qualcosa che non avrebbero mai dimenticato." },
      { text: "Ho scelto." },
      { text: "Tutti si arrendono prima o poi.", button: "Continua" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. Sempre la prima a combattere." },
          { text: "Sei stata anche la prima a cadere. Lo ricordi?" },
          { text: "Ricordo di aver cercato di fermarti. E lo farei di nuovo." },
          { text: "Coraggiosa. Ma il coraggio senza forza \u00e8 solo rumore.", button: "Inizia" }
        ],
        post: [
          { text: "Ancora in piedi, Kurayami." },
          { text: "...per ora." },
          { text: "Freeze \u00e8 con te.", button: "Continua" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. Quello che vede tutto." },
          { text: "Dimmi \u2014 se vedevi cosa mi stava succedendo... perch\u00e9 non hai fatto nulla?" },
          { text: "..." },
          { text: "Perch\u00e9 credevo che avresti trovato la tua strada. Mi sbagliavo." },
          { text: "Almeno sei onesto. Questo rende il distruggerti quasi triste.", button: "Inizia" }
        ],
        post: [
          { text: "Il dubbio \u00e8 la tua arma, Kurayami. Ma questo sognatore non dubita." },
          { text: "Tutti dubitano. \u00c8 solo questione di tempo." },
          { text: "Insight \u00e8 stato sbloccato.", button: "Continua" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. Sempre a credere che tutto possa crescere." },
          { text: "Perch\u00e9 pu\u00f2. Anche tu." },
          { text: "Pensi che io possa tornare? Che possa 'ricrescere' nella luce?" },
          { text: "Lo credo con tutto il mio essere." },
          { text: "...sei la pi\u00f9 sciocca di tutti.", button: "Inizia" }
        ],
        post: [
          { text: "Le radici pi\u00f9 forti crescono nell'oscurit\u00e0." },
          { text: "..." },
          { text: "Restore \u00e8 stato sbloccato.", button: "Continua" }
        ]
      },
      4: {
        pre: [
          { text: "Uch\u016B. Il silenzioso." },
          { text: "Conosco il vuoto, Kurayami. Ci ho vissuto pi\u00f9 a lungo di te." },
          { text: "Allora capisci. Capisci perch\u00e9 ho fatto quello che ho fatto." },
          { text: "Capisco il dolore. Non giustifico la distruzione." },
          { text: "...sei l'unico che capisce qualcosa.", button: "Inizia" }
        ],
        post: [
          { text: "Anche le stelle muoiono. E rinascono." },
          { text: "Non tutte." },
          { text: "Cosmic Solve \u00e8 stato sbloccato.", button: "Continua" }
        ]
      },
      5: {
        pre: [
          { text: "Fatemi andare per primo. FATEMI BRUCIARLO." },
          { text: "Kaen. Tutto fuoco e nessun controllo." },
          { text: "Sei un TRADITORE. Ci hai messi a dormire. La tua stessa famiglia!" },
          { text: "Famiglia. Che razza di famiglia dimentica uno dei suoi?" },
          { text: "NON TI ABBIAMO DIMENTICATO! Hai smesso di ascoltare!" },
          { text: "...forse. Ma ormai \u00e8 troppo tardi.", button: "Inizia" }
        ],
        post: [
          { text: "Quando tutto sar\u00e0 finito... parleremo. Tu e io." },
          { text: "Se rester\u00e0 qualcosa di me con cui parlare." },
          { text: "Blaze Skip \u00e8 stato sbloccato.", button: "Continua" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "Quel nome\u2014" },
          { text: "Ti chiamer\u00f2 come voglio. Sei il mio fratello maggiore." },
          { text: "..." },
          { text: "Ti ricordi quando mi hai insegnato a fluire? Quando le correnti erano forti." },
          { text: "...taci." },
          { text: "Mi hai detto: 'Non combattere l'acqua, Nami. Fluisci con essa.'" },
          { text: "BASTA." },
          { text: "Ti ricorder\u00f2 chi eri. Anche se non lo vuoi.", button: "Inizia" }
        ],
        post: [
          { text: "Sei ancora l\u00ec dentro. Lo so." },
          { text: "...non farmi questo, Nami." },
          { text: "Simplify \u00e8 stato sbloccato.", button: "Continua" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "Tu... ti sei ricordato." },
      { text: "Dopo tutto quello che ho fatto... mi chiami ancora con quel nome." },
      { text: "Sei mio figlio. La mia prima creazione. La mia luce pi\u00f9 brillante." },
      { text: "Ho lasciato entrare le Ombre troppo in profondit\u00e0. Ora sono parte di me." },
      { text: "Non posso tornare. Non ancora." },
      { text: "Ma tu non ti sei arreso. Nemmeno quando l'oscurit\u00e0 era ovunque." },
      { text: "Forse... in un altro sogno." },
      { text: "L'oscurit\u00e0 si sta sollevando." },
      { text: "Riesco a vedere la luce di nuovo." },
      { text: "Ti ha chiamato Padre. Si ricorda ancora." },
      { text: "Il vuoto non \u00e8 per sempre. Anche le stelle rinascono." },
      { text: "...non lo perdono. Non ancora. Ma forse... un giorno." },
      { text: "Ha detto 'forse.' Per ora basta cos\u00ec." },
      { text: "Il Mondo dei Sogni \u00e8 salvo. Grazie a te, sognatore.", button: "Continua" }
    ],

    finale: [
      { text: "Ce l'hai fatta, sognatore." },
      { text: "Tutti e sei i reami brillano. Tutti e sei i guardiani sono al tuo fianco." },
      { text: "E il sigillo \u00e8 di nuovo intero." },
      { text: "Molto tempo fa, ho costruito questo mondo dal nulla. Pensavo di dover proteggere tutti da solo." },
      { text: "Mi sbagliavo. Mi hai mostrato che la luce diventa pi\u00f9 forte quando viene condivisa." },
      { text: "Hai sciolto il freddo." },
      { text: "Hai visto oltre il dubbio." },
      { text: "Sei cresciuto attraverso la lotta." },
      { text: "Hai raggiunto l'infinito." },
      { text: "Hai bruciato le barriere." },
      { text: "Hai fluito attraverso ogni sfida." },
      { text: "Gli Incubi torneranno un giorno. Tornano sempre." },
      { text: "Ma tu hai fatto ci\u00f2 che nessun sognatore ha mai fatto prima." },
      { text: "Perci\u00f2 ti offro questo dono." },
      { text: "D'ora in poi, potrai tornare nel Mondo dei Sogni quando vorrai." },
      { text: "Niente stadi. Niente limiti. Solo tu e i numeri, per tutto il tempo che vorrai restare." },
      { text: "I guardiani saranno qui. Io sar\u00f2 qui." },
      { text: "Torna ogni notte, sognatore. Mantieni la tua luce viva." },
      { text: "E forse... forse un giorno... Hikari trover\u00e0 la strada di casa." },
      { text: "Nel profondo dell'Abisso, oltre il sigillo, in un angolo dove nessuna luce arriva..." },
      { text: "Una piccola scintilla dorata tremola." },
      { text: "...Padre..." },
      { text: "FINE... ?" },
      { text: "", button: "Entra nel Sogno Infinito" }
    ]
  },

  // === APP META ===
  appDescription: 'Allena la mente. Illumina l\'oscurit\u00e0.',
};

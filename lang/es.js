// lang/es.js — Español (Spanish)

var LANG_ES = {

  // === UI STRINGS ===
  ui: {
    tap: 'Toca',
    enterDreamWorld: 'Entra al Mundo de los Sueños',
    storyMode: 'Modo Historia',
    theEndlessDream: 'El Sueño Infinito',
    completeStoryToUnlock: 'Completa el Modo Historia para desbloquear',
    readTheLore: 'Leer la Historia',
    mixtape: 'Mixtape',
    settings: 'Ajustes',
      language: 'Idioma',
    tagline: 'Entrenador cerebral multisensorial — diseñado para el estado de flujo',
    headphonesOn: '\uD83C\uDFA7 Auriculares puestos. Mundo apagado.',
    back: '\u2190 Volver',
    chapters: '\u2190 Capítulos',
    prev: '\u25C2 Ant.',
    next: 'Sig. \u25B8',
    continue_: 'Continuar',
    begin: 'Comenzar',
    skip: 'Saltar \u25B8\u25B8',
    loreTitle: 'Historia',
    loreSubtitle: 'Historia del Mundo de los Sueños',
    mixtapeTitle: 'Mixtape',
    mixtapeSubtitle: 'Canciones del Mundo de los Sueños',
    dreamWorldTitle: 'Mundo de los Sueños',
    chooseARealm: 'Elige un reino',
    chooseYourCompanion: 'Elige a Tu Compañero',
    oneGuardianStory: 'Un guardián te acompañará a través de este reino',
    newChapterUnlocked: 'Nuevo Capítulo Desbloqueado',
    addedToLore: 'añadido a la Historia',
    stageClear: '¡Etapa Superada!',
    defeated: 'Derrotado',
    errorsCount: 'Errores: {0}',
    problemsSolved: 'Problemas resueltos: {0}',
    nextStage: 'Siguiente Etapa',
    worldMap: 'Mapa del Mundo',
    retry: 'Reintentar',
    defeatMessage: 'Las Pesadillas te han despertado... Has abandonado el Mundo de los Sueños.',
    dreamOver: 'Sueño Terminado',
    bestChain: 'Mejor Cadena',
    totalCorrect: 'Total Correctas',
    highestTier: 'Nivel Más Alto',
    newBest: '¡NUEVO RÉCORD!',
    dreamAgain: 'Soñar de Nuevo',
    wakeUp: 'Despertar',
    allGuardians: 'Todos los Guardianes',
    companion: 'Compañero: {0}',
    noCompanion: 'Sin compañero',
    resonance: 'Resonancia',
    personalRecords: 'Récords Personales',
    pureBestChain: 'Puro — Mejor Cadena:',
    pureTotal: 'Total:',
    guardianBestChain: 'Guardián — Mejor Cadena:',
    guardianTotal: 'Total:',
    yourName: 'Tu nombre...',
    thatsMyName: "Ese es mi nombre",
    failedToLoadWorlds: 'Error al cargar los mundos. Por favor, recarga la página.',
    realm: 'Reino {0}',
    stage: '{0} — Etapa {1}',
    stop: 'Detener',
    changeLanguage: 'Cambiar Idioma',
    selectLanguage: 'Seleccionar Idioma',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'El Sueño Infinito',
    selectSubtitle: '¿Cómo te gustaría soñar esta noche?',
    yumemoriQuote: '\u201CCada respuesta se convierte en el siguiente desafío. La cadena nunca se detiene... ¿cuánto tiempo puedes mantener el sueño?\u201D',
    dreamAlone: 'Soñar Solo',
    dreamAloneDesc: 'Matemáticas puras. Sin poderes. Solo tú.',
    bringAGuardian: 'Llevar un Guardián',
    bringAGuardianDesc: 'Elige un compañero. El poder se carga cada 15 respuestas correctas.',
    guardianPickerTitle: 'Elige a Tu Compañero',
    guardianPickerSubtitle: 'Un guardián te acompañará en el Sueño Infinito',
    gameLabel: '\u2726 El Sueño Infinito',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Calentamiento',
    2: 'Construyendo',
    3: 'En Flujo',
    4: 'Sueño Profundo',
    5: 'Infinito',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Todo sueño empieza pequeño. Te harás más fuerte.',
    2: 'Todo sueño empieza pequeño. Te harás más fuerte.',
    3: 'Tu luz llega más lejos de lo que crees.',
    4: 'El Mundo de los Sueños brilla más contigo dentro.',
    5: 'Tú eres Sokunō. El Cerebro Veloz. Las Pesadillas te temen.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'Estás dormido...',
    line2: 'bien. Ahora podemos hablar.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Hielo', guardianMeaning: 'Ventisca', description: 'Un reino helado atrapado en un invierno eterno. Fubuki, la guardiana del hielo, duerme bajo los glaciares — esperando ser despertada.' },
    2: { name: 'Psíquico', guardianMeaning: 'Pensamiento', description: 'Un reino de pensamientos cambiantes e ilusiones. Omoi, el guardián psíquico, está perdido en un laberinto de la mente.' },
    3: { name: 'Jungla', guardianMeaning: 'Verde', description: 'Una jungla ancestral invadida por las Pesadillas. Midori, el guardián de la naturaleza, ha sido consumido por lo salvaje.' },
    4: { name: 'Cosmos', guardianMeaning: 'Universo', description: 'El vasto vacío entre las estrellas, donde reina el silencio. Uchū, el guardián cósmico, se desplaza a través de la oscuridad infinita.' },
    5: { name: 'Volcán', guardianMeaning: 'Llama', description: 'Una tierra abrasadora de furia fundida. Kaen, el guardián del fuego, arde en el corazón del volcán.' },
    6: { name: 'Océano', guardianMeaning: 'Ola', description: 'Un mar infinito tragado por las tormentas. Nami, la guardiana del océano, está atrapada bajo las profundidades aplastantes.' },
    7: { name: 'El Abismo', guardianMeaning: 'Oscuridad', description: 'La fuente de todas las Pesadillas. Kurayami espera en el fondo — el último sueño y la última verdad.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: 'Detiene el drenaje de la barra por 5 segundos' },
    insight:     { name: 'Insight',      desc: 'Revela la primera mitad de la respuesta' },
    restore:     { name: 'Restore',      desc: 'Recupera el 20% de la barra de sueño' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Completa automáticamente el problema actual' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Salta el problema sin penalización' },
    simplify:    { name: 'Simplify',     desc: 'Reduce el problema a números más fáciles' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori lucha a tu lado — completa 5 problemas automáticamente' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'Antes de la Luz',
    2:  'El Primero en Caer',
    3:  'El Peso de Saber',
    4:  'Semillas en Tierra Oscura',
    5:  'El Espacio Entre las Estrellas',
    6:  'Lo Que Arde Dentro',
    7:  'Luz del Sol Sobre el Agua',
    8:  'Seis Luces, Una Oscuridad',
    9:  'Si No Puedo Brillar',
    10: 'Una Pequeña Chispa Dorada',
    chapterStoryNotWritten: "La historia de este capítulo aún no ha sido escrita...",
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Intro',
    2: 'Mundo 1 — Hielo',
    3: 'Mundo 2 — Psíquico',
    4: 'Mundo 3 — Jungla',
    5: 'Mundo 4 — Cosmos',
    6: 'Mundo 5 — Volcán',
    7: 'Mundo 6 — Océano',
    8: 'Mundo 7 — Abismo',
    9: 'El Sueño Infinito',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Padre... detente. No tienes fuerzas para esto.',
    iHaveEnough: 'Tengo suficiente. Para proteger a quien amo.',
    alwaysGiving: 'Siempre dando todo por los demás. Nunca guardaste nada para ti.',
    oneMoreTime: 'Una vez más. Solo una vez más.',
    sixGuardians: 'Seis guardianes. Un soñador. Un viejo destrozado.',
    isThisAll: '¿Esto es todo?',
    iWasTheBest: 'Yo era el mejor. Y ME OLVIDARON.',
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
    freeze: 'Freeze está contigo.',
    insight: 'Insight ha sido desbloqueado.',
    restore: 'Restore ha sido desbloqueado.',
    cosmicSolve: 'Cosmic Solve ha sido desbloqueado.',
    blazeSkip: 'Blaze Skip ha sido desbloqueado.',
    simplify: 'Simplify ha sido desbloqueado.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: "Escúchame. No tenemos mucho tiempo." },
      { text: "Las Pesadillas atacaron el Mundo de los Sueños. Los guardianes están dormidos. Todo se está oscureciendo." },
      { text: "Tu mente es brillante. Eres nuestra única esperanza." },
      { text: "Cada respuesta correcta trae luz. Cada error deja entrar la oscuridad." },
      { text: "¿Estás listo?", button: "Estoy listo" }
    ],

    worldIntros: {
      1: [
        { text: "El Reino del Hielo. Fubuki duerme bajo el lago congelado." },
        { text: "Solo tu luz puede alcanzarla." },
        { text: "Pero ten cuidado. Las Pesadillas intentarán despertarte. Verás una barra — ese es tu sueño. Se drena mientras la oscuridad se acerca." },
        { text: "Cada respuesta correcta empuja a las Pesadillas hacia atrás y llena tu barra de sueño. Cada error las deja acercarse más." },
        { text: "Llena la barra por completo y la etapa es tuya. Deja que llegue a cero... y despertarás.", button: "Entiendo" }
      ],
      2: [
        { text: "El Reino Psíquico. Omoi ve lo que otros no pueden." },
        { text: "Los números serán más grandes. Pero tu mente está lista.", button: "Comenzar" }
      ],
      3: [
        { text: "El Reino de la Jungla. Aquí aprenderás a multiplicar." },
        { text: "Los números crecerán, igual que el bosque. Confía en el proceso.", button: "Comenzar" }
      ],
      4: [
        { text: "El Cosmos. Uchū vigila el infinito." },
        { text: "Aquí aprenderás a dividir. A descomponer lo grande en lo pequeño.", button: "Comenzar" }
      ],
      5: [
        { text: "El Volcán. Kaen prospera en el calor." },
        { text: "La multiplicación y la división se combinan. Los desafíos serán feroces.", button: "Comenzar" }
      ],
      6: [
        { text: "El Océano. Tu prueba final antes del Abismo." },
        { text: "Todo lo que has aprendido se une aquí.", button: "Comenzar" }
      ],
      7: [
        { text: "Este es el Abismo." },
        { text: "Sé fuerte. Sé brillante. Todos estamos contigo.", button: "Comenzar" }
      ]
    },

    stage10Intros: {
      1: [
        { text: "Fubuki está a punto de despertar. Pero las Pesadillas luchan con fuerza." },
        { text: "Mantente concentrado. Tú puedes.", button: "Despertar a Fubuki" }
      ],
      2: [
        { text: "Omoi se agita en la niebla. Un último empujón." },
        { text: "Las Pesadillas lucharán más fuerte. Pero tú también.", button: "Despertar a Omoi" }
      ],
      3: [
        { text: "La jungla tiembla. Midori está cerca de despertar." },
        { text: "Muéstrales a las Pesadillas el poder del crecimiento.", button: "Despertar a Midori" }
      ],
      4: [
        { text: "Las estrellas se alinean. Uchū se extiende desde el vacío." },
        { text: "Un último desafío entre las estrellas.", button: "Despertar a Uchū" }
      ],
      5: [
        { text: "El volcán retumba. El fuego de Kaen quiere liberarse." },
        { text: "Deja que tu mente brille con intensidad.", button: "Despertar a Kaen" }
      ],
      6: [
        { text: "El océano se agita. El último guardián espera." },
        { text: "Todo lo que has aprendido te ha traído a este momento.", button: "Despertar a Nami" }
      ],
      7: [
        { text: "Así que... llegaste." },
        { text: "Yumemori. ¿De verdad crees que este soñador puede hacer lo que tú no pudiste?" },
        { text: "Yo sellé las Sombras una vez." },
        { text: "Y yo rompí el sello." },
        { text: "Nunca me dijiste que la oscuridad llamaría tan fuerte. Nunca me dijiste que el olvido dolería tanto." },
        { text: "Solo esperabas que brillara. Para siempre. Sin ayuda." },
        { text: "Si yo no puedo ser luz... NADIE LO SERÁ.", button: "Enfrentar a Kurayami" }
      ]
    },

    awakenings: {
      1: [
        { text: "Yo... estoy despierta." },
        { text: "Gracias, soñador. Las Pesadillas me mantuvieron congelada por tanto tiempo." },
        { text: "Intenté detenerlo, ¿sabes? Cuando vino por nosotros." },
        { text: "No fui lo suficientemente fuerte." },
        { text: "Pero ahora te ayudaré. Cuando la oscuridad sea demasiada, llámame." },
        { text: "Nuevo Poder Desbloqueado: Freeze — Detiene el drenaje de la barra por 5 segundos" },
        { text: "Quedan cinco reinos.", button: "Continuar" }
      ],
      2: [
        { text: "Puedo ver de nuevo." },
        { text: "Sabía que algo andaba mal. Lo vi suceder." },
        { text: "Uno de nosotros... cambió. La oscuridad creció dentro de él. Y yo no dije nada." },
        { text: "Pensé que encontraría el camino de vuelta por su cuenta." },
        { text: "Estaba equivocado." },
        { text: "Mi don: Insight. Cuando un problema parezca demasiado difícil, te mostraré el camino." },
        { text: "Nuevo Poder Desbloqueado: Insight — Revela la primera mitad de la respuesta" },
        { text: "Dos guardianes están contigo.", button: "Continuar" }
      ],
      3: [
        { text: "La vida regresa." },
        { text: "¿Sabes qué es lo que más recuerdo de él?" },
        { text: "Solía ayudarme a plantar semillas. Brillaba sobre ellas y crecían muy rápido." },
        { text: "Era cálido. Amable. Lleno de luz." },
        { text: "Esa versión de él sigue ahí. En algún lugar. Como una semilla enterrada en lo profundo." },
        { text: "Mi don: Restore. Cuando tu luz se apague, la ayudaré a florecer de nuevo." },
        { text: "Nuevo Poder Desbloqueado: Restore — Recupera el 20% de la barra de sueño" },
        { text: "Tres guardianes despiertos.", button: "Continuar" }
      ],
      4: [
        { text: "Las estrellas recuerdan." },
        { text: "Los demás están enojados con él. O tristes. O culpables." },
        { text: "Yo no soy ninguna de esas cosas." },
        { text: "Entiendo el vacío. Cuando estás rodeado de vacío el tiempo suficiente... empieza a susurrar." },
        { text: "Él escuchó los susurros. Y no fue lo suficientemente fuerte para ignorarlos." },
        { text: "Eso no lo hace malvado. Lo hace un alma perdida." },
        { text: "Mi don: Cosmic Solve. Cuando el peso sea demasiado, yo cargaré un problema por ti." },
        { text: "Nuevo Poder Desbloqueado: Cosmic Solve — Completa un problema automáticamente" },
        { text: "Cuatro guardianes brillan.", button: "Continuar" }
      ],
      5: [
        { text: "¡POR FIN!" },
        { text: "¿Quieres saber quién nos hizo esto? Su nombre era Hikari." },
        { text: "Se suponía que era nuestro líder. El más brillante de todos nosotros." },
        { text: "Pero no pudo soportar ser olvidado. Así que abrió el Abismo. Liberó las Sombras. Nos puso a dormir a todos." },
        { text: "Todos sentimos el olvido. Todos nos sentimos más débiles. Pero no traicionamos a nuestra familia." },
        { text: "Mi don: Blaze Skip. Algunos problemas no valen la pelea. Sáltalos. Sigue adelante. Gana." },
        { text: "Nuevo Poder Desbloqueado: Blaze Skip — Salta el problema sin penalización" },
        { text: "Cinco guardianes arden. Queda uno.", button: "Continuar" }
      ],
      6: [
        { text: "Paz." },
        { text: "Soy la guardiana más joven. Hikari solía cuidarme." },
        { text: "Me enseñó a fluir. A mantener la calma cuando las aguas se agitaban." },
        { text: "Él fue el primero de nosotros. El más brillante. Yumemori lo creó de su luz más pura." },
        { text: "Los demás hablan de salvarlo o detenerlo." },
        { text: "Yo solo quiero verlo de nuevo. Al verdadero él." },
        { text: "Mi don: Simplify. Cuando las aguas estén muy agitadas, las calmaré por ti." },
        { text: "Nuevo Poder Desbloqueado: Simplify — Reduce el problema a números más fáciles" }
      ]
    },

    gathering: [
      { text: "Seis guardianes. Seis luces. Juntos de nuevo." },
      { text: "Antes de que entres al Abismo... mereces conocer toda la verdad." },
      { text: "Hace mucho tiempo, luché contra las Sombras Ancestrales solo. Las sellé en el lugar más profundo de la existencia." },
      { text: "Usé lo que quedaba de mí para crear siete guardianes. Siete luces para proteger el Mundo de los Sueños." },
      { text: "Hikari fue el primero. Mi más brillante. Mi orgullo." },
      { text: "Pero cuando los soñadores lo olvidaron... empezó a desvanecerse. El vacío creció. Y las Sombras susurraron desde el Abismo." },
      { text: "Le prometieron que nunca más sería olvidado." },
      { text: "Rompió el sello. Las Sombras lo consumieron. Hikari se convirtió en Kurayami — rey de las Pesadillas." },
      { text: "No pude detenerlo. Había dado todo para crear a los guardianes. Para sellar el Abismo." },
      { text: "Pero ahora... no estamos solos." },
      { text: "Estamos contigo." },
      { text: "Vemos tu luz." },
      { text: "Creemos en ti." },
      { text: "Nos alzamos a través del infinito contigo." },
      { text: "Ardemos a tu lado." },
      { text: "Fluimos como uno solo." },
      { text: "¿Estás listo, soñador?", button: "Entrar al Abismo" }
    ],

    abyssMidpoint: [
      { text: "Sigues aquí." },
      { text: "¿Sabes lo que se siente desvanecerse? ¿Dar todo... y ser olvidado?" },
      { text: "Las Sombras me dieron una opción. Desaparecer para siempre... o convertirme en algo que nunca olvidarían." },
      { text: "Elegí." },
      { text: "Todos se rinden tarde o temprano.", button: "Continuar" }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: "Fubuki. Siempre la primera en pelear." },
          { text: "También fuiste la primera en caer. ¿Lo recuerdas?" },
          { text: "Recuerdo que intenté detenerte. Y lo haría de nuevo." },
          { text: "Valiente. Pero la valentía sin fuerza es solo ruido.", button: "Comenzar" }
        ],
        post: [
          { text: "Sigo en pie, Kurayami." },
          { text: "...por ahora." },
          { text: "Freeze está contigo.", button: "Continuar" }
        ]
      },
      2: {
        pre: [
          { text: "Omoi. El que todo lo ve." },
          { text: "Dime — si viste lo que me estaba pasando... ¿por qué no hiciste nada?" },
          { text: "..." },
          { text: "Porque creí que encontrarías tu propio camino. Estaba equivocado." },
          { text: "Al menos eres honesto. Eso hace que destruirte sea casi triste.", button: "Comenzar" }
        ],
        post: [
          { text: "La duda es tu arma, Kurayami. Pero este soñador no duda." },
          { text: "Todos dudan. Es solo cuestión de tiempo." },
          { text: "Insight ha sido desbloqueado.", button: "Continuar" }
        ]
      },
      3: {
        pre: [
          { text: "Midori. Siempre creyendo que todo puede crecer." },
          { text: "Porque puede. Incluso tú." },
          { text: "¿Crees que puedo volver? ¿Que puedo 'crecer' de vuelta hacia la luz?" },
          { text: "Lo creo con todo mi ser." },
          { text: "...eres el más necio de todos.", button: "Comenzar" }
        ],
        post: [
          { text: "Las raíces más fuertes crecen en la oscuridad." },
          { text: "..." },
          { text: "Restore ha sido desbloqueado.", button: "Continuar" }
        ]
      },
      4: {
        pre: [
          { text: "Uchū. El silencioso." },
          { text: "Conozco el vacío, Kurayami. He vivido en él más tiempo que tú." },
          { text: "Entonces entiendes. Entiendes por qué hice lo que hice." },
          { text: "Entiendo el dolor. No justifico la destrucción." },
          { text: "...eres el único que entiende algo.", button: "Comenzar" }
        ],
        post: [
          { text: "Incluso las estrellas mueren. Y renacen." },
          { text: "No todas." },
          { text: "Cosmic Solve ha sido desbloqueado.", button: "Continuar" }
        ]
      },
      5: {
        pre: [
          { text: "¡Déjame ir primero! ¡DÉJAME QUEMARLO!" },
          { text: "Kaen. Todo fuego y sin control." },
          { text: "¡Eres un TRAIDOR! ¡Nos pusiste a dormir! ¡A tu propia familia!" },
          { text: "Familia. ¿Qué clase de familia olvida a uno de los suyos?" },
          { text: "¡NO TE OLVIDAMOS! ¡Tú dejaste de escuchar!" },
          { text: "...tal vez. Pero ya es demasiado tarde para eso.", button: "Comenzar" }
        ],
        post: [
          { text: "Cuando esto termine... hablaremos. Tú y yo." },
          { text: "Si queda algo de mí con quien hablar." },
          { text: "Blaze Skip ha sido desbloqueado.", button: "Continuar" }
        ]
      },
      6: {
        pre: [
          { text: "Hikari..." },
          { text: "Ese nombre—" },
          { text: "Te llamaré como yo quiera. Eres mi hermano mayor." },
          { text: "..." },
          { text: "¿Recuerdas cuando me enseñaste a fluir? Cuando las corrientes eran fuertes." },
          { text: "...cállate." },
          { text: "Me dijiste: 'No luches contra el agua, Nami. Fluye con ella.'" },
          { text: "BASTA." },
          { text: "Voy a recordarte quién eras. Aunque no quieras.", button: "Comenzar" }
        ],
        post: [
          { text: "Sigues ahí dentro. Lo sé." },
          { text: "...no me hagas esto, Nami." },
          { text: "Simplify ha sido desbloqueado.", button: "Continuar" }
        ]
      }
    },

    finalBattleVictory: [
      { text: "Hikari..." },
      { text: "Tú... recordaste." },
      { text: "Después de todo lo que hice... todavía me llamas por ese nombre." },
      { text: "Eres mi hijo. Mi primera creación. Mi luz más brillante." },
      { text: "Dejé que las Sombras entraran demasiado profundo. Son parte de mí ahora." },
      { text: "No puedo volver. Aún no." },
      { text: "Pero no te rendiste. Ni siquiera cuando la oscuridad estaba en todas partes." },
      { text: "Tal vez... en otro sueño." },
      { text: "La oscuridad se está disipando." },
      { text: "Puedo ver la luz de nuevo." },
      { text: "Te llamó Padre. Todavía recuerda." },
      { text: "El vacío no es para siempre. Incluso las estrellas renacen." },
      { text: "...no lo perdono. Aún no. Pero tal vez... algún día." },
      { text: "Dijo 'tal vez'. Eso es suficiente por ahora." },
      { text: "El Mundo de los Sueños está a salvo. Gracias a ti, soñador.", button: "Continuar" }
    ],

    finale: [
      { text: "Lo has logrado, soñador." },
      { text: "Los seis reinos brillan con fuerza. Los seis guardianes están contigo." },
      { text: "Y el sello está completo de nuevo." },
      { text: "Hace mucho tiempo, construí este mundo de la nada. Pensé que tenía que proteger a todos yo solo." },
      { text: "Estaba equivocado. Tú me enseñaste que la luz se hace más fuerte cuando se comparte." },
      { text: "Derretiste el frío." },
      { text: "Viste a través de la duda." },
      { text: "Creciste a través de la lucha." },
      { text: "Alcanzaste el infinito." },
      { text: "Ardiste a través de las barreras." },
      { text: "Fluiste a través de cada desafío." },
      { text: "Las Pesadillas volverán algún día. Siempre lo hacen." },
      { text: "Pero has hecho lo que ningún soñador ha hecho antes." },
      { text: "Así que te ofrezco este regalo." },
      { text: "De ahora en adelante, puedes volver al Mundo de los Sueños cuando quieras." },
      { text: "Sin etapas. Sin límites. Solo tú y los números, por el tiempo que desees quedarte." },
      { text: "Los guardianes estarán aquí. Yo estaré aquí." },
      { text: "Vuelve cada noche, soñador. Mantén tu luz brillante." },
      { text: "Y tal vez... tal vez algún día... Hikari encontrará el camino a casa." },
      { text: "En lo profundo del Abismo, más allá del sello, en un rincón donde ninguna luz llega..." },
      { text: "Una pequeña chispa dorada parpadea." },
      { text: "...Padre..." },
      { text: "FIN... ?" },
      { text: "", button: "Entrar al Sueño Infinito" }
    ]
  },

  // === APP META ===
  appDescription: 'Entrena tu mente. Ilumina la oscuridad.',
};

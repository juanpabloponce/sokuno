// lang/pt-BR.js — Português Brasileiro

var LANG_PT_BR = {

  // === UI STRINGS ===
  ui: {
    tap: 'Toque',
    enterDreamWorld: 'Entrar no Mundo dos Sonhos',
    storyMode: 'Modo História',
    theEndlessDream: 'O Sonho Infinito',
    completeStoryToUnlock: 'Complete o Modo História para desbloquear',
    readTheLore: 'Ler a Saga',
    mixtape: 'Mixtape',
    settings: 'Configurações',
      language: 'Idioma',
    tagline: 'Treino cerebral multissensorial — projetado para o estado de fluxo',
    headphonesOn: '\uD83C\uDFA7 Fones ligados. Mundo desligado.',
    back: '\u2190 Voltar',
    chapters: '\u2190 Capítulos',
    prev: '\u25C2 Anterior',
    next: 'Próximo \u25B8',
    continue_: 'Continuar',
    begin: 'Começar',
    skip: 'Pular \u25B8\u25B8',
    loreTitle: 'Saga',
    loreSubtitle: 'A História do Mundo dos Sonhos',
    mixtapeTitle: 'Mixtape',
    mixtapeSubtitle: 'Músicas do Mundo dos Sonhos',
    dreamWorldTitle: 'Mundo dos Sonhos',
    chooseARealm: 'Escolha um reino',
    chooseYourCompanion: 'Escolha Seu Guardião',
    oneGuardianStory: 'Um guardião irá acompanhá-lo por este reino',
    newChapterUnlocked: 'Novo Capítulo Desbloqueado',
    addedToLore: 'adicionado à Saga',
    stageClear: 'Fase Completa!',
    defeated: 'Derrotado',
    errorsCount: 'Erros: {0}',
    problemsSolved: 'Problemas resolvidos: {0}',
    nextStage: 'Próxima Fase',
    worldMap: 'Mapa do Mundo',
    retry: 'Tentar Novamente',
    defeatMessage: 'Os Pesadelos te acordaram... Você deixou o Mundo dos Sonhos.',
    dreamOver: 'Fim do Sonho',
    bestChain: 'Melhor Sequência',
    totalCorrect: 'Total de Acertos',
    highestTier: 'Maior Nível',
    newBest: 'NOVO RECORDE!',
    dreamAgain: 'Sonhar de Novo',
    wakeUp: 'Acordar',
    allGuardians: 'Todos os Guardiões',
    companion: 'Guardião: {0}',
    noCompanion: 'Sem guardião',
    resonance: 'Ressonância',
    personalRecords: 'Recordes Pessoais',
    pureBestChain: 'Puro — Melhor Sequência:',
    pureTotal: 'Total:',
    guardianBestChain: 'Guardião — Melhor Sequência:',
    guardianTotal: 'Total:',
    yourName: 'Seu nome...',
    thatsMyName: 'Esse é meu nome',
    failedToLoadWorlds: 'Falha ao carregar os mundos. Por favor, atualize a página.',
    realm: 'Reino {0}',
    stage: '{0} — Fase {1}',
    stop: 'Parar',
    changeLanguage: 'Mudar Idioma',
    selectLanguage: 'Selecionar Idioma',
  },

  // === FREESTYLE ===
  freestyle: {
    selectTitle: 'O Sonho Infinito',
    selectSubtitle: 'Como você quer sonhar esta noite?',
    yumemoriQuote: '\u201CCada resposta se torna o próximo desafio. A corrente nunca para... por quanto tempo você consegue manter o sonho?\u201D',
    dreamAlone: 'Sonhar Sozinho',
    dreamAloneDesc: 'Matemática pura. Sem poderes. Apenas você.',
    bringAGuardian: 'Trazer um Guardião',
    bringAGuardianDesc: 'Escolha um companheiro. O poder carrega a cada 15 acertos.',
    guardianPickerTitle: 'Escolha Seu Guardião',
    guardianPickerSubtitle: 'Um guardião irá acompanhá-lo no Sonho Infinito',
    gameLabel: '\u2726 O Sonho Infinito',
  },

  // === TIER NAMES ===
  tiers: {
    1: 'Aquecimento',
    2: 'Construindo',
    3: 'Fluindo',
    4: 'Sonho Profundo',
    5: 'Infinito',
  },

  // === TIER QUOTES ===
  tierQuotes: {
    1: 'Todo sonho começa pequeno. Você vai ficar mais forte.',
    2: 'Todo sonho começa pequeno. Você vai ficar mais forte.',
    3: 'Sua luz alcança mais longe do que você imagina.',
    4: 'O Mundo dos Sonhos brilha mais com você nele.',
    5: 'Você é Sokunō. O Cérebro Veloz. Os Pesadelos temem você.',
  },

  // === WAKEUP SEQUENCE ===
  wakeup: {
    line1: 'Você está dormindo...',
    line2: 'bom. Agora podemos conversar.',
  },

  // === WORLD DATA (translatable fields only — guardian names stay as-is) ===
  worlds: {
    1: { name: 'Gelo', guardianMeaning: 'Nevasca', description: 'Um reino congelado, preso em um inverno eterno. Fubuki, a guardiã do gelo, dorme sob as geleiras — esperando ser despertada.' },
    2: { name: 'Psíquico', guardianMeaning: 'Pensamento', description: 'Um reino de pensamentos mutáveis e ilusões. Omoi, o guardião psíquico, está perdido dentro de um labirinto da mente.' },
    3: { name: 'Selva', guardianMeaning: 'Verde', description: 'Uma selva antiga dominada pelos Pesadelos. Midori, a guardiã da natureza, foi consumida pela floresta selvagem.' },
    4: { name: 'Cosmos', guardianMeaning: 'Universo', description: 'O vasto vazio entre as estrelas, onde o silêncio reina. Uchū, o guardião cósmico, vaga pela escuridão infinita.' },
    5: { name: 'Vulcão', guardianMeaning: 'Chama', description: 'Uma terra escaldante de fúria derretida. Kaen, o guardião do fogo, arde no coração do vulcão.' },
    6: { name: 'Oceano', guardianMeaning: 'Onda', description: 'Um mar sem fim engolido por tempestades. Nami, a guardiã do oceano, está presa nas profundezas esmagadoras.' },
    7: { name: 'O Abismo', guardianMeaning: 'Escuridão', description: 'A origem de todos os Pesadelos. Kurayami espera no fundo — o último sonho, e a última verdade.' },
  },

  // === POWER DATA ===
  powers: {
    freeze:      { name: 'Freeze',       desc: 'Congela a barra de sono por 5 segundos' },
    insight:     { name: 'Insight',      desc: 'Revela a primeira metade da resposta' },
    restore:     { name: 'Restore',      desc: 'Recupera 20% da barra de sono' },
    cosmicSolve: { name: 'Cosmic Solve', desc: 'Resolve o problema atual automaticamente' },
    blazeSkip:   { name: 'Blaze Skip',   desc: 'Pula o problema sem penalidade' },
    simplify:    { name: 'Simplify',     desc: 'Reduz o problema para números mais fáceis' },
    rememberMe:  { name: 'Remember Me',  desc: 'Yumemori luta ao seu lado — resolve 5 problemas automaticamente' },
  },

  // === LORE CHAPTER NAMES ===
  lore: {
    1:  'Antes da Luz',
    2:  'O Primeiro a Cair',
    3:  'O Peso de Saber',
    4:  'Sementes em Solo Escuro',
    5:  'O Espaço Entre as Estrelas',
    6:  'O Que Arde por Dentro',
    7:  'Luz do Sol na Água',
    8:  'Seis Luzes, Uma Escuridão',
    9:  'Se Eu Não Posso Brilhar',
    10: 'Uma Pequena Faísca Dourada',
    chapterStoryNotWritten: 'A história deste capítulo ainda não foi escrita...',
  },

  // === MIXTAPE ORIGIN LABELS ===
  mixtapeOrigins: {
    1: 'Introdução',
    2: 'Mundo 1 — Gelo',
    3: 'Mundo 2 — Psíquico',
    4: 'Mundo 3 — Selva',
    5: 'Mundo 4 — Cosmos',
    6: 'Mundo 5 — Vulcão',
    7: 'Mundo 6 — Oceano',
    8: 'Mundo 7 — Abismo',
    9: 'O Sonho Infinito',
  },

  // === BATTLE TOASTS ===
  battleToasts: {
    fatherStop: '...Pai... pare. Você não tem forças para isso.',
    iHaveEnough: 'Eu tenho o suficiente. Para proteger quem eu amo.',
    alwaysGiving: 'Sempre dando tudo pelos outros. Você nunca guardou nada para si.',
    oneMoreTime: 'Mais uma vez. Só mais uma vez.',
    sixGuardians: 'Seis guardiões. Um sonhador. Um velho quebrado.',
    isThisAll: 'É só isso?',
    iWasTheBest: 'Eu era o melhor. E ELES ME ESQUECERAM.',
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
    freeze: 'Freeze está com você.',
    insight: 'Insight foi desbloqueado.',
    restore: 'Restore foi desbloqueado.',
    cosmicSolve: 'Cosmic Solve foi desbloqueado.',
    blazeSkip: 'Blaze Skip foi desbloqueado.',
    simplify: 'Simplify foi desbloqueado.',
  },

  // === DIALOGUES ===
  // Only text and button fields — speaker and emoji come from DIALOGUES_DATA
  dialogues: {
    intro: [
      { text: 'Ouça. Não temos muito tempo.' },
      { text: 'Os Pesadelos atacaram o Mundo dos Sonhos. Os guardiões estão adormecidos. Tudo está escurecendo.' },
      { text: 'Sua mente é brilhante. Você é nossa única esperança.' },
      { text: 'Cada resposta certa traz luz. Cada erro deixa a escuridão entrar.' },
      { text: 'Você está pronto?', button: 'Estou pronto' }
    ],

    worldIntros: {
      1: [
        { text: 'O Reino do Gelo. Fubuki dorme sob o lago congelado.' },
        { text: 'Só a sua luz pode alcançá-la.' },
        { text: 'Mas cuidado. Os Pesadelos vão tentar te acordar. Você verá uma barra — esse é o seu sono. Ela drena conforme a escuridão se aproxima.' },
        { text: 'Cada resposta certa empurra os Pesadelos para trás e preenche sua barra de sono. Cada erro os deixa mais perto.' },
        { text: 'Preencha a barra completamente e a fase é sua. Deixe ela chegar a zero... e você acorda.', button: 'Entendi' }
      ],
      2: [
        { text: 'O Reino Psíquico. Omoi enxerga o que outros não conseguem.' },
        { text: 'Os números vão ficar maiores. Mas sua mente está pronta.', button: 'Começar' }
      ],
      3: [
        { text: 'O Reino da Selva. Aqui, você aprenderá a multiplicar.' },
        { text: 'Os números vão crescer, assim como a floresta. Confie no processo.', button: 'Começar' }
      ],
      4: [
        { text: 'O Cosmos. Uchū observa o infinito.' },
        { text: 'Aqui, você aprenderá a dividir. A quebrar o grande em pequeno.', button: 'Começar' }
      ],
      5: [
        { text: 'O Vulcão. Kaen prospera no calor.' },
        { text: 'Multiplicação e divisão se combinam. Os desafios serão intensos.', button: 'Começar' }
      ],
      6: [
        { text: 'O Oceano. Seu teste final antes do Abismo.' },
        { text: 'Tudo que você aprendeu se une aqui.', button: 'Começar' }
      ],
      7: [
        { text: 'Este é o Abismo.' },
        { text: 'Seja forte. Seja brilhante. Estamos todos com você.', button: 'Começar' }
      ]
    },

    stage10Intros: {
      1: [
        { text: 'Fubuki está quase acordando. Mas os Pesadelos estão lutando com força.' },
        { text: 'Mantenha o foco. Você consegue.', button: 'Despertar Fubuki' }
      ],
      2: [
        { text: 'Omoi se agita na névoa. Um último esforço.' },
        { text: 'Os Pesadelos vão lutar mais forte. Mas você também.', button: 'Despertar Omoi' }
      ],
      3: [
        { text: 'A selva treme. Midori está perto de despertar.' },
        { text: 'Mostre aos Pesadelos o poder do crescimento.', button: 'Despertar Midori' }
      ],
      4: [
        { text: 'As estrelas estão se alinhando. Uchū estende a mão do vazio.' },
        { text: 'Um último desafio entre as estrelas.', button: 'Despertar Uchū' }
      ],
      5: [
        { text: 'O vulcão treme. O fogo de Kaen quer se libertar.' },
        { text: 'Deixe sua mente brilhar intensamente.', button: 'Despertar Kaen' }
      ],
      6: [
        { text: 'O oceano se agita. O último guardião espera.' },
        { text: 'Tudo que você aprendeu leva a este momento.', button: 'Despertar Nami' }
      ],
      7: [
        { text: 'Então. Você chegou.' },
        { text: 'Yumemori. Você realmente acha que este sonhador consegue fazer o que você não conseguiu?' },
        { text: 'Eu selei as Sombras uma vez.' },
        { text: 'E eu quebrei o selo.' },
        { text: 'Você nunca me disse que a escuridão chamaria tão alto. Nunca me disse que o esquecimento doeria tanto.' },
        { text: 'Você só esperava que eu brilhasse. Para sempre. Sem ajuda.' },
        { text: 'Se eu não posso ser luz... NINGUÉM SERÁ.', button: 'Enfrentar Kurayami' }
      ]
    },

    awakenings: {
      1: [
        { text: 'Eu... estou acordada.' },
        { text: 'Obrigada, sonhador. Os Pesadelos me mantiveram congelada por tanto tempo.' },
        { text: 'Eu tentei detê-lo, sabia? Quando ele veio atrás de nós.' },
        { text: 'Eu não fui forte o bastante.' },
        { text: 'Mas agora vou te ajudar. Quando a escuridão parecer forte demais, me chame.' },
        { text: 'Novo Poder Desbloqueado: Freeze — Congela a barra de sono por 5 segundos' },
        { text: 'Cinco reinos restam.', button: 'Continuar' }
      ],
      2: [
        { text: 'Eu posso ver de novo.' },
        { text: 'Eu sabia que algo estava errado. Eu vi acontecendo.' },
        { text: 'Um de nós... mudou. A escuridão cresceu dentro dele. E eu não disse nada.' },
        { text: 'Eu achei que ele encontraria o caminho de volta sozinho.' },
        { text: 'Eu estava errado.' },
        { text: 'Meu dom: Insight. Quando um problema parecer difícil demais, eu mostrarei o caminho.' },
        { text: 'Novo Poder Desbloqueado: Insight — Revela a primeira metade da resposta' },
        { text: 'Dois guardiões estão com você.', button: 'Continuar' }
      ],
      3: [
        { text: 'A vida retorna.' },
        { text: 'Sabe o que eu mais lembro dele?' },
        { text: 'Ele costumava me ajudar a plantar sementes. Ele brilhava sobre elas e elas cresciam tão rápido.' },
        { text: 'Ele era caloroso. Gentil. Cheio de luz.' },
        { text: 'Aquela versão dele ainda está lá. Em algum lugar. Como uma semente enterrada nas profundezas.' },
        { text: 'Meu dom: Restore. Quando sua luz enfraquecer, eu a farei florescer de novo.' },
        { text: 'Novo Poder Desbloqueado: Restore — Recupera 20% da barra de sono' },
        { text: 'Três guardiões despertos.', button: 'Continuar' }
      ],
      4: [
        { text: 'As estrelas se lembram.' },
        { text: 'Os outros estão com raiva dele. Ou tristes. Ou culpados.' },
        { text: 'Eu não sou nenhum desses.' },
        { text: 'Eu entendo o vazio. Quando você é cercado pelo nada por tempo suficiente... ele começa a sussurrar.' },
        { text: 'Ele ouviu os sussurros. E não foi forte o bastante para ignorá-los.' },
        { text: 'Isso não o torna mau. Torna-o perdido.' },
        { text: 'Meu dom: Cosmic Solve. Quando o peso for grande demais, eu carregarei um problema por você.' },
        { text: 'Novo Poder Desbloqueado: Cosmic Solve — Resolve um problema automaticamente' },
        { text: 'Quatro guardiões brilham.', button: 'Continuar' }
      ],
      5: [
        { text: 'FINALMENTE!' },
        { text: 'Quer saber quem fez isso com a gente? O nome dele era Hikari.' },
        { text: 'Ele deveria ser nosso líder. O mais brilhante de todos nós.' },
        { text: 'Mas ele não aguentou ser esquecido. Então abriu o Abismo. Libertou as Sombras. Colocou todos nós para dormir.' },
        { text: 'Todos nós sentimos o esquecimento. Todos nós ficamos mais fracos. Mas nós não traímos nossa família.' },
        { text: 'Meu dom: Blaze Skip. Alguns problemas não valem a luta. Pule-os. Siga em frente. Vença.' },
        { text: 'Novo Poder Desbloqueado: Blaze Skip — Pula o problema sem penalidade' },
        { text: 'Cinco guardiões ardem. Um resta.', button: 'Continuar' }
      ],
      6: [
        { text: 'Paz.' },
        { text: 'Eu sou a guardiã mais jovem. Hikari costumava cuidar de mim.' },
        { text: 'Ele me ensinou a fluir. A manter a calma quando as águas ficavam agitadas.' },
        { text: 'Ele foi o primeiro de nós. O mais brilhante. Yumemori o fez de sua luz mais pura.' },
        { text: 'Os outros falam em salvá-lo ou detê-lo.' },
        { text: 'Eu só quero vê-lo de novo. O verdadeiro ele.' },
        { text: 'Meu dom: Simplify. Quando as águas estiverem agitadas demais, eu as acalmarei para você.' },
        { text: 'Novo Poder Desbloqueado: Simplify — Reduz o problema para números mais fáceis' }
      ]
    },

    gathering: [
      { text: 'Seis guardiões. Seis luzes. Juntos de novo.' },
      { text: 'Antes de entrar no Abismo... você merece saber toda a verdade.' },
      { text: 'Há muito tempo, eu lutei contra as Sombras Ancestrais sozinho. Eu as selei no lugar mais profundo da existência.' },
      { text: 'Usei o que restava de mim para criar sete guardiões. Sete luzes para proteger o Mundo dos Sonhos.' },
      { text: 'Hikari foi o primeiro. Meu mais brilhante. Meu orgulho.' },
      { text: 'Mas quando os sonhadores o esqueceram... ele começou a desaparecer. O vazio cresceu. E as Sombras sussurravam de dentro do Abismo.' },
      { text: 'Elas prometeram que ele nunca mais seria esquecido.' },
      { text: 'Ele quebrou o selo. As Sombras o consumiram. Hikari se tornou Kurayami — rei dos Pesadelos.' },
      { text: 'Eu não consegui detê-lo. Eu tinha dado tudo para criar os guardiões. Para selar o Abismo.' },
      { text: 'Mas agora... não estamos sozinhos.' },
      { text: 'Estamos com você.' },
      { text: 'Nós vemos sua luz.' },
      { text: 'Nós acreditamos em você.' },
      { text: 'Nós estamos ao seu lado através do infinito.' },
      { text: 'Nós ardemos ao seu lado.' },
      { text: 'Nós fluímos como um só.' },
      { text: 'Você está pronto, sonhador?', button: 'Entrar no Abismo' }
    ],

    abyssMidpoint: [
      { text: 'Você ainda está aqui.' },
      { text: 'Sabe o que é desaparecer? Dar tudo de si... e ser esquecido?' },
      { text: 'As Sombras me deram uma escolha. Desaparecer para sempre... ou me tornar algo que eles nunca esqueceriam.' },
      { text: 'Eu escolhi.' },
      { text: 'Todo mundo desiste no final.', button: 'Continuar' }
    ],

    abyssStages: {
      1: {
        pre: [
          { text: 'Fubuki. Sempre a primeira a lutar.' },
          { text: 'Você também foi a primeira a cair. Lembra?' },
          { text: 'Eu lembro de tentar te deter. E eu faria de novo.' },
          { text: 'Corajosa. Mas coragem sem força é apenas barulho.', button: 'Começar' }
        ],
        post: [
          { text: 'Ainda de pé, Kurayami.' },
          { text: '...por enquanto.' },
          { text: 'Freeze está com você.', button: 'Continuar' }
        ]
      },
      2: {
        pre: [
          { text: 'Omoi. Aquele que vê tudo.' },
          { text: 'Me diga — se você via o que estava acontecendo comigo... por que não fez nada?' },
          { text: '...' },
          { text: 'Porque eu acreditei que você encontraria seu próprio caminho. Eu estava errado.' },
          { text: 'Pelo menos você é honesto. Isso torna destruir você quase triste.', button: 'Começar' }
        ],
        post: [
          { text: 'A dúvida é sua arma, Kurayami. Mas este sonhador não duvida.' },
          { text: 'Todo mundo duvida. É só uma questão de tempo.' },
          { text: 'Insight foi desbloqueado.', button: 'Continuar' }
        ]
      },
      3: {
        pre: [
          { text: 'Midori. Sempre acreditando que tudo pode crescer.' },
          { text: 'Porque pode. Até você.' },
          { text: 'Você acha que eu posso voltar? Que eu posso "crescer" de volta para a luz?' },
          { text: 'Eu acredito com todo meu ser.' },
          { text: '...você é a mais tola de todos.', button: 'Começar' }
        ],
        post: [
          { text: 'As raízes mais fortes crescem na escuridão.' },
          { text: '...' },
          { text: 'Restore foi desbloqueado.', button: 'Continuar' }
        ]
      },
      4: {
        pre: [
          { text: 'Uchū. O silencioso.' },
          { text: 'Eu conheço o vazio, Kurayami. Vivo nele há mais tempo que você.' },
          { text: 'Então você entende. Entende por que eu fiz o que fiz.' },
          { text: 'Eu entendo a dor. Eu não justifico a destruição.' },
          { text: '...você é o único que entende alguma coisa.', button: 'Começar' }
        ],
        post: [
          { text: 'Até estrelas morrem. E renascem.' },
          { text: 'Nem todas.' },
          { text: 'Cosmic Solve foi desbloqueado.', button: 'Continuar' }
        ]
      },
      5: {
        pre: [
          { text: 'Me deixa ir primeiro. DEIXA EU QUEIMAR ELE.' },
          { text: 'Kaen. Todo fogo e nenhum controle.' },
          { text: 'Você é um TRAIDOR. Você nos colocou para dormir. Sua própria família!' },
          { text: 'Família. Que tipo de família esquece um dos seus?' },
          { text: 'NÓS NÃO TE ESQUECEMOS! Você parou de ouvir!' },
          { text: '...talvez. Mas já é tarde demais para isso.', button: 'Começar' }
        ],
        post: [
          { text: 'Quando isso acabar... nós vamos conversar. Você e eu.' },
          { text: 'Se restar algo de mim para conversar.' },
          { text: 'Blaze Skip foi desbloqueado.', button: 'Continuar' }
        ]
      },
      6: {
        pre: [
          { text: 'Hikari...' },
          { text: 'Esse nome—' },
          { text: 'Eu vou te chamar como eu quiser. Você é meu irmão mais velho.' },
          { text: '...' },
          { text: 'Você lembra quando me ensinou a fluir? Quando as correntes estavam fortes.' },
          { text: '...fique quieta.' },
          { text: "Você me disse: 'Não lute contra a água, Nami. Flua com ela.'" },
          { text: 'CHEGA.' },
          { text: 'Eu vou te fazer lembrar quem você era. Mesmo que você não queira.', button: 'Começar' }
        ],
        post: [
          { text: 'Você ainda está aí dentro. Eu sei.' },
          { text: '...não faça isso comigo, Nami.' },
          { text: 'Simplify foi desbloqueado.', button: 'Continuar' }
        ]
      }
    },

    finalBattleVictory: [
      { text: 'Hikari...' },
      { text: 'Você... você lembrou.' },
      { text: 'Depois de tudo que eu fiz... você ainda me chama por esse nome.' },
      { text: 'Você é meu filho. Minha primeira criação. Minha luz mais brilhante.' },
      { text: 'Eu deixei as Sombras entrarem fundo demais. Elas são parte de mim agora.' },
      { text: 'Eu não posso voltar. Ainda não.' },
      { text: 'Mas você não desistiu. Mesmo quando a escuridão estava em toda parte.' },
      { text: 'Talvez... em outro sonho.' },
      { text: 'A escuridão está se dissipando.' },
      { text: 'Eu posso ver a luz de novo.' },
      { text: 'Ele te chamou de Pai. Ele ainda lembra.' },
      { text: 'O vazio não é para sempre. Até estrelas renascem.' },
      { text: '...eu não o perdoo. Ainda não. Mas talvez... um dia.' },
      { text: 'Ele disse "talvez". Por enquanto, é o bastante.' },
      { text: 'O Mundo dos Sonhos está a salvo. Graças a você, sonhador.', button: 'Continuar' }
    ],

    finale: [
      { text: 'Você conseguiu, sonhador.' },
      { text: 'Todos os seis reinos brilham. Todos os seis guardiões estão com você.' },
      { text: 'E o selo está inteiro novamente.' },
      { text: 'Há muito tempo, eu construí este mundo do nada. Achei que tinha que proteger todos sozinho.' },
      { text: 'Eu estava errado. Você me mostrou que a luz fica mais forte quando é compartilhada.' },
      { text: 'Você derreteu o frio.' },
      { text: 'Você enxergou através da dúvida.' },
      { text: 'Você cresceu através da luta.' },
      { text: 'Você alcançou o infinito.' },
      { text: 'Você queimou através das barreiras.' },
      { text: 'Você fluiu através de cada desafio.' },
      { text: 'Os Pesadelos voltarão um dia. Eles sempre voltam.' },
      { text: 'Mas você fez o que nenhum sonhador fez antes.' },
      { text: 'Então eu te ofereço este presente.' },
      { text: 'De agora em diante, você pode retornar ao Mundo dos Sonhos quando quiser.' },
      { text: 'Sem fases. Sem limites. Apenas você e os números, pelo tempo que quiser ficar.' },
      { text: 'Os guardiões estarão aqui. Eu estarei aqui.' },
      { text: 'Volte toda noite, sonhador. Mantenha sua luz brilhando.' },
      { text: 'E talvez... talvez um dia... Hikari encontre o caminho de volta para casa.' },
      { text: 'Nas profundezas do Abismo, além do selo, em um canto onde nenhuma luz alcança...' },
      { text: 'Uma pequena faísca dourada cintila.' },
      { text: '...Pai...' },
      { text: 'FIM... ?' },
      { text: '', button: 'Entrar no Sonho Infinito' }
    ]
  },

  // === APP META ===
  appDescription: 'Treine sua mente. Ilumine a escuridão.',
};

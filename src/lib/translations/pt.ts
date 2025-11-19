/**
 * Portuguese (Brazil) Translations for NEP System
 * All application text in Brazilian Portuguese
 */

import { TranslationKeys } from './en';

export const pt: TranslationKeys = {
  // Common
  common: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    finish: 'Finalizar',
    retry: 'Tentar novamente',
    tryAgain: 'Tente novamente',
    notAvailable: 'Não disponível',
    comingSoon: 'Em breve',
  },

  // Navigation
  nav: {
    home: 'Início',
    scripts: 'Scripts',
    community: 'Comunidade',
    tracker: 'Rastreador',
    profile: 'Perfil',
    admin: 'Admin',
    videos: 'Vídeos',
    library: 'Biblioteca',
    logout: 'Sair',
    adminPanel: 'Painel Admin',
  },

  // Auth
  auth: {
    login: 'Entrar',
    signup: 'Cadastrar',
    logout: 'Sair',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    resetPassword: 'Redefinir senha',
    sendResetLink: 'Enviar link de redefinição',
    backToLogin: 'Voltar ao login',
    noAccount: 'Não tem uma conta?',
    hasAccount: 'Já tem uma conta?',
    errors: {
      invalidCredentials: 'E-mail ou senha inválidos',
      emailNotConfirmed: 'Por favor, confirme seu e-mail primeiro',
      weakPassword: 'A senha deve ter pelo menos 6 caracteres',
      emailInUse: 'Este e-mail já está registrado',
      otpSendError: 'Não conseguimos enviar o link de confirmação. Tente novamente.',
      otpVerifyError: 'Não conseguimos confirmar seu e-mail. Tente novamente.',
      signoutError: 'Não conseguimos fazer logout. Tente novamente.',
      accountNotFound: 'Não foi possível identificar sua conta.',
    },
    success: {
      loggedIn: 'Login realizado com sucesso',
      loggedOut: 'Logout realizado com sucesso',
      resetLinkSent: 'Link de redefinição enviado para seu e-mail',
    },
  },

  // Profile
  profile: {
    title: 'Perfil',
    editProfile: 'Editar Perfil',
    updateName: 'Atualizar Nome',
    childName: 'Nome da Criança',
    brainProfile: 'Perfil Cerebral',
    settings: 'Configurações',
    notifications: 'Notificações',
    enableNotifications: 'Ativar notificações',
    pwaInstall: 'Instalar app',
    errors: {
      updateNameFailed: 'Não foi possível atualizar o nome. Tente novamente.',
      loadFailed: 'Não foi possível carregar o perfil.',
    },
    success: {
      nameUpdated: 'Nome atualizado com sucesso!',
      settingsSaved: 'Configurações salvas!',
    },
    descriptions: {
      intense: 'Altamente sensível, emocionalmente intenso, profundamente conectado. Sua criança sente tudo profundamente e precisa de compreensão e co-regulação.',
      distracted: 'Curioso e rápido, mas facilmente distraído. Estrutura gentil e pausas sensoriais ajudam seu cérebro a permanecer engajado.',
      defiant: 'Forte vontade com senso poderoso de autonomia. Estratégias de conexão primeiro ajudam seu sistema nervoso a se sentir seguro o suficiente para cooperar.',
    },
  },

  // Scripts
  scripts: {
    title: 'Scripts NEP',
    search: 'Buscar scripts...',
    filter: 'Filtrar',
    category: 'Categoria',
    allCategories: 'Todas as Categorias',
    favorites: 'Favoritos',
    myFavorites: 'Meus Favoritos',
    addToFavorites: 'Adicionar aos favoritos',
    removeFromFavorites: 'Remover dos favoritos',
    howWasIt: 'Como foi?',
    submitFeedback: 'Enviar feedback',
    personalizedHistory: 'Histórico ativo',
    profileBased: 'Perfil',
    errors: {
      loadFailed: 'Não foi possível carregar os scripts. Tente novamente mais tarde.',
      saveFeedbackFailed: 'Não foi possível salvar o feedback',
      addFavoriteFailed: 'Não foi possível adicionar o script aos favoritos',
      removeFavoriteFailed: 'Não foi possível remover o script dos favoritos',
    },
    success: {
      feedbackSaved: 'Feedback salvo!',
      addedToFavorites: 'Adicionado aos favoritos',
      removedFromFavorites: 'Removido dos favoritos',
    },
  },

  // Videos
  videos: {
    title: 'Vídeos',
    watch: 'Assistir',
    watched: 'Assistidos',
    notWatched: 'Não Assistidos',
    markAsWatched: 'Marcar como assistido',
    duration: 'Duração',
    errors: {
      loadFailed: 'Não foi possível carregar os vídeos agora.',
    },
  },

  // Library
  library: {
    title: 'Biblioteca PDF',
    download: 'Baixar',
    view: 'Visualizar',
    errors: {
      loadFailed: 'Não foi possível carregar os PDFs. Tente novamente mais tarde.',
    },
  },

  // Community
  community: {
    title: 'Comunidade',
    newPost: 'Nova Postagem',
    shareYourWin: 'Compartilhe Sua Vitória',
    filter: 'Filtrar',
    filterByProfile: 'Filtrar por perfil',
    comments: 'comentários',
    likes: 'curtidas',
    like: 'Curtir',
    comment: 'Comentar',
    post: 'Postar',
    errors: {
      loadPostsFailed: 'Não foi possível carregar as postagens',
      createPostFailed: 'Não foi possível criar a postagem',
    },
    success: {
      postCreated: 'Postagem criada com sucesso!',
      postDeleted: 'Postagem excluída',
    },
  },

  // Tracker
  tracker: {
    title: 'Rastreador de Progresso',
    myPlan: 'Meu Plano',
    day: 'Dia',
    complete: 'Completo',
    incomplete: 'Incompleto',
    stressLevel: 'Nível de Estresse',
    meltdowns: 'Colapsos',
    notes: 'Notas',
    saveProgress: 'Salvar Progresso',
    errors: {
      loadFailed: 'Não foi possível carregar os dados do rastreador',
      saveFailed: 'Não foi possível salvar o progresso',
    },
    success: {
      progressSaved: 'Progresso salvo!',
    },
  },

  // Recommendations
  recommendations: {
    title: 'Sugestões Inteligentes',
    personalized: 'Personalizado',
    profileBased: 'Baseado no perfil',
    suggestedScript: 'Script sugerido',
    category: 'Categoria',
    errors: {
      loadFailed: 'Não foi possível carregar recomendações',
      loadCollectionsFailed: 'Não foi possível carregar coleções',
      loadFavoritesFailed: 'Não foi possível carregar favoritos',
      loadFavoriteScriptsFailed: 'Não foi possível carregar scripts favoritos',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Bem-vindo de volta',
    dayOf: 'Dia {current} de {total}',
    transformationProgress: 'Seu Progresso de Transformação',
    todaysMission: 'Missão de Hoje',
    successStory: 'História de Sucesso',
    livingProgress: 'Progresso em Tempo Real',
    thisWeeksWins: 'Vitórias desta Semana',
    nervousSystemCheckIn: 'Check-in do Sistema Nervoso',
    nextBestAction: 'Próxima Melhor Ação',
    continueWatching: 'Continue de Onde Parou',
    quickAccess: 'Acesso Rápido',
    communityHighlights: 'Destaques da Comunidade',
    viewAll: 'Ver Tudo',
  },

  // Admin
  admin: {
    title: 'Painel Admin',
    analytics: 'Análises',
    users: 'Usuários',
    content: 'Conteúdo',
    settings: 'Configurações',
    totalUsers: 'Total de Usuários',
    activeUsers: 'Usuários Ativos',
    scriptsUsed: 'Scripts Usados',
    errors: {
      loadFailed: 'Não foi possível carregar dados admin',
    },
  },

  // Brain Profiles
  brainProfiles: {
    intense: 'INTENSO',
    distracted: 'DISTRAÍDO',
    defiant: 'DESAFIADOR',
    neutral: 'NEUTRO',
  },

  // Feedback
  feedback: {
    ratings: {
      veryBad: 'Muito Ruim',
      bad: 'Ruim',
      neutral: 'Neutro',
      good: 'Bom',
      excellent: 'Excelente',
    },
  },

  // Methodology
  methodology: {
    title: 'Metodologia Científica e Fundamentos da Pesquisa',
    subtitle: 'Nossos scripts de parentalidade são fundamentados em pesquisas neurocientíficas revisadas por pares, não conteúdo genérico de IA. Cada estratégia é projetada em torno de mecanismos neurológicos específicos validados por décadas de pesquisa em desenvolvimento infantil.',
    notGenericAI: {
      title: 'Por Que Isso NÃO É Conteúdo Genérico de IA',
      generic: {
        title: '❌ Conteúdo Genérico de IA:',
        items: [
          'Conselhos vagos: "Seja paciente e consistente"',
          'Estratégias genéricas para todos',
          'Sem explicações neurológicas',
          'Expectativas irreais',
          'Sem citações científicas',
        ],
      },
      ours: {
        title: '✅ Nossa Metodologia:',
        items: [
          'Mecanismos neurológicos específicos por perfil',
          'Frases exatas para dizer com timing',
          'Dados de regiões cerebrais/neurotransmissores',
          'Prazos honestos (5-7 repetições)',
          'Citações de Ross Greene, Barkley, Siegel',
        ],
      },
    },
    neurologicalReality: {
      title: 'A Realidade Neurológica Que os Pais Devem Entender',
      subtitle: 'Por que conselhos tradicionais de parentalidade falham: ciência do desenvolvimento cerebral',
      prefrontalCortex: {
        title: 'O Problema do Córtex Pré-Frontal',
        content: [
          'O córtex pré-frontal—responsável pela regulação emocional, controle de impulsos e tomada de decisão racional—não amadurece completamente até os 25-30 anos.',
          'Em crianças de 4-12 anos, essa região cerebral está significativamente subdesenvolvida.',
          'O que isso significa na prática: Crianças literalmente não conseguem "pensar antes de agir" como adultos. O hardware do cérebro delas ainda não está completo.',
          'Conselhos tradicionais como "Apenas se acalme" ou "Pense em suas escolhas" são neurologicamente impossíveis para uma criança em estado desregulado.',
        ],
      },
      amygdalaHijack: {
        title: 'Sequestro da Amígdala e o Cérebro "Andar de Cima/Andar de Baixo"',
        content: [
          'A pesquisa de Daniel Siegel mostra que quando uma criança está chateada, seu "cérebro de baixo" (amígdala, tronco cerebral) assume completamente.',
          'Durante o sequestro da amígdala, o "cérebro de cima" lógico (córtex pré-frontal) fica completamente offline.',
          'Isso não é desafio ou manipulação—é uma resposta neurobiológica. A criança perdeu temporariamente o acesso ao seu cérebro racional.',
          'Você não pode raciocinar com uma amígdala sequestrada. A única solução é co-regulação primeiro, conversa depois.',
        ],
      },
      coRegulation: {
        title: 'Co-Regulação: A Necessidade Biológica',
        content: [
          'Crianças não conseguem se autorregular até aproximadamente 8-10 anos (e mesmo assim, inconsistentemente).',
          'Co-regulação é quando o sistema nervoso calmo de um adulto ajuda a regular o sistema nervoso desregulado de uma criança.',
          'Isso acontece através do tom de voz, proximidade física, respostas previsíveis e espelhamento de linguagem corporal calma.',
          'Pesquisas de Stephen Porges (Teoria Polivagal) mostram que o sistema nervoso regulado de um pai influencia diretamente o sistema nervoso de seu filho via sinais de engajamento social.',
        ],
      },
    },
    profiles: {
      title: 'Três Perfis Neurológicos: A Ciência Por Trás da Nossa Abordagem',
      subtitle: 'Nem todo comportamento difícil tem origem no mesmo mecanismo neurológico. Nosso sistema categoriza crianças em três perfis baseados em evidências, cada um exigindo intervenções diferentes.',
      defiant: {
        title: 'Perfil Cerebral DESAFIADOR',
        data: 'Dados Neurológicos',
        dataContent: 'Crianças com comportamento cronicamente inflexível—aquelas que não conseguem se adaptar quando as coisas não saem do seu jeito—têm um padrão específico de habilidades cognitivas defasadas. Pesquisas de Ross Greene, Ph.D. (Harvard Medical School) demonstram que essas crianças carecem de habilidades em áreas como flexibilidade/adaptabilidade, tolerância à frustração e resolução de problemas.',
        prevalence: 'Aproximadamente 10-15% das crianças exibem esse perfil.',
        approach: 'Abordagem Baseada em Evidências',
        approachTitle: 'Soluções Colaborativas e Proativas (CPS) de Ross Greene',
        approachPoints: [
          'Pressuponha "crianças se comportam bem se puderem" (não "se quiserem").',
          'Identifique as habilidades defasadas causando inflexibilidade.',
          'Use Plano B: Empatia → Definir o Problema → Convite (resolução colaborativa de problemas).',
        ],
        implications: 'Implicações para Scripts NEP',
        implicationsPoints: [
          'Scripts DESAFIADOR priorizam resolução colaborativa de problemas sobre conformidade.',
          'Frases são projetadas para reconhecer primeiro a perspectiva da criança, depois guiar gentilmente para flexibilidade.',
          'Sem consequências punitivas—essas crianças carecem de habilidades, não motivação.',
        ],
      },
      intense: {
        title: 'Perfil Cerebral INTENSO',
        data: 'Dados Neurológicos',
        dataContent: 'Crianças altamente sensíveis (HSC) têm um limiar mais baixo para estímulos sensoriais e reatividade emocional. Pesquisas da Dra. Elaine Aron mostram que aproximadamente 15-20% das crianças têm um traço genético chamado Sensibilidade ao Processamento Sensorial (SPS), levando a processamento mais profundo de emoções, empatia elevada e reações mais fortes a estímulos.',
        approach: 'Abordagem Baseada em Evidências',
        approachTitle: 'Framework DOES da Dra. Elaine Aron',
        approachPoints: [
          'Profundidade de processamento: Elas pensam profundamente sobre tudo.',
          'Superestimulação: Elas ficam sobrecarregadas mais rápido que outras crianças.',
          'Reatividade emocional: Elas sentem emoções mais intensamente.',
          'Sensibilidade a sutilezas: Elas notam coisas que outros não percebem.',
        ],
        implications: 'Implicações para Scripts NEP',
        implicationsPoints: [
          'Scripts INTENSO incluem pausas sensoriais, validação emocional e co-regulação primeiro.',
          'Estratégias reconhecem os sentimentos profundos da criança como reais e válidos, não "exageros."',
          'Timing é crítico—apressar uma criança INTENSO durante desregulação piora a situação.',
        ],
      },
      distracted: {
        title: 'Perfil Cerebral DISTRAÍDO',
        data: 'Dados Neurológicos',
        dataContent: 'Crianças com dificuldades de regulação de atenção frequentemente têm diferenças na função executiva—especificamente, memória de trabalho, controle inibitório e flexibilidade cognitiva. Pesquisas do Dr. Russell A. Barkley (principal pesquisador de TDAH) mostram que essas crianças têm um atraso de desenvolvimento de 30% na função executiva comparado a pares neurotípicos.',
        prevalence: 'Afeta aproximadamente 8-12% das crianças (diagnóstico de TDAH), mas muitas mais exibem traços desatentos subclínicos.',
        approach: 'Abordagem Baseada em Evidências',
        approachTitle: 'Modelo de Estrutura Externa de Barkley',
        approachPoints: [
          'Fornecer estrutura externa para compensar déficits internos de função executiva.',
          'Usar timers visuais, checklists e rotinas previsíveis.',
          'Dividir tarefas em micro-passos com feedback imediato.',
        ],
        implications: 'Implicações para Scripts NEP',
        implicationsPoints: [
          'Scripts DISTRAÍDO usam pistas visuais, pausas de movimento corporal e prazos mais curtos.',
          'Estratégias priorizam engajar o interesse da criança (boost de dopamina) antes de pedir foco sustentado.',
          'Sem explicações longas—essas crianças perdem o fio rapidamente.',
        ],
      },
    },
    scriptCreation: {
      title: 'Como Criamos e Validamos Cada Script',
      subtitle: 'Nosso Processo de Controle de Qualidade em 5 Passos',
      step1: {
        title: 'Direcionamento Neurológico Específico por Perfil',
        content: 'Identificamos o desafio neurológico exato (ex: sequestro da amígdala para INTENSO, déficit de função executiva para DISTRAÍDO, habilidades de flexibilidade defasadas para DESAFIADOR) e projetamos o script em torno dele.',
      },
      step2: {
        title: 'Explicação do Mecanismo Neurológico',
        content: 'Cada script inclui "Por Que Isso Funciona" com citações de pesquisas revisadas por pares (Greene, Barkley, Siegel, Aron) explicando o mecanismo neurobiológico.',
      },
      step3: {
        title: 'Scripts Comportamentais Exatos',
        content: 'Em vez de conselhos vagos ("seja empático"), fornecemos frases exatas para dizer, com timing recomendado (ex: "pause 5 segundos após dizer isso").',
      },
      step4: {
        title: 'Prazos Honestos e Baseados em Pesquisa',
        content: 'Dizemos aos pais a verdade: "Isso levará 5-7 repetições antes de você ver melhora" (baseado em pesquisa de neuroplasticidade mostrando que formação de hábitos requer aproximadamente 66 dias em média).',
      },
      step5: {
        title: 'Checklist de Validação e Controle de Qualidade',
        points: [
          'Essa estratégia tem suporte de pesquisa revisada por pares?',
          'É específica por perfil ou genérica?',
          'As frases são concretas e acionáveis?',
          'Respeita a realidade neurológica da criança?',
          'O prazo é honesto e baseado em evidências?',
        ],
      },
    },
    references: {
      title: 'Referências Acadêmicas e Leitura Adicional',
      items: [
        {
          authors: 'Greene, R. W.',
          year: '2014',
          title: 'The Explosive Child',
          details: 'Uma nova abordagem para compreender e criar filhos facilmente frustrados e cronicamente inflexíveis. Harper.',
        },
        {
          authors: 'Barkley, R. A.',
          year: '2015',
          title: 'Attention-Deficit Hyperactivity Disorder: A Handbook for Diagnosis and Treatment',
          details: 'Guilford Press.',
        },
        {
          authors: 'Siegel, D. J., & Bryson, T. P.',
          year: '2012',
          title: 'The Whole-Brain Child',
          details: '12 estratégias revolucionárias para nutrir a mente em desenvolvimento do seu filho. Bantam.',
        },
        {
          authors: 'Aron, E. N.',
          year: '2002',
          title: 'The Highly Sensitive Child',
          details: 'Ajudando nossos filhos a prosperar quando o mundo os sobrecarrega. Broadway Books.',
        },
        {
          authors: 'Porges, S. W.',
          year: '2011',
          title: 'The Polyvagal Theory',
          details: 'Fundamentos neurofisiológicos de emoções, apego, comunicação e autorregulação. Norton.',
        },
        {
          authors: 'Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J.',
          year: '2010',
          title: 'How are habits formed: Modelling habit formation in the real world',
          details: 'European Journal of Social Psychology, 40(6), 998-1009.',
        },
      ],
    },
    disclaimer: {
      title: 'Aviso Profissional',
      content: 'As informações fornecidas no NEP Brain são apenas para fins educacionais e não se destinam a substituir avaliação ou tratamento médico, psicológico ou psiquiátrico profissional. Se você tem preocupações sobre o desenvolvimento, comportamento ou saúde mental de seu filho, consulte um profissional de saúde qualificado, psicólogo licenciado ou psiquiatra que possa fornecer avaliação personalizada e recomendações.',
    },
  },

  // PWA
  pwa: {
    installPrompt: 'Instale o app NEP System para acesso mais fácil',
    installButton: 'Instalar',
    notNow: 'Agora não',
    howToInstall: 'Como instalar',
  },

  // Onboarding
  onboarding: {
    title: 'Vamos descobrir o perfil do seu filho!',
    description: 'Faça o quiz NEP para criar seu primeiro perfil infantil e desbloquear uma experiência personalizada do Meu Plano.',
    startQuiz: 'Começar o quiz',
    maybeLater: 'Talvez mais tarde',
  },
};

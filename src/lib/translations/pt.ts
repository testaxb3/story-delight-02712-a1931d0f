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

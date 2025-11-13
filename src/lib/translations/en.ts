/**
 * English (US) Translations for NEP System
 * All application text in American English
 */

export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    retry: 'Retry',
    tryAgain: 'Try again',
    notAvailable: 'Not available',
    comingSoon: 'Coming soon',
  },

  // Navigation
  nav: {
    home: 'Home',
    scripts: 'Scripts',
    community: 'Community',
    tracker: 'Tracker',
    profile: 'Profile',
    admin: 'Admin',
    videos: 'Videos',
    library: 'Library',
    logout: 'Logout',
    adminPanel: 'Admin Panel',
  },

  // Auth
  auth: {
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset password',
    sendResetLink: 'Send reset link',
    backToLogin: 'Back to login',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    errors: {
      invalidCredentials: 'Invalid email or password',
      emailNotConfirmed: 'Please confirm your email first',
      weakPassword: 'Password must be at least 6 characters',
      emailInUse: 'This email is already registered',
      otpSendError: 'Could not send confirmation link. Please try again.',
      otpVerifyError: 'Could not confirm your email. Please try again.',
      signoutError: 'Could not log out. Please try again.',
      accountNotFound: 'Could not identify your account.',
    },
    success: {
      loggedIn: 'Logged in successfully',
      loggedOut: 'Logged out successfully',
      resetLinkSent: 'Reset link sent to your email',
    },
  },

  // Profile
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    updateName: 'Update Name',
    childName: 'Child Name',
    brainProfile: 'Brain Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    enableNotifications: 'Enable notifications',
    pwaInstall: 'Install app',
    errors: {
      updateNameFailed: 'Could not update name. Please try again.',
      loadFailed: 'Could not load profile.',
    },
    success: {
      nameUpdated: 'Name updated successfully!',
      settingsSaved: 'Settings saved!',
    },
    descriptions: {
      intense: 'Highly sensitive, emotionally intense, deeply connected. Your child feels everything deeply and needs understanding and co-regulation.',
      distracted: 'Curious and quick, but easily pulled in many directions. Gentle structure and sensory breaks help their brain stay engaged.',
      defiant: 'Strong-willed with a powerful sense of autonomy. Connection-first strategies help their nervous system feel safe enough to cooperate.',
    },
  },

  // Scripts
  scripts: {
    title: 'NEP Scripts',
    search: 'Search scripts...',
    filter: 'Filter',
    category: 'Category',
    allCategories: 'All Categories',
    favorites: 'Favorites',
    myFavorites: 'My Favorites',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    howWasIt: 'How was it?',
    submitFeedback: 'Submit feedback',
    personalizedHistory: 'Active history',
    profileBased: 'Profile',
    errors: {
      loadFailed: 'Could not load scripts. Please try again later.',
      saveFeedbackFailed: 'Could not save feedback',
      addFavoriteFailed: 'Could not add script to favorites',
      removeFavoriteFailed: 'Could not remove script from favorites',
    },
    success: {
      feedbackSaved: 'Feedback saved!',
      addedToFavorites: 'Added to favorites',
      removedFromFavorites: 'Removed from favorites',
    },
  },

  // Videos
  videos: {
    title: 'Video Lessons',
    watch: 'Watch',
    watched: 'Watched',
    notWatched: 'Not Watched',
    markAsWatched: 'Mark as watched',
    duration: 'Duration',
    errors: {
      loadFailed: 'Could not load videos right now.',
    },
  },

  // Library
  library: {
    title: 'PDF Library',
    download: 'Download',
    view: 'View',
    errors: {
      loadFailed: 'Could not load PDFs. Please try again later.',
    },
  },

  // Community
  community: {
    title: 'Community',
    newPost: 'New Post',
    shareYourWin: 'Share Your Win',
    filter: 'Filter',
    filterByProfile: 'Filter by profile',
    comments: 'comments',
    likes: 'likes',
    like: 'Like',
    comment: 'Comment',
    post: 'Post',
    errors: {
      loadPostsFailed: 'Could not load posts',
      createPostFailed: 'Could not create post',
    },
    success: {
      postCreated: 'Post created successfully!',
      postDeleted: 'Post deleted',
    },
  },

  // Tracker
  tracker: {
    title: 'Progress Tracker',
    myPlan: 'My Plan',
    day: 'Day',
    complete: 'Complete',
    incomplete: 'Incomplete',
    stressLevel: 'Stress Level',
    meltdowns: 'Meltdowns',
    notes: 'Notes',
    saveProgress: 'Save Progress',
    errors: {
      loadFailed: 'Could not load tracker data',
      saveFailed: 'Could not save progress',
    },
    success: {
      progressSaved: 'Progress saved!',
    },
  },

  // Recommendations
  recommendations: {
    title: 'Smart Suggestions',
    personalized: 'Personalized',
    profileBased: 'Profile-based',
    suggestedScript: 'Suggested script',
    category: 'Category',
    errors: {
      loadFailed: 'Could not load recommendations',
      loadCollectionsFailed: 'Could not load collections',
      loadFavoritesFailed: 'Could not load favorites',
      loadFavoriteScriptsFailed: 'Could not load favorite scripts',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    dayOf: 'Day {current} of {total}',
    transformationProgress: 'Your Transformation Progress',
    todaysMission: "Today's Mission",
    successStory: 'Success Story',
    livingProgress: 'Living Progress',
    thisWeeksWins: "This Week's Wins",
    nervousSystemCheckIn: 'Nervous System Check-in',
    nextBestAction: 'Next Best Action',
    continueWatching: 'Continue Where You Left Off',
    quickAccess: 'Quick Access',
    communityHighlights: 'Community Highlights',
    viewAll: 'View All',
  },

  // Admin
  admin: {
    title: 'Admin Panel',
    analytics: 'Analytics',
    users: 'Users',
    content: 'Content',
    settings: 'Settings',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    scriptsUsed: 'Scripts Used',
    errors: {
      loadFailed: 'Could not load admin data',
    },
  },

  // Brain Profiles
  brainProfiles: {
    intense: 'INTENSE',
    distracted: 'DISTRACTED',
    defiant: 'DEFIANT',
    neutral: 'NEUTRAL',
  },

  // Feedback
  feedback: {
    ratings: {
      veryBad: 'Very Bad',
      bad: 'Bad',
      neutral: 'Neutral',
      good: 'Good',
      excellent: 'Excellent',
    },
  },

  // PWA
  pwa: {
    installPrompt: 'Install NEP System app for easier access',
    installButton: 'Install',
    notNow: 'Not now',
    howToInstall: 'How to install',
  },

  // Onboarding
  onboarding: {
    title: "Let's discover your child's profile!",
    description: 'Take the NEP quiz to create your first child profile and unlock a personalized My Plan experience.',
    startQuiz: 'Start the quiz',
    maybeLater: 'Maybe later',
  },
};

export type TranslationKeys = typeof en;

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

  // Methodology
  methodology: {
    title: 'Scientific Methodology & Research Foundation',
    subtitle: 'Our parenting scripts are grounded in peer-reviewed neuroscience research, not generic AI content. Every strategy is designed around specific neurological mechanisms validated by decades of child development research.',
    notGenericAI: {
      title: 'Why This Is NOT Generic AI Content',
      generic: {
        title: '❌ Generic AI Content:',
        items: [
          'Vague advice: "Be patient and consistent"',
          'One-size-fits-all strategies',
          'No neurological explanations',
          'Unrealistic expectations',
          'No scientific citations',
        ],
      },
      ours: {
        title: '✅ Our Methodology:',
        items: [
          'Profile-specific neurological mechanisms',
          'Exact phrases to say with timing',
          'Brain region/neurotransmitter data',
          'Honest timelines (5-7 repetitions)',
          'Ross Greene, Barkley, Siegel citations',
        ],
      },
    },
    neurologicalReality: {
      title: 'The Neurological Reality Parents Must Understand',
      subtitle: 'Why traditional parenting advice fails: brain development science',
      prefrontalCortex: {
        title: 'The Prefrontal Cortex Problem',
        content: [
          'The prefrontal cortex—responsible for emotional regulation, impulse control, and rational decision-making—doesn\'t fully mature until age 25-30.',
          'In children ages 4-12, this brain region is significantly underdeveloped.',
          'What this means practically: Children literally cannot "think before they act" the way adults can. Their brain hardware isn\'t finished yet.',
          'Traditional advice like "Just calm down" or "Think about your choices" is neurologically impossible for a child in a dysregulated state.',
        ],
      },
      amygdalaHijack: {
        title: 'Amygdala Hijacking & The "Upstairs/Downstairs" Brain',
        content: [
          'Daniel Siegel\'s research shows that when a child is upset, their "downstairs brain" (amygdala, brain stem) takes over completely.',
          'During amygdala hijacking, the logical "upstairs brain" (prefrontal cortex) goes offline entirely.',
          'This is not defiance or manipulation—it\'s a neurobiological response. The child has temporarily lost access to their rational brain.',
          'You cannot reason with a hijacked amygdala. The only solution is co-regulation first, conversation later.',
        ],
      },
      coRegulation: {
        title: 'Co-Regulation: The Biological Necessity',
        content: [
          'Children cannot self-regulate until approximately age 8-10 (and even then, inconsistently).',
          'Co-regulation is when a calm adult\'s nervous system helps regulate a dysregulated child\'s nervous system.',
          'This happens through tone of voice, physical proximity, predictable responses, and mirroring calm body language.',
          'Research by Stephen Porges (Polyvagal Theory) shows that a parent\'s regulated nervous system directly influences their child\'s nervous system via social engagement cues.',
        ],
      },
    },
    profiles: {
      title: 'Three Neurological Profiles: The Science Behind Our Approach',
      subtitle: 'Not all difficult behavior stems from the same neurological mechanism. Our system categorizes children into three evidence-based profiles, each requiring different interventions.',
      defiant: {
        title: 'DEFIANT Brain Profile',
        data: 'Neurological Data',
        dataContent: 'Children with chronic inflexible behavior—those who cannot adapt when things don\'t go their way—have a specific pattern of lagging cognitive skills. Research by Ross Greene, Ph.D. (Harvard Medical School) demonstrates that these children lack skills in areas like flexibility/adaptability, frustration tolerance, and problem-solving.',
        prevalence: 'Approximately 10-15% of children exhibit this profile.',
        approach: 'Evidence-Based Approach',
        approachTitle: 'Ross Greene\'s Collaborative & Proactive Solutions (CPS)',
        approachPoints: [
          'Assume "kids do well if they can" (not "if they want to").',
          'Identify the lagging skills causing inflexibility.',
          'Use Plan B: Empathy → Define the Problem → Invitation (collaborative problem-solving).',
        ],
        implications: 'Implications for NEP Scripts',
        implicationsPoints: [
          'DEFIANT scripts prioritize collaborative problem-solving over compliance.',
          'Phrases are designed to acknowledge the child\'s perspective first, then gently guide toward flexibility.',
          'No punitive consequences—these children lack skills, not motivation.',
        ],
      },
      intense: {
        title: 'INTENSE Brain Profile',
        data: 'Neurological Data',
        dataContent: 'Highly sensitive children (HSC) have a lower threshold for sensory input and emotional reactivity. Research by Dr. Elaine Aron shows that approximately 15-20% of children have a genetic trait called Sensory Processing Sensitivity (SPS), leading to deeper processing of emotions, heightened empathy, and stronger reactions to stimuli.',
        approach: 'Evidence-Based Approach',
        approachTitle: 'Dr. Elaine Aron\'s DOES Framework',
        approachPoints: [
          'Depth of processing: They think deeply about everything.',
          'Overstimulation: They get overwhelmed faster than other children.',
          'Emotional reactivity: They feel emotions more intensely.',
          'Sensitivity to subtleties: They notice things others miss.',
        ],
        implications: 'Implications for NEP Scripts',
        implicationsPoints: [
          'INTENSE scripts include sensory breaks, emotional validation, and co-regulation first.',
          'Strategies acknowledge the child\'s deep feelings as real and valid, not "overreactions."',
          'Timing is critical—rushing an INTENSE child during dysregulation worsens the situation.',
        ],
      },
      distracted: {
        title: 'DISTRACTED Brain Profile',
        data: 'Neurological Data',
        dataContent: 'Children with attention regulation difficulties often have differences in executive function—specifically, working memory, inhibitory control, and cognitive flexibility. Research by Dr. Russell A. Barkley (leading ADHD researcher) shows that these children have a 30% developmental delay in executive function compared to neurotypical peers.',
        prevalence: 'Affects approximately 8-12% of children (ADHD diagnosis), but many more exhibit subclinical inattentive traits.',
        approach: 'Evidence-Based Approach',
        approachTitle: 'Barkley\'s External Scaffolding Model',
        approachPoints: [
          'Provide external structure to compensate for internal executive function deficits.',
          'Use visual timers, checklists, and predictable routines.',
          'Break tasks into micro-steps with immediate feedback.',
        ],
        implications: 'Implications for NEP Scripts',
        implicationsPoints: [
          'DISTRACTED scripts use visual cues, body movement breaks, and shorter time frames.',
          'Strategies prioritize engaging the child\'s interest (dopamine boost) before asking for sustained focus.',
          'No long explanations—these children lose the thread quickly.',
        ],
      },
    },
    scriptCreation: {
      title: 'How We Create & Validate Each Script',
      subtitle: 'Our 5-Step Quality Control Process',
      step1: {
        title: 'Profile-Specific Neurological Targeting',
        content: 'We identify the exact neurological challenge (e.g., amygdala hijacking for INTENSE, executive function deficit for DISTRACTED, lagging flexibility skills for DEFIANT) and design the script around it.',
      },
      step2: {
        title: 'Neurological Mechanism Explanation',
        content: 'Every script includes "Why This Works" with citations to peer-reviewed research (Greene, Barkley, Siegel, Aron) explaining the neurobiological mechanism.',
      },
      step3: {
        title: 'Exact Behavioral Scripts',
        content: 'Instead of vague advice ("be empathetic"), we provide exact phrases to say, with recommended timing (e.g., "pause 5 seconds after saying this").',
      },
      step4: {
        title: 'Honest, Research-Based Timelines',
        content: 'We tell parents the truth: "This will take 5-7 repetitions before you see improvement" (based on neuroplasticity research showing habit formation requires approximately 66 days on average).',
      },
      step5: {
        title: 'Validation & Quality Control Checklist',
        points: [
          'Does this strategy have peer-reviewed research backing?',
          'Is it profile-specific or generic?',
          'Are the phrases concrete and actionable?',
          'Does it respect the child\'s neurological reality?',
          'Is the timeline honest and evidence-based?',
        ],
      },
    },
    references: {
      title: 'Academic References & Further Reading',
      items: [
        {
          authors: 'Greene, R. W.',
          year: '2014',
          title: 'The Explosive Child',
          details: 'A new approach for understanding and parenting easily frustrated, chronically inflexible children. Harper.',
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
          details: '12 revolutionary strategies to nurture your child\'s developing mind. Bantam.',
        },
        {
          authors: 'Aron, E. N.',
          year: '2002',
          title: 'The Highly Sensitive Child',
          details: 'Helping our children thrive when the world overwhelms them. Broadway Books.',
        },
        {
          authors: 'Porges, S. W.',
          year: '2011',
          title: 'The Polyvagal Theory',
          details: 'Neurophysiological foundations of emotions, attachment, communication, and self-regulation. Norton.',
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
      title: 'Professional Disclaimer',
      content: 'The information provided in NEP Brain is for educational purposes only and is not intended as a substitute for professional medical, psychological, or psychiatric evaluation or treatment. If you have concerns about your child\'s development, behavior, or mental health, please consult with a qualified healthcare provider, licensed psychologist, or psychiatrist who can provide personalized assessment and recommendations.',
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

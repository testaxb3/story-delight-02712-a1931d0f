interface ScriptRecommendation {
  title: string;
  description: string;
  icon: string;
  tag: string;
  scriptCategory?: string;
}

type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Get current time of day
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Recommendations by profile and time
const recommendations: Record<BrainProfile, Record<TimeOfDay, ScriptRecommendation>> = {
  INTENSE: {
    morning: {
      title: "Morning Meltdown Prevention",
      description: "Start the day calm with this transition technique. Works in under 3 minutes.",
      icon: "☀️",
      tag: "Best for Morning Rush",
      scriptCategory: "transitions"
    },
    afternoon: {
      title: "After-School Decompression",
      description: "Help your child process big emotions after school. Proven by 800+ parents.",
      icon: "🎒",
      tag: "School Transition",
      scriptCategory: "emotional-regulation"
    },
    evening: {
      title: "Calm Evening Routine",
      description: "Transform evening chaos into peaceful connection time.",
      icon: "🌙",
      tag: "Evening Success",
      scriptCategory: "bedtime"
    },
    night: {
      title: "Bedtime Without Battles",
      description: "End the day peacefully with this 5-minute technique.",
      icon: "🛏️",
      tag: "Sleep Success",
      scriptCategory: "bedtime"
    }
  },
  DISTRACTED: {
    morning: {
      title: "Focus Builder for Morning",
      description: "Help your child stay on track during the morning routine. Works in 2 minutes.",
      icon: "🎯",
      tag: "Morning Focus",
      scriptCategory: "focus"
    },
    afternoon: {
      title: "Homework Focus Technique",
      description: "Keep them engaged without frustration. Used by 1,500+ parents.",
      icon: "📚",
      tag: "Homework Helper",
      scriptCategory: "focus"
    },
    evening: {
      title: "Dinner Table Focus",
      description: "Help them stay present during family time.",
      icon: "🍽️",
      tag: "Family Time",
      scriptCategory: "focus"
    },
    night: {
      title: "Wind-Down Focus Script",
      description: "Guide them to a calm, focused bedtime routine.",
      icon: "🌟",
      tag: "Bedtime Success",
      scriptCategory: "bedtime"
    }
  },
  DEFIANT: {
    morning: {
      title: "Morning Cooperation Builder",
      description: "Transform morning resistance into willing participation. Tested by 1,200+ parents.",
      icon: "🌅",
      tag: "Morning Win",
      scriptCategory: "cooperation"
    },
    afternoon: {
      title: "Power Struggles Solution",
      description: "Turn afternoon battles into cooperation. Works in real-time.",
      icon: "🔥",
      tag: "Breakthrough Technique",
      scriptCategory: "cooperation"
    },
    evening: {
      title: "Evening Cooperation Script",
      description: "End power struggles before bedtime starts.",
      icon: "🤝",
      tag: "Peace Before Bed",
      scriptCategory: "cooperation"
    },
    night: {
      title: "Bedtime Without Battles",
      description: "Transform bedtime resistance into willing cooperation.",
      icon: "😴",
      tag: "Sleep Success",
      scriptCategory: "bedtime"
    }
  }
};

// Fallback recommendations if no profile
const fallbackRecommendations: Record<TimeOfDay, ScriptRecommendation> = {
  morning: {
    title: "Morning Transition Technique",
    description: "Start your day with calm and connection. Works for any brain type.",
    icon: "🌤️",
    tag: "Universal Morning Win",
    scriptCategory: "transitions"
  },
  afternoon: {
    title: "Afternoon Reset Script",
    description: "Help your child reset and refocus. Proven effective.",
    icon: "🔄",
    tag: "Midday Success",
    scriptCategory: "emotional-regulation"
  },
  evening: {
    title: "Evening Connection Time",
    description: "Build connection before the bedtime routine starts.",
    icon: "💝",
    tag: "Family Connection",
    scriptCategory: "connection"
  },
  night: {
    title: "Peaceful Bedtime Script",
    description: "End the day with calm and security.",
    icon: "🌜",
    tag: "Bedtime Peace",
    scriptCategory: "bedtime"
  }
};

/**
 * Get intelligent script recommendation based on brain profile and time of day
 */
export function getSmartRecommendation(
  brainProfile: string | null,
  timeOfDay?: TimeOfDay
): ScriptRecommendation {
  const currentTime = timeOfDay || getTimeOfDay();
  
  // Normalize brain profile to match our types
  const normalizedProfile = brainProfile?.toUpperCase() as BrainProfile;
  
  // Check if we have recommendations for this profile
  if (normalizedProfile && recommendations[normalizedProfile]) {
    return recommendations[normalizedProfile][currentTime];
  }
  
  // Fallback to generic recommendations
  return fallbackRecommendations[currentTime];
}

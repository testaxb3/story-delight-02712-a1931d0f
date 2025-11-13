import { BonusData } from "@/components/bonuses/BonusCard";

export const mockBonusesData: BonusData[] = [
  // Featured - Interactive Ebook (Already unlocked)
  {
    id: "ebook-main",
    title: "Why Your Child Acts This Way - Complete Interactive Ebook",
    description: "29 meta-analyzed studies, 3,500+ children in research samples. The definitive guide to understanding DEFIANT, INTENSE, and DISTRACTED profiles with neurological insights.",
    category: "ebook",
    thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop",
    duration: "45-60 min read",
    size: "Interactive",
    locked: false,
    completed: false,
    progress: 0,
    isNew: true,
    tags: ["Neuroscience", "All Profiles", "Research-Based", "Interactive"],
    viewUrl: "/ebook"
  },

  // Videos
  {
    id: "video-foundation",
    title: "NEP Foundation: Understanding Your Child's Brain",
    description: "Master class on the neuroscience behind the three brain profiles. Learn why traditional parenting fails and how to speak your child's neurological language.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    duration: "18 min",
    locked: false,
    completed: true,
    isNew: false,
    tags: ["Fundamentals", "Neuroscience", "All Parents"],
    viewUrl: "/videos"
  },
  {
    id: "video-defiant",
    title: "Mastering the DEFIANT Profile",
    description: "Deep dive into ODD, high cortisol, and the neurology of defiance. Complete script library for oppositional behaviors.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    duration: "22 min",
    locked: false,
    completed: false,
    progress: 35,
    tags: ["DEFIANT", "ODD", "Advanced"],
    viewUrl: "/videos"
  },
  {
    id: "video-intense",
    title: "Understanding the INTENSE Child",
    description: "Emotional regulation, sensory overload, and the intensity spectrum. Learn to channel intensity into strengths.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop",
    duration: "20 min",
    locked: false,
    completed: false,
    progress: 60,
    tags: ["INTENSE", "Emotional Regulation", "Sensory"],
    viewUrl: "/videos"
  },
  {
    id: "video-distracted",
    title: "The DISTRACTED Profile Decoded",
    description: "Executive function challenges, dopamine regulation, and the neuroscience of ADHD. Proven strategies that actually work.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop",
    duration: "19 min",
    locked: false,
    completed: false,
    isNew: true,
    tags: ["DISTRACTED", "ADHD", "Executive Function"],
    viewUrl: "/videos"
  },

  // PDFs and Quick Guides
  {
    id: "pdf-quick-reference",
    title: "NEP Quick Reference Guide",
    description: "Printable cheat sheet with all 3 profiles, top 20 scripts for each situation, and quick identification flowchart.",
    category: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
    size: "2.5 MB",
    locked: false,
    completed: false,
    tags: ["Printable", "Quick Access", "Cheat Sheet"],
    downloadUrl: "#"
  },
  {
    id: "pdf-bedtime",
    title: "7-Step Bedtime Routine Blueprint",
    description: "Evening routine that works for all brain types. Includes visual schedule templates and troubleshooting guide.",
    category: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=800&auto=format&fit=crop",
    size: "1.8 MB",
    locked: false,
    completed: true,
    tags: ["Routines", "Sleep", "All Profiles"],
    downloadUrl: "#"
  },
  {
    id: "pdf-homework",
    title: "Homework Battle Elimination System",
    description: "Profile-specific strategies to end homework fights forever. Includes timer techniques and reward systems.",
    category: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    size: "2.1 MB",
    locked: false,
    completed: false,
    isNew: true,
    tags: ["Homework", "School", "Executive Function"],
    downloadUrl: "#"
  },
  {
    id: "pdf-morning",
    title: "Chaos-Free Morning Routine",
    description: "Get out the door without meltdowns. Visual schedules, time-boxing strategies, and neurologically-informed preparation.",
    category: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop",
    size: "1.5 MB",
    locked: false,
    completed: false,
    tags: ["Mornings", "Routines", "Time Management"],
    downloadUrl: "#"
  },

  // Tools and Templates
  {
    id: "tool-tracker",
    title: "Behavior Pattern Tracker",
    description: "Interactive tool to identify triggers, track progress, and measure script effectiveness over 30 days.",
    category: "tool",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    locked: false,
    completed: false,
    tags: ["Tracking", "Data", "Progress"],
    viewUrl: "#"
  },
  {
    id: "template-visual-schedule",
    title: "Visual Schedule Builder",
    description: "Customizable visual schedules for morning, evening, and homework routines. Works for all ages and profiles.",
    category: "template",
    thumbnail: "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&auto=format&fit=crop",
    locked: false,
    completed: false,
    isNew: true,
    tags: ["Visual Aids", "Routines", "Customizable"],
    downloadUrl: "#"
  },
  {
    id: "tool-script-generator",
    title: "Custom Script Generator",
    description: "AI-powered tool to create personalized NEP scripts for unique situations based on your child's profile.",
    category: "tool",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
    locked: false,
    completed: false,
    tags: ["AI-Powered", "Custom", "Advanced"],
    viewUrl: "#"
  },

  // Advanced/Locked Content
  {
    id: "pdf-master-collection",
    title: "150 NEP Scripts Master Collection",
    description: "Complete collection covering every situation: meltdowns, transitions, social skills, school issues, and more. Organized by profile and severity.",
    category: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
    size: "12.5 MB",
    locked: true,
    requirement: "Complete 30-day challenge",
    tags: ["Complete", "Advanced", "All Situations"]
  },
  {
    id: "video-advanced-defiant",
    title: "Advanced DEFIANT: Severe ODD & Explosive Behavior",
    description: "For parents dealing with extreme defiance, aggression, and explosive episodes. Includes crisis de-escalation protocols.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&auto=format&fit=crop",
    duration: "32 min",
    locked: true,
    requirement: "Complete DEFIANT profile module",
    tags: ["DEFIANT", "Crisis", "Advanced"]
  },
  {
    id: "session-coaching",
    title: "1-on-1 Breakthrough Coaching Call",
    description: "Private 45-minute session with NEP creator to solve your toughest situation and create a personalized action plan.",
    category: "session",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
    duration: "45 min",
    locked: true,
    requirement: "Refer 3 friends or reach Mastery level",
    tags: ["1-on-1", "Expert", "Personalized"]
  },
  {
    id: "video-school-advocacy",
    title: "School Advocacy Masterclass",
    description: "Get your child the support they need. IEP/504 navigation, teacher communication scripts, and accommodation strategies.",
    category: "video",
    thumbnail: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&auto=format&fit=crop",
    duration: "28 min",
    locked: true,
    requirement: "Complete Foundation modules",
    tags: ["School", "IEP", "504", "Advocacy"],
    isNew: true
  },
  {
    id: "template-iep-toolkit",
    title: "Complete IEP/504 Toolkit",
    description: "Templates, scripts, and strategies for effective school meetings. Includes accommodation suggestions by profile.",
    category: "template",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    locked: true,
    requirement: "Complete School Advocacy module",
    tags: ["IEP", "504", "School", "Templates"]
  }
];

// Category counts helper
export function getBonusCategoryCounts(bonuses: BonusData[]) {
  const counts = {
    all: bonuses.length,
    video: bonuses.filter(b => b.category === 'video').length,
    ebook: bonuses.filter(b => b.category === 'ebook').length,
    pdf: bonuses.filter(b => b.category === 'pdf').length,
    tool: bonuses.filter(b => b.category === 'tool').length,
    template: bonuses.filter(b => b.category === 'template').length,
    session: bonuses.filter(b => b.category === 'session').length
  };
  return counts;
}

// Filter helpers
export function filterBonuses(
  bonuses: BonusData[],
  category: string,
  searchQuery: string
): BonusData[] {
  let filtered = bonuses;

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(b => b.category === category);
  }

  // Filter by search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      b =>
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// Sort helpers
export function sortBonuses(bonuses: BonusData[], sortBy: string): BonusData[] {
  const sorted = [...bonuses];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'popular':
      return sorted.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'progress':
      return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    case 'completed':
      return sorted.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
    default:
      return sorted;
  }
}

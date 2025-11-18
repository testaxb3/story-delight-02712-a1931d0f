export interface WritingExample {
  title: string;
  bad: string;
  good: string;
  why: string;
}

export const writingGuidelines = {
  do: [
    'Write like an experienced friend giving practical advice',
    'Use short, direct sentences',
    'Validate feelings before offering solutions',
    'Admit that parenting is hard',
    'Use light humor where appropriate',
    'Include specific, real details',
    'End each section with a clear action step'
  ],
  dont: [
    'Sound like an academic textbook',
    'Use excessive jargon',
    'Be condescending ("Dear parent...")',
    'Make unrealistic promises ("Your child will never...")',
    'Use generic AI language ("It\'s important to note that...")',
    'Use generic examples ("John, age 5")',
    'Leave parents without a concrete next step'
  ],
  aiPhrases: [
    '"It\'s important to note that..."',
    '"We must consider..."',
    '"Dear parent..."',
    '"You might try..."',
    '"Studies show that..."',
    '"It\'s essential that..."',
    '"Research indicates that..."',
    '"It\'s fundamental to understand..."'
  ]
};

export const writingExamples: WritingExample[] = [
  {
    title: 'Chapter Opening',
    bad: `It's important to establish a consistent routine for your child. Research shows that children benefit from structure and predictability. We must consider each child's individual needs when implementing a routine.`,
    good: `Look, I know you've heard "establish a routine" a million times. But here's what nobody tells you: routines fail with neurodivergent kids because their brains work differently. Let me show you what actually works when you're 10 minutes from being late (again).`,
    why: 'Good version: (1) Validates frustration, (2) Explains WHY it fails, (3) Promises practical solution, (4) Uses real, direct language'
  },
  {
    title: 'Explaining Neuroscience',
    bad: `Neurological studies indicate that the prefrontal cortex of neurodivergent children shows atypical development, which impacts emotional regulation and impulse control. It's essential to understand these neurobiological differences.`,
    good: `Your INTENSE child's brain has a louder alarm system than other kids. When they get upset, it's like their brain's fire alarm goes off for a candle—not because they're dramatic, but because their brain genuinely perceives bigger threats. This is why "calm down" never works.`,
    why: 'Good version: (1) Uses simple metaphor, (2) Explains observable behavior, (3) Removes blame, (4) Connects to solution'
  },
  {
    title: 'Giving Practical Instructions',
    bad: `You might try implementing an emotional validation strategy followed by behavioral redirection. It's important to stay calm and use clear, age-appropriate language.`,
    good: `When your child starts melting down, do this:\n\n1. Get low (eye level)\n2. Say: "I see you're really mad"\n3. Wait 3 seconds\n4. Then: "Mad AND we still need shoes on"\n\nThat's it. No explaining. No reasoning. Just connect, validate, command.`,
    why: 'Good version: (1) Clear numbered steps, (2) Exact script, (3) Specific timing, (4) Removes complexity'
  },
  {
    title: 'Telling Real Examples',
    bad: `John, age 5, had difficulty with transitions. His parents implemented a visual routine and observed significant behavioral improvements.`,
    good: `Sarah's 6-year-old DEFIANT son would throw his shoes at her every single morning. She tried charts, rewards, consequences—nothing worked. Until she gave him a choice: "Red shoes or blue shoes?" He picked blue, put them on himself. Not because the shoes were magic, but because HE chose them. That's how DEFIANT brains work.`,
    why: 'Good version: (1) Specific details (age, exact behavior), (2) Shows failed attempts, (3) Explains WHAT worked and WHY, (4) Connects to bigger concept'
  },
  {
    title: 'Handling Failures',
    bad: `It's normal for strategies not to work immediately. Persistence and consistency are fundamental for long-term success.`,
    good: `This will fail the first 3 times. Your kid will test it. That's their job. Here's your backup plan: when they refuse, say "Okay, 2 more minutes" and set a timer. Then do it again. The strategy isn't broken—they're just learning you mean it.`,
    why: 'Good version: (1) Warns about failure upfront, (2) Explains why (removes parent guilt), (3) Gives specific backup plan, (4) Reframes as normal part of process'
  }
];

export const calloutGuidelines = {
  remember: {
    when: 'Critical insights parents must understand',
    example: `[REMEMBER]
Title: The Real Problem
Content: Traditional morning routines fail because they assume your child's brain works like neurotypical children. It doesn't. Their executive function develops 3-5 years behind peers, which means "get ready for school" sounds like "xjkdfhskjdfh" to their brain.`
  },
  science: {
    when: 'Neuroscience explanations simplified for parents',
    example: `[SCIENCE]
Title: Why Their Brain Works This Way
Content: The amygdala (emotion center) responds 300% faster in INTENSE children compared to peers. When your child screams over a broken cookie, their brain genuinely experiences cookie-level-threat as physical danger. This isn't drama—it's neurology.`
  },
  warning: {
    when: 'Important cautions or risks to avoid',
    example: `[WARNING]
Title: Don't Do This
Content: Never use time-outs during meltdowns. When their nervous system is in fight-or-flight, isolation triggers abandonment fear and makes everything worse. Time-outs work for behavior, never for big emotions.`
  },
  try: {
    when: 'Actionable exercises or strategies to implement immediately',
    example: `[TRY]
Title: The 3-Second Reset
Content: Next time your child escalates, try this:

1. Get eye level
2. Take one deep breath together
3. Say: "I see you"

That's it. This 3-second intervention interrupts the stress response and signals safety to their nervous system.`
  }
};

export const readerV2JsonFormat = {
  blockTypes: [
    {
      type: 'heading',
      description: 'Section headings (H2 only, H1 is chapter title)',
      example: {
        type: 'heading',
        level: 2,
        content: 'Why It Works'
      }
    },
    {
      type: 'paragraph',
      description: 'Text content with line breaks for readability',
      example: {
        type: 'paragraph',
        content: "Your child's brain is wired differently.\n\nThis isn't a problem to fix—it's a difference to understand."
      }
    },
    {
      type: 'callout',
      description: 'Colored callout boxes (REMEMBER, SCIENCE, WARNING, TRY)',
      example: {
        type: 'callout',
        calloutType: 'REMEMBER',
        title: 'The Key Insight',
        content: 'Connection before correction always wins. Your child needs to feel safe before they can think clearly.'
      }
    },
    {
      type: 'script',
      description: 'NEP scripts with steps and explanation',
      example: {
        type: 'script',
        title: 'Morning Transition Script',
        steps: [
          'Get eye level with your child',
          'Say: "I see you\'re not ready yet"',
          'Wait 3 seconds',
          'Then: "Time to choose: shoes or socks first?"'
        ],
        why_it_works: 'This script works because it validates their state, gives them control through choice, and uses their brain\'s natural preference for autonomy.'
      }
    },
    {
      type: 'list',
      description: 'Bulleted or numbered lists (each item separate)',
      example: {
        type: 'list',
        ordered: false,
        items: [
          'First item here',
          'Second item here',
          'Third item here'
        ]
      }
    }
  ],
  criticalRules: [
    '✅ Each block is self-contained (no dependencies on adjacent blocks)',
    '✅ Callout blocks include title + content together in single block',
    '✅ List items are separate array entries, NEVER concatenated strings',
    '✅ Line breaks within paragraphs use \\n for readability',
    '✅ Markdown formatting: **bold**, *italic*, `code`',
    '❌ NO adjacent block dependencies (paragraph continuing callout)',
    '❌ NO splitting callout content across multiple blocks',
    '❌ NO multiple list items in single string ("• Item 1\\n• Item 2")'
  ]
};

export const readerV2Standards = {
  chapterStructure: [
    'Chapter cover with number, title, and subtitle',
    'Opening micro-story (2-3 paragraphs, 50-100 words)',
    'H2 section headings with 2-4 paragraphs each',
    '1-2 callouts per section (REMEMBER/SCIENCE/WARNING/TRY)',
    'Script boxes for strategies with exact phrases',
    'Bold for key concepts, italic for emphasis',
    'Lists: numbered for processes, bullets for concepts'
  ],
  formattingRules: [
    'Use \\n for line breaks within paragraphs',
    'Each JSON block renders directly (no pre-processing)',
    'Self-contained callouts with title + content',
    'Separate array entries for each list item',
    'Proper markdown: **bold**, *italic*, `code`',
    'Script boxes include title, steps array, why_it_works'
  ],
  sevenChapterTemplate: [
    'Chapter 1: The Real Problem (validation + hook)',
    'Chapter 2: Why It Happens (neuroscience simplified)',
    'Chapter 3: The Framework (practical structure)',
    'Chapter 4: Scripts That Work (ready-to-use phrases)',
    'Chapter 5: When It Fails (backup plans)',
    'Chapter 6: Real Success Stories (detailed examples)',
    'Chapter 7: Quick Reference (cheat sheet)'
  ]
};

export const qualityChecklist = {
  content: [
    'Zero generic AI phrases ("It\'s important to note...")',
    'Minimum 5 specific numbers per chapter',
    '2+ named examples with details',
    'Included what to do when strategies fail',
    'Sounds conversational, not academic',
    'Validates parent feelings before solutions',
    'Ends each section with clear action step'
  ],
  writing: [
    'Short sentences (max 20 words)',
    'Uses contractions (you\'re, can\'t, won\'t)',
    'Direct questions to reader',
    'Admits reality ("It\'s not easy", "This will fail first")',
    'Light humor where appropriate',
    'Specific sensory details'
  ],
  value: [
    'Solves real problem parents face',
    'Explains WHY strategies work (neuroscience)',
    'Provides backup plans for failures',
    'Includes exact scripts with timing',
    'Differentiates from generic advice',
    'Gives immediate action to try today'
  ],
  structure: [
    'Opens with relatable micro-story',
    'Clear H2 section headings',
    '7 chapters following template',
    'Callouts enhance (don\'t interrupt) flow',
    'Script boxes for practical strategies',
    'Quick reference at end'
  ],
  readerV2Compatibility: [
    'JSON format follows Reader V2 standards',
    'Callouts use REMEMBER/SCIENCE/WARNING/TRY',
    'All blocks are self-contained',
    'List items are separate array entries',
    'Proper line breaks within paragraphs (\\n)',
    'Markdown formatting applied correctly',
    'Script boxes include title + steps + why_it_works',
    'No adjacent block dependencies'
  ],
  technical: [
    'All content in English',
    'Estimated reading time calculated',
    'Proper slug format ([category]-[profile]-v2)',
    'Cover image specified',
    'Tags relevant to content',
    'Total word count appropriate (12,000-18,000)'
  ],
  redFlags: [
    '❌ "It\'s important to note"',
    '❌ "Dear parent"',
    '❌ Generic examples ("John, age 5")',
    '❌ Unrealistic promises ("never have tantrums again")',
    '❌ No specific numbers or timing',
    '❌ Academic tone',
    '❌ No backup plans for failures'
  ]
};

export const templateStructure = {
  sevenChapter: {
    title: '7-Chapter Ebook Template (12,000-18,000 words)',
    chapters: [
      {
        number: 1,
        title: 'The Real Problem',
        wordCount: '1,500-2,000',
        content: [
          'Hook: Specific scenario they experience daily',
          'Validation: "You\'re not alone, this is hard"',
          'Why traditional advice fails',
          'Promise: What this ebook will do differently',
          'Callout: REMEMBER - The key insight'
        ]
      },
      {
        number: 2,
        title: 'Why It Happens',
        wordCount: '2,000-2,500',
        content: [
          'Neuroscience simplified (5th grade level)',
          'Brain differences explained with metaphors',
          'Why their behavior makes sense',
          'Callout: SCIENCE - The brain mechanism',
          'Connection to observable behavior'
        ]
      },
      {
        number: 3,
        title: 'The Framework',
        wordCount: '2,500-3,000',
        content: [
          '3-5 step framework for the approach',
          'Each step explained with examples',
          'Visual breakdown of process',
          'Callout: REMEMBER - Most important principle',
          'Common mistakes to avoid',
          'Callout: WARNING - What not to do'
        ]
      },
      {
        number: 4,
        title: 'Scripts That Work',
        wordCount: '3,000-4,000',
        content: [
          '5-7 specific situations',
          'Exact phrases to use (word-for-word)',
          'Timing details ("wait 3 seconds")',
          'Script boxes for each scenario',
          'Why each script works (neuroscience)',
          'Callout: TRY - Exercise to practice'
        ]
      },
      {
        number: 5,
        title: 'When It Fails',
        wordCount: '1,500-2,000',
        content: [
          'Reality check: "This will fail sometimes"',
          'Backup plan for each strategy',
          'Signs it\'s not working',
          'How to adjust approach',
          'Callout: WARNING - Red flags',
          'When to seek additional help'
        ]
      },
      {
        number: 6,
        title: 'Real Success Stories',
        wordCount: '1,500-2,000',
        content: [
          '3-4 detailed examples',
          'Include what didn\'t work first',
          'Specific timeline ("after 2 weeks")',
          'Not perfect outcomes, realistic wins',
          'Different scenarios for different profiles',
          'Callout: REMEMBER - Key takeaway'
        ]
      },
      {
        number: 7,
        title: 'Quick Reference',
        wordCount: '1,000-1,500',
        content: [
          'Cheat sheet format',
          'Visual summary of framework',
          'Script shortcuts',
          'Warning signs list',
          'Next steps',
          'Resources for continued learning'
        ]
      }
    ]
  }
};

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
}

export const glossaryTerms: Record<string, GlossaryTerm> = {
  "amygdala": {
    term: "Amygdala",
    definition: "An almond-shaped structure in the brain's limbic system responsible for processing emotions, particularly fear and threat detection. It plays a crucial role in emotional regulation and stress responses.",
    relatedTerms: ["prefrontal cortex", "limbic system"]
  },
  "prefrontal cortex": {
    term: "Prefrontal Cortex",
    definition: "The front part of the brain responsible for executive functions like planning, decision-making, impulse control, and emotional regulation. It continues developing until the mid-20s.",
    relatedTerms: ["amygdala", "executive function"]
  },
  "executive function": {
    term: "Executive Function",
    definition: "A set of cognitive skills including working memory, flexible thinking, and self-control that help us plan, focus attention, remember instructions, and juggle multiple tasks successfully.",
    relatedTerms: ["prefrontal cortex", "working memory"]
  },
  "cortical thinning": {
    term: "Cortical Thinning",
    definition: "A normal developmental process where the brain's outer layer (cortex) becomes thinner as neural connections are refined and strengthened during childhood and adolescence.",
    relatedTerms: ["neuroplasticity"]
  },
  "neuroplasticity": {
    term: "Neuroplasticity",
    definition: "The brain's ability to reorganize itself by forming new neural connections throughout life. This allows the brain to adapt, learn, and recover from injuries.",
    relatedTerms: ["cortical thinning"]
  },
  "working memory": {
    term: "Working Memory",
    definition: "A cognitive system that temporarily holds and manipulates information needed for complex tasks like learning, reasoning, and comprehension. It's like the brain's mental notepad.",
    relatedTerms: ["executive function"]
  },
  "limbic system": {
    term: "Limbic System",
    definition: "A group of brain structures including the amygdala and hippocampus that support functions like emotion, behavior, motivation, long-term memory, and smell.",
    relatedTerms: ["amygdala"]
  },
  "neurotransmitter": {
    term: "Neurotransmitter",
    definition: "Chemical messengers that transmit signals between nerve cells in the brain. Examples include dopamine (reward), serotonin (mood), and norepinephrine (alertness).",
    relatedTerms: ["dopamine", "serotonin"]
  },
  "dopamine": {
    term: "Dopamine",
    definition: "A neurotransmitter associated with reward, motivation, and pleasure. It plays a key role in the brain's reward system and is often dysregulated in ADHD.",
    relatedTerms: ["neurotransmitter"]
  },
  "serotonin": {
    term: "Serotonin",
    definition: "A neurotransmitter that contributes to feelings of well-being and happiness, regulates mood, sleep, appetite, and digestion.",
    relatedTerms: ["neurotransmitter"]
  },
  "sensory processing": {
    term: "Sensory Processing",
    definition: "How the nervous system receives messages from the senses and turns them into appropriate responses. Some children have sensory processing differences affecting how they experience touch, sound, taste, smell, and sight.",
    relatedTerms: []
  },
  "emotional regulation": {
    term: "Emotional Regulation",
    definition: "The ability to manage and respond to emotional experiences in a socially acceptable way. It involves recognizing emotions, understanding them, and choosing appropriate responses.",
    relatedTerms: ["amygdala", "prefrontal cortex"]
  }
};

export const getAllTerms = (): string[] => {
  return Object.keys(glossaryTerms);
};

export const getTerm = (term: string): GlossaryTerm | undefined => {
  const normalized = term.toLowerCase().replace(/[^a-z\s]/g, '');
  return glossaryTerms[normalized];
};

export const searchTerms = (query: string): GlossaryTerm[] => {
  const normalizedQuery = query.toLowerCase();
  return Object.values(glossaryTerms).filter(term =>
    term.term.toLowerCase().includes(normalizedQuery) ||
    term.definition.toLowerCase().includes(normalizedQuery)
  );
};

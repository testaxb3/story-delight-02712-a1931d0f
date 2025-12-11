// Structured lesson content types for premium Cal AI-style rendering

export interface LessonHeroSection {
  type: 'hero';
  data: {
    coverImage?: string;
    title: string;
    subtitle?: string;
  };
}

export interface LessonTextSection {
  type: 'text';
  data: {
    content: string;
    variant?: 'default' | 'lead' | 'highlight';
  };
}

export interface LessonHeadingSection {
  type: 'heading';
  data: {
    text: string;
    level?: 2 | 3;
  };
}

export interface LessonNumberedListSection {
  type: 'numbered-list';
  data: {
    title?: string;
    subtitle?: string;
    items: Array<{
      number: number;
      title: string;
      description?: string;
    }>;
    colorScheme?: 'blue' | 'orange' | 'green' | 'purple';
  };
}

export interface LessonVisualDiagramSection {
  type: 'visual-diagram';
  data: {
    title: string;
    centerImage?: string;
    labels: Array<{
      number: number;
      text: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
    }>;
  };
}

export interface LessonReflectionFormSection {
  type: 'reflection-form';
  data: {
    title?: string;
    description?: string;
    fields: Array<{
      label: string;
      placeholder?: string;
      description?: string;
    }>;
  };
}

export interface LessonAccordionSection {
  type: 'accordion';
  data: {
    title?: string;
    items: Array<{
      title: string;
      content: string;
      icon?: string;
    }>;
  };
}

export interface LessonCalloutSection {
  type: 'callout';
  data: {
    variant: 'info' | 'warning' | 'success' | 'tip';
    title?: string;
    content: string;
  };
}

export interface LessonCTASection {
  type: 'cta';
  data: {
    text: string;
    description?: string;
    buttonText: string;
    buttonAction?: 'next' | 'diary' | 'close';
  };
}

export interface LessonDividerSection {
  type: 'divider';
  data?: {
    style?: 'line' | 'dots' | 'space';
  };
}

export type LessonSection = 
  | LessonHeroSection
  | LessonTextSection
  | LessonHeadingSection
  | LessonNumberedListSection
  | LessonVisualDiagramSection
  | LessonReflectionFormSection
  | LessonAccordionSection
  | LessonCalloutSection
  | LessonCTASection
  | LessonDividerSection;

export interface StructuredLessonContent {
  version: 2;
  sections: LessonSection[];
}

// Helper to check if content is structured
export function isStructuredContent(content: unknown): content is StructuredLessonContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'version' in content &&
    (content as StructuredLessonContent).version === 2 &&
    'sections' in content &&
    Array.isArray((content as StructuredLessonContent).sections)
  );
}

import { StructuredLessonContent, LessonSection } from '@/types/lesson-content';
import { LessonHeroCard } from './LessonHeroCard';
import { LessonText } from './LessonText';
import { LessonNumberedList } from './LessonNumberedList';
import { LessonVisualDiagram } from './LessonVisualDiagram';
import { LessonReflectionForm } from './LessonReflectionForm';
import { LessonAccordion } from './LessonAccordion';
import { LessonCallout } from './LessonCallout';
import { LessonCTA } from './LessonCTA';
import { LessonDivider } from './LessonDivider';

interface Props {
  content: StructuredLessonContent;
  onCTAAction?: (action: string) => void;
}

export function LessonContentRenderer({ content, onCTAAction }: Props) {
  const renderSection = (section: LessonSection, index: number) => {
    const key = `section-${index}`;
    
    switch (section.type) {
      case 'hero':
        return <LessonHeroCard key={key} data={section.data} />;
      case 'text':
        return <LessonText key={key} data={section.data} />;
      case 'numbered-list':
        return <LessonNumberedList key={key} data={section.data} />;
      case 'visual-diagram':
        return <LessonVisualDiagram key={key} data={section.data} />;
      case 'reflection-form':
        return <LessonReflectionForm key={key} data={section.data} />;
      case 'accordion':
        return <LessonAccordion key={key} data={section.data} />;
      case 'callout':
        return <LessonCallout key={key} data={section.data} />;
      case 'cta':
        return <LessonCTA key={key} data={section.data} onAction={onCTAAction} />;
      case 'divider':
        return <LessonDivider key={key} data={section.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-0">
      {content.sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}

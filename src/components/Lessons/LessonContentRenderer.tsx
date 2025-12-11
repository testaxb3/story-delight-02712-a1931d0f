import { motion } from 'framer-motion';

interface ContentBlock {
  type: string;
  content?: string;
  items?: string[];
  text?: string;
  label?: string;
  level?: number;
  alt?: string;
  src?: string;
}

interface LessonContentRendererProps {
  content: string | ContentBlock[] | null;
}

export default function LessonContentRenderer({ content }: LessonContentRendererProps) {
  if (!content) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Content not available yet.
      </p>
    );
  }

  // If content is a string, try to parse it as JSON
  let blocks: ContentBlock[] = [];
  
  if (typeof content === 'string') {
    try {
      blocks = JSON.parse(content);
    } catch {
      // If not valid JSON, render as plain text
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap">{content}</p>
        </div>
      );
    }
  } else if (Array.isArray(content)) {
    blocks = content;
  }

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Content not available yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ContentBlockRenderer block={block} />
        </motion.div>
      ))}
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
      const headingClasses = {
        1: 'text-2xl font-bold text-foreground mb-4',
        2: 'text-xl font-semibold text-foreground mb-3',
        3: 'text-lg font-medium text-foreground mb-2',
      };
      return (
        <HeadingTag className={headingClasses[block.level as 1 | 2 | 3] || headingClasses[2]}>
          {block.content}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p className="text-foreground leading-relaxed">
          {block.content}
        </p>
      );

    case 'list':
      return (
        <ul className="list-disc list-inside space-y-2 text-foreground">
          {block.items?.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          {block.label && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {block.label}
            </span>
          )}
          <p className="text-foreground mt-1">{block.content}</p>
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground">
          {block.content}
        </blockquote>
      );

    case 'script_box':
      return (
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Say this:</p>
          <p className="text-foreground font-medium italic">"{block.text}"</p>
        </div>
      );

    case 'image':
      return (
        <div className="rounded-xl overflow-hidden">
          <img 
            src={block.src} 
            alt={block.alt || 'Lesson image'} 
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      );

    case 'divider':
      return <hr className="border-border my-6" />;

    default:
      // Fallback for unknown types
      if (block.content) {
        return <p className="text-foreground">{block.content}</p>;
      }
      return null;
  }
}

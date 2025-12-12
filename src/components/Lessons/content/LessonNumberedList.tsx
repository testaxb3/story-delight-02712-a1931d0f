import { LessonNumberedListSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonNumberedListSection['data'];
}

// Custom hex colors to better match the reference images
const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
    line: 'border-blue-200 dark:border-blue-800',
    card: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100'
  },
  orange: {
    // Using a more golden/yellow tone for the "orange" scheme as seen in images
    bg: 'bg-[#FFB800] text-white', 
    text: 'text-[#393939]',
    dot: 'bg-[#FFB800]',
    line: 'border-[#FFB800]',
    card: 'bg-[#FFF9F0] border-[#FFECC8]' // Light beige background for cards
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    line: 'border-green-200 dark:border-green-800',
    card: 'bg-green-50/50 dark:bg-green-900/10 border-green-100'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
    line: 'border-purple-200 dark:border-purple-800',
    card: 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100'
  }
};

export function LessonNumberedList({ data }: Props) {
  const scheme = colorMap[data.colorScheme || 'blue'];

  if (data.variant === 'timeline') {
    return (
      <div className="mb-8">
        {data.title && (
          <h3 className="text-xl font-bold text-[#393939] dark:text-foreground mb-6">
            {data.title}
          </h3>
        )}
        
        <div className={cn("ml-2 border-l-[3px] space-y-4", scheme.line)}>
          {data.items.map((item, index) => (
            <div key={item.number} className="relative pl-6">
              {/* Dot - Positioned on the line */}
              <div className={cn(
                "absolute -left-[9.5px] top-6 w-[16px] h-[16px] rounded-full border-2 border-white dark:border-background z-10",
                scheme.dot
              )} />
              
              {/* Card Style Content */}
              <div className={cn(
                "p-4 rounded-xl border mb-2",
                scheme.card || "bg-card border-border"
              )}>
                <h4 className="font-bold text-[#393939] dark:text-foreground text-[16px] mb-1">
                  {item.title}: <span className="font-normal text-[#393939]/90 dark:text-foreground/90">{item.description}</span>
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default / Circled Number style
  return (
    <div className="mb-8">
      {data.title && (
        <h3 className="text-xl font-bold text-[#393939] dark:text-foreground mb-6">
          {data.title}
        </h3>
      )}
      {data.subtitle && (
        <p className="text-[15px] text-[#393939] dark:text-foreground/80 mb-4">{data.subtitle}</p>
      )}
      
      <div className="space-y-6">
        {data.items.map((item) => (
          <div key={item.number} className="flex gap-4 items-start">
            {/* Circled number */}
            <div className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm",
              scheme.bg
            )}>
              {item.number}
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-1">
              <h4 className="font-bold text-[#393939] dark:text-foreground text-[16px] mb-1 leading-tight">
                {item.title}: <span className="font-normal text-[#393939]/90 dark:text-foreground/90">{item.description}</span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

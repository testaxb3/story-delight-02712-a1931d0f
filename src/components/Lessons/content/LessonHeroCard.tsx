import { LessonHeroSection } from '@/types/lesson-content';

interface Props {
  data: LessonHeroSection['data'];
}

export function LessonHeroCard({ data }: Props) {
  if (!data.coverImage) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#393939] dark:text-foreground">{data.title}</h1>
        {data.subtitle && (
          <p className="text-[#393939]/80 dark:text-muted-foreground text-sm mt-2">{data.subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden mb-6">
      <img 
        src={data.coverImage} 
        alt={data.title}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

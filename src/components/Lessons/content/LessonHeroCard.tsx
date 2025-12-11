import { LessonHeroSection } from '@/types/lesson-content';

interface Props {
  data: LessonHeroSection['data'];
}

export function LessonHeroCard({ data }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary/5 to-purple-500/10 mb-6">
      {data.coverImage ? (
        <div className="relative">
          <img 
            src={data.coverImage} 
            alt={data.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-white/80 text-sm mt-1">{data.subtitle}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">{data.title}</h1>
          {data.subtitle && (
            <p className="text-muted-foreground text-sm mt-2">{data.subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}

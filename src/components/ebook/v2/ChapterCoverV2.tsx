interface ChapterCoverV2Props {
  chapterNumber: number;
  title: string;
  subtitle?: string;
}

export const ChapterCoverV2 = ({ chapterNumber, title, subtitle }: ChapterCoverV2Props) => {
  const cleanTitle = title?.trim() || 'Untitled';
  const cleanSubtitle = subtitle?.trim();
  
  return (
    <div className="relative mb-16 py-20 px-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border border-primary/10 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center space-y-6">
        <div className="inline-block">
          <span className="text-sm font-sans font-semibold tracking-widest uppercase text-primary/70">
            Chapter {chapterNumber}
          </span>
        </div>
        
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl gradient-text leading-tight max-w-2xl mx-auto">
          {cleanTitle}
        </h1>
        
        {cleanSubtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-xl mx-auto leading-relaxed">
            {cleanSubtitle}
          </p>
        )}
        
        {/* Decorative line */}
        <div className="flex items-center justify-center pt-8">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

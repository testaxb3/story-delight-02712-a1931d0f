interface ChapterCoverV2Props {
  chapterNumber: number;
  title: string;
  subtitle?: string;
}

export const ChapterCoverV2 = ({ chapterNumber, title, subtitle }: ChapterCoverV2Props) => {
  const cleanTitle = title?.trim() || 'Untitled';
  const cleanSubtitle = subtitle?.trim();
  
  if (import.meta.env.DEV) {
    console.log('🎨 ChapterCoverV2 rendering:', { 
      chapterNumber, 
      title, 
      subtitle,
      cleanTitle, 
      cleanSubtitle 
    });
  }
  
  return (
    <div className="relative mb-16 py-12 px-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 shadow-lg">
      <div className="text-center space-y-6">
        <div>
          <span className="text-sm font-sans font-bold tracking-widest uppercase text-primary">
            Chapter {chapterNumber}
          </span>
        </div>
        
        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight">
          {cleanTitle}
        </h1>
        
        {cleanSubtitle && (
          <p className="text-lg md:text-xl text-foreground/80 font-serif leading-relaxed max-w-2xl mx-auto">
            {cleanSubtitle}
          </p>
        )}
      </div>
    </div>
  );
};

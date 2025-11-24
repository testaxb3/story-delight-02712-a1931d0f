interface ChapterCoverV2Props {
  chapterNumber: number;
  title: string;
  subtitle?: string;
}

export const ChapterCoverV2 = ({ chapterNumber, title, subtitle }: ChapterCoverV2Props) => {
  const cleanTitle = title?.trim() || 'Untitled';
  const cleanSubtitle = subtitle?.trim();
  
  return (
    <div className="relative mb-12 py-8 px-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
      <div className="text-center space-y-4">
        <div>
          <span className="text-xs font-sans font-semibold tracking-widest uppercase text-muted-foreground">
            Chapter {chapterNumber}
          </span>
        </div>
        
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-snug">
          {cleanTitle}
        </h1>
        
        {cleanSubtitle && (
          <p className="text-base md:text-lg text-muted-foreground font-serif leading-relaxed">
            {cleanSubtitle}
          </p>
        )}
      </div>
    </div>
  );
};

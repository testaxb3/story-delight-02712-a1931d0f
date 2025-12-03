import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number; // seconds per full scroll
}

export function MarqueeText({ text, className, speed = 8 }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
        setShouldAnimate(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className="overflow-hidden whitespace-nowrap"
    >
      <span 
        ref={textRef}
        className={cn(
          "inline-block",
          shouldAnimate && "animate-marquee",
          className
        )}
        style={shouldAnimate ? { animationDuration: `${speed}s` } : undefined}
      >
        {text}
        {shouldAnimate && (
          <>
            <span className="mx-12 text-white/30">•</span>
            {text}
          </>
        )}
      </span>
    </div>
  );
}

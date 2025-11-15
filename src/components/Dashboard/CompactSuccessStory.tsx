import { ThumbsUp } from 'lucide-react';
import { getBrainTypeIcon } from '@/lib/brainTypes';
import type { SuccessStory } from '@/lib/successStories';

interface CompactSuccessStoryProps {
  story: SuccessStory;
}

export const CompactSuccessStory = ({ story }: CompactSuccessStoryProps) => {
  return (
    <div className="card-glass rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-success/10 flex-shrink-0">
          <ThumbsUp className="w-6 h-6 text-success" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-foreground">{story.name}'s Success</span>
            <span className="text-sm text-muted-foreground">
              {getBrainTypeIcon(story.brainType)} {story.brainType}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground italic mb-3 line-clamp-2">
            "{story.quote}"
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-bold text-success">{story.after.value}</span>
              <span className="mx-1">from</span>
              <span className="line-through">{story.before.value}</span>
            </div>
            <div>•</div>
            <div>{story.timeline}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

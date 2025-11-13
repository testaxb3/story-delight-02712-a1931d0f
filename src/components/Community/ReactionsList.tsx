import React from 'react';
import { REACTIONS, ReactionType } from './ReactionPicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ReactionCount {
  type: ReactionType;
  count: number;
}

export interface ReactionWithUser {
  type: ReactionType;
  user_id: string;
  user_name: string;
  user_photo_url?: string;
}

interface ReactionsListProps {
  reactions: ReactionCount[];
  totalCount: number;
  onViewDetails?: () => void;
}

export function ReactionsList({ reactions, totalCount, onViewDetails }: ReactionsListProps) {
  if (totalCount === 0) return null;

  // Show top 3 reactions
  const topReactions = reactions
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <button
      onClick={onViewDetails}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:underline transition-colors"
    >
      <div className="flex -space-x-1">
        {topReactions.map((reaction) => {
          const reactionConfig = REACTIONS.find((r) => r.type === reaction.type);
          if (!reactionConfig) return null;

          return (
            <span
              key={reaction.type}
              className="inline-flex items-center justify-center w-5 h-5 bg-white rounded-full border border-border shadow-sm"
              title={`${reaction.count} ${reactionConfig.label}`}
            >
              <span className="text-xs">{reactionConfig.emoji}</span>
            </span>
          );
        })}
      </div>
      <span className="font-medium">{totalCount}</span>
    </button>
  );
}

interface ReactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactions: ReactionWithUser[];
}

export function ReactionsModal({ isOpen, onClose, reactions }: ReactionsModalProps) {
  // Group reactions by type
  const reactionsByType = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.type]) {
      acc[reaction.type] = [];
    }
    acc[reaction.type].push(reaction);
    return acc;
  }, {} as Record<ReactionType, ReactionWithUser[]>);

  const totalCount = reactions.length;
  const reactionTypes = Object.keys(reactionsByType) as ReactionType[];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reactions ({totalCount})</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="gap-1">
              All <span className="text-muted-foreground">({totalCount})</span>
            </TabsTrigger>
            {reactionTypes.map((type) => {
              const reactionConfig = REACTIONS.find((r) => r.type === type);
              const count = reactionsByType[type].length;
              return (
                <TabsTrigger key={type} value={type} className="gap-1">
                  <span>{reactionConfig?.emoji}</span>
                  <span className="text-muted-foreground">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <ScrollArea className="h-[300px] mt-4">
            {/* All reactions tab */}
            <TabsContent value="all" className="space-y-2">
              {reactions.map((reaction, index) => (
                <UserReactionItem key={`${reaction.user_id}-${index}`} reaction={reaction} />
              ))}
            </TabsContent>

            {/* Individual reaction type tabs */}
            {reactionTypes.map((type) => (
              <TabsContent key={type} value={type} className="space-y-2">
                {reactionsByType[type].map((reaction, index) => (
                  <UserReactionItem key={`${reaction.user_id}-${index}`} reaction={reaction} />
                ))}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function UserReactionItem({ reaction }: { reaction: ReactionWithUser }) {
  const reactionConfig = REACTIONS.find((r) => r.type === reaction.type);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      {/* User photo */}
      {reaction.user_photo_url ? (
        <img
          src={reaction.user_photo_url}
          alt={reaction.user_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {reaction.user_name.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* User name */}
      <div className="flex-1">
        <p className="font-medium text-sm">{reaction.user_name}</p>
      </div>

      {/* Reaction emoji */}
      <span className="text-2xl">{reactionConfig?.emoji}</span>
    </div>
  );
}

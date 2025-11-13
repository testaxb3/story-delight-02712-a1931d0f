import React, { useState } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Database } from '@/integrations/supabase/types';

type PostComment = Database['public']['Tables']['post_comments']['Row'] & {
  profiles: {
    name: string | null;
    email: string | null;
    photo_url: string | null;
  } | null;
};

interface CommentItemProps {
  comment: PostComment;
  currentUserId: string | null;
  onDelete: (commentId: string) => void;
  onReply: (parentId: string, content: string) => void;
  onToggleReplies?: (commentId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  getInitialsFromName: (name: string) => string;
  depth?: number;
  repliesCount?: number;
  showReplies?: boolean;
}

function CommentItemComponent({
  comment,
  currentUserId,
  onDelete,
  onReply,
  onToggleReplies,
  formatTimestamp,
  getInitialsFromName,
  depth = 0,
  repliesCount = 0,
  showReplies = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const isOwnComment = currentUserId && comment.user_id === currentUserId;
  const canReply = depth === 0; // Only allow replies to top-level comments (max 1 level)

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''}`}>
      <div className="flex gap-3 items-start group">
        {/* Avatar */}
        {comment.profiles?.photo_url ? (
          <img
            src={comment.profiles.photo_url}
            alt={`${comment.profiles?.name || comment.profiles?.email || 'User'} avatar`}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitialsFromName(comment.profiles?.name || comment.profiles?.email || 'U')}
          </div>
        )}

        <div className="flex-1 space-y-1">
          {/* Comment Content */}
          <div className="bg-muted/50 rounded-2xl px-4 py-2">
            <p className="text-sm font-semibold">
              {comment.profiles?.name || comment.profiles?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-sm text-foreground">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-3 px-2">
            <p className="text-xs text-muted-foreground">
              {comment.created_at ? formatTimestamp(comment.created_at) : 'Just now'}
            </p>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Reply
              </button>
            )}

            {repliesCount > 0 && onToggleReplies && (
              <button
                onClick={() => onToggleReplies(comment.id)}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                {showReplies ? 'Hide' : 'View'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReplySubmit();
                  }
                  if (e.key === 'Escape') {
                    setIsReplying(false);
                    setReplyContent('');
                  }
                }}
                className="flex-1 rounded-full text-sm h-9"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="rounded-full h-9 px-4"
              >
                Reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="rounded-full h-9 px-4"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Delete Button */}
        {isOwnComment && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(comment.id)}
            aria-label="Delete comment"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export const CommentItem = React.memo(CommentItemComponent);


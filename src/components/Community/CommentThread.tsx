import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommentItem } from './CommentItem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type PostComment = Database['public']['Tables']['post_comments']['Row'] & {
  profiles: {
    name: string | null;
    email: string | null;
    photo_url: string | null;
  } | null;
  parent_comment_id?: string | null;
};

interface CommentThreadProps {
  postId: string;
  currentUserId: string | null;
  userPhotoUrl?: string | null;
  userInitials: string;
  formatTimestamp: (timestamp: string) => string;
  getInitialsFromName: (name: string) => string;
  onCommentCountChange?: (newCount: number) => void;
}

export function CommentThread({
  postId,
  currentUserId,
  userPhotoUrl,
  userInitials,
  formatTimestamp,
  getInitialsFromName,
  onCommentCountChange,
}: CommentThreadProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fetchedRef = useRef<string | null>(null);

  // Fetch comments once when component mounts or postId changes (guarded)
  useEffect(() => {
    if (fetchedRef.current === postId) return; // already fetched for this post
    fetchedRef.current = postId;

    let mounted = true;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            profiles:user_id (name, email, photo_url)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (mounted) {
          const typedComments = (data || []) as PostComment[];
          setComments(typedComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchComments();

    return () => {
      mounted = false;
    };
  }, [postId]); // only postId

  // Notify parent when count changes
  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(comments.length);
    }
  }, [comments.length]);

  // Add new top-level comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUserId || submitting) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: newComment.trim(),
          parent_comment_id: null,
        })
        .select(`
          *,
          profiles:user_id (name, email, photo_url)
        `)
        .single();

      if (error) throw error;

      if (data) {
        const typedComment = data as PostComment;
        setComments((prev) => [...prev, typedComment]);
        setNewComment('');
        toast.success('Comment added!');
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Add reply to a comment
  const handleAddReply = async (parentCommentId: string, content: string) => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content,
          parent_comment_id: parentCommentId,
        })
        .select(`
          *,
          profiles:user_id (name, email, photo_url)
        `)
        .single();

      if (error) throw error;

      if (data) {
        const typedComment = data as PostComment;
        setComments((prev) => [...prev, typedComment]);

        // Update replies_count for parent comment
        await supabase.rpc('increment_comment_replies', { comment_id: parentCommentId });

        // Auto-expand replies for the parent comment
        setExpandedReplies((prev) => new Set(prev).add(parentCommentId));

        toast.success('Reply added!');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  // Delete comment or reply
  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId) return;

    try {
      const commentToDelete = comments.find((c) => c.id === commentId);
      if (!commentToDelete) return;

      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // If deleting a reply, update parent's replies_count
      if (commentToDelete.parent_comment_id) {
        await supabase.rpc('decrement_comment_replies', {
          comment_id: commentToDelete.parent_comment_id
        });
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');

      // Update parent comment count
      if (onCommentCountChange) {
        onCommentCountChange(Math.max(0, comments.length - 1));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  // Organize comments into threads
  const topLevelComments = comments.filter((c) => !c.parent_comment_id);
  const getRepliesForComment = (commentId: string) =>
    comments.filter((c) => c.parent_comment_id === commentId);

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      {/* Comment List */}
      {topLevelComments.map((comment) => {
        const replies = getRepliesForComment(comment.id);
        const showReplies = expandedReplies.has(comment.id);

        return (
          <div key={comment.id} className="space-y-2">
            {/* Top-level Comment */}
            <CommentItem
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDeleteComment}
              onReply={handleAddReply}
              onToggleReplies={replies.length > 0 ? toggleReplies : undefined}
              formatTimestamp={formatTimestamp}
              getInitialsFromName={getInitialsFromName}
              depth={0}
              repliesCount={replies.length}
              showReplies={showReplies}
            />

            {/* Replies (nested comments) */}
            {showReplies && replies.length > 0 && (
              <div className="space-y-2">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onDelete={handleDeleteComment}
                    onReply={handleAddReply}
                    formatTimestamp={formatTimestamp}
                    getInitialsFromName={getInitialsFromName}
                    depth={1}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Comment Input */}
      <div className="flex gap-2 mt-3">
        {userPhotoUrl ? (
          <img
            src={userPhotoUrl}
            alt="You"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userInitials}
          </div>
        )}
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          className="flex-1 rounded-full"
        />
        <Button
          size="icon"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="rounded-full"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

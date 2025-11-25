import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Post, PostReaction } from '@/hooks/useCommunityFeed';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: Post;
  reactions: PostReaction[];
  currentUserId: string | null;
  isAdmin: boolean;
  onDelete: (postId: string) => void;
  onReact: (postId: string) => void;
  onComment: (postId: string) => void;
  isDeletingPost: boolean;
  index: number;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const PostCard = React.memo(function PostCard({
  post,
  reactions,
  currentUserId,
  isAdmin,
  onDelete,
  onReact,
  onComment,
  isDeletingPost,
  index,
}: PostCardProps) {
  const navigate = useNavigate();
  
  const canDelete = useMemo(() => 
    currentUserId && (post.user_id === currentUserId || isAdmin),
    [currentUserId, post.user_id, isAdmin]
  );

  const handleProfileClick = useCallback(() => {
    if (post.user_id) {
      navigate(`/user/${post.user_id}`);
    }
  }, [navigate, post.user_id]);

  const handleDelete = useCallback(() => {
    onDelete(post.id);
  }, [onDelete, post.id]);

  const handleReact = useCallback(() => {
    onReact(post.id);
  }, [onReact, post.id]);

  const handleComment = useCallback(() => {
    onComment(post.id);
  }, [onComment, post.id]);

  const formattedDate = useMemo(() => 
    new Date(post.created_at).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    [post.created_at]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-5 shadow-sm border border-transparent dark:border-white/5 relative overflow-hidden group transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-sm relative shadow-sm text-white shrink-0 cursor-pointer"
        >
          {post.profiles?.photo_url ? (
            <img
              src={post.profiles.photo_url}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>
              {getInitials(post.profiles?.username || post.profiles?.name || 'U')}
            </span>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleProfileClick}
              className="font-bold text-base text-[#1A1A1A] dark:text-white leading-tight hover:underline cursor-pointer"
            >
              {post.profiles?.username || post.profiles?.name || 'User'}
            </button>
          </div>
          <p className="text-xs text-[#9CA3AF] dark:text-white/40 font-medium mt-0.5">
            {formattedDate}
          </p>
        </div>

        {/* Delete button */}
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-[#9CA3AF] dark:text-white/40" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeletingPost}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeletingPost ? 'Deleting...' : 'Delete Post'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-lg font-bold mb-2 leading-snug text-[#1A1A1A] dark:text-white">
          {post.title}
        </h3>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="relative mb-4 -mx-1 overflow-hidden rounded-2xl">
          <img
            src={post.image_url}
            alt=""
            className="w-full object-cover max-h-[320px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      {post.content && (
        <p className="text-sm mb-5 text-[#4B5563] dark:text-white/70 leading-relaxed">
          {post.content}
        </p>
      )}

      {/* Metrics Row - Styled like the reference */}
      {(post.script_used || post.duration_minutes || post.result_type) && (
        <div className="flex items-start gap-8 mb-5 border-t border-gray-100 dark:border-white/5 pt-4">
          {post.script_used && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] dark:text-white/40 uppercase tracking-wide">
                <span>🎯</span>
                <span>Script</span>
              </div>
              <span className="font-bold text-[#1A1A1A] dark:text-white text-sm">
                {post.script_used}
              </span>
            </div>
          )}
          
          {post.duration_minutes && (
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] dark:text-white/40 uppercase tracking-wide">
                <span>⏱️</span>
                <span>Time</span>
              </div>
              <span className="font-bold text-[#1A1A1A] dark:text-white text-sm">
                {post.duration_minutes}m
              </span>
            </div>
          )}

          {post.result_type && (
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] dark:text-white/40 uppercase tracking-wide">
                <TrendingUp className="w-3 h-3" />
                <span>Result</span>
              </div>
              <span className="font-bold text-[#1A1A1A] dark:text-white text-sm capitalize">
                {post.result_type.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reactions Display - Small row above footer if any */}
      {reactions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {reactions
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((reaction, idx) => (
              <div
                key={`${reaction.emoji}-${idx}`}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
              >
                <span className="text-xs">{reaction.emoji}</span>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{reaction.count}</span>
              </div>
            ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center pt-3 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={handleReact}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#6B7280] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
        >
          <span className="text-lg opacity-70">☺</span>
          <span className="font-medium text-sm">React</span>
        </button>
        <div className="w-px h-6 bg-gray-100 dark:bg-white/10" /> {/* Small vertical divider */}
        <button
          onClick={handleComment}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#6B7280] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4.5 h-4.5 opacity-70" />
          <span className="font-medium text-sm">
            {post.comment_count && post.comment_count > 0 
              ? `${post.comment_count} Comment${post.comment_count > 1 ? 's' : ''}` 
              : 'Comment'}
          </span>
        </button>
      </div>
    </motion.div>
  );
});

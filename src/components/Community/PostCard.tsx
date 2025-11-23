import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2, MessageCircle, TrendingUp } from 'lucide-react';
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
  const canDelete = useMemo(() => 
    currentUserId && (post.user_id === currentUserId || isAdmin),
    [currentUserId, post.user_id, isAdmin]
  );

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
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:bg-white/[0.07] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-sm relative shadow-lg shadow-purple-500/20">
          {post.profiles?.photo_url ? (
            <img 
              src={post.profiles.photo_url} 
              alt="" 
              className="w-full h-full rounded-2xl object-cover" 
            />
          ) : (
            <span className="text-white">
              {getInitials(post.profiles?.username || post.profiles?.name || 'U')}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-white">
              {post.profiles?.username || post.profiles?.name || 'User'}
            </p>
            {post.profiles?.brain_profile && (
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider",
                post.profiles.brain_profile === 'INTENSE' && "bg-orange-500/20 text-orange-400 border border-orange-500/30",
                post.profiles.brain_profile === 'DISTRACTED' && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                post.profiles.brain_profile === 'DEFIANT' && "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                {post.profiles.brain_profile}
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 font-medium">
            {formattedDate}
          </p>
        </div>

        {/* Delete button */}
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-white/60" />
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
        <h3 className="text-lg font-bold mb-3 leading-snug text-white/95">
          {post.title}
        </h3>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="relative mb-4 -mx-1 overflow-hidden rounded-2xl ring-1 ring-white/10">
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
        <p className="text-sm mb-4 text-white/70 leading-relaxed">
          {post.content}
        </p>
      )}

      {/* Metrics */}
      {(post.script_used || post.duration_minutes || post.result_type) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {post.script_used && (
            <div className="flex items-center gap-2 text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 font-medium backdrop-blur-sm">
              <span>🎯</span>
              <span>{post.script_used}</span>
            </div>
          )}
          {post.duration_minutes && (
            <div className="flex items-center gap-2 text-xs bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20 font-medium backdrop-blur-sm">
              <span>⏱️</span>
              <span>{post.duration_minutes}min</span>
            </div>
          )}
          {post.result_type && (
            <div className={cn(
              "flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border font-medium backdrop-blur-sm",
              post.result_type === 'success' && "bg-green-500/10 text-green-300 border-green-500/20",
              post.result_type === 'partial' && "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
              post.result_type === 'needs_practice' && "bg-orange-500/10 text-orange-300 border-orange-500/20"
            )}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {post.result_type === 'success' && 'Success'}
                {post.result_type === 'partial' && 'Partial'}
                {post.result_type === 'needs_practice' && 'Practice'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reactions Display */}
      {reactions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap px-1 mb-3">
          {reactions
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((reaction, idx) => (
              <motion.div
                key={`${reaction.emoji}-${idx}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="text-xs font-bold text-white/80">{reaction.count}</span>
              </motion.div>
            ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReact}
          className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 font-medium text-sm text-white/80 transition-colors border border-white/10"
        >
          <span className="text-base">❤️</span>
          <span>React</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleComment}
          className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 font-medium text-sm text-white/80 transition-colors border border-white/10"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

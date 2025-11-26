import { useState, useEffect, useCallback } from 'react';
import { Search, Clock, Utensils, Smile, Coffee, Car, Lightbulb, Hash, Flag, Send, Trash2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { supabase } from '@/integrations/supabase/client';

interface PostReactionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  userAvatar?: string;
  userName?: string;
  currentUserId: string | null;
  isAdmin: boolean;
  onAddReaction: (emoji: string) => void;
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => Promise<boolean>;
}

const EMOJI_CATEGORIES = {
  'Suggested': ['❤️', '👍', '🎉', '💪', '💡', '🤝', '🙏', '🔥', '😊', '😂', '🙌', '💯', '👌', '👏', '😬'],
  'Food': ['🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥚', '🧇', '🥞', '🍳', '🥐', '🍞', '🥖', '🥨', '🧈', '🍪', '🎂', '🍰'],
  'Emotions': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '😘', '😗', '😙'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅'],
  'Objects': ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥'],
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Suggested': <Clock className="w-5 h-5" />,
  'Food': <Utensils className="w-5 h-5" />,
  'Emotions': <Smile className="w-5 h-5" />,
  'Activities': <Coffee className="w-5 h-5" />,
  'Objects': <Lightbulb className="w-5 h-5" />,
};

export function PostReactionsSheet({
  open,
  onOpenChange,
  postId,
  userAvatar,
  userName,
  currentUserId,
  isAdmin,
  onAddReaction,
  onAddComment,
  onDeleteComment,
}: PostReactionsSheetProps) {
  const [activeTab, setActiveTab] = useState('reactions');
  const [activeCategory, setActiveCategory] = useState('Suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { triggerHaptic } = useHaptic();

  // Fetch comments when tab is active or sheet opens
  useEffect(() => {
    if (open && activeTab === 'comments' && postId) {
      loadComments();
    }
  }, [open, activeTab, postId]);

  const loadComments = async () => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, profiles:user_id(username, name, photo_url), author_name, author_photo_url')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setLoadingComments(false);
  };

  const handleEmojiClick = (emoji: string) => {
    triggerHaptic('light');
    onAddReaction(emoji);
    onOpenChange(false);
  };

  const handleSendComment = async () => {
    console.log('Sending comment:', commentText);
    if (commentText.trim()) {
      // Optimistically add comment or wait for reload
      await onAddComment(commentText.trim());
      setCommentText('');
      // Reload comments to show the new one
      loadComments();
    }
  };

  const handleDelete = async (commentId: string) => {
    const success = await onDeleteComment(commentId);
    if (success) {
      loadComments();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[70vh]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)' }}>
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="sr-only">Add Reaction or Comment</DrawerTitle>
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="reactions" className="text-sm font-medium">
                Reactions
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-sm font-medium">
                Comments
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: '120px' }}>
          {activeTab === 'reactions' && (
            <div className="py-4 space-y-6">
              {/* Search */}
              <div className="relative sticky top-0 bg-background pb-2 z-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-9 bg-muted border-0"
                />
              </div>

              {/* Emoji Categories */}
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category} id={`category-${category}`}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{category}</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={`${emoji}-${idx}`}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-3xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center h-12"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="py-4 space-y-4">
              {loadingComments ? (
                <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No comments yet</h3>
                  <p className="text-sm text-muted-foreground">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const canDelete = currentUserId === comment.user_id || isAdmin;
                  // Fallback for seed comments
                  const photoUrl = comment.profiles?.photo_url || comment.author_photo_url;
                  const displayName = comment.profiles?.name || comment.author_name || 'User';
                  
                  return (
                    <div key={comment.id} className="flex gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                        {photoUrl ? (
                          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none relative">
                          <p className="text-xs font-bold text-foreground mb-0.5">
                            {displayName}
                          </p>
                          <p className="text-sm text-foreground/90 pr-6">{comment.content}</p>
                          
                          {/* Delete Button */}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground px-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Category Navigation (only visible on reactions tab) */}
        {activeTab === 'reactions' && (
          <div className="border-t border-border bg-background absolute bottom-0 left-0 right-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)' }}>
            <div className="flex items-center justify-around px-2 py-3">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                    activeCategory === category
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "transition-colors",
                    activeCategory === category && "text-orange-500"
                  )}>
                    {CATEGORY_ICONS[category]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comment Input (only visible on comments tab) */}
        {activeTab === 'comments' && (
          <div className="border-t border-border p-4 bg-background absolute bottom-0 left-0 right-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  getInitials(userName || 'U')
                )}
              </div>
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-muted border-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim()}
                className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

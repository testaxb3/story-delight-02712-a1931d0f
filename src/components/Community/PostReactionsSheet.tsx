import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PostReactionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  userAvatar?: string;
  userName?: string;
  onAddReaction: (emoji: string) => void;
  onAddComment: (content: string) => void;
}

const SUGGESTED_EMOJIS = ['😊', '😂', '🙌', '🔥', '💯', '💪', '👌', '🔥', '👏', '😬', '👨‍🍳', '👩‍🍳', '🏆', '⭐', '🍽️'];

const EMOJI_CATEGORIES = {
  'Suggested': ['😊', '😂', '🙌', '🔥', '💯', '💪', '👌', '🔥', '👏', '😬', '👨‍🍳', '👩‍🍳', '🏆', '⭐', '🍽️'],
  'Food': ['🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥚', '🧇', '🥞', '🍳', '🥐', '🍞', '🥖', '🥨', '🧈'],
  'Emotions': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍'],
};

export function PostReactionsSheet({
  open,
  onOpenChange,
  postId,
  userAvatar,
  userName,
  onAddReaction,
  onAddComment,
}: PostReactionsSheetProps) {
  const [activeTab, setActiveTab] = useState('reactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleEmojiClick = (emoji: string) => {
    onAddReaction(emoji);
    onOpenChange(false);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader className="border-b border-border pb-4">
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

        <div className="flex-1 overflow-y-auto px-4">
          {activeTab === 'reactions' && (
            <div className="py-4 space-y-4">
              {/* Search */}
              <div className="relative">
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
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{category}</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={`${emoji}-${idx}`}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-3xl hover:scale-110 transition-transform active:scale-95"
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
            <div className="py-4">
              {/* Empty State */}
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
            </div>
          )}
        </div>

        {/* Comment Input (only visible on comments tab) */}
        {activeTab === 'comments' && (
          <div className="border-t border-border p-4 bg-background">
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

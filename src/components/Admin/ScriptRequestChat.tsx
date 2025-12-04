import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScriptRequestMessages } from '@/hooks/useScriptRequestMessages';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ScriptRequestChatProps {
  requestId: string;
  userName: string;
  userEmail: string;
  userId?: string;
}

export function ScriptRequestChat({ requestId, userName, userEmail, userId }: ScriptRequestChatProps) {
  const { user } = useAuth();
  const { messages, loading, sending, sendMessage, markAsRead, refetch } = useScriptRequestMessages(requestId);
  const [newMessage, setNewMessage] = useState('');
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when opening
  useEffect(() => {
    if (open) {
      markAsRead();
    }
  }, [open, markAsRead]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id) return;

    const success = await sendMessage(newMessage, 'admin', user.id, userId);
    if (success) {
      setNewMessage('');
      toast.success('Message sent');
      setTimeout(() => refetch(), 500);
    } else {
      toast.error('Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const unreadCount = messages.filter(m => !m.read && m.sender_type === 'user').length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="relative gap-1.5">
          <MessageCircle className="w-4 h-4" />
          Reply
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Chat with {userName || userEmail}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 mt-4">
          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation</p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      msg.sender_type === 'admin' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender_type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        msg.sender_type === 'admin'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.sender_type === 'admin'
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}>
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    {msg.sender_type === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

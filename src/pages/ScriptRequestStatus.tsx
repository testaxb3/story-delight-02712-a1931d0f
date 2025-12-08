import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageCircle,
  Send,
  User,
  Shield,
  Sparkles,
  Brain,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useScriptRequestMessages } from '@/hooks/useScriptRequestMessages';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScriptRequest {
  id: string;
  user_id: string;
  situation_description: string;
  child_brain_profile: string | null;
  child_age: number | null;
  urgency_level: string | null;
  location_type: string[] | null;
  parent_emotional_state: string | null;
  additional_notes: string | null;
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  admin_notes: string | null;
  created_script_id: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

export default function ScriptRequestStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scriptRequest, setScriptRequest] = useState<ScriptRequest | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, loading: messagesLoading, sending, sendMessage, markAsRead, refetch } = 
    useScriptRequestMessages(scriptRequest?.id || null);

  useEffect(() => {
    fetchScriptRequest();
  }, [user]);

  useEffect(() => {
    if (scriptRequest?.id) {
      markAsRead();
    }
  }, [scriptRequest?.id, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchScriptRequest = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('script_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setScriptRequest(null);
        } else {
          throw error;
        }
      } else {
        setScriptRequest(data as ScriptRequest);
      }
    } catch (error) {
      toast.error('Error loading request status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !scriptRequest?.id) return;

    const success = await sendMessage(newMessage, 'user', user.id);
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
      handleSendMessage();
    }
  };

  const getStatusConfig = (status: ScriptRequest['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />,
          bgColor: 'bg-yellow-500/15 dark:bg-yellow-500/20',
          borderColor: 'border-yellow-500/30 dark:border-yellow-500/40',
          textColor: 'text-yellow-900 dark:text-yellow-100',
          title: 'Pending Review',
          description: 'Your script request is waiting to be reviewed',
        };
      case 'in_review':
        return {
          icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-500" />,
          bgColor: 'bg-blue-500/15 dark:bg-blue-500/20',
          borderColor: 'border-blue-500/30 dark:border-blue-500/40',
          textColor: 'text-blue-900 dark:text-blue-100',
          title: 'In Progress',
          description: 'Our team is working on your custom script',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />,
          bgColor: 'bg-green-500/15 dark:bg-green-500/20',
          borderColor: 'border-green-500/30 dark:border-green-500/40',
          textColor: 'text-green-900 dark:text-green-100',
          title: 'Script Ready!',
          description: 'Your custom script has been created',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-500" />,
          bgColor: 'bg-red-500/15 dark:bg-red-500/20',
          borderColor: 'border-red-500/30 dark:border-red-500/40',
          textColor: 'text-red-900 dark:text-red-100',
          title: 'Request Declined',
          description: 'We were unable to fulfill this request',
        };
      default:
        return {
          icon: <Clock className="w-6 h-6 text-muted-foreground" />,
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-foreground',
          title: 'Unknown Status',
          description: 'Status unknown',
        };
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading request status...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!scriptRequest) {
    return (
      <MainLayout>
        <div className="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+7rem)]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-6 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold">Script Request Status</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-[22px] p-8 text-center"
          >
            <AlertCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Request Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't submitted any script requests yet. Need a custom script for your situation?
            </p>
            <Button 
              onClick={() => navigate('/script-requests')}
              className="rounded-full px-8"
            >
              Request a Script
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const statusConfig = getStatusConfig(scriptRequest.status);

  return (
    <MainLayout>
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+7rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-6 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font-bold">Script Request Status</h1>
          <p className="text-muted-foreground mt-2">Track your custom script request</p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[22px] p-6 mb-6"
        >
          <div className={`rounded-2xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-6 mb-6`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {statusConfig.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg mb-2 ${statusConfig.textColor}`}>
                  {statusConfig.title}
                </h3>
                <p className={`text-sm ${statusConfig.textColor} opacity-80`}>
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Timeline
            </h4>

            <div className="relative space-y-4">
              <div className="absolute left-4 top-8 bottom-8 w-[2px] bg-border" />

              {/* Submitted */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 relative"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center z-10">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-sm">Request Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(scriptRequest.created_at), 'PPp')}
                  </p>
                </div>
              </motion.div>

              {/* In Review */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 relative"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                  scriptRequest.status !== 'pending'
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-yellow-500/20 border-yellow-500'
                }`}>
                  {scriptRequest.status !== 'pending' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-sm">Under Review</p>
                  <p className="text-xs text-muted-foreground">
                    {scriptRequest.status === 'pending' ? 'Waiting...' : 'Completed'}
                  </p>
                </div>
              </motion.div>

              {/* Completed/Rejected */}
              {(scriptRequest.status === 'completed' || scriptRequest.status === 'rejected') && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                    scriptRequest.status === 'rejected'
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-green-500/20 border-green-500'
                  }`}>
                    {scriptRequest.status === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-sm">
                      {scriptRequest.status === 'rejected' ? 'Request Declined' : 'Script Created'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scriptRequest.reviewed_at && format(new Date(scriptRequest.reviewed_at), 'PPp')}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* View Script Button */}
          {scriptRequest.status === 'completed' && scriptRequest.created_script_id && (
            <Button 
              onClick={() => navigate(`/scripts?highlight=${scriptRequest.created_script_id}`)}
              className="w-full mt-6 rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Your Script
            </Button>
          )}
        </motion.div>

        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[22px] p-6 mb-6"
        >
          <h3 className="font-semibold text-lg mb-6">Request Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Request ID</span>
              </div>
              <p className="text-sm font-mono">{scriptRequest.id.slice(0, 8)}...</p>
            </div>

            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Submitted</span>
              </div>
              <p className="text-sm">{format(new Date(scriptRequest.created_at), 'PP')}</p>
            </div>

            {scriptRequest.child_brain_profile && (
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Brain className="w-4 h-4 text-pink-500" />
                  <span>Profile</span>
                </div>
                <p className="text-sm">{scriptRequest.child_brain_profile}</p>
              </div>
            )}

            {scriptRequest.child_age && (
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="w-4 h-4 text-green-500" />
                  <span>Age</span>
                </div>
                <p className="text-sm">{scriptRequest.child_age} years</p>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-2">Situation:</p>
            <div className="bg-muted p-4 rounded-xl">
              <p className="text-sm">{scriptRequest.situation_description}</p>
            </div>
          </div>

          {scriptRequest.admin_notes && (
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm text-muted-foreground mb-2">Admin Notes:</p>
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                <p className="text-sm text-blue-900 dark:text-blue-100">{scriptRequest.admin_notes}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-[22px] p-6"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Messages
          </h3>

          <ScrollArea className="h-[300px] pr-4" ref={scrollRef}>
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Send a message to our team</p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      msg.sender_type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender_type === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        msg.sender_type === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        msg.sender_type === 'user'
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}>
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    {msg.sender_type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border pt-4 mt-4">
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
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

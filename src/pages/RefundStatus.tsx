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
  DollarSign,
  Mail,
  Calendar,
  FileText,
  MessageCircle,
  Send,
  User,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useRefundMessages } from '@/hooks/useRefundMessages';
import { cn } from '@/lib/utils';

interface RefundRequest {
  id: string;
  customer_name: string;
  email: string;
  reason_type: string;
  reason_details: string | null;
  accepted_partial_refund: string | null;
  status: 'pending' | 'partial_accepted' | 'approved' | 'rejected' | 'processed';
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  notes: string | null;
}

export default function RefundStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refundRequest, setRefundRequest] = useState<RefundRequest | null>(null);

  useEffect(() => {
    fetchRefundRequest();
  }, [user]);

  const fetchRefundRequest = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setRefundRequest(null);
        } else {
          throw error;
        }
      } else {
        setRefundRequest(data as RefundRequest);
      }
    } catch (error) {
      toast.error('Error loading refund status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />,
          bgColor: 'bg-yellow-500/15 dark:bg-yellow-500/20',
          borderColor: 'border-yellow-500/30 dark:border-yellow-500/40',
          textColor: 'text-yellow-900 dark:text-yellow-100',
          title: 'Under Review',
          description: 'Your refund request is being reviewed by our team',
        };
      case 'partial_accepted':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />,
          bgColor: 'bg-green-500/15 dark:bg-green-500/20',
          borderColor: 'border-green-500/30 dark:border-green-500/40',
          textColor: 'text-green-900 dark:text-green-100',
          title: 'Partial Refund Approved',
          description: 'Your partial refund has been approved and will be processed soon',
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />,
          bgColor: 'bg-green-500/15 dark:bg-green-500/20',
          borderColor: 'border-green-500/30 dark:border-green-500/40',
          textColor: 'text-green-900 dark:text-green-100',
          title: 'Refund Approved',
          description: 'Your full refund has been approved and will be processed soon',
        };
      case 'processed':
        return {
          icon: <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-500" />,
          bgColor: 'bg-blue-500/15 dark:bg-blue-500/20',
          borderColor: 'border-blue-500/30 dark:border-blue-500/40',
          textColor: 'text-blue-900 dark:text-blue-100',
          title: 'Refund Processed',
          description: 'Your refund has been processed. You should receive it within 5-7 business days',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-500" />,
          bgColor: 'bg-red-500/15 dark:bg-red-500/20',
          borderColor: 'border-red-500/30 dark:border-red-500/40',
          textColor: 'text-red-900 dark:text-red-100',
          title: 'Request Denied',
          description: 'Your refund request was not approved',
        };
    }
  };

  const getReasonLabel = (reasonType: string) => {
    const reasons: Record<string, string> = {
      'not-satisfied': 'Not satisfied with the content',
      'technical-issues': 'Had technical issues',
      'not-using': 'Not using the product',
      'financial': 'Financial reasons',
      'other': 'Other reason',
    };
    return reasons[reasonType] || reasonType;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading refund status...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!refundRequest) {
    return (
      <MainLayout>
        <div className="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] border border-border flex items-center justify-center mb-6 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold">Refund Status</h1>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-[22px] p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <AlertCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2">No Refund Request Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't submitted any refund requests yet. If you need assistance, we're here to help.
            </p>
            <Button 
              onClick={() => navigate('/refund')}
              className="rounded-full px-8"
            >
              Request a Refund
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const statusConfig = getStatusConfig(refundRequest.status);

  return (
    <MainLayout>
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] border border-border flex items-center justify-center mb-6 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font-bold">Refund Status</h1>
          <p className="text-muted-foreground mt-2">Track your refund request</p>
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
              {/* Vertical Line */}
              <div className="absolute left-4 top-8 bottom-8 w-[2px] bg-border" />

              {/* Submitted */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 relative"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 dark:bg-green-500/30 border-2 border-green-500 flex items-center justify-center z-10">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-sm">Request Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(refundRequest.created_at), 'PPp')}
                  </p>
                </div>
              </motion.div>

              {/* Under Review */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 relative"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                  refundRequest.status !== 'pending'
                    ? 'bg-green-500/20 dark:bg-green-500/30 border-green-500'
                    : 'bg-yellow-500/20 dark:bg-yellow-500/30 border-yellow-500'
                }`}>
                  {refundRequest.status !== 'pending' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-sm">Under Review</p>
                  <p className="text-xs text-muted-foreground">
                    {refundRequest.status === 'pending'
                      ? 'In progress...'
                      : format(new Date(refundRequest.updated_at), 'PPp')}
                  </p>
                </div>
              </motion.div>

              {/* Decision Made */}
              {(refundRequest.status === 'approved' ||
                refundRequest.status === 'partial_accepted' ||
                refundRequest.status === 'rejected') && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                    refundRequest.status === 'rejected'
                      ? 'bg-red-500/20 dark:bg-red-500/30 border-red-500'
                      : 'bg-green-500/20 dark:bg-green-500/30 border-green-500'
                  }`}>
                    {refundRequest.status === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-sm">
                      {refundRequest.status === 'rejected'
                        ? 'Request Denied'
                        : 'Request Approved'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(refundRequest.updated_at), 'PPp')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Processed */}
              {refundRequest.status === 'processed' && refundRequest.processed_at && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center z-10">
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-sm">Refund Processed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(refundRequest.processed_at), 'PPp')}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[22px] p-6 mb-6"
        >
          <h3 className="font-semibold text-lg mb-6">Request Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted dark:bg-[#2C2C2E] rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Request ID</span>
              </div>
              <p className="text-sm font-mono">{refundRequest.id.slice(0, 8)}...</p>
            </div>

            <div className="bg-muted dark:bg-[#2C2C2E] rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Submitted</span>
              </div>
              <p className="text-sm">{format(new Date(refundRequest.created_at), 'PP')}</p>
            </div>

            <div className="bg-muted dark:bg-[#2C2C2E] rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span>Email</span>
              </div>
              <p className="text-sm truncate">{refundRequest.email}</p>
            </div>

            <div className="bg-muted dark:bg-[#2C2C2E] rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span>Reason</span>
              </div>
              <p className="text-sm">{getReasonLabel(refundRequest.reason_type)}</p>
            </div>
          </div>

          {refundRequest.reason_details && (
            <div className="border-t border-border pt-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Additional Details:</p>
              <div className="bg-muted dark:bg-[#2C2C2E] p-4 rounded-xl">
                <p className="text-sm">{refundRequest.reason_details}</p>
              </div>
            </div>
          )}

          {refundRequest.accepted_partial_refund && (
            <div className="border-t border-border pt-4 mb-4">
              <div className="bg-green-500/10 dark:bg-green-500/15 border border-green-500/30 dark:border-green-500/40 rounded-xl p-4">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Partial Refund Accepted:</strong> {refundRequest.accepted_partial_refund}
                  <br />
                  <span className="text-xs opacity-80">You will keep full access to NEP System</span>
                </p>
              </div>
            </div>
          )}

          {refundRequest.notes && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Admin Notes:</p>
              <div className="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 dark:border-blue-500/40 p-4 rounded-xl">
                <p className="text-sm text-blue-900 dark:text-blue-100">{refundRequest.notes}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Messages Section */}
        <RefundMessagesSection refundRequestId={refundRequest.id} userId={user?.id || null} />

        {/* Expected Timeline */}
        {refundRequest.status !== 'processed' && refundRequest.status !== 'rejected' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 dark:border-blue-500/40 rounded-[22px] p-6"
          >
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Clock className="w-5 h-5" />
              Expected Timeline
            </h4>
            <ul className="space-y-3 text-sm text-blue-900 dark:text-blue-100">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong>24 hours:</strong> Review and confirmation email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong>5-7 business days:</strong> Refund processed after approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>Same payment method used for purchase will be credited</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}

// Messages Section Component
function RefundMessagesSection({ refundRequestId, userId }: { refundRequestId: string; userId: string | null }) {
  const { messages, loading, sending, sendMessage, markAsRead, refetch } = useRefundMessages(refundRequestId);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read on mount
  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;

    const success = await sendMessage(newMessage, 'user', userId);
    if (success) {
      setNewMessage('');
      toast.success('Message sent');
      // Fallback: refetch if realtime doesn't catch it
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card border border-border rounded-[22px] p-6 mb-6"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Messages
      </h3>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="max-h-80 overflow-y-auto mb-4 space-y-3"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Our team will respond to your request here</p>
          </div>
        ) : (
          messages.map((msg) => (
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
                  "max-w-[80%] rounded-2xl px-4 py-2.5",
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
                  {msg.sender_type === 'admin' ? 'Support Team' : 'You'} • {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
              {msg.sender_type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          className="flex-1 rounded-full"
        />
        <Button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          size="icon"
          className="rounded-full"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

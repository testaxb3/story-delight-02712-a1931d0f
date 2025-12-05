import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  DollarSign, 
  Calendar, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { RefundChat } from './RefundChat';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RefundRequest {
  id: string;
  customer_name: string;
  email: string;
  reason_type: string;
  reason_details: string | null;
  accepted_partial_refund: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
  user_id: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', icon: Clock },
  partial_accepted: { label: 'Partial', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: DollarSign },
  approved: { label: 'Approved', bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', icon: CheckCircle },
  rejected: { label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: XCircle },
  processed: { label: 'Processed', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle }
};

const REASONS: Record<string, string> = {
  'not-satisfied': 'Not satisfied with content',
  'technical-issues': 'Technical issues',
  'not-using': 'Not using the product',
  'financial': 'Financial reasons',
  'other': 'Other reason'
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'processed', label: 'Processed' },
  { value: 'rejected', label: 'Rejected' },
];

export function AdminRefundsTab() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [pushEnabledUsers, setPushEnabledUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRefunds(data || []);

      // Fetch push subscription status for users
      const userIds = data?.filter(r => r.user_id).map(r => r.user_id) || [];
      if (userIds.length > 0) {
        const { data: pushData } = await supabase
          .from('user_push_subscriptions')
          .select('user_id')
          .in('user_id', userIds)
          .eq('is_active', true);

        setPushEnabledUsers(new Set(pushData?.map(p => p.user_id) || []));
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refund requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('refund_requests')
        .update({
          status: newStatus,
          processed_at: newStatus === 'processed' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      fetchRefunds();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredRefunds = activeFilter === 'all' 
    ? refunds 
    : refunds.filter(r => r.status === activeFilter);

  const counts = {
    all: refunds.length,
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    processed: refunds.filter(r => r.status === 'processed').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Refund Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            {counts.pending} pending • {counts.approved} approved
          </p>
        </div>
        <Button onClick={fetchRefunds} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Horizontal Scroll Filters */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {FILTERS.map((filter) => {
            const count = counts[filter.value as keyof typeof counts];
            const isActive = activeFilter === filter.value;
            return (
              <Button
                key={filter.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "whitespace-nowrap shrink-0 transition-all",
                  isActive && "shadow-md"
                )}
              >
                {filter.label}
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-1.5 h-5 min-w-5 px-1.5 text-[10px]",
                      isActive ? "bg-white/20 text-white" : "bg-muted"
                    )}
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Refunds List */}
      <AnimatePresence mode="wait">
        {filteredRefunds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-lg font-semibold">No refund requests</h3>
            <p className="text-sm text-muted-foreground">
              {activeFilter === 'all' 
                ? 'All refund requests will appear here'
                : `No ${activeFilter} requests`
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredRefunds.map((refund, index) => {
              const statusConfig = STATUS_CONFIG[refund.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const initials = refund.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

              return (
                <motion.div
                  key={refund.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-sm truncate">{refund.customer_name}</p>
                                {refund.user_id && pushEnabledUsers.has(refund.user_id) ? (
                                  <span title="Push enabled">
                                    <Bell className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                  </span>
                                ) : (
                                  <span title="No push">
                                    <BellOff className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {refund.email}
                              </p>
                            </div>
                            <Badge
                              className={cn(
                                "shrink-0 flex items-center gap-1 border-0",
                                statusConfig.bg,
                                statusConfig.text
                              )}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Reason */}
                          <div className="p-2.5 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Reason</p>
                            <p className="text-sm font-medium">{REASONS[refund.reason_type] || refund.reason_type}</p>
                            {refund.reason_details && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                "{refund.reason_details}"
                              </p>
                            )}
                          </div>

                          {/* Partial Refund */}
                          {refund.accepted_partial_refund && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                              Accepted: {refund.accepted_partial_refund}
                            </Badge>
                          )}

                          {/* Meta */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(refund.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                            <RefundChat 
                              refundId={refund.id} 
                              customerName={refund.customer_name}
                              customerUserId={refund.user_id || undefined}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(refund.id, 'approved')}
                              disabled={updating === refund.id || refund.status === 'approved'}
                              className="h-8 text-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(refund.id, 'rejected')}
                              disabled={updating === refund.id || refund.status === 'rejected'}
                              className="h-8 text-xs"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateStatus(refund.id, 'processed')}
                              disabled={updating === refund.id || refund.status === 'processed'}
                              className="h-8 text-xs"
                            >
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              Processed
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
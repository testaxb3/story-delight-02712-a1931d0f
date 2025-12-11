import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Mail,
  Copy,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingCart,
  DollarSign,
  Timer,
  Bell,
  BellOff,
  ClipboardCheck,
  ClipboardList,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ApprovedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  products: any;
  total_price: number | null;
  currency: string | null;
  created_at: string;
  approved_at: string | null;
  account_created: boolean;
  account_created_at: string | null;
  sms_sent: boolean;
  email_sent: boolean;
  status: string;
}

interface EmailTracking {
  email: string;
  email_type: string;
  sent_at: string;
}

export function AdminSalesTab() {
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  // Fetch approved users (buyers)
  const { data: buyers, isLoading: loadingBuyers, refetch } = useQuery({
    queryKey: ['admin-sales-buyers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approved_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as ApprovedUser[];
    },
  });

  // Fetch email tracking for welcome emails
  const { data: emailTracking } = useQuery({
    queryKey: ['admin-sales-email-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_tracking')
        .select('email, email_type, sent_at')
        .eq('email_type', 'welcome')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data as EmailTracking[];
    },
  });

  // Fetch push subscriptions to check who has push enabled
  const { data: pushSubscriptions } = useQuery({
    queryKey: ['admin-push-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_push_subscriptions')
        .select('user_id')
        .eq('is_active', true);

      if (error) throw error;
      return data?.map(p => p.user_id) ?? [];
    },
  });

  // Fetch profiles to map emails to user_ids for push/quiz checking
  const { data: profilesMap } = useQuery({
    queryKey: ['admin-profiles-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, quiz_completed');

      if (error) throw error;
      const map = new Map<string, { id: string; quiz_completed: boolean }>();
      data?.forEach(p => {
        if (p.email) map.set(p.email.toLowerCase(), { id: p.id, quiz_completed: p.quiz_completed ?? false });
      });
      return map;
    },
  });

  // Check if buyer has push enabled
  const hasPushEnabled = (email: string): boolean => {
    if (!profilesMap || !pushSubscriptions) return false;
    const profile = profilesMap.get(email.toLowerCase());
    return profile ? pushSubscriptions.includes(profile.id) : false;
  };

  // Check if buyer completed quiz
  const hasQuizCompleted = (email: string): boolean => {
    if (!profilesMap) return false;
    const profile = profilesMap.get(email.toLowerCase());
    return profile?.quiz_completed ?? false;
  };

  // Calculate metrics including push enabled count and quiz completed count
  const pushEnabledCount = buyers?.filter(b => hasPushEnabled(b.email))?.length ?? 0;
  const quizCompletedCount = buyers?.filter(b => hasQuizCompleted(b.email))?.length ?? 0;
  const convertedCount = buyers?.filter(b => b.account_created)?.length ?? 0;
  
  const metrics = {
    total: buyers?.length ?? 0,
    accountsCreated: convertedCount,
    pending: buyers?.filter(b => !b.account_created)?.length ?? 0,
    conversionRate: buyers?.length 
      ? Math.round((convertedCount / buyers.length) * 100) 
      : 0,
    pushEnabled: pushEnabledCount,
    pushRate: convertedCount > 0
      ? Math.round((pushEnabledCount / convertedCount) * 100)
      : 0,
    quizCompleted: quizCompletedCount,
    quizRate: convertedCount > 0
      ? Math.round((quizCompletedCount / convertedCount) * 100)
      : 0,
  };

  // Check if email was sent
  const wasEmailSent = (email: string) => {
    return emailTracking?.some(e => e.email.toLowerCase() === email.toLowerCase());
  };

  // Get time to create account
  const getTimeToCreate = (buyer: ApprovedUser) => {
    if (!buyer.account_created || !buyer.account_created_at || !buyer.created_at) return null;
    const purchaseTime = new Date(buyer.created_at).getTime();
    const accountTime = new Date(buyer.account_created_at).getTime();
    const diffMinutes = Math.round((accountTime - purchaseTime) / 60000);
    if (diffMinutes < 60) return `${diffMinutes}min`;
    if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h`;
    return `${Math.round(diffMinutes / 1440)}d`;
  };

  // Resend welcome email
  const handleResendEmail = async (buyer: ApprovedUser) => {
    setResendingEmail(buyer.id);
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'NEP System <support@nepsystem.pro>',
          to: buyer.email,
          subject: '🎉 Welcome to NEP System - Create Your Account',
          html: getWelcomeEmailHTML(buyer.first_name || 'Parent'),
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');
      
      toast.success(`Email sent to ${buyer.email}`);
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to send email');
    } finally {
      setResendingEmail(null);
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard');
  };

  // Get product names
  const getProductNames = (products: any): string => {
    if (!products) return 'Unknown';
    if (Array.isArray(products)) {
      return products.map((p: any) => p.name || p.product_name || 'Product').join(', ');
    }
    return 'Product';
  };

  // Get status badge
  const getStatusBadge = (buyer: ApprovedUser) => {
    const emailSent = wasEmailSent(buyer.email);
    const hoursSincePurchase = (Date.now() - new Date(buyer.created_at).getTime()) / 3600000;

    if (buyer.account_created) {
      return (
        <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Converted
        </Badge>
      );
    }

    if (hoursSincePurchase > 48) {
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          At Risk
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  if (loadingBuyers) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Buyers</span>
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{metrics.total}</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-green-900 dark:text-green-100">Converted</span>
          </div>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">{metrics.accountsCreated}</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pending</span>
          </div>
          <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{metrics.pending}</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Conversion</span>
          </div>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{metrics.conversionRate}%</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Push Enabled</span>
          </div>
          <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{metrics.pushEnabled}</div>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">{metrics.pushRate}% of converted</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-cyan-900 dark:text-cyan-100">Quiz Done</span>
          </div>
          <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{metrics.quizCompleted}</div>
          <p className="text-xs text-cyan-700 dark:text-cyan-300 mt-1">{metrics.quizRate}% of converted</p>
        </Card>
      </div>

      {/* Buyers List - Mobile-First Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Recent Buyers
          </h3>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filter Pills */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {['all', 'pending', 'converted', 'at_risk', 'push_on', 'push_off', 'quiz_done', 'quiz_pending'].map((filter) => {
              const filterCounts = {
                all: buyers?.length || 0,
                pending: buyers?.filter(b => !b.account_created && (Date.now() - new Date(b.created_at).getTime()) / 3600000 <= 48).length || 0,
                converted: buyers?.filter(b => b.account_created).length || 0,
                at_risk: buyers?.filter(b => !b.account_created && (Date.now() - new Date(b.created_at).getTime()) / 3600000 > 48).length || 0,
                push_on: buyers?.filter(b => hasPushEnabled(b.email)).length || 0,
                push_off: buyers?.filter(b => b.account_created && !hasPushEnabled(b.email)).length || 0,
                quiz_done: buyers?.filter(b => hasQuizCompleted(b.email)).length || 0,
                quiz_pending: buyers?.filter(b => b.account_created && !hasQuizCompleted(b.email)).length || 0,
              };
              const filterLabels = { 
                all: 'All', 
                pending: 'Pending', 
                converted: 'Converted', 
                at_risk: 'At Risk',
                push_on: '🔔 Push On',
                push_off: '🔕 No Push',
                quiz_done: '📋 Quiz Done',
                quiz_pending: '📝 Quiz Pending'
              };
              return (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="px-3 py-1.5 cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  {filterLabels[filter as keyof typeof filterLabels]} ({filterCounts[filter as keyof typeof filterCounts]})
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Buyers Cards */}
        <AnimatePresence mode="wait">
          {(!buyers || buyers.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold">No buyers yet</h3>
              <p className="text-sm text-muted-foreground">New purchases will appear here</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {buyers.map((buyer, index) => {
                const hoursSincePurchase = (Date.now() - new Date(buyer.created_at).getTime()) / 3600000;
                const initials = `${buyer.first_name?.[0] || ''}${buyer.last_name?.[0] || buyer.email[0]}`.toUpperCase();

                return (
                  <motion.div
                    key={buyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all border-l-4",
                      buyer.account_created
                        ? "border-l-green-500"
                        : hoursSincePurchase > 48
                          ? "border-l-red-500"
                          : "border-l-yellow-500"
                    )}>
                      <CardContent className="p-4">
                        {/* Header: Avatar + Name + Status */}
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm truncate">
                                {buyer.first_name || ''} {buyer.last_name || 'Customer'}
                              </p>
                              {getStatusBadge(buyer)}
                            </div>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {buyer.email}
                            </p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="p-2 bg-muted/50 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Value</p>
                            <p className="text-sm font-bold text-green-600">
                              ${buyer.total_price?.toFixed(0) || '0'}
                            </p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Purchased</p>
                            <p className="text-xs font-medium">
                              {formatDistanceToNow(new Date(buyer.created_at), { addSuffix: false })}
                            </p>
                          </div>
                          <div className="p-2 bg-muted/50 rounded-lg text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Convert Time</p>
                            <p className="text-xs font-medium">
                              {getTimeToCreate(buyer) || '—'}
                            </p>
                          </div>
                        </div>

                        {/* Email Status + Push Status + Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-2 flex-wrap">
                            {buyer.email_sent ? (
                              <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-0 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Email Sent
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/15 text-gray-600 dark:text-gray-400 border-0 text-[10px]">
                                <Clock className="w-3 h-3 mr-1" />
                                Email Pending
                              </Badge>
                            )}
                            {buyer.account_created && (
                              hasPushEnabled(buyer.email) ? (
                                <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-0 text-[10px]">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Push On
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-500/15 text-gray-500 dark:text-gray-400 border-0 text-[10px]">
                                  <BellOff className="w-3 h-3 mr-1" />
                                  No Push
                                </Badge>
                              )
                            )}
                            {buyer.account_created && (
                              hasQuizCompleted(buyer.email) ? (
                                <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-0 text-[10px]">
                                  <ClipboardCheck className="w-3 h-3 mr-1" />
                                  Quiz ✓
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-500/15 text-gray-500 dark:text-gray-400 border-0 text-[10px]">
                                  <ClipboardList className="w-3 h-3 mr-1" />
                                  Quiz ⏳
                                </Badge>
                              )
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {buyer.phone && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const cleanPhone = buyer.phone!.replace(/\D/g, '');
                                  const firstName = buyer.first_name || 'there';
                                  const message = `Hi ${firstName}! 👋

I'm from The Obedience Language support team. I noticed you recently purchased our program and wanted to check in:

✅ Were you able to create your account successfully?
✅ Is everything working well for you?
✅ Do you have any questions or need help with anything?

I'm here to help! 🙂`;
                                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                }}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEmail(buyer.email)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {!buyer.account_created && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResendEmail(buyer)}
                                disabled={resendingEmail === buyer.id}
                                className="h-8 px-3 text-xs"
                              >
                                {resendingEmail === buyer.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Mail className="w-3 h-3 mr-1" />
                                    Resend
                                  </>
                                )}
                              </Button>
                            )}
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
    </div>
  );
}

// Welcome email HTML template
function getWelcomeEmailHTML(firstName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to NEP System!</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${firstName},</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your purchase! You now have access to the complete NEP System - science-backed parenting strategies designed specifically for your child's unique brain profile.
          </p>
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;">
            Click the button below to create your account and get started:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nepsystem.vercel.app/auth" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Create My Account →
            </a>
          </div>
          <p style="font-size: 14px; color: #888; margin-top: 30px;">
            If you have any questions, reply to this email or contact us at support@nepsystem.pro
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888; margin: 0;">
            © ${new Date().getFullYear()} NEP System. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

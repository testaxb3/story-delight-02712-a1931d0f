import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ApprovedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
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

  // Calculate metrics
  const metrics = {
    total: buyers?.length ?? 0,
    accountsCreated: buyers?.filter(b => b.account_created)?.length ?? 0,
    pending: buyers?.filter(b => !b.account_created)?.length ?? 0,
    conversionRate: buyers?.length 
      ? Math.round((buyers.filter(b => b.account_created).length / buyers.length) * 100) 
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Buyers Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Buyers</h3>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Purchased</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time to Convert</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buyers?.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {buyer.first_name || ''} {buyer.last_name || ''}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {buyer.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                      {getProductNames(buyer.products)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">
                      ${buyer.total_price?.toFixed(2) || '0.00'} {buyer.currency || 'USD'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(buyer.created_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="p-4">
                    {buyer.email_sent ? (
                      <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(buyer)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {getTimeToCreate(buyer) || '—'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
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
                          className="h-8 w-8 p-0"
                        >
                          {resendingEmail === buyer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!buyers || buyers.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            No buyers found
          </div>
        )}
      </Card>
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

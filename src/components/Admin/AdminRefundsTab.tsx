import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign, Calendar, Mail, User, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

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
}

export function AdminRefundsTab() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRefunds(data || []);
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      partial_accepted: { label: 'Partial Accepted', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'default' },
      rejected: { label: 'Rejected', variant: 'destructive' },
      processed: { label: 'Processed', variant: 'default' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getReasonLabel = (reasonType: string) => {
    const reasons: Record<string, string> = {
      'not-satisfied': 'Not satisfied with content',
      'technical-issues': 'Technical issues',
      'not-using': 'Not using the product',
      'financial': 'Financial reasons',
      'other': 'Other reason'
    };
    return reasons[reasonType] || reasonType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-6xl animate-brain-pulse">💰</div>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">No Refund Requests</h3>
          <p className="text-muted-foreground">
            All refund requests will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Refund Requests</h2>
          <p className="text-muted-foreground">Manage customer refund requests</p>
        </div>
        <Button onClick={fetchRefunds} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {refunds.map((refund) => (
          <Card key={refund.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      {refund.customer_name}
                    </h3>
                    {getStatusBadge(refund.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {refund.email}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-end">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(refund.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium mb-1">Reason</p>
                  <p className="text-sm text-muted-foreground">
                    {getReasonLabel(refund.reason_type)}
                  </p>
                </div>
                {refund.accepted_partial_refund && (
                  <div>
                    <p className="text-sm font-medium mb-1">Partial Refund</p>
                    <p className="text-sm text-green-600 font-semibold">
                      {refund.accepted_partial_refund}
                    </p>
                  </div>
                )}
              </div>

              {refund.reason_details && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm font-medium text-blue-900">Additional Details:</p>
                  </div>
                  <p className="text-sm text-blue-800 pl-6">{refund.reason_details}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => updateStatus(refund.id, 'approved')}
                  disabled={updating === refund.id || refund.status === 'approved'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(refund.id, 'rejected')}
                  disabled={updating === refund.id || refund.status === 'rejected'}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => updateStatus(refund.id, 'processed')}
                  disabled={updating === refund.id || refund.status === 'processed'}
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Mark as Processed
                </Button>
                {refund.status === 'processed' && (
                  <div className="ml-auto flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Refund Processed</span>
                  </div>
                )}
                {refund.status === 'pending' && (
                  <div className="ml-auto flex items-center gap-2 text-sm text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Review</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

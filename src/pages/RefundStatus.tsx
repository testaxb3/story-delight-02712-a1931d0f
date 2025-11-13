import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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
          // No refund request found
          setRefundRequest(null);
        } else {
          throw error;
        }
      } else {
        setRefundRequest(data as RefundRequest);
      }
    } catch (error) {
      console.error('Error fetching refund request:', error);
      toast.error('Error loading refund status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          badgeVariant: 'secondary' as const,
          title: 'Under Review',
          description: 'Your refund request is being reviewed by our team',
        };
      case 'partial_accepted':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          badgeVariant: 'default' as const,
          title: 'Partial Refund Approved',
          description: 'Your partial refund has been approved and will be processed soon',
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          badgeVariant: 'default' as const,
          title: 'Refund Approved',
          description: 'Your full refund has been approved and will be processed soon',
        };
      case 'processed':
        return {
          icon: <DollarSign className="w-6 h-6" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeVariant: 'default' as const,
          title: 'Refund Processed',
          description: 'Your refund has been processed. You should receive it within 5-7 business days',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          badgeVariant: 'destructive' as const,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading refund status...</p>
        </div>
      </div>
    );
  }

  if (!refundRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Refund Request Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any refund requests yet.
              </p>
              <Button onClick={() => navigate('/refund')}>
                Request a Refund
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(refundRequest.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        {/* Status Card */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Refund Status</CardTitle>
                <CardDescription>Track your refund request progress</CardDescription>
              </div>
              <Badge variant={statusConfig.badgeVariant} className="text-sm px-3 py-1">
                {refundRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Current Status */}
            <div className={`rounded-lg border-2 p-6 mb-6 ${statusConfig.color}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {statusConfig.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {statusConfig.title}
                  </h3>
                  <p className="text-sm opacity-90">
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

              <div className="space-y-3">
                {/* Submitted */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-sm">Request Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(refundRequest.created_at), 'PPp')}
                    </p>
                  </div>
                </div>

                {/* Under Review */}
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    refundRequest.status !== 'pending'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}>
                    {refundRequest.status !== 'pending' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
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
                </div>

                {/* Decision Made */}
                {(refundRequest.status === 'approved' ||
                  refundRequest.status === 'partial_accepted' ||
                  refundRequest.status === 'rejected') && (
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      refundRequest.status === 'rejected'
                        ? 'bg-red-100'
                        : 'bg-green-100'
                    }`}>
                      {refundRequest.status === 'rejected' ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
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
                  </div>
                )}

                {/* Processed */}
                {refundRequest.status === 'processed' && refundRequest.processed_at && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-medium text-sm">Refund Processed</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(refundRequest.processed_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>Request ID</span>
                </div>
                <p className="text-sm font-mono">{refundRequest.id.slice(0, 8)}...</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted</span>
                </div>
                <p className="text-sm">{format(new Date(refundRequest.created_at), 'PP')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <p className="text-sm">{refundRequest.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reason</span>
                </div>
                <p className="text-sm">{getReasonLabel(refundRequest.reason_type)}</p>
              </div>
            </div>

            {refundRequest.reason_details && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Additional Details:</p>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {refundRequest.reason_details}
                </p>
              </div>
            )}

            {refundRequest.accepted_partial_refund && (
              <div className="pt-4 border-t">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Partial Refund Accepted:</strong> {refundRequest.accepted_partial_refund}
                    <br />
                    <span className="text-xs">You will keep full access to NEP System</span>
                  </p>
                </div>
              </div>
            )}

            {refundRequest.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Admin Notes:</p>
                <p className="text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  {refundRequest.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expected Timeline */}
        {refundRequest.status !== 'processed' && refundRequest.status !== 'rejected' && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expected Timeline
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>24 hours:</strong> Review and confirmation email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>5-7 business days:</strong> Refund processed after approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Same payment method used for purchase will be credited</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

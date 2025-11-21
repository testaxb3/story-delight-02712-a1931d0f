import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useScriptRequests } from '@/hooks/useScriptRequests';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  MessageCircleHeart,
  FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  in_review: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const STATUS_ICONS = {
  pending: AlertCircle,
  in_review: Clock,
  completed: CheckCircle,
  rejected: XCircle,
};

const STATUS_LABELS = {
  pending: 'Pending',
  in_review: 'In Review',
  completed: 'Completed',
  rejected: 'Rejected',
};

const URGENCY_COLORS = {
  low: 'bg-gray-500/10 text-gray-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-red-500/10 text-red-500',
};

export default function ScriptRequests() {
  const { requests, isLoading } = useScriptRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const filterRequestsByStatus = (status?: string) => {
    if (!requests) return [];
    if (!status) return requests;
    return requests.filter((r: any) => r.status === status);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const pendingCount = filterRequestsByStatus('pending').length;
  const inReviewCount = filterRequestsByStatus('in_review').length;
  const completedCount = filterRequestsByStatus('completed').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Script Requests</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track your personalized script requests
            </p>
          </div>
          <Button
            onClick={() => setRequestModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
          >
            <MessageCircleHeart className="w-4 h-4 mr-2" />
            <span className="sm:inline">New Request</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{requests?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{inReviewCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>View and track all your script requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                <TabsTrigger value="all" className="text-[10px] sm:text-sm px-1 sm:px-3 py-2">
                  All<br className="sm:hidden"/><span className="hidden sm:inline"> </span>({requests?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-[10px] sm:text-sm px-1 sm:px-3 py-2">
                  <span className="hidden sm:inline">Pending</span><span className="sm:hidden">⏳</span><br className="sm:hidden"/>({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="in_review" className="text-[10px] sm:text-sm px-1 sm:px-3 py-2">
                  <span className="hidden sm:inline">Review</span><span className="sm:hidden">👀</span><br className="sm:hidden"/>({inReviewCount})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-[10px] sm:text-sm px-1 sm:px-3 py-2">
                  <span className="hidden sm:inline">Done</span><span className="sm:hidden">✅</span><br className="sm:hidden"/>({completedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-[10px] sm:text-sm px-1 sm:px-3 py-2">
                  <span className="hidden sm:inline">Rejected</span><span className="sm:hidden">❌</span>
                </TabsTrigger>
              </TabsList>

              {['all', 'pending', 'in_review', 'completed', 'rejected'].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4 mt-4">
                  {filterRequestsByStatus(status === 'all' ? undefined : status).length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No requests found</p>
                      {status === 'all' && (
                        <Button
                          onClick={() => setRequestModalOpen(true)}
                          variant="outline"
                          className="mt-4"
                        >
                          <MessageCircleHeart className="w-4 h-4 mr-2" />
                          Create Your First Request
                        </Button>
                      )}
                    </div>
                  ) : (
                    filterRequestsByStatus(status === 'all' ? undefined : status).map(
                      (request: any) => {
                        const StatusIcon = STATUS_ICONS[request.status as keyof typeof STATUS_ICONS];
                        return (
                          <Card key={request.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={STATUS_COLORS[request.status as keyof typeof STATUS_COLORS]}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                                    </Badge>
                                    <Badge className={URGENCY_COLORS[request.urgency_level as keyof typeof URGENCY_COLORS]}>
                                      {request.urgency_level === 'urgent' && '🔥 Urgent'}
                                      {request.urgency_level === 'high' && 'High'}
                                      {request.urgency_level === 'medium' && 'Medium'}
                                      {request.urgency_level === 'low' && 'Low'}
                                    </Badge>
                                    {request.child_brain_profile && (
                                      <Badge variant="outline">{request.child_brain_profile}</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(request.created_at), {
                                      addSuffix: true,
                                    })}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                  className="w-full sm:w-auto"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  <span className="text-xs sm:text-sm">View Details</span>
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm line-clamp-2">{request.situation_description}</p>
                              {request.admin_notes && (
                                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                                    Admin Response:
                                  </p>
                                  <p className="text-xs text-blue-800 dark:text-blue-200">
                                    {request.admin_notes}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      }
                    )
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              View your script request details and status
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {(() => {
                  const StatusIcon = STATUS_ICONS[selectedRequest.status as keyof typeof STATUS_ICONS];
                  return (
                    <Badge className={STATUS_COLORS[selectedRequest.status as keyof typeof STATUS_COLORS]}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {STATUS_LABELS[selectedRequest.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  );
                })()}
                <Badge className={URGENCY_COLORS[selectedRequest.urgency_level as keyof typeof URGENCY_COLORS]}>
                  Urgency: {selectedRequest.urgency_level}
                </Badge>
              </div>

              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Submitted:</span>{' '}
                  {formatDistanceToNow(new Date(selectedRequest.created_at), {
                    addSuffix: true,
                  })}
                </div>
                {selectedRequest.child_brain_profile && (
                  <div>
                    <span className="font-medium">Brain Profile:</span> {selectedRequest.child_brain_profile}
                  </div>
                )}
                {selectedRequest.child_age && (
                  <div>
                    <span className="font-medium">Age:</span> {selectedRequest.child_age} years
                  </div>
                )}
                {selectedRequest.parent_emotional_state && (
                  <div>
                    <span className="font-medium">Emotional State:</span>{' '}
                    {selectedRequest.parent_emotional_state}
                  </div>
                )}
              </div>

              {/* Situation Description */}
              <div>
                <h4 className="font-medium mb-2">Situation Description:</h4>
                <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {selectedRequest.situation_description}
                </p>
              </div>

              {/* Locations */}
              {selectedRequest.location_type && selectedRequest.location_type.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Locations:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedRequest.location_type.map((loc: string) => (
                      <Badge key={loc} variant="secondary">
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedRequest.additional_notes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes:</h4>
                  <p className="text-sm bg-muted p-4 rounded-lg">{selectedRequest.additional_notes}</p>
                </div>
              )}

              {/* Admin Response */}
              {selectedRequest.admin_notes && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Admin Response:</h4>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">
                      {selectedRequest.admin_notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <RequestScriptModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
    </MainLayout>
  );
}

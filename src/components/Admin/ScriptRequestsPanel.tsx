import { useState } from 'react';
import { useAdminScriptRequests } from '@/hooks/useScriptRequests';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  pending: 'Pending Review',
  in_review: 'In Progress',
  completed: 'Completed',
  rejected: 'Cannot Complete',
};

const URGENCY_COLORS = {
  low: 'bg-gray-500/10 text-gray-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-red-500/10 text-red-500',
};

export function ScriptRequestsPanel() {
  const { requests, isLoading, updateRequest, isUpdating } = useAdminScriptRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  const handleUpdateStatus = () => {
    if (!selectedRequest || !newStatus) return;

    updateRequest(
      {
        id: selectedRequest.id,
        updates: {
          status: newStatus as 'pending' | 'in_review' | 'completed' | 'rejected',
          admin_notes: adminNotes,
        },
      },
      {
        onSuccess: async () => {
          // Send notification to user about status change
          const { data: { user } } = await supabase.auth.getUser();
          if (user && selectedRequest.user_id) {
            const statusMessages = {
              in_review: 'Your script request is now being reviewed by our team.',
              completed: 'Your script request has been completed! Check the admin notes for details.',
              rejected: 'Your script request could not be completed. See admin notes for more information.',
              pending: 'Your script request status has been updated to pending.',
            };

            await supabase.from('notifications').insert({
              user_id: selectedRequest.user_id,
              type: 'system',
              type_enum: 'system',
              title: 'Script Request Update',
              message: statusMessages[newStatus as keyof typeof statusMessages],
              link: '/script-requests',
            });
          }

          setSelectedRequest(null);
          setAdminNotes('');
          setNewStatus('');
        },
      }
    );
  };

  const filterRequestsByStatus = (status?: string) => {
    if (!requests) return [];
    if (!status) return requests;
    return requests.filter((r: any) => r.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = filterRequestsByStatus('pending').length;
  const inReviewCount = filterRequestsByStatus('in_review').length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Script Requests</CardTitle>
          <CardDescription>
            Manage custom script requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Todos ({requests?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendentes ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="in_review">
                Em Análise ({inReviewCount})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Concluídos
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejeitados
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'in_review', 'completed', 'rejected'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-4">
                {filterRequestsByStatus(status === 'all' ? undefined : status).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No requests found
                  </div>
                ) : (
                  filterRequestsByStatus(status === 'all' ? undefined : status).map(
                    (request: any) => {
                      const StatusIcon = STATUS_ICONS[request.status as keyof typeof STATUS_ICONS];
                      return (
                        <Card key={request.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={STATUS_COLORS[request.status as keyof typeof STATUS_COLORS]}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                                  </Badge>
                                  <Badge className={URGENCY_COLORS[request.urgency_level as keyof typeof URGENCY_COLORS]}>
                                    {request.urgency_level === 'urgent' && '🔥 Urgente'}
                                    {request.urgency_level === 'high' && 'Alta'}
                                    {request.urgency_level === 'medium' && 'Média'}
                                    {request.urgency_level === 'low' && 'Baixa'}
                                  </Badge>
                                  {request.child_brain_profile && (
                                    <Badge variant="outline">{request.child_brain_profile}</Badge>
                                  )}
                                  {request.child_age && (
                                    <Badge variant="outline">{request.child_age} anos</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">
                                    {request.profiles?.name || request.profiles?.email || 'Usuário'}
                                  </span>
                                  {' · '}
                                  {formatDistanceToNow(new Date(request.created_at), {
                                    addSuffix: true,
                                  })}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setAdminNotes(request.admin_notes || '');
                                  setNewStatus(request.status);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">{request.situation_description}</p>
                            {request.location_type && request.location_type.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {request.location_type.map((loc: string) => (
                                  <Badge key={loc} variant="secondary" className="text-xs">
                                    {loc}
                                  </Badge>
                                ))}
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

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review and manage script request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">User:</span>{' '}
                  {selectedRequest.profiles?.name || selectedRequest.profiles?.email}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {formatDistanceToNow(new Date(selectedRequest.created_at), {
                    addSuffix: true,
                  })}
                </div>
                {selectedRequest.child_brain_profile && (
                  <div>
                    <span className="font-medium">Profile:</span> {selectedRequest.child_brain_profile}
                  </div>
                )}
                {selectedRequest.child_age && (
                  <div>
                    <span className="font-medium">Age:</span> {selectedRequest.child_age} years
                  </div>
                )}
              </div>

              {/* Situation Description */}
              <div>
                <h4 className="font-medium mb-2">Situation Described:</h4>
                <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {selectedRequest.situation_description}
                </p>
              </div>

              {/* Locations */}
              {selectedRequest.location_type && selectedRequest.location_type.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Locations where it happens:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedRequest.location_type.map((loc: string) => (
                      <Badge key={loc} variant="secondary">
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Emotional State */}
              {selectedRequest.parent_emotional_state && (
                <div>
                  <h4 className="font-medium mb-2">Parent's emotional state:</h4>
                  <Badge variant="outline">{selectedRequest.parent_emotional_state}</Badge>
                </div>
              )}

              {/* Additional Notes */}
              {selectedRequest.additional_notes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes:</h4>
                  <p className="text-sm bg-muted p-4 rounded-lg">{selectedRequest.additional_notes}</p>
                </div>
              )}

              {/* Admin Management */}
              <div className="border-t pt-6 space-y-4">
                <h4 className="font-medium">Management</h4>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="in_review">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Cannot Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about progress, next steps, or why it cannot be completed..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequest(null)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

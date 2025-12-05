import { useState } from 'react';
import { useAdminScriptRequests } from '@/hooks/useScriptRequests';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  User,
  Mail,
  Calendar,
  MapPin,
  Brain,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScriptRequestChat } from './ScriptRequestChat';

const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    icon: AlertCircle, 
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20'
  },
  in_review: { 
    label: 'In Review', 
    icon: Clock, 
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  completed: { 
    label: 'Completed', 
    icon: CheckCircle, 
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  rejected: { 
    label: 'Rejected', 
    icon: XCircle, 
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/20'
  },
};

const URGENCY_CONFIG = {
  low: { label: 'Low', bg: 'bg-muted', text: 'text-muted-foreground' },
  medium: { label: 'Medium', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  high: { label: 'High', bg: 'bg-orange-500/10', text: 'text-orange-600' },
  urgent: { label: '🔥 Urgent', bg: 'bg-red-500/10', text: 'text-red-600' },
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

export function ScriptRequestsPanel() {
  const { requests, isLoading, updateRequest, isUpdating } = useAdminScriptRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState('all');

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
          const { data: { user } } = await supabase.auth.getUser();
          if (user && selectedRequest.user_id) {
            const statusMessages = {
              in_review: 'Your script request is now being reviewed by our team.',
              completed: 'Your script request has been completed! Check the notes for details.',
              rejected: 'Your script request could not be completed. See notes for more info.',
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
    if (!status || status === 'all') return requests;
    return requests.filter((r: any) => r.status === status);
  };

  const filteredRequests = filterRequestsByStatus(activeFilter);
  const counts = {
    all: requests?.length || 0,
    pending: filterRequestsByStatus('pending').length,
    in_review: filterRequestsByStatus('in_review').length,
    completed: filterRequestsByStatus('completed').length,
    rejected: filterRequestsByStatus('rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Script Requests
            </h2>
            <p className="text-sm text-muted-foreground">
              {counts.pending} pending • {counts.in_review} in review
            </p>
          </div>
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

        {/* Requests List */}
        <AnimatePresence mode="wait">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold">No requests found</h3>
              <p className="text-sm text-muted-foreground">
                {activeFilter === 'all' 
                  ? 'No script requests have been submitted yet'
                  : `No ${activeFilter.replace('_', ' ')} requests`
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
              {filteredRequests.map((request: any, index: number) => {
                const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
                const urgencyConfig = URGENCY_CONFIG[request.urgency_level as keyof typeof URGENCY_CONFIG];
                const StatusIcon = statusConfig?.icon || AlertCircle;
                const userName = request.profiles?.name || request.profiles?.email || 'Unknown User';
                const userEmail = request.profiles?.email || '';
                const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={cn(
                        "overflow-hidden transition-all hover:shadow-md border-l-4",
                        statusConfig?.border
                      )}
                    >
                      {/* Card Content */}
                      <CardContent className="p-4 space-y-3">
                        {/* Header Row: Avatar + Name/Email + Status */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{userName}</p>
                            {userEmail && (
                              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                            )}
                          </div>
                          <Badge 
                            className={cn(
                              "shrink-0 flex items-center gap-1 text-[11px]",
                              statusConfig?.bg,
                              statusConfig?.text,
                              "border-0"
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig?.label}
                          </Badge>
                        </div>

                        {/* Content Row: Situation Description */}
                        <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                          {request.situation_description}
                        </p>

                        {/* Meta Row: Compact badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </span>
                          {request.child_brain_profile && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                              🧠 {request.child_brain_profile}
                            </Badge>
                          )}
                          {request.child_age && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                              👶 {request.child_age}y
                            </Badge>
                          )}
                          {urgencyConfig && (
                            <Badge className={cn("text-[10px] h-5 px-1.5 border-0", urgencyConfig.bg, urgencyConfig.text)}>
                              {urgencyConfig.label}
                            </Badge>
                          )}
                          {request.location_type && request.location_type.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                              📍 {request.location_type.slice(0, 2).join(', ')}
                              {request.location_type.length > 2 && ` +${request.location_type.length - 2}`}
                            </Badge>
                          )}
                        </div>
                      </CardContent>

                      {/* Action Footer */}
                      <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/30">
                        <ScriptRequestChat
                          requestId={request.id}
                          userName={userName}
                          userEmail={userEmail}
                          userId={request.user_id}
                          variant="full"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 h-10"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminNotes(request.admin_notes || '');
                            setNewStatus(request.status);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Request Details
            </DialogTitle>
            <DialogDescription>
              Review and manage this script request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-5">
              {/* User Card with Chat Button */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(selectedRequest.profiles?.name || selectedRequest.profiles?.email || 'U')
                      .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {selectedRequest.profiles?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedRequest.profiles?.email || 'No email'}
                  </p>
                </div>
                <ScriptRequestChat
                  requestId={selectedRequest.id}
                  userName={selectedRequest.profiles?.name || 'Unknown User'}
                  userEmail={selectedRequest.profiles?.email || ''}
                  userId={selectedRequest.user_id}
                />
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Submitted</p>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                {selectedRequest.child_brain_profile && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Brain Profile</p>
                    <p className="font-medium">{selectedRequest.child_brain_profile}</p>
                  </div>
                )}
                {selectedRequest.child_age && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Child Age</p>
                    <p className="font-medium">{selectedRequest.child_age} years</p>
                  </div>
                )}
                {selectedRequest.parent_emotional_state && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Parent State</p>
                    <p className="font-medium capitalize">{selectedRequest.parent_emotional_state}</p>
                  </div>
                )}
              </div>

              {/* Situation Description */}
              <div>
                <h4 className="font-medium mb-2 text-sm">Situation Described</h4>
                <p className="text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedRequest.situation_description}
                </p>
              </div>

              {/* Locations */}
              {selectedRequest.location_type && selectedRequest.location_type.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Locations</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedRequest.location_type.map((loc: string) => (
                      <Badge key={loc} variant="secondary">{loc}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedRequest.additional_notes && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Additional Notes</h4>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">
                    {selectedRequest.additional_notes}
                  </p>
                </div>
              )}

              {/* Admin Management */}
              <div className="border-t pt-5 space-y-4">
                <h4 className="font-semibold">Update Status</h4>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
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
                    placeholder="Add notes about progress or why it cannot be completed..."
                    className="min-h-[80px]"
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
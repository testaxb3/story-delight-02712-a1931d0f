import { useState, useEffect, useMemo, memo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useScriptRequests, ScriptRequest } from '@/hooks/useScriptRequests';
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
  MessageCircleHeart,
  FileText,
  Search,
  Plus,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useNavigate } from 'react-router-dom';

type RequestStatus = 'pending' | 'in_review' | 'completed' | 'rejected';

interface FilteredRequests {
  all: ScriptRequest[];
  pending: ScriptRequest[];
  in_review: ScriptRequest[];
  completed: ScriptRequest[];
  rejected: ScriptRequest[];
}

interface StatusCounts {
  total: number;
  pending: number;
  in_review: number;
  completed: number;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-500/15 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 dark:border-yellow-500/40',
  in_review: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 dark:border-blue-500/40',
  completed: 'bg-green-500/15 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 dark:border-green-500/40',
  rejected: 'bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 dark:border-red-500/40',
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

// Premium Skeleton Component
const SkeletonCard = memo(() => (
  <div className="bg-card border border-border rounded-[24px] p-5 overflow-hidden">
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-20 bg-muted rounded-md" />
        <div className="h-4 w-16 bg-muted rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-3/4 bg-muted rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-16 bg-muted rounded-md" />
        <div className="h-4 w-20 bg-muted rounded-md" />
      </div>
    </div>
  </div>
));

export default function ScriptRequests() {
  const { requests, isLoading } = useScriptRequests();
  const { triggerHaptic } = useHaptic();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<ScriptRequest | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounced Search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Single-pass O(n) Filtering
  const { filteredRequests, counts } = useMemo(() => {
    if (!requests) {
      return {
        filteredRequests: { all: [], pending: [], in_review: [], completed: [], rejected: [] },
        counts: { total: 0, pending: 0, in_review: 0, completed: 0 }
      };
    }
    
    const result: FilteredRequests = {
      all: [],
      pending: [],
      in_review: [],
      completed: [],
      rejected: []
    };
    const statusCounts: StatusCounts = { total: 0, pending: 0, in_review: 0, completed: 0 };
    
    for (const request of requests) {
      const matchesSearch = !debouncedQuery || 
        request.situation_description?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        request.admin_notes?.toLowerCase().includes(debouncedQuery.toLowerCase());
      
      if (!matchesSearch) continue;
      
      result.all.push(request);
      statusCounts.total++;
      
      if (request.status in result) {
        result[request.status as RequestStatus].push(request);
        if (request.status !== 'rejected') {
          statusCounts[request.status as keyof Omit<StatusCounts, 'total'>]++;
        }
      }
    }
    
    return { filteredRequests: result, counts: statusCounts };
  }, [requests, debouncedQuery]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32">
          <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />
          
          <header className="px-5 mb-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="h-10 w-32 bg-muted rounded-lg mb-2 animate-pulse" />
                <div className="h-5 w-48 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </header>

          <div className="flex gap-3 overflow-x-auto px-5 pb-6 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[140px] bg-card p-4 rounded-[20px] border border-border animate-pulse">
                <div className="h-3 w-12 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>

          <div className="px-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32">
        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        {/* Premium Header */}
        <header className="px-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                navigate(-1);
              }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground tracking-tight mb-1">Requests</h1>
              <p className="text-muted-foreground font-medium">Track your personalized scripts</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                setRequestModalOpen(true);
              }}
              className="bg-primary text-primary-foreground rounded-full p-2.5 shadow-lg shadow-primary/30"
              aria-label="Create new request"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card h-10 rounded-xl pl-9 pr-4 text-[17px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-border"
            />
          </div>
        </header>

        {/* Stats Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto px-5 pb-6 scrollbar-hide snap-x">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0 }}
            className="min-w-[140px] bg-card p-4 rounded-[20px] shadow-sm snap-center border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <MessageCircleHeart className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Total</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{counts.total}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="min-w-[140px] bg-card p-4 rounded-[20px] shadow-sm snap-center border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-wide">Pending</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{counts.pending}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="min-w-[140px] bg-card p-4 rounded-[20px] shadow-sm snap-center border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">Review</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{counts.in_review}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="min-w-[140px] bg-card p-4 rounded-[20px] shadow-sm snap-center border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-xs font-bold text-green-500 uppercase tracking-wide">Done</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{counts.completed}</p>
          </motion.div>
        </div>

        {/* Requests List */}
        <div className="px-5">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-muted p-1 rounded-xl h-auto mb-6 overflow-x-auto flex justify-start">
              <TabsTrigger value="all" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Pending
              </TabsTrigger>
              <TabsTrigger value="in_review" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Review
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Done
              </TabsTrigger>
            </TabsList>

            {(['all', 'pending', 'in_review', 'completed'] as const).map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-0 outline-none">
                {filteredRequests[status].length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-5">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">No requests yet</h3>
                    <p className="text-muted-foreground text-sm text-center max-w-[240px] mb-6">
                      Request a personalized script for any challenging situation.
                    </p>
                    {status === 'all' && (
                      <Button
                        onClick={() => {
                          triggerHaptic('medium');
                          setRequestModalOpen(true);
                        }}
                        className="h-12 px-6 rounded-2xl font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Request
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  filteredRequests[status].map((request) => {
                    const StatusIcon = STATUS_ICONS[request.status as RequestStatus];
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedRequest(request);
                        }}
                        className="bg-card p-5 rounded-[24px] border border-border relative overflow-hidden cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border", STATUS_COLORS[request.status as RequestStatus])}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {STATUS_LABELS[request.status as RequestStatus]}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          {request.urgency_level === 'urgent' && (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                            </span>
                          )}
                        </div>
                        
                        <p className="text-[15px] text-foreground font-medium line-clamp-2 leading-relaxed mb-3">
                          {request.situation_description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {request.child_brain_profile && (
                              <span className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded-md font-medium">
                                {request.child_brain_profile}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-primary text-xs font-semibold">
                            View Details <Eye className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Detail Modal - Premium iOS Sheet Style */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-full max-w-md p-0 gap-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] border-none rounded-[24px] overflow-hidden shadow-2xl max-h-[85vh]">
          {/* Back Button Header */}
          <div className="flex items-center justify-between p-4 bg-card border-b border-border">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                setSelectedRequest(null);
              }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <DialogTitle className="text-lg font-bold">Request Details</DialogTitle>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {selectedRequest && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="p-6 overflow-y-auto max-h-[60vh] space-y-6"
            >
              {/* Status Badge */}
              <div className="flex justify-center">
                {(() => {
                  const StatusIcon = STATUS_ICONS[selectedRequest.status as RequestStatus];
                  return (
                    <Badge className={cn("px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border", STATUS_COLORS[selectedRequest.status as RequestStatus])}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {STATUS_LABELS[selectedRequest.status as RequestStatus]}
                    </Badge>
                  );
                })()}
              </div>

              {/* Main Content Card */}
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Situation</h4>
                <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedRequest.situation_description}
                </p>
              </div>

              {/* Meta Data Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Child</h4>
                  <p className="font-semibold text-foreground">{selectedRequest.child_brain_profile || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.child_age ? `${selectedRequest.child_age} years old` : ''}</p>
                </div>
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Urgency</h4>
                  <p className={cn("font-semibold capitalize", 
                    selectedRequest.urgency_level === 'urgent' ? 'text-red-500' : 
                    selectedRequest.urgency_level === 'high' ? 'text-orange-500' : 'text-foreground'
                  )}>
                    {selectedRequest.urgency_level}
                  </p>
                </div>
              </div>

              {/* Completed Script Link */}
              {selectedRequest.status === 'completed' && selectedRequest.created_script_id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button
                    onClick={() => {
                      triggerHaptic('medium');
                      navigate(`/scripts/${selectedRequest.created_script_id}`);
                    }}
                    className="w-full h-12 rounded-2xl font-semibold bg-green-500 hover:bg-green-600 text-white"
                  >
                    View Created Script <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Admin Response */}
              {selectedRequest.admin_notes ? (
                <div className="bg-blue-500/10 dark:bg-blue-500/15 rounded-2xl p-5 border border-blue-500/30 dark:border-blue-500/40">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MessageCircleHeart className="w-4 h-4" /> Admin Response
                  </h4>
                  <p className="text-[15px] leading-relaxed text-blue-900 dark:text-blue-100">
                    {selectedRequest.admin_notes}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm italic">
                  No response yet. We're working on it!
                </div>
              )}
            </motion.div>
          )}
          
          <div className="p-4 bg-card border-t border-border">
            <Button 
              onClick={() => {
                triggerHaptic('light');
                setSelectedRequest(null);
              }} 
              className="w-full rounded-xl h-12 font-semibold text-[16px]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <RequestScriptModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
    </MainLayout>
  );
}

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
  FileText,
  Search,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filterRequestsByStatus = (status?: string) => {
    if (!requests) return [];
    let filtered = requests;
    
    if (status) {
      filtered = filtered.filter((r: any) => r.status === status);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((r: any) => 
        r.situation_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.admin_notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen bg-background">
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
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32">
        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        {/* Apple Style Header */}
        <header className="px-5 mb-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Requests</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Track your personalized script requests</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setRequestModalOpen(true)}
              className="bg-blue-500 text-white rounded-full p-2 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-200/80 dark:bg-[#1C1C1E] h-10 rounded-xl pl-9 pr-4 text-[17px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </header>

        {/* Stats Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto px-5 pb-6 scrollbar-hide snap-x">
          <div className="min-w-[140px] bg-white dark:bg-[#1C1C1E] p-4 rounded-[20px] shadow-sm snap-center border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{requests?.length || 0}</p>
          </div>
          <div className="min-w-[140px] bg-white dark:bg-[#1C1C1E] p-4 rounded-[20px] shadow-sm snap-center border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-wide mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          </div>
          <div className="min-w-[140px] bg-white dark:bg-[#1C1C1E] p-4 rounded-[20px] shadow-sm snap-center border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">Review</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{inReviewCount}</p>
          </div>
          <div className="min-w-[140px] bg-white dark:bg-[#1C1C1E] p-4 rounded-[20px] shadow-sm snap-center border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wide mb-1">Done</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
          </div>
        </div>

        {/* Requests List - Segmented Control Style */}
        <div className="px-5">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-gray-200/80 dark:bg-[#1C1C1E] p-1 rounded-xl h-auto mb-6 overflow-x-auto flex justify-start">
              <TabsTrigger value="all" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Pending</TabsTrigger>
              <TabsTrigger value="in_review" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Review</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Done</TabsTrigger>
            </TabsList>

            {['all', 'pending', 'in_review', 'completed'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-0 outline-none">
                {filterRequestsByStatus(status === 'all' ? undefined : status).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No requests found</p>
                    {status === 'all' && (
                      <Button
                        onClick={() => setRequestModalOpen(true)}
                        variant="link"
                        className="text-blue-500 mt-2"
                      >
                        Create Your First Request
                      </Button>
                    )}
                  </div>
                ) : (
                  filterRequestsByStatus(status === 'all' ? undefined : status).map(
                    (request: any) => {
                      const StatusIcon = STATUS_ICONS[request.status as keyof typeof STATUS_ICONS];
                      return (
                        <motion.div
                          key={request.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRequest(request)}
                          className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[request.status as keyof typeof STATUS_COLORS])}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                              </Badge>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            {request.urgency_level === 'urgent' && (
                              <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[15px] text-gray-900 dark:text-white font-medium line-clamp-2 leading-relaxed mb-3">
                            {request.situation_description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {request.child_brain_profile && (
                                <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md font-medium">
                                  {request.child_brain_profile}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-blue-500 text-xs font-semibold">
                              View Details <Eye className="w-3 h-3 ml-1" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Detail Modal - iOS Sheet Style */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-full max-w-md p-0 gap-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] border-none rounded-[24px] overflow-hidden shadow-2xl max-h-[85vh]">
          <DialogHeader className="p-6 bg-white dark:bg-[#2C2C2E] border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-xl font-bold text-center">Request Details</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Submitted {selectedRequest && formatDistanceToNow(new Date(selectedRequest.created_at), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {(() => {
                  const StatusIcon = STATUS_ICONS[selectedRequest.status as keyof typeof STATUS_ICONS];
                  return (
                    <Badge className={cn("px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider", STATUS_COLORS[selectedRequest.status as keyof typeof STATUS_COLORS])}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {STATUS_LABELS[selectedRequest.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  );
                })()}
              </div>

              {/* Main Content Card */}
              <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Situation</h4>
                <p className="text-[15px] leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedRequest.situation_description}
                </p>
              </div>

              {/* Meta Data Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Child</h4>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.child_brain_profile || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.child_age ? `${selectedRequest.child_age} years old` : ''}</p>
                </div>
                <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Urgency</h4>
                  <p className={cn("font-semibold capitalize", 
                    selectedRequest.urgency_level === 'urgent' ? 'text-red-500' : 
                    selectedRequest.urgency_level === 'high' ? 'text-orange-500' : 'text-gray-900 dark:text-white'
                  )}>
                    {selectedRequest.urgency_level}
                  </p>
                </div>
              </div>

              {/* Admin Response */}
              {selectedRequest.admin_notes ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/50">
                  <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MessageCircleHeart className="w-4 h-4" /> Admin Response
                  </h4>
                  <p className="text-[15px] leading-relaxed text-blue-900 dark:text-blue-100">
                    {selectedRequest.admin_notes}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm italic">
                  No response yet. We're working on it!
                </div>
              )}
            </div>
          )}
          
          <div className="p-4 bg-white dark:bg-[#2C2C2E] border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => setSelectedRequest(null)} className="w-full rounded-xl h-12 font-semibold text-[16px]">
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
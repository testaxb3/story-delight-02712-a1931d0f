import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useScriptRequests, ScriptRequest } from '@/hooks/useScriptRequests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
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
  ExternalLink,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { useNavigate } from 'react-router-dom';

// --- Types & Constants ---

type RequestStatus = 'pending' | 'in_review' | 'completed' | 'rejected';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    shimmer: 'from-amber-500/5 via-amber-500/10 to-transparent'
  },
  in_review: {
    label: 'In Review',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    shimmer: 'from-blue-500/5 via-blue-500/10 to-transparent'
  },
  completed: {
    label: 'Done',
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    shimmer: 'from-emerald-500/5 via-emerald-500/10 to-transparent'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    shimmer: 'from-red-500/5 via-red-500/10 to-transparent'
  },
};

// --- Components ---

const BentoStat = memo(({ 
  title, 
  count, 
  icon: Icon, 
  config, 
  isActive 
}: { 
  title: string; 
  count: number; 
  icon: any; 
  config?: any;
  isActive?: boolean; 
}) => (
  <div className={cn(
    "relative overflow-hidden rounded-[24px] p-5 border transition-all duration-300 group",
    isActive 
      ? "bg-card border-primary/20 shadow-lg shadow-primary/5" 
      : "bg-card/50 border-transparent hover:bg-card hover:border-border/50"
  )}>
    {config && (
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br pointer-events-none", config.shimmer)} />
    )}
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("p-2 rounded-full", config?.bg || "bg-muted")}>
          <Icon className={cn("w-4 h-4", config?.color || "text-muted-foreground")} />
        </div>
        {isActive && <Sparkles className="w-3 h-3 text-primary animate-pulse" />}
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-foreground">{count}</p>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
    </div>
  </div>
));

const RequestCard = memo(({ 
  request, 
  onClick 
}: { 
  request: ScriptRequest; 
  onClick: () => void 
}) => {
  const config = STATUS_CONFIG[request.status as RequestStatus];
  const StatusIcon = config.icon;
  const isUrgent = request.urgency_level === 'urgent';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-card/80 backdrop-blur-sm p-5 rounded-[24px] border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
    >
      {/* Subtle highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] font-bold border backdrop-blur-md", config.bg, config.color, config.border)}>
            <StatusIcon className="w-3 h-3 mr-1.5" />
            {config.label}
          </Badge>
          
          <span className="text-[10px] font-medium text-muted-foreground/80 flex items-center gap-1">
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </span>
        </div>

        <h3 className="text-[16px] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {request.situation_description}
        </h3>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
             {request.child_brain_profile && (
               <span className="text-[10px] px-2 py-1 bg-secondary rounded-md font-medium text-secondary-foreground">
                 {request.child_brain_profile}
               </span>
             )}
             {isUrgent && (
               <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                 <Zap className="w-3 h-3 fill-current" /> Urgent
               </span>
             )}
          </div>
          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// --- Main Page ---

export default function ScriptRequests() {
  const { requests, isLoading } = useScriptRequests();
  const { triggerHaptic } = useHaptic();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<ScriptRequest | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Computed Stats & Filtered Lists
  const { filteredData, stats } = useMemo(() => {
    if (!requests) return { 
      filteredData: [], 
      stats: { total: 0, pending: 0, in_review: 0, completed: 0, rejected: 0 } 
    };

    const stats = { total: requests.length, pending: 0, in_review: 0, completed: 0, rejected: 0 };
    
    const filtered = requests.filter(req => {
      // Update stats regardless of search (showing global stats is usually better UX, or filtered stats? Let's do global for the cards)
      if (req.status in stats) stats[req.status as keyof typeof stats]++;
      
      // Search Filter
      const matchesSearch = !searchQuery || 
        req.situation_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.admin_notes?.toLowerCase().includes(searchQuery.toLowerCase());
        
      if (!matchesSearch) return false;

      // Tab Filter
      if (activeTab === 'all') return true;
      return req.status === activeTab;
    });

    return { filteredData: filtered, stats };
  }, [requests, searchQuery, activeTab]);

  const handleTabChange = (tab: string) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <MainLayout>
         <div className="flex items-center justify-center h-screen bg-[#F2F2F7] dark:bg-black">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-muted rounded-full mb-4" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
         </div>
      </MainLayout>
    );
  }

  // Check if user has active request (pending or in_review)
  const hasActiveRequest = requests?.some(r => r.status === 'pending' || r.status === 'in_review');

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32 selection:bg-primary/30">
        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        {/* Active Request Banner */}
        {hasActiveRequest && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-4"
          >
            <div 
              onClick={() => navigate('/script-request-status')}
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MessageCircleHeart className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">You have an active request</p>
                  <p className="text-xs text-muted-foreground">Tap to view status & messages</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-500" />
            </div>
          </motion.div>
        )}

        {/* Dynamic Header */}
        <header className="px-5 mb-8 sticky top-4 z-50">
          <div className="absolute inset-0 bg-[#F2F2F7]/80 dark:bg-black/80 backdrop-blur-xl -z-10 -m-5 mask-image-b-fade" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-background/50 border border-border/50 flex items-center justify-center backdrop-blur-md shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Request Studio</h1>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('medium');
                setRequestModalOpen(true);
              }}
              className="h-10 px-4 bg-primary text-primary-foreground rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
            </motion.button>
          </div>

          {/* Search Field */}
          <div 
            className="relative group"
            onClick={() => searchInputRef.current?.focus()}
          >
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl flex items-center px-4 h-12 shadow-sm group-focus-within:border-primary/50 group-focus-within:ring-2 group-focus-within:ring-primary/10 transition-all">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search your requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none h-full px-3 text-[16px] placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Bento Grid Stats */}
        <div className="px-5 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
               <BentoStat 
                 title="Total Requests" 
                 count={stats.total} 
                 icon={FileText} 
                 isActive={true}
               />
            </div>
            <BentoStat 
              title="Pending" 
              count={stats.pending} 
              icon={AlertCircle} 
              config={STATUS_CONFIG.pending} 
            />
            <BentoStat 
              title="Review" 
              count={stats.in_review} 
              icon={Clock} 
              config={STATUS_CONFIG.in_review} 
            />
            <BentoStat 
              title="Done" 
              count={stats.completed} 
              icon={CheckCircle} 
              config={STATUS_CONFIG.completed} 
            />
             <BentoStat 
              title="Rejected" 
              count={stats.rejected} 
              icon={XCircle} 
              config={STATUS_CONFIG.rejected} 
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="px-5 min-h-[500px]">
          {/* Fluid Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 pb-2 sticky top-[140px] z-40 bg-[#F2F2F7]/95 dark:bg-black/95 backdrop-blur-xl py-2 -mx-5 px-5 mask-image-b-fade">
            {['all', 'pending', 'in_review', 'completed'].map((tab) => {
               const isActive = activeTab === tab;
               return (
                 <button
                   key={tab}
                   onClick={() => handleTabChange(tab)}
                   className={cn(
                     "relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors z-10",
                     isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                   {isActive && (
                     <motion.div
                       layoutId="activeTab"
                       className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25"
                       initial={false}
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                   )}
                   <span className="relative z-10 capitalize">
                     {tab === 'in_review' ? 'In Review' : tab}
                   </span>
                 </button>
               );
            })}
          </div>

          {/* Animated List */}
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredData.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent animate-spin-slow" />
                      <FileText className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No requests found</h3>
                    <p className="text-muted-foreground max-w-[250px] mb-6">
                      {searchQuery 
                        ? "Try adjusting your search terms." 
                        : "Start by creating your first script request."}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setRequestModalOpen(true)}
                        className="h-12 px-8 rounded-2xl font-semibold"
                      >
                        Create Request
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  filteredData.map((request) => (
                    <RequestCard 
                      key={request.id} 
                      request={request} 
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedRequest(request);
                      }} 
                    />
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-full max-w-md p-0 gap-0 bg-[#F2F2F7] dark:bg-[#1C1C1E] border-none rounded-[32px] overflow-hidden shadow-2xl outline-none">
          {selectedRequest && (
            <div className="flex flex-col h-full max-h-[85vh]">
               {/* Sticky Header */}
              <div className="p-4 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between sticky top-0 z-50">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="rounded-full h-10 w-10" 
                   onClick={() => setSelectedRequest(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <DialogTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Details</DialogTitle>
                <div className="w-10" />
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                 {/* Status Banner */}
                 <div className={cn("p-4 rounded-2xl border flex items-center justify-between", 
                    STATUS_CONFIG[selectedRequest.status as RequestStatus].bg,
                    STATUS_CONFIG[selectedRequest.status as RequestStatus].border
                 )}>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = STATUS_CONFIG[selectedRequest.status as RequestStatus].icon;
                        return <Icon className={cn("w-5 h-5", STATUS_CONFIG[selectedRequest.status as RequestStatus].color)} />;
                      })()}
                      <span className={cn("font-bold", STATUS_CONFIG[selectedRequest.status as RequestStatus].color)}>
                        {STATUS_CONFIG[selectedRequest.status as RequestStatus].label}
                      </span>
                    </div>
                    <span className="text-xs font-medium opacity-70">
                       {new Date(selectedRequest.created_at).toLocaleDateString()}
                    </span>
                 </div>

                 {/* Main Content */}
                 <div className="space-y-2">
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Description</h4>
                   <div className="bg-background p-5 rounded-[20px] shadow-sm border border-border/50">
                     <p className="text-[16px] leading-relaxed text-foreground">
                       {selectedRequest.situation_description}
                     </p>
                   </div>
                 </div>

                 {/* Grid Info */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background p-4 rounded-[20px] border border-border/50">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Child Profile</h4>
                      <p className="font-semibold">{selectedRequest.child_brain_profile || 'Not specified'}</p>
                    </div>
                    <div className="bg-background p-4 rounded-[20px] border border-border/50">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Urgency</h4>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", 
                          selectedRequest.urgency_level === 'urgent' ? 'bg-red-500 animate-pulse' : 
                          selectedRequest.urgency_level === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                        )} />
                        <span className="capitalize font-medium">{selectedRequest.urgency_level}</span>
                      </div>
                    </div>
                 </div>

                 {/* Admin Response */}
                 {selectedRequest.admin_notes && (
                   <div className="space-y-2">
                     <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Admin Response</h4>
                     <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-[20px]">
                       <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">
                         <MessageCircleHeart className="w-4 h-4" />
                         <span>Expert Note</span>
                       </div>
                       <p className="text-sm leading-relaxed opacity-90">
                         {selectedRequest.admin_notes}
                       </p>
                     </div>
                   </div>
                 )}

                 {/* Action */}
                 {selectedRequest.status === 'completed' && selectedRequest.created_script_id && (
                    <Button 
                      onClick={() => navigate(`/scripts/${selectedRequest.created_script_id}`)}
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Open Script <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                 )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RequestScriptModal open={requestModalOpen} onOpenChange={setRequestModalOpen} />
    </MainLayout>
  );
}

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { AdminScriptsTab } from '@/components/Admin/AdminScriptsTab';
import { AdminVideosTab } from '@/components/Admin/AdminVideosTab';
import { AdminAnalyticsTab } from '@/components/Admin/AdminAnalyticsTab';
import { AdminNotificationsTab } from '@/components/Admin/AdminNotificationsTab';
import { AdminRefundsTab } from '@/components/Admin/AdminRefundsTab';
import { BonusesManagement } from '@/components/Admin/BonusesManagement';
import { ModerationPanel } from '@/components/Community/ModerationPanel';
import { ScriptRequestsPanel } from '@/components/Admin/ScriptRequestsPanel';
import { AdminAudioTab } from '@/components/Admin/AdminAudioTab';
import { AdminSalesTab } from '@/components/Admin/AdminSalesTab';
import { AdminSystemTab } from '@/components/Admin/AdminSystemTab';
import { AdminProgramsTab } from '@/components/Admin/AdminProgramsTab';
import { AdminQuickActions } from '@/components/Admin/AdminQuickActions';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  BarChart3,
  Bell,
  DollarSign,
  Gift,
  Wand2,
  Shield,
  Settings,
  MessageCircleHeart,
  Headphones,
  ShoppingCart,
  GraduationCap,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface TabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  category: 'priority' | 'content' | 'engagement' | 'system';
}

interface Counts {
  scripts: number;
  videos: number;
  refunds: number;
  bonuses: number;
  audioTracks: number;
  pendingRefunds: number;
  pendingRequests: number;
  pendingAccounts: number;
}

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = memo(function StatCard({
  icon,
  label,
  value,
  trend,
  color,
  onClick,
  isPriority = false
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: string;
  color: string;
  onClick?: () => void;
  isPriority?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-[16px] cursor-pointer overflow-hidden transition-shadow",
        "bg-white dark:bg-card border shadow-sm hover:shadow-md",
        isPriority && Number(value) > 0 && "ring-2 ring-red-500/30"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-2 rounded-xl",
          color
        )}>
          {icon}
        </div>
        {isPriority && Number(value) > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            ACTION
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
      {trend && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </motion.div>
  );
});

// ============================================
// PRIORITY ACTION CARD
// ============================================
const PriorityActionCard = memo(function PriorityActionCard({
  icon,
  title,
  count,
  color,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  onClick: () => void;
}) {
  if (count === 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
    >
      <div className={cn("p-2 rounded-lg", color)}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{count} pending</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {count}
        </Badge>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.button>
  );
});

// ============================================
// CATEGORY TAB GROUP
// ============================================
const TabCategory = memo(function TabCategory({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
        {label}
      </span>
      <div className="w-px h-4 bg-border mx-1" />
      {children}
    </div>
  );
});

// ============================================
// MAIN ADMIN PAGE
// ============================================
export default function Admin() {
  const [activeTab, setActiveTab] = useState('sales');
  const [counts, setCounts] = useState<Counts>({
    scripts: 0,
    videos: 0,
    refunds: 0,
    bonuses: 0,
    audioTracks: 0,
    pendingRefunds: 0,
    pendingRequests: 0,
    pendingAccounts: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const { isAdmin, checking } = useAdminStatus();
  const navigate = useNavigate();

  const fetchCounts = useCallback(async () => {
    setLoadingCounts(true);

    const [
      scriptsRes,
      videosRes,
      refundsRes,
      bonusesRes,
      audioRes,
      pendingRefundsRes,
      pendingRequestsRes,
      pendingAccountsRes
    ] = await Promise.all([
      supabase.from('scripts').select('*', { count: 'exact', head: true }),
      supabase.from('videos').select('*', { count: 'exact', head: true }),
      supabase.from('refund_requests').select('*', { count: 'exact', head: true }),
      supabase.from('bonuses').select('*', { count: 'exact', head: true }),
      supabase.from('audio_tracks').select('*', { count: 'exact', head: true }),
      supabase.from('refund_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('script_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('approved_users').select('*', { count: 'exact', head: true }).eq('account_created', false)
    ]);

    setCounts({
      scripts: scriptsRes.count ?? 0,
      videos: videosRes.count ?? 0,
      refunds: refundsRes.count ?? 0,
      bonuses: bonusesRes.count ?? 0,
      audioTracks: audioRes.count ?? 0,
      pendingRefunds: pendingRefundsRes.count ?? 0,
      pendingRequests: pendingRequestsRes.count ?? 0,
      pendingAccounts: pendingAccountsRes.count ?? 0
    });
    setLoadingCounts(false);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCounts();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!user && !checking) {
      navigate('/auth');
    }
  }, [user, checking, navigate]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Total pending actions
  const totalPending = counts.pendingAccounts + counts.pendingRefunds + counts.pendingRequests;

  // Memoized tabs configuration
  const tabs: TabItem[] = useMemo(() => [
    {
      value: 'sales',
      label: 'Sales',
      icon: <ShoppingCart className="w-4 h-4" />,
      badge: counts.pendingAccounts > 0 ? counts.pendingAccounts : undefined,
      badgeColor: 'bg-red-500',
      category: 'priority'
    },
    {
      value: 'refunds',
      label: 'Refunds',
      icon: <DollarSign className="w-4 h-4" />,
      badge: counts.pendingRefunds > 0 ? counts.pendingRefunds : undefined,
      badgeColor: 'bg-yellow-500',
      category: 'priority'
    },
    {
      value: 'requests',
      label: 'Requests',
      icon: <MessageCircleHeart className="w-4 h-4" />,
      badge: counts.pendingRequests > 0 ? counts.pendingRequests : undefined,
      badgeColor: 'bg-cyan-500',
      category: 'priority'
    },
    {
      value: 'scripts',
      label: 'Scripts',
      icon: <Wand2 className="w-4 h-4" />,
      badge: counts.scripts,
      category: 'content'
    },
    {
      value: 'videos',
      label: 'Videos',
      icon: <Video className="w-4 h-4" />,
      badge: counts.videos,
      category: 'content'
    },
    {
      value: 'audio',
      label: 'Audio',
      icon: <Headphones className="w-4 h-4" />,
      badge: counts.audioTracks,
      category: 'content'
    },
    {
      value: 'programs',
      label: 'Programs',
      icon: <GraduationCap className="w-4 h-4" />,
      category: 'content'
    },
    {
      value: 'bonuses',
      label: 'Bonuses',
      icon: <Gift className="w-4 h-4" />,
      badge: counts.bonuses,
      category: 'content'
    },
    {
      value: 'notifications',
      label: 'Push',
      icon: <Bell className="w-4 h-4" />,
      category: 'engagement'
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      category: 'engagement'
    },
    {
      value: 'moderation',
      label: 'Mod',
      icon: <Shield className="w-4 h-4" />,
      category: 'system'
    },
    {
      value: 'system',
      label: 'System',
      icon: <Settings className="w-4 h-4" />,
      category: 'system'
    },
  ], [counts]);

  if (checking) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Shield className="w-16 h-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Safe area */}
      <div style={{ height: 'env(safe-area-inset-top)' }} />

      <div className="min-h-screen bg-[#F8F8F8] dark:bg-background pb-24">
        <div className="px-4 pt-4 space-y-5">

          {/* Premium Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-5 text-white shadow-xl shadow-purple-500/25"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl -ml-10 mb-10" />
              <Sparkles className="absolute top-4 right-4 w-5 h-5 text-white/30" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <p className="text-purple-100 text-xs">NEP System Control Center</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
                </motion.button>
              </div>

              {/* Pending Actions Alert */}
              {totalPending > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-sm rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">
                    {totalPending} action{totalPending > 1 ? 's' : ''} require{totalPending === 1 ? 's' : ''} your attention
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Priority Actions - Only show if there are pending items */}
          {totalPending > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                Priority Actions
              </h2>
              <div className="space-y-2">
                <PriorityActionCard
                  icon={<ShoppingCart className="w-4 h-4 text-white" />}
                  title="Pending Account Approvals"
                  count={counts.pendingAccounts}
                  color="bg-emerald-500"
                  onClick={() => setActiveTab('sales')}
                />
                <PriorityActionCard
                  icon={<DollarSign className="w-4 h-4 text-white" />}
                  title="Pending Refunds"
                  count={counts.pendingRefunds}
                  color="bg-yellow-500"
                  onClick={() => setActiveTab('refunds')}
                />
                <PriorityActionCard
                  icon={<MessageCircleHeart className="w-4 h-4 text-white" />}
                  title="Script Requests"
                  count={counts.pendingRequests}
                  color="bg-cyan-500"
                  onClick={() => setActiveTab('requests')}
                />
              </div>
            </motion.section>
          )}

          {/* Quick Stats Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Content Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Wand2 className="w-4 h-4 text-white" />}
                label="Total Scripts"
                value={loadingCounts ? '—' : counts.scripts}
                color="bg-gradient-to-br from-purple-500 to-indigo-500"
                onClick={() => setActiveTab('scripts')}
              />
              <StatCard
                icon={<Video className="w-4 h-4 text-white" />}
                label="Total Videos"
                value={loadingCounts ? '—' : counts.videos}
                color="bg-gradient-to-br from-pink-500 to-rose-500"
                onClick={() => setActiveTab('videos')}
              />
              <StatCard
                icon={<Headphones className="w-4 h-4 text-white" />}
                label="Audio Tracks"
                value={loadingCounts ? '—' : counts.audioTracks}
                color="bg-gradient-to-br from-cyan-500 to-blue-500"
                onClick={() => setActiveTab('audio')}
              />
              <StatCard
                icon={<Gift className="w-4 h-4 text-white" />}
                label="Bonuses"
                value={loadingCounts ? '—' : counts.bonuses}
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                onClick={() => setActiveTab('bonuses')}
              />
            </div>
          </motion.section>

          {/* Content Management Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Horizontal Scrollable Tabs */}
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex h-auto p-1.5 bg-muted/50 w-max min-w-full gap-1">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "relative flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap",
                          "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                          "transition-all duration-200"
                        )}
                      >
                        {tab.icon}
                        <span className="text-xs font-medium">{tab.label}</span>
                        {tab.badge !== undefined && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "h-5 min-w-5 px-1.5 text-[10px] font-bold text-white",
                              tab.badgeColor || "bg-muted-foreground"
                            )}
                          >
                            {loadingCounts ? '—' : tab.badge}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="h-1.5" />
                </ScrollArea>

                <div className="p-4">
                  <TabsContent value="sales" className="mt-0">
                    <AdminSalesTab />
                  </TabsContent>

                  <TabsContent value="scripts" className="mt-0">
                    <AdminScriptsTab onContentChanged={fetchCounts} />
                  </TabsContent>

                  <TabsContent value="videos" className="mt-0">
                    <AdminVideosTab onContentChanged={fetchCounts} />
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-0">
                    <AdminAnalyticsTab />
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-0">
                    <AdminNotificationsTab />
                  </TabsContent>

                  <TabsContent value="refunds" className="mt-0">
                    <AdminRefundsTab />
                  </TabsContent>

                  <TabsContent value="bonuses" className="mt-0">
                    <BonusesManagement onContentChanged={fetchCounts} />
                  </TabsContent>

                  <TabsContent value="moderation" className="mt-0">
                    <ModerationPanel />
                  </TabsContent>

                  <TabsContent value="system" className="mt-0">
                    <AdminSystemTab />
                  </TabsContent>

                  <TabsContent value="requests" className="mt-0">
                    <ScriptRequestsPanel />
                  </TabsContent>

                  <TabsContent value="audio" className="mt-0">
                    <AdminAudioTab />
                  </TabsContent>

                  <TabsContent value="programs" className="mt-0">
                    <AdminProgramsTab />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </motion.section>
        </div>

        {/* Floating Action Button for Quick Actions */}
        <AdminQuickActions
          onRefresh={fetchCounts}
          onSendNotification={() => setActiveTab('notifications')}
          onUploadScripts={() => setActiveTab('scripts')}
          onCreateBonus={() => setActiveTab('bonuses')}
        />
      </div>
    </MainLayout>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { AdminScriptsTab } from '@/components/Admin/AdminScriptsTab';
import { AdminVideosTab } from '@/components/Admin/AdminVideosTab';
import { AdminAnalyticsTab } from '@/components/Admin/AdminAnalyticsTab';
import { AdminNotificationsTab } from '@/components/Admin/AdminNotificationsTab';
import { AdminRefundsTab } from '@/components/Admin/AdminRefundsTab';
import { AdminBonusesTab } from '@/components/Admin/AdminBonusesTab';
import { AdminSystemTab } from '@/components/Admin/AdminSystemTab';
import { BonusesManagement } from '@/components/Admin/BonusesManagement';
import { ModerationPanel } from '@/components/Community/ModerationPanel';
import { ScriptRequestsPanel } from '@/components/Admin/ScriptRequestsPanel';
import { AdminAudioTab } from '@/components/Admin/AdminAudioTab';
import { AdminSalesTab } from '@/components/Admin/AdminSalesTab';
import { AdminQuickActions } from '@/components/Admin/AdminQuickActions';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  ShoppingCart
} from 'lucide-react';

interface TabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('sales');
  const [counts, setCounts] = useState({ 
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

  useEffect(() => {
    if (!user && !checking) {
      navigate('/auth');
    }
  }, [user, checking, navigate]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  if (checking) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-6xl animate-brain-pulse">🧠</div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
        </div>
      </MainLayout>
    );
  }

  const tabs: TabItem[] = [
    { 
      value: 'sales', 
      label: 'Sales', 
      icon: <ShoppingCart className="w-4 h-4" />,
      badge: counts.pendingAccounts > 0 ? counts.pendingAccounts : undefined,
      badgeColor: 'bg-red-500'
    },
    { 
      value: 'refunds', 
      label: 'Refunds', 
      icon: <DollarSign className="w-4 h-4" />,
      badge: counts.pendingRefunds > 0 ? counts.pendingRefunds : undefined,
      badgeColor: 'bg-yellow-500'
    },
    { 
      value: 'requests', 
      label: 'Requests', 
      icon: <MessageCircleHeart className="w-4 h-4" />,
      badge: counts.pendingRequests > 0 ? counts.pendingRequests : undefined,
      badgeColor: 'bg-cyan-500'
    },
    { 
      value: 'scripts', 
      label: 'Scripts', 
      icon: <Wand2 className="w-4 h-4" />,
      badge: counts.scripts
    },
    { 
      value: 'videos', 
      label: 'Videos', 
      icon: <Video className="w-4 h-4" />,
      badge: counts.videos
    },
    { 
      value: 'audio', 
      label: 'Audio', 
      icon: <Headphones className="w-4 h-4" />,
      badge: counts.audioTracks
    },
    { 
      value: 'bonuses', 
      label: 'Bonuses', 
      icon: <Gift className="w-4 h-4" />,
      badge: counts.bonuses
    },
    { 
      value: 'notifications', 
      label: 'Push', 
      icon: <Bell className="w-4 h-4" />
    },
    { 
      value: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      value: 'moderation', 
      label: 'Mod', 
      icon: <Shield className="w-4 h-4" />
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: <Settings className="w-4 h-4" />
    },
  ];

  return (
    <MainLayout>
      {/* Header Spacer for status bar */}
      <div className="w-full" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 12px)' }} />

      <div className="space-y-4 px-4 pb-8">
        {/* Compact Hero Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-pink-900/90 p-4 text-white shadow-lg">
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 text-xs">Manage NEP System</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        </div>

        {/* Quick Stats - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-emerald-500 rounded-md">
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Pending</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {loadingCounts ? '—' : counts.pendingAccounts}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-yellow-500 rounded-md">
                <DollarSign className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-yellow-900 dark:text-yellow-100">Refunds</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {loadingCounts ? '—' : counts.pendingRefunds}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-800/40 border-cyan-200 dark:border-cyan-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-cyan-500 rounded-md">
                <MessageCircleHeart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-cyan-900 dark:text-cyan-100">Requests</span>
            </div>
            <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
              {loadingCounts ? '—' : counts.pendingRequests}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-green-500 rounded-md">
                <Wand2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-900 dark:text-green-100">Scripts</span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {loadingCounts ? '—' : counts.scripts}
            </div>
          </Card>
        </div>

        {/* Content Management Tabs */}
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
            </div>
          </Tabs>
        </Card>

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

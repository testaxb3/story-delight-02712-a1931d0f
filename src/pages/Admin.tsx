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
import { EbookMarkdownFixer } from '@/components/Admin/EbookMarkdownFixer';
import { ModerationPanel } from '@/components/Community/ModerationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { supabase } from '@/integrations/supabase/client';
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
  Wrench
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('scripts');
  const [counts, setCounts] = useState({ scripts: 0, videos: 0, refunds: 0, bonuses: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const { user } = useAuth();
  const { isAdmin, checking } = useAdminStatus();
  const navigate = useNavigate();

  const fetchCounts = useCallback(async () => {
    setLoadingCounts(true);
    const tables = [
      { key: 'scripts', table: 'scripts' },
      { key: 'videos', table: 'videos' },
      { key: 'refunds', table: 'refund_requests' },
    ] as const;

    const results = await Promise.all(
      tables.map(async ({ table, key }) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`Failed to load ${table} count`, error);
          return { key, value: 0 } as const;
        }

        return { key, value: count ?? 0 } as const;
      })
    );

    // Get bonuses count from Supabase
    const { count: bonusesCount } = await supabase
      .from('bonuses')
      .select('*', { count: 'exact', head: true });

    setCounts(
      results.reduce(
        (acc, result) => ({ ...acc, [result.key]: result.value }),
        { scripts: 0, videos: 0, refunds: 0, bonuses: bonusesCount ?? 0 }
      )
    );
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

  const totalItems = counts.scripts + counts.videos + counts.refunds + counts.bonuses;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-pink-900/90 p-8 text-white shadow-xl dark:shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-100 text-sm">Manage your NEP System content</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-green-200 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-green-900 dark:text-green-100">NEP Scripts</div>
            </div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {loadingCounts ? '—' : counts.scripts}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40 border-orange-200 dark:border-orange-700 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-orange-900 dark:text-orange-100">Video Lessons</div>
            </div>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {loadingCounts ? '—' : counts.videos}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 border-purple-200 dark:border-purple-700 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-purple-900 dark:text-purple-100">Bonuses</div>
            </div>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {loadingCounts ? '—' : counts.bonuses}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40 border-red-200 dark:border-red-700 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-red-900 dark:text-red-100">Refunds</div>
            </div>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">
              {loadingCounts ? '—' : counts.refunds}
            </div>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Card className="border-none shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-8 w-full h-auto p-2 bg-muted/50">
              <TabsTrigger
                value="scripts"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Wand2 className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Scripts</span>
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    {loadingCounts ? '—' : counts.scripts}
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="videos"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Video className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Videos</span>
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    {loadingCounts ? '—' : counts.videos}
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <BarChart3 className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Analytics</span>
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Bell className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Notifications</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    Push
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="refunds"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <DollarSign className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Refunds</span>
                  <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                    {loadingCounts ? '—' : counts.refunds}
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="bonuses"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Gift className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Bonuses</span>
                  <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                    {loadingCounts ? '—' : counts.bonuses}
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="moderation"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Shield className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Moderation</span>
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="system"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Settings className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">System</span>
                  <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                    PWA
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="ebooks-fixer"
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md"
              >
                <Wrench className="w-5 h-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold">Fix Ebooks</span>
                </div>
              </TabsTrigger>

            </TabsList>

            <div className="p-6">
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
              
              <TabsContent value="ebooks-fixer" className="mt-0">
                <EbookMarkdownFixer />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
}

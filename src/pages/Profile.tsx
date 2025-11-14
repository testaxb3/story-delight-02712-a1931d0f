// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { MainLayout } from '@/components/Layout/MainLayout';
import { PWAInstallGuide } from '@/components/PWAInstallGuide';
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { QuickActionsGrid } from '@/components/Profile/QuickActionsGrid';
import { RecentActivityCard } from '@/components/Profile/RecentActivityCard';
import { ChildProfilesCard } from '@/components/Profile/ChildProfilesCard';
import { ProfileSettingsCard } from '@/components/Profile/ProfileSettingsCard';
import { ProfileActionsSection } from '@/components/Profile/ProfileActionsSection';
import { LevelBadge } from '@/components/Profile/LevelBadge';
import { AchievementsGallery } from '@/components/Profile/AchievementsGallery';
import { EnhancedStatsCard } from '@/components/Profile/EnhancedStatsCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useUserStats } from '@/hooks/useUserStats';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserInitials, getDisplayName } from '@/lib/profileUtils';

type StandaloneNavigator = Navigator & { standalone?: boolean };

export default function Profile() {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPWAGuide, setShowPWAGuide] = useState(false);
  const { childProfiles, activeChild, setActiveChild, refreshChildren } = useChildProfiles();
  const { isAdmin } = useAdminStatus();
  const [childName, setChildName] = useState(activeChild?.name ?? '');
  const [childAge, setChildAge] = useState<number | ''>(activeChild?.age ?? '');
  const [childChallenges, setChildChallenges] = useState(activeChild?.primary_challenges ?? '');
  const [savingChild, setSavingChild] = useState(false);
  const [refundStatus, setRefundStatus] = useState<{
    status: string;
    created_at: string;
  } | null>(null);

  // Use custom hooks
  const { stats, recentActivity, loading: loadingStats } = useUserStats(user?.id);

  // Early return if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-6xl animate-brain-pulse">🧠</div>
      </div>
    );
  }

  const nav = window.navigator as StandaloneNavigator;
  const isInstalled =
    window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;

  // Fetch refund status
  useEffect(() => {
    const fetchRefundStatus = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('refund_requests')
        .select('status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setRefundStatus(data);
      }
    };

    fetchRefundStatus();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success(t.auth.success.loggedOut);
    navigate('/auth');
  };

  const initials = useMemo(() => getUserInitials(user), [user]);
  const displayName = useMemo(() => getDisplayName(user), [user]);
  const currentBrain = activeChild?.brain_profile ?? 'INTENSE';

  // Show loading state while fetching stats
  if (loadingStats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl animate-brain-pulse">🧠</div>
            <p className="text-sm text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  useEffect(() => {
    setChildName(activeChild?.name ?? '');
    setChildAge(activeChild?.age ?? '');
    setChildChallenges(activeChild?.primary_challenges ?? '');
  }, [activeChild?.id, activeChild?.name, activeChild?.age, activeChild?.primary_challenges]);

  const handleChildNameUpdate = async () => {
    if (!activeChild?.id) return;
    const trimmed = childName.trim();
    if (!trimmed || trimmed === activeChild.name) return;

    setSavingChild(true);
    const { error } = await supabase
      .from('child_profiles')
      .update({ name: trimmed })
      .eq('id', activeChild.id);

    setSavingChild(false);

    if (error) {
      toast.error(t.profile.errors.updateNameFailed);
      return;
    }

    toast.success(t.profile.success.nameUpdated);
    await refreshChildren();
  };

  const handleChildInfoUpdate = async () => {
    if (!activeChild?.id) return;

    const updates: any = {};
    let hasChanges = false;

    if (childAge && childAge !== activeChild.age) {
      updates.age = typeof childAge === 'number' ? childAge : parseInt(childAge.toString());
      hasChanges = true;
    }

    const trimmedChallenges = childChallenges.trim();
    if (trimmedChallenges !== activeChild.primary_challenges) {
      updates.primary_challenges = trimmedChallenges || null;
      hasChanges = true;
    }

    if (!hasChanges) return;

    setSavingChild(true);
    const { error } = await supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', activeChild.id);

    setSavingChild(false);

    if (error) {
      toast.error('Failed to update child info');
      return;
    }

    toast.success('Child info updated!');
    await refreshChildren();
  };

  const handlePhotoUpdate = async () => {
    await refreshChildren();
    toast.success('Photo updated successfully!');
  };

  const handleUserPhotoUpdate = async () => {
    await refreshUser();
    toast.success('Profile photo updated!');
  };

  return (
    <MainLayout>
      <PWAInstallGuide open={showPWAGuide} onClose={() => setShowPWAGuide(false)} />
      
      {/* Compact Header */}
      <div className="mb-4">
        <ProfileHeader
          user={user}
          userInitials={initials}
          displayName={displayName}
          onPhotoUpdate={handleUserPhotoUpdate}
        />
      </div>

      {/* Tabs Navigation - Ultra compact */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-10 bg-muted/30 p-0.5 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Stats
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Key info only */}
        <TabsContent value="overview" className="space-y-4 mt-0">
          {/* Quick Stats Grid - Simplified */}
          <QuickActionsGrid
            scriptsUsed={stats.scriptsUsed}
            videosWatched={stats.videosWatched}
            postsCreated={stats.postsCreated}
          />

          {/* Level Badge - Gamification */}
          <Card className="p-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background border-primary/10">
            <LevelBadge 
              completedDays={stats.completedDays}
              scriptsUsed={stats.scriptsUsed}
            />
          </Card>

          {/* Child's Profile Card */}
          <ChildProfilesCard
            childProfiles={childProfiles}
            activeChild={activeChild}
            currentBrain={currentBrain}
            onSetActiveChild={setActiveChild}
          />

          {/* Recent Activity - Compact */}
          <RecentActivityCard activities={recentActivity.slice(0, 3)} />
        </TabsContent>

        {/* Stats Tab - All statistics */}
        <TabsContent value="stats" className="space-y-4 mt-0">
          {/* Enhanced Stats with Real Data */}
          <EnhancedStatsCard 
            completedDays={stats.completedDays}
            totalDays={30}
            scriptsUsed={stats.scriptsUsed}
            currentStreak={stats.currentStreak}
            avgStress={stats.avgStressLevel}
          />

          {/* Achievements Gallery - Gamified */}
          <AchievementsGallery stats={stats} />

          {/* Full Recent Activity */}
          <RecentActivityCard activities={recentActivity} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 mt-0">
          {/* Settings, Notifications, PWA, Refund */}
          <ProfileSettingsCard
            activeChild={activeChild}
            childName={childName}
            childAge={childAge}
            childChallenges={childChallenges}
            savingChild={savingChild}
            onChildNameChange={setChildName}
            onChildAgeChange={setChildAge}
            onChildChallengesChange={setChildChallenges}
            onChildNameUpdate={handleChildNameUpdate}
            onChildInfoUpdate={handleChildInfoUpdate}
            onPhotoUpdate={handlePhotoUpdate}
            refundStatus={refundStatus}
            isInstalled={isInstalled}
          />

          {/* Admin & Logout */}
          <ProfileActionsSection
            isAdmin={isAdmin}
            onLogout={handleLogout}
            logoutText={t.nav.logout}
            adminText={t.nav.adminPanel}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

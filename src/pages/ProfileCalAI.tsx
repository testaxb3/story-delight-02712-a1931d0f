import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Globe, Users, Target, 
  Megaphone, CreditCard,
  Shield,
  ChevronRight, Moon, 
  Bell, Lock, Zap, Check, GraduationCap
} from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { ChildProfilesModal } from '@/components/Profile/ChildProfilesModal';
import { LiveSupportModal } from '@/components/Profile/LiveSupportModal';
import { Headphones } from 'lucide-react';
import { notificationManager } from '@/lib/notifications';
import { registerPushSubscriptionWithRetry, unregisterPushSubscription, isOneSignalInitialized } from '@/lib/onesignal';

export default function ProfileCalAI() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdminStatus();
  const { triggerHaptic } = useHaptic();
  const navigate = useNavigate();
  const { childProfiles, activeChild, setActiveChild } = useChildProfiles();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Check notification permission status on mount
  useEffect(() => {
    if (notificationManager.isSupported()) {
      setNotificationsEnabled(notificationManager.getPermission() === 'granted');
    }
  }, []);

  const handleLogout = async () => {
    triggerHaptic('medium');
    await signOut();
    toast.success('See you soon!');
    navigate('/auth');
  };

  const getName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Parent';
  const getEmail = () => user?.email || '';
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  // Reusable "Apple Style" Row Component
  const SettingsRow = ({ 
    icon: Icon, 
    iconColor = "bg-blue-500", 
    label, 
    value, 
    onClick, 
    isDestructive = false,
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
    showChevron = true 
  }: {
    icon: any,
    iconColor?: string,
    label: string,
    value?: string | React.ReactNode,
    onClick?: () => void,
    isDestructive?: boolean,
    hasSwitch?: boolean,
    switchValue?: boolean,
    onSwitchChange?: (val: boolean) => void,
    showChevron?: boolean
  }) => {
    return (
      <motion.div 
        whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        onClick={!hasSwitch ? onClick : undefined}
        className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E] active:bg-gray-50 dark:active:bg-[#2C2C2E] cursor-pointer transition-colors min-h-[56px]"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={cn("text-[17px] font-medium truncate", isDestructive ? "text-red-500" : "text-gray-900 dark:text-white")}>
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-4 flex-shrink-0">
          {value && <span className="text-[17px] text-gray-500 dark:text-gray-400">{value}</span>}
          
          {hasSwitch ? (
            <Switch 
              checked={switchValue} 
              onCheckedChange={(checked) => {
                triggerHaptic('light');
                onSwitchChange?.(checked);
              }}
            />
          ) : (
            showChevron && <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      </motion.div>
    );
  };

  const SettingsGroup = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="mb-8">
      {title && (
        <h3 className="px-4 pb-2 text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32">
        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        {/* Hero Profile Card - Floating Style */}
        <div className="px-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight px-1">Profile</h1>
          
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profile/edit')}
            className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[22px] flex items-center gap-5 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
          >
            <Avatar className="w-20 h-20 border-2 border-white dark:border-[#2C2C2E] shadow-md">
              <AvatarImage src={user?.photo_url || undefined} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-medium">
                {getInitials(getName())}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{getName()}</h2>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 truncate">{getEmail()}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                <Crown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">NEP Member</span>
              </div>
            </div>
            
            <ChevronRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
          </motion.div>
        </div>

        <div className="px-4 max-w-3xl mx-auto">
          {/* Children Horizontal Scroll - "Family Sharing" Vibe */}
          <div className="mb-8">
            <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">My Family</h3>
              <button onClick={() => setChildModalOpen(true)} className="text-blue-500 text-[15px] font-medium">Manage</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {/* Children List */}
              {childProfiles.map((child) => (
                <motion.button
                  key={child.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveChild(child.id);
                  }}
                  className="flex flex-col items-center gap-2 min-w-[80px]"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full p-0.5 transition-all relative",
                    activeChild?.id === child.id 
                      ? "bg-gradient-to-b from-blue-500 to-purple-500 shadow-lg shadow-purple-500/20" 
                      : "bg-transparent"
                  )}>
                    <Avatar className="w-full h-full border-2 border-white dark:border-black">
                      <AvatarImage src={child.photo_url || undefined} />
                      <AvatarFallback className="bg-gray-100 dark:bg-[#2C2C2E] text-gray-600 dark:text-gray-300 text-lg">
                        {getInitials(child.name)}
                      </AvatarFallback>
                    </Avatar>
                    {activeChild?.id === child.id && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium truncate w-full text-center max-w-[80px]",
                    activeChild?.id === child.id ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-900 dark:text-white"
                  )}>
                    {child.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Premium Banner */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="mb-8 relative overflow-hidden rounded-2xl bg-black text-white p-6 shadow-xl cursor-pointer group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-purple-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-yellow-200 to-amber-500 bg-clip-text text-transparent">NEP Premium</h3>
                <p className="text-white/70 text-sm">Unlock unlimited scripts & insights</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-colors">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Settings Groups */}
          <SettingsGroup title="App Settings">
            <SettingsRow 
              icon={Moon} 
              iconColor="bg-indigo-500" 
              label="Dark Mode" 
              hasSwitch 
              switchValue={theme === 'dark'}
              onSwitchChange={toggleTheme}
            />
            <SettingsRow 
              icon={Bell} 
              iconColor="bg-red-500" 
              label="Notifications" 
              hasSwitch 
              switchValue={notificationsEnabled}
              onSwitchChange={async (checked) => {
                if (notificationsLoading) return;
                setNotificationsLoading(true);
                
                try {
                  if (checked) {
                    // Enable notifications
                    const granted = await notificationManager.requestPermission();
                    if (!granted) {
                      toast.error('Permission denied. Enable in browser settings.');
                      setNotificationsLoading(false);
                      return;
                    }
                    setNotificationsEnabled(true);
                    
                    // Register with OneSignal using retry mechanism
                    if (user?.profileId) {
                      if (!isOneSignalInitialized()) {
                        console.warn('[Profile] OneSignal not initialized - push notifications may not work');
                      }
                      
                      // Use retry mechanism for robust registration
                      const result = await registerPushSubscriptionWithRetry(user.profileId, 5, 2000);
                      
                      if (!result.success) {
                        console.error('[Profile] Push registration failed:', result.reason);
                        toast.warning('Local notifications enabled, but push notifications may not work.');
                      } else {
                        console.log('[Profile] Push registration successful, player ID:', result.playerId);
                      }
                    }
                    
                    await notificationManager.showNotification('Notifications Enabled!', {
                      body: "You'll receive reminders and updates.",
                      icon: '/icon-192.png'
                    });
                    toast.success('Notifications enabled!');
                  } else {
                    // Disable notifications
                    await notificationManager.unsubscribe();
                    if (user?.profileId) {
                      await unregisterPushSubscription(user.profileId);
                    }
                    setNotificationsEnabled(false);
                    toast.success('Notifications disabled');
                  }
                } catch (error) {
                  console.error('Notification toggle error:', error);
                  toast.error('Failed to update notifications');
                } finally {
                  setNotificationsLoading(false);
                }
              }}
            />
            <SettingsRow 
              icon={Globe} 
              iconColor="bg-blue-500" 
              label="Language" 
              value="English"
              onClick={() => {}} 
            />
          </SettingsGroup>

          <SettingsGroup title="Content">
            <SettingsRow 
              icon={Target} 
              iconColor="bg-green-500" 
              label="My Goals" 
              onClick={() => navigate('/tracker')} 
            />
            <SettingsRow 
              icon={Zap} 
              iconColor="bg-amber-500" 
              label="Achievements" 
              onClick={() => navigate('/achievements')} 
            />
            <SettingsRow 
              icon={Users} 
              iconColor="bg-purple-500" 
              label="Community Profile" 
              onClick={() => navigate('/community')} 
            />
          </SettingsGroup>

          <SettingsGroup title="Support">
            <SettingsRow 
              icon={GraduationCap} 
              iconColor="bg-indigo-500" 
              label="Scientific Methodology" 
              onClick={() => navigate('/methodology')} 
            />
            <SettingsRow 
              icon={Megaphone} 
              iconColor="bg-orange-500" 
              label="Request Script" 
              onClick={() => navigate('/script-requests')} 
            />
            <SettingsRow 
              icon={CreditCard} 
              iconColor="bg-green-500" 
              label="Request Refund" 
              onClick={() => navigate('/refund')} 
            />
            <SettingsRow 
              icon={Headphones} 
              iconColor="bg-blue-400" 
              label="Live Support" 
              onClick={() => setSupportModalOpen(true)} 
            />
            <SettingsRow 
              icon={Shield} 
              iconColor="bg-gray-500" 
              label="Privacy Policy" 
              onClick={() => navigate('/privacy')} 
            />
          </SettingsGroup>

          {isAdmin && (
            <SettingsGroup title="Admin">
              <SettingsRow 
                icon={Lock} 
                iconColor="bg-gray-800" 
                label="Admin Dashboard" 
                onClick={() => navigate('/admin')} 
              />
            </SettingsGroup>
          )}

          <div className="mt-8 mb-12">
            <button 
              onClick={handleLogout}
              className="w-full bg-white dark:bg-[#1C1C1E] text-red-500 font-medium py-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm active:bg-gray-50 dark:active:bg-[#2C2C2E] transition-colors"
            >
              Log Out
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">
              Version 2.4.0 • NEP System
            </p>
          </div>
        </div>
      </div>

      {/* Child Profiles Modal */}
      <ChildProfilesModal open={childModalOpen} onOpenChange={setChildModalOpen} />
      
      {/* Live Support Modal */}
      <LiveSupportModal open={supportModalOpen} onOpenChange={setSupportModalOpen} />
    </MainLayout>
  );
}
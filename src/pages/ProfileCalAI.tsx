import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Crown, UserPlus, CreditCard, Settings, 
  Globe, Users, Target, Flag, Clock, 
  Mail, Megaphone, RefreshCw, FileText, 
  Shield, Instagram, MessageCircle, Twitter,
  LogOut, UserX, ChevronRight, Moon, Sun, DollarSign
} from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ProfileCalAI() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdminStatus();
  const { triggerHaptic } = useHaptic();
  const navigate = useNavigate();
  const [lastSync] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const getName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };
  
  const getInitials = () => {
    const name = getName();
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
    showChevron = true,
    className = "",
    value
  }: {
    icon?: any;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    showChevron?: boolean;
    className?: string;
    value?: React.ReactNode;
  }) => {
    const handleClick = () => {
      triggerHaptic('light');
      onClick?.();
    };

    return (
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-between p-4 hover:bg-[#F9FAFB] dark:hover:bg-white/5 active:bg-[#F3F4F6] dark:active:bg-white/10 transition-colors group",
          className
        )}
      >
        <div className="flex items-center gap-4">
          {Icon && <Icon className="w-5 h-5 text-[#6B7280] dark:text-gray-400 group-hover:text-[#1A1A1A] dark:group-hover:text-white transition-colors" />}
          <div className="text-left">
            <p className="font-medium text-[#1A1A1A] dark:text-white text-[15px]">{title}</p>
            {subtitle && <p className="text-xs text-[#6B7280] dark:text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {value}
          {showChevron && <ChevronRight className="w-5 h-5 text-[#9CA3AF] dark:text-gray-600 group-hover:text-[#6B7280] dark:group-hover:text-gray-400 transition-colors" />}
        </div>
      </button>
    );
  };

  const SectionTitle = ({ children }: { children: string }) => (
    <h2 className="text-[13px] font-medium text-[#9CA3AF] dark:text-gray-500 px-4 mb-2 mt-6 uppercase tracking-wide">{children}</h2>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-background relative overflow-hidden pb-32">
        {/* Ambient Background Glows - Only Dark Mode */}
        <div className="hidden dark:block fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="hidden dark:block fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent dark:from-background dark:via-background dark:to-transparent pointer-events-none" />

        <div className="px-4 pt-[calc(env(safe-area-inset-top)+8px)] relative z-50">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-6 px-1">Profile</h1>

          {/* User Profile Card */}
          <Card
            onClick={() => {
              triggerHaptic('light');
              navigate('/profile/edit');
            }}
            className="mb-6 bg-white dark:bg-[#1C1C1E]/80 backdrop-blur-md border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#F9FAFB] dark:hover:bg-[#2C2C2E] transition-colors cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xl font-bold text-white shadow-inner ring-2 ring-black/20">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials()
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">{getName()}</h2>
                <p className="text-sm text-[#6B7280] dark:text-gray-500">@{getName().toLowerCase().replace(/\s/g, '')}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#9CA3AF] dark:text-gray-500" />
          </Card>

          {/* Premium Section - More Vibrant */}
          <SectionTitle>Premium</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-yellow-500/50 rounded-2xl overflow-hidden relative shadow-[0_2px_8px_rgba(234,179,8,0.12)] dark:shadow-[0_0_15px_rgba(234,179,8,0.15)] group hover:shadow-[0_4px_16px_rgba(234,179,8,0.2)] dark:hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
            <MenuItem
              icon={() => <Crown className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500/20 dark:fill-yellow-400/20" />}
              title="Try Premium for Free"
              subtitle="Unlock Cal AI free for 7 days"
              showChevron={true}
            />
          </Card>

          {/* Account Section */}
          <SectionTitle>Account</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-none rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2C2C2E] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-sm">
            {isAdmin && (
              <MenuItem
                icon={Shield}
                title="Admin Panel"
                onClick={() => navigate('/admin')}
              />
            )}
            <MenuItem
              icon={CreditCard}
              title="Personal Details"
              onClick={() => navigate('/profile/edit')}
            />
            <MenuItem
              icon={Settings}
              title="Preferences"
              onClick={toggleTheme}
              value={<span className="text-xs text-[#9CA3AF] dark:text-gray-500">{theme === 'dark' ? 'Dark' : 'Light'}</span>}
            />
            <MenuItem
              icon={Globe}
              title="Language"
              value={<span className="text-xs text-[#9CA3AF] dark:text-gray-500">English</span>}
            />
          </Card>

          {/* Goals & Tracking */}
          <SectionTitle>Goals & Tracking</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-none rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2C2C2E] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-sm">
            <MenuItem
              icon={Target}
              title="Edit Your Goals"
              onClick={() => navigate('/tracker')}
            />
            <MenuItem
              icon={Flag}
              title="Goals & Progress"
              onClick={() => navigate('/tracker')}
            />
          </Card>

          {/* Support & Legal */}
          <SectionTitle>Support & Legal</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-none rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2C2C2E] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-sm">
            <MenuItem
              icon={Megaphone}
              title="Request a Feature"
              onClick={() => navigate('/script-requests')}
            />
            <MenuItem
              icon={Mail}
              title="Support Email"
              onClick={() => window.location.href = 'mailto:support@nepsystem.pro'}
            />
            <MenuItem
              icon={RefreshCw}
              title="Sync Data"
              value={<span className="text-xs text-[#9CA3AF] dark:text-gray-500">Last sync: {lastSync}</span>}
              showChevron={false}
            />
            <MenuItem
              icon={FileText}
              title="Terms and Conditions"
              onClick={() => navigate('/terms')}
            />
            <MenuItem
              icon={Shield}
              title="Privacy Policy"
              onClick={() => navigate('/privacy')}
            />
          </Card>

          {/* Follow Us */}
          <SectionTitle>Follow Us</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-none rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2C2C2E] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-sm">
            <MenuItem
              icon={Instagram}
              title="Instagram"
              onClick={() => window.open('https://instagram.com', '_blank')}
            />
            <MenuItem
              icon={MessageCircle}
              title="TikTok"
              onClick={() => window.open('https://tiktok.com', '_blank')}
            />
            <MenuItem
              icon={Twitter}
              title="X"
              onClick={() => window.open('https://twitter.com', '_blank')}
            />
          </Card>

          {/* Account Actions */}
          <SectionTitle>Account Actions</SectionTitle>
          <Card className="mb-6 bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-none rounded-2xl overflow-hidden divide-y divide-[#E5E7EB] dark:divide-[#2C2C2E] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-sm">
            <MenuItem
              icon={LogOut}
              title="Logout"
              onClick={handleLogout}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
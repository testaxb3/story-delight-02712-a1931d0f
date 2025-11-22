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
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ProfileCalAI() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdminStatus();
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

  const MenuItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onClick, 
    showChevron = true,
    className = ""
  }: { 
    icon: any; 
    title: string; 
    subtitle?: string; 
    onClick?: () => void;
    showChevron?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 hover:bg-muted/5 active:bg-muted/10 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/80" />
        <div className="text-left">
          <p className="font-medium text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {showChevron && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );

  const SectionTitle = ({ children }: { children: string }) => (
    <h2 className="text-sm font-medium text-muted-foreground px-4 mb-3 mt-6">{children}</h2>
  );

  return (
    <MainLayout>
      <div className="pb-24 px-4 pt-4">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">Profile</h1>

        {/* User Name Card */}
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a]">
          <MenuItem
            icon={User}
            title="Tap to set name"
            subtitle="and username"
            onClick={() => navigate('/profile/edit')}
          />
        </Card>

        {/* Premium Section */}
        <SectionTitle>Premium</SectionTitle>
        <Card className="mb-4 overflow-hidden border-2 border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
          <MenuItem
            icon={Crown}
            title="Try Premium for Free"
            subtitle="Unlock NEP System free for 7 days"
            className="hover:bg-accent/5"
          />
        </Card>

        {/* Invite Friends */}
        <SectionTitle>Invite Friends</SectionTitle>
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a]">
          <MenuItem
            icon={UserPlus}
            title="Refer a friend and earn $10"
            subtitle="Earn $10 per friend that signs up with your promo code."
            onClick={() => navigate('/referral')}
          />
        </Card>

        {/* Account Section */}
        <SectionTitle>Account</SectionTitle>
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] divide-y divide-[#2a2a2a]">
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
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/5 active:bg-muted/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-foreground/80" />
              ) : (
                <Sun className="w-5 h-5 text-foreground/80" />
              )}
              <div className="text-left">
                <p className="font-medium text-foreground">Preferences</p>
                <p className="text-xs text-muted-foreground">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>

        {/* Goals & Tracking */}
        <SectionTitle>Goals & Tracking</SectionTitle>
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] divide-y divide-[#2a2a2a]">
          <MenuItem
            icon={Target}
            title="Edit Your Goals"
            onClick={() => navigate('/tracker')}
          />
          <MenuItem
            icon={Flag}
            title="Goals & Progress"
            subtitle="Track your child's development"
            onClick={() => navigate('/tracker')}
          />
          <MenuItem
            icon={Clock}
            title="History"
            subtitle="View past progress"
            onClick={() => navigate('/tracker')}
          />
        </Card>

        {/* Widgets Section */}
        <SectionTitle>Widgets</SectionTitle>
        <div className="flex items-center justify-between mb-3 px-4">
          <span className="text-sm text-muted-foreground">How to add?</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="aspect-square p-4 flex flex-col items-center justify-center bg-[#1a1a1a] border-[#2a2a2a]">
            <p className="text-3xl font-bold">11</p>
            <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
          </Card>
          <Card className="aspect-square p-4 flex flex-col items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <div className="text-4xl mb-1">🔥</div>
            <p className="text-3xl font-bold text-accent">0</p>
          </Card>
          <Card className="aspect-square p-4 flex flex-col items-center justify-center bg-[#1a1a1a] border-[#2a2a2a]">
            <p className="text-3xl font-bold">5</p>
            <p className="text-xs text-muted-foreground mt-1">Scripts Used</p>
          </Card>
        </div>

        {/* Support & Legal */}
        <SectionTitle>Support & Legal</SectionTitle>
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] divide-y divide-[#2a2a2a]">
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
            icon={DollarSign}
            title="Request Refund"
            onClick={() => navigate('/refund-request')}
          />
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/5"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-foreground/80" />
              <div className="text-left">
                <p className="font-medium text-foreground">Sync Data</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Last sync: {lastSync}</span>
          </button>
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
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] divide-y divide-[#2a2a2a]">
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
        <Card className="mb-4 overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] divide-y divide-[#2a2a2a]">
          <MenuItem
            icon={LogOut}
            title="Logout"
            onClick={handleLogout}
          />
          <MenuItem
            icon={UserX}
            title="Delete Account"
            onClick={() => navigate('/profile/delete')}
            className="text-destructive"
          />
        </Card>
      </div>
    </MainLayout>
  );
}

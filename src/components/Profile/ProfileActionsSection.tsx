import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileActionsSectionProps {
  isAdmin: boolean;
  onLogout: () => Promise<void>;
  logoutText: string;
  adminText: string;
}

export function ProfileActionsSection({
  isAdmin,
  onLogout,
  logoutText,
  adminText,
}: ProfileActionsSectionProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Admin Access */}
      {isAdmin && (
        <Button
          variant="outline"
          className="w-full animate-in fade-in slide-in-from-bottom-10 duration-500 dark:border-slate-600 dark:hover:bg-slate-800/60 transition-all"
          onClick={() => navigate('/admin')}
        >
          {adminText}
        </Button>
      )}

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full animate-in fade-in slide-in-from-bottom-11 duration-500 transition-all"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {logoutText}
      </Button>
    </>
  );
}

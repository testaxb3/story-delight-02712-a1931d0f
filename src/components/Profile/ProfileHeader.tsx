// @ts-nocheck
import { Card } from '@/components/ui/card';
import { UserPhotoUpload } from '@/components/UserPhotoUpload';
import type { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  user: User | null;
  userInitials: string;
  displayName: string;
  onPhotoUpdate: () => Promise<void>;
}

export function ProfileHeader({
  user,
  userInitials,
  displayName,
  onPhotoUpdate,
}: ProfileHeaderProps) {
  return (
    <Card className="p-6 glass border-none shadow-lg text-center animate-in fade-in slide-in-from-top-3 duration-500 transition-all">
      {user && (
        <UserPhotoUpload
          currentPhotoUrl={user.photo_url}
          userId={user.profileId || user.id}
          userInitials={userInitials}
          onUploadComplete={onPhotoUpdate}
          className="mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
        {displayName}
      </h1>
      <p className="text-muted-foreground mb-2">{user?.email}</p>
      {user?.premium && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-900/90 dark:to-pink-900/90 text-white font-semibold text-sm shadow-lg animate-in zoom-in duration-300 delay-200 dark:shadow-purple-500/20 transition-all">
          <span className="text-lg">👑</span>
          Premium Member
        </div>
      )}
    </Card>
  );
}

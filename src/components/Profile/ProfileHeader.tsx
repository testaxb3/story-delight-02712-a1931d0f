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
    <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl text-center animate-in fade-in slide-in-from-top-3 duration-500">
      {user && (
        <UserPhotoUpload
          currentPhotoUrl={user.photo_url}
          userId={user.profileId || user.id}
          userInitials={userInitials}
          onUploadComplete={onPhotoUpdate}
          className="mb-6"
        />
      )}
      <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {displayName}
      </h1>
      <p className="text-muted-foreground text-base mb-4">{user?.email}</p>
      {user?.premium && (
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-2xl animate-in zoom-in duration-300 delay-200 hover:scale-105 transition-transform">
          <span className="text-xl">👑</span>
          Premium Member
        </div>
      )}
    </Card>
  );
}

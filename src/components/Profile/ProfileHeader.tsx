// @ts-nocheck
import { Card } from '@/components/ui/card';
import { UserPhotoUpload } from '@/components/UserPhotoUpload';

type User = {
  id: string;
  email?: string;
  profileId?: string;
  photo_url?: string | null;
  premium?: boolean;
};

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
    <Card className="p-4 md:p-6 border-border/30 bg-card/30 backdrop-blur-sm text-center">
      {user && (
        <UserPhotoUpload
          currentPhotoUrl={user.photo_url}
          userId={user.profileId || user.id}
          userInitials={userInitials}
          onUploadComplete={onPhotoUpdate}
          className="mb-3"
        />
      )}
      <h1 className="text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {displayName}
      </h1>
      <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
      {user?.premium && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-xs shadow-lg">
          <span className="text-base">👑</span>
          Premium
        </div>
      )}
    </Card>
  );
}

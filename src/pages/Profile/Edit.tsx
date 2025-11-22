import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Check, X, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [originalUsername, setOriginalUsername] = useState('');

  useEffect(() => {
    if (user?.profileId) {
      fetchProfile();
    }
  }, [user?.profileId]);

  const fetchProfile = async () => {
    if (!user?.profileId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, username, bio, photo_url')
        .eq('id', user.profileId)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || '');
        setUsername(data.username || '');
        setOriginalUsername(data.username || '');
        setBio(data.bio || '');
        setPhotoUrl(data.photo_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.profileId) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.profileId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);

      setPhotoUrl(urlData.publicUrl);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      return;
    }

    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    if (username === originalUsername) {
      setUsernameStatus('available');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        setUsernameStatus('available');
      } else if (data) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, originalUsername]);

  const getUsernameHelper = () => {
    if (!username) {
      return {
        text: 'This will be your unique identifier in communities',
        color: 'text-gray-400',
        icon: null,
      };
    }

    if (usernameStatus === 'invalid') {
      return {
        text: '✗ Only lowercase letters, numbers and underscore allowed (min 3 chars)',
        color: 'text-red-500',
        icon: <X className="w-4 h-4 text-red-500" />,
      };
    }

    if (usernameStatus === 'checking') {
      return {
        text: 'Checking availability...',
        color: 'text-gray-400',
        icon: <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />,
      };
    }

    if (usernameStatus === 'available') {
      return {
        text: '✓ Username available',
        color: 'text-green-500',
        icon: <Check className="w-4 h-4 text-green-500" />,
      };
    }

    if (usernameStatus === 'taken') {
      return {
        text: '✗ Username already taken',
        color: 'text-red-500',
        icon: <X className="w-4 h-4 text-red-500" />,
      };
    }

    return {
      text: 'This will be your unique identifier in communities',
      color: 'text-gray-400',
      icon: null,
    };
  };

  const handleSave = async () => {
    if (!user?.profileId) {
      toast.error('You must be signed in to edit your profile');
      return;
    }

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking') {
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          bio: bio.trim() || null,
          photo_url: photoUrl || null,
        })
        .eq('id', user.profileId);

      if (error) throw error;

      toast.success('Profile updated successfully');
      navigate('/community');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="dark:hover:bg-slate-800/60 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold dark:text-slate-100">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Update your public profile information</p>
          </div>
        </div>

        <Card className="p-6 space-y-6 glass border-none shadow-lg transition-all">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-700 shadow-lg transition-colors">
                <AvatarImage src={photoUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 dark:from-primary/90 dark:to-purple-700 text-white text-4xl transition-colors">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-primary dark:bg-primary/90 text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors shadow-lg dark:shadow-primary/20"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">This is how other users will see you</p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              maxLength={20}
            />
            <div className="flex items-center gap-2">
              {getUsernameHelper().icon}
              <p className={`text-xs ${getUsernameHelper().color}`}>
                {getUsernameHelper().text}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)} className="dark:border-slate-600 dark:hover:bg-slate-800/60 transition-colors">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={
                saving || 
                uploading || 
                !name.trim() || 
                !username.trim() || 
                usernameStatus === 'taken' || 
                usernameStatus === 'invalid' || 
                usernameStatus === 'checking'
              } 
              className="gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

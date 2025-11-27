import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [originalUsername, setOriginalUsername] = useState('');

  useEffect(() => {
    if (user?.profileId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user?.profileId]);

  const fetchProfile = async () => {
    if (!user?.profileId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, username, photo_url')
        .eq('id', user.profileId)
        .single();

      if (error) throw error;

      if (data) {
        const nameParts = (data.name || '').split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setUsername(data.username || '');
        setOriginalUsername(data.username || '');
        setPhotoUrl(data.photo_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.profileId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.profileId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

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

  const getUsernameIcon = () => {
    if (usernameStatus === 'checking') {
      return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
    }
    if (usernameStatus === 'available') {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
      return <X className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const handleSave = async () => {
    console.log('=== EDIT PROFILE SAVE DEBUG ===');
    
    // Get fresh auth user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    console.log('Auth User:', authUser);
    console.log('Auth Error:', authError);
    console.log('Context User:', user);
    console.log('Context User Profile ID:', user?.profileId);
    
    if (authError || !authUser) {
      console.error('Auth error:', authError);
      toast.error('You must be signed in to edit your profile');
      return;
    }

    if (!firstName.trim()) {
      console.error('Missing firstName');
      toast.error('First name is required');
      return;
    }

    if (!username.trim()) {
      console.error('Missing username');
      toast.error('Username is required');
      return;
    }

    if (usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking') {
      console.error('Invalid username status:', usernameStatus);
      return;
    }

    setSaving(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      const updateData = {
        name: fullName,
        username: username.trim().toLowerCase(),
        photo_url: photoUrl || null,
        community_onboarding_completed: true,
      };
      
      console.log('Data to update:', updateData);
      console.log('Updating profile with auth.uid():', authUser.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', authUser.id)
        .select();

      console.log('Update response - data:', data);
      console.log('Update response - error:', error);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Profile updated successfully, refreshing user...');
      
      // Invalidate all related queries to force fresh data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['child-profiles'] });
      
      // Wait for queries to refetch
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await refreshUser();
      
      toast.success('Profile updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error as any)?.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (firstName || lastName) {
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const canContinue = 
    firstName.trim() &&
    username.trim() &&
    (usernameStatus === 'available' || username === originalUsername) &&
    usernameStatus !== 'checking' &&
    usernameStatus !== 'invalid';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] px-4 pb-4 bg-[#0d0d0d]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#333] transition-colors relative z-10"
          >
            <ArrowLeft className="w-5 h-5 pointer-events-none" />
          </button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-[calc(env(safe-area-inset-top)+80px)] pb-[calc(env(safe-area-inset-bottom)+100px)] px-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute top-0 right-0 w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Pencil className="w-4 h-4 text-black" />
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
          <p className="text-sm text-gray-400">
            {uploading ? 'Uploading...' : 'Change Photo'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=" "
              className="peer w-full h-14 px-4 bg-transparent border border-[#333] rounded-xl text-white focus:outline-none focus:border-gray-500 transition-colors"
            />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=" "
              className="peer w-full h-14 px-4 bg-transparent border border-[#333] rounded-xl text-white focus:outline-none focus:border-gray-500 transition-colors"
            />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Last Name
            </label>
          </div>

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder=" "
              disabled={!!originalUsername}
              className="peer w-full h-14 px-4 pr-12 bg-transparent border border-[#333] rounded-xl text-white focus:outline-none focus:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Username
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {originalUsername ? (
                <span className="text-xs text-gray-500">Permanent</span>
              ) : (
                getUsernameIcon()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-[#0d0d0d]">
        <Button
          onClick={handleSave}
          disabled={!canContinue || saving || uploading}
          className="w-full h-14 bg-white text-black rounded-[30px] font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

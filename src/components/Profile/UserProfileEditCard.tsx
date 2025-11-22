import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export function UserProfileEditCard() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({ name: '', username: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, username, bio')
      .eq('id', user.id)
      .single();

    if (profile) {
      const profileData = {
        name: profile.name || '',
        username: profile.username || '',
        bio: profile.bio || '',
      };
      setName(profileData.name);
      setUsername(profileData.username);
      setBio(profileData.bio);
      setOriginalData(profileData);
    }
    setLoading(false);
  };

  useEffect(() => {
    const changed = 
      name !== originalData.name ||
      username !== originalData.username ||
      bio !== originalData.bio;
    setHasChanges(changed);
  }, [name, username, bio, originalData]);

  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    // If username hasn't changed, don't check availability
    if (username === originalData.username) {
      setUsernameStatus('available');
      return;
    }

    // Debounce username availability check
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, username is available
        setUsernameStatus('available');
      } else if (data) {
        // Username already exists
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, originalData.username]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive",
      });
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
        })
        .eq('id', user.id);

      if (error) throw error;

      setOriginalData({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
      });
      await refreshUser();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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

  const usernameHelper = getUsernameHelper();
  const canSave = 
    hasChanges &&
    name.trim() &&
    username.trim() &&
    (usernameStatus === 'available' || username === originalData.username) &&
    usernameStatus !== 'checking' &&
    usernameStatus !== 'invalid';

  if (loading) {
    return (
      <Card className="p-6 glass border-none shadow-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass border-none shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-500 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 dark:text-slate-300" />
        <h2 className="text-lg font-semibold dark:text-slate-100">Edit Profile</h2>
      </div>

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="user-name" className="block text-sm font-medium mb-2 dark:text-slate-300">
            Name *
          </label>
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full h-12 px-4 bg-transparent border border-[#333] dark:border-gray-600 rounded-xl text-foreground focus:outline-none focus:border-gray-500 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            This is how other users will see you
          </p>
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2 dark:text-slate-300">
            Username *
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="Choose a unique username"
            className="w-full h-12 px-4 bg-transparent border border-[#333] dark:border-gray-600 rounded-xl text-foreground focus:outline-none focus:border-gray-500 transition-colors"
          />
          <div className="flex items-center gap-2 mt-1.5">
            {usernameHelper.icon}
            <p className={`text-xs ${usernameHelper.color}`}>
              {usernameHelper.text}
            </p>
          </div>
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2 dark:text-slate-300">
            Bio
          </label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            placeholder="Tell us about yourself..."
            maxLength={200}
            className="min-h-[80px] bg-transparent border border-[#333] dark:border-gray-600 rounded-xl text-foreground focus:outline-none focus:border-gray-500 transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {bio.length}/200
          </p>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </Card>
  );
}

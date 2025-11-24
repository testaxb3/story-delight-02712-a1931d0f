import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Crown, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  name: string;
  username: string | null;
  photo_url: string | null;
  brain_profile: string | null;
}

export default function MembersList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state?.communityId;

  const [members, setMembers] = useState<Member[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (communityId && user?.profileId) {
      loadMembers();
      checkLeaderStatus();
    }
  }, [communityId, user?.profileId]);

  const loadMembers = async () => {
    if (!communityId) {
      console.log('MembersList: No communityId provided');
      return;
    }

    console.log('MembersList: Loading members for community:', communityId);
    setLoading(true);

    // Use RPC function to avoid PostgREST relationship cache issues
    const { data, error } = await supabase.rpc('get_community_members', {
      p_community_id: communityId
    });

    if (error) {
      console.error('MembersList: Error loading members:', error);
      toast.error('Failed to load members');
    } else if (data) {
      console.log('MembersList: Loaded members:', data);
      setMembers(data as any);
    }

    setLoading(false);
  };

  const checkLeaderStatus = async () => {
    if (!communityId || !user?.profileId) return;

    const { data } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', user.profileId)
      .maybeSingle();

    setIsLeader(data?.role === 'leader');
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user?.profileId) {
      toast.error("You can't remove yourself");
      return;
    }

    const confirmed = confirm('Are you sure you want to remove this member?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    } else {
      toast.success('Member removed');
      loadMembers();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBrainProfileColor = (profile: string | null) => {
    switch (profile) {
      case 'INTENSE':
        return 'from-orange-500 to-orange-600';
      case 'DISTRACTED':
        return 'from-blue-500 to-blue-600';
      case 'DEFIANT':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0d0d0d] text-[#1A1A1A] dark:text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)] px-4 pb-4 bg-[#F8F9FA] dark:bg-[#0d0d0d] border-b border-[#E5E7EB] dark:border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2a2a2a] flex items-center justify-center hover:bg-[#F3F4F6] dark:hover:bg-[#333] transition-colors shadow-sm dark:shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Members</h1>
            <p className="text-sm text-[#6B7280] dark:text-gray-400">{members.length} members</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-[calc(env(safe-area-inset-top)+100px)] pb-[calc(env(safe-area-inset-bottom)+20px)] px-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280] dark:text-gray-400">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280] dark:text-gray-400">No members yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3 shadow-sm dark:shadow-none"
              >
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => navigate(`/user/${member.user_id}`)}
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getBrainProfileColor(member.brain_profile)} flex items-center justify-center font-bold text-white overflow-hidden cursor-pointer transition-transform hover:scale-105`}
                  >
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(member.name || 'U')
                    )}
                  </button>
                  {member.role === 'leader' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-sm">
                      <Crown className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-[#1A1A1A] dark:text-white">{member.name || 'User'}</p>
                  {member.username && (
                    <p className="text-sm text-[#6B7280] dark:text-gray-400 truncate">@{member.username}</p>
                  )}
                  {member.brain_profile && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
                      {member.brain_profile}
                    </span>
                  )}
                </div>

                {isLeader && member.role !== 'leader' && (
                  <button
                    onClick={() => handleRemoveMember(member.id, member.user_id)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

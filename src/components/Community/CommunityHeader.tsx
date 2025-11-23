import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Community {
  id: string;
  name: string;
  logo_emoji: string | null;
  logo_url: string | null;
  invite_code: string;
}

interface CommunityHeaderProps {
  communities: Community[];
  currentCommunity: Community | null;
  memberCount: number;
  onCommunityChange: (community: Community) => void;
}

export const CommunityHeader = React.memo(function CommunityHeader({
  communities,
  currentCommunity,
  memberCount,
  onCommunityChange,
}: CommunityHeaderProps) {
  const navigate = useNavigate();

  const handleMembersClick = useCallback(() => {
    navigate('/community/members', { state: { communityId: currentCommunity?.id } });
  }, [navigate, currentCommunity?.id]);

  const handleJoinClick = useCallback(() => {
    navigate('/community/join');
  }, [navigate]);

  const handleCreateClick = useCallback(() => {
    navigate('/community/create');
  }, [navigate]);

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 px-4 py-4"
    >
      <div className="relative z-50 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-2">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity px-2">
              {currentCommunity?.logo_url ? (
                <img 
                  src={currentCommunity.logo_url} 
                  alt="" 
                  className="w-10 h-10 rounded-full ring-2 ring-orange-500/20" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl shadow-lg">
                  {currentCommunity?.logo_emoji || '💪'}
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="font-bold text-base text-white">
                  {currentCommunity?.name || 'Select Community'}
                </span>
                <span className="text-xs text-white/60">
                  {memberCount} members
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {communities.map((community) => (
                <DropdownMenuItem
                  key={community.id}
                  onClick={() => onCommunityChange(community)}
                  className="flex items-center gap-2"
                >
                  {community.logo_url ? (
                    <img src={community.logo_url} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm">
                      {community.logo_emoji}
                    </div>
                  )}
                  <span className="flex-1">{community.name}</span>
                  {currentCommunity?.id === community.id && (
                    <Check className="w-4 h-4" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleJoinClick}>
                Join Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateClick}>
                Create Community
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMembersClick}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <Users className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

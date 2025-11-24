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
      className="sticky top-0 z-50 px-4 pt-2 pb-2 flex items-center justify-between gap-3"
    >
      <div className="flex-1 flex justify-center pl-12"> {/* Added padding to offset the right button and center the pill visually if needed, or just flex-1 */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-transparent dark:border-white/10 rounded-full shadow-md px-4 py-2 flex items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              {currentCommunity?.logo_url ? (
                <img
                  src={currentCommunity.logo_url}
                  alt=""
                  className="w-8 h-8 rounded-full ring-2 ring-orange-500/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm shadow-sm text-white">
                  {currentCommunity?.logo_emoji || '💪'}
                </div>
              )}
              <span className="font-bold text-sm text-[#1A1A1A] dark:text-white leading-tight truncate max-w-[150px]">
                {currentCommunity?.name || 'Select Community'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#6B7280] dark:text-white/60" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-64 mt-2">
            {communities.map((community) => (
              <DropdownMenuItem
                key={community.id}
                onClick={() => onCommunityChange(community)}
                className="flex items-center gap-2"
              >
                {community.logo_url ? (
                  <img src={community.logo_url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm text-white">
                    {community.logo_emoji}
                  </div>
                )}
                <span className="flex-1 truncate">{community.name}</span>
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
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleMembersClick}
        className="w-12 h-12 rounded-full bg-white dark:bg-white/10 backdrop-blur-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform active:scale-95 flex-shrink-0"
      >
        <Users className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
      </motion.button>
    </motion.div>
  );
});

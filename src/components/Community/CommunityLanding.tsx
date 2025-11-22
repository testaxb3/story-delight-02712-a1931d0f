import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Star, Users as UsersIcon, Home, Sparkles } from 'lucide-react';

interface CommunityLandingProps {
  onCreateCommunity: () => void;
  onJoinCommunity: () => void;
}

// Placeholder community image cards for hero section
const COMMUNITY_IMAGES = [
  {
    id: '1',
    gradient: 'from-purple-500 to-purple-600',
    icon: Heart,
    author: 'Maria S.',
    initials: 'MS',
    profile: 'INTENSE',
  },
  {
    id: '2',
    gradient: 'from-orange-500 to-orange-600',
    icon: Brain,
    author: 'John D.',
    initials: 'JD',
    profile: 'DEFIANT',
  },
  {
    id: '3',
    gradient: 'from-blue-500 to-blue-600',
    icon: Star,
    author: 'Sarah M.',
    initials: 'SM',
    profile: 'DISTRACTED',
  },
  {
    id: '4',
    gradient: 'from-pink-500 to-pink-600',
    icon: UsersIcon,
    author: 'Mike L.',
    initials: 'ML',
    profile: 'INTENSE',
  },
  {
    id: '5',
    gradient: 'from-green-500 to-green-600',
    icon: Home,
    author: 'Anna K.',
    initials: 'AK',
    profile: 'DEFIANT',
  },
  {
    id: '6',
    gradient: 'from-yellow-500 to-yellow-600',
    icon: Sparkles,
    author: 'Tom R.',
    initials: 'TR',
    profile: 'DISTRACTED',
  },
];

export function CommunityLanding({ onCreateCommunity, onJoinCommunity }: CommunityLandingProps) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Top Section - Image Grid (55% of viewport to ensure buttons visible) */}
      <div className="h-[55vh] relative overflow-hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        {/* Grid of placeholder images with variable heights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2 h-full">
          {COMMUNITY_IMAGES.map((item, index) => {
            const IconComponent = item.icon;
            // First row cards are taller
            const isFirstRow = index < 2;
            return (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  isFirstRow ? 'row-span-2' : ''
                }`}
              >
                {/* Gradient background with icon */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <IconComponent className="w-16 h-16 text-white/20" />
                </div>
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* User info at bottom */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Avatar className="w-8 h-8 ring-2 ring-white/20">
                    <AvatarFallback className="bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-xs font-medium drop-shadow-lg">
                      {item.author}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5 bg-black/40 text-white border-white/20 backdrop-blur-sm"
                    >
                      {item.profile}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - Content and CTAs (45% of viewport) */}
      <div className="flex-1 bg-[#0d0d0d] flex flex-col items-center justify-center px-6 py-8 pb-safe">
        <div className="max-w-md w-full text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white leading-tight">
            Parenting is easier together 💪
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 mb-8">
            Join a community and see how other parents are using NEP scripts
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={onCreateCommunity}
              className="w-full h-14 text-base bg-white text-black hover:bg-white/90 rounded-full font-medium"
            >
              Create New Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onJoinCommunity}
              className="w-full h-14 text-base bg-transparent border-2 border-gray-600 text-white hover:bg-white/5 hover:border-gray-500 rounded-full font-medium"
            >
              Join Existing Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

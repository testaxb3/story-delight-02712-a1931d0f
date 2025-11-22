import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface CommunityLandingProps {
  onCreateCommunity: () => void;
  onJoinCommunity: () => void;
}

// Mock posts data for landing page
const MOCK_POSTS = [
  {
    id: '1',
    author: 'Maria',
    initials: 'M',
    profile: 'INTENSE',
    content: 'Just used the bedtime script with amazing results! My son fell asleep in 15 minutes instead of 2 hours 🎉',
  },
  {
    id: '2',
    author: 'John',
    initials: 'J',
    profile: 'DEFIANT',
    content: 'The tantrum script really works! We had our first peaceful grocery trip in months.',
  },
  {
    id: '3',
    author: 'Sarah',
    initials: 'S',
    profile: 'DISTRACTED',
    content: 'Morning routine script changed our lives. No more rushing and stress!',
  },
  {
    id: '4',
    author: 'Mike',
    initials: 'M',
    profile: 'INTENSE',
    content: 'Thank you for the screen time script. The meltdowns are finally manageable.',
  },
];

export function CommunityLanding({ onCreateCommunity, onJoinCommunity }: CommunityLandingProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Parenting is easier together 💪
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Join a community and see how other parents are using NEP scripts
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={onCreateCommunity}
              className="flex-1 bg-transparent border-2 border-white/20 text-white hover:bg-white/10"
            >
              Create New Community
            </Button>
            <Button
              size="lg"
              onClick={onJoinCommunity}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              Join Existing Community
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_POSTS.map((post) => (
            <Card
              key={post.id}
              className="p-5 bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{post.author}</p>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/20"
                  >
                    {post.profile}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-3">{post.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

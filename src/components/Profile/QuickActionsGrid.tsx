import { Card } from '@/components/ui/card';
import { BookOpen, Video, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  gradient: string;
  iconGradient: string;
  textColor: string;
  subtitleColor: string;
  blur: string;
}

interface QuickActionsGridProps {
  scriptsUsed: number;
  videosWatched: number;
  postsCreated: number;
}

const QUICK_ACTIONS: Omit<QuickAction, 'subtitle'>[] = [
  {
    id: 'scripts',
    title: 'Browse Scripts',
    icon: BookOpen,
    path: '/scripts',
    gradient: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30',
    iconGradient: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
    textColor: 'text-purple-900 dark:text-purple-100',
    subtitleColor: 'text-purple-700 dark:text-purple-300',
    blur: 'bg-purple-500/10 dark:bg-purple-400/20',
  },
  {
    id: 'videos',
    title: 'Watch Videos',
    icon: Video,
    path: '/videos',
    gradient: 'from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30',
    iconGradient: 'from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700',
    textColor: 'text-pink-900 dark:text-pink-100',
    subtitleColor: 'text-pink-700 dark:text-pink-300',
    blur: 'bg-pink-500/10 dark:bg-pink-400/20',
  },
  {
    id: 'tracker',
    title: 'My Plan',
    icon: Calendar,
    path: '/tracker',
    gradient: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30',
    iconGradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    textColor: 'text-blue-900 dark:text-blue-100',
    subtitleColor: 'text-blue-700 dark:text-blue-300',
    blur: 'bg-blue-500/10 dark:bg-blue-400/20',
  },
  {
    id: 'community',
    title: 'Community',
    icon: MessageSquare,
    path: '/community',
    gradient: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30',
    iconGradient: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    textColor: 'text-green-900 dark:text-green-100',
    subtitleColor: 'text-green-700 dark:text-green-300',
    blur: 'bg-green-500/10 dark:bg-green-400/20',
  },
];

export function QuickActionsGrid({
  scriptsUsed,
  videosWatched,
  postsCreated,
}: QuickActionsGridProps) {
  const navigate = useNavigate();

  const getSubtitle = (id: string): string => {
    switch (id) {
      case 'scripts':
        return `${scriptsUsed} used`;
      case 'videos':
        return `${videosWatched} completed`;
      case 'tracker':
        return 'Track progress';
      case 'community':
        return `${postsCreated} posts`;
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card
            key={action.id}
            className={`relative overflow-hidden p-4 bg-gradient-to-br ${action.gradient} border-none shadow-lg hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-in fade-in slide-in-from-bottom-3 duration-500`}
            style={{ animationDelay: `${index * 75}ms` }}
            onClick={() => navigate(action.path)}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 ${action.blur} rounded-full blur-2xl`}></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.iconGradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${action.textColor}`}>{action.title}</p>
                  <p className={`text-xs ${action.subtitleColor}`}>
                    {getSubtitle(action.id)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

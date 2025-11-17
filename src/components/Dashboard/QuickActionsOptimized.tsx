import { BookOpen, Video, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  count: string;
  path: string;
  gradient: string;
}

interface QuickActionsProps {
  scriptsCount: number;
  videosCount: number;
}

export const QuickActionsOptimized = ({ scriptsCount, videosCount }: QuickActionsProps) => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      icon: BookOpen,
      label: 'NEP Scripts',
      count: `${scriptsCount} items`,
      path: '/scripts',
      gradient: 'gradient-primary'
    },
    {
      icon: Video,
      label: 'Video Lessons',
      count: `${videosCount} videos`,
      path: '/videos',
      gradient: 'gradient-accent'
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 animate-fade-in">
        <span className="text-lg font-bold">✨ Quick Access</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.path}
              onClick={() => navigate(action.path)}
              className="card-elevated-hover p-6 rounded-2xl cursor-pointer group relative overflow-hidden hover-lift transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500" />

              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-4 rounded-2xl ${action.gradient} transition-transform duration-300 group-hover:rotate-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{action.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

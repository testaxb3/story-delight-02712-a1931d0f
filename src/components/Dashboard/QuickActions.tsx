import { BookOpen, Video, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export const QuickActions = ({ scriptsCount, videosCount }: QuickActionsProps) => {
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
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <span className="text-lg font-bold">✨ Quick Access</span>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="card-elevated-hover p-6 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                initial={false}
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  className={`
                    p-4 rounded-2xl ${action.gradient}
                  `}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{action.count}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

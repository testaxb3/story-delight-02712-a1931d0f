import { LessonCalloutSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';

interface Props {
  data: LessonCalloutSection['data'];
}

const variants = {
  info: {
    borderColor: 'border-blue-500',
    dotColor: 'bg-blue-500',
    bgColor: 'bg-gradient-to-r from-blue-50 to-blue-50/50',
    titleColor: 'text-blue-600',
    iconBg: 'bg-blue-500',
    Icon: Info,
  },
  warning: {
    borderColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-gradient-to-r from-amber-50 to-amber-50/50',
    titleColor: 'text-amber-600',
    iconBg: 'bg-amber-500',
    Icon: AlertTriangle,
  },
  success: {
    borderColor: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-gradient-to-r from-emerald-50 to-emerald-50/50',
    titleColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500',
    Icon: CheckCircle,
  },
  tip: {
    borderColor: 'border-[#FF6631]',
    dotColor: 'bg-[#FF6631]',
    bgColor: 'bg-gradient-to-r from-[#FFF5ED] to-[#FFF5ED]/50',
    titleColor: 'text-[#FF6631]',
    iconBg: 'bg-gradient-to-br from-[#FF6631] to-[#FFA300]',
    Icon: Lightbulb,
  },
};

export function LessonCallout({ data }: Props) {
  const variant = data.variant && variants[data.variant] ? data.variant : 'tip';
  const style = variants[variant];
  const Icon = style.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 mx-5"
    >
      <div className={cn(
        "relative p-4 rounded-[16px] border",
        style.bgColor,
        style.borderColor.replace('border-', 'border-').replace('500', '200')
      )}>
        {/* Icon in top left */}
        <div className={cn(
          "absolute -top-3 -left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md",
          style.iconBg
        )}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        {/* Content */}
        <div className="pl-4 pt-1">
          {data.title && (
            <h4 className={cn("font-bold text-[15px] mb-1.5 flex items-center gap-2", style.titleColor)}>
              {data.title}
              {variant === 'tip' && <Sparkles className="w-3.5 h-3.5" />}
            </h4>
          )}
          <p className="text-[15px] text-[#4A4A4A] leading-relaxed">
            {data.content}
          </p>
        </div>

        {/* Decorative corner accent */}
        <div className={cn(
          "absolute bottom-0 right-0 w-16 h-16 opacity-10 rounded-br-[16px]",
          style.iconBg
        )}
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
          }} />
      </div>
    </motion.div>
  );
}

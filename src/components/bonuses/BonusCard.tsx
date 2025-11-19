import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MarkCompleteButton } from "./MarkCompleteButton";
import {
  Download,
  Lock,
  Play,
  BookOpen,
  FileText,
  Wrench,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  Bookmark,
  Star,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BonusData, BonusCategory } from "@/types/bonus";
import { useState } from "react";

// Re-export for backward compatibility
export type { BonusData };

interface BonusCardProps {
  bonus: BonusData;
  onAction?: (bonus: BonusData) => void;
  index?: number;
}

const categoryConfig: Record<BonusCategory, {
  icon: typeof Play;
  color: string;
  glowClass: string;
  bgColor: string;
  textColor: string;
}> = {
  [BonusCategory.VIDEO]: {
    icon: Play,
    color: "from-red-500 to-pink-500",
    glowClass: "glow-video",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500"
  },
  [BonusCategory.EBOOK]: {
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    glowClass: "glow-ebook",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500"
  },
  [BonusCategory.TOOL]: {
    icon: Wrench,
    color: "from-purple-500 to-indigo-500",
    glowClass: "glow-tool",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500"
  },
  [BonusCategory.PDF]: {
    icon: FileText,
    color: "from-emerald-500 to-teal-500",
    glowClass: "glow-pdf",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500"
  },
  [BonusCategory.SESSION]: {
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    glowClass: "glow-session",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500"
  },
  [BonusCategory.TEMPLATE]: {
    icon: FileText,
    color: "from-violet-500 to-purple-500",
    glowClass: "glow-template",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500"
  }
};

export function BonusCard({ bonus, onAction, index = 0 }: BonusCardProps) {
  // Ensure valid category with robust fallback
  const validCategory = (bonus?.category && 
    Object.values(BonusCategory).includes(bonus.category as BonusCategory)) 
    ? (bonus.category as BonusCategory) 
    : BonusCategory.EBOOK;
  
  const config = categoryConfig[validCategory] || categoryConfig[BonusCategory.EBOOK];
  const IconComponent = config.icon;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        "group overflow-hidden transition-all duration-500 h-full flex flex-col",
        "bonus-glass",
        !bonus.locked && "hover:border-primary/40",
        bonus.locked ? "opacity-80" : ""
      )}>
        {/* Thumbnail Section with Parallax */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          {bonus.thumbnail && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-muted/50 backdrop-blur-sm" />
              )}
              <motion.img
                src={bonus.thumbnail}
                alt={bonus.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "w-full h-full object-cover transition-all duration-600",
                  !imageLoaded && "opacity-0"
                )}
              />
            </>
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${config.color} opacity-80`}>
              <IconComponent className="w-20 h-20 text-white/90" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status badges */}
          <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
            {bonus.isNew && (
              <Badge className="bg-accent text-accent-foreground shadow-lg border-0 animate-shimmer-glow">
                <Sparkles className="w-3 h-3 mr-1" />
                NEW
              </Badge>
            )}
            {bonus.completed && (
              <Badge className="bg-success/90 text-success-foreground shadow-lg border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {!bonus.completed && bonus.progress !== undefined && bonus.progress > 0 && (
              <Badge className="bg-primary/90 text-primary-foreground shadow-lg border-0">
                In Progress
              </Badge>
            )}
            {bonus.locked && (
              <Badge variant="secondary" className="bg-muted/90 shadow-lg backdrop-blur-sm border-0">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className={cn(config.bgColor, config.textColor, "backdrop-blur-sm shadow-lg border-0")}>
              <IconComponent className="w-3 h-3 mr-1" />
              {bonus?.category?.toUpperCase() || 'EBOOK'}
            </Badge>
          </div>

          {/* Quick actions - Enhanced */}
          {!bonus.locked && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <Button size="icon" variant="secondary" className="h-9 w-9 bg-background/95 hover:bg-background backdrop-blur-sm shadow-xl hover:scale-110 transition-transform touch-target">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-9 w-9 bg-background/95 hover:bg-background backdrop-blur-sm shadow-xl hover:scale-110 transition-transform touch-target">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title and description */}
          <div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {bonus.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bonus.description}
            </p>
          </div>

          {/* Tags */}
          {bonus.tags && bonus.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bonus.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-accent/20 dark:bg-accent/10 rounded-md text-accent-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Progress - Circular for better visual */}
          {bonus.progress !== undefined && bonus.progress > 0 && bonus.progress < 100 && (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="transform -rotate-90 w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - bonus.progress / 100)}`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {bonus.progress}%
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">In Progress</p>
                <p className="text-xs text-muted-foreground">Keep going!</p>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {bonus.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{bonus.duration}</span>
              </div>
            )}
            {bonus.size && (
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{bonus.size}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            {bonus.locked ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Locked
                </Button>
                {bonus.requirement && (
                  <p className="text-xs text-center text-muted-foreground">
                    {bonus.requirement}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                {(bonus.viewUrl || bonus.category === 'ebook') && (
                  <Button
                    className={cn(
                      "flex-1 group/btn transition-all duration-300",
                      !bonus.completed && (config?.glowClass || '')
                    )}
                    onClick={() => onAction?.(bonus)}
                  >
                    {bonus.category === 'ebook' ? (
                      <>
                        <BookOpen className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        {bonus.completed ? 'Read Again' : 'Read Now'}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        {bonus.category === 'video' ? (bonus.completed ? 'Watch Again' : 'Watch Now') : (bonus.completed ? 'View Again' : 'View Now')}
                      </>
                    )}
                  </Button>
                )}
                {bonus.downloadUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(bonus.downloadUrl, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                {!bonus.completed && bonus.viewUrl && (
                  <MarkCompleteButton bonusId={bonus.id} isCompleted={false} size="sm" />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

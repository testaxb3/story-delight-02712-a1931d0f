import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BonusData {
  id: string;
  title: string;
  description: string;
  category: "video" | "ebook" | "tool" | "pdf" | "session" | "template";
  thumbnail?: string;
  duration?: string;
  size?: string;
  locked: boolean;
  completed?: boolean;
  progress?: number;
  isNew?: boolean;
  requirement?: string;
  tags?: string[];
  videoUrl?: string;
  downloadUrl?: string;
  viewUrl?: string;
}

interface BonusCardProps {
  bonus: BonusData;
  onAction?: (bonus: BonusData) => void;
  index?: number;
}

const categoryConfig = {
  video: {
    icon: Play,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500"
  },
  ebook: {
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500"
  },
  tool: {
    icon: Wrench,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500"
  },
  pdf: {
    icon: FileText,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500"
  },
  session: {
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500"
  },
  template: {
    icon: FileText,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500"
  }
};

export function BonusCard({ bonus, onAction, index = 0 }: BonusCardProps) {
  const config = categoryConfig[bonus.category];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className={cn(
        "group overflow-hidden transition-all duration-300",
        "hover:shadow-2xl hover:shadow-primary/10",
        bonus.locked ? "opacity-75" : "",
        "border-2 hover:border-primary/30"
      )}>
        {/* Thumbnail Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {bonus.thumbnail ? (
            <img
              src={bonus.thumbnail}
              alt={bonus.title}
              className={cn(
                "w-full h-full transition-transform duration-300 group-hover:scale-110",
                bonus.category === 'ebook' ? "object-contain" : "object-cover"
              )}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${config.color} opacity-80`}>
              <IconComponent className="w-20 h-20 text-white/90" />
            </div>
          )}

          {/* Overlay - More subtle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Status badges */}
          <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
            {bonus.isNew && (
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                NEW
              </Badge>
            )}
            {bonus.completed && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {!bonus.completed && bonus.progress !== undefined && bonus.progress > 0 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                <BookOpen className="w-3 h-3 mr-1" />
                Continue Reading · {bonus.progress}%
              </Badge>
            )}
            {bonus.locked && (
              <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm shadow-lg">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className={cn(config.bgColor, config.textColor, "backdrop-blur-sm shadow-lg")}>
              <IconComponent className="w-3 h-3 mr-1" />
              {bonus.category.toUpperCase()}
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
                  className="px-2 py-1 text-xs bg-secondary rounded-md text-muted-foreground"
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
                {bonus.viewUrl && (
                  <Button
                    className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={() => onAction?.(bonus)}
                  >
                    {bonus.category === 'video' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {bonus.completed ? 'Watch Again' : 'Watch Now'}
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        {bonus.completed ? 'View Again' : 'View Now'}
                      </>
                    )}
                  </Button>
                )}
                {bonus.downloadUrl && (
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-colors"
                    onClick={() => onAction?.(bonus)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                {!bonus.viewUrl && !bonus.downloadUrl && (
                  <Button
                    className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={() => onAction?.(bonus)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Access
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

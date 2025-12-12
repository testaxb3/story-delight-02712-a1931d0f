import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProgramWithLessons, Lesson } from '@/hooks/useAdminPrograms';
import { ChevronRight, Pencil, Trash2, Plus, Music, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgramCardProps {
  program: ProgramWithLessons;
  onEditProgram: () => void;
  onDeleteProgram: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}

export function ProgramCard({
  program,
  onEditProgram,
  onDeleteProgram,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: ProgramCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    coming_soon: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <ChevronRight 
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-90"
              )} 
            />
            
            {/* Cover Image */}
            {program.cover_image_url ? (
              <img 
                src={program.cover_image_url} 
                alt={program.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{program.title}</h3>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusColors[program.status || 'active'])}
                >
                  {program.status?.replace('_', ' ') || 'active'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{program.lessons.length} lessons</span>
                {program.age_range && <span>• {program.age_range}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={onEditProgram} className="h-8 w-8">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDeleteProgram}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 space-y-2 border-t bg-muted/30">
            {program.lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No lessons yet
              </p>
            ) : (
              program.lessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                >
                  <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {lesson.day_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lesson.title}</p>
                    {lesson.summary && (
                      <p className="text-xs text-muted-foreground truncate">{lesson.summary}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {lesson.audio_url && <Music className="w-4 h-4 text-emerald-500" />}
                    {lesson.image_url && <ImageIcon className="w-4 h-4 text-blue-500" />}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditLesson(lesson)}
                      className="h-7 w-7"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteLesson(lesson)}
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddLesson}
              className="w-full gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Lesson
            </Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

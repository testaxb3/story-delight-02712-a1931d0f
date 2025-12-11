import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lesson, useUpdateLesson, useUploadLessonAudio } from '@/hooks/useAdminLessons';
import { Loader2, Upload, Music, X } from 'lucide-react';
import { toast } from 'sonner';

interface LessonFormProps {
  lesson: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonForm({ lesson, open, onOpenChange }: LessonFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateLesson = useUpdateLesson();
  const uploadAudio = useUploadLessonAudio();

  // Sync form state when lesson changes
  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setSummary(lesson.summary || '');
      setContent(lesson.content || '');
      setEstimatedMinutes(lesson.estimated_minutes || 5);
      setAudioUrl(lesson.audio_url || '');
    }
  }, [lesson]);

  const handleSave = async () => {
    if (!lesson) return;
    
    await updateLesson.mutateAsync({
      id: lesson.id,
      updates: {
        title,
        summary,
        content,
        estimated_minutes: estimatedMinutes,
        audio_url: audioUrl || null,
      },
    });
    
    onOpenChange(false);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !lesson) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Audio file must be less than 50MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadAudio.mutateAsync({ file, lessonId: lesson.id });
      setAudioUrl(url);
      
      // Auto-save audio URL to database immediately
      await updateLesson.mutateAsync({
        id: lesson.id,
        updates: { audio_url: url },
      });
      
      toast.success('Audio uploaded and saved!');
    } catch (error) {
      toast.error('Failed to upload audio');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioUrl('');
  };

  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson - Day {lesson.day_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audio Section */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <Label className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Lesson Audio
            </Label>
            
            {audioUrl ? (
              <div className="flex items-center gap-2">
                <audio src={audioUrl} controls className="flex-1 h-10" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRemoveAudio}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Audio URL (optional)"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="flex-1"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload
                </Button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of the lesson"
              rows={3}
            />
          </div>

          {/* Estimated Minutes */}
          <div className="space-y-2">
            <Label htmlFor="minutes">Estimated Reading Time (minutes)</Label>
            <Input
              id="minutes"
              type="number"
              min={1}
              max={60}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 5)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h2>Section</h2><p>Content...</p>"
              rows={12}
              className="font-mono text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateLesson.isPending || !title.trim()}
            >
              {updateLesson.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

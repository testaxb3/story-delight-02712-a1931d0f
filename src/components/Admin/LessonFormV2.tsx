import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lesson, ProgramWithLessons, useCreateLesson, useUpdateLesson, useUploadLessonAudio, useUploadLessonImage } from '@/hooks/useAdminPrograms';
import { Loader2, Upload, Music, ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LessonFormV2Props {
  lesson: Lesson | null;
  programId: string | null;
  programs: ProgramWithLessons[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonFormV2({ lesson, programId, programs, open, onOpenChange }: LessonFormV2Props) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const uploadImage = useUploadLessonImage();
  const uploadAudio = useUploadLessonAudio();

  const isEditing = !!lesson;
  const currentProgram = programs.find(p => p.id === programId);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setSummary(lesson.summary || '');
      setContent(lesson.content || '');
      setDayNumber(lesson.day_number);
      setEstimatedMinutes(lesson.estimated_minutes || 5);
      setImageUrl(lesson.image_url || '');
      setAudioUrl(lesson.audio_url || '');
    } else {
      setTitle('');
      setSummary('');
      setContent(JSON.stringify({ version: 2, sections: [] }, null, 2));
      setEstimatedMinutes(5);
      setImageUrl('');
      setAudioUrl('');
      // Auto-calculate next day number
      if (currentProgram) {
        const maxDay = Math.max(0, ...currentProgram.lessons.map(l => l.day_number));
        setDayNumber(maxDay + 1);
      } else {
        setDayNumber(1);
      }
    }
  }, [lesson, open, currentProgram]);

  const handleSave = async () => {
    if (!title.trim() || !programId) return;

    const data = {
      program_id: programId,
      day_number: dayNumber,
      title: title.trim(),
      summary: summary.trim() || null,
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      audio_url: audioUrl.trim() || null,
      estimated_minutes: estimatedMinutes,
    };

    if (isEditing && lesson) {
      await updateLesson.mutateAsync({ id: lesson.id, updates: data });
    } else {
      await createLesson.mutateAsync(data);
    }

    onOpenChange(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const lessonId = lesson?.id || crypto.randomUUID();
      const url = await uploadImage.mutateAsync({ file, lessonId });
      setImageUrl(`${url}?t=${Date.now()}`);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Audio must be less than 50MB');
      return;
    }

    setIsUploadingAudio(true);
    try {
      const lessonId = lesson?.id || crypto.randomUUID();
      const url = await uploadAudio.mutateAsync({ file, lessonId });
      setAudioUrl(`${url}?t=${Date.now()}`);
      toast.success('Audio uploaded!');
    } catch (error) {
      toast.error('Failed to upload audio');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const isPending = createLesson.isPending || updateLesson.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {isEditing ? `Edit Lesson - Day ${lesson.day_number}` : 'New Lesson'}
            {currentProgram && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                in {currentProgram.title}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 pt-4 space-y-4">
            {/* Day Number & Title */}
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Input
                  id="day"
                  type="number"
                  min={1}
                  value={dayNumber}
                  onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lesson title"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary..."
                rows={2}
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
                className="w-24"
              />
            </div>

            {/* Image Section */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Cover Image
              </Label>
              
              {imageUrl ? (
                <div className="flex items-center gap-3">
                  <img src={imageUrl} alt="Cover" className="w-20 h-20 object-cover rounded-lg" />
                  <Button variant="ghost" size="icon" onClick={() => setImageUrl('')}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="gap-2"
                  >
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </Button>
                </div>
              )}
            </div>

            {/* Audio Section */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <Label className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Lesson Audio
              </Label>
              
              {audioUrl ? (
                <div className="flex items-center gap-2">
                  <audio src={audioUrl} controls className="flex-1 h-10" />
                  <Button variant="ghost" size="icon" onClick={() => setAudioUrl('')}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Audio URL (optional)"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isUploadingAudio}
                    className="gap-2"
                  >
                    {isUploadingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </Button>
                </div>
              )}
            </div>

            {/* Content JSON */}
            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON v2)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='{"version": 2, "sections": [...]}'
                rows={12}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Use JSON v2 format with sections array. Supported types: heading, text, numbered-list, callout, cta, divider
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !title.trim()}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEditing ? 'Save Changes' : 'Create Lesson'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

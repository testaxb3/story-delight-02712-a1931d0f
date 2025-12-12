import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProgram, useUpdateProgram, ProgramWithLessons } from '@/hooks/useAdminPrograms';
import { Loader2 } from 'lucide-react';

interface ProgramFormProps {
  program: ProgramWithLessons | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramForm({ program, open, onOpenChange }: ProgramFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [status, setStatus] = useState('active');
  const [displayOrder, setDisplayOrder] = useState(0);

  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();

  const isEditing = !!program;

  useEffect(() => {
    if (program) {
      setTitle(program.title);
      setSlug(program.slug);
      setDescription(program.description || '');
      setCoverImageUrl(program.cover_image_url || '');
      setAgeRange(program.age_range || '');
      setStatus(program.status || 'active');
      setDisplayOrder(program.display_order || 0);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setCoverImageUrl('');
      setAgeRange('');
      setStatus('active');
      setDisplayOrder(0);
    }
  }, [program, open]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) return;

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      age_range: ageRange.trim() || null,
      status,
      display_order: displayOrder,
    };

    if (isEditing) {
      await updateProgram.mutateAsync({ id: program.id, updates: data });
    } else {
      await createProgram.mutateAsync(data);
    }

    onOpenChange(false);
  };

  const isPending = createProgram.isPending || updateProgram.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Program' : 'New Program'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Picky Eating Challenge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="picky-eating-challenge"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the program..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range</Label>
              <Input
                id="ageRange"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="Ages 3-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="coming_soon">Coming Soon</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending || !title.trim() || !slug.trim()}>
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isEditing ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

interface AdminFeedTabProps {
  onContentChanged?: () => void;
}

export function AdminFeedTab({ onContentChanged }: AdminFeedTabProps) {
  type FeedPost = Database['public']['Tables']['feed_posts']['Row'];

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    published: true,
  });
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      imageUrl: '',
      ctaText: '',
      ctaLink: '',
      published: true,
    });
  };

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('feed_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to load feed posts'));
      return;
    }

    setPosts(data ?? []);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object') {
      const message = 'message' in error ? (error as { message?: string }).message : undefined;
      const details = 'details' in error ? (error as { details?: string }).details : undefined;
      return [message, details].filter(Boolean).join(' ') || fallback;
    }

    return fallback;
  }

  const handlePublishFeed = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      image_url: form.imageUrl.trim() || null,
      cta_text: form.ctaText.trim() || null,
      cta_link: form.ctaLink.trim() || null,
      published: form.published,
    };

    try {
      const { error } = await supabase.from('feed_posts').insert(payload);

      if (error) {
        throw error;
      }

      toast.success('Feed post published!');
      await fetchPosts();
      onContentChanged?.();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to publish post'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post: FeedPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content,
      imageUrl: post.image_url || '',
      ctaText: post.cta_text || '',
      ctaLink: post.cta_link || '',
      published: post.published,
    });
    setShowEditDialog(true);
  };

  const handleUpdatePost = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingPost || !form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      image_url: form.imageUrl.trim() || null,
      cta_text: form.ctaText.trim() || null,
      cta_link: form.ctaLink.trim() || null,
      published: form.published,
    };

    try {
      const { error } = await supabase
        .from('feed_posts')
        .update(payload)
        .eq('id', editingPost.id);

      if (error) {
        throw error;
      }

      toast.success('Feed post updated!');
      await fetchPosts();
      onContentChanged?.();
      setShowEditDialog(false);
      setEditingPost(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to update post'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('feed_posts').delete().eq('id', id);

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to delete post'));
      return;
    }

    toast.success('Post deleted');
    setDeletePostId(null);
    await fetchPosts();
    onContentChanged?.();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Feed Post</h2>
        <form onSubmit={handlePublishFeed} className="space-y-4">
          <div>
            <Label htmlFor="feed-title">Title</Label>
            <Input
              id="feed-title"
              placeholder="Post title"
              className="mt-1"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="feed-content">Content</Label>
            <Textarea
              id="feed-content"
              placeholder="Post content"
              className="mt-1"
              rows={4}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="feed-image">Image URL</Label>
            <Input
              id="feed-image"
              placeholder="https://..."
              className="mt-1"
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="feed-cta-text">CTA Text</Label>
              <Input
                id="feed-cta-text"
                placeholder="Learn More"
                className="mt-1"
                value={form.ctaText}
                onChange={(event) => setForm((prev) => ({ ...prev, ctaText: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="feed-cta-link">CTA Link</Label>
              <Input
                id="feed-cta-link"
                placeholder="https://..."
                className="mt-1"
                value={form.ctaLink}
                onChange={(event) => setForm((prev) => ({ ...prev, ctaLink: event.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="feed-published">Publish now</Label>
            <Switch
              id="feed-published"
              checked={form.published}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish Post'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <Badge variant={post.published ? 'default' : 'secondary'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</p>
                    {post.image_url && (
                      <p className="text-xs text-muted-foreground break-all">
                        Image: {post.image_url}
                      </p>
                    )}
                    {(post.cta_text || post.cta_link) && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">CTA:</span> {post.cta_text || '—'}
                        {post.cta_link && (
                          <span>
                            {' '}
                            ·{' '}
                            <a
                              href={post.cta_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              {post.cta_link}
                            </a>
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {post.created_at ? new Date(post.created_at).toLocaleString() : '—'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(post)}
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletePostId(post.id)}
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Feed Post</DialogTitle>
            <DialogDescription>
              Update the post details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <div>
              <Label htmlFor="edit-feed-title">Title</Label>
              <Input
                id="edit-feed-title"
                placeholder="Post title"
                className="mt-1"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-feed-content">Content</Label>
              <Textarea
                id="edit-feed-content"
                placeholder="Post content"
                className="mt-1"
                rows={4}
                value={form.content}
                onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-feed-image">Image URL</Label>
              <Input
                id="edit-feed-image"
                placeholder="https://..."
                className="mt-1"
                value={form.imageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-feed-cta-text">CTA Text</Label>
                <Input
                  id="edit-feed-cta-text"
                  placeholder="Learn More"
                  className="mt-1"
                  value={form.ctaText}
                  onChange={(event) => setForm((prev) => ({ ...prev, ctaText: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-feed-cta-link">CTA Link</Label>
                <Input
                  id="edit-feed-cta-link"
                  placeholder="https://..."
                  className="mt-1"
                  value={form.ctaLink}
                  onChange={(event) => setForm((prev) => ({ ...prev, ctaLink: event.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-feed-published">Published</Label>
              <Switch
                id="edit-feed-published"
                checked={form.published}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletePostId !== null} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feed post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDelete(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

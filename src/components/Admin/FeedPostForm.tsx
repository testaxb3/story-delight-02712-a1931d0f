import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // <-- MUDOU AQUI
import { Loader2 } from "lucide-react";

export function FeedPostForm() {
  // const { toast } foi removido
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("feed_posts").insert({
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
        cta_text: formData.cta_text || null,
        cta_link: formData.cta_link || null,
        author_id: user.id,
      });

      if (error) throw error;

      toast.success("Feed post published successfully"); // <-- MUDOU AQUI

      setFormData({
        title: "",
        content: "",
        image_url: "",
        cta_text: "",
        cta_link: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to publish post"); // <-- MUDOU AQUI
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Feed Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post title"
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Post content"
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta-text">CTA Text</Label>
              <Input
                id="cta-text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>
            <div>
              <Label htmlFor="cta-link">CTA Link</Label>
              <Input
                id="cta-link"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
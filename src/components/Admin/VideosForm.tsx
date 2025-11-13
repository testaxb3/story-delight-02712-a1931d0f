import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // <-- MUDOU AQUI
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function VideosForm() {
  // const { toast } foi removido
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    section: "foundation",
    video_url: "",
    duration: "",
    order_index: 0,
    locked: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        video_url: formData.video_url.trim(),
        duration: formData.duration.trim(),
        order_index: Number(formData.order_index) || 0,
      };

      const { error } = await supabase.from("videos").insert(payload);

      if (error) throw error;

      toast.success("Video added successfully"); // <-- MUDOU AQUI

      queryClient.invalidateQueries({ queryKey: ["admin-counts"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });

      setFormData({
        title: "",
        description: "",
        section: "foundation",
        video_url: "",
        duration: "",
        order_index: 0,
        locked: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add video"); // <-- MUDOU AQUI
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Video title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="mastery">Mastery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (MM:SS)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="12:30"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <Label htmlFor="order_index">Order Index</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: Number(e.target.value) || 0,
                })
              }
              placeholder="0"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="locked"
              checked={formData.locked}
              onCheckedChange={(checked) => setFormData({ ...formData, locked: checked })}
            />
            <Label htmlFor="locked">Premium Only</Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Video
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
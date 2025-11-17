import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getYouTubeThumbnail } from "@/lib/youtube";

export function VideosForm() {
  // const { toast } foi removido
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [fetchingThumbnail, setFetchingThumbnail] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    section: "foundation",
    video_url: "",
    thumbnail_url: "",
    duration: "",
    order_index: 0,
    locked: false,
    license_type: "Standard",
    creator_name: "",
    original_url: "",
    attribution_required: false,
    verified: false,
  });

  const handleAutoFetchThumbnail = async () => {
    if (!formData.video_url.trim()) {
      toast.error("Please enter a video URL first");
      return;
    }

    setFetchingThumbnail(true);
    try {
      const thumbnailUrl = getYouTubeThumbnail(formData.video_url, 'maxres');
      
      if (!thumbnailUrl) {
        toast.error("Could not extract video ID from URL");
        return;
      }

      // Verify thumbnail exists
      const response = await fetch(thumbnailUrl, { method: 'HEAD' });
      if (response.ok) {
        setFormData({ ...formData, thumbnail_url: thumbnailUrl });
        toast.success("Thumbnail fetched successfully");
      } else {
        // Fallback to HQ thumbnail
        const hqThumbnail = getYouTubeThumbnail(formData.video_url, 'hq');
        if (hqThumbnail) {
          setFormData({ ...formData, thumbnail_url: hqThumbnail });
          toast.success("Thumbnail fetched successfully (HQ quality)");
        } else {
          toast.error("Could not fetch thumbnail");
        }
      }
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      // Try fallback anyway
      const hqThumbnail = getYouTubeThumbnail(formData.video_url, 'hq');
      if (hqThumbnail) {
        setFormData({ ...formData, thumbnail_url: hqThumbnail });
        toast.success("Thumbnail fetched successfully");
      } else {
        toast.error("Could not fetch thumbnail");
      }
    } finally {
      setFetchingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation for CC-BY videos
      if (formData.license_type !== "Standard" && formData.attribution_required) {
        if (!formData.creator_name.trim()) {
          toast.error("Creator name is required for CC-BY videos");
          setLoading(false);
          return;
        }
        if (!formData.original_url.trim()) {
          toast.error("Original URL is required for CC-BY videos");
          setLoading(false);
          return;
        }
        if (!formData.verified) {
          toast.error("Please verify the license manually before submitting");
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        video_url: formData.video_url.trim(),
        duration: formData.duration.trim(),
        order_index: Number(formData.order_index) || 0,
        creator_name: formData.creator_name.trim() || null,
        original_url: formData.original_url.trim() || null,
        verified_date: formData.verified ? new Date().toISOString() : null,
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
        thumbnail_url: "",
        duration: "",
        order_index: 0,
        locked: false,
        license_type: "Standard",
        creator_name: "",
        original_url: "",
        attribution_required: false,
        verified: false,
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
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <div className="flex gap-2">
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://... (or click Auto-fetch)"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAutoFetchThumbnail}
                disabled={fetchingThumbnail || !formData.video_url}
                className="whitespace-nowrap"
              >
                {fetchingThumbnail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Auto-fetch from YouTube
                  </>
                )}
              </Button>
            </div>
            {formData.thumbnail_url && (
              <div className="mt-2">
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-full max-w-xs rounded-md border"
                />
              </div>
            )}
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

          {/* Creative Commons Attribution Section */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-sm">Creative Commons Attribution</h3>
            <div>
              <Label htmlFor="license_type">License Type</Label>
              <Select 
                value={formData.license_type} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  license_type: value,
                  attribution_required: value !== "Standard"
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard YouTube License (Default)</SelectItem>
                  <SelectItem value="CC-BY">CC-BY (Attribution)</SelectItem>
                  <SelectItem value="CC-BY-SA">CC-BY-SA (Attribution ShareAlike)</SelectItem>
                  <SelectItem value="CC0">CC0 (Public Domain)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.attribution_required && (
              <>
                <div>
                  <Label htmlFor="creator_name">Creator Name *</Label>
                  <Input
                    id="creator_name"
                    value={formData.creator_name}
                    onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                    placeholder="e.g., Sprouts"
                    required={formData.attribution_required}
                  />
                </div>
                <div>
                  <Label htmlFor="original_url">Original YouTube URL *</Label>
                  <Input
                    id="original_url"
                    value={formData.original_url}
                    onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    required={formData.attribution_required}
                  />
                </div>
                <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                  <Switch
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                  />
                  <Label htmlFor="verified" className="text-sm">
                    I manually verified this video has {formData.license_type} license on YouTube *
                  </Label>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 bg-muted p-2 rounded">
                  <p className="font-semibold">How to verify license:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Open the video on YouTube</li>
                    <li>Scroll down and click "Show more"</li>
                    <li>Check the "License" section</li>
                    <li>Confirm it says "Creative Commons Attribution license (reuse allowed)"</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Video"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
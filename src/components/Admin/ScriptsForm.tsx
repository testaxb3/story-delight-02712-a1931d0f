import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // <-- MUDOU AQUI
import { Loader2, Plus } from "lucide-react";
import { BulkScriptUpload } from "./BulkScriptUpload";
import { Separator } from "@/components/ui/separator";

export function ScriptsForm() {
  // const { toast } foi removido
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    profile: "",
    wrong_way: "",
    phrase_1: "",
    phrase_1_action: "",
    phrase_2: "",
    phrase_2_action: "",
    phrase_3: "",
    phrase_3_action: "",
    neurological_tip: "",
  });

  const categories = ["bedtime", "screens", "mealtime", "morning", "tantrums", "homework", "transitions", "conflicts"];
  const profiles = ["INTENSE", "DISTRACTED", "DEFIANT", "ALL"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("scripts").insert(formData);

      if (error) throw error;

      toast.success("NEP Script created successfully"); // <-- MUDOU AQUI

      setFormData({
        title: "",
        category: "",
        profile: "",
        wrong_way: "",
        phrase_1: "",
        phrase_1_action: "",
        phrase_2: "",
        phrase_2_action: "",
        phrase_3: "",
        phrase_3_action: "",
        neurological_tip: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create script"); // <-- MUDOU AQUI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BulkScriptUpload />

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground font-medium">OR CREATE SINGLE SCRIPT</span>
        <Separator className="flex-1" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Single NEP Script
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Turning Off Screen"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="profile">Child Profile</Label>
              <Select value={formData.profile} onValueChange={(value) => setFormData({ ...formData, profile: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="wrong_way">Wrong Way</Label>
            <Textarea
              id="wrong_way"
              value={formData.wrong_way}
              onChange={(e) => setFormData({ ...formData, wrong_way: e.target.value })}
              placeholder="The ineffective approach..."
              rows={2}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phrase_1">Phrase 1 (Connect)</Label>
            <Textarea
              id="phrase_1"
              value={formData.phrase_1}
              onChange={(e) => setFormData({ ...formData, phrase_1: e.target.value })}
              placeholder="First phrase..."
              rows={2}
              required
            />
            <Input
              placeholder="Physical action (optional)"
              value={formData.phrase_1_action}
              onChange={(e) => setFormData({ ...formData, phrase_1_action: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phrase_2">Phrase 2 (Validate)</Label>
            <Textarea
              id="phrase_2"
              value={formData.phrase_2}
              onChange={(e) => setFormData({ ...formData, phrase_2: e.target.value })}
              placeholder="Second phrase..."
              rows={2}
              required
            />
            <Input
              placeholder="Physical action (optional)"
              value={formData.phrase_2_action}
              onChange={(e) => setFormData({ ...formData, phrase_2_action: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phrase_3">Phrase 3 (Command)</Label>
            <Textarea
              id="phrase_3"
              value={formData.phrase_3}
              onChange={(e) => setFormData({ ...formData, phrase_3: e.target.value })}
              placeholder="Third phrase..."
              rows={2}
              required
            />
            <Input
              placeholder="Physical action (optional)"
              value={formData.phrase_3_action}
              onChange={(e) => setFormData({ ...formData, phrase_3_action: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="neurological_tip">Neurological Tip</Label>
            <Textarea
              id="neurological_tip"
              value={formData.neurological_tip}
              onChange={(e) => setFormData({ ...formData, neurological_tip: e.target.value })}
              placeholder="Why this works..."
              rows={2}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Script
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
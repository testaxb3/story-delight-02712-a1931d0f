import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // <-- MUDOU AQUI
import { Upload, FileJson, Download, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Script {
  title: string;
  category: string;
  profile: string;
  wrong_way: string;
  phrase_1: string;
  phrase_1_action?: string;
  phrase_2: string;
  phrase_2_action?: string;
  phrase_3: string;
  phrase_3_action?: string;
  neurological_tip: string;
}

export function BulkScriptUpload() {
  // const { toast } foi removido
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const validCategories = ["bedtime", "screens", "mealtime", "morning", "tantrums", "homework"];
  const validProfiles = ["INTENSE", "DISTRACTED", "DEFIANT"];

  const validateScript = (script: any, index: number): string[] => {
    const errors: string[] = [];
    const requiredFields = ["title", "category", "profile", "wrong_way", "phrase_1", "phrase_2", "phrase_3", "neurological_tip"];

    requiredFields.forEach(field => {
      if (!script[field]) {
        errors.push(`Script #${index + 1}: Missing required field "${field}"`);
      }
    });

    if (script.category && !validCategories.includes(script.category)) {
      errors.push(`Script #${index + 1}: Invalid category "${script.category}". Must be one of: ${validCategories.join(", ")}`);
    }

    if (script.profile && !validProfiles.includes(script.profile)) {
      errors.push(`Script #${index + 1}: Invalid profile "${script.profile}". Must be one of: ${validProfiles.join(", ")}`);
    }

    return errors;
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setErrors(["Invalid file type. Please upload a JSON file."]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          setErrors(["File format invalid. JSON must be an array of scripts."]);
          return;
        }

        const validationErrors: string[] = [];
        parsed.forEach((script, index) => {
          validationErrors.push(...validateScript(script, index));
        });

        // Check for duplicate titles
        const titles = parsed.map((s: any) => s.title);
        const duplicates = titles.filter((title: string, index: number) => titles.indexOf(title) !== index);
        if (duplicates.length > 0) {
          validationErrors.push(`Warning: ${duplicates.length} scripts have duplicate titles: ${[...new Set(duplicates)].join(", ")}`);
        }

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setScripts([]);
          return;
        }

        setScripts(parsed);
        setFileName(file.name);
        setErrors([]);
      } catch (error) {
        setErrors(["File format invalid. Please upload valid JSON."]);
        setScripts([]);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImport = async () => {
    setUploading(true);
    try {
      const { error } = await supabase.from("scripts").insert(scripts);

      if (error) throw error;

      toast.success(`${scripts.length} scripts imported successfully`); // <-- MUDOU AQUI

      setScripts([]);
      setFileName("");
      setErrors([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to import scripts"); // <-- MUDOU AQUI
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setScripts([]);
    setFileName("");
    setErrors([]);
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: "Example: Bedtime Routine",
        category: "bedtime",
        profile: "INTENSE",
        wrong_way: "Just go to bed now!",
        phrase_1: "I can see you're having fun and don't want to stop",
        phrase_1_action: "Kneel down to eye level",
        phrase_2: "Your body needs rest to grow strong",
        phrase_2_action: "Place hand on shoulder gently",
        phrase_3: "Let's pick one book together",
        phrase_3_action: "Hold hand and walk together",
        neurological_tip: "Transition time activates the amygdala. Connection first helps regulate cortisol."
      },
      {
        title: "Example: Screen Time",
        category: "screens",
        profile: "DISTRACTED",
        wrong_way: "Turn it off right now!",
        phrase_1: "I know this game is so interesting",
        phrase_1_action: "Sit next to them",
        phrase_2: "Our brains need breaks from screens",
        phrase_2_action: "Show them the timer",
        phrase_3: "What should we do next together?",
        phrase_3_action: "Offer two choices",
        neurological_tip: "Dopamine loops make transitions hard. Acknowledging engagement reduces resistance."
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-glow border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Upload Scripts
          </CardTitle>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-primary hover:bg-muted/50"
          )}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
          />
          <FileJson className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {fileName || "Drop JSON file or click to upload"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Accepts .json files only • Max 100 scripts per file
          </p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm">{error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Table */}
        {scripts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold">{scripts.length} scripts ready to import</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={uploading} className="gradient-primary text-white">
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Import All Scripts
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scripts.map((script, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{script.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {script.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary">
                          {script.profile}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { Button } from "@/components/ui/button";
import { uploadMeltdownDecoderEbook } from "@/lib/uploadMeltdownDecoder";
import { toast } from "sonner";
import { useState } from "react";

export function UploadMeltdownDecoder() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    toast.loading("Uploading ebook...");
    
    const result = await uploadMeltdownDecoderEbook();
    
    if (result.success) {
      toast.success("✅ Ebook uploaded successfully!");
      console.log("Upload result:", result.data);
    } else {
      toast.error("❌ Failed to upload ebook");
      console.error("Upload error:", result.error);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Upload Meltdown Decoder</h3>
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "📘 Upload Ebook to Database"}
      </Button>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const OrphanedEbooksManager = () => {
  const queryClient = useQueryClient();

  const { data: orphanedEbooks, isLoading } = useQuery({
    queryKey: ["orphaned-ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_orphaned_ebooks");
      if (error) throw error;
      return data as any[];
    },
  });

  const deleteEbook = useMutation({
    mutationFn: async (ebookId: string) => {
      const { error } = await supabase
        .from("ebooks")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", ebookId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orphaned-ebooks"] });
      toast.success("Ebook deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete ebook: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading orphaned ebooks...</div>;
  }

  if (!orphanedEbooks || orphanedEbooks.length === 0) {
    return (
      <Card className="p-6 bg-green-500/10 border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">All Clear!</h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              No orphaned ebooks found. All ebooks are properly linked to bonuses.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              {orphanedEbooks.length} Orphaned Ebook{orphanedEbooks.length !== 1 ? "s" : ""} Found
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              These ebooks are not linked to any bonus and are inaccessible to users.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {orphanedEbooks.map((ebook) => (
          <Card key={ebook.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 truncate">{ebook.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{ebook.total_chapters} chapters</span>
                  <span>Slug: {ebook.slug}</span>
                  <span className="text-xs">
                    Created: {new Date(ebook.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Navigate to link ebook page
                    window.location.href = `/admin?tab=bonuses&link=${ebook.id}`;
                  }}
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Link to Bonus
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Orphaned Ebook?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{ebook.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteEbook.mutate(ebook.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

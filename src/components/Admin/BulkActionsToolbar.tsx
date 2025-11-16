import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Lock, Unlock, Copy, Archive, X } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete?: () => void;
  onBulkLock?: () => void;
  onBulkUnlock?: () => void;
  onBulkDuplicate?: () => void;
  onBulkArchive?: () => void;
  isProcessing?: boolean;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkLock,
  onBulkUnlock,
  onBulkDuplicate,
  onBulkArchive,
  isProcessing = false
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-primary-foreground/20">
            {selectedCount} selected
          </Badge>
          
          <div className="h-4 w-px bg-primary-foreground/20" />
          
          <div className="flex items-center gap-2">
            {onBulkDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkDelete}
                disabled={isProcessing}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            {onBulkLock && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkLock}
                disabled={isProcessing}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock
              </Button>
            )}

            {onBulkUnlock && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkUnlock}
                disabled={isProcessing}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock
              </Button>
            )}

            {onBulkDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkDuplicate}
                disabled={isProcessing}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            )}

            {onBulkArchive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkArchive}
                disabled={isProcessing}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isProcessing}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { BonusData } from '@/components/bonuses/BonusCard';
import {
  Pencil,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Copy,
  Star,
  CheckCircle2,
  Play,
  BookOpen,
  FileText,
  Wrench,
  Clock,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BonusesTableProps {
  bonuses: BonusData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (bonus: BonusData) => void;
  onDelete: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPreview: (bonus: BonusData) => void;
  onToggleHero: (bonus: BonusData) => void;
}

const categoryIcons = {
  video: Play,
  ebook: BookOpen,
  pdf: FileText,
  tool: Wrench,
  template: FileText,
  session: Clock,
};

const categoryColors = {
  video: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  ebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  pdf: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  tool: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  template: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  session: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export function BonusesTable({
  bonuses,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onToggleLock,
  onDuplicate,
  onPreview,
  onToggleHero
}: BonusesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(bonuses.map(b => b.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const allSelected = bonuses.length > 0 && selectedIds.length === bonuses.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < bonuses.length;

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={cn(someSelected && "data-[state=checked]:bg-primary/50")}
                />
              </TableHead>
              <TableHead className="w-20">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-32">Category</TableHead>
              <TableHead className="w-40">Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No bonuses found. Create your first bonus to get started.
                </TableCell>
              </TableRow>
            ) : (
              bonuses.map((bonus) => {
                const CategoryIcon = categoryIcons[bonus.category];
                return (
                  <TableRow
                    key={bonus.id}
                    className={cn(
                      "group",
                      selectedIds.includes(bonus.id) && "bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(bonus.id)}
                        onCheckedChange={(checked) => handleSelectOne(bonus.id, checked as boolean)}
                        aria-label={`Select ${bonus.title}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        {bonus.thumbnail ? (
                          <img
                            src={bonus.thumbnail}
                            alt={bonus.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CategoryIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-md">
                        <div className="font-medium line-clamp-1">{bonus.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {bonus.description}
                        </div>
                        {bonus.tags && bonus.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bonus.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {bonus.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{bonus.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={cn(categoryColors[bonus.category], "gap-1")}>
                        <CategoryIcon className="w-3 h-3" />
                        {bonus.category.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {bonus.locked && (
                          <Badge variant="secondary" className="gap-1 w-fit">
                            <Lock className="w-3 h-3" />
                            Locked
                          </Badge>
                        )}
                        {bonus.isNew && (
                          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white gap-1 w-fit">
                            <Star className="w-3 h-3" />
                            New
                          </Badge>
                        )}
                        {bonus.completed && (
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </Badge>
                        )}
                        {!bonus.locked && !bonus.isNew && !bonus.completed && (
                          <Badge variant="outline" className="w-fit">Active</Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleHero(bonus)}
                          title={bonus.tags?.includes('hero') ? "Remove Hero Status" : "Set as Hero"}
                        >
                          <Star 
                            className={cn(
                              "w-4 h-4 transition-colors", 
                              bonus.tags?.includes('hero') ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            )} 
                          />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(bonus)}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleLock(bonus.id)}
                          title={bonus.locked ? "Unlock" : "Lock"}
                        >
                          {bonus.locked ? (
                            <Unlock className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-yellow-600" />
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onPreview(bonus)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(bonus.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDelete(bonus.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bonus?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this bonus. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

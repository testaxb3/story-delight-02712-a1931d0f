import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEbooks } from '@/hooks/useEbooks';
import { useBonuses, useUpdateBonus } from '@/hooks/useBonuses';
import { Loader2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface LinkEbookToBonusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LinkEbookToBonus({ open, onOpenChange, onSuccess }: LinkEbookToBonusProps) {
  const { ebooks, isLoading: loadingEbooks } = useEbooks();
  const { data: bonuses, isLoading: loadingBonuses } = useBonuses();
  const updateBonus = useUpdateBonus();
  
  const [selectedEbookId, setSelectedEbookId] = useState('');
  const [selectedBonusId, setSelectedBonusId] = useState('');
  const [linking, setLinking] = useState(false);

  const handleLink = async () => {
    if (!selectedEbookId || !selectedBonusId) {
      toast.error('Selecione um ebook e um bonus');
      return;
    }

    setLinking(true);

    try {
      const ebook = ebooks?.find(e => e.id === selectedEbookId);
      if (!ebook) {
        toast.error('Ebook not found');
        return;
      }

      await updateBonus.mutateAsync({
        id: selectedBonusId,
        updates: {
          viewUrl: `/ebook/${selectedEbookId}`,
          category: 'ebook',
        },
      });

      toast.success('Ebook vinculado ao bonus com sucesso!');
      onSuccess?.();
      onOpenChange(false);
      setSelectedEbookId('');
      setSelectedBonusId('');
    } catch (error) {
      console.error('Error linking ebook to bonus:', error);
      toast.error('Erro ao vincular ebook ao bonus');
    } finally {
      setLinking(false);
    }
  };

  // Filter ebooks without bonus_id
  const unlinkedEbooks = ebooks?.filter(e => !e.bonus_id) || [];
  
  // Filter bonuses that are not already ebooks or don't have viewUrl pointing to ebook
  const availableBonuses = bonuses?.filter(b => 
    b.category !== 'ebook' || !b.viewUrl?.includes('/ebook/')
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Vincular Ebook a Bonus
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selecione o Ebook</Label>
            {loadingEbooks ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : unlinkedEbooks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Todos os ebooks já estão vinculados a um bonus
              </p>
            ) : (
              <Select value={selectedEbookId} onValueChange={setSelectedEbookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um ebook" />
                </SelectTrigger>
                <SelectContent>
                  {unlinkedEbooks.map((ebook) => (
                    <SelectItem key={ebook.id} value={ebook.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{ebook.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {ebook.total_chapters} capítulos
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Selecione o Bonus</Label>
            {loadingBonuses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableBonuses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Nenhum bonus disponível. Crie um novo bonus primeiro.
              </p>
            ) : (
              <Select value={selectedBonusId} onValueChange={setSelectedBonusId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um bonus" />
                </SelectTrigger>
                <SelectContent>
                  {availableBonuses.map((bonus) => (
                    <SelectItem key={bonus.id} value={bonus.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{bonus.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {bonus.category}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Ao vincular, o bonus será convertido para categoria "ebook" e 
              o viewUrl será atualizado para apontar ao ebook selecionado.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={linking}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLink}
            disabled={linking || !selectedEbookId || !selectedBonusId}
          >
            {linking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Vinculando...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2" />
                Vincular
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

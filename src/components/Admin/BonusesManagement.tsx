import { useState } from 'react';
import { AdminBonusesTab } from '@/components/Admin/AdminBonusesTab';
import { EbooksList } from '@/components/Admin/EbooksList';
import { LinkEbookToBonus } from '@/components/Admin/LinkEbookToBonus';
import { EbookCreationGuide } from '@/components/Admin/EbookCreationGuide';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Gift, Link2, BookMarked } from 'lucide-react';

interface BonusesManagementProps {
  onContentChanged?: () => void;
}

export function BonusesManagement({ onContentChanged }: BonusesManagementProps) {
  const [activeTab, setActiveTab] = useState('bonuses');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestão de Bonuses & Ebooks</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowGuideModal(true)} variant="default">
            <BookMarked className="w-4 h-4 mr-2" />
            📘 Guia de Criação
          </Button>
          {activeTab === 'ebooks' && (
            <Button onClick={() => setShowLinkModal(true)} variant="outline">
              <Link2 className="w-4 h-4 mr-2" />
              Vincular Ebook a Bonus
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="bonuses" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Bonuses
          </TabsTrigger>
          <TabsTrigger value="ebooks" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Ebooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bonuses">
          <AdminBonusesTab onContentChanged={onContentChanged} />
        </TabsContent>

        <TabsContent value="ebooks">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ebooks Criados</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie os ebooks criados a partir de arquivos Markdown. Use a aba "Bonuses" para criar novos ebooks.
                </p>
              </div>
              <EbooksList />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Link Ebook to Bonus Modal */}
      <LinkEbookToBonus
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
        onSuccess={() => {
          onContentChanged?.();
        }}
      />

      {/* Ebook Creation Guide Modal */}
      <Dialog open={showGuideModal} onOpenChange={setShowGuideModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Guia de Criação de Ebooks</DialogTitle>
          </DialogHeader>
          <EbookCreationGuide />
        </DialogContent>
      </Dialog>
    </div>
  );
}

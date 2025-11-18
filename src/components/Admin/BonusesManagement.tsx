import { useState } from 'react';
import { AdminBonusesTab } from '@/components/Admin/AdminBonusesTab';
import { EbooksList } from '@/components/Admin/EbooksList';
import { EbookCreationGuide } from '@/components/Admin/EbookCreationGuide';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Gift, BookMarked, Lightbulb } from 'lucide-react';

interface BonusesManagementProps {
  onContentChanged?: () => void;
}

export function BonusesManagement({ onContentChanged }: BonusesManagementProps) {
  const [activeTab, setActiveTab] = useState('bonuses');
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bonus Management</h2>
        <Button onClick={() => setShowGuideModal(true)} variant="default">
          <BookMarked className="w-4 h-4 mr-2" />
          📘 Creation Guide
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="bonuses" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Bonuses
          </TabsTrigger>
          <TabsTrigger value="ebooks" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Ebooks (View Only)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bonuses">
          <Card className="p-6 mb-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Create ebooks directly here
                </p>
                <p className="text-xs text-muted-foreground">
                  When creating a bonus with category "Ebook", upload the Markdown file directly in the form. The ebook will be created automatically and linked to this bonus.
                </p>
              </div>
            </div>
          </Card>
          
          <AdminBonusesTab onContentChanged={onContentChanged} />
        </TabsContent>

        <TabsContent value="ebooks">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Created Ebooks</h3>
                <Alert className="border-blue-500/50 bg-blue-500/5">
                  <AlertDescription className="text-sm">
                    <strong>Note:</strong> This tab is for viewing and managing existing ebooks only. To create new ebooks, go to the "Bonuses" tab and create a bonus with category "Ebook", then upload your Markdown file directly in the form.
                  </AlertDescription>
                </Alert>
              </div>

              <EbooksList />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ebook Creation Guide Modal */}
      <Dialog open={showGuideModal} onOpenChange={setShowGuideModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Ebook Creation Guide</DialogTitle>
          </DialogHeader>
          <EbookCreationGuide />
        </DialogContent>
      </Dialog>
    </div>
  );
}

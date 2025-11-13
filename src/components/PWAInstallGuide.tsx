import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PWAInstallGuideProps {
  open: boolean;
  onClose: () => void;
}

export function PWAInstallGuide({ open, onClose }: PWAInstallGuideProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('ios');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span>📱</span> Add to Home Screen
          </DialogTitle>
        </DialogHeader>

        <Tabs value={platform} onValueChange={(v) => setPlatform(v as any)} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
          </TabsList>

          {/* iOS Instructions */}
          <TabsContent value="ios" className="space-y-6 mt-6">
            <Badge variant="outline" className="w-full justify-center py-2">
              ⚠️ You must use Safari browser on iPhone
            </Badge>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Tap the Share button</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Look for the share icon (📤) at the bottom of your Safari browser
                </p>
                <div className="pl-11 bg-muted rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-xs text-muted-foreground">Share button at bottom center</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Scroll and tap "Add to Home Screen"</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  In the share menu, scroll down to find this option
                </p>
                <div className="pl-11 bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium">➕ Add to Home Screen</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-semibold">Tap "Add" in the top right</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Confirm by tapping the blue "Add" button
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <h3 className="font-semibold">Done! 🎉</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Find NEP System on your home screen
                </p>
                <div className="pl-11 bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🧠</div>
                  <p className="text-xs text-muted-foreground">NEP System app icon</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Android Instructions */}
          <TabsContent value="android" className="space-y-6 mt-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Tap the menu (⋮)</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Look for the three dots in the top right corner of Chrome
                </p>
                <div className="pl-11 bg-muted rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">⋮</div>
                  <p className="text-xs text-muted-foreground">Menu at top right</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Tap "Add to Home screen"</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Or "Install app" depending on your Chrome version
                </p>
                <div className="pl-11 bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium">📱 Add to Home screen</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-semibold">Tap "Install"</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Confirm the installation
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <h3 className="font-semibold">Done! 🎉</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Find NEP System on your home screen
                </p>
                <div className="pl-11 bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🧠</div>
                  <p className="text-xs text-muted-foreground">NEP System app icon</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Desktop Instructions */}
          <TabsContent value="desktop" className="space-y-6 mt-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Click the install icon</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Look for the install icon (⊕) in the address bar
                </p>
                <div className="pl-11 bg-muted rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">⊕</div>
                  <p className="text-xs text-muted-foreground">Install icon in address bar</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Click "Install"</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  Confirm the installation in the popup
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <h3 className="font-semibold">Done! 🎉</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-11">
                  The app opens in its own window
                </p>
                <div className="pl-11 bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">💻</div>
                  <p className="text-xs text-muted-foreground">NEP System desktop app</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={onClose} className="w-full mt-6">
          Got it, thanks!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

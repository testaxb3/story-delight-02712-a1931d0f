import { useEffect, useMemo, useState } from 'react';
import { Crown, Download, FileText, Check, Search, Eye, Clock } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useTranslation } from '@/hooks/useTranslation';

type PdfRow = Database['public']['Tables']['pdfs']['Row'];
type CategoryType = 'all' | string;

export default function Library() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<CategoryType>('all');
  const [pdfs, setPdfs] = useState<PdfRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load PDFs', error);
        toast.error(t.library.errors.loadFailed);
        setPdfs([]);
      } else {
        setPdfs(data ?? []);
      }

      setLoading(false);
    };

    fetchPdfs();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    pdfs.forEach((pdf) => {
      if (pdf.category) {
        unique.add(pdf.category);
      }
    });
    return ['all', ...Array.from(unique)];
  }, [pdfs]);

  const filteredPDFs = pdfs.filter((pdf) => {
    const matchesSearch =
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pdf.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === 'all' || (pdf.category ?? '').toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const downloadedPDFs = Object.keys(downloadHistory)
    .map((id) => pdfs.find((pdf) => pdf.id === id))
    .filter((pdf): pdf is PdfRow => Boolean(pdf));

  const recentDownloads = downloadedPDFs
    .sort((a, b) => {
      const dateA = downloadHistory[a.id];
      const dateB = downloadHistory[b.id];
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);

  const handleDownload = (pdf: PdfRow) => {
    setDownloadHistory((prev) => ({ ...prev, [pdf.id]: new Date().toISOString() }));
    toast.success(`Download started: ${pdf.title}`);
    window.open(pdf.file_url, '_blank', 'noopener');
  };

  const handlePreview = (pdf: PdfRow) => {
    toast.info('Opening preview...');
    window.open(pdf.file_url, '_blank', 'noopener');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Bonuses</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Resources updated directly from admin panel</p>
        </div>

        {/* Important Notice */}
        <Card className="border-2 border-yellow-500/50 bg-yellow-50/50">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Bonuses Coming Soon!
                </h3>
                <p className="text-sm text-yellow-800">
                  All bonus materials will be available <strong>3 days after your purchase</strong>.
                  We're preparing your exclusive resources to ensure the best quality experience.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-primary text-primary-foreground border-none shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Bonus Stats</p>
              <p className="text-lg font-semibold">
                {loading ? t.common.loading : `${pdfs.length} bonuses available • ${downloadedPDFs.length} downloaded`}
              </p>
            </div>
            {recentDownloads.length > 0 && (
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Last download</p>
                <p className="text-sm font-medium">{recentDownloads[0].title}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search guides, checklists, templates..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat)}
                disabled={loading}
              >
                {cat === 'all' ? 'All' : cat}
              </Button>
            ))}
          </div>
        </div>

        {recentDownloads.length > 0 && category === 'all' && !searchQuery && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recently Downloaded</h2>
            <div className="grid grid-cols-1 gap-3">
              {recentDownloads.map((pdf) => (
                <Card key={`recent-${pdf.id}`} className="p-4 bg-white/90 backdrop-blur-glass border-none shadow-lg">
                  <div className="flex gap-4">
                    <div className="bg-success/10 rounded-lg p-3 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{pdf.title}</h3>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <Check className="w-3 h-3 mr-1" />
                            Downloaded
                          </Badge>
                          {pdf.premium_only && (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pdf.description ?? 'Supplemental NEP System material.'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{pdf.category || 'General'}</span>
                        <span>•</span>
                        <span>{pdf.file_size ?? 'Variable size'}</span>
                        <span>•</span>
                        <span>{pdf.page_count ?? '?'} pages</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(pdf)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download again
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-3">
            {searchQuery ? `Results (${filteredPDFs.length})` : 'All resources'}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {loading && filteredPDFs.length === 0 ? (
              <Card className="p-6 text-center bg-white/90 backdrop-blur-glass border-none shadow-lg">
                <p className="text-sm text-muted-foreground">Loading bonuses…</p>
              </Card>
            ) : filteredPDFs.length === 0 ? (
              <Card className="p-6 text-center bg-white/90 backdrop-blur-glass border-none shadow-lg">
                <p className="text-sm text-muted-foreground">No bonuses found for the selected filter.</p>
              </Card>
            ) : (
              filteredPDFs.map((pdf) => {
                const downloaded = Boolean(downloadHistory[pdf.id]);
                return (
                  <Card key={pdf.id} className="p-4 bg-white/90 backdrop-blur-glass border-none shadow-lg transition-all">
                    <div className="flex gap-4">
                      <div className="bg-success/10 rounded-lg p-3 flex items-center justify-center flex-shrink-0 w-20 h-24">
                        <FileText className={cn('w-8 h-8', downloaded ? 'text-success' : 'text-muted-foreground')} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{pdf.title}</h3>
                            {downloaded && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                <Check className="w-3 h-3 mr-1" />
                                Downloaded
                              </Badge>
                            )}
                            {pdf.premium_only && (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {pdf.description ?? 'Exclusive resource for the NEP community.'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{pdf.category || 'General'}</span>
                          <span>•</span>
                          <span>{pdf.file_size ?? 'Variable size'}</span>
                          <span>•</span>
                          <span>{pdf.page_count ?? '?'} pages</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={downloaded ? 'outline' : 'default'}
                          onClick={() => handleDownload(pdf)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePreview(pdf)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

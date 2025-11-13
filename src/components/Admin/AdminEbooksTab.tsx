import { useState } from "react";
import { useEbooks } from "@/hooks/useEbooks";
import { useBonuses } from "@/hooks/useBonuses";
import { supabase } from "@/integrations/supabase/client";
import { parseMarkdownToChapters, calculateReadingTime, countWords } from "@/utils/markdownToChapters";
import { seedEbooks } from "@/lib/seedEbooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Upload, Plus, Edit, Trash, MoreVertical, FileText } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const AdminEbooksTab = () => {
  const { ebooks, isLoading, refetch } = useEbooks();
  const { data: bonuses } = useBonuses();
  
  const [uploadOpen, setUploadOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [parsedChapters, setParsedChapters] = useState<any[] | null>(null);
  
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookSubtitle, setEbookSubtitle] = useState("");
  const [ebookSlug, setEbookSlug] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("/ebook-cover.png");
  const [coverColor, setCoverColor] = useState("#8b5cf6");
  const [selectedBonusId, setSelectedBonusId] = useState<string>("");
  const [seeding, setSeeding] = useState(false);

  const handleSeedEbooks = async () => {
    setSeeding(true);
    try {
      const results = await seedEbooks();
      const successes = results.filter(r => r.success).length;
      const failures = results.filter(r => !r.success).length;
      
      if (successes > 0) {
        toast.success(`✅ ${successes} ebooks criados com sucesso!`);
        refetch();
      }
      
      if (failures > 0) {
        toast.error(`❌ ${failures} ebooks falharam`);
      }
    } catch (error: any) {
      toast.error("Erro ao criar ebooks: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    setMarkdownContent(text);
    handleParseMarkdown(text);
  };

  const handleParseMarkdown = (markdown: string) => {
    try {
      const chapters = parseMarkdownToChapters(markdown);
      setParsedChapters(chapters);
      toast.success(`${chapters.length} capítulos detectados!`);
    } catch (error: any) {
      toast.error("Erro ao parsear markdown: " + error.message);
    }
  };

  const handleSaveEbook = async () => {
    if (!parsedChapters || !ebookTitle || !ebookSlug) {
      toast.error("Preencha título, slug e parse o markdown");
      return;
    }

    try {
      const totalWords = countWords(parsedChapters);
      const estimatedTime = calculateReadingTime(parsedChapters);

      const { error } = await supabase.from("ebooks").insert({
        title: ebookTitle,
        subtitle: ebookSubtitle || null,
        slug: ebookSlug,
        content: parsedChapters,
        markdown_source: markdownContent,
        thumbnail_url: thumbnailUrl,
        cover_color: coverColor,
        total_chapters: parsedChapters.length,
        estimated_reading_time: estimatedTime,
        total_words: totalWords,
        bonus_id: selectedBonusId || null,
      });

      if (error) throw error;

      toast.success("Ebook criado com sucesso!");
      setUploadOpen(false);
      refetch();
      
      // Reset form
      setMarkdownContent("");
      setParsedChapters(null);
      setEbookTitle("");
      setEbookSubtitle("");
      setEbookSlug("");
      setSelectedBonusId("");
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    }
  };

  const handleDeleteEbook = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ebook?")) return;

    try {
      const { error } = await supabase
        .from("ebooks")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Ebook excluído!");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando ebooks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Ebooks</h2>
          <p className="text-muted-foreground">
            Sistema dinâmico de ebooks parseados de Markdown
          </p>
        </div>
        <div className="flex gap-2">
          {ebooks?.length === 0 && (
            <Button onClick={handleSeedEbooks} disabled={seeding} variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              {seeding ? "Criando..." : "Criar 3 Ebooks Demo"}
            </Button>
          )}
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Ebook
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ebooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ebooks?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leitores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ebooks?.reduce((sum, e) => sum + (e.total_readers || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conclusão Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ebooks && ebooks.length > 0
                ? (ebooks.reduce((sum, e) => sum + (e.completion_rate || 0), 0) / ebooks.length).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Capítulos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ebooks?.reduce((sum, e) => sum + (e.total_chapters || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Capítulos</TableHead>
              <TableHead>Leitores</TableHead>
              <TableHead>Conclusão</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ebooks?.map((ebook) => (
              <TableRow key={ebook.id}>
                <TableCell>
                  <div
                    className="w-12 h-16 rounded"
                    style={{ backgroundColor: ebook.cover_color }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">{ebook.title}</div>
                    <div className="text-sm text-muted-foreground">{ebook.subtitle}</div>
                  </div>
                </TableCell>
                <TableCell>{ebook.total_chapters}</TableCell>
                <TableCell>{ebook.total_readers || 0}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={ebook.completion_rate || 0} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {(ebook.completion_rate || 0).toFixed(1)}%
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {ebook.bonus_id ? (
                    <Badge>Vinculado</Badge>
                  ) : (
                    <Badge variant="outline">Nenhum</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Markdown
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteEbook(ebook.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload de Novo Ebook</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo .md ou cole o conteúdo diretamente
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="paste">
            <TabsList className="w-full">
              <TabsTrigger value="paste" className="flex-1">Colar Markdown</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">Upload Arquivo</TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Cole o conteúdo markdown aqui..."
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <Button onClick={() => handleParseMarkdown(markdownContent)} className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Parsear Markdown
              </Button>
            </TabsContent>

            <TabsContent value="upload">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="mb-4">Arraste um arquivo .md ou clique para selecionar</p>
                <Input
                  type="file"
                  accept=".md,.txt"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            </TabsContent>
          </Tabs>

          {parsedChapters && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  {parsedChapters.length} capítulos detectados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  {parsedChapters.map((chapter, i) => (
                    <div key={i} className="mb-2 p-2 border rounded">
                      <div className="font-semibold">
                        {i + 1}. {chapter.title}
                      </div>
                      {chapter.subtitle && (
                        <div className="text-sm text-muted-foreground">{chapter.subtitle}</div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {parsedChapters && (
            <div className="space-y-4">
              <div>
                <Label>Título do Ebook *</Label>
                <Input
                  value={ebookTitle}
                  onChange={(e) => setEbookTitle(e.target.value)}
                  placeholder="Ex: The Ultimate Routine Builder"
                />
              </div>

              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={ebookSubtitle}
                  onChange={(e) => setEbookSubtitle(e.target.value)}
                  placeholder="Ex: Build unbreakable routines in 7 days"
                />
              </div>

              <div>
                <Label>Slug (URL) *</Label>
                <Input
                  value={ebookSlug}
                  onChange={(e) => setEbookSlug(e.target.value)}
                  placeholder="routine-builder"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cor da Capa</Label>
                  <Input
                    type="color"
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Vincular a Bonus (opcional)</Label>
                <Select value={selectedBonusId} onValueChange={setSelectedBonusId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um bonus..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bonuses?.map((bonus) => (
                      <SelectItem key={bonus.id} value={bonus.id}>
                        {bonus.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEbook} disabled={!parsedChapters}>
              Salvar Ebook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

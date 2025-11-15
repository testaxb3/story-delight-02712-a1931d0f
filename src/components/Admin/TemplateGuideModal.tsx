import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateGuideModal({ open, onOpenChange }: TemplateGuideModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/ebook-template.md';
    link.download = 'ebook-template.md';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Guia do Template de Ebook
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="structure">Estrutura</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Template Completo Incluído</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe o template com 10 capítulos de exemplo, instruções detalhadas e boas práticas.
              </p>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Baixar Template (.md)
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">O Que Está Incluído:</h4>
              <div className="grid gap-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">10 Capítulos de Exemplo</p>
                    <p className="text-xs text-muted-foreground">
                      Estrutura completa do início ao fim
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Instruções em Cada Seção</p>
                    <p className="text-xs text-muted-foreground">
                      Comentários explicando como usar cada elemento
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Blocos Especiais (Callouts)</p>
                    <p className="text-xs text-muted-foreground">
                      4 tipos de destaque: NOTE, TIP, WARNING, SCIENCE
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Scripts de Comunicação</p>
                    <p className="text-xs text-muted-foreground">
                      Exemplos de como formatar diálogos e frases prontas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tabelas e Checklists</p>
                    <p className="text-xs text-muted-foreground">
                      Formatos para organizar informações
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Checklist Final</p>
                    <p className="text-xs text-muted-foreground">
                      Verifique tudo antes de fazer upload
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Chapter Format</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-primary">## CHAPTER 1:</span> Chapter Title
                    </div>
                    <div className="text-muted-foreground">
                      Optional subtitle (next line)
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ✅ Use exactly this format for chapters to be detected
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Title Hierarchy</h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div><Badge variant="outline">H2</Badge> <span className="font-mono">## CHAPTER</span> - Main chapters</div>
                  <div><Badge variant="outline">H3</Badge> <span className="font-mono">###</span> - Chapter sections</div>
                  <div><Badge variant="outline">H4</Badge> <span className="font-mono">####</span> - Subsections</div>
                  <div><Badge variant="outline">H5</Badge> <span className="font-mono">#####</span> - Specific details</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Special Blocks (Callouts)</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="font-mono text-sm mb-1">&gt; [!NOTE] Title</p>
                    <p className="text-xs text-muted-foreground">For important information and key concepts</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="font-mono text-sm mb-1">&gt; [!TIP] Title</p>
                    <p className="text-xs text-muted-foreground">For practical tips and useful suggestions</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="font-mono text-sm mb-1">&gt; [!WARNING] Title</p>
                    <p className="text-xs text-muted-foreground">For warnings and mistakes to avoid</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <p className="font-mono text-sm mb-1">&gt; [!SCIENCE] Title</p>
                    <p className="text-xs text-muted-foreground">For scientific explanations and studies</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Listas</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>- Item não ordenado 1</div>
                  <div>- Item não ordenado 2</div>
                  <div className="mt-2">1. Item ordenado 1</div>
                  <div>2. Item ordenado 2</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Formatação de Texto</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>**Texto em negrito**</div>
                  <div>*Texto em itálico*</div>
                  <div>`Código inline`</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tabela</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <div>| Coluna 1 | Coluna 2 | Coluna 3 |</div>
                  <div>|----------|----------|----------|</div>
                  <div>| Dado 1   | Dado 2   | Dado 3   |</div>
                  <div>| Dado 4   | Dado 5   | Dado 6   |</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Checklist</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>- [ ] Item não marcado</div>
                  <div>- [x] Item marcado</div>
                  <div>- [ ] Outro item</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Dica Importante</p>
                  <p className="text-muted-foreground">
                    Baixe o template completo para ver todos os exemplos em contexto e entender melhor como estruturar seu ebook.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Baixar Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Copy, 
  Check, 
  FileText, 
  Pen, 
  BookOpen, 
  CheckCircle2, 
  Rocket,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ebookCategories,
  profileTypes,
  getPromptsByCategory,
  type EbookCategory,
  type ProfileType
} from '@/data/ebookPrompts';
import {
  writingGuidelines,
  writingExamples,
  calloutGuidelines,
  qualityChecklist,
  templateStructure
} from '@/data/writingExamples';

export function EbookCreationGuide() {
  const [selectedCategory, setSelectedCategory] = useState<EbookCategory>('rotinas');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>('universal');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPrompt = () => {
    const prompts = getPromptsByCategory(selectedCategory);
    const selectedPrompt = prompts.find(p => p.profile === selectedProfile);
    
    if (selectedPrompt) {
      navigator.clipboard.writeText(selectedPrompt.prompt);
      setCopied(true);
      toast({
        title: "Prompt copiado!",
        description: "Cole no Claude AI para gerar seu ebook.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const prompts = getPromptsByCategory(selectedCategory);
  const selectedPrompt = prompts.find(p => p.profile === selectedProfile);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">📘 Guia de Criação de Ebooks NEP</h2>
        <p className="text-muted-foreground">
          Sistema completo com prompts otimizados, referências de escrita e templates para criar ebooks de alta qualidade usando Claude AI
        </p>
      </div>

      <Tabs defaultValue="prompts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="writing" className="flex items-center gap-2">
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">Escrita</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
          <TabsTrigger value="howto" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Como Usar</span>
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: PROMPTS PRONTOS */}
        <TabsContent value="prompts" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">📝 Prompts Prontos para Claude AI</h3>
              <p className="text-sm text-muted-foreground">
                Selecione o tipo de ebook e o profile para gerar um prompt otimizado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria do Ebook</label>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as EbookCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ebookCategories).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Profile da Criança</label>
                <Select value={selectedProfile} onValueChange={(v) => setSelectedProfile(v as ProfileType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(profileTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedPrompt && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedPrompt.title}</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyPrompt}
                      variant="outline"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Prompt
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => window.open('https://claude.ai', '_blank')}
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Claude AI
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={selectedPrompt.prompt}
                  readOnly
                  className="font-mono text-xs h-96"
                />

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>💡 Como usar:</strong> Copie este prompt, cole no Claude AI, e adicione detalhes específicos do seu ebook. 
                    O Claude vai gerar o conteúdo completo seguindo o padrão NEP.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ABA 2: REFERÊNCIAS DE ESCRITA */}
        <TabsContent value="writing" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">✍️ Referências de Escrita NEP</h3>
              <p className="text-sm text-muted-foreground">
                Tom, voz e estilo para criar conteúdo que soa REAL (não IA)
              </p>
            </div>

            {/* DO's and DON'Ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">✅ FAÇA</h4>
                <ul className="space-y-2">
                  {writingGuidelines.do.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-red-600 dark:text-red-400">❌ NÃO FAÇA</h4>
                <ul className="space-y-2">
                  {writingGuidelines.dont.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Phrases to Avoid */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-red-800 dark:text-red-300">
                🚨 Frases de IA para EVITAR
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                Se qualquer frase abaixo aparece no seu ebook, REESCREVA:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {writingGuidelines.aiPhrases.map((phrase, i) => (
                  <div key={i} className="text-sm font-mono bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded">
                    {phrase}
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Examples */}
            <div className="space-y-4">
              <h4 className="font-semibold">📚 Exemplos: BOM vs RUIM</h4>
              {writingExamples.map((example, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium">{example.title}</h5>
                  
                  <div className="space-y-2">
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
                      <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">❌ RUIM (genérico/IA):</p>
                      <p className="text-sm text-foreground/80 italic">{example.bad}</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-3">
                      <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">✅ BOM (natural/NEP):</p>
                      <p className="text-sm text-foreground/80">{example.good}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded p-3">
                    <p className="text-xs font-medium text-primary mb-1">💡 Por quê funciona:</p>
                    <p className="text-sm">{example.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Callout Guidelines */}
            <div className="space-y-3">
              <h4 className="font-semibold">📌 Como Usar Callouts</h4>
              <div className="grid gap-3">
                {Object.entries(calloutGuidelines).map(([type, guide]) => (
                  <div key={type} className="border rounded-lg p-3">
                    <p className="font-medium text-sm mb-1">
                      [{type.toUpperCase()}] - {guide.when}
                    </p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {guide.example}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 3: TEMPLATES */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">📚 Templates & Estruturas</h3>
              <p className="text-sm text-muted-foreground">
                Estruturas comprovadas para criar ebooks de alto valor
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">{templateStructure.sevenChapter.title}</h4>
              
              {templateStructure.sevenChapter.chapters.map((chapter) => (
                <div key={chapter.number} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h5 className="font-medium">
                      CHAPTER {chapter.number}: {chapter.title}
                    </h5>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {chapter.wordCount} palavras
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{chapter.content}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">💡 Dica de Estrutura</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Capítulos 1-2: Problema + Por quê (validação + neurociência)</li>
                <li>Capítulos 3-4: Solução + Prática (framework + scripts)</li>
                <li>Capítulos 5-6: Realidade + Exemplos (falhas + sucessos)</li>
                <li>Capítulo 7: Quick Reference (ferramentas rápidas)</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 4: CHECKLIST */}
        <TabsContent value="checklist" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">✅ Checklist de Qualidade</h3>
              <p className="text-sm text-muted-foreground">
                Valide seu ebook antes de publicar
              </p>
            </div>

            {Object.entries(qualityChecklist).map(([section, items]) => (
              <div key={section} className="space-y-3">
                <h4 className="font-semibold capitalize">
                  {section === 'content' && '📝 Conteúdo'}
                  {section === 'writing' && '✍️ Escrita'}
                  {section === 'value' && '🧠 Valor'}
                  {section === 'structure' && '📐 Estrutura'}
                  {section === 'redFlags' && '🚨 Red Flags'}
                </h4>
                <div className="space-y-2">
                  {items.map((checkItem: { item: string; critical: boolean }, i: number) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        checkItem.critical
                          ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                          : 'bg-muted/50'
                      }`}
                    >
                      <input type="checkbox" className="mt-1" />
                      <span className="text-sm flex-1">
                        {checkItem.item}
                        {checkItem.critical && (
                          <span className="ml-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
                            [CRÍTICO]
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-primary/10 border border-primary rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎯 Teste Final: "7AM Chaos Test"</h4>
              <p className="text-sm">
                Antes de publicar, pergunte: "Se um pai estressado às 7am, atrasado, com criança em meltdown, 
                consegue abrir esse ebook e USAR algo imediatamente?"
              </p>
              <p className="text-sm font-semibold mt-2 text-primary">
                Se NÃO, REESCREVA até passar no teste.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 5: COMO USAR */}
        <TabsContent value="howto" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">🚀 Como Usar Este Guia</h3>
              <p className="text-sm text-muted-foreground">
                Workflow completo de criação de ebooks
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Escolha o Tipo de Ebook',
                  content: 'Vá para aba "Prompts Prontos", selecione categoria (Rotinas, Comportamento, etc.) e profile (INTENSE, DISTRACTED, DEFIANT, Universal)'
                },
                {
                  step: 2,
                  title: 'Copie o Prompt',
                  content: 'Clique em "Copiar Prompt Completo". O prompt já está otimizado para Claude AI com todo o contexto necessário.'
                },
                {
                  step: 3,
                  title: 'Use no Claude AI',
                  content: 'Abra Claude.ai, cole o prompt copiado, adicione detalhes específicos do ebook que você quer, e deixe o Claude gerar o conteúdo.'
                },
                {
                  step: 4,
                  title: 'Revise com Checklist',
                  content: 'Use aba "Checklist de Qualidade" para verificar cada item. Preste atenção especial aos itens marcados como [CRÍTICO].'
                },
                {
                  step: 5,
                  title: 'Refine a Linguagem',
                  content: 'Use aba "Referências de Escrita" para comparar exemplos BONS vs RUINS. Ajuste trechos que soam genéricos ou "IA".'
                },
                {
                  step: 6,
                  title: 'Valide o Formato',
                  content: 'Certifique-se que usa "## CHAPTER X:" corretamente. Adicione blocos [!NOTE], [!TIP], [!WARNING], [!SCIENCE]. Verifique contagem de palavras (800-1200/capítulo).'
                },
                {
                  step: 7,
                  title: 'Upload no Admin',
                  content: 'Vá para Bonuses → Novo Bônus → EBOOK. Faça upload do arquivo .md, revise preview de capítulos, e clique em "Processar e Criar Ebook".'
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold mb-1">{item.title}</h5>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">💡 Dicas de Prompting para Claude AI</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Seja específico sobre o perfil:</strong> "Criança DEFIANT, 6 anos, recusa rotina matinal"</p>
                <p><strong>Peça exemplos reais:</strong> "Não use 'João, 5 anos'. Crie exemplo detalhado com contexto real"</p>
                <p><strong>Solicite revisão de tom:</strong> "Revise para soar menos acadêmico, mais como amigo falando"</p>
                <p><strong>Itere em partes:</strong> Gere 2-3 capítulos por vez, revise e ajuste tom antes de continuar</p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-300">
                🔄 Prompt de Refinamento
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">
                Se o conteúdo ficou genérico, use este prompt no Claude:
              </p>
              <pre className="text-xs bg-orange-100 dark:bg-orange-900/30 p-3 rounded overflow-x-auto">
{`"Revise este capítulo para:
1. Remover frases de IA ('É importante notar que...', 'Devemos considerar...')
2. Adicionar exemplos ESPECÍFICOS (detalhes reais, não genéricos)
3. Usar linguagem conversacional (como amigo experiente falando)
4. Incluir backup plans realistas
5. Passar no '7AM Chaos Test' (funciona quando tudo está caótico?)"`}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

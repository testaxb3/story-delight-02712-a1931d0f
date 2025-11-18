import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Pen, 
  BookOpen, 
  CheckCircle2, 
  Rocket,
  Sparkles,
  Brain,
  MessageSquare,
  CheckSquare,
  ListChecks,
  AlertTriangle
} from 'lucide-react';
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
  templateStructure,
  readerV2JsonFormat,
  readerV2Standards
} from '@/data/writingExamples';

export function EbookCreationGuide() {
  const [selectedCategory, setSelectedCategory] = useState<EbookCategory>('routines');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>('universal');

  const availableEbooks = getPromptsByCategory(selectedCategory);
  const selectedEbook = availableEbooks.find(e => e.profile === selectedProfile);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">📘 NEP Ebook Creation Guide</h2>
        <p className="text-muted-foreground">
          Complete visual reference with categories, profiles, writing standards, and Reader V2 format guidelines
        </p>
      </div>

      <Tabs defaultValue="reference" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Reference</span>
          </TabsTrigger>
          <TabsTrigger value="writing" className="flex items-center gap-2">
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">Writing</span>
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
            <span className="hidden sm:inline">How to Use</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: QUICK REFERENCE */}
        <TabsContent value="reference" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎯 Quick Creation Reference</h3>
              <p className="text-sm text-muted-foreground">
                Browse available categories and child profiles, then request creation in chat
              </p>
            </div>

            {/* Available Categories */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Available Categories
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(ebookCategories).map(([key, label]) => (
                  <Card 
                    key={key}
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedCategory === key ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedCategory(key as EbookCategory)}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getPromptsByCategory(key as EbookCategory).length} ebook(s) available
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Child Profiles */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Child Profiles
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(profileTypes).map(([key, label]) => (
                  <Card
                    key={key}
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedProfile === key ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedProfile(key as ProfileType)}
                  >
                    <Badge variant={key === 'universal' ? 'default' : 'outline'} className="mb-2">
                      {key.toUpperCase()}
                    </Badge>
                    <div className="text-sm">{label}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Ebook Preview */}
            {selectedEbook && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Selected Ebook Preview
                </h4>
                <Card className="p-4 bg-primary/5 border-primary">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h5 className="font-semibold">{selectedEbook.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedEbook.description}
                        </p>
                      </div>
                      <Badge>{selectedProfile.toUpperCase()}</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* How to Request in Chat */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                How to Request in Chat
              </h4>
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary">
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    💬 After selecting your category and profile above, go to chat and say:
                  </p>
                  <div className="bg-background rounded-lg p-4 border-2 border-primary/20">
                    <code className="text-sm font-mono">
                      "Create ebook: <span className="text-primary font-bold">{selectedCategory}</span> for <span className="text-primary font-bold">{selectedProfile.toUpperCase()}</span> profile"
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: "Create ebook: routines for INTENSE profile"
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      ✅ Lovable AI will create the ebook using Reader V2 format<br/>
                      ✅ Review and request adjustments as needed<br/>
                      ✅ Ebook will automatically appear on bonuses page
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Current Ebooks Status */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Existing Ebooks Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-4">
                  <Badge className="mb-2">✅ Created</Badge>
                  <div className="text-sm font-medium">35 Strategies to Get Your Child Off Screens V2</div>
                  <div className="text-xs text-muted-foreground">screen-time / universal</div>
                </Card>
                <Card className="p-4">
                  <Badge className="mb-2">✅ Created</Badge>
                  <div className="text-sm font-medium">The Meltdown Decoder V2</div>
                  <div className="text-xs text-muted-foreground">behavior / universal</div>
                </Card>
                <Card className="p-4 opacity-50">
                  <Badge variant="outline" className="mb-2">⭐ Planned</Badge>
                  <div className="text-sm font-medium">More ebooks coming soon...</div>
                  <div className="text-xs text-muted-foreground">Request in chat</div>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: WRITING STANDARDS */}
        <TabsContent value="writing" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">✍️ Writing Standards</h3>
              <p className="text-sm text-muted-foreground">
                Guidelines for writing conversational, high-value ebook content
              </p>
            </div>

            {/* Do's */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">✅ DO</h4>
              <ul className="space-y-2">
                {writingGuidelines.do.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">❌ DON'T</h4>
              <ul className="space-y-2">
                {writingGuidelines.dont.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0">✗</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Phrases to Avoid */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                🚫 AI Phrases to AVOID
              </h4>
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {writingGuidelines.aiPhrases.map((phrase, i) => (
                    <div key={i} className="text-sm text-orange-900 dark:text-orange-200">
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Writing Examples */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">📝 Before & After Examples</h4>
              {writingExamples.map((example, i) => (
                <Card key={i} className="p-4">
                  <h5 className="font-semibold mb-3">{example.title}</h5>
                  
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
                      <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">❌ BAD</div>
                      <p className="text-sm">{example.bad}</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-3">
                      <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">✅ GOOD</div>
                      <p className="text-sm whitespace-pre-line">{example.good}</p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">💡 WHY</div>
                      <p className="text-sm">{example.why}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Callout Guidelines */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">🎨 Callout Types (Reader V2)</h4>
              <div className="grid gap-4">
                {Object.entries(calloutGuidelines).map(([type, guide]) => (
                  <Card key={type} className="p-4">
                    <Badge className="mb-2">{type.toUpperCase()}</Badge>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-semibold">When to use:</span> {guide.when}</p>
                      <div className="bg-muted rounded p-3 text-sm font-mono whitespace-pre-line">
                        {guide.example}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reader V2 JSON Format */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">🔧 Reader V2 JSON Format</h4>
              
              <div className="space-y-3">
                <h5 className="font-medium">Block Types:</h5>
                {readerV2JsonFormat.blockTypes.map((block, i) => (
                  <Card key={i} className="p-4">
                    <Badge variant="outline" className="mb-2">{block.type}</Badge>
                    <p className="text-sm mb-3">{block.description}</p>
                    <div className="bg-slate-950 dark:bg-slate-900 rounded p-3 text-sm">
                      <pre className="text-green-400 overflow-x-auto">
                        {JSON.stringify(block.example, null, 2)}
                      </pre>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Critical Rules:</h5>
                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <ul className="space-y-2">
                    {readerV2JsonFormat.criticalRules.map((rule, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="flex-shrink-0">{rule.startsWith('✅') ? '✅' : '❌'}</span>
                        <span>{rule.replace(/^[✅❌]\s/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: TEMPLATES */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">📋 Structure Templates</h3>
              <p className="text-sm text-muted-foreground">
                Standard chapter structure and formatting guidelines
              </p>
            </div>

            {/* Chapter Structure */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Chapter Structure Standards</h4>
              <Card className="p-4 bg-primary/5">
                <ul className="space-y-2">
                  {readerV2Standards.chapterStructure.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Formatting Rules */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Formatting Rules</h4>
              <Card className="p-4">
                <ul className="space-y-2">
                  {readerV2Standards.formattingRules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* 7-Chapter Template */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">7-Chapter Template</h4>
              <div className="space-y-3">
                {templateStructure.sevenChapter.chapters.map((chapter) => (
                  <Card key={chapter.number} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className="mb-1">Chapter {chapter.number}</Badge>
                        <h5 className="font-semibold">{chapter.title}</h5>
                      </div>
                      <Badge variant="outline">{chapter.wordCount}</Badge>
                    </div>
                    <ul className="space-y-1">
                      {chapter.content.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: CHECKLIST */}
        <TabsContent value="checklist" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">✅ Quality Checklist</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive validation checklist for ebook quality
              </p>
            </div>

            {Object.entries(qualityChecklist).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-lg font-semibold capitalize flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <Card className={`p-4 ${
                  category === 'redFlags' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                    : category === 'readerV2Compatibility'
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                    : ''
                }`}>
                  <ul className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">
                          {category === 'redFlags' ? '❌' : '☐'}
                        </span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* TAB 5: HOW TO USE */}
        <TabsContent value="howto" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">🚀 AI Ebook Creation Process</h3>
              <p className="text-sm text-muted-foreground">
                Detailed step-by-step instructions for the AI to follow when creating ebooks
              </p>
            </div>

            {/* How to Request in Chat */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                How to Request in Chat (COMPLETE PROMPT TEMPLATE)
              </h4>
              
              <Card className="p-4 bg-primary/10 border-primary">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      💬 Request Format:
                    </p>
                    <code className="block p-4 bg-background rounded text-xs whitespace-pre-wrap leading-relaxed">
{`"Create ebook: [category] for [profile] profile

PREPARATION CHECKLIST:
✓ Review Writing Standards tab in src/components/Admin/EbookCreationGuide.tsx
  • Study DO's and DON'Ts list (avoid generic AI phrases, use specific numbers)
  • Review AI phrases to avoid section
  • Analyze before/after writing examples for quality standards
  • Understand callout types: REMEMBER, SCIENCE, WARNING, TRY

✓ Review Templates tab for structure requirements
  • Study 7-chapter template: Problem → Science → Framework → Scripts → Failures → Stories → Quick Ref
  • Chapter formatting rules: H2 sections, 2-4 line paragraphs, callouts, script boxes
  • Self-contained block requirements (no adjacent dependencies)

✓ Study existing V2 ebooks in database
  • Query: SELECT * FROM public.ebooks WHERE slug LIKE '%-v2'
  • Examine JSON structure of content field {chapters: [...]}
  • Analyze how callouts, scripts, tables, and formatting are implemented
  • Study how line breaks are used within paragraphs for readability

✓ Review rendering components to understand data structure
  • src/components/ebook/v2/ChapterContentV2.tsx - Main content renderer
  • src/components/ebook/CalloutBox.tsx - Callout block structure
  • src/components/ebook/ScriptBox.tsx - Script block structure

CONTENT CREATION GUIDELINES:
• Write in engaging, best-seller book style (NOT dry instructional text)
• Use specific numbers and real examples (NOT generic statements like "many parents")
• Include micro-story opening in Chapter 1 to hook reader
• Add 1-2 callouts per section using appropriate types based on content
• Include script boxes with NEP scripts in strategy chapters
• Ensure proper line breaks within paragraphs for readability
• Bold key concepts, italic for emphasis, lists for processes
• Write 1500-2000 words per chapter

QUALITY VALIDATION (RUN BEFORE SUBMITTING):
✓ Run through Checklist tab - verify all items pass
✓ Verify all blocks are self-contained (callout content complete in one block)
✓ Check JSON structure matches Reader V2 format exactly
✓ Confirm no AI phrases or generic language
✓ Validate category matches requested topic accurately
✓ Ensure profile-specific content addresses that brain type's needs

AUTO-COMPLETE AFTER CREATION:
• Create migration to INSERT into public.ebooks with proper JSON structure
• Auto-create bonus entry in public.bonuses (category: 'ebook')
• Auto-link ebook to bonus via UPDATE ebooks SET bonus_id = [new_bonus_id]
• No user intervention required for bonus creation"`}
                    </code>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      📝 Complete Example:
                    </p>
                    <code className="block p-4 bg-background rounded text-xs whitespace-pre-wrap leading-relaxed">
{`"Create ebook: bedtime routines for INTENSE profile

[Include full PREPARATION CHECKLIST above]
[Follow all CONTENT CREATION GUIDELINES]
[Run QUALITY VALIDATION before inserting]
[Auto-complete bonus creation and linking]"`}
                    </code>
                  </div>

                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <strong className="text-destructive">CRITICAL:</strong> Always auto-create bonus + link after ebook creation. Without bonus link, ebook won't appear on bonuses page.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <strong className="text-yellow-600">WARNING:</strong> Validate JSON structure before INSERT. Invalid structure causes rendering errors.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded">
                      <CheckSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <strong className="text-green-600">QUALITY:</strong> Run full Checklist tab validation before considering ebook complete.
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Creation Process */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Creation Process (Follow These Steps)
              </h4>
              <div className="space-y-3">
                <Card className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-primary">Step 1</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Review Writing Standards</h5>
                      <p className="text-sm text-muted-foreground">
                        Before creating content, review the <strong>Writing Standards</strong> tab:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>Check DO's and DON'Ts (avoid generic AI phrases, use specific numbers)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>Review callout types: REMEMBER, SCIENCE, WARNING, TRY</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>Study before/after examples to understand quality standards</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>Understand Reader V2 JSON format and block types</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-blue-500">Step 2</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Study Template Structure</h5>
                      <p className="text-sm text-muted-foreground">
                        Review the <strong>Templates</strong> tab thoroughly:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Understand 7-chapter structure (Problem → Science → Framework → Scripts → Failures → Stories → Quick Ref)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Follow chapter formatting rules (H2 sections, 2-4 paragraphs, callouts, script boxes)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Ensure proper line breaks within paragraphs for readability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Each block must be self-contained (no dependencies on adjacent blocks)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-green-500">Step 3</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Create Ebook Content</h5>
                      <p className="text-sm text-muted-foreground">
                        Write the ebook following all standards:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>7 chapters with proper structure (cover, micro-story opening, sections, callouts, scripts)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>Use **bold** for key concepts, *italic* for emphasis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>Include specific numbers (minimum 5 per chapter)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>Write in conversational, engaging tone (not academic)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>Callouts: title + content together in ONE block</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                          <span>Lists: separate array entries (never concatenated)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-orange-500">Step 4</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Insert into Database</h5>
                      <p className="text-sm text-muted-foreground">
                        Add the ebook to the database:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                          <span>Create migration to INSERT into public.ebooks table</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                          <span>Slug format: [category]-[profile]-v2 (e.g., routines-intense-v2)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                          <span>Set estimated_reading_time (usually 35-50 minutes for 7 chapters)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                          <span>Leave bonus_id as NULL (will link in next step)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-500">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-purple-500">Step 5</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Create Bonus Entry & Link</h5>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-destructive">CRITICAL: Always do this automatically!</strong>
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                          <span>INSERT bonus entry into public.bonuses (category: 'ebook', lowercase)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                          <span>Set view_url: '/ebook-v2/[slug]' (use V2 reader route)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                          <span>UPDATE ebooks.bonus_id to link to the new bonus</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                          <span><strong>Do NOT wait for user to ask!</strong> Always create bonus + link automatically</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-teal-500">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1 bg-teal-500">Step 6</Badge>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold">Quality Check</h5>
                      <p className="text-sm text-muted-foreground">
                        Run through the <strong>Quality Checklist</strong> tab:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <ListChecks className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                          <span>Content quality (no AI phrases, specific numbers, conversational tone)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ListChecks className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                          <span>Reader V2 compatibility (JSON format, callout types, self-contained blocks)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ListChecks className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                          <span>Technical requirements (slug, reading time, English, tags)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Critical Reminders */}
            <Card className="p-4 bg-destructive/10 border-destructive">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Critical Reminders
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">→</span>
                  <span className="text-sm"><strong>Always create the bonus entry automatically</strong> (Step 5) - don't wait for user to ask</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">→</span>
                  <span className="text-sm">Bonus category must be <code className="bg-background px-1 rounded">'ebook'</code> (lowercase)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">→</span>
                  <span className="text-sm">Callout blocks: title + content in ONE block (not split)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">→</span>
                  <span className="text-sm">List items: separate array entries (never concatenated strings)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">→</span>
                  <span className="text-sm">All content in English</span>
                </li>
              </ul>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

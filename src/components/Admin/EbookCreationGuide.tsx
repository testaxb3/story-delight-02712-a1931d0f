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
  ListChecks
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
              <h3 className="text-2xl font-bold mb-2">🚀 How to Use This Guide</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step workflow for creating high-quality ebooks
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Explore Categories & Profiles</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to "Reference" tab → Browse categories → Select child profile → Note the combination you want
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Check Writing Standards</h4>
                    <p className="text-sm text-muted-foreground">
                      Review "Writing" tab → Understand Do's/Don'ts → Study before/after examples → Note callout types and Reader V2 format
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Request in Chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to chat → Say: "Create ebook: [category] for [profile] profile" → Lovable AI will create with Reader V2 format
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Review & Refine</h4>
                    <p className="text-sm text-muted-foreground">
                      Check "Checklist" tab → Validate quality → Request adjustments in chat → Iterate until perfect
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Publish</h4>
                    <p className="text-sm text-muted-foreground">
                      Ebook automatically appears on bonuses page → Create corresponding bonus entry → Link ebook to bonus → Users can access
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-200">💡 Pro Tips</h4>
              <ul className="space-y-2 text-sm text-yellow-900 dark:text-yellow-200">
                <li>• Always specify category + profile clearly in your request</li>
                <li>• Reference this guide when asking for adjustments</li>
                <li>• Ask for specific sections to be refined (e.g., "Make Chapter 3 more conversational")</li>
                <li>• Validate Reader V2 format compliance before publishing</li>
                <li>• Remember: all content must be in English</li>
              </ul>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

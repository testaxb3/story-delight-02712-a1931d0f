// @ts-nocheck
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Loader2, Pencil, Trash2, Upload, Copy, Check, Filter, Search,
  ChevronDown, ChevronUp, Download, FileText, AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

const BRAIN_PROFILES = ['INTENSE', 'DISTRACTED', 'DEFIANT'] as const;
type BrainProfile = typeof BRAIN_PROFILES[number];
const DEFAULT_CATEGORIES = ['Bedtime', 'Screens', 'Mealtime', 'Transitions', 'Hygiene', 'Tantrums', 'Morning Routines', 'Social'];
const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard'] as const;

type ScriptRow = Database['public']['Tables']['scripts']['Row'];
type ScriptInsert = Database['public']['Tables']['scripts']['Insert'];

// CSV Template for hyper-specific scripts (exact format that works)
const CSV_TEMPLATE = `title,category,profile,tags,age_min,age_max,difficulty,duration_minutes,emergency_suitable,the_situation,what_doesnt_work,strategy_steps,why_this_works,what_to_expect,common_variations,parent_state_needed
"Toothbrush bristles feel 'scratchy' - clamps mouth shut",Hygiene,INTENSE,"toothbrush,teeth,hygiene,oral,sensory",3,10,Moderate,3,true,"Bedtime routine. Time to brush teeth. Child sees the toothbrush and starts backing away, crying, or clamping their mouth shut tight.

They might gag dramatically just from seeing the toothbrush, say the bristles ""hurt,"" complain about the mint flavor being ""too spicy,"" or fight you physically to avoid brushing. Past attempts have turned into wrestling matches.

Their oral sensory sensitivity is real - what feels like gentle brushing to you genuinely feels like sandpaper scraping their gums to them. You're exhausted, bedtime is already late, and you just need teeth brushed without a 20-minute battle.","• ""Open your mouth RIGHT NOW!""
• ""Everyone brushes their teeth! You're going to get cavities!""
• ""I'm counting to three... ONE... TWO...""
• ""Fine, NO stories tonight if you don't brush!""
• Physically forcing their mouth open while they cry

→ Forcing the toothbrush in: Creates genuine oral trauma and makes tomorrow worse
→ Threats and consequences: Increases anxiety, doesn't address the sensory pain
→ Arguing it ""doesn't hurt"": You're debating their neurological reality
→ Making it a power struggle: They fight harder to maintain control over their body","[{""step_number"":1,""step_title"":""ACKNOWLEDGE THE SENSORY EXPERIENCE"",""step_explanation"":""Don't minimize or argue about whether it actually hurts. To their mouth, it does."",""what_to_say_examples"":[""Your mouth hates the toothbrush."",""I know the bristles feel scratchy to you."",""Yeah, that texture is rough for your gums."",""The foam makes you gag. I get it.""]},{""step_number"":2,""step_title"":""HOLD THE BOUNDARY (teeth need cleaning)"",""step_explanation"":""Teeth brushing is non-negotiable, but HOW we do it is flexible."",""what_to_say_examples"":[""Teeth gotta get clean every night."",""Not skipping brushing, but we can change how."",""Your teeth need it. Let's figure out a way that works."",""Brushing is happening. You pick the method.""]},{""step_number"":3,""step_title"":""OFFER SENSORY-FRIENDLY OPTIONS"",""step_explanation"":""Give them control over the sensory input within safe limits."",""what_to_say_examples"":[""Wet brush, no paste. You do it yourself. Or regular paste, I do it fast."",""Extra soft bristles, or use your finger with paste. You choose."",""Just the front teeth tonight with paste, or all teeth with water only."",""You brush for 30 seconds, or I brush for 15 seconds. Pick."",""Washcloth with water on your teeth, or the brush. What works?""]}]","INTENSE kids have heightened oral-tactile sensitivity. Their insular cortex (processes internal body sensations) is on overdrive. Standard toothbrush bristles genuinely feel like sandpaper. Mint flavor can trigger intense taste aversion. Foaming toothpaste activates their gag reflex more easily than typical kids.

Their amygdala has formed negative associations with toothbrushing from past sensory overload. Each attempt triggers anticipatory anxiety - their Default Mode Network replays past ""toothbrush = pain"" experiences before the brush even touches their mouth.

Offering sensory-reduced options (wet brush/no paste, finger instead of brush, washcloth) lowers the sensory assault while still achieving the goal: clean teeth. Giving them control over the method engages their prefrontal cortex (decision-making) instead of keeping them stuck in amygdala panic.

The key: You're not eliminating tooth brushing. You're reducing sensory input to tolerable levels while building positive associations over time.","{""first_30_seconds"":""Still resistant, but stops escalating once they realize forcing isn't happening. May test your seriousness about the options. Breathing slows slightly."",""by_90_seconds"":""Usually chooses an option (most pick wet-brush-self or finger method). Still complaining but cooperating. Mouth tension reduces. May rush through it quickly."",""dont_expect"":[""Instant happy cooperation"",""Perfect 2-minute brushing technique"",""Them to admit the toothbrush doesn't actually hurt"",""Zero complaints or whining""],""this_is_success"":""Teeth get brushed (even if imperfectly) without full meltdown. Still grumpy? Normal. Rushed through it? Fine. Teeth got some cleaning? WIN.""}","[{""variation_scenario"":""If they choose finger but then refuse to actually brush"",""variation_response"":""You picked finger. Do it now, or I do it with the brush. Ten seconds to start.""},{""variation_scenario"":""If they say yes then clamp mouth shut again"",""variation_response"":""Your mouth changed its mind. Okay. Washcloth on front teeth only tonight. That's the deal.""},{""variation_scenario"":""If they're so dysregulated they can't engage with any option"",""variation_response"":""Too overwhelmed tonight. Drink water, swish it around, spit. That's all. We try again tomorrow.""},{""variation_scenario"":""If they want to skip brushing entirely"",""variation_response"":""Not an option. But you can pick the lowest-sensory method. What's easiest for your mouth?""}]","Calm, firm, patient, neutral tone. If you're frustrated, they sense it and resist harder."`;

interface AdminScriptsTabProps {
  onContentChanged?: () => void;
}

export function AdminScriptsTab({ onContentChanged }: AdminScriptsTabProps) {
  const [scripts, setScripts] = useState<ScriptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [deleteScriptId, setDeleteScriptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProfile, setFilterProfile] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'profile'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Form state - hyper-specific
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [formProfile, setFormProfile] = useState(BRAIN_PROFILES[0]);
  const [formTags, setFormTags] = useState('');
  const [formAgeMin, setFormAgeMin] = useState('3');
  const [formAgeMax, setFormAgeMax] = useState('10');
  const [formDifficulty, setFormDifficulty] = useState('Moderate');
  const [formDuration, setFormDuration] = useState('5');
  const [formEmergency, setFormEmergency] = useState(false);
  const [formSituation, setFormSituation] = useState('');
  const [formWhatDoesntWork, setFormWhatDoesntWork] = useState('');
  const [formWhyThisWorks, setFormWhyThisWorks] = useState('');
  const [formParentState, setFormParentState] = useState('');

  const categoryOptions = useMemo(() => {
    const categories = new Set(DEFAULT_CATEGORIES);
    scripts.forEach((script) => {
      if (script.category) categories.add(script.category);
    });
    return Array.from(categories);
  }, [scripts]);

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load scripts', error);
      toast.error(error.message);
    } else {
      setScripts(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory(DEFAULT_CATEGORIES[0]);
    setFormProfile(BRAIN_PROFILES[0]);
    setFormTags('');
    setFormAgeMin('3');
    setFormAgeMax('10');
    setFormDifficulty('Moderate');
    setFormDuration('5');
    setFormEmergency(false);
    setFormSituation('');
    setFormWhatDoesntWork('');
    setFormWhyThisWorks('');
    setFormParentState('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);

    const payload: ScriptInsert = {
      title: formTitle.trim(),
      category: formCategory.trim(),
      profile: formProfile.trim(),
      tags: formTags ? formTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      age_min: parseInt(formAgeMin) || 3,
      age_max: parseInt(formAgeMax) || 10,
      difficulty: formDifficulty as any,
      duration_minutes: parseInt(formDuration) || 5,
      emergency_suitable: formEmergency,
      the_situation: formSituation.trim() || null,
      what_doesnt_work: formWhatDoesntWork.trim() || null,
      why_this_works: formWhyThisWorks.trim() || null,
      parent_state_needed: formParentState.trim() || null,
      // Legacy fields for backward compatibility
      phrase_1: 'See strategy steps',
      phrase_2: 'See strategy steps',
      phrase_3: 'See strategy steps',
      phrase_1_action: 'Connection',
      phrase_2_action: 'Validation',
      phrase_3_action: 'Neurological Command',
      wrong_way: formWhatDoesntWork.trim() || '',
      neurological_tip: formWhyThisWorks.trim() || '',
    };

    const result = editingId
      ? await supabase.from('scripts').update(payload).eq('id', editingId)
      : await supabase.from('scripts').insert(payload);

    setSaving(false);

    if (result.error) {
      console.error('Failed to save script', result.error);
      toast.error(result.error.message);
      return;
    }

    toast.success(editingId ? 'Script updated!' : 'Script created!');
    resetForm();
    await fetchScripts();
    onContentChanged?.();
  };

  const handleEdit = (script: ScriptRow) => {
    setEditingId(script.id);
    setFormTitle(script.title);
    setFormCategory(script.category);
    setFormProfile(script.profile as BrainProfile);
    setFormTags(Array.isArray(script.tags) ? script.tags.join(', ') : '');
    setFormAgeMin(String(script.age_min || 3));
    setFormAgeMax(String(script.age_max || 10));
    setFormDifficulty(script.difficulty || 'Moderate');
    setFormDuration(String(script.duration_minutes || 5));
    setFormEmergency(script.emergency_suitable || false);
    setFormSituation(script.the_situation || '');
    setFormWhatDoesntWork(script.what_doesnt_work || '');
    setFormWhyThisWorks(script.why_this_works || '');
    setFormParentState(script.parent_state_needed || '');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('scripts').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete script', error);
      toast.error(error.message);
      return;
    }

    toast.success('Script deleted');
    setDeleteScriptId(null);
    await fetchScripts();
    onContentChanged?.();
  };

  const triggerBulkUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processCsvFile(file);
    }
  };

  const processCsvFile = async (file: File) => {
    setBulkImporting(true);

    try {
      const text = await file.text();

      // Use PapaParse for robust CSV parsing
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: async (results) => {
          const rows = results.data as Record<string, string>[];

          if (rows.length === 0) {
            toast.error('CSV file is empty');
            setBulkImporting(false);
            return;
          }

          let successCount = 0;
          const errors: string[] = [];

          for (const [index, values] of rows.entries()) {
            try {
              // Parse JSON fields with better error handling
              let strategySteps = null;
              if (values.strategy_steps && values.strategy_steps.trim()) {
                try {
                  strategySteps = JSON.parse(values.strategy_steps);
                } catch (e) {
                  console.error(`Row ${index + 2}: Failed to parse strategy_steps`, e);
                  console.log('Raw value:', values.strategy_steps);
                  errors.push(`Row ${index + 2}: Invalid JSON in strategy_steps`);
                  continue;
                }
              }

              let whatToExpect = null;
              if (values.what_to_expect && values.what_to_expect.trim()) {
                try {
                  whatToExpect = JSON.parse(values.what_to_expect);
                } catch (e) {
                  console.error(`Row ${index + 2}: Failed to parse what_to_expect`, e);
                  console.log('Raw value:', values.what_to_expect);
                  errors.push(`Row ${index + 2}: Invalid JSON in what_to_expect`);
                  continue;
                }
              }

              let commonVariations = null;
              if (values.common_variations && values.common_variations.trim()) {
                try {
                  commonVariations = JSON.parse(values.common_variations);
                } catch (e) {
                  console.error(`Row ${index + 2}: Failed to parse common_variations`, e);
                  console.log('Raw value:', values.common_variations);
                  errors.push(`Row ${index + 2}: Invalid JSON in common_variations`);
                  continue;
                }
              }

              // Validate difficulty value
              const difficulty = values.difficulty?.trim() || 'Moderate';
              if (!['Easy', 'Moderate', 'Hard'].includes(difficulty)) {
                errors.push(`Row ${index + 2}: Invalid difficulty "${difficulty}". Must be Easy, Moderate, or Hard`);
                continue;
              }

              const scriptData: ScriptInsert = {
                title: values.title?.trim() || '',
                category: values.category?.trim() || 'General',
                profile: values.profile?.trim() || 'INTENSE',
                tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                age_min: parseInt(values.age_min) || 3,
                age_max: parseInt(values.age_max) || 10,
                difficulty: difficulty as any,
                duration_minutes: parseInt(values.duration_minutes) || 5,
                emergency_suitable: values.emergency_suitable?.toLowerCase() === 'true',
                the_situation: values.the_situation?.trim() || null,
                what_doesnt_work: values.what_doesnt_work?.trim() || null,
                strategy_steps: strategySteps,
                why_this_works: values.why_this_works?.trim() || null,
                what_to_expect: whatToExpect,
                common_variations: commonVariations,
                parent_state_needed: values.parent_state_needed?.trim() || null,
                // Legacy fields
                phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || 'See strategy steps',
                phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || 'See strategy steps',
                phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || 'See strategy steps',
                phrase_1_action: strategySteps?.[0]?.step_title || 'Connection',
                phrase_2_action: strategySteps?.[1]?.step_title || 'Validation',
                phrase_3_action: strategySteps?.[2]?.step_title || 'Neurological Command',
                wrong_way: values.what_doesnt_work?.trim() || '',
                neurological_tip: values.why_this_works?.trim() || '',
              };

              if (!scriptData.title) {
                errors.push(`Row ${index + 2}: Title is required`);
                continue;
              }

              const { error } = await supabase.from('scripts').insert(scriptData);

              if (error) {
                errors.push(`Row ${index + 2}: ${error.message}`);
                console.error(`Row ${index + 2} error:`, error);
              } else {
                successCount++;
              }
            } catch (e) {
              errors.push(`Row ${index + 2}: ${e instanceof Error ? e.message : 'Unknown error'}`);
              console.error(`Row ${index + 2} exception:`, e);
            }
          }

          if (successCount > 0) {
            toast.success(`✅ Imported ${successCount} script${successCount === 1 ? '' : 's'}!`);
            await fetchScripts();
            onContentChanged?.();
          }

          if (errors.length > 0) {
            console.error('CSV import errors:', errors);
            toast.error(`❌ ${errors.length} row${errors.length === 1 ? '' : 's'} failed. Check console for details.`);
          }

          setBulkImporting(false);
        },
        error: (error) => {
          toast.error(`CSV parsing error: ${error.message}`);
          console.error('PapaParse error:', error);
          setBulkImporting(false);
        }
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import CSV';
      toast.error(message);
      console.error('CSV import error:', error);
      setBulkImporting(false);
    }
  };

  const handleBulkFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processCsvFile(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE);
    setCopied(true);
    toast.success('CSV template copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script-template-hyper-specific.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  // Filtered and sorted scripts
  const filteredScripts = useMemo(() => {
    let filtered = scripts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          (Array.isArray(s.tags) && s.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (filterProfile !== 'all') {
      filtered = filtered.filter((s) => s.profile === filterProfile);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === filterCategory);
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'profile') {
      filtered.sort((a, b) => a.profile.localeCompare(b.profile));
    }

    return filtered;
  }, [scripts, searchQuery, filterProfile, filterCategory, sortBy]);

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-dashed border-blue-300 dark:border-blue-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk CSV Import (Hyper-Specific Format)
              </h2>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Upload CSV files with complete hyper-specific script structure
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyTemplate} variant="outline" size="sm">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy Template
              </Button>
              <Button onClick={downloadTemplate} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50'
                : 'border-blue-300 dark:border-blue-700 bg-white/50 dark:bg-slate-900/50'
            }`}
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium mb-2">
              {isDragging ? 'Drop CSV file here' : 'Drag and drop CSV file'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button onClick={triggerBulkUpload} disabled={bulkImporting} variant="default">
              {bulkImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Browse CSV File
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleBulkFileChange}
            />
          </div>

          {/* Format Info */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">📋 Required CSV Columns:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">title</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">category</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">profile</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">the_situation</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">what_doesnt_work</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">strategy_steps</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">why_this_works</code>
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">what_to_expect</code>
            </div>
            <p className="mt-2 text-blue-700 dark:text-blue-300">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              JSON fields (strategy_steps, what_to_expect, common_variations) must be properly escaped
            </p>
          </div>
        </div>
      </Card>

      {/* Scripts List */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Existing Scripts ({filteredScripts.length})</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchScripts} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs mb-2">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search scripts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2">Profile</Label>
                  <Select value={filterProfile} onValueChange={setFilterProfile}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Profiles</SelectItem>
                      {BRAIN_PROFILES.map((profile) => (
                        <SelectItem key={profile} value={profile}>
                          {profile}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2">Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2">Sort By</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Scripts Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScripts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {loading ? 'Loading scripts…' : 'No scripts found. Try adjusting your filters or upload a CSV.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScripts.map((script) => (
                    <TableRow key={script.id}>
                      <TableCell className="font-medium max-w-xs truncate" title={script.title}>
                        {script.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{script.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{script.profile}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(script.difficulty)}>
                          {script.difficulty || 'Moderate'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {script.age_min || 3}-{script.age_max || 10}y
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(script)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteScriptId(script.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Create/Edit Form - Simplified for now, can be expanded */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit Script' : 'Create New Script'}</h2>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Toothbrush feels scratchy - clamps mouth shut"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="profile">Profile</Label>
              <Select value={formProfile} onValueChange={(v) => setFormProfile(v as BrainProfile)}>
                <SelectTrigger id="profile">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAIN_PROFILES.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formDifficulty} onValueChange={setFormDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age-min">Age Min</Label>
              <Input
                id="age-min"
                type="number"
                value={formAgeMin}
                onChange={(e) => setFormAgeMin(e.target.value)}
                min="0"
                max="18"
              />
            </div>
            <div>
              <Label htmlFor="age-max">Age Max</Label>
              <Input
                id="age-max"
                type="number"
                value={formAgeMax}
                onChange={(e) => setFormAgeMax(e.target.value)}
                min="0"
                max="18"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="toothbrush, teeth, hygiene"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                min="1"
                max="30"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formEmergency}
                  onChange={(e) => setFormEmergency(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Emergency Suitable</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="situation">The Situation</Label>
            <Textarea
              id="situation"
              value={formSituation}
              onChange={(e) => setFormSituation(e.target.value)}
              placeholder="Describe the specific scenario in vivid detail..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="what-doesnt-work">What Doesn't Work</Label>
            <Textarea
              id="what-doesnt-work"
              value={formWhatDoesntWork}
              onChange={(e) => setFormWhatDoesntWork(e.target.value)}
              placeholder="Bullet list of phrases that don't work and why..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="why-works">Why This Works</Label>
            <Textarea
              id="why-works"
              value={formWhyThisWorks}
              onChange={(e) => setFormWhyThisWorks(e.target.value)}
              placeholder="Accessible neuroscience explanation (3-4 paragraphs)..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="parent-state">Parent State Needed</Label>
            <Input
              id="parent-state"
              value={formParentState}
              onChange={(e) => setFormParentState(e.target.value)}
              placeholder="e.g., Calm, patient, non-reactive"
            />
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">
                  ⚠️ ATENÇÃO: Para Upload Completo, Use CSV!
                </h3>

                <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Este formulário cria scripts SIMPLIFICADOS (sem strategy_steps, what_to_expect, common_variations).
                  </p>
                  <p className="text-amber-800 dark:text-amber-200">
                    Para scripts hyper-específicos COMPLETOS com todas as 6 seções, use o <strong>CSV Upload</strong> acima.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">📋 Campos do CSV (ordem exata):</p>
                  <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 font-mono text-xs">
                    <code className="text-blue-600 dark:text-blue-400">
                      title,category,profile,tags,age_min,age_max,difficulty,duration_minutes,emergency_suitable,
                      the_situation,what_doesnt_work,strategy_steps,why_this_works,what_to_expect,
                      common_variations,parent_state_needed
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">✅ Required Fields:</p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-amber-800 dark:text-amber-200 ml-4">
                    <li><code>title</code> - Specific title (ex: "Toothbrush feels scratchy - clamps mouth shut")</li>
                    <li><code>category</code> - Bedtime, Hygiene, Screens, Mealtime, etc.</li>
                    <li><code>profile</code> - INTENSE, DISTRACTED or DEFIANT (UPPERCASE)</li>
                    <li><code>the_situation</code> - 2-3 paragraphs describing specific scenario</li>
                    <li><code>what_doesnt_work</code> - List of phrases that don't work with "•" and "→"</li>
                    <li><code>strategy_steps</code> - JSON array with 3 steps (see template)</li>
                    <li><code>why_this_works</code> - 3-4 paragraphs of accessible neuroscience</li>
                    <li><code>what_to_expect</code> - JSON object with timeline (first_30_seconds, by_90_seconds, etc.)</li>
                    <li><code>common_variations</code> - JSON array com variações situacionais</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">🔧 Formato JSON Correto:</p>
                  <div className="bg-slate-900 text-green-400 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                    <div><span className="text-gray-500">// strategy_steps (3 passos com 4-5 exemplos cada):</span></div>
                    <div className="text-yellow-300">[{`{`}"step_number":1,"step_title":"ACKNOWLEDGE IT'S REAL","step_explanation":"...","what_to_say_examples":["Example 1","Example 2"]{`}`}]</div>
                    <br />
                    <div><span className="text-gray-500">// what_to_expect (timeline object):</span></div>
                    <div className="text-yellow-300">{`{`}"first_30_seconds":"...","by_90_seconds":"...","dont_expect":["..."],"this_is_success":"..."{`}`}</div>
                    <br />
                    <div><span className="text-gray-500">// common_variations (array de variações):</span></div>
                    <div className="text-yellow-300">[{`{`}"variation_scenario":"If X happens","variation_response":"Say Y"{`}`}]</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">⚡ Atalhos Rápidos:</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={copyTemplate}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      Copiar Template Completo
                    </Button>
                    <Button
                      type="button"
                      onClick={downloadTemplate}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download .csv
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    <strong>✅ Recomendação:</strong> Use o template como base, copie para Excel/Google Sheets,
                    preencha os dados, e salve como .csv. Depois faça upload na seção azul acima.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              editingId ? 'Update Script' : 'Create Script'
            )}
          </Button>
        </form>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteScriptId !== null} onOpenChange={() => setDeleteScriptId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the script. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteScriptId && handleDelete(deleteScriptId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

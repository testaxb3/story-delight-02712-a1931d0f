import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

// Quality criteria for NEP scripts
const QUALITY_CRITERIA = {
  phrase_1: {
    minWords: 3,
    maxWords: 15,
    description: 'CONNECTION phrase should be 3-15 words'
  },
  phrase_2: {
    mustContain: 'AND',
    minWords: 10,
    maxWords: 30,
    description: 'VALIDATION must contain AND and be 10-30 words'
  },
  phrase_3: {
    minWords: 5,
    maxWords: 25,
    mustHaveChoice: true, // Should have "or", "choose", "pick", "count"
    description: 'COMMAND should be 5-25 words with choice/consequence'
  },
  wrong_way: {
    minLength: 20,
    description: 'Wrong way example must be substantive'
  },
  neurological_tip: {
    minWords: 20,
    mustMentionProfile: true,
    description: 'Must explain WHY for this profile (20+ words)'
  },
  situation_trigger: {
    minWords: 10,
    description: 'Situation must be specific (10+ words)'
  }
};

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

function validateScript(script) {
  const issues = [];
  const warnings = [];
  let qualityScore = 100;

  // Check phrase_1 (CONNECTION)
  const p1Words = countWords(script.phrase_1);
  if (p1Words < QUALITY_CRITERIA.phrase_1.minWords) {
    issues.push(`Phrase 1 too short (${p1Words} words, need ${QUALITY_CRITERIA.phrase_1.minWords}+)`);
    qualityScore -= 15;
  } else if (p1Words > QUALITY_CRITERIA.phrase_1.maxWords) {
    warnings.push(`Phrase 1 too long (${p1Words} words, recommend ${QUALITY_CRITERIA.phrase_1.maxWords} max)`);
    qualityScore -= 5;
  }

  // Check phrase_2 (VALIDATION) - MUST have AND
  const p2Words = countWords(script.phrase_2);
  if (!script.phrase_2 || !script.phrase_2.includes('AND')) {
    issues.push('Phrase 2 missing "AND" (validation structure broken)');
    qualityScore -= 20;
  }
  if (p2Words < QUALITY_CRITERIA.phrase_2.minWords) {
    issues.push(`Phrase 2 too short (${p2Words} words, need ${QUALITY_CRITERIA.phrase_2.minWords}+)`);
    qualityScore -= 10;
  }

  // Check phrase_3 (COMMAND) - Should have choice markers
  const p3Words = countWords(script.phrase_3);
  const hasChoice = /\bor\b|\bchoose\b|\bpick\b|\bcount\b|\bthree\b|\btwo\b|\bone\b/i.test(script.phrase_3);
  if (!hasChoice) {
    warnings.push('Phrase 3 missing clear choice/consequence indicators');
    qualityScore -= 10;
  }
  if (p3Words < QUALITY_CRITERIA.phrase_3.minWords) {
    issues.push(`Phrase 3 too short (${p3Words} words, need ${QUALITY_CRITERIA.phrase_3.minWords}+)`);
    qualityScore -= 10;
  }

  // Check wrong_way
  if (!script.wrong_way || script.wrong_way.length < QUALITY_CRITERIA.wrong_way.minLength) {
    issues.push('Wrong way example missing or too short');
    qualityScore -= 15;
  }

  // Check neurological_tip - must mention profile
  const tipWords = countWords(script.neurological_tip);
  const mentionsProfile = script.neurological_tip &&
    script.neurological_tip.toUpperCase().includes(script.profile);

  if (!mentionsProfile) {
    issues.push(`Neurological tip doesn't mention ${script.profile} profile`);
    qualityScore -= 15;
  }
  if (tipWords < QUALITY_CRITERIA.neurological_tip.minWords) {
    warnings.push(`Neurological tip too short (${tipWords} words, recommend ${QUALITY_CRITERIA.neurological_tip.minWords}+)`);
    qualityScore -= 5;
  }

  // Check situation_trigger
  const situationWords = countWords(script.situation_trigger);
  if (situationWords < QUALITY_CRITERIA.situation_trigger.minWords) {
    warnings.push(`Situation trigger vague (${situationWords} words, recommend ${QUALITY_CRITERIA.situation_trigger.minWords}+)`);
    qualityScore -= 5;
  }

  // Check for generic/placeholder text
  const genericPhrases = ['child', 'parent', 'situation', 'behavior', 'issue'];
  const titleLower = script.title.toLowerCase();
  if (genericPhrases.some(phrase => titleLower.includes(phrase) && titleLower.split(' ').length < 4)) {
    warnings.push('Title may be too generic');
    qualityScore -= 5;
  }

  return {
    id: script.id,
    title: script.title,
    profile: script.profile,
    category: script.category,
    qualityScore: Math.max(0, qualityScore),
    issues,
    warnings,
    isValid: issues.length === 0,
    needsReview: issues.length > 0 || warnings.length > 2
  };
}

async function analyzeAllScripts() {
  console.log('🔍 Analyzing script quality...\n');

  const { data: allScripts, error } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scripts:', error);
    return;
  }

  console.log(`📊 Total scripts: ${allScripts.length}\n`);

  const results = allScripts.map(validateScript);

  // Categorize by quality
  const excellent = results.filter(r => r.qualityScore >= 90);
  const good = results.filter(r => r.qualityScore >= 70 && r.qualityScore < 90);
  const needsWork = results.filter(r => r.qualityScore >= 50 && r.qualityScore < 70);
  const poor = results.filter(r => r.qualityScore < 50);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 QUALITY DISTRIBUTION:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Excellent (90-100): ${excellent.length} scripts`);
  console.log(`👍 Good (70-89): ${good.length} scripts`);
  console.log(`⚠️  Needs Work (50-69): ${needsWork.length} scripts`);
  console.log(`❌ Poor (<50): ${poor.length} scripts`);
  console.log('');

  // Show poor quality scripts in detail
  if (poor.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`❌ POOR QUALITY SCRIPTS (${poor.length} total):`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    poor.forEach((result, idx) => {
      console.log(`${idx + 1}. "${result.title}" [${result.profile}/${result.category}]`);
      console.log(`   Score: ${result.qualityScore}/100`);
      console.log(`   ID: ${result.id}`);
      if (result.issues.length > 0) {
        console.log(`   ❌ Issues:`);
        result.issues.forEach(issue => console.log(`      - ${issue}`));
      }
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings:`);
        result.warnings.forEach(warning => console.log(`      - ${warning}`));
      }
      console.log('');
    });
  }

  // Show needs work scripts summary
  if (needsWork.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⚠️  NEEDS WORK (${needsWork.length} total):`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    needsWork.forEach((result, idx) => {
      console.log(`${idx + 1}. "${result.title}" [${result.profile}/${result.category}] - Score: ${result.qualityScore}/100`);
      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`   ❌ ${issue}`));
      }
    });
    console.log('');
  }

  // Check for duplicate situations within same category+profile
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 CHECKING FOR DUPLICATES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const grouped = {};
  allScripts.forEach(script => {
    const key = `${script.profile}-${script.category}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(script);
  });

  let duplicatesFound = 0;
  Object.entries(grouped).forEach(([key, scripts]) => {
    if (scripts.length <= 1) return;

    // Check for very similar phrase_1 or titles
    for (let i = 0; i < scripts.length; i++) {
      for (let j = i + 1; j < scripts.length; j++) {
        const similarity = calculateSimilarity(scripts[i].phrase_1, scripts[j].phrase_1);
        if (similarity > 0.7) {
          console.log(`⚠️  Possible duplicate in ${key}:`);
          console.log(`   "${scripts[i].title}" (${scripts[i].id})`);
          console.log(`   "${scripts[j].title}" (${scripts[j].id})`);
          console.log(`   Similarity: ${(similarity * 100).toFixed(0)}%\n`);
          duplicatesFound++;
        }
      }
    }
  });

  if (duplicatesFound === 0) {
    console.log('✅ No significant duplicates found\n');
  }

  // Generate deletion candidates file
  const deletionCandidates = poor.map(r => r.id);

  if (deletionCandidates.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 RECOMMENDED ACTIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Found ${deletionCandidates.length} scripts recommended for deletion.`);
    console.log(`Run: node delete-poor-scripts.mjs`);
    console.log('');

    // Save IDs to file for deletion script
    const fs = await import('fs');
    fs.writeFileSync(
      'poor-scripts-to-delete.json',
      JSON.stringify({ ids: deletionCandidates, count: deletionCandidates.length }, null, 2)
    );
    console.log('✅ Saved deletion list to: poor-scripts-to-delete.json\n');
  }

  // Summary by profile
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 QUALITY BY PROFILE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  ['INTENSE', 'DISTRACTED', 'DEFIANT'].forEach(profile => {
    const profileScripts = results.filter(r => r.profile === profile);
    const avgScore = profileScripts.reduce((sum, r) => sum + r.qualityScore, 0) / profileScripts.length;
    const poorCount = profileScripts.filter(r => r.qualityScore < 50).length;

    console.log(`${profile}:`);
    console.log(`  Total: ${profileScripts.length} scripts`);
    console.log(`  Average Score: ${avgScore.toFixed(1)}/100`);
    console.log(`  Poor Quality: ${poorCount} scripts`);
    console.log('');
  });
}

function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = [...set1].filter(word => set2.has(word));
  const union = new Set([...set1, ...set2]);

  return intersection.length / union.size;
}

analyzeAllScripts();

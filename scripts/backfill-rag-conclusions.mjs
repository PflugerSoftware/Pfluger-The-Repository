/**
 * Backfill RAG conclusions on project_blocks
 *
 * Deterministically extracts citable facts from block data JSONB.
 * Also fills searchable_text, summary, and tags for 3 empty X26-RB01 blocks.
 *
 * Usage:
 *   node scripts/backfill-rag-conclusions.mjs          # dry-run (prints what would update)
 *   node scripts/backfill-rag-conclusions.mjs --apply   # actually writes to DB
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ---------------------------------------------------------------------------
// ENV + SUPABASE SETUP
// ---------------------------------------------------------------------------

const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const dryRun = !process.argv.includes('--apply');

// ---------------------------------------------------------------------------
// EXTRACTOR FUNCTIONS (one per block type)
// ---------------------------------------------------------------------------

function extractStatGrid(data) {
  const stats = data.stats || [];
  return stats
    .filter(s => s.value && s.label)
    .map(s => {
      let c = `${s.label}: ${s.value}`;
      if (s.detail) c += ` (${s.detail})`;
      return c;
    });
}

function extractKeyFindings(data) {
  const findings = data.findings || [];
  return findings
    .filter(f => f.title && f.value)
    .map(f => {
      let c = `${f.title}: ${f.value}`;
      if (f.detail) c += `. ${f.detail}`;
      return c;
    });
}

function extractBarChart(data) {
  const unit = (data.unit || '').trim();

  // Handle grouped bar charts (e.g. energy-options with groupedBars)
  if (data.groupedBars && data.groupedBars.length > 0) {
    const conclusions = [];
    for (const bar of data.groupedBars) {
      const allItems = (bar.groups || []).flatMap(g => g.items || []);
      const total = allItems.reduce((sum, item) => sum + (item.value || 0), 0);
      conclusions.push(`${bar.title}: total ${total.toFixed(1)}${unit}`);
      for (const item of allItems) {
        conclusions.push(`${bar.title} - ${item.label}: ${item.value}${unit}`);
      }
    }
    return conclusions;
  }

  // Standard bar chart with items array
  const items = data.items || [];
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const conclusions = [];
  if (sorted.length > 0) {
    conclusions.push(`${sorted[0].label} was highest at ${sorted[0].value}${unit}`);
  }
  if (sorted.length > 1) {
    conclusions.push(`${sorted[sorted.length - 1].label} was lowest at ${sorted[sorted.length - 1].value}${unit}`);
  }
  // Include all items as facts
  for (const item of sorted.slice(1, -1)) {
    conclusions.push(`${item.label}: ${item.value}${unit}`);
  }
  return conclusions;
}

function extractDonutChart(data) {
  const segments = data.segments || [];
  if (segments.length === 0) return [];
  const total = data.total || segments.reduce((sum, s) => sum + s.value, 0);
  const sorted = [...segments].sort((a, b) => b.value - a.value);
  const conclusions = [];
  for (const seg of sorted) {
    const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : '?';
    conclusions.push(`${seg.label}: $${seg.value.toLocaleString()} (${pct}% of total)`);
  }
  if (total > 0) {
    conclusions.push(`Total: $${total.toLocaleString()}`);
  }
  return conclusions;
}

function extractComparisonTable(data) {
  const headers = data.headers || [];
  const rows = data.rows || [];
  const conclusions = [];
  for (const row of rows) {
    if (!row.label || !row.values) continue;
    const parts = row.values.map((v, i) => `${headers[i + 1] || `Col ${i + 1}`}: ${v}`);
    let c = `${row.label} - ${parts.join(', ')}`;
    if (row.highlight) c += ' [highlighted]';
    conclusions.push(c);
  }
  return conclusions;
}

function extractSurveyRating(data) {
  const conclusions = [];
  if (data.title) {
    conclusions.push(`Survey topic: ${data.title}`);
  }
  if (data.averageRating != null) {
    conclusions.push(`Average rating: ${data.averageRating} out of 5`);
  }
  if (data.totalResponses != null) {
    conclusions.push(`Total responses: ${data.totalResponses}`);
  }
  const ratings = data.ratings || [];
  if (ratings.length > 0) {
    const sorted = [...ratings].sort((a, b) => b.count - a.count);
    conclusions.push(`Most common response: ${sorted[0].label} (${sorted[0].count} respondents)`);
  }
  return conclusions;
}

function extractFeedbackSummary(data) {
  const conclusions = [];
  const pos = data.positives;
  const con = data.concerns;
  if (pos) {
    if (pos.score != null) conclusions.push(`Positive sentiment score: ${pos.score}%`);
    for (const t of (pos.themes || []).slice(0, 3)) {
      conclusions.push(`Positive theme: ${t.theme} (${t.mentions} mentions)`);
    }
  }
  if (con) {
    if (con.score != null) conclusions.push(`Concern sentiment score: ${con.score}%`);
    for (const t of (con.themes || []).slice(0, 3)) {
      conclusions.push(`Concern: ${t.theme} (${t.mentions} mentions)`);
    }
  }
  return conclusions;
}

function extractQuotes(data) {
  const quotes = data.quotes || [];
  return quotes.map(q => {
    let c = `"${q.text}"`;
    if (q.author) c += ` - ${q.author}`;
    if (q.rating != null) c += ` (rating: ${q.rating}/5)`;
    return c;
  });
}

function extractCostBuilder(data) {
  const conclusions = [];
  if (data.baseTotal != null) {
    conclusions.push(`Base budget total: $${data.baseTotal.toLocaleString()}`);
  }
  if (data.area != null && data.baseTotal != null) {
    conclusions.push(`Cost per square foot: $${(data.baseTotal / data.area).toFixed(2)}/SF (${data.area.toLocaleString()} SF)`);
  }
  for (const alt of (data.alternates || [])) {
    const dir = alt.type === 'add' ? 'Add' : 'Deduct';
    conclusions.push(`${dir} alternate: ${alt.description} ($${Math.abs(alt.amount).toLocaleString()})`);
  }
  return conclusions;
}

function extractScenarioBarChart(data) {
  const scenarios = data.scenarios || [];
  if (scenarios.length === 0) return [];
  const conclusions = [];
  const sorted = [...scenarios].sort((a, b) => a.costPerSF - b.costPerSF);
  conclusions.push(`Lowest cost option: ${sorted[0].name} at $${sorted[0].costPerSF}/SF ($${sorted[0].total.toLocaleString()} total)`);
  conclusions.push(`Highest cost option: ${sorted[sorted.length - 1].name} at $${sorted[sorted.length - 1].costPerSF}/SF ($${sorted[sorted.length - 1].total.toLocaleString()} total)`);
  for (const s of scenarios) {
    conclusions.push(`${s.name}: $${s.costPerSF}/SF ($${s.total.toLocaleString()})`);
  }
  return conclusions;
}

function extractProductOptions(data) {
  // Handle product-lines format (lines -> options nested structure)
  if (data.lines && data.lines.length > 0) {
    const conclusions = [];
    for (const line of data.lines) {
      for (const opt of (line.options || [])) {
        const parts = [`${line.name} ${opt.name}`];
        if (opt.price != null) parts.push(`$${opt.price.toLocaleString()}`);
        for (const s of (opt.specs || []).slice(0, 3)) {
          parts.push(`${s.label}: ${s.value}`);
        }
        conclusions.push(parts.join(', '));
      }
    }
    return conclusions;
  }

  // Standard products/options format
  const products = data.products || data.options || [];
  return products.map(p => {
    const parts = [p.name || p.title];
    if (p.price) parts.push(p.price);
    const metrics = p.metrics || p.specs || [];
    for (const m of metrics.slice(0, 3)) {
      parts.push(`${m.label}: ${m.value}`);
    }
    return parts.join(', ');
  });
}

function extractToolComparison(data) {
  const tools = data.tools || [];
  return tools.map(t => {
    const parts = [`${t.name}: ${t.rating}/100 rating`];
    if (t.price) parts.push(t.price);
    if (t.category) parts.push(t.category);
    if (t.pros && t.pros.length > 0) parts.push(`Pros: ${t.pros.join(', ')}`);
    return parts.join('. ');
  });
}

function extractWorkflowSteps(data) {
  const steps = data.steps || [];
  const conclusions = [];
  for (const step of steps) {
    if (step.findings && step.findings.length > 0) {
      for (const f of step.findings) {
        conclusions.push(f);
      }
    }
    if (step.deliverables && step.deliverables.length > 0) {
      for (const d of step.deliverables) {
        conclusions.push(`Deliverable: ${d}`);
      }
    }
  }
  if (conclusions.length === 0) {
    // Fall back to step titles
    for (const step of steps) {
      conclusions.push(`Step ${step.number}: ${step.title}`);
    }
  }
  return conclusions;
}

function extractTimeline(data) {
  const events = data.events || [];
  const conclusions = [];
  if (events.length > 0) {
    conclusions.push(`Timeline spans ${events[0].date} to ${events[events.length - 1].date} with ${events.length} milestones`);
    const completed = events.filter(e => e.status === 'complete').length;
    if (completed > 0) {
      conclusions.push(`${completed} of ${events.length} milestones completed`);
    }
  }
  const workload = data.workload || [];
  if (workload.length > 0) {
    const totalHours = workload.reduce((sum, w) => sum + (w.hours || 0), 0);
    if (totalHours > 0) {
      conclusions.push(`Total research hours logged: ${totalHours}`);
    }
  }
  return conclusions;
}

function extractCaseStudyCard(data) {
  const studies = data.studies || [];
  const conclusions = [];
  for (const study of studies) {
    const metrics = study.metrics || [];
    for (const m of metrics) {
      conclusions.push(`${study.title} - ${m.label}: ${m.value}`);
    }
    if (study.strategies && study.strategies.length > 0) {
      conclusions.push(`${study.title} strategies: ${study.strategies.join(', ')}`);
    }
    if (study.keyResults && study.keyResults.length > 0) {
      for (const r of study.keyResults) {
        conclusions.push(`${study.title}: ${r}`);
      }
    }
    // Include description as a conclusion if it has concrete facts
    if (study.description && !conclusions.some(c => c.includes(study.title))) {
      conclusions.push(`${study.title}: ${study.description}`);
    }
  }
  return conclusions;
}

function extractActivityRings(data) {
  const rings = data.rings || [];
  return rings
    .filter(r => r.label && r.value != null)
    .map(r => {
      let c = `${r.label}: ${r.value}`;
      if (r.max != null) c += `/${r.max}`;
      if (r.unit) c += ` ${r.unit}`;
      return c;
    });
}

function extractLineChart(data) {
  const series = data.series || [];
  const conclusions = [];
  for (const s of series) {
    const points = s.data || s.points || [];
    if (points.length === 0) continue;
    const values = points.map(p => p.value || p.y).filter(v => v != null);
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      conclusions.push(`${s.name || s.label}: range ${min} to ${max}`);
    }
  }
  return conclusions;
}

// ---------------------------------------------------------------------------
// TEXT-CONTENT EXTRACTOR (prose analysis)
// ---------------------------------------------------------------------------

function extractTextContent(data) {
  const content = data.content || '';
  if (!content.trim()) return [];

  // Strip markdown formatting
  let text = content
    .replace(/#{1,6}\s+/g, '\n')        // headings to newlines (avoid merging with text)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');

  // Split into sentences (by period/newline boundaries)
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const conclusions = [];

  // Extract sentences with numbers, percentages, dollar values
  const numberPattern = /\d+[\d,.]*\s*(%|percent|hours|SF|sf|square feet|kBtu|EUI|students|teachers|classrooms|respondents|mentions|projects|years|months|days)/i;
  const moneyPattern = /\$[\d,]+/;

  for (const s of sentences) {
    if (numberPattern.test(s) || moneyPattern.test(s)) {
      conclusions.push(cleanSentence(s));
    }
  }

  // Extract sentences with assertion words
  const assertionPattern = /\b(recommended|preferred|demonstrates?|reduces?|improves?|requires?|established|exceeded|achieved|outperformed|increased|decreased|significant|critical|essential|optimal|key finding|main finding)\b/i;
  for (const s of sentences) {
    if (assertionPattern.test(s) && !conclusions.includes(cleanSentence(s))) {
      conclusions.push(cleanSentence(s));
    }
  }

  // Extract bullet points as conclusions (e.g. action items, lists)
  const bulletLines = content
    .split('\n')
    .map(l => l.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
    .filter(l => l.length > 15 && !l.startsWith('#'));
  for (const bl of bulletLines) {
    const clean = cleanSentence(bl.replace(/\*\*(.*?)\*\*/g, '$1'));
    if (clean.length > 15 && !conclusions.includes(clean)) {
      conclusions.push(clean);
    }
  }

  // If < 2 extractable facts, use first real sentence + bold phrases
  if (conclusions.length < 2) {
    // Find first sentence that's actually a sentence (>30 chars, not just a heading)
    const firstReal = sentences.find(s => s.length > 30 && /[.!?]$/.test(s));
    if (firstReal && !conclusions.includes(cleanSentence(firstReal))) {
      conclusions.unshift(cleanSentence(firstReal));
    }
    // Extract bold phrases from original content
    const boldMatches = content.match(/\*\*(.*?)\*\*/g);
    if (boldMatches) {
      for (const bm of boldMatches) {
        const phrase = bm.replace(/\*\*/g, '').trim();
        if (phrase.length > 15 && !conclusions.includes(phrase)) {
          conclusions.push(phrase);
        }
      }
    }
  }

  // Cap at 6
  return conclusions.slice(0, 6);
}

function cleanSentence(s) {
  return s.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
}

// ---------------------------------------------------------------------------
// FULL RAG FIELD GENERATORS (for 3 empty X26-RB01 blocks)
// ---------------------------------------------------------------------------

function generateSearchableText(blockType, data) {
  const parts = [];

  if (blockType === 'bar-chart') {
    const items = data.items || [];
    const unit = (data.unit || '').trim();
    parts.push(`Bar chart showing ${items.length} categories.`);
    for (const item of items) {
      parts.push(`${item.label}: ${item.value} ${unit}.`);
    }
  } else if (blockType === 'text-content') {
    const content = data.content || '';
    // Strip markdown, keep text
    parts.push(content
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
  } else if (blockType === 'quotes') {
    const quotes = data.quotes || [];
    for (const q of quotes) {
      let line = q.text;
      if (q.author) line += ` - ${q.author}`;
      parts.push(line);
    }
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function generateSummary(blockType, data, blockId) {
  if (blockType === 'bar-chart') {
    const items = data.items || [];
    const unit = (data.unit || '').trim();
    const unitLabel = unit.startsWith(' ') ? unit : ` ${unit}`;
    return `Bar chart comparing ${items.length} categories of storage feedback by${unitLabel}`;
  } else if (blockType === 'text-content') {
    const content = data.content || '';
    const firstLine = content.split('\n').find(l => l.trim().length > 0) || '';
    const clean = firstLine.replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').trim();
    return clean.length > 100 ? clean.slice(0, 100) + '...' : clean;
  } else if (blockType === 'quotes') {
    const quotes = data.quotes || [];
    return `Collection of ${quotes.length} stakeholder quotes about storage`;
  }
  return `${blockType} block (${blockId})`;
}

function generateTags(blockType, data, projectId) {
  const tags = [projectId.toLowerCase()];

  if (blockType === 'bar-chart') {
    tags.push('bar-chart', 'storage', 'classroom-storage', 'teacher-feedback');
    for (const item of (data.items || [])) {
      tags.push(item.label.toLowerCase().replace(/\s+/g, '-'));
    }
  } else if (blockType === 'text-content') {
    tags.push('text-content', 'storage', 'classroom-storage');
    // Extract key nouns from content
    const content = (data.content || '').toLowerCase();
    if (content.includes('lock')) tags.push('locking');
    if (content.includes('wardrobe')) tags.push('wardrobe');
    if (content.includes('mobile')) tags.push('mobile-units');
  } else if (blockType === 'quotes') {
    tags.push('quotes', 'storage', 'stakeholder-feedback', 'teacher-feedback');
  }

  return [...new Set(tags)];
}

// ---------------------------------------------------------------------------
// MAIN EXTRACTOR ROUTER
// ---------------------------------------------------------------------------

const extractors = {
  'stat-grid': extractStatGrid,
  'key-findings': extractKeyFindings,
  'bar-chart': extractBarChart,
  'donut-chart': extractDonutChart,
  'comparison-table': extractComparisonTable,
  'survey-rating': extractSurveyRating,
  'feedback-summary': extractFeedbackSummary,
  'quotes': extractQuotes,
  'cost-builder': extractCostBuilder,
  'scenario-bar-chart': extractScenarioBarChart,
  'product-options': extractProductOptions,
  'tool-comparison': extractToolComparison,
  'workflow-steps': extractWorkflowSteps,
  'timeline': extractTimeline,
  'case-study-card': extractCaseStudyCard,
  'activity-rings': extractActivityRings,
  'line-chart': extractLineChart,
  'text-content': extractTextContent,
};

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log(dryRun ? '\n=== DRY RUN (pass --apply to write) ===\n' : '\n=== APPLYING CHANGES ===\n');

  // Fetch all content blocks (exclude section, sources, image-gallery)
  const { data: blocks, error } = await supabase
    .from('project_blocks')
    .select('id, project_id, block_type, data, conclusions, searchable_text, summary, tags')
    .not('block_type', 'in', '("section","sources","image-gallery")')
    .order('project_id')
    .order('block_order');

  if (error) {
    console.error('Failed to fetch blocks:', error.message);
    process.exit(1);
  }

  console.log(`Fetched ${blocks.length} content blocks\n`);

  // -----------------------------------------------------------------------
  // PHASE 1: Backfill conclusions on blocks that have searchable_text but no conclusions
  // -----------------------------------------------------------------------
  console.log('--- Phase 1: Backfill conclusions ---\n');

  let phase1Count = 0;
  let phase1Skipped = 0;
  const flagged = []; // blocks with < 2 conclusions
  const samplesByType = {}; // for spot-checking

  for (const block of blocks) {
    // Skip blocks that already have conclusions
    if (block.conclusions && block.conclusions.length > 0) continue;
    // Skip blocks missing searchable_text (handled in Phase 2)
    if (!block.searchable_text || block.searchable_text.trim() === '') continue;

    const extractor = extractors[block.block_type];
    if (!extractor) {
      phase1Skipped++;
      continue;
    }

    const conclusions = extractor(block.data);
    if (conclusions.length === 0) {
      phase1Skipped++;
      continue;
    }

    if (conclusions.length < 2) {
      flagged.push({ id: block.id, type: block.block_type, count: conclusions.length });
    }

    // Track samples for spot-checking
    if (!samplesByType[block.block_type]) samplesByType[block.block_type] = [];
    if (samplesByType[block.block_type].length < 3) {
      samplesByType[block.block_type].push({ id: block.id, conclusions });
    }

    if (dryRun) {
      console.log(`[DRY] ${block.id} (${block.block_type}): ${conclusions.length} conclusions`);
    } else {
      const { error: updateError } = await supabase
        .from('project_blocks')
        .update({ conclusions })
        .eq('id', block.id);

      if (updateError) {
        console.error(`  ERROR updating ${block.id}: ${updateError.message}`);
      } else {
        console.log(`  Updated ${block.id}: ${conclusions.length} conclusions`);
      }
    }
    phase1Count++;
  }

  console.log(`\nPhase 1: ${phase1Count} blocks to update, ${phase1Skipped} skipped\n`);

  // -----------------------------------------------------------------------
  // PHASE 2: Full RAG fields for 3 empty X26-RB01 blocks
  // -----------------------------------------------------------------------
  console.log('--- Phase 2: Full RAG fields for empty blocks ---\n');

  let phase2Count = 0;

  for (const block of blocks) {
    if (block.searchable_text && block.searchable_text.trim() !== '') continue;

    const extractor = extractors[block.block_type];
    if (!extractor) continue;

    const conclusions = extractor(block.data);
    const searchableText = generateSearchableText(block.block_type, block.data);
    const summary = generateSummary(block.block_type, block.data, block.id);
    const tags = generateTags(block.block_type, block.data, block.project_id);

    const update = {
      conclusions,
      searchable_text: searchableText,
      summary,
      tags,
    };

    if (dryRun) {
      console.log(`[DRY] ${block.id} (${block.block_type}) - FULL fields:`);
      console.log(`  searchable_text: ${searchableText.slice(0, 80)}...`);
      console.log(`  summary: ${summary}`);
      console.log(`  tags: ${tags.join(', ')}`);
      console.log(`  conclusions (${conclusions.length}): ${conclusions.slice(0, 2).join('; ')}...`);
    } else {
      const { error: updateError } = await supabase
        .from('project_blocks')
        .update(update)
        .eq('id', block.id);

      if (updateError) {
        console.error(`  ERROR updating ${block.id}: ${updateError.message}`);
      } else {
        console.log(`  Updated ${block.id}: all RAG fields`);
      }
    }
    phase2Count++;
  }

  console.log(`\nPhase 2: ${phase2Count} blocks to update\n`);

  // -----------------------------------------------------------------------
  // PHASE 3: Verification
  // -----------------------------------------------------------------------
  console.log('--- Phase 3: Verification ---\n');

  if (!dryRun) {
    const { data: remaining, error: verifyError } = await supabase
      .from('project_blocks')
      .select('id, block_type, project_id')
      .not('block_type', 'in', '("section","sources","image-gallery")')
      .is('conclusions', null);

    if (verifyError) {
      console.error('Verification query failed:', verifyError.message);
    } else {
      console.log(`Blocks still missing conclusions: ${remaining.length}`);
      if (remaining.length > 0) {
        for (const r of remaining) {
          console.log(`  ${r.id} (${r.block_type}) - ${r.project_id}`);
        }
      }
    }
  } else {
    console.log('(Verification runs only with --apply)\n');
  }

  // Print flagged blocks (< 2 conclusions)
  if (flagged.length > 0) {
    console.log(`\nFlagged blocks (< 2 conclusions) for manual review:`);
    for (const f of flagged) {
      console.log(`  ${f.id} (${f.type}): ${f.count} conclusion(s)`);
    }
  }

  // Print samples for spot-checking
  console.log('\n--- Sample Output (up to 3 per type) ---\n');
  for (const [type, samples] of Object.entries(samplesByType)) {
    console.log(`[${type}]`);
    for (const s of samples) {
      console.log(`  ${s.id}:`);
      for (const c of s.conclusions.slice(0, 3)) {
        console.log(`    - ${c}`);
      }
      if (s.conclusions.length > 3) {
        console.log(`    ... and ${s.conclusions.length - 3} more`);
      }
    }
    console.log('');
  }

  console.log(`\nTotal: ${phase1Count + phase2Count} blocks processed`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});

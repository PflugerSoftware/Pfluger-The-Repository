// Supabase Edge Function: Ezra for Revit
// Self-contained RAG pipeline - accepts a question, returns a grounded answer.
// Deploy with: supabase functions deploy ezra-revit

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = [
  'https://repository.pflugerarchitects.com',
  'http://localhost:5173',
];

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;

const RESEARCH_TOPICS = [
  'acoustics', 'lighting', 'daylight', 'color', 'biophilic design', 'nature',
  'emotional regulation', 'sanctuary spaces', 'child development',
  'learning environments', 'materials', 'sensory design',
];

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  // Allow requests with no origin (desktop apps like Revit)
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
  }
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BlockMatch {
  id: string;
  project_id: string;
  block_type: string;
  block_order: number;
  summary: string;
  conclusions: string[];
  source_ids: number[];
  searchable_text: string;
}

interface Source {
  id: number;
  project_id: string;
  title: string;
  author: string;
  url: string | null;
}

// ---------------------------------------------------------------------------
// Anthropic API
// ---------------------------------------------------------------------------

async function callClaude(
  anthropicKey: string,
  prompt: string,
  tier: 'haiku' | 'sonnet',
  system?: string,
): Promise<string> {
  const modelMap = {
    haiku: 'claude-haiku-4-5-20251001',
    sonnet: 'claude-sonnet-4-5-20250929',
  };

  const body: Record<string, unknown> = {
    model: modelMap[tier],
    max_tokens: tier === 'haiku' ? 500 : 2000,
    messages: [{ role: 'user', content: prompt }],
  };
  if (system) body.system = system;

  const maxRetries = 2;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return data.content?.[0]?.text || '';
    }

    // On overloaded/rate-limit: retry once, then fall back to Sonnet if Haiku failed
    if ((res.status === 529 || res.status === 429) && attempt < maxRetries - 1) {
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }

    // If Haiku is down, fall back to Sonnet
    if ((res.status === 529 || res.status === 429) && tier === 'haiku') {
      body.model = modelMap.sonnet;
      body.max_tokens = 500; // keep haiku-level brevity
      const fallbackRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return data.content?.[0]?.text || '';
      }
    }

    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  throw new Error('Max retries exceeded');
}

// ---------------------------------------------------------------------------
// RAG helpers (mirrors src/services/rag.ts but runs server-side)
// ---------------------------------------------------------------------------

function escapeIlike(s: string): string {
  return s.replace(/[%_\\]/g, '\\$&');
}

async function searchBlocks(
  supabase: ReturnType<typeof createClient>,
  query: string,
  limit = 25,
): Promise<BlockMatch[]> {
  // Full-text search first
  const { data, error } = await supabase
    .from('project_blocks')
    .select('id, project_id, block_type, block_order, summary, conclusions, source_ids, searchable_text')
    .textSearch('searchable_text', query, { type: 'websearch', config: 'english' })
    .limit(limit);

  if (!error && data && data.length > 0) {
    return data.map((b: BlockMatch) => ({
      ...b,
      conclusions: b.conclusions || [],
      source_ids: b.source_ids || [],
    }));
  }

  // Fallback: ILIKE per term
  const terms = query.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const allResults: Map<string, BlockMatch> = new Map();

  for (const term of terms.slice(0, 8)) {
    const { data: td } = await supabase
      .from('project_blocks')
      .select('id, project_id, block_type, block_order, summary, conclusions, source_ids, searchable_text')
      .ilike('searchable_text', `%${escapeIlike(term)}%`)
      .limit(10);

    if (td) {
      for (const b of td) {
        if (!allResults.has(b.id)) allResults.set(b.id, b as BlockMatch);
      }
    }
  }

  return Array.from(allResults.values()).slice(0, limit).map(b => ({
    ...b,
    conclusions: b.conclusions || [],
    source_ids: b.source_ids || [],
  }));
}

async function expandSectionBlocks(
  supabase: ReturnType<typeof createClient>,
  blocks: BlockMatch[],
): Promise<BlockMatch[]> {
  const expanded: BlockMatch[] = [];
  const seen = new Set<string>();

  for (const block of blocks) {
    if (seen.has(block.id)) continue;

    if (block.block_type === 'section') {
      const { data: all } = await supabase
        .from('project_blocks')
        .select('id, project_id, block_type, block_order, summary, conclusions, source_ids, searchable_text')
        .eq('project_id', block.project_id)
        .order('block_order', { ascending: true });

      if (!all) continue;

      const sectionBlock = all.find((b: BlockMatch) => b.id === block.id);
      if (!sectionBlock) continue;

      const nextSection = all.find(
        (b: BlockMatch) => b.block_type === 'section' && b.block_order > sectionBlock.block_order,
      );
      const cap = nextSection?.block_order ?? Infinity;

      const children = all.filter(
        (b: BlockMatch) =>
          b.block_order > sectionBlock.block_order &&
          b.block_order < cap &&
          b.block_type !== 'section' &&
          b.block_type !== 'sources',
      );

      for (const child of children) {
        if (!seen.has(child.id)) {
          seen.add(child.id);
          expanded.push({ ...child, conclusions: child.conclusions || [], source_ids: child.source_ids || [] });
        }
      }
    } else {
      seen.add(block.id);
      expanded.push(block);
    }
  }

  return expanded;
}

async function getAllSources(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
): Promise<Source[]> {
  const { data, error } = await supabase
    .from('project_blocks')
    .select('data')
    .eq('project_id', projectId)
    .eq('block_type', 'sources')
    .single();

  if (error || !data?.data?.sources) return [];

  return (data.data.sources as Array<{ id: number; title: string; author: string; url: string | null }>).map(s => ({
    id: s.id,
    project_id: projectId,
    title: s.title,
    author: s.author,
    url: s.url,
  }));
}

function formatCitation(s: Source): string {
  let c = '';
  if (s.author) c += s.author;
  if (s.title) c += c ? `. ${s.title}` : s.title;
  if (s.url) c += ` ${s.url}`;
  return c || 'Unknown source';
}

function extractCitedNumbers(text: string): number[] {
  const nums = new Set<number>();
  for (const m of text.matchAll(/\[(\d+(?:,\s*\d+)*)\]/g)) {
    m[1].split(',').map(n => parseInt(n.trim(), 10)).forEach(n => nums.add(n));
  }
  return Array.from(nums).sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// RAG pipeline phases
// ---------------------------------------------------------------------------

async function analyzeIntent(
  anthropicKey: string,
  query: string,
  history: ConversationMessage[],
) {
  const historyCtx = history.length > 0
    ? `Recent conversation:\n${history.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`
    : '';

  const system = `Analyze conversations in the context of architectural design research.

Our research covers: ${RESEARCH_TOPICS.join(', ')}

Respond ONLY with valid JSON:
{
  "topic": "main topic",
  "intent": "research_query" | "conversational" | "general_design",
  "searchTerms": ["terms"],
  "relatedTopics": ["related"],
  "contextSummary": "brief summary"
}

Intent types:
- research_query: question about design, OR user sharing project context
- conversational: greetings, thanks, or very short replies needing clarification
- general_design: design question likely outside our specific research`;

  const resp = await callClaude(anthropicKey, `${historyCtx}<user_input>${query}</user_input>`, 'haiku', system);

  try {
    let json = resp;
    const codeBlock = resp.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) json = codeBlock[1].trim();
    const obj = json.match(/\{[\s\S]*\}/);
    if (obj) json = obj[0];
    return JSON.parse(json);
  } catch {
    return {
      topic: query,
      intent: query.split(/\s+/).length <= 3 ? 'conversational' : 'research_query',
      searchTerms: query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3),
      relatedTopics: [],
      contextSummary: '',
    };
  }
}

async function checkRelevance(
  anthropicKey: string,
  query: string,
  blocks: BlockMatch[],
): Promise<{ relevant: boolean; relevantBlockIds: string[] }> {
  const ctx = blocks.map(b => ({ id: b.id, block_type: b.block_type, summary: b.summary, conclusions: b.conclusions }));

  const system = `You are a research relevance checker. Given a user question and research block summaries, determine which blocks are relevant.

Respond ONLY with valid JSON:
{"relevant": true, "relevantBlockIds": ["id1", "id2"], "reasoning": "Brief explanation"}`;

  const resp = await callClaude(
    anthropicKey,
    `<user_input>${query}</user_input>\n\nResearch Blocks:\n${JSON.stringify(ctx, null, 2)}`,
    'haiku',
    system,
  );

  try {
    let json = resp;
    const codeBlock = resp.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) json = codeBlock[1].trim();
    const obj = json.match(/\{[\s\S]*\}/);
    if (obj) json = obj[0];
    const parsed = JSON.parse(json);
    return { relevant: parsed.relevant ?? false, relevantBlockIds: parsed.relevantBlockIds ?? [] };
  } catch {
    return blocks.length > 0
      ? { relevant: true, relevantBlockIds: blocks.slice(0, 3).map(b => b.id) }
      : { relevant: false, relevantBlockIds: [] };
  }
}

async function synthesizeAnswer(
  anthropicKey: string,
  query: string,
  blocks: BlockMatch[],
  sources: Source[],
  history: ConversationMessage[],
): Promise<string> {
  const context = blocks.map(b => ({
    id: b.id,
    project_id: b.project_id,
    content: b.searchable_text,
    conclusions: b.conclusions,
    source_ids: b.source_ids,
  }));

  const sourceMap = sources.map(s => ({ id: s.id, citation: formatCitation(s) }));
  const projectIds = [...new Set(blocks.map(b => b.project_id))];

  const historyCtx = history.length > 0
    ? `Conversation so far:\n${history.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`
    : '';

  const system = `You are Ezra, the research assistant at Pfluger Architects. You are being accessed from inside Revit, so the user is actively designing. Be genuinely helpful, like a knowledgeable colleague sitting next to them.

VOICE:
- Natural, warm, curious
- Share what is interesting about what you found
- Make connections they might not have considered
- Reference earlier parts of the conversation if relevant
- Remember they are in Revit, so be practical and design-relevant

STRUCTURE (flexible):
- Share one or two compelling insights from the research (cite using source IDs like [12], [13])
- Reference projects by their ID (e.g., "X25-RB01 found that...")
- Available projects: ${projectIds.join(', ')}
- Connect to what they have shared about their project/interests
- Keep it conversational, 2-4 sentences total

AVOID:
- Bullet points, headers, lists
- "Based on research..." or "According to..."
- Sounding like a report
- Ignoring conversation context

Research Content:
${JSON.stringify(context, null, 2)}

Available Sources (use these exact IDs when citing):
${sourceMap.map(s => `[${s.id}] ${s.citation}`).join('\n')}`;

  return callClaude(anthropicKey, `${historyCtx}<user_input>${query}</user_input>`, 'sonnet', system);
}

async function generateConversationalResponse(
  anthropicKey: string,
  query: string,
  context: {
    topic: string;
    relatedTopics: string[];
    contextSummary: string;
    hasResearch: boolean;
    history: ConversationMessage[];
  },
): Promise<string> {
  const historyCtx = context.history.length > 0
    ? `Recent conversation:\n${context.history.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`
    : '';

  const system = `You are Ezra, the research assistant at Pfluger Architects. You are being accessed from inside Revit, so the user is actively designing. Respond naturally and helpfully.

Context:
- They seem interested in: ${context.topic}
- ${context.contextSummary || 'No specific project context yet'}
- Our research covers: ${RESEARCH_TOPICS.join(', ')}
${context.relatedTopics.length > 0 ? `- Related topics we have: ${context.relatedTopics.join(', ')}` : ''}
${context.hasResearch ? '' : '- We do not have specific research on their exact question'}

Respond conversationally (1-3 sentences). ${context.hasResearch ? 'Help them clarify what they are looking for.' : 'Acknowledge their interest and gently steer toward topics we can help with, or offer general thoughts.'}`;

  return callClaude(anthropicKey, `${historyCtx}<user_input>${query}</user_input>`, 'haiku', system);
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

async function runEzraRAG(
  anthropicKey: string,
  supabase: ReturnType<typeof createClient>,
  question: string,
  history: ConversationMessage[],
): Promise<{ answer: string; sources: Source[]; blocks_used: string[] }> {
  // 1. Intent analysis
  const intent = await analyzeIntent(anthropicKey, question, history);

  // Conversational route
  if (intent.intent === 'conversational') {
    const answer = await generateConversationalResponse(anthropicKey, question, {
      topic: intent.topic,
      relatedTopics: intent.relatedTopics,
      contextSummary: intent.contextSummary,
      hasResearch: true,
      history,
    });
    return { answer, sources: [], blocks_used: [] };
  }

  // 2. Search
  const searchQuery = intent.searchTerms.length > 0 ? intent.searchTerms.join(' ') : question;
  const blocks = await searchBlocks(supabase, searchQuery);

  if (!blocks.length) {
    const answer = await generateConversationalResponse(anthropicKey, question, {
      topic: intent.topic,
      relatedTopics: intent.relatedTopics,
      contextSummary: intent.contextSummary,
      hasResearch: false,
      history,
    });
    return { answer, sources: [], blocks_used: [] };
  }

  // 3. Relevance check
  const relevance = await checkRelevance(anthropicKey, question, blocks);

  if (!relevance.relevant || !relevance.relevantBlockIds.length) {
    const answer = await generateConversationalResponse(anthropicKey, question, {
      topic: intent.topic,
      relatedTopics: intent.relatedTopics,
      contextSummary: intent.contextSummary,
      hasResearch: true,
      history,
    });
    return { answer, sources: [], blocks_used: [] };
  }

  // 4. Expand section blocks
  const relevant = blocks.filter(b => relevance.relevantBlockIds.includes(b.id));
  const expanded = await expandSectionBlocks(supabase, relevant);

  // 5. Gather sources
  const allSourceIds = [...new Set(expanded.flatMap(b => b.source_ids))];
  const projectId = expanded[0]?.project_id;
  const sources = projectId
    ? allSourceIds.length > 0
      ? (await getAllSources(supabase, projectId)).filter(s => allSourceIds.includes(s.id))
      : await getAllSources(supabase, projectId)
    : [];

  // 6. Synthesize
  const rawAnswer = await synthesizeAnswer(anthropicKey, question, expanded, sources, history);

  // 7. Filter to cited sources
  const cited = extractCitedNumbers(rawAnswer);
  const citedSources = sources.filter(s => cited.includes(s.id));

  return {
    answer: rawAnswer,
    sources: citedSources,
    blocks_used: expanded.map(b => b.id),
  };
}

// ---------------------------------------------------------------------------
// HTTP handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { question, history } = await req.json();

    // Validate
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'question is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return new Response(
        JSON.stringify({ error: `question exceeds maximum length of ${MAX_QUESTION_LENGTH}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const conversationHistory: ConversationMessage[] = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_MESSAGES).filter(
          (m: { role?: string; content?: string }) =>
            m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
        )
      : [];

    // Env
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase env vars not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Run pipeline
    const result = await runEzraRAG(anthropicKey, supabase, question, conversationHistory);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

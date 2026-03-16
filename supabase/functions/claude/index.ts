// Supabase Edge Function for Claude API proxy
// Deploy with: supabase functions deploy claude

const ALLOWED_ORIGINS = [
  'https://repository.pflugerarchitects.com',
  'http://localhost:5173',
];

const ALLOWED_MODELS = [
  'claude-3-5-haiku-20241022',
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-5-20250929',
  'claude-opus-4-5-20251101',
];

const MAX_TOKENS_CAP = 4096;
const MAX_PROMPT_LENGTH = 50000;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { model, system, prompt, messages: providedMessages, max_tokens } = body;

    // Input validation
    const resolvedModel = model || 'claude-3-5-haiku-20241022';
    if (!ALLOWED_MODELS.includes(resolvedModel)) {
      return new Response(
        JSON.stringify({ error: `Invalid model. Allowed: ${ALLOWED_MODELS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Accept either messages (array) or prompt (string)
    let apiMessages: Array<{ role: string; content: string }>;

    if (providedMessages && Array.isArray(providedMessages)) {
      // Validate messages format
      for (const msg of providedMessages) {
        if (!msg.role || !msg.content || typeof msg.content !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Each message must have a role and content string' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      const totalLength = providedMessages.reduce((sum: number, m: { content: string }) => sum + m.content.length, 0);
      if (totalLength > MAX_PROMPT_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Total message content exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      apiMessages = providedMessages;
    } else if (prompt && typeof prompt === 'string') {
      if (prompt.length > MAX_PROMPT_LENGTH) {
        return new Response(
          JSON.stringify({ error: `prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      apiMessages = [{ role: 'user', content: prompt }];
    } else {
      return new Response(
        JSON.stringify({ error: 'Either prompt (string) or messages (array) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resolvedMaxTokens = Math.min(
      typeof max_tokens === 'number' ? max_tokens : 1000,
      MAX_TOKENS_CAP
    );

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Build request with proper system/user separation
    const anthropicBody: Record<string, unknown> = {
      model: resolvedModel,
      max_tokens: resolvedMaxTokens,
      messages: apiMessages,
    };

    // Use the dedicated system parameter if provided
    if (system && typeof system === 'string') {
      anthropicBody.system = system;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return new Response(
      JSON.stringify({ content, model: data.model, usage: data.usage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

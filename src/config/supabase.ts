import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate stored session before the client tries to auto-refresh it.
// A stale refresh token causes an AbortError that poisons the entire client.
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
const storageKey = `sb-${projectRef}-auth-token`;
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    const session = JSON.parse(raw);
    const expiresAt = session?.expires_at; // unix seconds
    if (expiresAt && Date.now() / 1000 > expiresAt + 7 * 24 * 3600) {
      // Refresh token is likely expired (7+ days past access token expiry)
      localStorage.removeItem(storageKey);
    }
  }
} catch {
  // Corrupted storage - clear it
  localStorage.removeItem(storageKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

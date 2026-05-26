import { supabase } from '../config/supabase';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'researcher' | 'contributor' | 'viewer';
}

export async function login(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
  // Validate the credential against Supabase Auth (per-user passwords live in
  // auth.users). We only use the session to verify the password, then drop it
  // locally so the rest of the app keeps running as the anon role - matching
  // existing RLS behavior and avoiding token-refresh issues. App session state
  // is owned by AuthContext via localStorage, not the Supabase session.
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: 'Invalid email or password' };
  }

  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Non-fatal: the credential is already verified.
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('email', email)
    .single();

  if (error || !data) {
    return { user: null, error: 'User not found' };
  }

  return {
    user: {
      id: data.id,
      username: data.email,
      name: data.name,
      role: data.role as UserProfile['role'],
    },
  };
}

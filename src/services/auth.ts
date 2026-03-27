import { supabase, supabaseAnon } from '../config/supabase';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'researcher' | 'contributor' | 'viewer';
}

export async function fetchUserProfile(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    username: data.email,
    name: data.name,
    role: data.role as UserProfile['role'],
  };
}

/** Send a magic link to the user's email */
export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}

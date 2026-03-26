import { supabase } from '../config/supabase';

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

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function signOutLocal() {
  return supabase.auth.signOut({ scope: 'local' });
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}

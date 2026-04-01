import { supabase } from '../config/supabase';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'researcher' | 'contributor' | 'viewer';
}

// Shared password for all users (will migrate to Azure SSO)
const SHARED_PASSWORD = '123456Softwares!';

export async function login(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
  if (password !== SHARED_PASSWORD) {
    return { user: null, error: 'Invalid password' };
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

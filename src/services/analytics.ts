import { supabase } from '../config/supabase';

/**
 * Generate or retrieve session ID from localStorage
 * Session ID persists across page refreshes but resets on new browser session
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics-session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics-session-id', sessionId);
  }
  return sessionId;
}

/**
 * Log a page view
 */
export async function logPageView(
  userId: string,
  pageName: string,
  referrerPage: string | null = null
): Promise<boolean> {
  const sessionId = getSessionId();

  const { error } = await supabase
    .from('user_page_views')
    .insert({
      user_id: userId,
      session_id: sessionId,
      page_name: pageName,
      referrer_page: referrerPage
    });

  if (error) {
    console.error('Error logging page view:', error);
    return false;
  }

  return true;
}


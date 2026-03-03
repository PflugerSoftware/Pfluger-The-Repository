-- =============================================================
-- RLS Policies for The Repository
-- Run AFTER Supabase Auth migration (scripts/migrate-to-supabase-auth.ts)
--
-- Usage:
--   psql $DATABASE_URL -f scripts/apply-rls-policies.sql
-- =============================================================

BEGIN;

-- =============================================================
-- 1. Enable RLS on all tables that don't have it yet
-- =============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 2. Drop existing "Dev: open" policies
-- =============================================================

DROP POLICY IF EXISTS "Dev: open" ON pitches;
DROP POLICY IF EXISTS "Dev: open" ON pitch_comments;
DROP POLICY IF EXISTS "Dev: open" ON pitch_ai_sessions;
DROP POLICY IF EXISTS "Dev: open" ON repo_ai_sessions;

-- =============================================================
-- 3. Public tables (projects, project_blocks, related)
--    Anyone can read. Only service_role can write.
-- =============================================================

-- projects
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT USING (true);

-- project_blocks
CREATE POLICY "public_read_blocks" ON project_blocks
  FOR SELECT USING (true);

-- project_partners (public data)
CREATE POLICY "public_read_partners" ON project_partners
  FOR SELECT USING (true);

-- project_researchers (public data)
CREATE POLICY "public_read_researchers" ON project_researchers
  FOR SELECT USING (true);

-- project_sources (public data)
CREATE POLICY "public_read_sources" ON project_sources
  FOR SELECT USING (true);

-- project_updates (public data)
CREATE POLICY "public_read_updates" ON project_updates
  FOR SELECT USING (true);

-- =============================================================
-- 4. Users table
--    Authenticated can read all profiles. Admin can update.
-- =============================================================

CREATE POLICY "auth_read_users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update_users" ON users
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- =============================================================
-- 5. Pitches (ownership-based)
-- =============================================================

CREATE POLICY "auth_read_pitches" ON pitches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_pitches" ON pitches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "owner_update_pitches" ON pitches
  FOR UPDATE USING (
    user_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "owner_delete_pitches" ON pitches
  FOR DELETE USING (
    user_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- =============================================================
-- 6. Pitch comments (ownership-based delete)
-- =============================================================

CREATE POLICY "auth_read_comments" ON pitch_comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_comments" ON pitch_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "owner_delete_comments" ON pitch_comments
  FOR DELETE USING (
    user_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- =============================================================
-- 7. Pitch AI sessions (user-scoped)
-- =============================================================

CREATE POLICY "owner_read_pitch_ai" ON pitch_ai_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "owner_write_pitch_ai" ON pitch_ai_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_update_pitch_ai" ON pitch_ai_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================================
-- 8. Repo AI sessions / Ezra chat (user-scoped)
-- =============================================================

CREATE POLICY "owner_read_repo_ai" ON repo_ai_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "owner_write_repo_ai" ON repo_ai_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_update_repo_ai" ON repo_ai_sessions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "owner_delete_repo_ai" ON repo_ai_sessions
  FOR DELETE USING (user_id = auth.uid());

-- =============================================================
-- 9. Pitch collaborators
-- =============================================================

CREATE POLICY "auth_read_collaborators" ON pitch_collaborators
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_collaborators" ON pitch_collaborators
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_collaborators" ON pitch_collaborators
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================================
-- 10. User page views (analytics)
--     Authenticated can insert (user_id is NOT NULL with FK)
--     Authenticated can read (analytics dashboard)
-- =============================================================

CREATE POLICY "auth_insert_views" ON user_page_views
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_read_views" ON user_page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================
-- 11. Contacts & collaboration requests (public form submissions)
-- =============================================================

CREATE POLICY "public_insert_contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_read_contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "public_insert_contact_projects" ON contact_projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_read_contact_projects" ON contact_projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "public_insert_collab_requests" ON collaboration_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_read_collab_requests" ON collaboration_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================
-- 12. Calendar events
-- =============================================================

CREATE POLICY "auth_read_calendar" ON calendar_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_calendar" ON calendar_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_calendar" ON calendar_events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_calendar" ON calendar_events
  FOR DELETE USING (auth.role() = 'authenticated');

COMMIT;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;

SELECT tablename, policyname, cmd FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, policyname;

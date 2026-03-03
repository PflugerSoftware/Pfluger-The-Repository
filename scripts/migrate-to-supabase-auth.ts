/**
 * Migration script: Create Supabase Auth accounts for existing users
 *
 * Reads all users from the `users` table and creates corresponding
 * Supabase Auth accounts with the SAME UUID, so auth.uid() === users.id
 * and RLS policies work without schema changes.
 *
 * Prerequisites:
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local (NOT the anon key)
 *   - VITE_SUPABASE_URL in .env.local
 *
 * Usage:
 *   npx tsx scripts/migrate-to-supabase-auth.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required env vars: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.local (from Supabase dashboard > Settings > API)');
  process.exit(1);
}

// Use service_role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SHARED_PASSWORD = '123456Softwares!';

async function migrate() {
  // Fetch all users from the users table
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, name, role');

  if (error) {
    console.error('Failed to fetch users:', error.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log('No users found in the users table.');
    return;
  }

  console.log(`Found ${users.length} users to migrate.\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users) {
    console.log(`Processing: ${user.email} (${user.name})`);

    const { data, error: createError } = await supabase.auth.admin.createUser({
      id: user.id, // Use the SAME UUID from the users table
      email: user.email,
      password: SHARED_PASSWORD,
      email_confirm: true, // Skip email verification
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    });

    if (createError) {
      if (createError.message.includes('already been registered') ||
          createError.message.includes('already exists')) {
        console.log(`  -> Skipped (already exists)\n`);
        skipped++;
      } else {
        console.error(`  -> FAILED: ${createError.message}\n`);
        failed++;
      }
    } else {
      console.log(`  -> Created auth account (id: ${data.user.id})\n`);
      created++;
    }
  }

  console.log('---');
  console.log(`Migration complete: ${created} created, ${skipped} skipped, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

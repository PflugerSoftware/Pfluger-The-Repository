/**
 * Inspect specific files by filename
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OPENASSET_BASE_URL = process.env.VITE_OPENASSET_BASE_URL;
const OPENASSET_TOKEN_ID = process.env.VITE_OPENASSET_TOKEN_ID;
const OPENASSET_TOKEN_STRING = process.env.VITE_OPENASSET_TOKEN_STRING;

const authHeader = `OATU ${OPENASSET_TOKEN_ID}:${OPENASSET_TOKEN_STRING}`;

async function fetchFromOpenAsset(endpoint) {
  const response = await fetch(`${OPENASSET_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

async function inspectFiles(projectId) {
  console.log(`Fetching files for project ${projectId}...\n`);

  const files = await fetchFromOpenAsset(`/Files?project_id=${projectId}&limit=200`);

  console.log(`Found ${files.length} files\n`);
  console.log('='.repeat(120));
  console.log('');

  // Find files matching the patterns mentioned
  const targetFiles = files.filter(f => {
    const fn = f.filename || '';
    const ofn = f.original_filename || '';
    return fn.includes('22_044_N12') ||
           ofn.includes('Bobcat Stadium South Endzone_TXST_Staff_Int_5');
  });

  if (targetFiles.length > 0) {
    console.log('TARGET FILES FOUND:\n');
    targetFiles.forEach(f => {
      console.log(`File ID: ${f.id}`);
      console.log(`  filename: ${f.filename}`);
      console.log(`  original_filename: ${f.original_filename}`);
      console.log(`  caption: ${f.caption || 'None'}`);
      console.log(`  photographer: ${f.photographer || 'None'}`);
      console.log(`  keywords: ${f.keywords && f.keywords.length > 0 ? f.keywords.join(', ') : 'None'}`);
      console.log(`  project_id: ${f.project_id}`);
      console.log(`  category_id: ${f.category_id || 'None'}`);
      console.log('');
    });
  }

  console.log('='.repeat(120));
  console.log('\nFILENAME PATTERNS ANALYSIS:\n');

  // Analyze filename vs original_filename patterns
  const withBothNames = files.filter(f => f.filename && f.original_filename);

  console.log(`Files with both fields: ${withBothNames.length} / ${files.length}\n`);

  // Sample 10
  console.log('Sample of filename vs original_filename:\n');
  console.log('ID'.padEnd(8) + 'filename'.padEnd(35) + 'original_filename');
  console.log('-'.repeat(120));

  withBothNames.slice(0, 20).forEach(f => {
    const fn = (f.filename || '').substring(0, 33);
    const ofn = (f.original_filename || '').substring(0, 80);
    console.log(`${String(f.id).padEnd(8)}${fn.padEnd(35)}${ofn}`);
  });

  console.log('');
  console.log('='.repeat(120));

  // Analyze filename patterns
  const standardizedPattern = files.filter(f => {
    const fn = f.filename || '';
    return /^\d{2}_\d{3}_/.test(fn); // Matches "22_044_" pattern
  }).length;

  const descriptivePattern = files.filter(f => {
    const ofn = f.original_filename || '';
    return ofn.includes('_') && (ofn.includes('Ext') || ofn.includes('Int'));
  }).length;

  console.log('\nPATTERN STATISTICS:\n');
  console.log(`Files with standardized filename (##_###_): ${standardizedPattern} / ${files.length}`);
  console.log(`Files with descriptive original_filename: ${descriptivePattern} / ${files.length}`);
  console.log('');

  // Extract information from original filenames
  console.log('INFORMATION EXTRACTABLE FROM ORIGINAL FILENAMES:\n');

  const hasExt = files.filter(f => (f.original_filename || '').includes('_Ext')).length;
  const hasInt = files.filter(f => (f.original_filename || '').includes('_Int')).length;
  const hasStaff = files.filter(f => (f.original_filename || '').includes('_Staff_')).length;
  const hasTXST = files.filter(f => (f.original_filename || '').includes('TXST')).length;

  console.log(`- Exterior shots (contains "_Ext"): ${hasExt}`);
  console.log(`- Interior shots (contains "_Int"): ${hasInt}`);
  console.log(`- Staff photos (contains "_Staff_"): ${hasStaff}`);
  console.log(`- TXST client (contains "TXST"): ${hasTXST}`);
  console.log('');

  console.log('='.repeat(120));
  console.log('\nKEY INSIGHT:\n');
  console.log('✓ The "original_filename" field contains rich metadata (project name, client, view type)');
  console.log('✓ The "filename" field is standardized but loses context (22_044_N12.jpg)');
  console.log('✓ For automated tagging, we should parse ORIGINAL_FILENAME, not filename');
  console.log('');
}

const projectId = process.argv[2] || '55';
inspectFiles(projectId).catch(console.error);

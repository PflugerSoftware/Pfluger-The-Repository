/**
 * OpenAsset DAM Structure Explorer
 * Generates a comprehensive overview of Pfluger's OpenAsset Digital Asset Management system
 */

import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

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
    throw new Error(`API error: ${response.status} - ${await response.text()}`);
  }

  // Get total count from headers if available
  const totalCount = response.headers.get('X-Full-Results-Count');
  const data = await response.json();

  return { data, totalCount: totalCount ? parseInt(totalCount) : (Array.isArray(data) ? data.length : null) };
}

async function exploreOpenAsset() {
  console.log('Exploring Pfluger OpenAsset DAM...\n');

  const report = [];

  report.push('# Pfluger OpenAsset DAM Structure Report');
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString()}`);
  report.push('**API Token:** Pfluger Repository');
  report.push('');
  report.push('---');
  report.push('');

  try {
    // 1. Projects
    console.log('Fetching projects...');
    const projects = await fetchFromOpenAsset('/Projects?limit=5');
    report.push('## Projects');
    report.push('');
    report.push(`**Total Projects:** ${projects.totalCount || 'Unknown'}`);
    report.push('');
    if (projects.data.length > 0) {
      report.push('**Sample Projects:**');
      projects.data.slice(0, 5).forEach(p => {
        report.push(`- ${p.code} - ${p.name} (${p.public_image_count || 0} images)`);
      });
      report.push('');
      report.push('*Note: Full project list would require CSV export*');
    }
    report.push('');
    report.push('---');
    report.push('');

    // 2. Files/Images
    console.log('Fetching files...');
    const files = await fetchFromOpenAsset('/Files?limit=5');
    report.push('## Files (Images)');
    report.push('');
    report.push(`**Total Files:** ${files.totalCount || 'Unknown'}`);
    report.push('');
    if (files.data.length > 0) {
      report.push('**Sample Files:**');
      files.data.slice(0, 5).forEach(f => {
        report.push(`- ${f.original_filename || f.filename}`);
        report.push(`  - Caption: ${f.caption || 'None'}`);
        report.push(`  - Photographer: ${f.photographer || 'None'}`);
        report.push(`  - Project ID: ${f.project_id || 'None'}`);
        report.push(`  - Keywords: ${f.keywords?.join(', ') || 'None'}`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 3. Albums
    console.log('Fetching albums...');
    const albums = await fetchFromOpenAsset('/Albums?limit=100');
    report.push('## Albums');
    report.push('');
    report.push(`**Total Albums:** ${albums.totalCount || albums.data.length}`);
    report.push('');
    if (albums.data.length > 0) {
      report.push('**All Albums:**');
      albums.data.forEach(a => {
        report.push(`- ${a.name} (ID: ${a.id})`);
        if (a.description) report.push(`  - Description: ${a.description}`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 4. Keywords/Tags
    console.log('Fetching keywords...');
    const keywords = await fetchFromOpenAsset('/Keywords?limit=100');
    report.push('## Keywords / Tags');
    report.push('');
    report.push(`**Total Keywords:** ${keywords.totalCount || keywords.data.length}`);
    report.push('');
    if (keywords.data.length > 0) {
      report.push('**Sample Keywords (first 50):**');
      const keywordNames = keywords.data.slice(0, 50).map(k => k.name).join(', ');
      report.push(keywordNames);
    }
    report.push('');
    report.push('---');
    report.push('');

    // 5. Categories
    console.log('Fetching categories...');
    const categories = await fetchFromOpenAsset('/Categories?limit=100');
    report.push('## Categories');
    report.push('');
    report.push(`**Total Categories:** ${categories.totalCount || categories.data.length}`);
    report.push('');
    if (categories.data.length > 0) {
      report.push('**All Categories:**');
      categories.data.forEach(c => {
        report.push(`- ${c.name} (ID: ${c.id})`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 6. Custom Fields
    console.log('Fetching custom fields...');
    const fields = await fetchFromOpenAsset('/Fields?limit=100');
    report.push('## Custom Fields');
    report.push('');
    report.push(`**Total Custom Fields:** ${fields.totalCount || fields.data.length}`);
    report.push('');
    if (fields.data.length > 0) {
      report.push('**All Custom Fields:**');
      report.push('');
      report.push('| Field ID | Name | Type | Applied To |');
      report.push('|----------|------|------|------------|');
      fields.data.forEach(f => {
        const name = f.name || f.code || 'Unnamed';
        const type = f.field_type || 'Unknown';
        const appliesTo = f.applies_to || 'N/A';
        report.push(`| ${f.id} | ${name} | ${type} | ${appliesTo} |`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 7. Photographers
    console.log('Fetching photographers...');
    const photographers = await fetchFromOpenAsset('/Photographers?limit=100');
    report.push('## Photographers');
    report.push('');
    report.push(`**Total Photographers:** ${photographers.totalCount || photographers.data.length}`);
    report.push('');
    if (photographers.data.length > 0) {
      report.push('**All Photographers:**');
      photographers.data.forEach(p => {
        report.push(`- ${p.name} (ID: ${p.id})`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 8. Users
    console.log('Fetching users...');
    const users = await fetchFromOpenAsset('/Users?limit=100');
    report.push('## Users');
    report.push('');
    report.push(`**Total Users:** ${users.totalCount || users.data.length}`);
    report.push('');
    if (users.data.length > 0) {
      report.push('**All Users:**');
      users.data.forEach(u => {
        report.push(`- ${u.username || u.name} (ID: ${u.id})`);
        if (u.email) report.push(`  - Email: ${u.email}`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // 9. Copyright Holders
    console.log('Fetching copyright holders...');
    const copyrightHolders = await fetchFromOpenAsset('/CopyrightHolders?limit=100');
    report.push('## Copyright Holders');
    report.push('');
    report.push(`**Total Copyright Holders:** ${copyrightHolders.totalCount || copyrightHolders.data.length}`);
    report.push('');
    if (copyrightHolders.data.length > 0) {
      report.push('**All Copyright Holders:**');
      copyrightHolders.data.forEach(c => {
        report.push(`- ${c.name} (ID: ${c.id})`);
      });
    }
    report.push('');
    report.push('---');
    report.push('');

    // Summary
    report.push('## Summary');
    report.push('');
    report.push('| Resource | Count |');
    report.push('|----------|-------|');
    report.push(`| Projects | ${projects.totalCount || 'Unknown'} |`);
    report.push(`| Files (Images) | ${files.totalCount || 'Unknown'} |`);
    report.push(`| Albums | ${albums.totalCount || albums.data.length} |`);
    report.push(`| Keywords | ${keywords.totalCount || keywords.data.length} |`);
    report.push(`| Categories | ${categories.totalCount || categories.data.length} |`);
    report.push(`| Custom Fields | ${fields.totalCount || fields.data.length} |`);
    report.push(`| Photographers | ${photographers.totalCount || photographers.data.length} |`);
    report.push(`| Users | ${users.totalCount || users.data.length} |`);
    report.push(`| Copyright Holders | ${copyrightHolders.totalCount || copyrightHolders.data.length} |`);
    report.push('');

    // Write to file
    const reportText = report.join('\n');
    writeFileSync('docs/OpenAsset-DAM-Structure.md', reportText);

    console.log('\n✓ Report generated: docs/OpenAsset-DAM-Structure.md');
    console.log('\n' + '='.repeat(80));
    console.log(reportText);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n✗ Error exploring OpenAsset:', error.message);
    process.exit(1);
  }
}

// Run exploration
exploreOpenAsset();

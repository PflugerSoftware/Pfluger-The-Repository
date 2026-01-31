/**
 * Get all Keywords and Categories from OpenAsset
 */

import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const OPENASSET_BASE_URL = process.env.VITE_OPENASSET_BASE_URL;
const OPENASSET_TOKEN_ID = process.env.VITE_OPENASSET_TOKEN_ID;
const OPENASSET_TOKEN_STRING = process.env.VITE_OPENASSET_TOKEN_STRING;

const authHeader = `OATU ${OPENASSET_TOKEN_ID}:${OPENASSET_TOKEN_STRING}`;

async function fetchAll(endpoint) {
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

async function getKeywordsAndCategories() {
  console.log('Fetching all keywords and categories...\n');

  const keywords = await fetchAll('/Keywords?limit=500');
  const categories = await fetchAll('/Categories?limit=100');

  const report = [];

  report.push('# OpenAsset Keywords & Categories');
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString()}`);
  report.push('');
  report.push('---');
  report.push('');

  // Categories
  report.push('## Categories');
  report.push('');
  report.push(`**Total:** ${categories.length}`);
  report.push('');
  categories.forEach(c => {
    report.push(`- **${c.name}** (ID: ${c.id})`);
    if (c.description) report.push(`  - ${c.description}`);
  });
  report.push('');
  report.push('---');
  report.push('');

  // Keywords
  report.push('## Keywords');
  report.push('');
  report.push(`**Total:** ${keywords.length}`);
  report.push('');

  // Group by prefix/category if they have patterns
  const keywordsByType = {
    'Spaces': [],
    'Materials': [],
    'Asset Type': [],
    'Process': [],
    'Learning': [],
    'Other': []
  };

  keywords.forEach(k => {
    if (k.name.startsWith('Spaces - ')) {
      keywordsByType['Spaces'].push(k.name);
    } else if (k.name.startsWith('Materials - ')) {
      keywordsByType['Materials'].push(k.name);
    } else if (k.name.startsWith('Asset Type - ')) {
      keywordsByType['Asset Type'].push(k.name);
    } else if (k.name.startsWith('Process - ')) {
      keywordsByType['Process'].push(k.name);
    } else if (k.name.startsWith('Learning - ')) {
      keywordsByType['Learning'].push(k.name);
    } else {
      keywordsByType['Other'].push(k.name);
    }
  });

  // Output grouped keywords
  for (const [type, tags] of Object.entries(keywordsByType)) {
    if (tags.length > 0) {
      report.push(`### ${type} (${tags.length})`);
      report.push('');
      tags.forEach(tag => {
        report.push(`- ${tag}`);
      });
      report.push('');
    }
  }

  // Write to file
  const reportText = report.join('\n');
  writeFileSync('docs/OpenAsset-Keywords-Categories.md', reportText);

  console.log('✓ Report saved to docs/OpenAsset-Keywords-Categories.md\n');
  console.log(reportText);
}

getKeywordsAndCategories().catch(console.error);

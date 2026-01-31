/**
 * Analyze all images in OpenAsset and their keyword/tagging status
 * Exports CSV for detailed analysis
 */

import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const OPENASSET_BASE_URL = process.env.VITE_OPENASSET_BASE_URL;
const OPENASSET_TOKEN_ID = process.env.VITE_OPENASSET_TOKEN_ID;
const OPENASSET_TOKEN_STRING = process.env.VITE_OPENASSET_TOKEN_STRING;

const authHeader = `OATU ${OPENASSET_TOKEN_ID}:${OPENASSET_TOKEN_STRING}`;

async function fetchBatch(offset, limit = 500) {
  const response = await fetch(`${OPENASSET_BASE_URL}/Files?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const totalCount = response.headers.get('X-Full-Results-Count');
  const data = await response.json();

  return { data, totalCount: parseInt(totalCount) };
}

async function analyzeAllImages() {
  console.log('Analyzing all images in OpenAsset...\n');
  console.log('This will take a few minutes for 20k+ images...\n');

  const allImages = [];
  const stats = {
    total: 0,
    withKeywords: 0,
    withoutKeywords: 0,
    withProject: 0,
    withoutProject: 0,
    withPhotographer: 0,
    withoutPhotographer: 0,
    withCaption: 0,
    withoutCaption: 0,
    keywordDistribution: {
      '0': 0,
      '1': 0,
      '2-5': 0,
      '6-10': 0,
      '11+': 0
    }
  };

  let offset = 0;
  const limit = 500;
  let totalCount = null;

  while (true) {
    console.log(`Fetching batch: ${offset}-${offset + limit}...`);

    const { data, totalCount: total } = await fetchBatch(offset, limit);

    if (totalCount === null) {
      totalCount = total;
      console.log(`Total images to process: ${totalCount}\n`);
    }

    if (data.length === 0) break;

    // Process each image
    data.forEach(img => {
      const keywordCount = img.keywords ? img.keywords.length : 0;
      const hasProject = !!img.project_id;
      const hasPhotographer = !!(img.photographer && img.photographer.trim());
      const hasCaption = !!(img.caption && img.caption.trim());

      allImages.push({
        id: img.id,
        filename: img.original_filename || img.filename || 'Unknown',
        project_id: img.project_id || '',
        photographer: img.photographer || '',
        caption: img.caption || '',
        category_id: img.category_id || '',
        keyword_count: keywordCount,
        keywords: img.keywords ? img.keywords.join('; ') : ''
      });

      // Update stats
      stats.total++;

      if (keywordCount > 0) {
        stats.withKeywords++;
      } else {
        stats.withoutKeywords++;
      }

      if (hasProject) stats.withProject++;
      else stats.withoutProject++;

      if (hasPhotographer) stats.withPhotographer++;
      else stats.withoutPhotographer++;

      if (hasCaption) stats.withCaption++;
      else stats.withoutCaption++;

      // Keyword distribution
      if (keywordCount === 0) {
        stats.keywordDistribution['0']++;
      } else if (keywordCount === 1) {
        stats.keywordDistribution['1']++;
      } else if (keywordCount <= 5) {
        stats.keywordDistribution['2-5']++;
      } else if (keywordCount <= 10) {
        stats.keywordDistribution['6-10']++;
      } else {
        stats.keywordDistribution['11+']++;
      }
    });

    offset += limit;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));

    // Progress
    const progress = Math.min(100, Math.round((offset / totalCount) * 100));
    console.log(`Progress: ${progress}% (${Math.min(offset, totalCount)}/${totalCount})\n`);

    if (offset >= totalCount) break;
  }

  console.log('\n✓ Analysis complete!\n');

  // Generate CSV
  console.log('Generating CSV...');
  const csvRows = [
    'ID,Filename,Project ID,Photographer,Caption,Category ID,Keyword Count,Keywords'
  ];

  allImages.forEach(img => {
    const row = [
      img.id,
      `"${img.filename.replace(/"/g, '""')}"`,
      img.project_id,
      `"${img.photographer.replace(/"/g, '""')}"`,
      `"${img.caption.replace(/"/g, '""')}"`,
      img.category_id,
      img.keyword_count,
      `"${img.keywords.replace(/"/g, '""')}"`
    ].join(',');
    csvRows.push(row);
  });

  const csv = csvRows.join('\n');
  writeFileSync('data/openasset-images-analysis.csv', csv);
  console.log('✓ CSV saved to: data/openasset-images-analysis.csv\n');

  // Generate summary report
  const report = [];
  report.push('# OpenAsset Image Tagging Analysis');
  report.push('');
  report.push(`**Generated:** ${new Date().toLocaleString()}`);
  report.push(`**Total Images Analyzed:** ${stats.total.toLocaleString()}`);
  report.push('');
  report.push('---');
  report.push('');

  report.push('## Summary Statistics');
  report.push('');
  report.push('| Metric | Count | Percentage |');
  report.push('|--------|-------|------------|');
  report.push(`| **Total Images** | ${stats.total.toLocaleString()} | 100% |`);
  report.push(`| Images WITH keywords | ${stats.withKeywords.toLocaleString()} | ${Math.round(stats.withKeywords / stats.total * 100)}% |`);
  report.push(`| Images WITHOUT keywords | ${stats.withoutKeywords.toLocaleString()} | ${Math.round(stats.withoutKeywords / stats.total * 100)}% |`);
  report.push(`| Images WITH project | ${stats.withProject.toLocaleString()} | ${Math.round(stats.withProject / stats.total * 100)}% |`);
  report.push(`| Images WITHOUT project | ${stats.withoutProject.toLocaleString()} | ${Math.round(stats.withoutProject / stats.total * 100)}% |`);
  report.push(`| Images WITH photographer | ${stats.withPhotographer.toLocaleString()} | ${Math.round(stats.withPhotographer / stats.total * 100)}% |`);
  report.push(`| Images WITHOUT photographer | ${stats.withoutPhotographer.toLocaleString()} | ${Math.round(stats.withoutPhotographer / stats.total * 100)}% |`);
  report.push(`| Images WITH caption | ${stats.withCaption.toLocaleString()} | ${Math.round(stats.withCaption / stats.total * 100)}% |`);
  report.push(`| Images WITHOUT caption | ${stats.withoutCaption.toLocaleString()} | ${Math.round(stats.withoutCaption / stats.total * 100)}% |`);
  report.push('');
  report.push('---');
  report.push('');

  report.push('## Keyword Distribution');
  report.push('');
  report.push('| Keywords per Image | Count | Percentage |');
  report.push('|-------------------|-------|------------|');
  report.push(`| 0 keywords (untagged) | ${stats.keywordDistribution['0'].toLocaleString()} | ${Math.round(stats.keywordDistribution['0'] / stats.total * 100)}% |`);
  report.push(`| 1 keyword | ${stats.keywordDistribution['1'].toLocaleString()} | ${Math.round(stats.keywordDistribution['1'] / stats.total * 100)}% |`);
  report.push(`| 2-5 keywords | ${stats.keywordDistribution['2-5'].toLocaleString()} | ${Math.round(stats.keywordDistribution['2-5'] / stats.total * 100)}% |`);
  report.push(`| 6-10 keywords | ${stats.keywordDistribution['6-10'].toLocaleString()} | ${Math.round(stats.keywordDistribution['6-10'] / stats.total * 100)}% |`);
  report.push(`| 11+ keywords | ${stats.keywordDistribution['11+'].toLocaleString()} | ${Math.round(stats.keywordDistribution['11+'] / stats.total * 100)}% |`);
  report.push('');
  report.push('---');
  report.push('');

  report.push('## Key Insights');
  report.push('');

  const untaggedPercent = Math.round(stats.withoutKeywords / stats.total * 100);
  if (untaggedPercent > 50) {
    report.push(`⚠️  **${untaggedPercent}% of images are completely untagged** - significant opportunity for improvement`);
  } else if (untaggedPercent > 25) {
    report.push(`⚠️  **${untaggedPercent}% of images lack keywords** - moderate tagging needed`);
  } else {
    report.push(`✅  **${100 - untaggedPercent}% of images have at least one keyword** - good tagging coverage`);
  }
  report.push('');

  const noProjectPercent = Math.round(stats.withoutProject / stats.total * 100);
  if (noProjectPercent > 30) {
    report.push(`⚠️  **${noProjectPercent}% of images not linked to projects** - many orphaned files`);
  }
  report.push('');

  const noCaptionPercent = Math.round(stats.withoutCaption / stats.total * 100);
  if (noCaptionPercent > 50) {
    report.push(`⚠️  **${noCaptionPercent}% of images lack captions** - metadata completeness issue`);
  }
  report.push('');

  report.push('---');
  report.push('');
  report.push('## Next Steps');
  report.push('');
  report.push('1. **Review CSV** - Open `data/openasset-images-analysis.csv` in Excel/Google Sheets');
  report.push('2. **Filter untagged images** - Sort by "Keyword Count" to find images with 0 tags');
  report.push('3. **Batch tagging strategy** - Use OpenAsset API to add keywords programmatically');
  report.push('4. **Project assignment** - Link orphaned images to correct projects');
  report.push('5. **AI-assisted tagging** - Consider using Claude to suggest keywords based on filenames/context');
  report.push('');

  const reportText = report.join('\n');
  writeFileSync('docs/OpenAsset-Tagging-Analysis.md', reportText);

  console.log('================================================================================');
  console.log(reportText);
  console.log('================================================================================\n');
  console.log('✓ Report saved to: docs/OpenAsset-Tagging-Analysis.md');
  console.log('✓ CSV saved to: data/openasset-images-analysis.csv');
}

analyzeAllImages().catch(console.error);

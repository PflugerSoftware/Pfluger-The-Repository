/**
 * Review a specific project in OpenAsset
 * Pulls all metadata, images, and details
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
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

async function reviewProject(searchTerm) {
  console.log(`Searching for project: "${searchTerm}"\n`);

  // Search for project
  const projects = await fetchFromOpenAsset(`/Projects?textMatching=${encodeURIComponent(searchTerm)}&limit=10`);

  if (projects.length === 0) {
    console.log('No projects found matching that search term.');
    return;
  }

  console.log(`Found ${projects.length} matching project(s):\n`);
  projects.forEach((p, i) => {
    console.log(`${i + 1}. ${p.code} - ${p.name} (ID: ${p.id}, ${p.public_image_count || 0} images)`);
  });

  // Take the first match
  const project = projects[0];
  console.log(`\nReviewing: ${project.code} - ${project.name}\n`);

  // Get project fields
  const fields = await fetchFromOpenAsset(`/Projects/${project.id}/Fields`);

  // Create field map
  const fieldMap = {};
  fields.forEach(f => {
    if (f.values && f.values.length > 0) {
      fieldMap[f.id] = f.values[0];
    }
  });

  // Get project files
  const files = await fetchFromOpenAsset(`/Files?project_id=${project.id}&limit=100`);

  // Generate report
  const report = [];

  report.push(`# Project Review: ${project.name}`);
  report.push('');
  report.push(`**Project Code:** ${project.code}`);
  report.push(`**Project ID:** ${project.id}`);
  report.push(`**Generated:** ${new Date().toLocaleString()}`);
  report.push('');
  report.push('---');
  report.push('');

  // Basic Info
  report.push('## Basic Information');
  report.push('');
  report.push(`- **Name:** ${project.name}`);
  report.push(`- **Code:** ${project.code}`);
  report.push(`- **Description:** ${project.description || 'None'}`);
  report.push(`- **Created:** ${project.created || 'Unknown'}`);
  report.push(`- **Updated:** ${project.updated || 'Unknown'}`);
  report.push(`- **Image Count:** ${project.public_image_count || 0}`);
  report.push('');

  // Custom Fields
  report.push('## Custom Fields');
  report.push('');
  report.push('| Field ID | Field Name | Value |');
  report.push('|----------|------------|-------|');

  const fieldNames = {
    2: 'Start Date',
    3: 'Completion Date',
    5: 'Marketing Description',
    16: 'Size/Area',
    219: 'Client',
    244: 'Office',
    245: 'Address',
    246: 'Cost',
    253: 'City',
    254: 'State',
    255: 'Student Capacity'
  };

  Object.entries(fieldNames).forEach(([id, name]) => {
    const value = fieldMap[id] || 'Not set';
    report.push(`| ${id} | ${name} | ${value} |`);
  });

  report.push('');
  report.push('---');
  report.push('');

  // Images
  report.push('## Images');
  report.push('');
  report.push(`**Total Files:** ${files.length}`);
  report.push('');

  if (files.length > 0) {
    report.push('### Image Details');
    report.push('');
    report.push('| ID | Filename | Caption | Photographer | Keywords |');
    report.push('|----|----------|---------|--------------|----------|');

    files.forEach(f => {
      const filename = f.original_filename || f.filename || 'Unknown';
      const caption = f.caption || 'None';
      const photographer = f.photographer || 'None';
      const keywords = f.keywords && f.keywords.length > 0 ? f.keywords.join(', ') : 'None';

      report.push(`| ${f.id} | ${filename} | ${caption} | ${photographer} | ${keywords} |`);
    });

    report.push('');
    report.push('---');
    report.push('');

    // Image analysis
    report.push('## Image Analysis');
    report.push('');

    const imagesWithKeywords = files.filter(f => f.keywords && f.keywords.length > 0).length;
    const imagesWithCaptions = files.filter(f => f.caption && f.caption.trim()).length;
    const imagesWithPhotographer = files.filter(f => f.photographer && f.photographer.trim()).length;

    report.push(`- **Images with keywords:** ${imagesWithKeywords} / ${files.length} (${Math.round(imagesWithKeywords/files.length*100)}%)`);
    report.push(`- **Images with captions:** ${imagesWithCaptions} / ${files.length} (${Math.round(imagesWithCaptions/files.length*100)}%)`);
    report.push(`- **Images with photographer:** ${imagesWithPhotographer} / ${files.length} (${Math.round(imagesWithPhotographer/files.length*100)}%)`);
    report.push('');

    // Sample filenames
    report.push('### Sample Filenames');
    report.push('');
    files.slice(0, 20).forEach(f => {
      report.push(`- ${f.original_filename || f.filename}`);
    });
  }

  report.push('');
  report.push('---');
  report.push('');

  // Keywords used
  if (files.length > 0) {
    const allKeywords = new Set();
    files.forEach(f => {
      if (f.keywords) {
        f.keywords.forEach(k => allKeywords.add(k));
      }
    });

    if (allKeywords.size > 0) {
      report.push('## Keywords Used in This Project');
      report.push('');
      report.push(`**Total unique keywords:** ${allKeywords.size}`);
      report.push('');
      Array.from(allKeywords).sort().forEach(k => {
        report.push(`- ${k}`);
      });
    } else {
      report.push('## Keywords Used in This Project');
      report.push('');
      report.push('⚠️  No keywords assigned to any images in this project');
    }
  }

  // Write report
  const reportText = report.join('\n');
  const filename = `docs/Project-Review-${project.code.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
  writeFileSync(filename, reportText);

  console.log('================================================================================');
  console.log(reportText);
  console.log('================================================================================\n');
  console.log(`✓ Report saved to: ${filename}`);
}

// Get search term from command line or use default
const searchTerm = process.argv[2] || 'Bobcat Stadium';
reviewProject(searchTerm).catch(console.error);

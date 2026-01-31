/**
 * Review a specific project by ID
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

async function reviewProjectById(projectId) {
  console.log(`Fetching project ID: ${projectId}\n`);

  // Get project
  const project = await fetchFromOpenAsset(`/Projects/${projectId}`);

  console.log(`Reviewing: ${project.code} - ${project.name}\n`);

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
  const files = await fetchFromOpenAsset(`/Files?project_id=${project.id}&limit=200`);

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
    // Image analysis
    const imagesWithKeywords = files.filter(f => f.keywords && f.keywords.length > 0).length;
    const imagesWithCaptions = files.filter(f => f.caption && f.caption.trim()).length;
    const imagesWithPhotographer = files.filter(f => f.photographer && f.photographer.trim()).length;

    report.push('### Metadata Coverage');
    report.push('');
    report.push(`- **Images with keywords:** ${imagesWithKeywords} / ${files.length} (${Math.round(imagesWithKeywords/files.length*100)}%)`);
    report.push(`- **Images with captions:** ${imagesWithCaptions} / ${files.length} (${Math.round(imagesWithCaptions/files.length*100)}%)`);
    report.push(`- **Images with photographer:** ${imagesWithPhotographer} / ${files.length} (${Math.round(imagesWithPhotographer/files.length*100)}%)`);
    report.push('');

    // Sample filenames to show patterns
    report.push('### Sample Filenames (first 30)');
    report.push('');
    files.slice(0, 30).forEach(f => {
      const filename = f.original_filename || f.filename;
      const keywords = f.keywords && f.keywords.length > 0 ? ` [${f.keywords.length} keywords]` : '';
      report.push(`- ${filename}${keywords}`);
    });

    report.push('');
    report.push('---');
    report.push('');

    // Filename patterns
    report.push('### Filename Analysis');
    report.push('');

    const hasExt = files.filter(f => {
      const fn = (f.original_filename || f.filename || '').toLowerCase();
      return fn.includes('_ext') || fn.includes('exterior');
    }).length;

    const hasInt = files.filter(f => {
      const fn = (f.original_filename || f.filename || '').toLowerCase();
      return fn.includes('_int') || fn.includes('interior');
    }).length;

    const hasAerial = files.filter(f => {
      const fn = (f.original_filename || f.filename || '').toLowerCase();
      return fn.includes('aerial') || fn.includes('drone');
    }).length;

    report.push(`- **Contains "Ext" or "Exterior":** ${hasExt} images`);
    report.push(`- **Contains "Int" or "Interior":** ${hasInt} images`);
    report.push(`- **Contains "Aerial" or "Drone":** ${hasAerial} images`);
    report.push('');

    report.push('*This data can be used for automated tagging*');
    report.push('');
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

const projectId = process.argv[2] || '55';
reviewProjectById(projectId).catch(console.error);

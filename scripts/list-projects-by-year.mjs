/**
 * List all projects from a specific year
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OPENASSET_BASE_URL = process.env.VITE_OPENASSET_BASE_URL;
const OPENASSET_TOKEN_ID = process.env.VITE_OPENASSET_TOKEN_ID;
const OPENASSET_TOKEN_STRING = process.env.VITE_OPENASSET_TOKEN_STRING;

const authHeader = `OATU ${OPENASSET_TOKEN_ID}:${OPENASSET_TOKEN_STRING}`;

async function fetchBatch(offset, limit = 500) {
  const response = await fetch(`${OPENASSET_BASE_URL}/Projects?limit=${limit}&offset=${offset}`, {
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

async function listProjectsByYear(yearPrefix) {
  console.log(`Finding all projects with code starting with "${yearPrefix}"\n`);

  let offset = 0;
  const limit = 500;
  const matchingProjects = [];

  while (true) {
    const projects = await fetchBatch(offset, limit);
    if (projects.length === 0) break;

    projects.forEach(p => {
      if (p.code && p.code.startsWith(yearPrefix)) {
        matchingProjects.push(p);
      }
    });

    offset += limit;
    if (projects.length < limit) break;
  }

  console.log(`Found ${matchingProjects.length} projects:\n`);
  matchingProjects.sort((a, b) => a.code.localeCompare(b.code));

  matchingProjects.forEach(p => {
    console.log(`${p.code} - ${p.name} (ID: ${p.id}, ${p.public_image_count || 0} images)`);
  });

  return matchingProjects;
}

const yearPrefix = process.argv[2] || '22-';
listProjectsByYear(yearPrefix).catch(console.error);

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const BASE_URL = 'https://n8n.gdev.fr';
const API_PREFIX = '/api/v1';
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) {
  console.error('Définis la variable d\'environnement N8N_API_KEY avant de lancer le script.');
  process.exit(1);
}

const pullDir = path.resolve('Pull');
const pushDir = path.resolve('Push');
const agent = new https.Agent({ rejectUnauthorized: false });

const args = process.argv.slice(2);
const workflowId = args[0];

if (!workflowId) {
  console.error('Usage : node scripts/pull-workflow.mjs <workflowId>');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': API_KEY,
};

async function ensureDirectories() {
  await fs.promises.mkdir(pullDir, { recursive: true });
  await fs.promises.mkdir(pushDir, { recursive: true });
}

async function fetchWorkflow(id) {
  const url = `${BASE_URL}${API_PREFIX}/workflows/${id}`;
  const response = await fetch(url, { headers, agent });
  if (!response.ok) {
    throw new Error(`Impossible de télécharger le workflow ${id} (${response.status})`);
  }
  return response.json();
}

function buildFileName() {
  return `workflow-${workflowId}.json`;
}

async function main() {
  await ensureDirectories();

  const workflow = await fetchWorkflow(workflowId);
  const fileName = buildFileName(workflow);
  const pullPath = path.join(pullDir, fileName);
  const pushPath = path.join(pushDir, fileName);

  const payload = JSON.stringify(workflow, null, 2);
  await fs.promises.writeFile(pullPath, payload);
  console.log(`Workflow enregistré dans Pull : ${pullPath}`);

  await fs.promises.writeFile(pushPath, payload);
  console.log(`Copie prête à modifier dans Push : ${pushPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

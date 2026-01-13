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
  console.error('Définis N8N_API_KEY dans ton .env avant de lancer le script.');
  process.exit(1);
}

const pushDir = path.resolve('Push');

const args = process.argv.slice(2);
let workflowFile;
let workflowId;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--workflow-id' || arg === '--id') {
    workflowId = args[index + 1];
    if (!workflowId) {
      console.error(`${arg} attend un identifiant.`);
      process.exit(1);
    }
    index += 1;
    continue;
  }

  if (!workflowFile) {
    workflowFile = arg;
    continue;
  }

  console.error(`Argument inattendu : ${arg}`);
  process.exit(1);
}

if (!workflowFile) {
  if (!fs.existsSync(pushDir)) {
    console.error('Le dossier Push/ est introuvable. Lance un pull avant de pousser.');
    process.exit(1);
  }
  const candidates = fs.readdirSync(pushDir);
  if (candidates.length === 0) {
    console.error('Le dossier Push/ est vide. Place un workflow avant de pousser.');
  } else {
    console.error('Indique un fichier existant dedans, par exemple :');
    console.error(`  node scripts/push-workflow.mjs ${candidates[0]} --workflow-id 123`);
  }
  process.exit(1);
}

function resolvePushPath(entry) {
  const candidate = path.isAbsolute(entry) ? entry : path.join(pushDir, entry);
  const normalized = path.normalize(candidate);
  const relative = path.relative(pushDir, normalized);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Le fichier doit se trouver dans le dossier Push/.');
  }
  return normalized;
}

const workflowPath = resolvePushPath(workflowFile);
if (!fs.existsSync(workflowPath)) {
  console.error(`Fichier introuvable : ${workflowPath}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
const workflowEndpoint = `${API_PREFIX}/workflows`;
const url = workflowId ? `${BASE_URL}${workflowEndpoint}/${workflowId}` : `${BASE_URL}${workflowEndpoint}`;
const method = workflowId ? 'PUT' : 'POST';
const agent = new https.Agent({ rejectUnauthorized: false });

async function upload() {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': API_KEY,
    },
    body: JSON.stringify(payload),
    agent,
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Erreur ${response.status} : ${body}`);
  }

  const json = body ? JSON.parse(body) : {};
  console.log('Workflow chargé :', json.id || json.name || workflowId || path.basename(workflowPath));
}

upload().catch((error) => {
  console.error('Échec du push :', error.message);
  process.exit(1);
});

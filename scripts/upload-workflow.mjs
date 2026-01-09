import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const baseUrl = 'https://n8n.gdev.fr';
const apiPrefix = '/api/v1';
const apiKey = process.env.N8N_API_KEY;

if (!apiKey) {
  console.error("Definis la variable d'environnement N8N_API_KEY.");
  process.exit(1);
}

function normalizeClientSlug(slug) {
  if (!slug) {
    throw new Error('Le slug client ne peut pas etre vide.');
  }
  const normalized = slug.trim().replace(/[^a-zA-Z0-9-_]/g, '');
  if (normalized !== slug) {
    throw new Error(`Client slug invalide: ${slug}`);
  }
  return normalized;
}

const args = process.argv.slice(2);
let workflowFile;
let workflowId;
let clientSlug;

for (let index = 0; index < args.length; index += 1) {
  const value = args[index];
  if (value === '--client') {
    clientSlug = args[index + 1];
    if (!clientSlug) {
      console.error('Le flag --client attend un identifiant.');
      process.exit(1);
    }
    index += 1;
    continue;
  }
  if (!workflowFile) {
    workflowFile = value;
    continue;
  }
  if (!workflowId) {
    workflowId = value;
    continue;
  }
}

if (!clientSlug && process.env.CLIENT_SLUG) {
  clientSlug = process.env.CLIENT_SLUG;
}

if (clientSlug) {
  clientSlug = normalizeClientSlug(clientSlug);
}

if (!workflowFile) {
  console.error(
    'Usage: node scripts/upload-workflow.mjs <workflow.json> [workflowId] [--client <slug>]'
  );
  process.exit(1);
}

const defaultPath = path.resolve(workflowFile);
let workflowPath = defaultPath;
let overrideMessage = null;

if (clientSlug) {
  const overrideCandidate = path.resolve('clients', clientSlug, 'workflows', path.basename(workflowFile));
  if (fs.existsSync(overrideCandidate)) {
    workflowPath = overrideCandidate;
    overrideMessage = ` (override detecte pour ${clientSlug})`;
  }
}

if (!fs.existsSync(workflowPath)) {
  console.error(`Fichier introuvable: ${workflowPath}`);
  process.exit(1);
}

if (overrideMessage) {
  console.log(`Utilisation du workflow ${workflowPath}${overrideMessage}.`);
}

const payload = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
const workflowEndpoint = `${apiPrefix}/workflows`;
const url = workflowId ? `${baseUrl}${workflowEndpoint}/${workflowId}` : `${baseUrl}${workflowEndpoint}`;
const method = workflowId ? 'PUT' : 'POST';
const agent = new https.Agent({ rejectUnauthorized: false });

async function upload() {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': apiKey,
    },
    body: JSON.stringify(payload),
    agent,
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Erreur ${res.status} : ${body}`);
  }

  const json = body ? JSON.parse(body) : {};
  console.log('Workflow charge :', json.id || json.name || workflowId || 'nouveau');
}

upload().catch((err) => {
  console.error('echec du upload', err.message);
  process.exit(2);
});

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
  console.error('Définis la variable d’environnement N8N_API_KEY avant de lancer le script.');
  process.exit(1);
}

const toolsDir = path.resolve('Tools');
const updateDir = path.join(toolsDir, 'update');
const agent = new https.Agent({ rejectUnauthorized: false });

const args = process.argv.slice(2);
const parsed = {
  workflowId: null,
  skipUpdate: false,
  updateOnly: false,
  updateFile: null,
};

for (let index = 0; index < args.length; index += 1) {
  const value = args[index];
  switch (value) {
    case '--skip-update':
      parsed.skipUpdate = true;
      break;
    case '--update-only':
      parsed.updateOnly = true;
      break;
    case '--update-file':
      parsed.updateFile = args[index + 1];
      if (!parsed.updateFile) {
        console.error('Le flag --update-file attend un chemin vers un fichier JSON.');
        process.exit(1);
      }
      index += 1;
      break;
    default:
      if (!parsed.workflowId) {
        parsed.workflowId = value;
      } else {
        console.error(`Argument inattendu : ${value}`);
        process.exit(1);
      }
  }
}

if (!parsed.workflowId) {
  console.error('Usage : node scripts/download-and-update-workflow.mjs <workflowId> [--skip-update] [--update-only] [--update-file <path>]');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': API_KEY,
};

function sanitizeName(name) {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || `workflow-${parsed.workflowId}`;
}

async function fetchWorkflow(id) {
  const url = `${BASE_URL}${API_PREFIX}/workflows/${id}`;
  const response = await fetch(url, { headers, agent });
  if (!response.ok) {
    throw new Error(`Impossible de télécharger le workflow ${id} (${response.status})`);
  }
  const payload = await response.json();
  return payload;
}

async function ensureDirectories() {
  await fs.promises.mkdir(toolsDir, { recursive: true });
  await fs.promises.mkdir(updateDir, { recursive: true });
}

function getUpdateFilePath(workflowId, fileBaseName) {
  const updateFileName = `${fileBaseName}_update_${workflowId}.json`;
  return path.join(updateDir, updateFileName);
}

function resolveUpdateFileFromId(workflowId) {
  const pattern = new RegExp(`_update_${workflowId}\\.json$`);
  if (!fs.existsSync(updateDir)) {
    throw new Error(`Aucun dossier ${updateDir} n’a été trouvé.`);
  }
  const candidates = fs.readdirSync(updateDir).filter((file) => pattern.test(file));
  if (candidates.length === 0) {
    throw new Error(`Aucun fichier update trouvé pour le workflow ${workflowId} dans ${updateDir}.`);
  }
  return path.join(updateDir, candidates[0]);
}

async function updateWorkflow(workflowId, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable : ${filePath}`);
  }
  const payload = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
  const url = `${BASE_URL}${API_PREFIX}/workflows/${workflowId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    agent,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Échec de la mise à jour (${response.status}) : ${body}`);
  }
  const body = await response.json();
  console.log(`Workflow ${workflowId} mis à jour (réponse : ${body.id || body.name || 'OK'}).`);
}

async function main() {
  await ensureDirectories();

  if (parsed.updateOnly) {
    const target = parsed.updateFile || resolveUpdateFileFromId(parsed.workflowId);
    console.log(`Utilisation du fichier existant ${target} pour mettre à jour ${parsed.workflowId}.`);
    await updateWorkflow(parsed.workflowId, target);
    return;
  }

  const workflow = await fetchWorkflow(parsed.workflowId);
  const baseName = sanitizeName(workflow.name || `workflow-${workflow.id}`);
  const storedPath = path.join(toolsDir, `${baseName}.json`);
  await fs.promises.writeFile(storedPath, JSON.stringify(workflow, null, 2));
  console.log(`Workflow téléchargé et enregistré dans ${storedPath}.`);

  const updatePath = getUpdateFilePath(parsed.workflowId, baseName);
  await fs.promises.writeFile(updatePath, JSON.stringify(workflow, null, 2));
  console.log(`Copie destinée aux modifications : ${updatePath}.`);

  if (parsed.skipUpdate) {
    console.log('Mise à jour automatique désactivée (--skip-update). Tu peux modifier puis relancer avec --update-only.');
    return;
  }

  console.log('Application automatique de la mise à jour avec la copie préparée...');
  await updateWorkflow(parsed.workflowId, updatePath);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const schema = require('../contracts/schema/contract-schema.json');

const argv = process.argv.slice(2);
let clientSlug;
let fileArg;

function normalizeClientSlug(slug) {
  if (!slug) {
    console.error('Le flag --client attend un identifiant.');
    process.exit(1);
  }
  const trimmed = slug.trim();
  if (!trimmed) {
    console.error('Le flag --client attend un identifiant non vide.');
    process.exit(1);
  }
  const normalized = trimmed.replace(/[^a-zA-Z0-9-_]/g, '');
  if (normalized !== trimmed) {
    console.error(`Client slug invalide: ${slug}`);
    process.exit(1);
  }
  return normalized;
}

for (let index = 0; index < argv.length; index += 1) {
  const value = argv[index];
  if (value === '--client') {
    clientSlug = argv[index + 1];
    if (!clientSlug) {
      console.error('Le flag --client attend un identifiant.');
      process.exit(1);
    }
    index += 1;
    continue;
  }
  if (!fileArg) {
    fileArg = value;
    continue;
  }
}

if (!clientSlug && process.env.CLIENT_SLUG) {
  clientSlug = process.env.CLIENT_SLUG;
}

if (clientSlug) {
  clientSlug = normalizeClientSlug(clientSlug);
}

if (!fileArg && clientSlug) {
  fileArg = path.join('clients', clientSlug, 'specs', 'registry.json');
}

if (!fileArg) {
  console.error(
    'Usage: node scripts/validate-contract.js <path-to-contract-json> [--client <slug>]'
  );
  process.exit(1);
}

const resolvedPath = path.resolve(fileArg);
const CLIENTS_ROOT = path.resolve('clients');

function isUnderDirectory(root, target) {
  const relative = path.relative(root, target);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

if (!clientSlug && isUnderDirectory(CLIENTS_ROOT, resolvedPath)) {
  console.error('Les fichiers clients doivent rester sous /clients. Utilisez --client pour les valider.');
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
} catch (error) {
  console.error(`Erreur lecture du fichier ${resolvedPath}:`, error.message);
  process.exit(2);
}

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

const valid = validate(payload);
if (!valid) {
  console.error(`Le contrat ${resolvedPath} est invalide :`);
  for (const err of validate.errors) {
    console.error(`  - ${err.instancePath || '/'} ${err.message}`);
  }
  process.exit(3);
}

console.log(`Le contrat ${resolvedPath} est valide (${payload.nodes?.length ?? 0} nodes).`);

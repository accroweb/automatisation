#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');

const BASE_REGISTRY = path.resolve('contracts', 'registry.json');
const CLIENTS_DIR = path.resolve('clients');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function deepMerge(baseValue, clientValue) {
  if (Array.isArray(baseValue) || Array.isArray(clientValue)) {
    return clientValue !== undefined ? clientValue : baseValue;
  }

  if (typeof baseValue === 'object' && baseValue !== null && typeof clientValue === 'object' && clientValue !== null) {
    const result = { ...baseValue };
    for (const [key, value] of Object.entries(clientValue)) {
      result[key] = deepMerge(baseValue[key], value);
    }
    return result;
  }

  return clientValue !== undefined ? clientValue : baseValue;
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

function resolveClientSpec(slug) {
  const normalized = normalizeClientSlug(slug);
  return path.join(CLIENTS_DIR, normalized, 'specs', path.basename(BASE_REGISTRY));
}

function loadRegistry({ clientSlug } = {}) {
  if (!fs.existsSync(BASE_REGISTRY)) {
    throw new Error(`Base registry file missing: ${BASE_REGISTRY}`);
  }

  let registry = readJson(BASE_REGISTRY);

  if (clientSlug) {
    const overridePath = resolveClientSpec(clientSlug);
    if (fs.existsSync(overridePath)) {
      const clientRegistry = readJson(overridePath);
      registry = deepMerge(registry, clientRegistry);
    } else {
      console.warn(`No override found for client "${clientSlug}", returning base registry.`);
    }
  }

  return registry;
}

function parseArgs(argv) {
  let clientSlug;
  const clientIndex = argv.indexOf('--client');
  if (clientIndex >= 0) {
    const slug = argv[clientIndex + 1];
    if (!slug) {
      throw new Error('The --client flag expects a slug.');
    }
    clientSlug = slug;
  }

  if (!clientSlug && process.env.CLIENT_SLUG) {
    clientSlug = process.env.CLIENT_SLUG;
  }

  if (clientSlug) {
    clientSlug = normalizeClientSlug(clientSlug);
  }

  return { clientSlug };
}

if (require.main === module) {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  try {
    const merged = loadRegistry(args);
    console.log(JSON.stringify(merged, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  loadRegistry,
  deepMerge,
  readJson,
};

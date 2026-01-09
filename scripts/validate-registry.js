#!/usr/bin/env node
"use strict";

const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const { loadRegistry } = require('./load-registry');
const schema = require('../contracts/schema/contract-schema.json');

const ALL_ERRORS = true;
const ajv = new Ajv({ allErrors: ALL_ERRORS, allowUnionTypes: true });
const validate = ajv.compile(schema);

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

function resolveClientSlug(argv) {
  const index = argv.indexOf('--client');
  if (index >= 0) {
    const slug = argv[index + 1];
    if (!slug) {
      throw new Error('The --client flag expects a slug.');
    }
    return normalizeClientSlug(slug);
  }
  if (process.env.CLIENT_SLUG) {
    return normalizeClientSlug(process.env.CLIENT_SLUG);
  }
  return undefined;
}

function assertNoClientInsideBase() {
  const roots = ['contracts', 'Tools', 'scripts', 'docs'];
  for (const root of roots) {
    const clientsPath = path.join(root, 'clients');
    if (fs.existsSync(clientsPath) && fs.lstatSync(clientsPath).isDirectory()) {
      throw new Error(
        `Client artifacts must stay under /clients; found ${clientsPath} inside the socle zone.`
      );
    }
  }
}

if (require.main === module) {
  let clientSlug;
  try {
    clientSlug = resolveClientSlug(process.argv.slice(2));
    assertNoClientInsideBase();
    const registry = loadRegistry({ clientSlug });
    const valid = validate(registry);
    if (!valid) {
      console.error('Registry invalide :');
      for (const err of validate.errors || []) {
        console.error(`  - ${err.instancePath || '/'} ${err.message}`);
      }
      process.exit(3);
    }
    console.log(
      `Registry valide (${clientSlug ? `client ${clientSlug}` : 'base'}) avec ${registry.nodes?.length ?? 0} nodes.`
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

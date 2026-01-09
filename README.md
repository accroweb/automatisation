# workflow-gen

Socle minimal pour orchestrer des workflows n8n, versionne et pret a etre clone pour chaque client.

## Base socle
- Les exports JSON originaux restent dans `Tools/` pour servir de reference et d'archives de base.
- Les specs generiques (registry, nodes, schema, workflow.md) vivent dans `contracts/`.
- Les scripts sous `scripts/` (load-registry, validate-registry, validate-contract, upload-workflow, etc.) contiennent la logique overlay.

## Overrides clients
- Les clients vivent exclusivement sous `clients/<slug>/` avec `specs/`, `workflows/`, `config/` et un `README.md` qui rappelle les limites.
- Chaque `clients/<slug>/specs/registry.json` recouvre les clefs du socle en surchargeant ses entrees.
- Les workflows clients dans `clients/<slug>/workflows/` remplacent les workflows de base quand le nom est identique.
- Les secrets restent hors des dossiers socle et ne sont pas commits.

## Chargement et validation
- `node scripts/load-registry.js [--client <slug>]` fusionne `contracts/registry.json` et l'override client puis affiche le JSON final.
- `node scripts/validate-registry.js [--client <slug>]` execute la fusion, lance AJV et verifie qu'aucun dossier `clients/` ne s'infiltre dans `contracts/`, `Tools/`, `scripts/` ou `docs/`.
- `node scripts/validate-contract.js <path> [--client <slug>]` normalise le slug et interdit les fichiers clients hors de `/clients/<slug>/`.
- `node scripts/upload-workflow.mjs <workflow.json> [workflowId] [--client <slug>]` utilise un override client si `clients/<slug>/workflows/<basename>.json` existe et respecte `CLIENT_SLUG`.

## Telechargement et mise a jour
- `node scripts/download-and-update-workflow.mjs <workflowId>` telecharge le workflow depuis `https://n8n.gdev.fr`, le sauve dans `Tools/`, cree une copie dans `Tools/update/<name>_update_<id>.json` et utilise cette copie pour mettre a jour le workflow via l'API.
- Options utiles :
  - `--skip-update` : seulement telecharger et copier pour modifier ensuite.
  - `--update-only` : n'envoi que la mise a jour en relisant `Tools/update/*_update_<id>.json`.
  - `--update-file <path>` : force un fichier precis lorsqu'il y a plusieurs copies.

## Git et versioning
- Le projet s'appelle `workflow-gen` dans le package et la documentation, et les releases du socle sont marquees par des tags SemVer (`v1.0.0`, etc.).
- `docs/CLIENT_BOOTSTRAP.md` explique comment creer un repo client, ajouter le remote `template`, creer `clients/<slug>/` et fusionner ensuite `git fetch template && git merge template/main`.
- `git subtree` est mentionne comme alternative legere pour garder une copie locale sans enlever la separation `/clients/<slug>`.

## Gardes-fous
- `scripts/validate-registry.js` echoue si un dossier `clients/` apparait dans une racine socle.
- `.gitignore` protege les secrets (.env, logs, fichiers `*.token`, `*.key`, `*.pem`, `*.secret`, `clients/*/config/*.credentials.json`).
- `README-WORKFLOW-GEN-PLAN.md` donne la feuille de route complete.

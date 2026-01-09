# Plan socle workflow-gen

Ce document est le plan README demandé. Il suit l'ordre demandé : **audit (Tâche A)** puis les actions B à E. On reste sur l'architecture existante, en gardant les workflows et scripts actuels, et en mettant en évidence les points d'extension sans inventer de /core supplémentaire.

## Tâche A – audit rapide de l'existant
### Arborescence principale
- `contracts/` : socle des specs ( `registry.json`, dossier `nodes/`, `schema/` et `workflow.md` ).
- `Tools/` : exports JSON des workflows n8n ( `gmail tool workflow.json`, `workflow-upload.json`, `testimporttaches.json`, etc.).
- `scripts/` : utilitaires ; `load-registry.js`, `validate-registry.js`, `validate-contract.js`, `upload-workflow.mjs` plus des helpers Python (`format_json.py`, `list_nodes.py`, ...).
- `clients/` : dossier client (exemple `clients/demo/` avec `specs/registry.json`, `workflows/demo-workflow.json`, `config/`, `README.md`).
- `docs/` : documentation opérationnelle, dont `CLIENT_BOOTSTRAP.md` (présente déjà la stratégie Git) et des dossiers explicatifs (code, gmail, google sheet, monday, ...).
- Racine : `.env`, `.gitignore`, `package.json` (nommé `workflow-gen`), `package-lock.json`, `print_readme.py`.

### Synthèse du placement des artefacts
1. **Workflows n8n** : les exports de référence restent dans `Tools/`, les overrides clients résident sous `clients/<slug>/workflows/`.
2. **Specs (registries, policies, contracts...)** : base dans `contracts/registry.json` (avec nodes / schema), overrides additionnels sous `clients/<slug>/specs/registry.json`.
3. **Scripts utilitaires** : tout est déjà regroupé dans `scripts/` et accepte `--client` ou `CLIENT_SLUG` (load, validate, upload, etc.).

### Points d'extension sans déplacement
- Ajouter de nouveaux clients via `clients/<nouveau>/` avec `specs/`, `workflows/`, `config/` et leur `README`.
- Élargir `scripts/` pour couvrir de nouveaux cas (import, export, validation additionnelle) sans toucher aux dossiers de base.
- Documenter des patterns clients ou des check-lists dans `docs/`.
- Enrichir `contracts/` ou `Tools/` (nouvelles specs ou workflows) tout en gardant la base figée.

## Tâche B – standard minimal “workflow-gen”
- On conserve l'existant comme socle : `contracts/`, `Tools/`, `scripts/`, `docs/` ne bougent pas.
- Chaque client reste confiné sous `/clients/<client_slug>/` avec : `specs/`, `workflows/`, `config/`, `README.md`.
- Exemple en place : `clients/demo/` montre le pattern complet ; il n’y a pas de secrets dedans, seulement des overrides (`specs/registry.json`, `workflows/demo-workflow.json`, `config/` vide).
- On documente cette séparation dans ce plan et dans `README.md`, en rappelant que toute variation client passe par `/clients/` et qu’on ne crée pas de `/core` lourd.

## Tâche C – overlay base + client
- **Specs** : `scripts/load-registry.js` charge `contracts/registry.json`, applique `clients/<slug>/specs/registry.json` si présent, et fusionne avec `deepMerge` (client override prioritaire). Il accepte `--client` ou `CLIENT_SLUG`.
- **Scripts associés** : `validate-registry.js` et `validate-contract.js` normalisent la même slug, réutilisent `load-registry`, vérifient les règles de gardes-fous et produisent les erreurs AJV. `upload-workflow.mjs` détecte un workflow client au même nom et l’utilise à la place du fichier de base.
- **Comportement overlay** : la documentation (README principal et ce plan) précise que l’ordre est base → client, que le client écrase les clés en conflit, et qu’un workflow client avec le même nom remplace celui du socle.
- **Exemple concret** : `clients/demo/` montre un override simple pour illustrer comment charger le socle puis l’override (`node scripts/load-registry.js --client demo`).

## Tâche D – Git “figer + copier” sans complexité
- Le projet porte déjà le nom `workflow-gen` (package + README). On conserve cette dénomination dans la doc et les scripts.
- Les releases doivent être marquées par des tags SemVer (par ex. `v1.0.0`) du côté du socle. Les clients peuvent ensuite merger depuis ce template distant.
- `docs/CLIENT_BOOTSTRAP.md` documente déjà :
  1. la création d’un repo client (`workflow-gen-<client>`),
  2. l’ajout du remote `template`,
  3. l’ajout de `/clients/<client_slug>/` (spécification, workflows, config, README),
  4. la récupération des updates (`git fetch template && git merge template/main`).
- Une approche Git subtree est mentionnée comme alternative légère sans être imposée.

## Tâche E – garde-fous légers
- `scripts/validate-registry.js` échoue si un sous-dossier `clients/` apparaît dans les zones socle (`contracts/`, `Tools/`, `scripts/`, `docs/`).
- `.gitignore` protège les secrets : `.env`, logs, fichiers clients (`clients/*/config/*.token`, `.key`, `.pem`, `.secret`, `.env`, `.env.local`) et les credentials `.json`.
- Le README principal récapitule “où mettre quoi”, rappelle le pattern socle / clients, et renvoie à ce plan et à `CLIENT_BOOTSTRAP.md`.
- Aucun secret client n’est versionné dans `contracts` ou `Tools`.

## Sortie attendue
1. **Commits réalisés** : (à déterminer après les modifications).
2. **Arborescence finale** : base + clients + docs + scripts + plan.
3. **Scripts ajoutés/modifiés** : `scripts/load-registry.js`, `validate-registry.js`, `validate-contract.js`, `upload-workflow.mjs` (déjà alignés avec l’overlay). À confirmer après ajustements éventuels.
4. **Documentation ajoutée** : ce README-plan (`README-WORKFLOW-GEN-PLAN.md`), `docs/CLIENT_BOOTSTRAP.md`, `README.md`.

## A ne pas faire
- Ne pas réinventer une architecture lourde, ne pas déplacer les fichiers de base sans plan de migration, ne pas ajouter d’outils inutiles.

---

**Prochaines étapes** : cette fiche est rédigée ; on peut maintenant poursuivre les actions B→E (validation, overlay et documentation) et mettre à jour les commits/documents nécessaires.

# Creer un repo client a partir de workflow-gen

## Strategie simple (template + remote "template")
1. Copier `workflow-gen` dans un nouveau repo du type `workflow-gen-<client>` (ou cloner puis reinitialiser le remote principal).  
2. Ajouter le socle original comme remote :
   ```
   git remote add template <url-du-repo-workflow-gen>
   git fetch template
   ```
3. Creer le dossier client :
   ```
   mkdir -p clients/<slug>/{specs,workflows,config}
   touch clients/<slug>/README.md
   ```
4. Placer les overrides :
   - `clients/<slug>/specs/registry.json` pour personnaliser les contrats sans toucher `contracts/`.
   - `clients/<slug>/workflows/<basename>.json` pour remplacer les workflows de base.
   - `clients/<slug>/config/` pour signaler des references vers les secrets (les vrais secrets restent hors repo et sont ignores).
5. Valider la fusion base + override :
   ```
   node scripts/load-registry.js --client <slug>
   node scripts/validate-registry.js --client <slug>
   ```
6. Commiter et publier.
7. Pour recuperer une mise a jour du socle :
   ```
   git fetch template
   git merge template/main
   ```
   Resoudre les conflits dans `contracts/`, `Tools/`, `scripts/` et rerun les validations (`load-registry`, `upload-workflow`, etc.).

## Versioning du socle
- Marquer les releases stables du socle avec des tags SemVer (`v1.0.0`, `v1.1.0`, ...).  
- En cas de mise a jour importante, taguer puis pousser le template (ex: `git tag v1.2.0 && git push origin v1.2.0`).  
- Les repos clients peuvent ensuite se mettre a jour en mergeant le tag ou la branche `main` du remote `template`.

## Strategie alternative legere : git subtree
- Ajouter le socle comme subtree si l'on veut garder une copie localement :
  ```
  git remote add template <url-du-repo-workflow-gen>
  git subtree add --prefix=clients/<slug>/template template main --squash
  ```
- Pour recuperer les mises a jour :
  ```
  git subtree pull --prefix=clients/<slug>/template template main --squash
  ```
- Cette approche garde le socle dans le repo client mais conserve la separation `clients/<slug>` pour les overrides.

## Gardes-fous rapides
- `scripts/validate-registry.js` refuse de tourner si un dossier `clients/` existe dans les racines du socle (`contracts/`, `Tools/`, `scripts/`, `docs/`).  
- `.gitignore` protege les secrets (`.env`, fichiers `.token`, `.key`, `.pem`, `.secret`, etc. dans `clients/*/config/`).  
- Ne jamais deplacer les dossiers `clients/` dans le socle : ajoutez-les uniquement sous `/clients/<slug>/`.

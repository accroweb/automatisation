# Structure des Projets

Ce dépôt sert de **monorepo** pour gérer plusieurs projets de manière organisée.

## Structure Recommandée

```
automatisation/
├── workflow-gen/              # Socle workflow-gen (existant)
│   ├── clients/
│   ├── contracts/
│   ├── scripts/
│   └── ...
│
├── projects/                  # Nouveaux projets
│   ├── projet-1/
│   │   ├── frontend/         # Application front-end
│   │   ├── backend/          # API/Backend (si nécessaire)
│   │   ├── docs/             # Documentation spécifique
│   │   └── README.md         # Documentation du projet
│   │
│   └── projet-2/
│       ├── frontend/
│       └── ...
│
└── shared/                    # Ressources partagées (optionnel)
    ├── components/           # Composants réutilisables
    └── utils/                # Utilitaires communs
```

## Avantages de cette Structure

1. **Séparation claire** : Chaque projet est isolé dans son propre dossier
2. **Évolutivité** : Facile d'ajouter de nouveaux projets
3. **Indépendance** : Chaque projet peut avoir ses propres dépendances
4. **Réutilisabilité** : Le dossier `shared/` permet de partager du code commun

## Gestion des Dépendances

### Option 1 : Dépendances par projet (Recommandé)
Chaque projet a son propre `package.json` :
```
projects/projet-1/frontend/package.json
projects/projet-1/backend/package.json
```

### Option 2 : Workspace (npm/yarn/pnpm)
Utiliser les workspaces pour gérer toutes les dépendances depuis la racine.

## Git et Versioning

- **Tags par projet** : `projet-1-v1.0.0`, `workflow-gen-v1.0.0`
- **Branches par projet** : `projet-1/feature-xyz`, `workflow-gen/fix-abc`
- **Commits** : Préfixer avec le nom du projet : `[projet-1] Ajout du composant X`

## Workflow Recommandé

1. **Créer un nouveau projet** :
   ```bash
   mkdir -p projects/mon-projet/frontend
   cd projects/mon-projet/frontend
   # Initialiser votre framework (React, Vue, etc.)
   ```

2. **Ajouter au .gitignore** :
   - Ignorer les `node_modules/` de chaque projet
   - Ignorer les fichiers de build (`dist/`, `build/`)

3. **Documentation** :
   - Créer un `README.md` dans chaque projet
   - Documenter les commandes spécifiques

## Exemple : Ajout d'un Front-end React

```
projects/mon-projet/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

## Migration du Projet Actuel

Le dossier `workflow-gen/` peut rester à la racine OU être déplacé dans `projects/workflow-gen/` selon vos préférences.


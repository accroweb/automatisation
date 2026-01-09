# workflow-gen

Socle générique et versionné pour workflows n8n avec overrides clients

## 🎯 Contexte & Objectif

Ce dépôt sert de **socle stable** pour des workflows n8n (et leurs specs associées), destiné à être **copié pour chaque client**, tout en permettant :

- des **variations client** propres
- des **mises à jour du socle** sans casser les projets clients
- une **architecture volontairement simple**, proche de l’existant

> Principe fondamental :  
> **Socle figé + overrides client + overlay déterministe**

---

## 🧠 Rôle attendu de Codex

Tu es un **ingénieur senior** spécialisé en :

- Git (templates, tags, remotes)
- n8n (workflows JSON, registries, scripts)
- refactor **minimaliste**

Contraintes impératives :

- ❌ pas de nouvelle architecture lourde
- ❌ pas de `/core` massif inutile
- ✅ conserver les workflows et scripts existants
- ✅ s’adapter à l’arborescence actuelle
- ✅ faire le **minimum de refactor nécessaire**

---

## 🧩 Philosophie d’architecture

- Le dépôt `workflow-gen` est le **socle**
- Chaque client est un **repo séparé**, copié depuis ce socle
- Les variations client vivent **uniquement** dans `/clients/<client_slug>/`
- Le chargement se fait par **overlay** :
  - base → client
  - le client écrase la base en cas de conflit

---

# 🚀 PLAN D’EXÉCUTION

---

## 🧪 TÂCHE A — Audit rapide de l’existant (POINT D’ENTRÉE)

### Objectif

Comprendre l’existant **sans rien casser**, pour identifier où et comment brancher les extensions.

### Actions attendues

1. **Afficher l’arborescence actuelle**
   - via `ls`, `find`, ou équivalent
2. **Résumer clairement :**
   - Où sont les **workflows n8n** (exports JSON)
   - Où sont les **specs** (registries, policies, contracts, etc.)
   - Où sont les **scripts utilitaires** (download / upload / validate)
3. **Identifier les points d’extension possibles**
   - sans déplacer massivement les fichiers
   - sans renommer inutilement

👉 Cette tâche doit produire un **diagnostic court et factuel**.

---

## 🧱 TÂCHE B — Standard minimal « workflow-gen »

### Objectif

Mettre en place une **séparation claire socle / client**, avec un impact minimal.

### Approche à choisir (UNE SEULE)

#### ✅ Option 1 — _Préférée si possible_

> Conserver l’existant comme socle, ajouter uniquement les clients.

/clients/
└── <client_slug>/
├── specs/
├── workflows/
├── config/
└── README.md

#### ⚠️ Option 2 — _Seulement si indispensable_

> À utiliser uniquement si le repo mélange déjà fortement du client-specific.

/base/ # socle (contenu actuel)
/clients/
└── <client_slug>/

---

### Règles strictes

- ❌ aucun secret ou donnée client dans le socle
- ✅ **toute variation client** passe par `/clients/<client_slug>/`
- ✅ le système doit permettre un **chargement base + override client**

---

## 🧬 TÂCHE C — Overlay (Base + Client)

### Objectif

Implémenter une logique d’overlay **simple, déterministe et documentée**.

### Règles d’overlay

#### Specs / Registry

1. Charger les specs du socle
2. Charger les specs du client (si présentes)
3. En cas de même clé → **le client écrase la base**

#### Workflows (optionnel mais recommandé)

- Si un workflow client a le **même nom / id** → il remplace celui du socle
- Sinon → on garde celui du socle

---

### Livrables techniques

- ➕ `scripts/load-registry.js`
  - Entrée : `CLIENT_SLUG`
  - Sortie : registry **mergée**
- 🔄 Mise à jour des scripts existants :
  - import / export / validate
  - acceptent désormais `CLIENT_SLUG`
- 📁 Ajouter un exemple :

/clients/demo/
└── specs/
└── registry.override.json

---

## 🧷 TÂCHE D — Git : figer & copier sans complexité

### Objectif

Permettre une réutilisation propre du socle **sans tooling lourd**.

### Actions

1. Renommer le projet dans la doc : **workflow-gen**
2. Ajouter un versioning **SemVer** via tags (`v1.0.0`, etc.)

---

### Stratégies Git à documenter

#### ✅ Stratégie par défaut — Simple & efficace

**Template repo + repo par client**

- `workflow-gen` = template
- création de `workflow-gen-<client>`
- ajout d’un remote `template`
- merge manuel des updates du socle

#### Alternative (documentée seulement)

- Git subtree (description rapide, non imposée)

---

### Livrable doc

📄 `docs/CLIENT_BOOTSTRAP.md` :

- créer un repo client
- ajouter `/clients/<client_slug>`
- récupérer les updates du socle

---

## 🛡️ TÂCHE E — Garde-fous légers

### Objectif

Empêcher les erreurs **sans alourdir le système**.

### À mettre en place

- ❌ un check dans `validate-registry`
- échec si un fichier client est placé dans le socle
- 🧹 `.gitignore` propre
- `.env`, tokens, secrets
- 📘 README clair
- “où mettre quoi”

---

# 📦 SORTIE ATTENDUE (OBLIGATOIRE)

À la fin, fournir :

1. ✅ Liste des commits réalisés
2. 🌳 Arborescence finale du projet
3. 🧩 Scripts ajoutés ou modifiés
4. 📚 Documentation ajoutée (liens vers fichiers)

---

## ⛔ NE PAS FAIRE

- ❌ réinventer une architecture complexe inutile
- ❌ casser les chemins existants sans migration claire
- ❌ ajouter des outils ou abstractions superflus

---

## ▶️ DÉMARRAGE

👉 **Commence maintenant par la TÂCHE A : Audit de l’existant**,  
puis exécute les tâches **B → E** dans cet ordre.

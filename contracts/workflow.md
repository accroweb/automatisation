# Contrat global du workflow n8n

## Vision générale
Ce workflow orchestre une chaîne de nodes (Code, Gmail, Google Sheets, monday.com, If, Switch) dont les contrats individuels définissent les responsabilités. Le contrat global décrit leurs interactions, les garanties collectives et les invariants transverses.

## Composition des contrats
| Node | Rôle principal | Contrat dédié |
| --- | --- | --- |
| Code | Transformation personnalisée | [`contracts/nodes/node-code.md`](contracts/nodes/node-code.md) |
| Gmail | Interaction avec la boîte Gmail | [`contracts/nodes/node-gmail.md`](contracts/nodes/node-gmail.md) |
| Google Sheets | Stockage / lecture dans Sheets | [`contracts/nodes/node-google-sheets.md`](contracts/nodes/node-google-sheets.md) |
| monday.com | Synchronisation avec boards | [`contracts/nodes/node-monday.md`](contracts/nodes/node-monday.md) |
| If | Route logique binaire | [`contracts/nodes/node-if.md`](contracts/nodes/node-if.md) |
| Switch | Routage multi-branche | [`contracts/nodes/node-switch.md`](contracts/nodes/node-switch.md) |

## Cartographie des dépendances
| Node | Dépendances amont | Dépendances aval |
| --- | --- | --- |
| Code | Tout générateur de données (trigger, Gmail, Sheets) | Gmail, Sheets, monday.com, If, Switch selon la transformation |
| Gmail | Code ou trigger définissant les paramètres | nodes d’analyse / stockage |
| Google Sheets | Code (valeurs), If/Switch (filtrage) | nodes downstream, reporting |
| monday.com | Code (payload), Gmail (notifications), If/Switch (routage) | suivi projet, notifications IA |
| If | Nodes fournisseurs de data | Branches TRUE/FALSE (Switch, monday, etc.) |
| Switch | Sources multiples (Code, Gmail) | Branches multiples ou `Fallback` |

## Engagements globaux
- **SLA** : chaque node doit répondre dans le délai d’exécution standard de n8n (généralement < 1 min). Si un node échoue, le workflow doit logguer l’erreur et activer un `Error Trigger`.
- **Cohérence** : les données restent normalisées (JSON structuré) entre les nodes ; les helpers `$` et les IDs (`messageId`, `spreadsheetId`, `itemId`) doivent circuler sans altération.
- **Responsabilités** : le node Code prépare les données, Gmail/Sheets/monday.com effectuent des actions externes, If/Switch orchestrent les chemins.

## Invariants du workflow
1. Les nodes externes (Gmail, Sheets, monday.com) ne sont invoqués qu’avec des credentials valides et un contexte préparé par le Code node.
2. Les routes conditionnelles (If, Switch) assurent qu’un item ne disparait pas (fallback ou log) même en cas d’absence de correspondance.
3. Les erreurs critiques sont capturées et reportées via un `Error Trigger` pour éviter des états silencieux.

## Gestion globale des erreurs
- Toute erreur d’un contrat de node déclenche l’arrêt de la branche, mais les autres branches (If/Switch) peuvent continuer selon la logique définie.
- Une stratégie de relance doit être définie (re-exécution manuelle ou re-soumission via des triggers planifiés) si l’échec touche Gmail, Sheets ou monday.com.

## Traçabilité & sécurité
- Toutes les sorties critiques (IDs, horodatages) sont conservées dans les métadonnées des items pour audit.
- Les tokens OAuth/API sont stockés dans les credentials sécurisés ; aucun log ne doit révéler ces secrets.

## Perspectives d’évolution
- Ajouter un contrat par nouveau node (ex. HTTP Request, AI Agent) dans `contracts/nodes/` et mettre à jour ce document.
- Élargir la section engagements/invariants quand le workflow gagne des SLA (temps de réponse, quotas, routines de monitoring).

## Validation de contrat
- Utiliser le script `scripts/validate-contract.js` (avec `--client <slug>` si nécessaire) pour valider un fichier JSON respectant `contracts/schema/contract-schema.json`.
- `scripts/load-registry.js --client <slug>` fusionne `contracts/registry.json` avec les overrides clients, puis `scripts/validate-registry.js --client <slug>` vérifie la validité et s'assure qu'aucun dossier `clients` ne traîne dans la zone socle.
- Le fichier `contracts/registry.json` montre le format attendu pour les nodes et le workflow global ; il sert de base pour les overrides et les scripts de validation.

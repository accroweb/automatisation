# Contrat du node monday.com

## Identité du node
- **Nom** : monday.com
- **Rôle dans le workflow** : orchestrer la gestion de boards, colonnes, groupes et items dans monday.com pour refléter l’état des tâches ou tickets.
- **Dépendances amont / aval** : exige un credential monday.com valide et un board ID en entrée ; les nodes suivants lisent les colonnes/updates retournés pour agir (notifications, reporting, IA).

## Objectif
- Synchroniser les actions métier avec monday.com : créer/archiver des boards, modifier des colonnes, déplacer des items.
- Supporter l’intégration d’agents IA qui lisent un item, ajoutent un update et changent des colonnes.

## Préconditions
- n8n v1.22.6 ou plus récent.
- Credential Monday configuré et le token avec la portée nécessaire pour modifier le workspace ciblé.
- Les boards/groupes/colonnes référencés doivent exister.

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `Board ID`, `Group ID`, `Item ID` | chaîne | Doivent correspondre à des entités existantes. |
| `Operation` | enum (Board, Column, Group, Item) | Choisir une opération supportée; certains paramètres (eg. columnValues) sont obligatoires pour `Change a column value`. |

## Traitement
- Appelle l’API monday.com selon l’opération (Add update, Change column values, Move item, etc.).
- Applique les règles métiers : formater les valeurs de colonne dans le format attendu (JSON stringifié), écrire les updates nécessaires pour l’IA, archiver les boards inactifs.

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| `json` | Objet monday.com (itemId, boardId, change result) | Utiliser pour tracer l’opération ou alimenter un suivi. |

## Conditions de validité
- Les IDs de board/groupe/colonne doivent être valides et accessibles avec le token donné.
- Les colonnes modifiées doivent accepter les types envoyés (texte, statut, date).

## Garanties
- Garantit qu’un appel abouti met à jour monday.com conformément au payload, avec une réponse structurée (code 200 et objet JSON complet).
- Maintient la cohérence de l’état du board tant que les préconditions (credential, ID) sont respectées.

## Gestion des erreurs
- Les erreurs API (quota, permission) provoquent l’arrêt ; prévoir un chemin de reprise (ex. `Error Trigger`).
- Le node ne retry pas seul : gérer la logique globale via un workflow orchestré (ex. rediriger vers un node de log et re-soumettre). 

## Contraintes non fonctionnelles
- **Performance** : limiter les appels multiples (regrouper les updates si possible).
- **Sécurité** : le token doit rester secret, ne jamais l’exposer dans les logs.
- **Traçabilité** : conserver le `itemId` et `updateId` en sortie pour l’audit.

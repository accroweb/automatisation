# Contrat du node Google Sheets

## Identité du node
- **Nom** : Google Sheets
- **Rôle dans le workflow** : utiliser Google Sheets comme source ou cible de données pour CRUD de lignes et documents.
- **Dépendances amont / aval** : dépend d’un credential Google actif ; les nodes amont fournissent les valeurs à écrire/mettre à jour. Les sorties alimentent des tableaux de reporting ou des API.

## Objectif
- Synchroniser les données métiers dans une feuille Google Sheets : création / suppression / mise à jour de documents et de lignes.
- Servir de datastore flexible pour conserver les résultats de calculs ou d’IA.

## Préconditions
- Credential Google Sheet configuré et autorisé à éditer les documents ciblés.
- Le document (spreadsheet) et la feuille doivent exister et être accessibles.

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `Spreadsheet ID` | chaîne | doit pointer vers un document existant. |
| `Operation` | `enum` (Document / Sheet / Row ops) | sélectionner l’opération document ou feuille adéquate. |
| `Values to Update` / `Column to Match On` | tableau de paires clé/valeur | les colonnes mentionnées doivent exister ; les types doivent respecter la feuille (texte, nombre). |

## Traitement
- Envoie les requêtes appropriées à l’API Google Sheets (append, update, clear, delete) en respectant l’ordre d’opérations.
- Maintient la logique métier, par exemple : limiter `Update Row` à la première correspondance ou `Append or Update` en fonction de la présence du match.
- Peut faire du mapping automatique (Customer Datastore ? feuille) pour alimenter les lignes.

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| `json` | Métadonnées de l’action (rowsAffected, spreadsheetId, rowIndex) | Utiliser les IDs renvoyés pour les étapes suivantes. |

## Conditions de validité
- Le document doit autoriser les modifications (notamment pour les feuilles partagées).
- Les colonnes ou plages référencées doivent être cohérentes avec la configuration (ex. `Column to Match On`).

## Garanties
- Garantit que les opérations renvoyées par la feuille sont appliquées (rowIndex fourni, statut 2xx) si les préconditions tiennent.
- Préserve les données existantes en ne touchant que les colonnes spécifiées.

## Gestion des erreurs
- Les erreurs Google (permission, quota, mauvais ID) provoquent l’arrêt du node ; prévoir un handling upstream.
- Pas de retry automatique ; utiliser un `IF` plus tard pour rerouter les lignes en erreur.

## Contraintes non fonctionnelles
- **Performance** : limiter le nombre d’appels en regroupant les lignes (`Batch API`) si possible.
- **Sécurité** : maintenir les scopes restreints à Google Sheets.
- **Traçabilité** : enregistrer les `rowIndex` pour tracer la provenance des modifications.

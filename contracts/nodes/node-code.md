# Contrat du node Code

## Identité du node
- **Nom** : Code
- **Rôle dans le workflow** : réaliser des transformations personnalisées (JS, Python) lorsque les nodes standards ne suffisent pas.
- **Dépendances amont / aval** : reçoit des données de n’importe quel node upstream (Trigger, HTTP Request, Gmail, etc.) et transmet des items JSON aux nodes downstream.

## Objectif
- Exécuter un script JS ou Python unique pour calculer, enrichir ou filtrer les données tout en respectant les modes "Run Once for All Items" ou "Run Once for Each Item".
- Produire les structures nécessaires au workflow global (par ex. préparer un payload API, calculer des métriques, créer un prompt).

## Préconditions
- Les items d’entrée doivent être valides (JSON, champs attendus) et respecter la quantité de mémoire / temps d’exécution autorisée.
- Si des modules externes sont requis (self-hosted), ils doivent être activés par la configuration du runner.

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `items` | tableau d’objets JSON | chaque objet contient un champ `json` et optionnellement `binary`; attendez-vous à gérer les liens d’item si le nombre d’objets change. |
| `$` helpers | objet ($items, $json, $node, etc.) | disponible pour récupérer le contexte n8n, ne pas modifier directement les helpers. |

## Traitement
- Exécute la logique métier décrite (cycle synchrone ou promesse) ; privilégie les opérations déterministes.
- Applique les règles de validation, de mapping et d’analyse nécessaires sans appeler d’UI.
- Peut faire appel à `console.log` pour tracer les valeurs pendant les tests.

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| `items` | tableau d’objets JSON | Structure définie par le script, doit contenir les mêmes champs attendus par les nodes suivants. |

## Conditions de validité
- Les items produits doivent respecter la structure des nodes downstream (keys, types).
- Les promesses retournées doivent être résolues pour éviter un timeout.

## Garanties
- Si les préconditions sont satisfaites, le Code node garantit la transformation des données dans le mode choisi et la cohérence des structures `items` sorties.
- Il garantit l’isolement (aucun effet de bord sur les autres nodes si le code reste déterministe).

## Gestion des erreurs
- Les erreurs d’exécution déclenchent un échec de node ; prévoir un bloc `try/catch` avec `throw new Error(...)` pour expliciter le problème.
- Aucun retry automatique : planifier un node `Error Trigger` ou un flux alternatif si nécessaire.

## Contraintes non fonctionnelles
- **Performance** : limiter les boucles lourdes, réinitialiser les objets entre exécutions.
- **Sécurité** : ne jamais logguer de credentials; gérer les secrets via `$credential`.
- **Traçabilité** : utiliser `console.log` pour tracer les entrées clés en mode debug.

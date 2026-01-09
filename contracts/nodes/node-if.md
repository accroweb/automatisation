# Contrat du node If

## Identité du node
- **Nom** : If
- **Rôle dans le workflow** : bifurquer le flux en fonction d’une ou plusieurs conditions métier, souvent en amont d’un Merge ou d’un Switch.
- **Dépendances amont / aval** : reçoit des items dont il évalue les champs; les branches True/False alimentent les nodes downstream.

## Objectif
- Autoriser un routage conditionnel simple : exécuter certains nœuds uniquement si la condition correspondante est remplie.
- Répondre à des questions comme "le document est-il validé?" ou "l’email contient-il l’étiquette X?".

## Préconditions
- Les variables/colonnes utilisées dans les conditions doivent être présentes sur les items entrants.
- Les comparaisons doivent respecter les types (String, Number, Date & Time, Boolean, Array, Object).

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `Conditions` | tableau de règles (champ, opérateur, valeur) | Chaque règle doit correspondre à un type supporté; combinaison via AND/OR définie par l’utilisateur. |
| `Logic Mode` | AND / OR | Détermine si toutes les règles ou au moins une doivent être satisfaites. |

## Traitement
- Évalue les conditions en fonction de la configuration : convertit les types si "Less Strict Type Validation" est activé.
- Dirige les items vers la branche TRUE ou FALSE (en fonction du résultat) et transmet les metas nécessaires.

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| Branches True / False | items / métadonnées | Les items maintiennent leur structure; il faut gérer les flux qui ne reçoivent aucun item. |

## Conditions de validité
- Les opérateurs choisis doivent figurer dans la section "Available data type comparisons" pour le type de données utilisé.
- Les champs doivent exister sur l’objet JSON pour éviter les conditions `undefined`.

## Garanties
- Le node garantit qu’un item valide suit exactement une branche selon les règles AND/OR.
- Maintient la logique métier (choix entre AND et OR) tant que les données sont compatibles.

## Gestion des erreurs
- Un champ manquant ou un type incompatible peut rendre la condition fausse ; prévoir un suivi (log, node d’alerte).
- Pas de retry automatique; on peut enchaîner un `Error Trigger` si la condition doit être auditée.

## Contraintes non fonctionnelles
- **Performance** : limiter les règles (éviter les comparaisons lourdes sur chaque item) et précompiler les expressions si possible.
- **Sécurité** : ne pas exposer de tokens en conditions (ex. `item.json.secret`).
- **Traçabilité** : inclure dans les métadonnées la condition évaluée pour tracer les choix.

# Contrat du node Switch

## Identité du node
- **Nom** : Switch
- **Rôle dans le workflow** : router les items vers plusieurs sorties selon des règles ou une expression calculée.
- **Dépendances amont / aval** : utilise les données entrantes pour évaluer les règles de chaque sortie; les branches suivantes reçoivent les items ciblés.

## Objectif
- Distribuer les données vers plusieurs chemins parallèles (ex. `output 0`, `output 1`, etc.) en utilisant soit des règles statiques, soit une expression personnalisée.
- Remplacer ou compléter les nodes If quand plus de deux sorties sont nécessaires.

## Préconditions
- Les champs évalués doivent exister et être typés.
- Les expressions, si utilisées, doivent retourner un entier valide correspondant à un index de sortie.

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `Mode` | "Rules" / "Expression" | Détermine si on construit des règles par sortie ou si on fournit une formule. |
| `Routing Rules` | list of comparisons | Chaque sortie a un ensemble de conditions; les champs/règles doivent être cohérents. |
| `Number of Outputs`, `Output Index` (expression) | entier | L’expression doit renvoyer un index compris entre 0 et `Number of Outputs - 1`. |

## Traitement
- En mode Rules, chaque sortie teste ses conditions en cascade (Drop first match ou send to all matching outputs selon les options). 
- En mode Expression, le node calcule un index et envoie l’item à la sortie correspondante.
- Options comme `Ignore Case`, `Less Strict Type Validation`, `Send data to all matching outputs` modifient légèrement la logique de matching.

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| Outputs multiples | items | Les items sont copiés vers l’output correspondant; les options `Fallback Output` et `Extra Output` gèrent les cas non matchés.

## Conditions de validité
- Les règles ne doivent pas être contradictoires si `Send data to all matching outputs` est désactivé.
- L’expression doit renvoyer exclusivement des nombres entiers.

## Garanties
- Le node garantit qu’un item correspondant est routé vers la bonne sortie ou vers le `Fallback Output` si aucune règle ne matche.
- Maintient les invariants d’un seul (ou tous) sortie(s) selon la configuration des options.

## Gestion des erreurs
- Une expression non valide déclenche une erreur ; prévoir un flux d’erreur ou un `No Operation`.
- Si aucune condition ne match et `Fallback Output` est `None`, l’item est ignoré (traiter via un node de log).

## Contraintes non fonctionnelles
- **Performance** : limiter les règles pour éviter de re-parcourir l’item plusieurs fois.
- **Sécurité** : éviter d’évaluer des expressions malveillantes; expression doit rester simple.
- **Traçabilité** : ajouter des annotations (tags) pour savoir quelle règle a matché.

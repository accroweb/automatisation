# Contrat du node Gmail

## Identité du node
- **Nom** : Gmail
- **Rôle dans le workflow** : manipuler la boîte Gmail (drafts, labels, messages, threads) pour automatiser les échanges.
- **Dépendances amont / aval** : requiert un credential Google prêt ; les nodes amont fournissent le contexte (ex. déclencheur, filtre AI). Il livre des messages/threads aux nodes suivants pour traitement ou archivage.

## Objectif
- Répondre aux besoins email natifs : envoyer des messages, organiser des labels, marquer des threads, créer des brouillons.
- Alimenter le workflow avec l’état exact des messages (dans `json.message`, etc.) pour la suite du traitement IA ou CRM.

## Préconditions
- Credential Google configuré (OAuth) et scope Gmail autorisé.
- Le compte Gmail doit posséder les droits nécessaires sur les ressources manipulées.

## Entrées
| Paramètre | Type / format | Contraintes |
| --- | --- | --- |
| `Operation` | `string` (ex. `Send a message`, `Get a message`) | Choisir une opération prise en charge. |
| `Message`, `Thread`, `Label` fields | `JSON` | Fournir les identifiants (`messageId`, `threadId`) lorsque requis; `Labels` via tableau de chaînes. |

## Traitement
- Appelle l’API Gmail en fonction de l’opération choisie (draft, label, message, thread).
- Applique les règles métiers : conserver l’état `read/unread`, ajouter les labels adéquats, connecter les messages à une IA (via la section AI tool si activée).

## Sorties
| Donnée produite | Type / format | Remarques |
| --- | --- | --- |
| `json` | Objet Gmail (message/thread/label metadata) | Structure fournie directement par l’API Gmail ; inclut `id`, `labels`, etc. |

## Conditions de validité
- L’opération retourne un statut HTTP 2xx ; sinon le node échoue.
- Les IDs fournis doivent exister ; sinon le node déclenche une erreur `Not Found`.

## Garanties
- Le node garantit que l’API Gmail est appelée avec les scopes configurés et que la réponse est traduite en JSON utilisable par les nodes downstream.
- Préserve la cohérence des labels/messages lorsque les préconditions (credential et IDs) sont respectées.

## Gestion des erreurs
- Les erreurs Gmail (authentification, quota, objet introuvable) interrompent le node ; prévoir un `Error Trigger` en sortie.
- Le node ne retry pas automatiquement ; utiliser un Workflow Error Handler (ex. Retry HTTP Request) si besoin.

## Contraintes non fonctionnelles
- **Performance** : limiter la fréquence d’appels pour éviter de dépasser les quotas Gmail.
- **Sécurité** : ne jamais exposer les tokens OAuth dans les logs.
- **Traçabilité** : conserver le messageId/id de thread dans la sortie pour audit.

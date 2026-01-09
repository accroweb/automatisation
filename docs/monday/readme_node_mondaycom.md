# monday.com node cheat sheet

## Objective
- Automate monday.com resources (boards, columns, groups, and items) and connect them to other services.

## Version requirements & credentials
- Requires n8n 1.22.6 or newer.
- Set up monday.com credentials at https://docs.n8n.io/integrations/builtin/credentials/mondaycom/.

## Supported operations
- Board: archive a board, create a new board, get a board, get all boards.
- Board Column: create a new column, get all columns.
- Board Group: delete a group, create a group, get the list of groups.
- Board Item: add an update, change one or multiple column values, create an item, delete an item, get one, get all, get items by column value, move an item to a group.

## Tips
- The node can feed an AI agent (https://docs.n8n.io/advanced-ai/examples/using-the-fromai-function/); templates include "Create ticket on specific customer messages in Telegram" and "Telegram AI Chatbot".
- For unsupported actions, reuse the credential in an HTTP Request node and follow https://docs.n8n.io/integrations/custom-operations/.

## Quick resources
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mondaycom/#operations
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mondaycom/#what-to-do-if-your-operation-isnt-supported

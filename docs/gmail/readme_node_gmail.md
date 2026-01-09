# Gmail node cheat sheet

## Objective
- Automate Gmail: create, modify, delete, or read drafts, labels, messages, and threads so your mailbox can talk to other apps.

## Authentication
- Configure Google credentials via https://docs.n8n.io/integrations/builtin/credentials/google/.

## Supported operations
- Draft: create, delete, get, get many.
- Label: create, delete, get, get many.
- Message: add/remove label, delete, get, get many, mark as read/unread, reply, send.
- Thread: add/remove label, delete, get, get many, reply, trash, untrash.

## Tips
- Use this node as an AI tool (https://docs.n8n.io/advanced-ai/examples/using-the-fromai-function/); some parameters can be filled automatically.
- Browse the Templates and examples section or visit https://n8n.io/integrations/gmail/ for ready-made workflows.
- For unsupported cases, call the Gmail API with the HTTP Request node using the same credential and follow the Custom API operations guidance.

## Quick resources
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/#operations
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/common-issues/
- https://docs.n8n.io/integrations/custom-operations/

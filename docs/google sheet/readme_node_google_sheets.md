# Google Sheets node cheat sheet

## Objective
- Automate creating, updating, and reading Google Sheets documents while syncing them with other services.

## Authentication
- Set up Google credentials at https://docs.n8n.io/integrations/builtin/credentials/google/.

## Core operations
- Document: create spreadsheet, delete spreadsheet.
- Sheet Within Document: append or update row, append row, clear a sheet, create a sheet, delete a sheet, delete rows or columns, get row(s), update row.

## Tips
- The docs show a Customer Datastore > Google Sheets example that demonstrates the Update Row operation.
- Templates such as "Generate AI Viral Videos with Seedance" live in the Templates and examples section.
- Check the official Google Sheets API (https://developers.google.com/sheets/api) to understand each operation's limits.
- For unsupported actions, reuse the same credential inside an HTTP Request node and follow Custom API operations guidelines.

## Quick resources
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/#operations
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/common-issues/
- https://docs.n8n.io/integrations/custom-operations/

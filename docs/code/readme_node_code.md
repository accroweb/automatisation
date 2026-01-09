# Code node cheat sheet

## Objectif
- Use the Code node to run custom JavaScript or Python steps inside workflows; it replaces the older Function/Function Item nodes.

## Modes d'execution
- Run Once for All Items (default) executes the block a single time no matter how many input items exist.
- Run Once for Each Item runs the code separately for every incoming item.

## Langages & bibliotheques
- JavaScript: Node.js runtime that supports promises, console.log, and the built-in $ methods/variables for quick access to data and metadata.
- Python: the native runner (Pyodide is legacy) requires bracket syntax (e.g. item["json"]["field"]) and is slower; n8n Cloud ships only crypto and moment, self-hosted installs can add npm modules once the task-runner config enables them.

## Concepts a maitriser
- Map your data structure and handle item linking when the number of incoming and outgoing items differs.
- Type $ (JavaScript) or _ (Python) to surface available helpers, and lean on the built-in keyboard shortcuts in the editor.
- Enable additional modules by following the self-host configure modules guide if you need packages beyond the Cloud defaults.

## Astuce AI
- On n8n Cloud switch to JavaScript, open the Ask AI tab, describe the desired behavior, then click Generate Code; AI snippets replace the existing code, so treat them as a starting point.

## Ressources rapides
- https://docs.n8n.io/code/builtin/overview/
- https://docs.n8n.io/hosting/configuration/configuration-examples/modules-in-code-node/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/common-issues/

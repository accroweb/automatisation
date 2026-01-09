# If node cheat sheet

## Objective
- Filter workflow data by building field comparisons so you can route items down specific branches.

## Creating conditions
- Pick a Data type (e.g. Date & Time > is after) to expose the right fields and comparators.
- Click Add condition to stack rules, then select AND or OR to require all or any match.

## Available comparisons
- The Available data type comparisons section lists the operators per String, Number, Date & Time, Boolean, Array, and Object (exists, contains, is greater than, etc.), which keeps the UI in sync with the type you treat.

## Branch execution & Merge (legacy)
- The old behavior before n8n 1.0 could execute both branches if an If node fed a Merge node; this warning only applies to workflows that still use the v0 execution order.

## Templates & resources
- Templates such as "AI agent that can scrape webpages" and "Automate Multi-Platform Social Media Content Creation with AI" show practical uses.
- For more complex flows, check Splitting with conditionals and switch to the Switch node when you need more than two outputs.

## Quick links
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.if/#add-conditions
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.if/#available-data-type-comparisons
- https://docs.n8n.io/using-n8n/flow-logic/splitting-with-conditionals/

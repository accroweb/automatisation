# Switch node cheat sheet

## Objective
- Route data across multiple outputs using rules or an expression, making it ideal when you need more than two branches.

## Configuration modes
- Rules: add routing rules, pick the data type and comparator, and turn on Rename Output when you want to label the stream that receives matches.
- Expression: set the number of outputs and write the expression that returns the target index as a number.

## Rule options
- Fallback Output (None, Extra Output, or Output 0) determines what happens to unmatched items.
- Ignore Case, Less Strict Type Validation, and Send data to all matching outputs fine-tune the match tolerance.

## Available comparisons
- See the Available data type comparisons section for String, Number, Date & Time, Boolean, Array, and Object operators (exists, contains, length, etc.) so the fields match the type you handle.

## Templates & resources
- Templates include "Building Your First WhatsApp Chatbot", "Telegram AI Chatbot", and "Respond to WhatsApp Messages with AI Like a Pro!."
- Consult Splitting with conditionals to compare If and Switch.

## Quick links
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/#node-parameters
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/#available-data-type-comparisons
- https://docs.n8n.io/using-n8n/flow-logic/splitting-with-conditionals/

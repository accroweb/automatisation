# Demo client overrides

`clients/demo` hold the lightweight overrides for the `workflow-gen` base template.

## Structure
- `specs/` overrides registry entries (nodes/workflow) without touching the base.
- `workflows/` holds workflow JSON files that replace base versions when the filename matches.
- `config/` is for client-specific settings or credential references; never commit secrets here.

Drop files here and rerun the loader/validation scripts with `--client demo` to activate overrides.

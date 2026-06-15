# Security Policy

This public mirror intentionally excludes:

- private host paths
- tailnet URLs
- local runtime service bindings
- secrets
- receipts
- restore packs
- operational reports
- SQLite databases
- backend runtime files

The UI uses relative API paths only and must not embed secrets or
machine-local infrastructure details.

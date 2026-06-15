<img width="2517" height="1309" alt="atrium-finaljpg" src="https://github.com/user-attachments/assets/07ef9f39-3bdb-44d4-b66b-a49c8b536a8a" />
# VisionDeck by Atrium Intelligence — BalanceMi

VisionDeck is a polished operator cockpit for BalanceMi: a personal command
surface that makes priorities, calendar pressure, manual intake, and read-only
proof visible — without turning the UI into a backend control plane.

## What it does

- Displays BalanceMi overview signals across life domains.
- Supports manual task intake and categorization through existing API endpoints.
- Keeps command-terminal behavior read-only.
- Preserves a clean separation between public UI, private runtime, and backend.
- Uses a dark glass cockpit visual language with gold accents and structured
  dock navigation.

## Endpoint policy

The UI uses relative endpoint discovery only:

    /api/visiondeck/balancemi

No private host paths, local filesystem paths, tailnet URLs, or localhost binds
are required in the public release.

## Release status

This repository is a sanitized public mirror. Private receipts, runtime reports,
host paths, local service bindings, and operator-only deployment files are
intentionally excluded.

# Architecture

VisionDeck BalanceMi is a frontend operator surface. It is not the backend
authority layer.

## Boundaries

- UI: render, submit allowed form payloads, show proof/status.
- API: existing BalanceMi endpoints.
- Terminal: read-only cockpit mode.
- Backend: remains separate and is not bundled in this public mirror.

## Public API base

    /api/visiondeck/balancemi

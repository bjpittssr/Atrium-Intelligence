# VisionDeck by Atrium Intelligence — BalanceMi
![VisionDeck dashboard](screenshot.png)
<img width="2517" height="1309" alt="atrium-finaljpg" src="https://github.com/user-attachments/assets/07ef9f39-3bdb-44d4-b66b-a49c8b536a8a" />


# VisionDeck by Atrium Intelligence — BalanceMi

![VisionDeck Interface](screenshot.png)

**VisionDeck** is a premium operator dashboard for **BalanceMi**, designed to convert fragmented personal demand signals into a structured, readable command surface.

It provides a polished frontend cockpit for priority awareness, calendar pressure, manual intake, categorization, and read-only operational proof — without turning the UI into a backend control plane.

> See more. Know first. Act with precision.

---

## Overview

VisionDeck is built around one practical thesis:

Modern life produces too many competing signals. A useful dashboard should not just display tasks — it should expose pressure, context, timing, and decision readiness.

BalanceMi organizes those signals across life domains such as health, family, maintenance, finance, schedule load, learning, and future model-assisted workflows. VisionDeck presents that information through a refined glass cockpit interface with structured navigation, drilldown surfaces, and a read-only terminal-style proof layer.

This repository is a sanitized public frontend mirror. Private runtime files, operator-specific deployment records, local infrastructure paths, and backend execution components are intentionally excluded.

---

## Core Capabilities

* **BalanceMi Overview**
  Displays current balance state, active domains, and near-term pressure areas.

* **Manual Intake / Corrections**
  Provides a structured interface for task entry, categorization, and operator correction workflows.

* **Calendar Pressure View**
  Surfaces weekly load, upcoming constraints, and immediate schedule pressure.

* **Dock-Based Drilldown Navigation**
  Keeps the main canvas focused while secondary panels expand through the left navigation dock.

* **Read-Only Command Terminal**
  Presents operational status and proof data in a terminal-inspired interface without enabling command execution.

* **Proof Drawer**
  Supports audit-friendly visibility into recent actions and response payloads.

* **Integration Placeholders**
  Includes public-safe placeholders for Meridian Learning API and OpenSky HALO Academy integration paths.

---

## Visual System

VisionDeck uses a professional dark cockpit design language:

* deep charcoal interface foundation
* glassmorphism panels
* gold accent hierarchy
* soft shadows and layered depth
* structured left-side dock navigation
* restrained typography
* read-only CRT-inspired terminal treatment
* brand-forward masthead with VisionDeck and Atrium Intelligence assets

The goal is not visual noise. The goal is controlled clarity.

---

## Architecture

VisionDeck is a frontend operator surface. It is not the backend authority layer.

```
flowchart LR
    UI[VisionDeck Frontend] --> API[BalanceMi API]
    UI --> Proof[Read-Only Proof Surface]
    UI --> Intake[Manual Intake Form]
    API --> Domains[Domain Registry]
    API --> Categorize[Categorization]
    API --> Manual[Manual Intake]
```

### Boundary Model

| Layer            | Responsibility                                                |
| ---------------- | ------------------------------------------------------------- |
| VisionDeck UI    | Render state, submit supported payloads, display proof/status |
| BalanceMi API    | Domain registry, categorization, manual intake                |
| Proof Surface    | Read-only operational visibility                              |
| Terminal Surface | Awareness only; command execution disabled                    |
| Backend Runtime  | Separate system, not bundled in this public mirror            |

---

## Endpoint Policy

The UI uses relative endpoint discovery only:

```text
/api/visiondeck/balancemi
```

Expected API actions:

```text
GET  /domains
POST /categorize
POST /intake/manual
```

The public release does not embed private hostnames, machine-local paths, local service bindings, runtime receipts, databases, or deployment-specific infrastructure.

---

## Repository Scope

This repository includes:

```text
index.html
visiondeck.css
visiondeck.js
balancemi-payload-contract.json
assets/
docs/
README.md
RELEASE_NOTES.md
SECURITY.md
LICENSE
```

This repository excludes:

```text
private runtime reports
operator receipts
restore packs
SQLite databases
backend source roots
local deployment paths
private service binds
machine-specific configuration
```

---

## Local Usage

VisionDeck can be served as a static frontend.

A deployment environment should provide the BalanceMi API behind the relative route:

```text
/api/visiondeck/balancemi
```

For local development, use any static file server and configure your reverse proxy or development server so the relative API route resolves to your BalanceMi-compatible backend.

---

## Security Posture

VisionDeck is designed as a constrained operator surface.

Security principles:

* no embedded credentials
* no command execution from the browser
* no backend mutation beyond supported API form submissions
* no private runtime paths in the public mirror
* no database files in the frontend package
* no operator-only deployment records in source control
* read-only terminal behavior by design

The terminal panel is a visibility layer, not an execution layer.

---

## Current Release Status

**Status:** Public frontend mirror
**Release track:** Initial sanitized release
**Backend dependency:** BalanceMi-compatible API
**Execution mode:** Read-only cockpit with supported manual intake submission
**Private runtime artifacts:** Excluded

---

## In Progress — v2 Roadmap

The next iteration will focus on deeper productization, stronger integration boundaries, and improved operational intelligence.

### v2 Planned Enhancements

* **Dock Drawer Refactor**
  Move all secondary panels into dock-expanded drilldown views with main-canvas blur and focused overlay behavior.

* **Adaptive Balance Gauge**
  Improve the BalanceMi score visualization with proportional domain weighting, confidence indicators, and risk-state overlays.

* **Quote / Insight Provider Integration**
  Add a configurable daily quote or operator insight provider with local fallback rotation.

* **Manual Intake Validation Layer**
  Add client-side schema validation, field-level feedback, and payload preview before submission.

* **Payload Contract Versioning**
  Introduce visible contract version badges and compatibility warnings when API shape changes.

* **Calendar Pressure Intelligence**
  Expand weekly load visualization into structured capacity bands, constraint flags, and rolling two-week risk detection.

* **Proof Drawer Upgrade**
  Add filterable proof events, copy-safe receipts, and human-readable response summaries.

* **Meridian Learning API Integration**
  Attach learning-plan progress, active labs, skill graph state, and review queues.

* **OpenSky HALO Academy Integration**
  Add model-training status, academy roster visibility, certification gates, and evaluation summaries as read-only panels.

* **Public Deployment Template**
  Add a deployment-ready static hosting profile with documented reverse proxy expectations.

---

## Design Philosophy

VisionDeck is intentionally opinionated.

Most dashboards either overload the user with widgets or hide the actual decision context. VisionDeck takes a different route: it gives the operator a focused surface, clear pressure signals, and a clean path from intake to awareness.

The interface is built to feel calm, technical, and decisive.

No clutter.
No fake authority.
No guessing where the pressure is.

---

## Brand

**VisionDeck**
by **Atrium Intelligence**

A command surface for clarity in motion.

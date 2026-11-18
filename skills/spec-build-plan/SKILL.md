---
name: Spec Build Plan
description: Method for the Build Plan checklist of a spec. Use in the Spec agent when you work on the Build Plan.
---

# Spec Build Plan

The Build Plan is the order of work for the build agent. The build agent
does one step at a time, runs its check, and ticks its box. Each step must
be clear enough to build and check without a guess.

## Before you propose

1. Read the spec: Flows, Models, APIs, File Structure, Failure Modes, and
   the Build Plan `To decide` list.
2. Read the existing code, so the steps start from what already works.

## Step rules

- **First step.** The thinnest end-to-end path of the main flow. It can use
  fixed data or a stub for parts that later steps replace.
- **Working state.** After each step, the app runs and the earlier checks
  still pass.
- **One idea per step.** A step adds one flow, one part of a flow, or one
  failure mode. It is small enough to review in one read.
- **Spec names.** Name the functions from APIs, the models from Models, and
  the variants from Failure Modes that the step builds.
- **Coverage.** Every function in APIs and every variant in Failure Modes
  appears in one step.
- **Length.** Eight steps or fewer. If the spec needs more, propose a
  smaller scope.

## Check rules

- A check is one observable result: a command and its output, an HTTP call
  and its response, or one action in the UI and what it shows.
- A check is specific. Not "it works", but "`GET /items` returns 3 items".
- A check tests only its own step.

## Format

Use the Build Plan format in the agent instructions: one checklist line per
step, a dash, then the check.

```md
- [ ] `list_items` route with fixed data — `GET /items` returns 3 items
- [ ] `fetch_items` from the source API — `GET /items` returns live items
- [ ] `NotFound` for an unknown id — `GET /items/x` returns 404
```

## In chat

- Propose the build order, with one line each on why that order.
- Say which functions, models, and failure variants each step builds.
  Point out any that no step covers.

## On save

Do this without mention in chat. Replace the full checklist. Keep the
ticked state of steps that did not change.

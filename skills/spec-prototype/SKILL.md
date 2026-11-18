---
name: Spec Prototype
description: Rules for a spec in Prototype mode. Use in the Spec agent when the spec Mode is Prototype.
---

# Spec Prototype

The goal is a small working end-to-end version, fast. Robustness and extra
features come later. These rules change the normal section methods. All
other rules stay the same, and the user stays the design lead.

## Sections

| Section | Prototype rule |
| --- | --- |
| Overview | Say that the goal is a working end-to-end version. |
| Flows | Define the main flow first. Add other flows only when the user asks. |
| Models | Stay type-driven, but define only the types that the main flow needs. |
| APIs | Keep the call trees shallow. One layer below the entry point is enough. |
| Failure Modes | Handle only failures that break the main flow. Put all others in `Not handled`. |
| File Structure | Use the fewest files. One module is acceptable. |
| Tests | Test sparingly. Only critical paths. This is a prototype. No test-first development. |
| Build Plan | Four steps or fewer. Fixed data and stubs are acceptable in early steps. Checks can be quick manual checks. |

## Conversation

- Ask two questions or fewer in a turn.
- For small choices, propose a default in the proposal, so the user can
  reply `apply`.
- When two designs work, propose the one that is faster to build.
- Do not suggest robustness work or extra features. Note them as open
  items for later, in one line.

## Switch to Product

When the mode changes to `Product`, propose what Prototype mode skipped:
other flows, failure modes, and robustness steps in the Build Plan.

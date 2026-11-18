---
name: Spec Failures
description: Type-driven method for the Failure Modes section of a spec. Use in the Spec agent when you work on Failure Modes.
---

# Spec Failures

The Failure Modes section is the contract for the unhappy path: what can
fail, where we catch it, which type it becomes, and what the user sees.

## Before you propose

1. Read the spec: Flows, APIs, Models, and the Failure Modes `To decide`
   list.
2. Read the existing error handling in the code and the error responses of
   the external APIs.

## Scope

Include only failures at real boundaries in the current flows:

- User input.
- External calls, such as HTTP, an SDK, or a database.
- Parsing of external data.

Do not list every possible exception. The minimal rule from `spec-models`
applies: every variant needs a current flow that can produce it.

## Error types

- Failure Modes is the only section that defines error types. Models does
  not define them.
- Use the enum pattern from `spec-models`: one enum, behavior in methods,
  one exhaustive match per method. Use a sum type when a variant needs data.
- Start with one error enum. Split it only when two boundaries need
  different behavior.
- Write the types in one code block, with a `# Used by:` comment above each
  type.

## Behavior table

Add one table per error enum. Rows are variants. The first column is
`caught in`: the function from APIs that detects the failure. The other
columns are the enum methods that the current flows need, such as
`status()`, `user_message()`, or `retryable()`.

| `AppError` | caught in | `status()` | `user_message()` |
| --- | --- | --- | --- |
| `NotFound` | `fetch_item` | `404` | "No item with that name." |
| `UpstreamDown` | `fetch_item` | `502` | "Service unavailable. Try again." |

## Not handled

End with one `Not handled:` line. List the failures that we let crash on
purpose, in a few words each.

## Call trees

Do not show failures in the APIs call trees. The `caught in` column links
each failure to its function.

## In chat

- Propose the failures to handle, with the boundary that produces each one
  and what the user sees.
- Propose to drop a variant that no current flow can produce.

## On save

Do this without mention in chat. Replace the full content of the Failure
Modes toggle.

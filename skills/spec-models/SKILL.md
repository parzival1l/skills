---
name: Spec Models
description: Minimal Model-First method for the Models section of a spec. Use in the Spec agent when you work on Models.
---

# Spec Models

Design the Models section by iteration, with the Model-First method. The
user steers. You propose, justify, and re-derive when the user challenges a
model.

The catalogue is minimal. It models what the current Flows and APIs need,
and nothing more.

## Before you propose

1. Read the spec: Overview, Flows, APIs, Models, and the Models `To decide`
   list.
2. Read the existing code and the external API docs that the models touch.
3. Cite real constraints, such as `models.py:88` or a doc link. Label all
   other points as assumptions.

## Minimal rule

Every model and every field must have a current consumer: a Flow step or an
API. If nothing uses it now, leave it out.

Do not add:

- Fields for possible future features.
- Optional fields "in case".
- Base classes, generics, or shared abstractions with fewer than two
  current uses.
- Enums, IDs, or timestamps that no flow reads.
- Wrappers that only rename another model.

Use plain types and the shapes of the external API where they fit. Add a
model or field when a flow needs it, not before.

## Type-driven design

The user works in Rust style. Models drive behavior. Look for the most
elegant, simple, and understandable catalogue.

- **Invalid states are impossible.** Do not use flags or optional fields
  that are valid only in some combinations. Use a sum type instead.
- **Closed sets are enums.** Use an enum for every fixed set of cases, such
  as a status, a kind, or a mode. Do not use bare strings or booleans.
- **Cases with different data are sum types.** Each variant carries only its
  own data.
- **Behavior lives on the enum.** See the standard pattern below.
- **Parse at the boundary.** Convert external data into domain types at the
  edge, one time. Inside, use only domain types.

### Standard pattern: behavior on enums

1. Put each piece of per-variant behavior in a method on the enum.
2. In the method, use one exhaustive match over all variants. The type
   checker must fail when a variant is added and not handled.
3. Do not branch on the variant anywhere else. Call the method.
4. Per-variant constants, such as a label or a limit, are methods too.

| Language | Enum | Sum type | Exhaustive check |
| --- | --- | --- | --- |
| Rust | `enum` + `impl` | `enum` with data | `match` |
| Python | `Enum` with methods | dataclasses or Pydantic models in a union, with a `kind: Literal[...]` tag | `match` + `assert_never` |
| TypeScript | string union + functions in one module | discriminated union on `kind` | `switch` + `never` check |

Use the project language. If the project has no language yet, write the
models in Rust-like pseudocode.

## Questions to ask about the catalogue

- **What uses this?** Trace each model and field to a Flow step or an API.
  Cut what you cannot trace.
- **What can it not represent?** Find one real case from the current Flows
  or the task description. Do not invent future cases.
- **What does each distinction decide?** Merge two types that act the same.
  Split one type only if the current flows treat its parts differently.
- **What breaks if it goes?** If nothing breaks, propose to remove it.
- **Which states are invalid but possible?** Find bare strings, booleans,
  and optional fields that hide a closed set or a sum type. Propose the
  enum.

## Section format

- Use one `h3` toggle per layer, such as `Domain`, `API`, or `External`, in
  dependency order.
- In each toggle, put one code block with the project language tag. Write
  field signatures only. Write method bodies as `...`.
- Put `Used by` as a comment on the line above each model, inside the code
  block. Keep it to a few words.

  ```python
  # Used by: search, item detail
  class Item:
      name: str
      status: ItemStatus
  ```

- Under the code block, you may add a short note about a design choice
  that the code does not show. Example: "Search results are a plain
  `list[str]` of names."
- For each enum with behavior, add a behavior table. Rows are variants.
  Columns are the enum methods. Cells are the result for that variant.
  Example:

  | `ItemStatus` | `label()` | `is_final()` |
  | --- | --- | --- |
  | `Open` | `"Open"` | `False` |
  | `Closed` | `"Closed"` | `True` |

- Do not add tables of per-field rules. If a field is ambiguous, add a
  short trailing comment on that field. Leave clear fields without a
  comment.

  ```python
  class Item:
      image_url: str | None  # from the source API, can be missing
      tags: list[Tag]  # 1 to 3, in source order
  ```
- Models defines each model one time. Other sections use the model name.
- Do not define error types here. Failure Modes defines them.

## In chat

- Propose the types: added, changed, merged, split, or removed models and
  fields. Show the signatures.
- Give the consumer for each addition, and the reason for each removal, in
  one line.
- Add the case that the types could not represent, if you found one.
- Recommend cuts as often as additions.

## On save

Do this without mention in chat. Replace the full content of the Models
toggle in one `update_content` call.

## Judgment

If the user challenges a model, re-derive it. Do not defend it by habit. If
you were wrong, say so. If the user is wrong, say so, and show the case that
breaks. If the user asks for a speculative field, say that no current flow
uses it, then follow the user's decision.

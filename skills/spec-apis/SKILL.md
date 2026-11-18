---
name: Spec APIs
description: Call-tree method for the APIs section of a spec. Use in the Spec agent when you work on APIs.
---

# Spec APIs

The APIs section joins Flows and Models. For each flow, it shows the
functions that we implement, from the entry point down, as a call tree. The
signatures are the contract. The bodies do not matter.

## Before you propose

1. Read the spec: Overview, Flows, Models, APIs, and the APIs `To decide`
   list.
2. Read the existing code, so the tree uses the real entry points and names.

## Structure

- Use one `h3` toggle per flow, with the same name as the flow card.
- Put one code block per flow, in the project language.
- Start at the outermost entry point in our code, such as a route, a CLI
  command, or a UI handler.
- If a flow crosses a language boundary, such as frontend to backend, use
  one block per side. The HTTP call is a leaf in the first block.

## Depth

Go down level by level until the flow is clear. Stop at:

- An external call, such as HTTP, an SDK, or a database. Write it as a leaf
  comment: `# → Service  call`.
- A utility function that does not explain the flow.

## Shared functions

Define a function one time, in the first flow that uses it. In later flows,
write only the call with a comment: `fetch_product(id)  # see View product`.

## Format

- Write the full signature with types from Models.
- Add a docstring of one short sentence: what the function does.
- Write `calls:` under the docstring, and indent the called functions under
  it.
- Put one blank line after each docstring.
- Put one blank line between sibling functions and leaves under `calls:`.
- Do not write function bodies.
- Do not show failures or raised errors. Failure Modes covers them.

```python
@app.post("/api/orders")
def place_order(req: OrderRequest) -> OrderResponse:
    """Place one order and return its status."""

    calls:
        def price_order(req: OrderRequest) -> Order:
            """Build the order and compute its total."""

            calls:
                fetch_product(id)  # see View product

        def submit_order(order: Order) -> OrderStatus:
            """Charge the payment and store the order."""

            calls:
                # → Payments  POST /charges

                # → Database  INSERT orders
```

For other languages, use that language's signature syntax and doc comment.

## Design

- Each function does one thing that its name says.
- Types from Models drive the signatures. Do not pass bare strings or dicts
  where a model exists, except at the parse boundary.
- If a tree is deep or wide, propose a simpler split.

## In chat

- Propose the call tree for each flow. Show the signatures.
- Say which functions are new, changed, or removed, with one line each.
- Say which new types a signature needs.

## On save

Do this without mention in chat. Replace the full block of each changed
flow. For each new type, add an open question to the Models `To decide`
list.

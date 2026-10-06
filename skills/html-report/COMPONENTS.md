# Components

Each component is one chapter. Pass its id to `new_report.py --keep`, in page order. Run `new_report.py --list` to see them all.

## Pick one per chapter

Ask: **what changes, and between which states?** The answer picks the component.

| Id | Shows | Use when |
|---|---|---|
| `hero` | Headline, summary, optional stat rail, scorecards, and one notice | Always. It opens the page. |
| `routes` | The same inputs drawn twice, old and new, with tabs for each view | Inputs take a different route after a change |
| `scope` | One grid drawn twice, with tinted areas where a label applies | A label, heading, or rule leaks where it shouldn't |
| `flow` | A process with a gate, a retry loop, and a held branch, with tabs for each case | A process with checks, retries, and outcomes |
| `multiples` | Three small diagrams, one idea each | Two or three separate rules that each need a small proof |
| `rules` | Short rule names in grouped columns. Selecting one shows what it accepts and rejects. | A list of rules, contracts, or requirements |
| `compare` | The same fields from two sources, with "Show only differences" | Two runs, two engines, before and after |
| `speed` | Bars for recorded time, and a cost breakdown | Measured time or cost for two engines |
| `grid` | One tile per item, with a detail box | Many items with the same two or three fields |
| `strips` | Page ranges or spans per source | Ranges from several sources |
| `findings` | Before and after for each bug, with a picker | Bugs, regressions, incidents |
| `spotlight` | One real case with images that expand | One case explains the main result |
| `method` | A bracket diagram of what the results cover, then the limits | Always. It closes the page. |

**A proposal** usually takes `hero, routes, scope or flow, multiples, rules, method`, with no stat rail.
**A benchmark** usually takes `hero, routes, compare, speed, grid, method`.
**A failure report** usually takes `hero, findings, method`.

## Draw with these parts

Every diagram is an `<svg class="dx">` with a `viewBox`. Use 520 wide for a half-width view, 340 for a small multiple, and 1088 for a full panel. Wrap anything wider than 700 in `<div class="dx-wide">`, so it scrolls inside its box on a phone.

| Class | Draws |
|---|---|
| `group` | Dashed box around a set of inputs |
| `box` | Small square: one item in a set |
| `ring` | Outline circle or rectangle: a step, a document, an attempt |
| `dot` + `pip` | Filled accent circle: the admitted or chosen item |
| `okc` / `badc` / `heldc` | Passed (filled green) / rejected (red outline) / held (dashed amber) |
| `gate` | Diamond: a check |
| `node` | Filled square: a shared step every input goes through |
| `page` | Outline rectangle: a source document |
| `line`, `tip` | Connector and arrowhead. Add `dash` for a loop back or a path not taken. |
| `scope`, `scope focus`, `spill` | Tinted area where something applies, the one in focus, and where it leaks |
| `bracket-a` / `bracket-b` | Bracket under a range: covered (accent) / not covered (amber) |
| `lbl` | 12px mono label. Write it in capitals. |
| `mut`, `on-t`, `bad-t`, `ok-t`, `held-t`, `mono` | Text styles |

Put a state on a `<g>` to color everything inside it: `is-on`, `is-bad`, `is-ok`, or `is-held`.

**One accent per diagram.** Most parts stay neutral. Color marks only what the finding is about.

## What moves

- **Tabs.** `data-views` on an explainer gives it view tabs (a, b, both). `flow` cases come from `data.flow`.
- **Expand.** `data-expand` on an explainer or a figure adds an Expand button. Clicking the diagram also opens it large.
- **Scrolling tables.** Wrap a long table in `<div class="table-scroll">`. The header row stays put.
- **Rule detail.** A rule can show figures. Put an SVG in `<template id="RULE-accepts">` and `<template id="RULE-rejects">`.

Nothing else moves.

## Captions and labels

- A caption has one or two lines. The first names what the diagram shows. The second starts with `↳` and names the result.
- Every SVG gets `role="img"` and an `aria-label` that states its finding in one sentence.
- Tag a drawing that isn't a real page as "Concept diagram".

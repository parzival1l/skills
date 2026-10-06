# Components

Each component is one chapter. Pass its id to `new_report.py --keep`, in page order. Run `new_report.py --list` to see them all.

## Pick one per chapter

Ask: **what changes, and between which states?** The answer picks the component.

| Id | Shows | Use when |
|---|---|---|
| `hero` | Headline, summary, optional stat rail, scorecards, one notice | Always. It opens the page. |
| `routes` | The same inputs drawn twice: through one node, then each in its own lane | Inputs take a different route after a change |
| `scope` | One grid drawn twice: a heading leaks into the last row, then stays in its scope | A label, heading, or rule applies where it shouldn't |
| `flow` | Steps, a gate, a retry loop, and a held branch. Tabs pick the case. | A process with checks, retries, and outcomes |
| | `dots`: draw a step as N small rings, for a step with its own tries. `state`: `on` marks a step blue in every case. `loop.to`: the step id that a failed gate returns to. `attempts`: the gate's try count. `start`: the case index shown on load. Exactly one step has `shape: gate`. |
| `multiples` | Two to four small diagrams side by side | Separate rules that each need a small proof |
| `rules` | Short rule names in groups. Selecting one shows what it accepts and rejects. | A list of rules, contracts, or requirements |
| `compare` | The same fields from two sources, with "Show only differences" | Two runs, two engines, before and after |
| `speed` | Bars for recorded time, and a cost breakdown | Measured time or cost for two engines |
| `grid` | One tile per item, with a detail box | Many items with the same two or three fields |
| `strips` | Page ranges or spans per source | Ranges from several sources |
| `findings` | Before and after for each bug, with a picker | Bugs, regressions, incidents |
| `spotlight` | One real case with images that expand | One case explains the main result |
| `lanes` | Two lanes with a gate: who approves, then who builds | Next steps, ownership, approvals |
| `method` | Brackets under a row of steps: what the results cover and what they don't | Always. It closes the page. |

**A proposal** usually takes `hero, routes, scope, flow, multiples, rules, lanes, method`. No stat rail.
**A benchmark** usually takes `hero, routes, compare, speed, grid, method`.
**A failure report** usually takes `hero, findings, method`.

## Diagrams are JSON

Don't write SVG. A diagram is a spec in `report.data.json` under `diagrams`. The page draws it.

```html
<div class="explainer" data-diagram="routes" data-expand></div>
```

```json
"diagrams": { "routes": { "kind": "route", ... } }
```

The specs in your `report.data.json` already work. Change their words and counts. Every kind takes `aria` (one sentence that states the finding) and `caption` (one or two short lines).

| Kind | Spec |
|---|---|
| `route` | `tabs` [a, b], `titles` [a, b], `group`, `inputs` [3 to 6], `before` {`node`, `sub`, `bad` [indexes], `notes` [lines]}, `after` {`head`, `lanes` [one per input], `bad` [indexes], `gate`, `end`}, `caption` {`a`, `b`} |
| `scope` | `tabs`, `title`, `groups` [headings], `values` [rows of one value per group], `last` (the row below), `focus` (index), `notes` {`a`, `b`, `last`}, `caption` {`a`, `b`} |
| `flow` | `steps` [{`id`, `label`, `sub`, `shape`: page, ring, review, or gate, `dots`, `state`}], `loop` {`to`, `note`}, `held`, `attempts`, `start`, `cases` [{`tab`, `fails`, `reach`: end or held, `caption`}] |
| | `dots`: draw a step as N small rings, for a step with its own tries. `state`: `on` marks a step blue in every case. `loop.to`: the step id that a failed gate returns to. `attempts`: the gate's try count. `start`: the case index shown on load. Exactly one step has `shape: gate`. |
| `multiples` | `items` [{`title`, `diagram`, `caption`}]. Each `diagram` is `split`, `parts`, or `attempts`. |
| `split` | `left`, `right`, `items`, `held` [indexes], `ok`, `hold` |
| `parts` | `group`, `parts`, `bad` [indexes], `reject` [lines], `result` [lines] |
| `attempts` | `label`, `count`, `fail`, `result`, `note` |
| `lanes` | `lanes` [{`label`, `items`}, {`label`, `items`}], `gate`, `end` |
| `brackets` | `steps` [{`label`, `shape`: page, ring, dot, pair, or gate, `note`}], `brackets` [{`from`, `to`, `label`, `note`, `tone`: on or held}] |

**Labels are one to four words.** Notes and captions are eight words or fewer per line. The build warns when a label grows into a sentence. When that happens, show the idea with a shape, a state, or a second diagram.

If no kind fits, pick the closest one and say so in your summary. Don't hand-write SVG.

## What moves

- **Tabs.** `route` and `scope` get a/b/both tabs. `flow` gets one tab per case.
- **Expand.** `data-expand` adds an Expand button. Clicking a diagram also opens it large.
- **Scrolling tables.** Wrap a long table in `<div class="table-scroll">`. The header row stays put.
- **Rule detail.** A rule can show figures: `<template id="RULE-accepts">` and `<template id="RULE-rejects">`. Figures are optional. Keep a sample figure only if it fits a rule as it is, and rename its id. Otherwise delete the templates. Don't draw new ones.

Nothing else moves.

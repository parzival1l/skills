# Draw the explanation

A report explains with diagrams first and with text second. Each chapter has one diagram that shows the finding. The heading states the finding, the lede tells the reader where to look, and a short caption under the diagram names what it shows. Do not repeat the diagram in prose.

The design source is the Paper file **HTML Skill**, page **Visual explainers · Recovery contracts**. Open it to see each pattern with real content.

## Choose the diagram

Ask: what changes, and between which states? Then pick the pattern.

| The finding is about | Pattern | Component in the template |
|---|---|---|
| The same inputs taking a different route (before and after, old and new) | Two views of one diagram, side by side, with a view toggle | Route explainer |
| Where a label, rule, or scope applies, and where it leaks | One grid drawn twice, with tinted scope areas | Scope grid |
| A process with checks, retries, and branches | A left-to-right flow with a loop and an exit branch, and cases that play in order | Stepper flow |
| Two or three separate rules, each with a small proof | Small multiples: three small diagrams, one idea each | Small multiples |
| Many rules, contracts, or requirements | Short names in grouped columns, with a detail strip for the selected rule | Rule map |
| What a measurement or proof covers, and what it does not | A process row with brackets under it | Bracket diagram |
| Who does what, and in which order | Two lanes (for example, humans and agents) with a gate between them | Draw it with the same parts (see below) |

If no pattern fits, draw a new diagram with the same parts and states.

## Parts

Use these SVG classes. They take their color from the theme tokens, so a diagram works in dark and light mode. Never put a hex color in an SVG attribute.

| Class | Draws | Use for |
|---|---|---|
| `group` | Dashed rounded box | A set of inputs that stay together |
| `box` | Small square outline | One item in a set |
| `ring` | Circle or rectangle outline | A step, a document, an attempt |
| `dot` + `pip` | Filled accent circle with a center dot | An admitted or selected item |
| `okc` | Filled success circle | A saved or passed end state |
| `badc` | Warn outline circle | A rejected end state |
| `heldc` | Dashed secondary circle | A held or waiting state |
| `gate` | Diamond outline | A check that admits or rejects |
| `node` | Filled track square | A shared step that every input goes through |
| `page` | Ink outline rectangle | A source document |
| `line`, `tip` | Connector and arrowhead | Flow between parts |
| `line dash` | Dashed connector | A loop back, a path not taken, or future work |
| `scope`, `scope focus` | Tinted accent area | Where a label or rule applies |
| `spill` | Dashed warn area | Where something leaks that should not |
| `bracket-a`, `bracket-b` | Bracket under a range | What a claim covers (accent) or does not cover (secondary) |
| `lbl` | 12px mono uppercase label | Column and step names. Write the text in capitals. |
| `mut`, `on-t`, `bad-t`, `ok-t`, `held-t` | Text colors | Notes, admitted, rejected, passed, held |

## States

A group can carry one state class. The class changes every part inside it.

- `is-on`: admitted, selected, or the subject of the finding. Accent color.
- `is-bad`: rejected or wrong. Warn color.
- `is-ok`: passed or saved. Success color.
- `is-held`: held or waiting. Dashed secondary color.

Use one accent moment per diagram. Most parts stay neutral. Color marks only what the finding is about.

## Interaction

Interaction shows the explanation. It never hides it. Each diagram shows its final state without a click.

- **View toggle** (`data-views` on the explainer): the reader switches between view a, view b, and both side by side.
- **Trace** (`data-trace="key"` on parts): pointing at or focusing one part keeps every part with the same key lit, and fades the rest. Give the part `tabindex="0"` so a keyboard can reach it. A part can carry two keys: `data-trace="parse unmeasured"`. The first key is the one that it lights.
- **Stepper** (`class="dx stepper"`, `data-node` on parts, and `data.flow` cases): each case lists a path and the state of each part. The page shows the final state at once. Play reveals the path in order. Reduced motion skips the animation.
- **Rule detail**: a rule can have figures. Put an SVG in `<template id="RULE-ID-accepts">` and `<template id="RULE-ID-rejects">`.

## Size and text

- Draw each diagram in a `viewBox`. Use 520 wide for a half-width view, 340 for a small multiple, and 1088 for a full panel. The SVG scales to its column.
- Wrap a diagram wider than 700 units in `.dx-wide`. On a phone, it scrolls inside its box, not the page.
- Diagram text is 15px sans. Labels are 12px mono. Captions are 14px mono. Never go below 12px.
- A caption has one or two lines. The first line names what the diagram shows. A second line starts with `↳` and names the consequence.
- Give each SVG `role="img"` and an `aria-label` that states the finding in one sentence.
- Label a concept diagram as one with a tag: "Concept diagram". Do not let a drawing look like a source page.

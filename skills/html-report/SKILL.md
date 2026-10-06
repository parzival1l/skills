---
name: html-report
description: Build an interactive, single-file HTML report that picks the best layout for the evidence and uses plain Simplified Technical English. Dark by default with a light-mode switch. Use when the user asks for an HTML report, results page, benchmark or comparison report, proposal explainer, evidence or failure report, or wants run results, test output, or extraction comparisons turned into a page they can open, explore, and share.
---

# HTML report

Turn evidence into one HTML file that a reader can open offline, understand in ten seconds, and explore in detail. The file contains its fonts, images, data, and scripts. It never calls a live service.

The look comes from `docjev.html`: a large headline, a short summary, then chapters that each state one finding. Do not copy the docjev content or its fragment headlines. Copy its structure, its type, and its restraint.

## Files

- `references/layouts.md`: how to choose the layout for the evidence. Read it before you plan the page.
- `references/writing.md`: the writing rules (pragmatic STE). Read it before you write any text.
- `references/theme.md`: the color tokens for the dark and light themes.
- `assets/template.md`: the report outline. Fill it first.
- `assets/template.html`: every component, both themes, the theme switch, the data block, and the scripts.
- `assets/fonts/`: Overused Grotesk and IBM Plex Mono, both under the SIL Open Font License.
- `scripts/build_report.py`: puts fonts and images into the HTML file.
- `examples/sample-report.html`: the template as a built file. Open it to see each component.

## Workflow

1. Collect the facts. Read the run outputs, logs, metrics, and source files. Every number on the page must come from a file that you read.
2. Write the reader's question in one sentence (see `references/layouts.md`).
3. Choose the layout. Match each piece of evidence to a component with the table in `references/layouts.md`. Drop every component that the evidence does not support.
4. Fill `assets/template.md`. Write headings as full sentences (see `references/writing.md`).
5. Copy `assets/template.html` to `report.src.html` in the working folder. Delete the components that you dropped, and their data keys. Each script checks that its container exists, so removal is safe.
6. Put the real data in the `report-data` JSON block. Put each number in the JSON once. Calculate totals and ratios in the script.
7. If no component fits, build a new one. Use the same tokens and type scale, and follow the visibility rule.
8. Build the file: `python3 <skill>/scripts/build_report.py report.src.html -o report.html`. Fix every warning.
9. Do the checks in "Verification".

## Rules that matter most

1. **The reader reads without a click.** Interaction narrows, sorts, compares, or opens raw evidence. It never hides the main content. Show a list of rules as readable rows, not as tiles that open one at a time.
2. **Headings are full sentences.** Each heading states one finding, has a subject and a verb, and has no final period. Never write fragment pairs such as "Same word. Different scope."
3. **Plain words.** Follow `references/writing.md`. Sentences have 25 words or fewer. Do not use "should", "may", "might", or "could". Use one word for one meaning.
4. **Measured numbers only.** A number that needs a disclaimer does not go on the page. A proposal has no stat rail.
5. **Readable sizes.** Body text is 17px. Notes and table text are 15px or larger. Only mono labels (eyebrows, tags, ids) use 12px. Never set text below 12px.
6. **No tabular figures on prose.** Use `font-variant-numeric:tabular-nums` only on number columns (class `num`). On body text, it puts wide gaps before periods.

## Page structure

Keep this frame. Fill the middle with the components that you chose.

1. **Topbar**: project wordmark, report name, jump links, and the theme switch.
2. **Hero**: an eyebrow, a one-sentence headline with the key phrase in `<em>`, two sentences of summary, and then optional parts. These are the stat rail (measured numbers only), two scorecards, and a notice for one limit that the reader must see first.
3. **Chapters**: each chapter opens with an eyebrow, a full-sentence `h2`, and a lede of one or two sentences. Then comes one component.
4. **Method**: how you got the results, what they do not show, and links to the evidence.
5. **Footer**: date, run id, and "no live calls".

## Components

| Component | Use for |
|---|---|
| Compare table | The same fields from two sources, with "Show only differences" |
| Pair | Long text or steps from two sources, side by side |
| Catalog | Rules, requirements, contracts, and decisions: full text visible, chips and search to narrow |
| Status grid | Many items with the same two or three fields, with a detail box |
| Strips | Page ranges or spans from several sources |
| Findings | Bugs and fixes, with before and after evidence, a picker, and "Show all" |
| Race and breakdown | Recorded time and cost for two engines |
| Gallery | The inputs, with links to the originals |
| Spotlight | One real case that explains the main result, with zoomable figures |
| Pipeline | The steps of a process |
| `details` | Raw output, code, and long source text |

Each control has a keyboard path, a visible focus ring, and `aria-pressed` or `aria-live` state. Animation obeys `prefers-reduced-motion`.

## Theme

Both themes live in every report. Dark (Nocturnal Cobalt) values are in `:root`. Light (Cobalt Light) values are in `:root[data-theme=light]`. Keep both blocks and the switch. Dark is always the default. Do not add raw colors outside the two theme blocks. Use one accent: it marks engine A, the selected item, and the key phrase in the headline. Use the secondary color only for engine B. See `references/theme.md`.

Type: Overused Grotesk, weight 500 for headings and 400 for text. IBM Plex Mono for eyebrows, tags, ids, and code. Display is 72px or smaller. `h2` is 38px. Corners are square.

## Verification

1. Open the built file with no network. Fonts and images must load.
2. Click each tab, chip, search box, toggle, tile, and figure. The console must show no errors.
3. Switch to light mode and reload. The choice must stay. Both themes must have readable text.
4. Look at widths of 1336, 1000, and 390 pixels. No content can clip or overflow to the side.
5. Do the self-check in `references/writing.md`.
6. Count the clicks that the reader needs to read the main point. If the count is more than five, change the layout.
7. Compare each number with its source file.
8. Give the user the file path and size. Name each section that you dropped, and say why.

## Design source

The Paper file **HTML Skill** holds the reference artboards: the light docjev original and the dark explorations. Its token names match this template.

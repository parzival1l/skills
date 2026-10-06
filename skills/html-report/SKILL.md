---
name: html-report
description: Build an interactive, single-file HTML report in the docjev editorial style, dark by default with a light-mode switch. Use when the user asks for an HTML report, results page, benchmark or comparison report, evidence or failure report, or wants run results, test output, or extraction comparisons turned into a page they can open, explore, and share.
---

# HTML report

Turn recorded results into one HTML file a reader can open offline, scan in ten seconds, and explore in detail. The file embeds its fonts, images, data, and scripts. It never calls a live service.

The look comes from `docjev.html`: a big two-line headline, a stat rail, two scorecards, then chapters that each make one claim. Every report ships two themes. Nocturnal Cobalt, a matte dark ground with one cobalt accent, is the default. Cobalt Light is one click away. The topbar switch saves the reader's choice in the browser.

## Files

- `assets/template.md`: the report outline. Fill it first; each heading maps to one component.
- `assets/template.html`: a working report with every component, both themes, the theme switch, its data block, and its scripts. Start every report from it.
- `examples/sample-report.html`: the template built into one file. Open it to see every component and interaction.
- `assets/fonts/`: Overused Grotesk (sans) and IBM Plex Mono, both under the SIL Open Font License.
- `scripts/build_report.py`: inlines fonts and images into one file.
- `references/theme.md`: the color tokens, their roles, and the alternative palettes.

## Workflow

1. Collect the facts first. Read the run outputs, logs, metrics, and source files. Every number on the page must trace to a file you read. Never estimate or invent a number.
2. Write the story before any markup. Copy `assets/template.md` and fill it: one headline claim, the stat-rail numbers, one claim per chapter, and the one interesting mistake for the spotlight.
3. Copy `assets/template.html` into the working folder as `report.src.html`. Keep fonts referenced as `fonts/...`; the build step finds them in this skill.
4. Fill the `report-data` JSON block with the real data. Scripts render the race, breakdown, explorer, and strips from it. Put each number in the JSON once; derive totals and ratios in script.
5. Edit the static HTML: topbar, hero copy, chapter headings, findings, spotlight, method, footer.
6. Delete components the story does not need. Delete the matching data keys too. Each script block checks that its container exists, so removal is safe.
7. Add a component only when no existing one fits. Build it from the same tokens and type scale. Make it interactive if the reader needs to compare or filter.
8. Build the single file: `python3 <skill>/scripts/build_report.py report.src.html -o report.html`. Fix every warning.
9. Verify in a browser (see Verification).

## Page structure

Keep this order. Drop sections the evidence does not support.

1. **Topbar**: project wordmark, a hairline divider, the report name, two mono jump links, and the theme switch.
2. **Hero**: mono eyebrow (`PROJECT / REPORT TYPE / MONTH YEAR`), a live pill, the headline, a two-sentence sub, the stat rail (3–5 numbers), two scorecards, and a mono footnote with caveats. Add a `.notice` when a limit changes how far the reader should trust the result.
3. **Chapters**: each opens with a mono accent eyebrow, a short `h2`, an optional lede, and a tag or legend on the right.
4. **Explorer**: a filter, a tile grid, and a detail box for item-level results.
5. **Strips** for ranges or segments; **findings** for long-form before/after evidence.
6. **Spotlight**: the one interesting mistake, with zoomable figures.
7. **Method**: a pipeline row, "what we measured" and "what these numbers can say", evidence links, and a note.
8. **Footer**: date, how the report was built, run id, and "recorded results, no live calls".

## Components

| Component | Use for | Interaction |
|---|---|---|
| Scorecards | The two headline results | Values bound from data |
| Gallery | What went in: inputs, document types | Hover lift, links to originals |
| Race panel | Latency or any two-engine measure | Task tabs, replay at recorded speed |
| Breakdown panel | Cost, time, or count split | Proportional stack and ledger |
| Explorer | Per-item correctness | Group filter, tiles, detail box |
| Strips | Page ranges, segments, spans | Packet tabs, flagged segment outline |
| Findings | Bugs, regressions, before/after proof | Tile picker, "Show all evidence" |
| Spotlight | The one mistake worth a close look | Click a figure to zoom |
| `details` | Raw output, code, long evidence | Native expand |

Interactivity is required, not decoration. The reader must be able to filter, select, compare, and expand. Every control has a keyboard path, a visible focus ring, and `aria-pressed` or `aria-live` state. Animation respects `prefers-reduced-motion`.

## Voice

The page talks like `docjev.html`. Write short, confident claims, and keep caveats beside the claim they limit.

- Headline: two short lines, the second ending on the payoff word in `<em>`. Examples: "Paperwork, meet *fast.*", "Failures found. Fixes *verified.*", "Read the conversation. Check what *stays.*"
- Chapter `h2`: one claim in two to six words, often two parallel sentences. Examples: "Real pages. Real variety.", "One cut too many.", "Small study. Open notebook."
- Eyebrows and tags: mono, sparse, `NN / NAME` numbering, slashes as separators.
- Ledes and notes: plain sentences of 25 words or fewer. Name the actor. State the sample size and what was out of scope.
- Numbers: tabular figures, with units in a smaller size. Show both sides of every comparison (`7 / 8`, never only `87.5%`).
- Name the limits: sample size, who labeled the data, what was not tested, uncontrolled conditions.

## Theme

Use the tokens in `references/theme.md`. Dark values live in `:root`; light values live in `:root[data-theme=light]`. Keep both blocks and the theme switch in every report. Never remove light mode, and never make light the default. Do not add raw colors outside these two blocks. Keep one accent: it marks engine A, the selected item, and the headline payoff word. The secondary color only separates engine B. Use the warn color for misses and flagged items. Use the success color for passes.

Type: Overused Grotesk at weight 500 for display and headings, and weight 400 for body. IBM Plex Mono for eyebrows, tags, labels, ids, and code. Display is 89px with -0.054em tracking. `h2` is 42px. Body is 16px. Mono labels are 10–11px.

Layout: 1240px max width with 48px side padding. A 1px ink rule opens each chapter, with 61px between chapters. Corners are square everywhere except dots.

## Verification

1. Open the built file in a browser with no network access. Fonts and images must load.
2. Click every tab, filter, tile, packet, finding, and zoom figure. The console must stay free of errors.
3. Switch to light mode, reload, and confirm the choice persists. Check both themes for readable text and distinct chart colors.
4. Check widths of 1336, 1000, and 390 pixels. Nothing may clip or overflow sideways.
5. Check every number on the page against its source file.
6. Report the file path and size to the user. Name any section dropped for lack of evidence.

## Design source

The Paper file **HTML Skill** holds the reference artboards: the light docjev original and the dark explorations. Its token names match this template. To trial a new palette, duplicate the Nocturnal Cobalt artboard in Paper, change its token set, and copy the chosen values into `:root`.

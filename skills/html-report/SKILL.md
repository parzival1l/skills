---
name: html-report
description: Build an interactive, single-file HTML report that explains with diagrams, picks the best layout for the evidence, and uses plain Simplified Technical English. Dark by default with a light-mode switch. Use when the user asks for an HTML report, results page, benchmark or comparison report, proposal explainer, evidence or failure report, or wants run results, test output, or extraction comparisons turned into a page they can open, explore, and share.
---

# HTML report

Turn evidence into one HTML file that a reader can open offline, understand in ten seconds, and explore in detail. The file contains its fonts, images, data, and scripts. It never calls a live service.

The page explains with diagrams first. Text names what the diagram shows. The look comes from `docjev.html`: a large headline, a short summary, then chapters that each state one finding with one diagram.

## Run the build in a subagent

The build reads many files, writes about 1,000 lines, and checks screenshots. Keep that work out of the main conversation.

1. **In the main conversation**, settle the brief. Ask the user only what the files cannot answer.
   - The reader's question, in one sentence.
   - The source files: absolute paths to the runs, logs, proposals, and metrics.
   - The output folder and file name.
   - The audience, and anything to leave out.
2. **Spawn one subagent** if the harness can (for example, the Task tool in Claude Code, or the `general` agent in OpenCode). Give it a brief that stands alone, because it starts with no context:
   - "Load the `html-report` skill and follow its build workflow."
   - The four brief items above, with absolute paths.
   - The absolute path to this skill folder.
   - "Return the file path and size, the chapters with the diagram used in each, the dropped sections and why, and any number that you could not trace to a source file."
3. **When the subagent returns**, give the user its summary and the file path. Do not paste the HTML into the conversation.
4. **For a change request**, send the new instruction to the same subagent session if the harness can continue one. Otherwise, spawn a new subagent with the brief, the report path, and the change.

If the harness cannot spawn a subagent, run the build workflow in the main conversation.

## Files

- `references/layouts.md`: how to choose the layout for the evidence. Read it first.
- `references/explainers.md`: the diagram patterns, SVG parts, states, and interactions.
- `references/writing.md`: the writing rules (pragmatic STE). Read it before you write any text.
- `references/theme.md`: the color tokens for the dark and light themes.
- `assets/template.md`: the report outline. Fill it first.
- `assets/template.html`: every component and diagram pattern, both themes, the data block, and the scripts.
- `assets/fonts/`: Overused Grotesk and IBM Plex Mono, both under the SIL Open Font License.
- `scripts/build_report.py`: puts fonts and images into the HTML file.
- `examples/sample-report.html`: the template as a built file. Open it to see each component work.

## Build workflow

1. Collect the facts. Read the run outputs, logs, metrics, and source files. Every number on the page must come from a file that you read.
2. Write the reader's question in one sentence (see `references/layouts.md`).
3. Draw before you write. For each chapter, decide what changes and between which states. Pick a diagram pattern from `references/explainers.md`.
4. Fill `assets/template.md`: one heading, one lede, one diagram, and one caption for each chapter.
5. Copy `assets/template.html` to `report.src.html` in the output folder. Delete the components that you do not use, and their data keys. Each script checks that its container exists, so removal is safe.
6. Draw the diagrams. Reuse the SVG parts and state classes. Put the data that scripts render in the `report-data` JSON block, with each number once.
7. Build the file: `python3 <skill>/scripts/build_report.py report.src.html -o report.html`. Fix every warning.
8. Do the checks in "Verification".

## Rules that matter most

1. **Draw the explanation.** Each chapter has one diagram or table that shows its finding. Text names what the diagram shows. It does not repeat it.
2. **The reader gets the main point without a click.** Each diagram shows its final state at load. Toggles, trace, and play add to it. They never hide it.
3. **Headings are full sentences.** Each heading states one finding, has a subject and a verb, and has no final period.
4. **Plain words.** Follow `references/writing.md`. Sentences have 25 words or fewer. Use one word for one meaning.
5. **Measured numbers only.** A number that needs a disclaimer does not go on the page. A proposal has no stat rail.
6. **Theme colors only.** Diagrams take color from classes and tokens, never from hex values in SVG attributes. Both themes must work.
7. **Readable sizes.** Body text is 17px. Notes, tables, and diagram text are 15px. Captions are 14px. Only mono labels use 12px. Nothing goes below 12px.

## Page structure

1. **Topbar**: project wordmark, report name, jump links, and the theme switch.
2. **Hero**: an eyebrow, a one-sentence headline with the key phrase in `<em>`, two sentences of summary, and then optional parts: a stat rail (measured numbers only), two scorecards, and a notice for one limit that the reader must see first. A proposal can open with a route explainer instead.
3. **Chapters**: an eyebrow, a full-sentence `h2`, a lede of one or two sentences, one diagram or table, and a caption.
4. **Method**: a bracket diagram that shows what the results cover, then the limits and links to the evidence.
5. **Footer**: date, run id, and "no live calls".

## Components

| Component | Use for |
|---|---|
| Route explainer | Same inputs, a different route. Two views, a view toggle, and trace. |
| Scope grid | Where a label or rule applies, and where it leaks |
| Stepper flow | A process with checks, retries, and branches. Cases that play in order. |
| Small multiples | Two or three rules, each with a small diagram |
| Rule map | Many rules or contracts. Short names, a detail strip with figures, and a full list. |
| Bracket diagram | What a measurement or proof covers |
| Compare table | The same fields from two sources, with "Show only differences" |
| Pair | Long text or steps from two sources, side by side |
| Status grid | Many items with the same two or three fields, with a detail box |
| Strips | Page ranges or spans from several sources |
| Findings | Bugs and fixes, with before and after evidence |
| Race and breakdown | Recorded time and cost for two engines |
| Spotlight | One real case that explains the main result |
| `details` | Raw output, code, and long source text |

Each control has a keyboard path, a visible focus ring, and `aria-pressed` or `aria-live` state. Each diagram has `role="img"` and an `aria-label` that states its finding. Animation obeys `prefers-reduced-motion`.

## Theme

Both themes live in every report. Dark (Nocturnal Cobalt) values are in `:root`. Light (Cobalt Light) values are in `:root[data-theme=light]`. Keep both blocks and the switch. Dark is always the default. Use one accent: it marks the subject of each finding. Use the warn color for rejected parts, the success color for passed parts, and the dashed secondary color for held parts. See `references/theme.md`.

Type: Overused Grotesk, weight 500 for headings and 400 for text. IBM Plex Mono for eyebrows, tags, labels, captions, and code. Display is 72px or smaller. `h2` is 38px. Corners are square, except in diagrams.

## Verification

1. Open the built file with no network. Fonts and images must load.
2. Use each toggle, trace part, case, play button, rule, chip, and figure. The console must show no errors.
3. Switch to light mode and reload. The choice must stay. Every diagram must read in both themes.
4. Look at widths of 1336, 1000, and 390 pixels. The page cannot scroll sideways. A wide diagram can scroll inside its own box.
5. Do the self-check in `references/writing.md`.
6. Check that each chapter has a diagram or table, and that its final state shows without a click.
7. Compare each number with its source file.
8. Give the file path and size. Name each section that you dropped, and say why.

## Design source

The Paper file **HTML Skill** holds the reference designs. Page 1 has the light docjev original and the dark theme explorations. The page **Visual explainers · Recovery contracts** has every diagram pattern with real content.

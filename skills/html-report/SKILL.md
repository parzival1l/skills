---
name: html-report
description: Build a fast, single-file HTML report that explains evidence with static diagrams, tabs, and scrollable tables. Dark by default with a light-mode switch. Use when the user asks for an HTML report, results page, benchmark or comparison report, proposal explainer, or evidence or failure report, or wants run output turned into a page they can open and share.
---

# HTML report

An HTML report is **one offline file that shows how something works**. Diagrams carry the explanation. Text names what each diagram shows.

The sample is [examples/sample-report.html](examples/sample-report.html). It shows every component. It is the only reference.

## Run it in a subagent

The build reads files and writes a lot of HTML. Keep that out of the main conversation.

1. **Settle the brief in the main conversation.** Ask the user only what the files can't answer:
   - the reader's question, in one sentence
   - the source files, as absolute paths
   - the output folder
2. **Spawn one subagent** if the harness can. It starts with no context, so give it everything: "Load the `html-report` skill and follow its Build steps", the brief, and the absolute path to this skill folder.
3. **Pass back its summary.** Give the user the file path and the summary. Don't paste the HTML.

For a change, continue the same subagent if the harness allows it. Otherwise spawn a new one with the brief, the report path, and the change. If the harness can't spawn subagents, run the Build steps yourself.

## Build

1. **Collect the facts.** Read the source files. Every number on the page comes from a file you read.
2. **Write the reader's question.** One sentence: what does the reader want to know?
3. **Pick the components.** Use [COMPONENTS.md](COMPONENTS.md). For each chapter, ask what changes and between which states, then pick the diagram. Three to six chapters is enough.
4. **Start the file.**
   `python3 <skill>/scripts/new_report.py --keep hero,routes,rules,method -o <out>/report.src.html`
   The file holds only the components you chose, with sample content and sample data.
5. **Fill it in.** Replace the sample content in the component HTML and the `report-data` JSON. Follow [WRITING.md](WRITING.md).
6. **Build.**
   `python3 <skill>/scripts/build_report.py <out>/report.src.html -o <out>/report.html`
   Fix every warning.
7. **Check once.** Open the file. The console shows no errors. Each tab works. At 390px wide, the page does not scroll sideways.
8. **Report back.** Give the file path and size, each chapter and its diagram, the components you dropped and why, and any number you could not trace to a file.

## Rules

1. **Draw, don't describe.** Each chapter has one diagram or table. The heading states the finding. A one-line lede says where to look. A short caption names what the diagram shows.
2. **Diagrams are static SVG.** The page moves only through tabs, the expand button, scrolling tables, and selecting a rule.
3. **The main point needs no click.** Each diagram shows its result as the page loads.
4. **Headings are full sentences.** One finding, a subject and a verb, no final period.
5. **Measured numbers only.** If a number needs a disclaimer, drop it. A proposal has no stat rail.
6. **Theme colors only.** SVG parts take color from classes. Never put a hex value in the HTML. Both themes must read.
7. **Readable sizes.** Body text 17px. Notes, tables, and diagram text 15px. Captions 14px. Mono labels 12px. Nothing smaller.

## Don't

- **Don't read `assets/report.css` or `assets/report.js`.** The build step adds them. The class names you need are in [COMPONENTS.md](COMPONENTS.md).
- **Don't copy the sample file.** Start with `new_report.py`, so the file holds only what the report needs.
- **Don't add hover effects, animation, or play buttons.** They cost time and add nothing a tab can't do.
- **Don't add a component the evidence doesn't support.** Drop it and say why.
- **Don't loop on screenshots.** Check once. Fix real breakage only.

Change colors only when the user asks. The tokens are in [THEME.md](THEME.md).

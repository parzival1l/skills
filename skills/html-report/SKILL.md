---
name: html-report
description: Build a fast, single-file HTML report that explains evidence with static diagrams, tabs, and scrollable tables. Dark by default with a light-mode switch. Use when the user asks for an HTML report, results page, benchmark or comparison report, proposal explainer, or evidence or failure report, or wants run output turned into a page they can open and share.
---

# HTML report

An HTML report is **one self-contained file that shows how something works**. Fonts, data, and scripts live inside it, so it opens the same anywhere. Diagrams carry the explanation. Text names what each diagram shows.

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

1. **Collect the facts.** Read the source files. Every number on the page comes from a file you read. When two sources disagree, the newest dated one wins. Name the conflict in `method`.
2. **Write the reader's question.** One sentence: what does the reader want to know?
3. **Pick the components.** Use [COMPONENTS.md](COMPONENTS.md). For each chapter, ask what changes and between which states, then pick the diagram. Three to six chapters is enough.
4. **Start the file.**
   `python3 <skill>/scripts/new_report.py --keep hero,routes,rules,method -o <out>/report.src.html`
   It writes two files: `report.src.html` holds the chapters you chose, and `report.data.json` holds their sample data and diagram specs.
5. **Fill it in, in one pass.** Read both files once. Edit each chapter's eyebrow, heading, lede, and tag in `report.src.html`. Then rewrite `report.data.json` whole, in one write, with every diagram spec. Follow [WRITING.md](WRITING.md).
6. **Build.**
   `python3 <skill>/scripts/build_report.py <out>/report.src.html -o <out>/report.html`
   Fix every warning. A warning about words means the chapter is turning into text: move the idea into the diagram. A warning about characters means the label will collide with its neighbor: use a shorter word.
7. **Check once.** Open the file. The console shows no errors. Each tab works. At 390px wide, the page does not scroll sideways.
8. **Report back.** Give the file path and size, each chapter and its diagram, the components you dropped and why, and any number you could not trace to a file.

## Rules

1. **Draw, don't describe.** Each chapter is a heading, a lede of one or two sentences, and one diagram or table. Nothing else. A chapter has 60 words or fewer outside its diagram. The build counts this.
2. **Diagrams are JSON specs.** The page draws them in one fixed style: shapes carry the meaning, and labels stay short enough to fit their slot. The page moves only through tabs, the expand button, scrolling tables, and selecting a rule.
3. **The main point needs no click.** Each diagram shows its result as the page loads.
4. **Headings are full sentences.** One finding, a subject and a verb, no final period.
5. **Measured numbers only.** If a number needs a disclaimer, drop it. The hero stat rail is for measured results. A proposal puts its counts, such as tests that pass, in `method`.
6. **Theme colors only.** SVG parts take color from classes. Never put a hex value in the HTML. Both themes must read.
7. **Readable sizes.** Body text 17px. Notes, tables, and diagram text 15px. Captions 14px. Mono labels 12px. Nothing smaller.

## Don't

- **Don't read `assets/report.css` or `assets/report.js`.** The build step adds them. The class names you need are in [COMPONENTS.md](COMPONENTS.md).
- **Don't copy the sample file.** Start with `new_report.py`, so the file holds only what the report needs.
- **Don't hand-write SVG.** Write a diagram spec. If no kind fits, use the closest one and say so.
- **Don't write paragraphs in chapters.** The hero is a headline, one summary paragraph, and one short notice: 70 words. `method` has three blocks at most: what was measured, what the page does not show, and the sources: 120 words. Cut anything else. Don't move it to `method`.
- **Don't add hover effects, animation, or play buttons.** They cost time and add nothing a tab can't do.
- **Don't add a component the evidence doesn't support.** Drop it and say why.
- **Don't loop on screenshots.** Check once. Fix real breakage only.

Change colors only when the user asks. The tokens are in [THEME.md](THEME.md).

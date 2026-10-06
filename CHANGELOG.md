# Changelog

Notable changes to this skill collection appear here. Add new entries under **Unreleased** until the next update.

## Unreleased

- Add a repository guide, installation instructions, and a skill credits page.
- Add `html-report` v1: an interactive single-file HTML report template. It is dark by default (Nocturnal Cobalt) with a saved light-mode switch. It includes a Markdown outline, a built sample report, bundled fonts, and a build script that inlines assets.
- Update `html-report` to v2. The skill now chooses the layout from the shape of the evidence (`references/layouts.md`). It writes text in pragmatic ASD-STE100 Simplified Technical English (`references/writing.md`). Headings are full sentences without a final period. Body text is 17px, and notes are 15px or larger. New components: a compare table with "Show only differences", and a catalog that shows every rule in full, with chips and search to narrow the list.
- Update `html-report` to v3. The report now explains with diagrams first. New diagram patterns, all theme-aware SVG: route explainer with a view toggle, scope grid, stepper flow with cases that play in order, small multiples, rule map with a detail strip, and a bracket diagram. Hovering or focusing a part traces related parts. `references/explainers.md` documents the parts, states, and interactions. The rule map replaces the v2 catalog and keeps a full list. The skill now tells the main agent to run the build in a subagent, so the build work stays out of the main conversation.
- Update `html-report` to v4: faster and smaller. Diagrams are static SVG. The page moves only through tabs, an expand button on each diagram, scrolling tables, and rule selection. Hover tracing, the stepper animation, and the race replay are gone. The template splits into `assets/base.html`, shared `report.css` and `report.js`, and one file per component. `scripts/new_report.py --keep` starts a report with only the components it needs, so a four-chapter report source is about 16 KB instead of 86 KB. The guidance is four short files (`SKILL.md`, `COMPONENTS.md`, `WRITING.md`, `THEME.md`), about 12 KB in total. The skill no longer points at files outside itself. The bundled sample report is the only reference.

## 2026-09-28

- Create the repository and add `bro`, credited to Dillon Mulroy.

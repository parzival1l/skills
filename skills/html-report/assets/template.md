# Report outline

Fill this outline before you touch `template.html`. Each heading matches one component in the template, in page order. Delete any section the evidence does not support. Every number must point to a source file.

## Meta

- Title (`<title>`):
- Description (`<meta name="description">`):
- Project wordmark (topbar, left):
- Report name (topbar, after the divider):
- Run id and date (footer):

## Hero

- Eyebrow: `PROJECT / REPORT TYPE / MONTH YEAR`
- Live pill: what completed, such as `100 tasks completed`
- Headline, line 1:
- Headline, line 2, ending on the payoff word (wrapped in `<em>`):
- Sub, two sentences: what ran, and what this page proves.
- Stat rail, three to five numbers:

| Number | Label | Source file |
|---|---|---|
| | | |

- Scorecard 1 (lead): claim, big figure and unit, comparison line, two-column split.
- Scorecard 2: claim, big figure and unit, comparison line, two-column split.
- Footnote: caveats, then versions on the right.
- Notice (optional): one limit the reader must see before trusting the numbers.

## Chapter: inputs (gallery)

- Eyebrow, `h2`, lede, tag:
- Cards: label, note, link, and image path (`data.gallery`).
- Note: where the inputs came from, and what limits the sample.

## Chapter: time and cost (race and breakdown)

- Eyebrow and `h2`:
- Engines: A is the subject and gets the accent color. B is the baseline and gets the secondary color (`data.engines`).
- Race tasks: label, unit, count, and p50 and p95 for each engine (`data.race`).
- Breakdown: tag, total, unit, detail, and rows of label, note, value, display, and color (`data.breakdown`).

## Chapter: results (explorer)

- Eyebrow, `h2`, lede:
- Groups: id, label, and category color (`data.groups`).
- Items: id, title, group, page count, link, and for each engine `ok`, `value`, `ms`, `flag` (`data.items`).

## Chapter: ranges (strips)

- Eyebrow, `h2`, lede, tag:
- Packets: id, units, summary, status, flagged, caption, and rows of label, note, and segments with `from`, `to`, `group`, and an optional `flag` (`data.packets`).

## Chapter: findings

- Eyebrow, `h2`, lede:
- One entry per finding:
  - Tile: code, short title, status.
  - Section: id, status badge, `h2`, one or two sentences.
  - Before: steps, then the observed output.
  - After: the change, then the passing output.
  - Optional `<details>`: the exact code change or raw log.

## Spotlight

- Eyebrow: `The interesting mistake / ITEM ID`
- `h2`, two short lines:
- What happened, two or three sentences:
- Rule callout: the rule that decides the right answer, and how each engine did.
- Two figures: image, caption, and zoom title.
- Figure note, one line:

## Method

- Eyebrow, `h2`, tag:
- Pipeline steps, three to five, each a bold label plus a mono detail:
- What we measured:
- What these numbers can say (limits):
- Evidence links: label and target.
- Closing note: attribution and calibration caveats.

## Footer

- Left: project, date, and one line on how the report was built.
- Right: source link, run id, and "recorded results, no live calls".

# Choose the layout

Pick the layout from the shape of the evidence. Do not start from the template order. The template shows every component. A good report uses only the components that answer the reader's question.

## Step 1: Write the reader's question

Write one sentence: what does the reader want to know when they open the page? Examples:

- "Is Reader v2 better than Reader v1?" (a comparison)
- "What do the proposed contracts change?" (a catalog)
- "Which bugs did we fix, and how do we know?" (findings)
- "Where does the pipeline lose content?" (a process)

## Step 2: Match the evidence shape to a component

| Evidence shape | Use | Do not use |
|---|---|---|
| Two sources with the same fields (two readers, two runs, before and after) | **Compare table** with "Show only differences" | Two separate lists that the reader must match by eye |
| Long text from two sources (emails, extracted pages, rewrites) | **Pair** panels side by side, with differences marked in the text | One long page that the reader must scroll to compare |
| A list of rules, contracts, requirements, or decisions | **Catalog**: every item fully readable, chips and search to narrow | A tile grid where each item opens only on click |
| Many items with the same two or three fields (pass or fail per document) | **Status grid** with a detail box | A catalog, which is too tall for 40 short items |
| Ranges or spans (page ranges, time windows) | **Strips** | A table of start and end numbers |
| Bugs, regressions, incidents | **Findings**: tile picker, before and after, "Show all" | One long scroll with no picker |
| A step-by-step process | **Pipeline** row, or numbered steps with one sentence each | Tabs that hide the other steps |
| Measured time or cost for two engines | **Race panel** and **breakdown panel** | A stat rail with no comparison |
| One case that explains the main result | **Spotlight** with zoomable figures | A spotlight that repeats a table |

## Step 3: Apply the visibility rule

The reader must read the main content without a click. Interaction narrows, sorts, compares, or opens raw evidence. Interaction never hides the main content.

- Filters make a visible list shorter. They do not replace the list with one selected item.
- A click is acceptable to open raw logs, source text, or full-size images.
- If the reader must click more than five times to read the main point, change the layout.
- If items are long text, show the full text in a row. Do not put the text in a tile.

## Step 4: Decide what to drop

- **Stat rail:** use only measured numbers. If a number needs a sentence such as "these counts come from the proposal", remove the rail. A proposal has no measured results.
- **Scorecards:** use only for two results that a reader can compare. Otherwise, remove them.
- **Race and breakdown:** use only with recorded times or costs.
- **Spotlight:** use only with one real case and real figures. Remove it when the figures are only diagrams.
- Name each dropped section in the final message to the user.

## Report types

| Report type | Typical order |
|---|---|
| Benchmark of two systems | Hero with scorecards → compare table → race and breakdown → status grid → strips → spotlight → method |
| Text comparison (emails, extractions) | Hero → pair panels for each item, with a picker and "Show only differences" → method |
| Proposal or design (no measured run) | Hero with the decision that you ask for → catalog of rules → pipeline of the process → open questions → method. No stat rail. |
| Bug or failure report | Hero → findings → method |

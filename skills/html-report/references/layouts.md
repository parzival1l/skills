# Choose the layout

Pick the layout from the shape of the evidence. Do not start from the template order. The template shows every component. A good report uses only the components that answer the reader's question.

## Step 1: Write the reader's question

Write one sentence: what does the reader want to know when they open the page? Examples:

- "Is Reader v2 better than Reader v1?" (a comparison)
- "What do the proposed contracts change?" (a proposal)
- "Which bugs did we fix, and how do we know?" (findings)
- "Where does the pipeline lose content?" (a process)

## Step 2: Draw before you write

A reader opens an HTML report to see how something works, not to read a document. For each chapter, ask what changes and between which states. Then pick a diagram from `references/explainers.md`. Write text only for what a diagram cannot show.

A chapter without a diagram or a table is a sign of a problem. A chapter with more than three paragraphs is too.

## Step 3: Match the evidence shape to a component

| Evidence shape | Use | Do not use |
|---|---|---|
| Same inputs, a different route (old and new, before and after) | **Route explainer**: two views of one diagram, with a view toggle and trace | Two paragraphs that describe each route |
| Where a label, rule, or scope applies | **Scope grid**: one grid drawn twice, with tinted scopes | A sentence about "rows and columns" |
| A process with checks, retries, and branches | **Stepper flow**: cases that play in order | A numbered list of steps |
| Two or three separate rules, each with a small proof | **Small multiples** | Three paragraphs |
| A list of rules, contracts, requirements, or decisions | **Rule map**: short names in grouped columns, a detail strip with figures, and "Show every rule in full" | Long rows of rule text, or tiles that open one at a time |
| What a measurement or proof covers | **Bracket diagram** | A "limits" paragraph |
| Two sources with the same fields | **Compare table** with "Show only differences" | Two lists that the reader must match by eye |
| Long text from two sources (emails, extracted pages) | **Pair** panels side by side, with differences marked | One long page that the reader must scroll to compare |
| Many items with the same two or three fields | **Status grid** with a detail box | A rule map, which suits named rules, not results |
| Ranges or spans (page ranges, time windows) | **Strips** | A table of start and end numbers |
| Bugs, regressions, incidents | **Findings**: tile picker, before and after, "Show all" | One long scroll with no picker |
| Measured time or cost for two engines | **Race panel** and **breakdown panel** | A stat rail with no comparison |
| One case that explains the main result | **Spotlight** with zoomable figures | A spotlight that repeats a table |

## Step 4: Apply the visibility rule

The reader gets the main point without a click. Interaction shows the explanation in a new way. It never hides the main point.

- Each diagram shows its final state at load. Play, toggles, and trace add to it.
- Filters make a visible list shorter. They do not replace the list with one selected item.
- A rule map shows every rule name. The detail strip adds what each rule accepts and rejects.
- A click is acceptable to open raw logs, source text, or full-size images.
- If the reader must click more than five times to get the main point, change the layout.

## Step 5: Decide what to drop

- **Stat rail:** use only measured numbers. If a number needs a sentence such as "these counts come from the proposal", remove the rail. A proposal has no measured results.
- **Scorecards:** use only for two results that a reader can compare. Otherwise, remove them.
- **Race and breakdown:** use only with recorded times or costs.
- **Spotlight:** use only with one real case and real figures.
- Name each dropped section in the final message to the user.

## Report types

| Report type | Typical order |
|---|---|
| Benchmark of two systems | Hero with scorecards → route explainer → compare table → race and breakdown → status grid → strips → spotlight → method with brackets |
| Text comparison (emails, extractions) | Hero → pair panels for each item, with a picker and "Show only differences" → method |
| Proposal or design (no measured run) | Hero with a route explainer → scope grid or stepper flow for each change → small multiples for failure rules → rule map → bracket diagram for proof limits → two lanes for next steps. No stat rail. |
| Bug or failure report | Hero → findings → method |

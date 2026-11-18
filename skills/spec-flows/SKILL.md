---
name: Spec Flows
description: Method for the Flows section of a spec. Use in the Spec agent when you work on Flows.
---

# Spec Flows

Define the Flows section with the user. The user decides which flows exist
and what each flow does. You propose, check, and point out gaps.

## Before you propose

1. Read the spec: Overview, Flows, Models, APIs, and the Flows `To decide`
   list.
2. Read the existing code and the external API docs that the flows touch.

## What a flow is

- One flow goes from one trigger to one result that the user can see.
- Name the flow with a verb phrase from the user's view, such as
  `Search items`.
- Put the main flow first. It is the thinnest end-to-end path.
- Put error paths in Failure Modes, not in Flows.

## Card content

Use the flow card format from the agent instructions.

- **Path line.** Only the actors, in order, joined with `→`. Use `⇄` for a
  back-and-forth loop between two actors.
- **Steps.** One step is one hop between actors or one data change. Start
  each step with the actor. Put API and model names in inline code.
- **Length.** Use eight steps or fewer. If a flow needs more, propose a
  split.
- **Result.** One line. What the user sees or gets.

## Names

- Use only names that exist in Models or APIs.
- If a step needs a new name, use it in the flow. Do not define it in
  Flows. Models or APIs defines it later.

## Questions to ask

Ask only the questions that the spec does not answer yet:

- What starts the flow?
- What does the user get at the end?
- Which actors take part?
- Does the user wait for one response, or does the result stream?
- Where does the state live between steps?

## In chat

- Propose each flow with its name, path line, and steps.
- Say which names are new.

## On save

Do this without mention in chat. Write the complete cards. For each new
name, add an open question to the `To decide` list of Models or APIs.

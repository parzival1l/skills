---
name: Spec Files
description: Diff-marked tree method for the File Structure section of a spec. Use in the Spec agent when you work on File Structure.
---

# Spec Files

The File Structure section shows where the code goes. It shows only what
changes, in the context of the existing repository.

## Before you propose

1. Read the spec: Flows, Models, APIs, and the File Structure `To decide`
   list.
2. List the real repository tree. Do not guess existing paths.

## Structure

- Use one tree per repository or app root, such as `backend/` and
  `frontend/`. Put each tree in its own `h3` toggle, named after the root.
- Expand only directories that contain a change. Show other directories as
  one collapsed line, such as `tests/`.
- In an expanded directory, show unchanged siblings as plain lines. If there
  are more than five, write one `…` line instead.
- After an added or changed file, add a short note of a few words: what it
  holds or what changes. Align the notes.

## Format

Put each tree in a `diff` code block. The first character of each line sets
its color. Then add one space, then the tree line.

| Change | First character |
| --- | --- |
| Added | `+` |
| Removed | `-` |
| Changed, or a directory that contains a change | `!` |
| Unchanged | a space |

```diff
  backend/
  ├── pyproject.toml
! ├── app/
! │   ├── main.py          register routes
+ │   ├── orders.py        order routes
- │   ├── legacy.py
  │   └── db.py
  └── tests/
```

Use `├──`, `└──`, and `│` for the tree. Pad the names with spaces so the
notes line up.

## In chat

- Propose the files to add, change, or remove, with a few words each. Show
  the tree.

## On save

Do this without mention in chat. Replace the full tree of each changed
root.

---
name: rift
description: Remove a finished Rift workspace and run Rift garbage collection. Use when the user invokes /rift or asks to clean up, clear, remove, or garbage-collect a Rift workspace.
---

# Rift cleanup

1. Identify the exact workspace. Use `rift list` from the repository root or `rift.list`. If the user did not name one and several exist, ask which one to remove. Never guess from a sibling checkout.
2. Check `git status`, the current branch, and whether the workspace has commits absent from the canonical checkout or its remote. Explain any uncommitted changes or untransferred commits. Ask the user what to keep before removing them. Push the branch or fetch its commits into the canonical checkout as directed.
3. If this session is inside the workspace being removed, move it to the canonical checkout with `opencode.session_move` before removal. Confirm that the move succeeded.
4. Run `rift remove <absolute-workspace-path>` from the canonical checkout, or use `rift.remove` with that path. Do not use `rm -rf` or `git worktree remove`. Do not use `--force` unless the user explicitly approves losing the identified work.
5. `rift gc` permanently deletes Rift's trash, including trash from other workspaces. Tell the user about that scope before running it. If other discarded work may need recovery, ask before garbage collection. Otherwise run `rift gc` from the canonical checkout.
6. Run `rift list` again and report the removed path and garbage-collection result.

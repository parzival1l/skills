---
name: transport
description: Move this t3 thread to the other machine, Mac to DevBox or DevBox to the Mac, once the current turn ends. Load this skill first, before any other tool, whenever the user types /transport or $transport. It is not opencode.session_move, which only changes the folder on this machine.
---

# Transport

The user wants this thread to continue on the other machine. The thread
can't move while your turn runs, so you schedule the move and end the turn.

1. Run this exact command with your shell tool. Add no thread ID and no
   `--to`; it finds this thread and the other machine itself:

   ```sh
   tether move --after-turn
   ```

2. If it exits with an error, reply with its last line and stop. Do not
   retry it or work around it.
3. If it succeeds, its last line reads like "Moving to DevBox after this
   turn ends." Reply with exactly that one line and end your turn. Run no
   other tool and add nothing else.

What happens next, in case the user asks: a background process waits for
this turn to end, then moves the thread. The moved thread keeps everything
before the `/transport` message; that message and your reply stay behind.
The code moves too: commits, uncommitted and untracked files, and env
files. The old thread gets renamed (`⇢ DevBox: …` or `⇠ Mac: …`) and
archived. The log is `~/.local/state/tether/logs/` on the Mac and
`/root/code/.tether/logs/` on DevBox.

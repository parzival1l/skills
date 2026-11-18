# Skills

My collection of small, reusable skills for coding agents.

## Install

First install [Node.js 22.20.0 or newer](https://nodejs.org/en/download), which includes `npx`.
If `npx` is missing, the command below cannot prompt you to install Node.js.

```bash
npx skills@latest add parzival1l/skills
```

Select the skills and agents you want when prompted. To install only `bro`, use:

```bash
npx skills@latest add parzival1l/skills --skill bro
```

## Sync a machine

[manifest.txt](manifest.txt) lists every skill a machine should have: my own skills from this repository and third-party skills by their GitHub source. To install them all for OpenCode, run:

```bash
python3 sync.py
```

Add `-a claude-code` (once per agent) to link them for other agents too. Each run takes the newest version from every source. The script skips skills whose `~/.agents/skills` entry is a symlink, so local development links stay. A skill its source no longer has logs a warning; the rest still install. DevBox runs it every night, and at boot when this repository's `main` has a new commit.

On the Mac, run it from `~/Personal/skills`. The CLI records each skill's source path in `~/.agents/.skill-lock.json`, so a run from a worktree or temporary copy leaves a path that `npx skills update` cannot use later.

## Skills

- [bro](skills/bro/SKILL.md): Restate the last message in plain language.
- [html-report](skills/html-report/SKILL.md): Build a fast, single-file HTML report that explains with static diagrams, tabs, and scrollable tables. Dark by default with a light-mode switch.

Each skill lives in `skills/<name>/SKILL.md`. See [skills/README.md](skills/README.md) for credits and [CHANGELOG.md](CHANGELOG.md) for updates.

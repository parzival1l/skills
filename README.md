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

## Skills

- [bro](skills/bro/SKILL.md): Restate the last message in plain language.
- [html-report](skills/html-report/SKILL.md): Build an interactive, single-file HTML report that explains with diagrams, picks the layout for the evidence, and uses plain language. Dark by default with a light-mode switch.

Each skill lives in `skills/<name>/SKILL.md`. See [skills/README.md](skills/README.md) for credits and [CHANGELOG.md](CHANGELOG.md) for updates.

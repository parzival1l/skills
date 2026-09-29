# Repository guide

This repository holds agent skills. Keep it small and easy to install with `npx skills`.

- Keep one flat `skills/` directory. Put each skill in `skills/<name>/SKILL.md`.
- Give each skill a `name` and `description` in its YAML frontmatter.
- Keep the directory name and frontmatter `name` the same.
- List every skill in `README.md` with a link to its `SKILL.md`.
- List skills and credit external authors and sources in `skills/README.md`.
- Record user-facing skill additions and changes in `CHANGELOG.md`.
- Do not add plugin manifests, release automation, or category folders.

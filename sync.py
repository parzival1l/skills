#!/usr/bin/env python3
"""Install the skills listed in manifest.txt with `npx skills`.

Skills go to ~/.agents/skills, which OpenCode reads. Pass -a for each
other agent that should get a link, for example `-a claude-code`.
A skill whose ~/.agents/skills entry is a symlink stays as it is, so local
development links survive. Exits 1 when a source fails or a skill is missing.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "manifest.txt"
CLI = "skills@1"


def read_manifest(path):
    """Return {source: [skill, ...]} in file order."""
    sources = {}
    for number, line in enumerate(path.read_text().splitlines(), 1):
        fields = line.split("#", 1)[0].split()
        if not fields:
            continue
        if len(fields) != 2:
            sys.exit(f"{path.name}:{number}: expected 'source skill'")
        source, skill = fields
        sources.setdefault(source, []).append(skill)
    return sources


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "-a", "--agent", action="append",
        help="agent to install for (default: opencode); repeat for more",
    )
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    parser.add_argument(
        "--dry-run", action="store_true", help="print the commands only",
    )
    args = parser.parse_args()

    agents = args.agent or ["opencode"]
    installed = Path.home() / ".agents" / "skills"
    env = {**os.environ, "DO_NOT_TRACK": "1"}
    manifest = read_manifest(args.manifest)
    failed = []

    for source, skills in manifest.items():
        wanted = []
        for skill in skills:
            if (installed / skill).is_symlink():
                print(f"skip {skill}: {installed / skill} is a symlink")
            else:
                wanted.append(skill)
        if not wanted:
            continue
        command = ["npx", "-y", CLI, "add",
                   str(ROOT) if source == "." else source, "-g", "-y"]
        for agent in agents:
            command += ["-a", agent]
        for skill in wanted:
            command += ["-s", skill]
        print("+", " ".join(command), flush=True)
        if args.dry_run:
            continue
        try:
            result = subprocess.run(
                command, env=env, capture_output=True, text=True, timeout=300,
            )
        except subprocess.TimeoutExpired:
            print(f"error: {source} timed out", file=sys.stderr)
            failed.append(source)
            continue
        if result.returncode != 0:
            print(result.stdout[-2000:] + result.stderr[-2000:], file=sys.stderr)
            print(f"error: {source} exited {result.returncode}", file=sys.stderr)
            failed.append(source)

    if args.dry_run:
        return 0
    # `skills add` skips unknown skill names and still exits 0.
    missing = [
        skill
        for skills in manifest.values()
        for skill in skills
        if not (installed / skill / "SKILL.md").is_file()
    ]
    if missing:
        print(f"error: not installed: {' '.join(missing)}", file=sys.stderr)
    if failed or missing:
        return 1
    print(f"skills: all {sum(map(len, manifest.values()))} installed "
          f"in {installed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

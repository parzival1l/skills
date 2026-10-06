#!/usr/bin/env python3
"""Start a report from only the components that it needs.

Usage:
  new_report.py --list
  new_report.py --keep hero,routes,rules,method -o OUT/report.src.html
  new_report.py --all -o OUT/report.src.html

The output holds the shared CSS and scripts, the chosen components in the
given order, and their sample data in report.data.json next to it. Edit only the
component HTML and the data. Then run build_report.py.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent / "assets"
PARTS = ASSETS / "components"
ORDER = ["hero", "routes", "scope", "compare", "rules", "flow", "multiples",
         "speed", "grid", "strips", "findings", "spotlight", "lanes", "method"]


def describe(cid: str) -> str:
    first = (PARTS / f"{cid}.html").read_text(encoding="utf-8").splitlines()[0]
    match = re.match(r"<!-- COMPONENT: \w+ · (.*?) -->", first)
    return match.group(1) if match else ""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--list", action="store_true", help="list the components")
    parser.add_argument("--keep", help="comma-separated component ids, in page order")
    parser.add_argument("--all", action="store_true", help="keep every component")
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    if args.list:
        for cid in ORDER:
            print(f"{cid:10} {describe(cid)}")
        return 0
    keep = ORDER if args.all else [c.strip() for c in (args.keep or "").split(",") if c.strip()]
    unknown = [c for c in keep if c not in ORDER]
    if not keep or unknown or not args.output:
        parser.error(f"give -o and --keep with ids from: {', '.join(ORDER)}" + (f" (unknown: {', '.join(unknown)})" if unknown else ""))

    html = (ASSETS / "base.html").read_text(encoding="utf-8")
    body = "\n".join((PARTS / f"{c}.html").read_text(encoding="utf-8") for c in keep)
    data: dict = {}
    for c in keep:
        part = PARTS / f"{c}.json"
        if part.is_file():
            for key, value in json.loads(part.read_text(encoding="utf-8")).items():
                if isinstance(value, dict) and isinstance(data.get(key), dict):
                    data[key].update(value)
                else:
                    data[key] = value
    links = '<a href="#method">Method ↓</a>' if "method" in keep else ""

    html = html.replace("<!-- COMPONENTS -->", body, 1)
    html = html.replace("<!-- TOPLINKS -->", links, 1)
    data_file = args.output.with_name("report.data.json")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(html, encoding="utf-8")
    data_file.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {args.output} and {data_file.name} with {', '.join(keep)}")
    print(f"next: edit the chapter text in {args.output.name}, rewrite {data_file.name}, then run {Path(__file__).with_name('build_report.py')} {args.output} -o <report.html>")
    return 0


if __name__ == "__main__":
    sys.exit(main())

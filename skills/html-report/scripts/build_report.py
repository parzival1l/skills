#!/usr/bin/env python3
"""Inline local fonts and images into one self-contained HTML report.

Usage: build_report.py SOURCE.html [-o OUTPUT.html]

The script resolves each local reference against the source file's folder first,
then against this skill's assets/ folder. It inlines local stylesheets and
scripts, CSS url(...), src="...", and image paths in the report-data block.
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import re
import sys
from pathlib import Path

SKILL_ASSETS = Path(__file__).resolve().parent.parent / "assets"
MIME = {".ttf": "font/ttf", ".otf": "font/otf", ".woff": "font/woff", ".woff2": "font/woff2", ".svg": "image/svg+xml"}
IMAGE_EXT = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")


def resolve(ref: str, base: Path) -> Path | None:
    if re.match(r"^(data:|https?:|#|mailto:)", ref):
        return None
    for root in (base, SKILL_ASSETS):
        path = (root / ref).resolve()
        if path.is_file():
            return path
    return None


def data_uri(path: Path) -> str:
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


KINDS = {"route", "scope", "flow", "multiples", "split", "parts", "attempts", "brackets", "lanes"}
SHORT = {"inputs", "lanes", "items", "groups", "parts", "label", "node", "gate", "end", "head", "group", "left", "right", "ok", "hold", "tabs", "tab", "last"}
FREE = {"caption", "titles", "title", "aria", "kind"}
VISUAL = ("data-diagram", "<svg", "<table", 'id="rule-map"', 'id="tile-grid"', 'id="strip-rows"', 'id="race-tracks"', "figure-pair")
CHAPTER_WORDS = 60


def words(text: str) -> int:
    return len([w for w in text.split() if w not in ("·", "↳", "→")])


def check(html: str, data: dict) -> list[str]:
    """Warn when a chapter turns into text, or a diagram label turns into a sentence."""
    notes = []
    html = html.split('<script id="report-data"')[0]
    for m in re.finditer(r'<section class="chapter"([^>]*)>(.*?)</section>', html, re.S):
        attrs, body = m.groups()
        if 'id="method"' in attrs or 'id="finding-grid"' in body:
            continue
        title = re.search(r"<h2[^>]*>(.*?)</h2>", body, re.S)
        name = re.sub(r"<[^>]+>", "", title.group(1)).strip() if title else "a chapter"
        if not any(v in body for v in VISUAL):
            notes.append(f'chapter "{name}" has no diagram or table')
        text = re.sub(r"<(svg|template|script)\b.*?</\1>", " ", body, flags=re.S)
        count = words(re.sub(r"<[^>]+>", " ", text))
        if count > CHAPTER_WORDS:
            notes.append(f'chapter "{name}" has {count} words outside its diagram (limit {CHAPTER_WORDS}). Move the explanation into the diagram.')
    diagrams = data.get("diagrams", {})
    for key in re.findall(r'data-diagram="([^"]+)"', html):
        if key not in diagrams:
            notes.append(f'data-diagram="{key}" has no spec in report-data diagrams')

    def walk(node, key, where):
        if key in FREE:
            return
        if isinstance(node, dict):
            if "kind" in node and node["kind"] not in KINDS:
                notes.append(f'{where}: unknown kind "{node["kind"]}"')
            for k, v in node.items():
                walk(v, k, f"{where}.{k}")
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, key, f"{where}[{i}]")
        elif isinstance(node, str):
            limit = 4 if key in SHORT else 8
            if words(node) > limit:
                notes.append(f'{where} "{node}" has {words(node)} words (limit {limit}). Shorten it, or show it with a shape.')

    for key, spec in diagrams.items():
        walk(spec, "", f"diagrams.{key}")
    return notes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("source", type=Path)
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    source = args.source.resolve()
    base = source.parent
    output = args.output or source.with_name(source.stem + ".built.html")
    html = source.read_text(encoding="utf-8")
    missing: list[str] = []

    def inline(ref: str) -> str | None:
        if "${" in ref:  # a JavaScript template literal, not a file
            return None
        path = resolve(ref, base)
        if path is None:
            if not re.match(r"^(data:|https?:|#|mailto:)", ref) and ref:
                missing.append(ref)
            return None
        return data_uri(path)

    def css_url(m: re.Match) -> str:
        uri = inline(m.group(2))
        return f"url('{uri}')" if uri else m.group(0)

    def src_attr(m: re.Match) -> str:
        uri = inline(m.group(2))
        return f'src="{uri}"' if uri else m.group(0)

    def local_text(ref: str) -> str | None:
        path = resolve(ref, base)
        if path is None:
            missing.append(ref)
            return None
        return path.read_text(encoding="utf-8")

    def stylesheet(m: re.Match) -> str:
        text = local_text(m.group(1))
        return f"<style>\n{text}</style>" if text is not None else m.group(0)

    def script(m: re.Match) -> str:
        text = local_text(m.group(1))
        return f"<script>\n{text}</script>" if text is not None else m.group(0)

    def data_file(m: re.Match) -> str:
        text = local_text(m.group(1))
        return f'<script id="report-data" type="application/json">{text}</script>' if text is not None else m.group(0)

    html = re.sub(r"""<script id="report-data" type="application/json" src="([^"]+)"></script>""", data_file, html)
    # Shared CSS and scripts first, so their font urls get inlined below.
    html = re.sub(r"""<link rel="stylesheet" href="(?!https?:)([^"]+)">""", stylesheet, html)
    html = re.sub(r"""<script src="(?!https?:)([^"]+)"></script>""", script, html)
    html = re.sub(r"""url\((['"]?)([^'")]+)\1\)""", css_url, html)
    html = re.sub(r"""src=(["'])([^"']+)\1""", src_attr, html)

    block = re.search(r'(<script id="report-data" type="application/json">)(.*?)(</script>)', html, re.S)
    if block:
        try:
            data = json.loads(block.group(2))
        except json.JSONDecodeError as err:
            print(f"error: report-data is not valid JSON: {err}", file=sys.stderr)
            return 1

        def walk(node):
            if isinstance(node, dict):
                return {k: walk(v) for k, v in node.items()}
            if isinstance(node, list):
                return [walk(v) for v in node]
            if isinstance(node, str) and node.lower().endswith(IMAGE_EXT):
                return inline(node) or node
            return node

        for note in check(html, data):
            print(f"warning: {note}", file=sys.stderr)
        payload = json.dumps(walk(data), ensure_ascii=False).replace("</", "<\\/")
        html = html[: block.start(2)] + payload + html[block.end(2):]

    remote = re.findall(r"""<(?:script|link)[^>]+(?:src|href)=["']https?://[^"']+""", html)
    for tag in remote:
        print(f"warning: remote resource breaks offline use: {tag}", file=sys.stderr)
    for ref in sorted(set(missing)):
        print(f"warning: local file not found: {ref}", file=sys.stderr)

    output.write_text(html, encoding="utf-8")
    print(f"wrote {output} ({output.stat().st_size / 1_048_576:.2f} MB)")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

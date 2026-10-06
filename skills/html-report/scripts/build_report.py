#!/usr/bin/env python3
"""Inline local fonts and images into one self-contained HTML report.

Usage: build_report.py SOURCE.html [-o OUTPUT.html]

The script resolves each local reference against the source file's folder first,
then against this skill's assets/ folder. It inlines CSS url(...), src="...",
and image paths inside the report-data JSON block.
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

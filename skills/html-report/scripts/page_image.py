#!/usr/bin/env python3
"""Render whole PDF pages to JPEG for a report.

Usage: page_image.py FILE.pdf --pages 2,3 -o OUT/assets [--width 1000]

Each image is a complete page, scaled only. Never crop or edit it: the reader
must see the real page. Put the printed paths in report.data.json; the build
inlines them. Uses pdftoppm if it is installed, otherwise pypdfium2
(run with `uv run --with pypdfium2 python page_image.py ...`).
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def render(pdf: Path, page: int, out: Path, width: int) -> None:
    if shutil.which("pdftoppm"):
        prefix = out.with_suffix("")
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=85", "-singlefile", "-f", str(page), "-l", str(page),
                        "-scale-to-x", str(width), "-scale-to-y", "-1", str(pdf), str(prefix)], check=True)
        return
    try:
        import pypdfium2 as pdfium
    except ImportError:
        sys.exit("error: install poppler (pdftoppm), or run with: uv run --with pypdfium2 python page_image.py ...")
    document = pdfium.PdfDocument(pdf)
    try:
        sheet = document[page - 1]
        sheet.render(scale=width / sheet.get_width()).to_pil().convert("RGB").save(out, "JPEG", quality=85, optimize=True)
    finally:
        document.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--pages", required=True, help="comma-separated page numbers, starting at 1")
    parser.add_argument("-o", "--output", type=Path, required=True, help="folder for the images")
    parser.add_argument("--width", type=int, default=1000)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for page in (int(p) for p in args.pages.split(",") if p.strip()):
        out = args.output / f"{args.pdf.stem}-page-{page}.jpg"
        render(args.pdf, page, out, args.width)
        print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())

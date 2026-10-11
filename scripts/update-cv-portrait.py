#!/usr/bin/env python3
"""Replace a CV portrait without regenerating its text or page layout.

Requires pypdf[image] and Pillow. All paths and output encoding options are CLI
arguments. The original portrait is copied unchanged; WebP only resamples and
encodes it. The PDF image keeps its existing pixel frame, position and clip,
and every other object keeps the exact bytes its producer wrote.
"""

import argparse
import hashlib
import io
import json
import re
import shutil
from pathlib import Path

import PIL
import pypdf
from PIL import Image, ImageOps, ImageStat
from pypdf import PdfReader


def digest(data):
    return hashlib.sha256(data).hexdigest()


def document_snapshot(reader):
    """Capture invariants independently of object numbers after cloning."""
    pages = []
    for page in reader.pages:
        links = []
        for reference in page.get("/Annots", []):
            annotation = reference.get_object()
            action = annotation.get("/A")
            if action is not None:
                action = action.get_object()
            links.append(
                {
                    "subtype": str(annotation.get("/Subtype")),
                    "rect": [float(value) for value in annotation.get("/Rect", [])],
                    "action": {
                        str(key): str(value) for key, value in (action or {}).items()
                    },
                }
            )
        contents = page.get_contents()
        pages.append(
            {
                "text": page.extract_text(),
                "content_sha256": digest(
                    contents.get_data() if contents is not None else b""
                ),
                "mediabox": [float(value) for value in page.mediabox],
                "cropbox": [float(value) for value in page.cropbox],
                "rotation": page.rotation,
                "annotations": links,
            }
        )
    root = reader.trailer["/Root"]
    return {
        "pdf_header": reader.pdf_header,
        "pages": pages,
        "metadata": dict(reader.metadata or {}),
        "root_keys": sorted(root.keys()),
        "tagged": bool(root.get("/MarkInfo", {}).get("/Marked", False)),
        "structure_tree": "/StructTreeRoot" in root,
    }


def splice_stream(pdf, reader, reference, data):
    """Swap one stream's data and move the cross-reference offsets after it.

    A full rewrite re-serializes every string, which escapes the link
    destinations that tests/contact.test.mjs reads from the raw bytes.
    """
    table = int(re.search(rb"startxref\s+(\d+)\s+%%EOF\s*$", pdf).group(1))
    if reader.xref_objStm or pdf[table : table + 4] != b"xref":
        raise ValueError("Expected a classic cross-reference table")
    offset = reader.xref[reference.generation][reference.idnum]
    header = re.compile(
        rb"\d+ \d+ obj\s*<<.*?/Length (\d+)\b.*?>>\s*stream\r?\n", re.DOTALL
    ).match(pdf, offset, offset + 2048)
    if header is None:
        raise ValueError("Expected a stream with a direct /Length")
    end = header.end() + int(header.group(1))
    if re.match(rb"\s*endstream", pdf[end : end + 16]) is None:
        raise ValueError("Stream /Length does not reach its endstream")
    body = (
        pdf[: header.start(1)]
        + str(len(data)).encode()
        + pdf[header.end(1) : header.end()]
        + data
        + pdf[end:table]
    )
    shift = len(body) - table

    def moved(entry):
        position = int(entry.group())
        return b"%010d" % (position + shift if position > offset else position)

    trailer = pdf.index(b"trailer", table)
    entries = re.sub(rb"\d{10}(?= \d{5} n)", moved, pdf[table:trailer])
    tail = re.sub(
        rb"startxref\s+\d+", b"startxref\n%d" % (table + shift), pdf[trailer:]
    )
    return body + entries + tail


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--portrait", type=Path, required=True)
    parser.add_argument("--input-pdf", type=Path, required=True)
    parser.add_argument("--output-pdf", type=Path, required=True)
    parser.add_argument("--original-copy", type=Path)
    parser.add_argument("--webp", type=Path)
    parser.add_argument("--webp-width", type=int, default=704)
    parser.add_argument("--webp-quality", type=int, default=85)
    parser.add_argument("--pdf-quality", type=int, default=95)
    parser.add_argument("--image-page", type=int, default=1)
    parser.add_argument("--image-index", type=int, default=0)
    parser.add_argument("--expected-pages", type=int, default=2)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    if args.webp_width <= 0 or not 1 <= args.webp_quality <= 100:
        parser.error("WebP width must be positive and quality between 1 and 100")
    if not 1 <= args.pdf_quality <= 100:
        parser.error("PDF quality must be between 1 and 100")

    original_pdf = args.input_pdf.read_bytes()
    reader = PdfReader(io.BytesIO(original_pdf))
    if len(reader.pages) != args.expected_pages:
        raise ValueError("Unexpected page count; refusing to change this document")
    before = document_snapshot(reader)
    source_bytes = args.portrait.read_bytes()
    with Image.open(io.BytesIO(source_bytes)) as opened:
        portrait = ImageOps.exif_transpose(opened).convert("RGB")

    current_image = reader.pages[args.image_page - 1].images[args.image_index]
    current_size = current_image.image.size
    stored = current_image.indirect_reference.get_object()
    if stored.get("/Filter") != "/DCTDecode" or current_image.image.mode != "RGB":
        raise ValueError("Expected an RGB JPEG portrait; refusing another encoding")

    # Fit the entire source inside the existing frame, whatever its proportions,
    # so the page draws it at the same place under the same clip. Sample the
    # source's corner for technical padding; no face, hair, lighting or color edits.
    corner_size = max(1, min(portrait.size) // 20)
    background = tuple(
        round(channel)
        for channel in ImageStat.Stat(
            portrait.crop((0, 0, corner_size, corner_size))
        ).mean
    )
    replacement = ImageOps.pad(
        portrait,
        current_size,
        method=Image.Resampling.LANCZOS,
        color=background,
        centering=(0.5, 0.5),
    )
    encoded = io.BytesIO()
    replacement.save(encoded, format="JPEG", quality=args.pdf_quality, subsampling=0)
    new_pdf = splice_stream(
        original_pdf, reader, current_image.indirect_reference, encoded.getvalue()
    )
    rebuilt = PdfReader(io.BytesIO(new_pdf))
    after = document_snapshot(rebuilt)
    if before != after:
        raise ValueError(
            "PDF text, page streams, geometry, annotations or metadata changed"
        )
    embedded = rebuilt.pages[args.image_page - 1].images[args.image_index].image
    if embedded.size != current_size:
        raise ValueError("The embedded portrait no longer fills its frame")

    outputs = {}
    if args.original_copy:
        args.original_copy.parent.mkdir(parents=True, exist_ok=True)
        if args.original_copy.resolve() != args.portrait.resolve():
            shutil.copyfile(args.portrait, args.original_copy)
        outputs[str(args.original_copy)] = {
            "sha256": digest(args.original_copy.read_bytes()),
            "bytes": args.original_copy.stat().st_size,
            "dimensions": list(portrait.size),
        }
    if args.webp:
        width = min(args.webp_width, portrait.width)
        height = round(portrait.height * width / portrait.width)
        webp = portrait.resize((width, height), Image.Resampling.LANCZOS)
        args.webp.parent.mkdir(parents=True, exist_ok=True)
        webp.save(args.webp, format="WEBP", quality=args.webp_quality, method=6)
        outputs[str(args.webp)] = {
            "sha256": digest(args.webp.read_bytes()),
            "bytes": args.webp.stat().st_size,
            "dimensions": list(webp.size),
        }

    args.output_pdf.parent.mkdir(parents=True, exist_ok=True)
    args.output_pdf.write_bytes(new_pdf)
    report = {
        "versions": {"pypdf": pypdf.__version__, "Pillow": PIL.__version__},
        "source": {
            "path": str(args.portrait),
            "sha256": digest(source_bytes),
            "dimensions": list(portrait.size),
        },
        "pdf_before": {"sha256": digest(original_pdf), "bytes": len(original_pdf)},
        "pdf_after": {"sha256": digest(new_pdf), "bytes": len(new_pdf)},
        "pages": len(after["pages"]),
        "text_sha256": digest(
            "\n".join(page["text"] for page in after["pages"]).encode()
        ),
        "page_stream_sha256": [page["content_sha256"] for page in after["pages"]],
        "annotation_counts": [len(page["annotations"]) for page in after["pages"]],
        "text_streams_geometry_annotations_metadata_equal": before == after,
        "portrait_pdf_dimensions": list(replacement.size),
        "outputs": outputs,
    }
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()

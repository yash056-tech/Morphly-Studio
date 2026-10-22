#!/usr/bin/env python3
"""
Universal File & Document Converter.
Supports converting between any format:
PDF, Word (DOCX), Excel (XLSX, CSV), PowerPoint (PPTX), Text, Markdown, HTML, and Images.
"""

import sys
import os
import json
import argparse
import traceback
import tempfile
import zipfile
from io import BytesIO
from PIL import Image

def emit_progress(percent: int, stage: str):
    print(json.dumps({"status": "progress", "percent": percent, "stage": stage}), flush=True)

def emit_error(message: str, code: int = 1):
    print(json.dumps({"status": "error", "message": message}), file=sys.stderr, flush=True)
    sys.exit(code)

def emit_success(output_path: str, message: str = "Conversion successful"):
    size = os.path.getsize(output_path) if os.path.exists(output_path) else 0
    print(json.dumps({
        "status": "success",
        "percent": 100,
        "stage": message,
        "output_size": size,
        "output_path": output_path
    }), flush=True)

# ----------------- Conversion Handlers -----------------

def convert_pdf_to_docx(input_path: str, output_path: str):
    emit_progress(20, "Opening PDF and analyzing layout geometry...")
    from pdf2docx import Converter
    cv = Converter(input_path)
    emit_progress(50, "Extracting typography, tables, and vector shapes...")
    cv.convert(output_path)
    cv.close()

def convert_pdf_to_images(input_path: str, output_path: str, fmt: str = "png"):
    import fitz
    emit_progress(30, "Rendering PDF pages into high-resolution images...")
    doc = fitz.open(input_path)
    if len(doc) == 1:
        page = doc[0]
        pix = page.get_pixmap(dpi=200)
        pix.save(output_path)
    else:
        # Multiple pages: generate zip archive containing all page images
        emit_progress(60, "Packaging multi-page renders...")
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for idx, page in enumerate(doc):
                pix = page.get_pixmap(dpi=200)
                img_data = pix.tobytes(fmt)
                zf.writestr(f"page_{idx+1}.{fmt}", img_data)
    doc.close()

def convert_pdf_to_text(input_path: str, output_path: str, fmt: str = "txt"):
    import fitz
    emit_progress(30, f"Extracting {fmt.upper()} from PDF...")
    doc = fitz.open(input_path)
    content = []
    for page_idx, page in enumerate(doc):
        if fmt == "html":
            content.append(page.get_text("html"))
        elif fmt == "md":
            text = page.get_text("text")
            content.append(f"# Page {page_idx+1}\n\n{text}\n")
        else:
            content.append(page.get_text("text"))
    doc.close()

    final_content = "\n\n".join(content)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_content)

def convert_pdf_to_excel(input_path: str, output_path: str, fmt: str = "xlsx"):
    import csv
    import re
    import openpyxl
    from pypdf import PdfReader

    emit_progress(30, "Scanning PDF for structured tabular lines...")
    reader = PdfReader(input_path)
    rows = []
    for page in reader.pages:
        text = page.extract_text() or ""
        for line in text.splitlines():
            line_str = line.strip()
            if line_str:
                # split on multiple spaces or tabs
                cols = re.split(r'\s{2,}|\t', line_str)
                rows.append(cols)

    if not rows:
        rows = [["Extracted Content"], ["No text found in PDF"]]

    emit_progress(70, f"Writing extracted data to {fmt.upper()}...")
    if fmt == "csv":
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            for r in rows:
                writer.writerow(r)
    else:
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Extracted Data"
        for r in rows:
            ws.append(r)
        wb.save(output_path)

def convert_docx_to_text_or_html(input_path: str, output_path: str, fmt: str):
    import docx
    emit_progress(30, f"Extracting paragraphs and tables from Word (.docx)...")
    doc = docx.Document(input_path)
    lines = []

    if fmt == "html":
        lines.append("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Converted Document</title><style>body{font-family:sans-serif;padding:24px;line-height:1.6;}table{border-collapse:collapse;width:100%;margin:16px 0;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}</style></head><body>")
        for p in doc.paragraphs:
            if p.text:
                lines.append(f"<p>{p.text}</p>")
        for t in doc.tables:
            lines.append("<table>")
            for r in t.rows:
                lines.append("<tr>" + "".join(f"<td>{c.text}</td>" for c in r.cells) + "</tr>")
            lines.append("</table>")
        lines.append("</body></html>")
    elif fmt == "md":
        for p in doc.paragraphs:
            if p.text:
                if p.style and "Heading" in p.style.name:
                    level = p.style.name.replace("Heading", "").strip() or "1"
                    lines.append(f"{'#' * min(6, int(level) if level.isdigit() else 1)} {p.text}\n")
                else:
                    lines.append(f"{p.text}\n")
        for t in doc.tables:
            if t.rows:
                headers = [c.text.strip().replace("\n", " ") for c in t.rows[0].cells]
                lines.append("| " + " | ".join(headers) + " |")
                lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
                for r in t.rows[1:]:
                    vals = [c.text.strip().replace("\n", " ") for c in r.cells]
                    lines.append("| " + " | ".join(vals) + " |")
                lines.append("\n")
    else:
        for p in doc.paragraphs:
            if p.text:
                lines.append(p.text)
        for t in doc.tables:
            for r in t.rows:
                lines.append("\t".join(c.text.strip() for c in r.cells))

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def convert_docx_to_pdf(input_path: str, output_path: str):
    import docx
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors

    emit_progress(30, "Reading Word document styles and paragraphs...")
    doc = docx.Document(input_path)
    pdf = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    styles = getSampleStyleSheet()

    story = []
    for p in doc.paragraphs:
        if p.text.strip():
            story.append(Paragraph(p.text.strip(), styles["Normal"]))
            story.append(Spacer(1, 8))

    for t in doc.tables:
        data = [[Paragraph(c.text.strip(), styles["Normal"]) for c in r.cells] for r in t.rows]
        if data:
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0f172a')),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ]))
            story.append(table)
            story.append(Spacer(1, 12))

    if not story:
        story.append(Paragraph("Empty Document", styles["Normal"]))

    emit_progress(70, "Compiling PDF document...")
    pdf.build(story)

def convert_excel_or_csv(input_path: str, output_path: str, target_fmt: str):
    import csv
    import openpyxl
    emit_progress(30, "Parsing spreadsheet data...")

    in_ext = os.path.splitext(input_path)[1].lower()
    rows = []
    if in_ext in [".csv", ".txt", ".tsv"]:
        delimiter = "\t" if in_ext == ".tsv" else ","
        with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.reader(f, delimiter=delimiter)
            rows = [r for r in reader]
    else:
        wb = openpyxl.load_workbook(input_path, data_only=True)
        sheet = wb.active
        for r in sheet.iter_rows(values_only=True):
            rows.append([str(c) if c is not None else "" for c in r])

    if not rows:
        rows = [["Data"], ["Empty spreadsheet"]]

    emit_progress(60, f"Transforming into {target_fmt.upper()}...")
    if target_fmt == "csv":
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            for r in rows:
                writer.writerow(r)
    elif target_fmt == "xlsx":
        wb_out = openpyxl.Workbook()
        ws_out = wb_out.active
        for r in rows:
            ws_out.append(r)
        wb_out.save(output_path)
    elif target_fmt == "json":
        headers = rows[0] if len(rows) > 0 else []
        json_data = []
        for r in rows[1:]:
            item = {}
            for idx, h in enumerate(headers):
                item[str(h)] = r[idx] if idx < len(r) else ""
            json_data.append(item)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(json_data, f, indent=2)
    elif target_fmt == "html":
        html_rows = []
        for i, r in enumerate(rows):
            tag = "th" if i == 0 else "td"
            cells = "".join(f"<{tag} style='border:1px solid #ddd;padding:8px;'>{cell}</{tag}>" for cell in r)
            html_rows.append(f"<tr>{cells}</tr>")
        body = "".join(html_rows)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{{font-family:sans-serif;padding:20px;}}table{{border-collapse:collapse;width:100%;}}</style></head><body><table>{body}</table></body></html>")
    elif target_fmt == "md":
        md_lines = []
        if len(rows) > 0:
            md_lines.append("| " + " | ".join(str(c) for c in rows[0]) + " |")
            md_lines.append("| " + " | ".join("---" for _ in rows[0]) + " |")
            for r in rows[1:]:
                md_lines.append("| " + " | ".join(str(c) for c in r) + " |")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(md_lines))
    elif target_fmt == "pdf":
        from reportlab.lib.pagesizes import letter, landscape
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib import colors

        pdf = SimpleDocTemplate(output_path, pagesize=landscape(letter))
        styles = getSampleStyleSheet()

        preview_rows = rows[:100]
        data = [[Paragraph(str(c), styles["Normal"]) for c in r[:12]] for r in preview_rows]
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('FONTSIZE', (0,0), (-1,-1), 8),
        ]))
        pdf.build([table])
    else:
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            for r in rows:
                writer.writerow(r)

def convert_pptx(input_path: str, output_path: str, target_fmt: str):
    import pptx
    emit_progress(30, "Reading PowerPoint presentation slides...")
    prs = pptx.Presentation(input_path)
    slides_text = []

    for idx, slide in enumerate(prs.slides):
        slide_lines = [f"--- Slide {idx+1} ---"]
        for shape in slide.shapes:
            if shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    if paragraph.text.strip():
                        slide_lines.append(paragraph.text.strip())
        slides_text.append("\n".join(slide_lines))

    full_text = "\n\n".join(slides_text)

    emit_progress(70, f"Exporting to {target_fmt.upper()}...")
    if target_fmt == "pdf":
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet

        pdf = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        for slide in slides_text:
            for line in slide.splitlines():
                if line.startswith("--- Slide"):
                    story.append(Paragraph(f"<b>{line}</b>", styles["Heading2"]))
                else:
                    story.append(Paragraph(line, styles["Normal"]))
                story.append(Spacer(1, 4))
            story.append(Spacer(1, 14))
        pdf.build(story)
    elif target_fmt == "html":
        html_slides = "".join(f"<div class='slide' style='border:1px solid #ccc;padding:16px;margin:16px 0;border-radius:8px;'><pre>{s}</pre></div>" for s in slides_text)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"<!DOCTYPE html><html><head><meta charset='utf-8'><title>PowerPoint Slides</title></head><body>{html_slides}</body></html>")
    elif target_fmt == "md":
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n\n".join(f"## Slide {i+1}\n\n" + "\n".join(s.splitlines()[1:]) for i, s in enumerate(slides_text)))
    else:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)

def convert_text_or_markdown(input_path: str, output_path: str, target_fmt: str):
    with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    emit_progress(40, f"Converting text to {target_fmt.upper()}...")
    if target_fmt == "docx":
        import docx
        doc = docx.Document()
        for line in content.splitlines():
            if line.startswith("# "):
                doc.add_heading(line[2:], level=1)
            elif line.startswith("## "):
                doc.add_heading(line[3:], level=2)
            elif line.strip():
                doc.add_paragraph(line)
        doc.save(output_path)
    elif target_fmt == "html":
        import markdown
        html_body = markdown.markdown(content)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{{font-family:sans-serif;padding:32px;line-height:1.6;}}</style></head><body>{html_body}</body></html>")
    elif target_fmt == "pdf":
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet

        pdf = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        for line in content.splitlines():
            if line.startswith("# "):
                story.append(Paragraph(line[2:], styles["Heading1"]))
            elif line.startswith("## "):
                story.append(Paragraph(line[3:], styles["Heading2"]))
            elif line.strip():
                story.append(Paragraph(line, styles["Normal"]))
                story.append(Spacer(1, 4))
        if not story:
            story.append(Paragraph("Empty text", styles["Normal"]))
        pdf.build(story)
    else:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

def convert_image(input_path: str, output_path: str, target_fmt: str):
    emit_progress(30, "Opening image...")
    im = Image.open(input_path)

    emit_progress(60, f"Transforming image to {target_fmt.upper()}...")
    if target_fmt == "pdf":
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
        im.save(output_path, "PDF", resolution=150.0)
    elif target_fmt == "docx":
        import docx
        doc = docx.Document()
        doc.add_heading(os.path.basename(input_path), level=1)
        doc.add_picture(input_path, width=docx.shared.Inches(5.5))
        doc.save(output_path)
    elif target_fmt == "ico":
        im_resized = im.resize((64, 64), Image.Resampling.LANCZOS)
        im_resized.save(output_path, format="ICO")
    else:
        # Standard formats: png, jpg, webp, bmp, tiff
        fmt_map = {"jpg": "JPEG", "jpeg": "JPEG", "png": "PNG", "webp": "WEBP", "bmp": "BMP", "tiff": "TIFF"}
        save_fmt = fmt_map.get(target_fmt.lower(), "PNG")
        if save_fmt == "JPEG" and im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
        im.save(output_path, format=save_fmt)

# ----------------- Master Router -----------------

def convert_universal(input_path: str, output_path: str, target_format: str = None) -> bool:
    if not os.path.exists(input_path):
        emit_error(f"Input file not found: {input_path}")
        return False

    in_ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    out_ext = (target_format or os.path.splitext(output_path)[1]).lower().lstrip(".")

    emit_progress(10, f"Initializing converter: {in_ext.upper()} -> {out_ext.upper()}...")

    try:
        # 1. Input is PDF
        if in_ext == "pdf":
            if out_ext in ["docx", "doc"]:
                convert_pdf_to_docx(input_path, output_path)
            elif out_ext in ["png", "jpg", "jpeg", "webp"]:
                convert_pdf_to_images(input_path, output_path, out_ext)
            elif out_ext in ["xlsx", "csv"]:
                convert_pdf_to_excel(input_path, output_path, out_ext)
            elif out_ext in ["txt", "md", "html"]:
                convert_pdf_to_text(input_path, output_path, out_ext)
            else:
                convert_pdf_to_docx(input_path, output_path)

        # 2. Input is Word DOCX
        elif in_ext in ["docx", "doc"]:
            if out_ext == "pdf":
                convert_docx_to_pdf(input_path, output_path)
            elif out_ext in ["txt", "html", "md"]:
                convert_docx_to_text_or_html(input_path, output_path, out_ext)
            else:
                convert_docx_to_pdf(input_path, output_path)

        # 3. Input is Excel / CSV
        elif in_ext in ["xlsx", "xls", "csv", "tsv"]:
            convert_excel_or_csv(input_path, output_path, out_ext)

        # 4. Input is PowerPoint PPTX
        elif in_ext in ["pptx", "ppt"]:
            convert_pptx(input_path, output_path, out_ext)

        # 5. Input is Text / Markdown / HTML
        elif in_ext in ["txt", "md", "markdown", "html", "htm", "rtf", "json"]:
            convert_text_or_markdown(input_path, output_path, out_ext)

        # 6. Input is Image
        elif in_ext in ["png", "jpg", "jpeg", "webp", "bmp", "tiff", "gif", "ico"]:
            convert_image(input_path, output_path, out_ext)

        else:
            emit_error(f"Unsupported input format: {in_ext}")
            return False

        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            emit_success(output_path, f"Successfully converted to {out_ext.upper()}!")
            return True
        else:
            emit_error(f"Output file was not produced for {in_ext} -> {out_ext}")
            return False

    except Exception as e:
        emit_error(f"Conversion error: {str(e)}\n{traceback.format_exc()}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Universal Any-to-Any File Converter")
    parser.add_argument("input_file", help="Path to input source file")
    parser.add_argument("output_file", help="Path to output converted file")
    parser.add_argument("--format", default=None, help="Explicit target format extension")

    args = parser.parse_args()
    success = convert_universal(args.input_file, args.output_file, args.format)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

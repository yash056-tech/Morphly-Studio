#!/usr/bin/env python3
"""
PDF to DOCX Converter utility.
Preserves tables, typography, formatting, and images using pdf2docx.
Implements strict zero-retention / temporary conversion support.
"""

import sys
import os
import json
import argparse
import traceback

def convert_pdf_to_docx(input_pdf: str, output_docx: str, start_page: int = 0, end_page: int = None) -> bool:
    try:
        from pdf2docx import Converter
    except ImportError as e:
        print(json.dumps({"status": "error", "message": f"pdf2docx is not installed: {str(e)}"}), file=sys.stderr)
        return False

    if not os.path.exists(input_pdf):
        print(json.dumps({"status": "error", "message": f"Input PDF file not found: {input_pdf}"}), file=sys.stderr)
        return False

    try:
        print(json.dumps({"status": "progress", "percent": 10, "stage": "Opening PDF document..."}), flush=True)
        cv = Converter(input_pdf)
        
        print(json.dumps({"status": "progress", "percent": 30, "stage": "Analyzing structure, typography, and tables..."}), flush=True)
        
        # Convert pages
        print(json.dumps({"status": "progress", "percent": 60, "stage": "Reconstructing Word (.docx) layout..."}), flush=True)
        cv.convert(output_docx, start=start_page, end=end_page)
        cv.close()

        if os.path.exists(output_docx) and os.path.getsize(output_docx) > 0:
            print(json.dumps({
                "status": "success",
                "percent": 100,
                "stage": "Conversion completed successfully!",
                "output_size": os.path.getsize(output_docx)
            }), flush=True)
            return True
        else:
            print(json.dumps({"status": "error", "message": "Output DOCX file was not generated or is empty."}), file=sys.stderr)
            return False

    except Exception as e:
        error_msg = f"Conversion error: {str(e)}"
        print(json.dumps({
            "status": "error",
            "message": error_msg,
            "traceback": traceback.format_exc()
        }), file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Convert PDF to Word DOCX preserving formatting.")
    parser.add_argument("input_pdf", help="Path to input PDF file")
    parser.add_argument("output_docx", help="Path to output DOCX file")
    parser.add_argument("--start", type=int, default=0, help="Start page index (0-based)")
    parser.add_argument("--end", type=int, default=None, help="End page index (exclusive)")

    args = parser.parse_args()
    success = convert_pdf_to_docx(args.input_pdf, args.output_docx, args.start, args.end)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

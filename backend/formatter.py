#!/usr/bin/env python3
"""
Python code formatter utility.
Standardizes indentation, spacing, imports, and PEP 8 formatting.
"""

import sys
import json
import io

def format_python_code(code: str, indent_size: int = 4) -> str:
    try:
        import autopep8
        formatted = autopep8.fix_code(code, options={
            'indent_size': indent_size,
            'aggressive': 1,
            'max_line_length': 100,
        })
        return formatted
    except ImportError:
        # Fallback if autopep8 is unavailable: basic clean indentation & stripping
        lines = code.splitlines()
        return "\n".join(line.rstrip() for line in lines) + "\n"

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--stdin":
        input_code = sys.stdin.read()
    else:
        input_code = sys.stdin.read()

    indent_size = 4
    if "--indent" in sys.argv:
        try:
            idx = sys.argv.index("--indent")
            indent_size = int(sys.argv[idx + 1])
        except (ValueError, IndexError):
            pass

    try:
        formatted = format_python_code(input_code, indent_size=indent_size)
        sys.stdout.write(formatted)
        sys.exit(0)
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    main()

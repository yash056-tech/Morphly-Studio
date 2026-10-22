export type SupportedLanguage = "javascript" | "html" | "css" | "json" | "python";

export interface FormatOptions {
  indentSize: number;
  useTabs: boolean;
}

export async function formatCode(
  code: string,
  language: SupportedLanguage,
  options: FormatOptions = { indentSize: 2, useTabs: false }
): Promise<string> {
  if (!code || code.trim() === "") return code;

  if (language === "python") {
    try {
      // Call local backend endpoint for high-fidelity autopep8 formatting
      const res = await fetch("/api/format-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, indent: options.indentSize }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.formatted) {
          return data.formatted;
        }
      }
    } catch {
      // Fallback: standard client-side cleanup
    }

    // Client-side fallback for Python
    return fallbackPythonFormat(code, options.indentSize);
  }

  // Prettier client-side formatting
  try {
    const prettier = await import("prettier/standalone");
    const plugins = [];
    let parser = "babel";

    if (language === "javascript") {
      const babel = await import("prettier/plugins/babel");
      const estree = await import("prettier/plugins/estree");
      plugins.push(babel.default || babel, estree.default || estree);
      parser = "babel";
    } else if (language === "json") {
      const babel = await import("prettier/plugins/babel");
      const estree = await import("prettier/plugins/estree");
      plugins.push(babel.default || babel, estree.default || estree);
      parser = "json";
    } else if (language === "html") {
      const html = await import("prettier/plugins/html");
      plugins.push(html.default || html);
      parser = "html";
    } else if (language === "css") {
      const postcss = await import("prettier/plugins/postcss");
      plugins.push(postcss.default || postcss);
      parser = "css";
    }

    const formatted = await prettier.format(code, {
      parser,
      plugins,
      tabWidth: options.indentSize,
      useTabs: options.useTabs,
      singleQuote: true,
      semi: true,
    });

    return formatted;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(`Formatting failed: ${errorMsg}`);
  }
}

function fallbackPythonFormat(code: string, indent: number): string {
  const lines = code.split("\n");
  let currentIndent = 0;
  const result: string[] = [];
  const indentStr = " ".repeat(indent);

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push("");
      continue;
    }

    // Handle dedent triggers
    if (
      trimmed.startsWith("return") ||
      trimmed.startsWith("break") ||
      trimmed.startsWith("continue") ||
      trimmed.startsWith("pass") ||
      trimmed.startsWith("else:") ||
      trimmed.startsWith("elif ") ||
      trimmed.startsWith("except") ||
      trimmed.startsWith("finally:")
    ) {
      if (
        (trimmed.startsWith("else:") ||
          trimmed.startsWith("elif ") ||
          trimmed.startsWith("except") ||
          trimmed.startsWith("finally:")) &&
        currentIndent > 0
      ) {
        currentIndent--;
      }
    }

    result.push(indentStr.repeat(Math.max(0, currentIndent)) + trimmed);

    // Increase indent for blocks
    if (trimmed.endsWith(":")) {
      currentIndent++;
    }
  }

  return result.join("\n");
}

export const SAMPLE_CODE: Record<SupportedLanguage, string> = {
  javascript: `// JavaScript / TypeScript Sample
function calculateMetrics(items, options = {}) {
const initialTotal = 0;
const taxRate = options.taxRate || 0.08;
const discount = options.discount || 0;

const subtotal = items.reduce((acc, item) => {
return acc + (item.price * item.quantity);
}, initialTotal);

const total = (subtotal - discount) * (1 + taxRate);
return { subtotal, discount, taxRate, total: Number(total.toFixed(2)) };
}

const cart = [{ name: "Desk Mat", price: 29.99, quantity: 2 }, { name: "Mechanical Keyboard", price: 119.5, quantity: 1 }];
console.log(calculateMetrics(cart, { discount: 15 }));`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern Web App</title>
<style>
body { font-family: sans-serif; margin: 0; padding: 20px; }
.card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
</style>
</head>
<body>
<main class="container">
<section class="card">
<h1>Morphly Studio</h1>
<p>Privacy-focused fast utility tools for everyone.</p>
<button id="cta-btn" onclick="alert('Ready!')">Get Started</button>
</section>
</main>
</body>
</html>`,

  css: `/* CSS Stylesheet Sample */
:root {
--brand-primary: #4f46e5;
--text-primary: #0f172a;
--bg-surface: #ffffff;
}

body {
margin: 0;
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
background-color: var(--bg-surface);
color: var(--text-primary);
}

.tool-card {
display: flex;
flex-direction: column;
padding: 1.5rem;
border-radius: 0.75rem;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tool-card:hover {
transform: translateY(-4px);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
}`,

  json: `{
"appName": "Morphly Studio",
"version": "1.0.0",
"privacy": {
"clientSideProcessing": true,
"zeroRetention": true,
"trackingCookies": false
},
"tools": [
{ "id": "pdf-to-word", "name": "PDF to Word Converter", "status": "active" },
{ "id": "image-compressor", "name": "Image Compressor", "status": "active" },
{ "id": "code-formatter", "name": "Code Formatter", "status": "active" }
],
"features": {
"monacoEditor": true,
"wasmImageProcessing": true,
"darkMode": true
}
}`,

  python: `# Python Data Processing Sample
import os
import sys
from typing import List, Dict, Any

class DataProcessor:
    def __init__(self, name: str, threshold: float = 0.75):
        self.name = name
        self.threshold = threshold
        self.history: List[Dict[str, Any]] = []

    def evaluate_batch(self, records: List[Dict[str, float]]) -> Dict[str, Any]:
        passed = []
        rejected = []
        for r in records:
            score = r.get("score", 0.0)
            if score >= self.threshold:
                passed.append(r)
            else:
                rejected.append(r)
        
        summary = {
            "processor": self.name,
            "total": len(records),
            "passed": len(passed),
            "pass_rate": round(len(passed) / max(1, len(records)) * 100, 2)
        }
        self.history.append(summary)
        return summary
`,
};

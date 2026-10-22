import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, indent = 4 } = await req.json();

    if (typeof code !== "string") {
      return NextResponse.json({ error: "Code string required" }, { status: 400 });
    }

    const formatterScript = path.join(process.cwd(), "backend", "formatter.py");
    const pythonExecutable = process.platform === "win32" ? "py" : "python3";

    const formattedCode = await new Promise<string>((resolve, reject) => {
      const pyProcess = spawn(pythonExecutable, [formatterScript, "--indent", String(indent)]);

      let stdout = "";
      let stderr = "";

      pyProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pyProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pyProcess.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Formatter exited with code ${code}`));
        }
      });

      pyProcess.on("error", (err) => {
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });

      pyProcess.stdin.write(code);
      pyProcess.stdin.end();
    });

    return NextResponse.json({ success: true, formatted: formattedCode });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Formatting failed";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

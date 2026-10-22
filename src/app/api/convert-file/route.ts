import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  html: "text/html; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
  json: "application/json; charset=utf-8",
  zip: "application/zip",
};

export async function POST(req: NextRequest) {
  let tempInputPath: string | null = null;
  let tempOutputPath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let targetFormat = (formData.get("targetFormat") as string | null)?.toLowerCase()?.replace(/^\./, "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalName = file.name;
    const inputExt = path.extname(originalName).toLowerCase().replace(/^\./, "");

    // Sensible default target format if omitted
    if (!targetFormat) {
      if (inputExt === "pdf") {
        targetFormat = "docx";
      } else if (["docx", "doc", "pptx", "xlsx", "txt", "md", "png", "jpg", "jpeg", "webp"].includes(inputExt)) {
        targetFormat = "pdf";
      } else {
        targetFormat = "pdf";
      }
    }

    const MAX_SIZE = 500 * 1024 * 1024; // 500MB High Capacity (Unlimited for logged in users)
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 500MB high-capacity size limit" },
        { status: 400 }
      );
    }

    const uniqueId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const tempDir = os.tmpdir();
    tempInputPath = path.join(tempDir, `${uniqueId}.${inputExt}`);
    tempOutputPath = path.join(tempDir, `${uniqueId}_out.${targetFormat}`);

    // Write input file to disk
    const arrayBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(tempInputPath, Buffer.from(arrayBuffer));

    // Execute universal converter
    const converterScript = path.join(process.cwd(), "backend", "universal_converter.py");
    const pythonExecutable = process.platform === "win32" ? "py" : "python3";

    await new Promise<void>((resolve, reject) => {
      const pyProcess = spawn(pythonExecutable, [
        converterScript,
        tempInputPath!,
        tempOutputPath!,
        "--format",
        targetFormat!,
      ]);

      let stderrData = "";
      pyProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      pyProcess.on("close", (code) => {
        if (code === 0 && tempOutputPath && fs.existsSync(tempOutputPath)) {
          resolve();
        } else {
          reject(new Error(stderrData || `Conversion failed with exit code ${code}`));
        }
      });

      pyProcess.on("error", (err) => {
        reject(new Error(`Failed to start converter process: ${err.message}`));
      });
    });

    if (!tempOutputPath || !fs.existsSync(tempOutputPath)) {
      throw new Error(`Failed to produce converted output file for target format: ${targetFormat}`);
    }

    const outputBuffer = await fs.promises.readFile(tempOutputPath);
    const originalBase = path.parse(originalName).name;
    const downloadFilename = `${originalBase}.${targetFormat}`;
    const contentType = MIME_TYPES[targetFormat] || "application/octet-stream";

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadFilename)}"`,
        "Content-Length": outputBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Conversion failed";
    console.error("Universal conversion error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  } finally {
    // ZERO RETENTION: Purge all temp files immediately
    try {
      if (tempInputPath && fs.existsSync(tempInputPath)) {
        await fs.promises.unlink(tempInputPath);
      }
    } catch {}
    try {
      if (tempOutputPath && fs.existsSync(tempOutputPath)) {
        await fs.promises.unlink(tempOutputPath);
      }
    } catch {}
  }
}

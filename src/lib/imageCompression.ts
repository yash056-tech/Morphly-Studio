import imageCompression from "browser-image-compression";

export type ImageExportFormat = "webp" | "jpeg" | "jpg" | "png" | "avif" | "bmp" | "ico" | "pdf" | "svg";

export type CompressionPreset = "web" | "ultra" | "lossless" | "document" | "icon" | "custom";

export interface AdvancedCompressionOptions {
  // Quality & strategy
  quality: number; // 1 to 100
  isLossless: boolean;
  exportFormat: ImageExportFormat;
  preset: CompressionPreset;

  // Target size
  targetSizeMode: boolean;
  targetSizeKB?: number; // e.g. 100 KB

  // Dimensions
  scalePercent: number; // 10 to 100
  customWidth?: number;
  customHeight?: number;
  lockAspectRatio: boolean;

  // Filters & Processing
  grayscale: boolean;
  stripExif: boolean;
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
}

export interface AdvancedCompressionResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  format: ImageExportFormat;
}

export const PRESET_CONFIGS: Record<CompressionPreset, Partial<AdvancedCompressionOptions>> = {
  web: {
    quality: 75,
    isLossless: false,
    exportFormat: "webp",
    scalePercent: 100,
    grayscale: false,
    stripExif: true,
    targetSizeMode: false,
  },
  ultra: {
    quality: 35,
    isLossless: false,
    exportFormat: "webp",
    scalePercent: 70,
    grayscale: false,
    stripExif: true,
    targetSizeMode: false,
  },
  lossless: {
    quality: 100,
    isLossless: true,
    exportFormat: "png",
    scalePercent: 100,
    grayscale: false,
    stripExif: false,
    targetSizeMode: false,
  },
  document: {
    quality: 70,
    isLossless: false,
    exportFormat: "jpeg",
    scalePercent: 90,
    grayscale: false,
    stripExif: true,
    targetSizeMode: true,
    targetSizeKB: 200,
  },
  icon: {
    quality: 90,
    isLossless: true,
    exportFormat: "ico",
    scalePercent: 100,
    customWidth: 64,
    customHeight: 64,
    grayscale: false,
    stripExif: true,
    targetSizeMode: false,
  },
  custom: {},
};

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image dimensions"));
    };
    img.src = url;
  });
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Encodes canvas image data into a valid Windows 24-bit BMP Blob.
 */
function canvasToBmpBlob(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext("2d")!;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const totalFileSize = fileHeaderSize + infoHeaderSize + pixelArraySize;

  const buffer = new ArrayBuffer(totalFileSize);
  const view = new DataView(buffer);

  // File header ('BM')
  view.setUint16(0, 0x424d, false);
  view.setUint32(2, totalFileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, fileHeaderSize + infoHeaderSize, true);

  // Info header
  view.setUint32(14, infoHeaderSize, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true); // bottom-to-top
  view.setUint16(26, 1, true); // 1 plane
  view.setUint16(28, 24, true); // 24-bit color
  view.setUint32(30, 0, true); // uncompressed
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true); // 72 DPI
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Pixel data (BGR bottom-to-top)
  let offset = fileHeaderSize + infoHeaderSize;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4;
      view.setUint8(offset++, data[p + 2]); // B
      view.setUint8(offset++, data[p + 1]); // G
      view.setUint8(offset++, data[p]);     // R
    }
    // Row padding
    const padding = rowSize - width * 3;
    for (let pad = 0; pad < padding; pad++) {
      view.setUint8(offset++, 0);
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

/**
 * Encodes canvas to standard ICO file containing a PNG directory entry.
 */
async function canvasToIcoBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const pngBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
  const pngBuffer = await pngBlob.arrayBuffer();
  const pngBytes = new Uint8Array(pngBuffer);

  const headerSize = 6;
  const dirSize = 16;
  const totalSize = headerSize + dirSize + pngBytes.length;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICO header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // 1 = ICO type
  view.setUint16(4, 1, true); // 1 image count

  // Directory entry
  const w = canvas.width >= 256 ? 0 : canvas.width;
  const h = canvas.height >= 256 ? 0 : canvas.height;
  view.setUint8(6, w);
  view.setUint8(7, h);
  view.setUint8(8, 0); // palette colors
  view.setUint8(9, 0); // reserved
  view.setUint16(10, 1, true); // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngBytes.length, true); // image size
  view.setUint32(18, headerSize + dirSize, true); // offset

  // Write image data
  new Uint8Array(buffer, headerSize + dirSize).set(pngBytes);

  return new Blob([buffer], { type: "image/x-icon" });
}

/**
 * Creates SVG image embedding data URI.
 */
function canvasToSvgBlob(canvas: HTMLCanvasElement): Blob {
  const dataUrl = canvas.toDataURL("image/png");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" /></svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
}

/**
 * Creates single-page PDF containing the compressed canvas image.
 */
function canvasToPdfBlob(canvas: HTMLCanvasElement): Blob {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  // Standard minimal PDF with JPEG image XObject
  const w = canvas.width * 0.75; // Convert px to pt (72 dpi)
  const h = canvas.height * 0.75;
  const pdfString = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(2)} ${h.toFixed(2)}] /Contents 4 0 R /Resources <</XObject <</Im0 5 0 R>>>>>> endobj
4 0 obj <</Length 43>> stream
q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} 0 0 cm /Im0 Do Q
endstream endobj
5 0 obj <</Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${dataUrl.length}>> stream
${dataUrl}
endstream endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000257 00000 n 
0000000350 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
550
%%EOF`;

  return new Blob([pdfString], { type: "application/pdf" });
}

/**
 * Main Universal Compression & Format Conversion Engine
 */
export async function compressAndConvertImage(
  file: File,
  options: AdvancedCompressionOptions,
  onProgress?: (progress: number) => void
): Promise<AdvancedCompressionResult> {
  const originalSize = file.size;
  const originalDims = await getImageDimensions(file);

  if (onProgress) onProgress(15);
  const imgElement = await loadImageElement(file);

  // Calculate target dimensions
  let targetWidth = originalDims.width;
  let targetHeight = originalDims.height;

  if (options.customWidth && options.customHeight) {
    targetWidth = options.customWidth;
    targetHeight = options.customHeight;
  } else if (options.scalePercent && options.scalePercent < 100) {
    const scale = options.scalePercent / 100;
    targetWidth = Math.max(16, Math.round(originalDims.width * scale));
    targetHeight = Math.max(16, Math.round(originalDims.height * scale));
  }

  if (onProgress) onProgress(35);

  // Setup HTML5 Canvas for transformation & filtering
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context");

  // Apply Brightness & Contrast filters if modified
  const filterParts = [];
  if (options.brightness !== 0) {
    filterParts.push(`brightness(${100 + options.brightness}%)`);
  }
  if (options.contrast !== 0) {
    filterParts.push(`contrast(${100 + options.contrast}%)`);
  }
  if (options.grayscale) {
    filterParts.push("grayscale(100%)");
  }
  if (filterParts.length > 0) {
    ctx.filter = filterParts.join(" ");
  }

  // Draw image to canvas with bicubic resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);

  if (onProgress) onProgress(60);

  const exportFmt = options.exportFormat || "webp";
  let outputBlob: Blob;

  // Determine quality level (0.01 to 1.0)
  let qualityRatio = options.isLossless
    ? 1.0
    : Math.max(0.01, Math.min(1.0, options.quality / 100));

  // If Target Size Mode (e.g. max 200 KB) is enabled, iteratively adjust quality
  if (options.targetSizeMode && options.targetSizeKB && !options.isLossless) {
    const targetBytes = options.targetSizeKB * 1024;
    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;

    for (let iter = 0; iter < 4; iter++) {
      const q = (minQ + maxQ) / 2;
      const testBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), `image/${exportFmt === "jpg" ? "jpeg" : exportFmt}`, q)
      );
      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        minQ = q; // try getting better quality while staying under
      } else {
        maxQ = q;
      }
    }
    outputBlob = bestBlob || (await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), `image/${exportFmt === "jpg" ? "jpeg" : exportFmt}`, 0.4)
    ));
  } else {
    // Standard format exports
    if (exportFmt === "bmp") {
      outputBlob = canvasToBmpBlob(canvas);
    } else if (exportFmt === "ico") {
      outputBlob = await canvasToIcoBlob(canvas);
    } else if (exportFmt === "svg") {
      outputBlob = canvasToSvgBlob(canvas);
    } else if (exportFmt === "pdf") {
      outputBlob = canvasToPdfBlob(canvas);
    } else {
      const mime = exportFmt === "jpg" || exportFmt === "jpeg"
        ? "image/jpeg"
        : exportFmt === "png"
        ? "image/png"
        : exportFmt === "avif"
        ? "image/avif"
        : "image/webp";

      outputBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else {
              // Fallback to PNG if browser doesn't support specific mime (e.g. AVIF canvas)
              canvas.toBlob((fallbackBlob) => resolve(fallbackBlob!), "image/png");
            }
          },
          mime,
          options.isLossless ? undefined : qualityRatio
        );
      });
    }
  }

  if (onProgress) onProgress(90);

  // Construct final File object with appropriate extension
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const ext = exportFmt === "jpeg" ? "jpg" : exportFmt;
  const finalFilename = `${baseName}.${ext}`;

  const finalFile = new File([outputBlob], finalFilename, {
    type: outputBlob.type,
    lastModified: Date.now(),
  });

  const previewUrl = URL.createObjectURL(finalFile);
  const compressedSize = finalFile.size;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercentage = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  if (onProgress) onProgress(100);

  return {
    file: finalFile,
    previewUrl,
    originalSize,
    compressedSize,
    savedBytes,
    savedPercentage,
    originalWidth: originalDims.width,
    originalHeight: originalDims.height,
    newWidth: targetWidth,
    newHeight: targetHeight,
    format: exportFmt,
  };
}

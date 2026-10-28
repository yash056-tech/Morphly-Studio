# Morphly - Universal Any-to-Any File Converter & Image Studio

Morphly is a high-speed, privacy-first web application featuring two primary utility suites:

1. **Universal File & Document Converter** — Convert **any file format into any other file format**:
   - **PDF** ➔ Word (`.docx`), Excel (`.xlsx`, `.csv`), Text (`.txt`), Markdown (`.md`), HTML (`.html`), Images (`.png`, `.jpg`).
   - **Word (`.docx`, `.doc`)** ➔ PDF (`.pdf`), Text (`.txt`), HTML (`.html`), Markdown (`.md`).
   - **Excel & Spreadsheets (`.xlsx`, `.xls`, `.csv`, `.tsv`)** ➔ PDF (`.pdf`), Excel (`.xlsx`), CSV (`.csv`), JSON (`.json`), HTML Table (`.html`), Markdown (`.md`).
   - **PowerPoint (`.pptx`, `.ppt`)** ➔ PDF (`.pdf`), Text (`.txt`), HTML (`.html`), Markdown (`.md`).
   - **Text & Markdown (`.txt`, `.md`, `.html`, `.json`)** ➔ PDF (`.pdf`), Word (`.docx`), HTML (`.html`), Text (`.txt`).
   - **Images (`.png`, `.jpg`, `.webp`, `.bmp`, `.tiff`)** ➔ PDF document (`.pdf`), Word document (`.docx`), ICO, and other image formats.
   - Preserves tables, typography, layout geometry, and fonts with **strict zero data retention**.

2. **Universal Image Compressor & Studio** — Compress images in **all possible ways** and export to **any format**:
   - **Compression Modes**: Web Optimal, Ultra Compression, 100% Pixel-Perfect Lossless, Document / Form Mode, Favicon / Icon, and Custom.
   - **Quality & Size Controls**:
     - Granular Quality slider (1% to 100%).
     - **Exact Target Size Matcher** (e.g. compress to maximum 50 KB, 100 KB, 200 KB, 500 KB, 1 MB for government/visa forms).
     - Lossless mode toggle.
   - **Resolution & Aspect Ratio**: Scale percentage slider (10% to 100%), custom Width × Height with aspect-ratio locking.
   - **Filters & Privacy**: Grayscale / B&W filter toggle, EXIF & tracking metadata stripping.
   - **Export Formats**: WebP, JPEG / JPG, PNG, AVIF, BMP, ICO (Favicon), PDF Document, and SVG.
   - **100% In-Browser Execution**: Processed using HTML5 Canvas & WebWorkers. Images never touch any external server.

---

## 🏃 Running the Application

### Development
```bash
npm run dev
```

### Production Build & Run
```bash
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛡️ Privacy Guarantee

- **Images**: 100% In-Browser Canvas / WebWorker (0 bytes sent to server).
- **Documents & Files**: Ephemeral memory execution with instantaneous file deletion upon stream completion.

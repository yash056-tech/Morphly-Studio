from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import tempfile
import os
import shutil
from converter import convert_pdf_to_docx
from formatter import format_python_code

app = FastAPI(
    title="Morphly Processing API",
    description="Zero-retention document and code processing microservice",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormatRequest(BaseModel):
    code: str
    indent: int = 4

def cleanup_files(*file_paths):
    """Instantly remove temporary files to guarantee Zero Data Retention."""
    for path in file_paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Morphly Backend"}

@app.post("/convert-pdf")
async def convert_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files are supported")

    # Create temporary paths
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
        shutil.copyfileobj(file.file, temp_pdf)
        temp_pdf_path = temp_pdf.name

    temp_docx_path = temp_pdf_path.replace(".pdf", ".docx")

    try:
        success = convert_pdf_to_docx(temp_pdf_path, temp_docx_path)
        if not success or not os.path.exists(temp_docx_path):
            cleanup_files(temp_pdf_path, temp_docx_path)
            raise HTTPException(status_code=500, detail="Failed to convert PDF to Word. Ensure the PDF is not encrypted or corrupted.")

        # Ensure Zero Retention: delete both temp files after response is sent
        background_tasks.add_task(cleanup_files, temp_pdf_path, temp_docx_path)

        original_basename = os.path.splitext(file.filename)[0]
        download_name = f"{original_basename}.docx"

        return FileResponse(
            temp_docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=download_name
        )
    except HTTPException:
        raise
    except Exception as e:
        cleanup_files(temp_pdf_path, temp_docx_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/format-python")
async def format_python_endpoint(payload: FormatRequest):
    try:
        formatted = format_python_code(payload.code, payload.indent)
        return {"success": True, "formatted": formatted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

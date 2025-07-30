from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from deepface import DeepFace
import shutil
import json
import tempfile
import os
import numpy as np

app = FastAPI()


@app.get("/health")
async def health_check():
    """Health check endpoint for Docker"""
    return {"status": "healthy", "service": "ml-emotion-detection"}


def convert_numpy_types(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj


@app.post("/analyze")
async def analyze_emotion(image: UploadFile = File(...)):
    temp_path = None
    try:
        # Get file extension from original filename
        file_extension = (
            os.path.splitext(image.filename)[1] if image.filename else ".jpg"
        )
        if not file_extension:
            file_extension = ".jpg"

        with tempfile.NamedTemporaryFile(
            delete=False, suffix=file_extension
        ) as temp_image:
            shutil.copyfileobj(image.file, temp_image)
            temp_path = temp_image.name

        # Run DeepFace emotion analysis
        analysis = DeepFace.analyze(
            img_path=temp_path, actions=["emotion"], enforce_detection=False
        )
        result = analysis[0] if isinstance(analysis, list) else analysis

        # Convert numpy types to JSON serializable types
        serializable_result = convert_numpy_types(result)

        return JSONResponse(content=serializable_result)

    except Exception as e:
        return JSONResponse(content={"error": True, "message": str(e)}, status_code=500)

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        if hasattr(image, "file"):
            image.file.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5001)

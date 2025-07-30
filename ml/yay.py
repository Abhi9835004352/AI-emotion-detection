import sys
import json
import cv2
from deepface import DeepFace

def analyze_single_image(image_path):
    """
    Analyzes a single image for emotions and prints the result as a JSON string.
    """
    try:
        # DeepFace.analyze will find the dominant emotion and all scores
        analysis = DeepFace.analyze(
            img_path=image_path,
            actions=['emotion'],
            enforce_detection=True # Set to True to ensure a face is found
        )
        
        # The result is a list, we take the first detected face
        if isinstance(analysis, list) and analysis:
            # We only need the emotion data
            emotion_data = analysis[0]
            # Print result to stdout so Node.js can capture it
            print(json.dumps(emotion_data))
        else:
            # Handle cases where DeepFace returns unexpected data
            raise Exception("No face detected or unexpected analysis result.")

    except Exception as e:
        # Output error as a JSON object for consistent parsing in Node.js
        error_response = {"error": True, "message": str(e)}
        print(json.dumps(error_response))
        sys.exit(1) # Exit with an error code

if __name__ == "__main__":
    # The image path will be passed as the first command-line argument
    if len(sys.argv) > 1:
        image_path_arg = sys.argv[1]
        analyze_single_image(image_path_arg)
    else:
        # Error if no image path is provided
        error_response = {"error": True, "message": "No image path provided."}
        print(json.dumps(error_response))
        sys.exit(1)

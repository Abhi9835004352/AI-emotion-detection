    import cv2
    from deepface import DeepFace
    import datetime
    import time

    # --- Configuration ---
    # File to save emotion logs
    LOG_FILE = "emotion_log.txt"
    # How often to run analysis (in seconds). Higher numbers mean better performance.
    ANALYSIS_INTERVAL = 1

    def log_emotion(file, emotions_data):
        """Formats and writes emotion data to the log file."""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"Timestamp: {timestamp}\n"
        
        # DeepFace returns a list, one dict per face.
        # We'll log data for the first detected face.
        if emotions_data:
            face_data = emotions_data[0]['emotion']
            dominant_emotion = emotions_data[0]['dominant_emotion']
            
            log_entry += f"Dominant Emotion: {dominant_emotion}\n"
            log_entry += "--- All Scores ---\n"
            for emotion, score in face_data.items():
                log_entry += f"- {emotion.capitalize()}: {score:.2f}%\n"
            log_entry += "-" * 20 + "\n\n"
            
            file.write(log_entry)

    def main():
        """Main function to run live emotion detection."""
        
        # Open the log file in append mode
        with open(LOG_FILE, 'a') as log_file:
            print(f"✅ Logging emotions to {LOG_FILE}")
            print("🚀 Starting camera... Press 'q' in the camera window to quit.")
            
            # Initialize video capture from the default camera (0)
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                print("❌ Error: Could not open camera.")
                return

            last_analysis_time = time.time()
            
            # Main loop to capture frames from the camera
            while True:
                # Read a frame from the camera
                ret, frame = cap.read()
                if not ret:
                    print("❌ Error: Can't receive frame. Exiting ...")
                    break

                current_time = time.time()
                
                # Run analysis periodically
                if current_time - last_analysis_time >= ANALYSIS_INTERVAL:
                    last_analysis_time = current_time
                    
                    try:
                        # Analyze the current frame for emotions
                        # enforce_detection=False prevents crashing if no face is found
                        analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
                        
                        # Log the results if a face was detected
                        if isinstance(analysis, list) and analysis:
                            log_emotion(log_file, analysis)
                            
                            # Draw results on the frame
                            face_info = analysis[0]
                            dominant_emotion = face_info['dominant_emotion']
                            face_box = face_info['region']
                            
                            # Draw a rectangle around the face
                            x, y, w, h = face_box['x'], face_box['y'], face_box['w'], face_box['h']
                            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                            
                            # Put the dominant emotion text above the rectangle
                            cv2.putText(frame, dominant_emotion.capitalize(), (x, y - 10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                    except Exception as e:
                        print(f"⚠️ Could not process frame: {e}")

                # Display the resulting frame
                cv2.imshow('Live Emotion Analysis - Press Q to Quit', frame)

                # Break the loop if 'q' is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        # Release the capture and destroy all windows
        cap.release()
        cv2.destroyAllWindows()
        print(f"\n🛑 Camera closed. Emotion log saved to {LOG_FILE}")

    if __name__ == '__main__':
        main()
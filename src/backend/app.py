## Backend Implementation (Flask)

### 1. Main Flask Application (`backend/app.py`)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from services.video_service import download_video, extract_frames, extract_audio
# from services.openai_service import analyze_video_with_gpt4o
from services.gemini_service import analyze_video_with_gemini
# from services.huggingface_service import generate_captions, transcribe_audio
# from services.deepgram_service import transcribe_with_deepgram
from utils.error_handling import handle_api_error

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok"})

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """Endpoint to analyze a video from a URL."""
    try:
        data = request.get_json()
        
        if not data or 'video_url' not in data:
            return jsonify({"error": "Missing video_url parameter"}), 400
            
        video_url = data['video_url']
        logger.info(f"Received analysis request for video: {video_url}")
        
            
        # Download video
        video_path = download_video(video_url)
        
        # Process video
        frames = extract_frames(video_path)
        audio_path = extract_audio(video_path)
        
        # Parallel processing with multiple AI services
        # (In a production app, consider using async features or Celery)
        
        # 1. OpenAI GPT-4o for comprehensive analysis
        # gpt4o_analysis = analyze_video_with_gpt4o(frames, audio_path)
        
        # 2. Google Gemini for scene understanding
        gemini_analysis = analyze_video_with_gemini(frames)
        
        # 3. HuggingFace BLIP for frame captioning
        # frame_captions = generate_captions(frames)
        
        # 4. Speech transcription
        # transcription = transcribe_audio(audio_path)  # Using Whisper
        # Alternatively: transcription = transcribe_with_deepgram(audio_path)
        
        # Clean up temporary files
        if os.path.exists(video_path):
            os.remove(video_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        # Compile results
        results = {
            "summary": gpt4o_analysis["summary"],
            "detailed_analysis": {
                # "gpt4o": gpt4o_analysis,
                "gemini": gemini_analysis,
                # "frame_captions": frame_captions,
                # "transcription": transcription
            }
        }
            
        return jsonify(results)
        
    except Exception as e:
        return handle_api_error(e)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
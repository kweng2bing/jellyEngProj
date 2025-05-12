from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import json
import traceback
from services.video_service import download_video, extract_frames, extract_audio
from services.gemini_service import analyze_video_with_gemini

# Enhanced logging configuration
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    logger.info("Health check requested")
    return jsonify({"status": "ok"})

@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """Endpoint to analyze a video from a URL."""
    logger.info(f"Received request: {request.method} {request.path}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    
    try:
        # Log the raw request body
        if request.is_json:
            data = request.get_json()
            logger.info(f"Received JSON data: {json.dumps(data)}")
        else:
            logger.warning("Request does not contain JSON data")
            data = {}
            # Try to parse the raw body as JSON anyway
            try:
                data = json.loads(request.data.decode('utf-8'))
                logger.info(f"Parsed raw body as JSON: {json.dumps(data)}")
            except:
                logger.error("Failed to parse request body as JSON")
                request_data = request.data.decode('utf-8') if request.data else "Empty body"
                logger.debug(f"Raw request body: {request_data}")
        
        # Validate the request data
        if not data or 'video_url' not in data:
            logger.warning("Missing video_url parameter in request")
            return jsonify({"error": "Missing video_url parameter"}), 400
            
        video_url = data['video_url']
        logger.info(f"Processing video URL: {video_url}")
        
                
        # Process video
        logger.info("Downloading video...")
        video_path = download_video(video_url)
        logger.info(f"Video downloaded to: {video_path}")
        
        logger.info("Extracting frames...")
        frames = extract_frames(video_path)
        logger.info(f"Extracted {len(frames)} frames")
        
        logger.info("Extracting audio...")
        audio_path = extract_audio(video_path)
        logger.info(f"Audio extracted to: {audio_path}")
        
        # Google Gemini for scene understanding
        logger.info("Analyzing with Gemini...")
        gemini_analysis = analyze_video_with_gemini(frames)
        logger.info("Gemini analysis complete")
        logger.debug(f"Gemini analysis result: {json.dumps(gemini_analysis)}")
        
        # Clean up temporary files
        if os.path.exists(video_path):
            os.remove(video_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        # Compile results
        results = {
            "summary": gemini_analysis["summary"],
            "detailed_analysis": {
                "gemini": gemini_analysis,
            }
        }
        
        logger.info("Analysis completed successfully")
        logger.debug(f"Returning results: {json.dumps(results)}")
        
        # Return the results
        return jsonify(results)
        
    except Exception as e:
        # Enhanced error logging
        logger.error(f"Error in API: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    # Ensure temp directories exist
    for directory in ["temp_videos", "temp_frames", "temp_audio"]:
        os.makedirs(directory, exist_ok=True)
        
    logger.info(f"Starting Flask server on port {os.environ.get('PORT', 5000)}")
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))




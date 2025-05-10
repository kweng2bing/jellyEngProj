from flask import jsonify
import logging

logger = logging.getLogger(__name__)

def handle_api_error(exception):
    """Handle API errors and return appropriate responses."""
    logger.error(f"API Error: {str(exception)}")
    
    if "Google" in str(exception) or "Gemini" in str(exception):
        # Handle Google Gemini API errors
        return jsonify({
            "error": "Error with Google Gemini API",
            "message": str(exception)
        }), 500
    elif "video" in str(exception).lower():
        # Handle video processing errors
        return jsonify({
            "error": "Error processing video",
            "message": str(exception)
        }), 500
    else:
        # Generic error handler
        return jsonify({
            "error": "An unexpected error occurred",
            "message": str(exception)
        }), 500
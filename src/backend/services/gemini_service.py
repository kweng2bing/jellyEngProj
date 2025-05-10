import logging
import io
import cv2
import google.generativeai as genai
from PIL import Image
from config import GOOGLE_API_KEY

logger = logging.getLogger(__name__)

# Configure the Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

def frame_to_pil_image(frame):
    """Convert OpenCV frame to PIL Image."""
    return Image.fromarray(frame)

def analyze_video_with_gemini(frames):
    """Analyze video frames with Google Gemini Pro Vision."""
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-pro-vision')
        
        # Process frames (limit to 6 frames as that's Gemini's current limit)
        frames_to_process = frames[:6]
        pil_images = [frame_to_pil_image(frame) for frame in frames_to_process]
        
        # Prepare prompt
        prompt = """
        Analyze these video frames and provide:
        1. A detailed summary of what's happening in the video
        2. Key objects and their interactions
        3. Scene setting and environment details
        4. Any notable actions or events
        5. Technical observations about camera angles, lighting, etc.
        """
        
        # Generate analysis
        response = model.generate_content([prompt, *pil_images])
        
        # Extract and structure the response
        analysis_text = response.text
        
        # Simple parsing - in a production app, use more robust parsing
        structured_analysis = {
            "summary": analysis_text.split("1.")[1].split("2.")[0].strip() if "1." in analysis_text and "2." in analysis_text else "",
            "key_objects": analysis_text.split("2.")[1].split("3.")[0].strip() if "2." in analysis_text and "3." in analysis_text else "",
            "scene_details": analysis_text.split("3.")[1].split("4.")[0].strip() if "3." in analysis_text and "4." in analysis_text else "",
            "notable_actions": analysis_text.split("4.")[1].split("5.")[0].strip() if "4." in analysis_text and "5." in analysis_text else "",
            "technical_observations": analysis_text.split("5.")[1].strip() if "5." in analysis_text else "",
            "raw_analysis": analysis_text
        }
        
        logger.info("Completed Gemini analysis")
        return structured_analysis
        
    except Exception as e:
        logger.error(f"Error in Gemini analysis: {str(e)}")
        raise
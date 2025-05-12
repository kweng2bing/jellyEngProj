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
    return Image.fromarray(frame)

def analyze_video_with_gemini(frames):
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        frames_to_process = frames[:6]  # Process up to 6 frames
        pil_images = [frame_to_pil_image(frame) for frame in frames_to_process]
        
        # Prepare prompt
        prompt = """
        Analyze these video frames and provide:
        1. A detailed summary of what's happening in the video
        2. Key objects and their interactions
        3. Scene setting and environment details
        4. Any notable actions or events
        5. Guess the topic of the video
        6. Suggest a possible viral tweet or caption for the video
        7. Technical observations about camera angles, lighting, etc.
        """
        
        # Generate analysis
        try:
            response = model.generate_content([prompt, *pil_images])
            analysis_text = response.text
            
            # Parse the response into sections
            detailed_analysis = {
                "summary": analysis_text.split("1.")[1].split("2.")[0].strip() if "1." in analysis_text and "2." in analysis_text else "",
                "key_objects": analysis_text.split("2.")[1].split("3.")[0].strip() if "2." in analysis_text and "3." in analysis_text else "",
                "scene_details": analysis_text.split("3.")[1].split("4.")[0].strip() if "3." in analysis_text and "4." in analysis_text else "",
                "notable_actions": analysis_text.split("4.")[1].split("5.")[0].strip() if "4." in analysis_text and "5." in analysis_text else "",
                "topic_converstation": analysis_text.split("5.")[1].split("6.")[0].strip() if "5." in analysis_text and "6." in analysis_text else "",
                "viral_tweet_caption": analysis_text.split("6.")[1].split("7.")[0].strip() if "6." in analysis_text and "7." in analysis_text else "",
                "technical_observations": analysis_text.split("7.")[1].strip() if "7." in analysis_text else "",
                "raw_analysis": analysis_text
            }
            logger.info("Completed Gemini analysis")
            
        except Exception as e:
            logger.warning(f"Error with Gemini API call: {str(e)}. Using fallback analysis.")            
        return detailed_analysis
        
    except Exception as e:
        logger.error(f"Error in Gemini analysis: {str(e)}")
        raise
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not found in environment variables")

# Video processing settings
FRAME_INTERVAL = 5  # Extract a frame every 5 seconds
MAX_FRAMES = 10     # Maximum number of frames to analyze
VIDEO_DOWNLOAD_DIR = "temp_videos"
FRAME_OUTPUT_DIR = "temp_frames"
AUDIO_OUTPUT_DIR = "temp_audio"

# Create temp directories if they don't exist
for directory in [VIDEO_DOWNLOAD_DIR, FRAME_OUTPUT_DIR, AUDIO_OUTPUT_DIR]:
    os.makedirs(directory, exist_ok=True)
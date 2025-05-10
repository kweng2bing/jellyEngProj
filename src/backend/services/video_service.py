import os
import uuid
import cv2
import requests
import ffmpeg
import logging
from config import VIDEO_DOWNLOAD_DIR, FRAME_OUTPUT_DIR, AUDIO_OUTPUT_DIR, FRAME_INTERVAL, MAX_FRAMES

logger = logging.getLogger(__name__)

def download_video(url):
    """Download video from URL to a temporary file."""
    try:
        # Generate a unique filename
        file_id = str(uuid.uuid4())
        video_path = os.path.join(VIDEO_DOWNLOAD_DIR, f"{file_id}.mp4")
        
        # Stream download to avoid loading entire file into memory
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(video_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
        logger.info(f"Video downloaded to {video_path}")
        return video_path
    
    except Exception as e:
        logger.error(f"Error downloading video: {str(e)}")
        raise

def extract_frames(video_path):
    """Extract frames from video at specified intervals."""
    try:
        frames = []
        cap = cv2.VideoCapture(video_path)
        
        # Video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps
        
        # Calculate frame extraction positions
        interval_sec = FRAME_INTERVAL
        frame_positions = [i for i in range(0, int(duration), interval_sec)]
        
        # Limit the number of frames
        if len(frame_positions) > MAX_FRAMES:
            # Take evenly distributed frames
            step = len(frame_positions) // MAX_FRAMES
            frame_positions = frame_positions[::step][:MAX_FRAMES]
        
        # Extract frames at specified positions
        for pos_sec in frame_positions:
            frame_pos = int(pos_sec * fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos)
            ret, frame = cap.read()
            
            if ret:
                # Convert from BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame_rgb)
                
        cap.release()
        logger.info(f"Extracted {len(frames)} frames from video")
        return frames
        
    except Exception as e:
        logger.error(f"Error extracting frames: {str(e)}")
        raise

def extract_audio(video_path):
    """Extract audio from video file."""
    try:
        # Generate output path
        file_id = os.path.basename(video_path).split('.')[0]
        audio_path = os.path.join(AUDIO_OUTPUT_DIR, f"{file_id}.mp3")
        
        # Extract audio using ffmpeg
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, acodec='libmp3lame', q=4)
            .run(quiet=True, overwrite_output=True)
        )
        
        logger.info(f"Audio extracted to {audio_path}")
        return audio_path
        
    except Exception as e:
        logger.error(f"Error extracting audio: {str(e)}")
        raise
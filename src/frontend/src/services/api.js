/**
 * API service for communicating with the backend
 */
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Send a video URL to the backend for analysis
 * @param {string} videoUrl - The URL of the video to analyze
 * @returns {Promise<Object>} The analysis results
 */
export async function analyzeVideo(videoUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
      } catch (e) {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check the health of the API
 * @returns {Promise<boolean>} True if the API is healthy
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
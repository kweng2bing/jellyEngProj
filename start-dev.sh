#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting JellyJelly Video Analyzer ..."

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed. Please install Python3 and try again."
    exit 1
fi


# Start backend server
echo "Starting backend server..."
python3 src/backend/app.py &
BACKEND_PID=$!

# Start frontend development server
echo "Starting frontend development server..."
npm start &
FRONTEND_PID=$!

# Function to kill the backend and frontend processes on exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID
    rm -r src/backend/temp_audio
    rm -r src/backend/temp_videos
    rm -r src/backend/temp_frames

    exit
}

# Trap SIGINT and SIGTERM signals to cleanup when the script is interrupted
trap cleanup SIGINT SIGTERM

echo "Servers are running! Access the application at http://localhost:5000"
echo "Press Ctrl+C to stop all servers."

# Wait for both processes to exit
wait $BACKEND_PID $FRONTEND_PID

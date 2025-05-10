import React, { useState } from 'react';

function VideoInput({ onSubmit }) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputError, setInputError] = useState('');

  const validateUrl = (url) => {
    if (!url) {
      return 'Please enter a URL';
    }
    
    if (!url.includes('jelly-shareables.s3.amazonaws.com')) {
      return 'Please enter a valid Jelly video URL';
    }
    
    if (!url.endsWith('.mp4')) {
      return 'URL must point to an MP4 video file';
    }
    
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validateUrl(inputUrl);
    if (error) {
      setInputError(error);
      return;
    }
    
    setInputError('');
    onSubmit(inputUrl);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Enter Jelly Video URL</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="video-url"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://jelly-shareables.s3.amazonaws.com/example/example_original.mp4"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
          {inputError && (
            <p className="mt-2 text-sm text-red-600">{inputError}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Analyze Video
          </button>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setInputUrl('https://jelly-shareables.s3.amazonaws.com/863C01CF-B508-49C2-B984-9C8181642C5D/863C01CF-B508-49C2-B984-9C8181642C5D_original.mp4');
            }}
          >
            Use Demo URL
          </button>
        </div>
      </form>
      
      {/* <div className="mt-4 text-sm text-gray-600">
        <p><strong>Example URL format:</strong> https://jelly-shareables.s3.amazonaws.com/[id]/[id]_original.mp4</p>
      </div> */}
    </div>
  );
}

export default VideoInput;
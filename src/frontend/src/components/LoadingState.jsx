import React from 'react';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <h3 className="text-xl font-medium text-gray-700">Analyzing video...</h3>
      <p className="text-gray-500 mt-2 text-center">
        This may take a minute as we process the video through multiple AI models.
      </p>
    </div>
  );
}

export default LoadingState;
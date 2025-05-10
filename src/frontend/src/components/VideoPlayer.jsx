import React, { useRef, useEffect } from 'react'


function VideoPlayer({ url }){
	const videoRef = useRef(null);

	useEffect(() => {
	
		// Resetting video
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.load();

		}
	}, [url]);
return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          autoPlay
          playsInline
          muted // Test
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">Video Preview</h3>
        <p className="text-sm text-gray-500 break-all mt-1">{url}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;

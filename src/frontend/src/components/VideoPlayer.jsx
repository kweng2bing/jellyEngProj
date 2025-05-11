import React, { useRef, useEffect } from 'react';

function VideoPlayer({ url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Pause the video and reload when URL changes.
      videoRef.current.pause();
      videoRef.current.load();
    }
  }, [url]);

  return (
    <div>
      <h2>Video Preview</h2>
      <video
        ref={videoRef}
        width="600"
        controls
        autoPlay
        muted // Optional 
        style={{ display: 'block', marginBottom: '1rem' }}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style={{ wordBreak: 'break-all' }}>URL: {url}</p>
    </div>
  );
}

export default VideoPlayer;

import React, { useState } from 'react';

function VideoInput({ onSubmit }) {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      console.log("Submitting video URL:", inputUrl);
      onSubmit(inputUrl.trim());
    } else {
      alert('Please enter a valid video URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Enter video URL. Example: https://jelly-shareables.s3.amazonaws.com/{id}/{id}_original.mp4"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load Video
        </button>
      </div>
      {/* <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}> */}
        {/* Example: https://jelly-shareables.s3.amazonaws.com/_original.mp4 */}
      {/* </div> */}
    </form>
  );
}

export default VideoInput;

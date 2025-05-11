
// import React, { useState } from 'react';
// import VideoInput from './components/VideoInput';
// import VideoPlayer from './components/VideoPlayer';
// import AnalysisResults from './components/AnalysisResults';

// function App() {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [analysisResults, setAnalysisResults] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Function to handle loading the video URL from the input.
//   const handleLoadVideo = (url) => {
//     setVideoUrl(url);
//     setAnalysisResults(null); // Clear any previous analysis when a new video is loaded.
//     setError(null); // Clear any previous error
//   };

//   // Function to handle analyzing the video with Gemini.
//   // This function calls the backend API and updates the analysis results state.
//   const handleAnalyze = async () => {
//     if (!videoUrl) {
//       alert('Please load a video first!');
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisResults(null);
//     setError(null); 
    
//     try {
//       const response = await fetch('http://localhost:5000/api/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ url: videoUrl })
//       });
//       if (!response.ok) {
//         throw new Error(`Server Responded with status: ${response.status}`);
//       }
//       const data = await response.json();
//       setAnalysisResults(data);
//     } catch (error) {
//       console.error('Error analyzing video:', error);
//       setAnalysisResults({ error: 'Error analyzing video' });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Jelly Video Loader and Analyzer</h1>
      
//       {/* VideoInput calls handleLoadVideo to load the video URL */}
//       <VideoInput onSubmit={handleLoadVideo} />
      
//       {videoUrl && <VideoPlayer url={videoUrl} />}
      
//       {videoUrl && (
//         <button
//         onClick={handleAnalyze}
//           disabled={isAnalyzing}
//           style={{
//             padding: '0.5rem 1rem',
//             margin: '1rem 0',
//             backgroundColor: '#4F46E5',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: isAnalyzing ? 'not-allowed' : 'pointer'
//           }}
//           >
//           {isAnalyzing ? 'Analyzing...' : 'Analyze Video with Gemini'}
//         </button>
//       )}

//       {/* Render AnalysisResults if analysisResults exists */}
//       {analysisResults && <AnalysisResults results={analysisResults} />}
//     </div>
//   );
// }
// export default App;

// src/App.jsx
import React, { useState } from 'react';
import VideoInput from './components/VideoInput';
import VideoPlayer from './components/VideoPlayer';
import AnalysisResults from './components/AnalysisResults';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Function to handle loading the video URL from the input.
  const handleLoadVideo = (url) => {
    console.log("Loading video URL:", url);
    setVideoUrl(url);
    setAnalysisResults(null);
    setError(null);
    setDebugInfo(null);
  };

  // Function to handle analyzing the video with Gemini.
  const handleAnalyze = async () => {
    if (!videoUrl) {
      alert('Please load a video first!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);
    setError(null);
    setDebugInfo("Starting analysis...");
    
    // For debugging - log the request we're about to make
    const requestData = { video_url: videoUrl };
    console.log("Sending request to API:", requestData);
    setDebugInfo(prev => prev + "\nSending request with: " + JSON.stringify(requestData));
    
    try {
      // Using fetch with more detailed error handling
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      setDebugInfo(prev => prev + `\nReceived response with status: ${response.status}`);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Received analysis data:", data);
      setDebugInfo(prev => prev + `\nParsed JSON data: ${JSON.stringify(data).substring(0, 200)}...`);
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Received empty response from server");
      }
      
      setAnalysisResults(data);
    } catch (error) {
      console.error('Error analyzing video:', error);
      setError(`Error analyzing video: ${error.message}`);
      setDebugInfo(prev => prev + `\nERROR: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Jelly Video Loader and Analyzer</h1>
      
      <VideoInput onSubmit={handleLoadVideo} />
      
      {videoUrl && <VideoPlayer url={videoUrl} />}
      
      {videoUrl && (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          style={{
            padding: '0.5rem 1rem',
            margin: '1rem 0',
            backgroundColor: '#4F46E5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer'
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Video with Multi-AI Models'}
        </button>
      )}

      {error && (
        <div style={{ color: 'red', margin: '1rem 0', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
{/* 
      {debugInfo && (
        <div style={{ 
          margin: '1rem 0',
          padding: '1rem',
          background: '#f0f0f0', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong>
          <pre>{debugInfo}</pre>
        </div>
      )} */}

      {analysisResults && <AnalysisResults results={analysisResults} />}
    </div>
  );
}

export default App;



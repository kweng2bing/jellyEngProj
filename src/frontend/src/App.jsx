import React, { useState } from 'react';
import VideoInput from './components/VideoInput';
import VideoPlayer from './components/VideoPlayer';
import AnalysisResults from './components/AnalysisResults';
import LoadingState from './components/LoadingState';
import ErrorDisplay from './components/ErrorDisplay';
import { analyzeVideo } from './services/api';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (url) => {
    try {
      setVideoUrl(url);
      setLoading(true);
      setError(null);
      
      const results = await analyzeVideo(url);
      setAnalysisResults(results);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white">JellyJelly Video Analyzer</h1>
          <p className="text-white text-opacity-80 mt-2">
            Analyze Jelly videos with multimodal AI
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VideoInput onSubmit={handleAnalyze} />
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : (
          videoUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <VideoPlayer url={videoUrl} />
              </div>
              <div className="lg:col-span-7">
                {/* {analysisResults && <AnalysisResults results={analysisResults} />} */}
              </div>
            </div>
          )
        )}
      </main>

      <footer className="bg-slate-800 text-white py-4 px-4 mt-12">
        <div className="container mx-auto text-center">
          <p>JellyJelly Video Analyzer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
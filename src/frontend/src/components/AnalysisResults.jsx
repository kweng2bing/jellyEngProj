import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function parseBoldText(text) {
  // Replace **text** with <strong>text</strong> and add line breaks. 
  // (This is a naive implementation, for more advanced parsing consider a dedicated markdown parser.)
   return text
    // Convert **bold text** to <strong>bold text</strong>
    .replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<strong>${boldText}</strong>`)
    // Convert single * into a new line
    .replace(/\*/g, '<br/>')
    // Remove any remaining "**" at the end of the string
    .replace(/\*\*/g, '');
}

function AnalysisResults({ results }) {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Check what tabs we should show based on available data
  const availableTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'gemini', label: 'Gemini Analysis' }
  ];
  
  // Add optional tabs if data is available
  if (results.detailed_analysis?.captions) {
    availableTabs.push({ id: 'captions', label: 'Frame Captions' });
  }
  
  if (results.detailed_analysis?.transcription) {
    availableTabs.push({ id: 'transcription', label: 'Transcription' });
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                margin: '0.5rem',
                backgroundColor: '#3B82F6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Video Overview</h3>
            <p className="text-gray-700">{results.summary || "No summary available"}</p>
          </div>
        )}

        {activeTab === 'gemini' && results.detailed_analysis?.gemini && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Gemini Analysis</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Summary</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.summary || "No summary available") }}
              />
              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.summary || "No summary available"}
              </p> */}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Key Objects</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.key_objects || "No key objects identified") }}
              />              
              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.key_objects || "No key objects identified"}
              </p> */}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Scene Details</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.scene_details|| "No scene details available") }}
              />
              
              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.scene_details || "No scene details available"}
              </p> */}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Notable Actions</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.notable_actions || "No notable actions identified") }}
              />
              
              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.notable_actions || "No notable actions identified"}
              </p> */}
            </div>


            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Converstation Topic</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.converstation_topic || "No notable actions identified") }}
              />

              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.converstation_topic || "No notable actions identified"}
              </p> */}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2"> Viral Tweet Caption</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.viral_tweet_caption || "No notable actions identified") }}
              />
              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.viral_tweet_caption || "No notable actions identified"}
              </p> */}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Technical Observations</h4>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseBoldText(results.detailed_analysis.gemini.technical_observations || "No technical observations available") }}
              />

              {/* <p className="text-gray-700 whitespace-pre-line">
                {results.detailed_analysis.gemini.technical_observations || "No technical observations available"}
              </p> */}
            </div>
          </div>
        )}

        {activeTab === 'captions' && results.detailed_analysis?.captions && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Frame Captions</h3>
            {/* Render captions here if available */}
          </div>
        )}

        {activeTab === 'transcription' && results.detailed_analysis?.transcription && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Transcription</h3>
            {/* Render transcription here if available */}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisResults;
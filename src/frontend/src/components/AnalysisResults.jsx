import React, { useState } from 'react';

function AnalysisResults({ results }) {
  const [activeTab, setActiveTab] = useState('summary');
  
  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'gpt4o', label: 'GPT-4o Analysis' },
    { id: 'gemini', label: 'Gemini Analysis' },
    { id: 'captions', label: 'Frame Captions' },
    { id: 'transcription', label: 'Transcription' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Video Summary</h3>
            <p className="text-gray-700">{results.summary || "No summary available"}</p>
          </div>
        )}

        {activeTab === 'gpt4o' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">GPT-4o Analysis</h3>
            
            {results.detailed_analysis.gpt4o && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Frame Descriptions</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gpt4o.frame_descriptions}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Key Elements</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gpt4o.key_elements}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Sentiment Analysis</h4>
                  <p className="text-gray-700">{results.detailed_analysis.gpt4o.sentiment}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Caption Suggestions</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gpt4o.caption_suggestions}</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'gemini' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Gemini Analysis</h3>
            
            {results.detailed_analysis.gemini && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Scene Summary</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gemini.summary}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Key Objects</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gemini.key_objects}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Scene Details</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gemini.scene_details}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Notable Actions</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gemini.notable_actions}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Technical Observations</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.gemini.technical_observations}</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'captions' && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Frame Captions</h3>
            
            {results.detailed_analysis.frame_captions && results.detailed_analysis.frame_captions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.detailed_analysis.frame_captions.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Frame {item.frame_number}</h4>
                    <p className="text-gray-700">{item.caption}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No frame captions available</p>
            )}
          </div>
        )}

        {activeTab === 'transcription' && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Audio Transcription</h3>
            
            {results.detailed_analysis.transcription && results.detailed_analysis.transcription.text ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{results.detailed_analysis.transcription.text}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No transcription available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisResults
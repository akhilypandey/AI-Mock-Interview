import React from 'react';
import { FileSpreadsheet, Brain, Mic, VolumeX } from 'lucide-react';

const WelcomeScreen = ({ 
  candidateName, 
  setCandidateName, 
  startInterview, 
  speechSupported 
}) => {
  if (!speechSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <VolumeX className="mx-auto h-16 w-16 text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Voice Required</h1>
          <p className="text-gray-600 mb-4">
            This voice-only interview requires speech recognition. Please use:
          </p>
          <ul className="text-sm text-gray-500 mb-6 space-y-1">
            <li>• Google Chrome (recommended)</li>
            <li>• Microsoft Edge</li>
            <li>• Safari (macOS/iOS)</li>
          </ul>
          <p className="text-xs text-gray-400">
            Make sure your microphone is enabled and working.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="relative">
            <FileSpreadsheet className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <Mic className="absolute -top-2 -right-2 h-8 w-8 text-blue-600 bg-white rounded-full p-1 shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Voice-Only Excel Interview</h1>
          <p className="text-gray-600">Speak naturally with our AI interviewer</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              onKeyDown={(e) => e.key === 'Enter' && startInterview()}
            />
          </div>
          
          <button
            onClick={startInterview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
          >
            <Brain className="h-5 w-5" />
            Start Voice Interview
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-900 mb-2">🎤 Voice Features:</h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Speak your answers naturally</li>
            <li>• Interrupt AI anytime by talking</li>
            <li>• No typing required</li>
            <li>• AI speaks all questions</li>
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Duration: 15-20 minutes | Fully conversational</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;


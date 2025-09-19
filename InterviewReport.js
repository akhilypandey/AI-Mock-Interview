import React from 'react';
import { BarChart3, CheckCircle, XCircle, Clock, User, Mic } from 'lucide-react';
import { calculateOverallScore } from '../utils/evaluationEngine';

const InterviewReport = ({ candidateName, answers, timeStarted, onRestart }) => {
  const timeElapsed = timeStarted ? Math.round((new Date() - timeStarted) / 1000 / 60) : 0;
  const overallScore = calculateOverallScore(answers);
  
  const skillAreas = answers.reduce((acc, answer) => {
    if (!acc[answer.category]) acc[answer.category] = { correct: 0, total: 0 };
    acc[answer.category].total++;
    if (answer.isCorrect) acc[answer.category].correct++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <BarChart3 className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Interview Complete!</h1>
            <p className="text-gray-600">Assessment Results for {candidateName}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-900">{timeElapsed} min</div>
              <div className="text-sm text-blue-700">Interview Duration</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-900">{overallScore.percentage}%</div>
              <div className="text-sm text-green-700">Overall Score</div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <User className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <div className={`text-2xl font-bold ${overallScore.color}`}>{overallScore.rating}</div>
              <div className="text-sm text-purple-700">Performance Level</div>
            </div>
          </div>
          
          {Object.keys(skillAreas).length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Skill Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(skillAreas).map(([category, data]) => {
                  const percentage = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Voice Response Analysis</h3>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    {answer.isCorrect ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> : 
                      <XCircle className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{answer.question}</p>
                  <div className="flex items-start gap-2 mb-2">
                    <Mic className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><strong>Your voice response:</strong> "{answer.userAnswer}"</p>
                  </div>
                  <p className="text-sm text-blue-600">
                    <strong>Confidence:</strong> {Math.round(answer.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
            >
              Take Another Voice Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;


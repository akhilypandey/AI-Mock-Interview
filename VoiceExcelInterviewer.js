import React, { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, Brain, Mic, MicOff, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import InterviewReport from './InterviewReport';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { AI_RESPONSES, SKILL_LEVELS } from '../utils/interviewData';
import { evaluateAnswer } from '../utils/evaluationEngine';

const VoiceExcelInterviewer = () => {
  const [started, setStarted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [skillLevel, setSkillLevel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [timeStarted, setTimeStarted] = useState(null);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const { isListening, transcript, interimTranscript, isSupported: recognitionSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isSpeaking, isSupported: synthesisSupported, speak, stop } = useSpeechSynthesis();

  const combinedSpeechSupported = recognitionSupported && synthesisSupported;
  const lastSpokenRef = useRef('');

  const allQuestions = skillLevel ? AI_RESPONSES.questions[skillLevel] : [];
  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < allQuestions.length ? allQuestions[currentQuestionIndex] : null;

  useEffect(() => {
    if (!started || !combinedSpeechSupported) return;
    if (skillLevel === null) return;
    if (currentQuestionIndex === -1 && !aiSpeaking && !isSpeaking) {
      askNextQuestion();
    }
  }, [started, combinedSpeechSupported, skillLevel, currentQuestionIndex, aiSpeaking, isSpeaking]);

  useEffect(() => {
    if (!transcript) return;
    handleUserSpeech(transcript);
  }, [transcript]);

  const startInterview = () => {
    if (!candidateName.trim()) return;
    setStarted(true);
    setTimeStarted(new Date());
    speak(AI_RESPONSES.intro, { onStart: () => setAiSpeaking(true), onEnd: () => {
      setAiSpeaking(false);
      speak(AI_RESPONSES.skillCheck, { onStart: () => setAiSpeaking(true), onEnd: () => {
        setAiSpeaking(false);
        startListening(true);
      }});
    }});
  };

  const handleUserSpeech = (text) => {
    const lower = text.toLowerCase();
    resetTranscript();

    if (aiSpeaking || isSpeaking) {
      stop();
      setAiSpeaking(false);
    }

    if (skillLevel === null) {
      const num = parseInt(lower.match(/\d+/)?.[0], 10);
      const bounded = Math.min(10, Math.max(1, isNaN(num) ? 5 : num));
      const derived = SKILL_LEVELS[bounded];
      setSkillLevel(derived);
      speak(`Great, I'll tailor questions to ${derived} level. Let's begin.`, { onStart: () => setAiSpeaking(true), onEnd: () => {
        setAiSpeaking(false);
        setCurrentQuestionIndex(0);
      }});
      return;
    }

    if (!currentQuestion) return;

    const evaluation = evaluateAnswer(text, currentQuestion.expectedAnswer, currentQuestion);
    setAnswers(prev => ([
      ...prev,
      {
        question: currentQuestion.text,
        userAnswer: text,
        isCorrect: evaluation.isCorrect,
        confidence: evaluation.confidence,
        feedback: evaluation.feedback,
        category: currentQuestion.category
      }
    ]));

    speak(evaluation.feedback, { onStart: () => setAiSpeaking(true), onEnd: () => {
      setAiSpeaking(false);
      askNextQuestion();
    }});
  };

  const askNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (!skillLevel) return;
    const questions = AI_RESPONSES.questions[skillLevel];
    if (nextIndex >= questions.length) {
      stopListening();
      speak(`Thanks ${candidateName}. That concludes the interview. Generating your report now.`, { onStart: () => setAiSpeaking(true), onEnd: () => setAiSpeaking(false) });
      setCurrentQuestionIndex(nextIndex);
      return;
    }
    setCurrentQuestionIndex(nextIndex);
    const q = questions[nextIndex];
    const toSpeak = q.text;
    lastSpokenRef.current = toSpeak;
    speak(toSpeak, { onStart: () => {
      setAiSpeaking(true);
      stopListening();
    }, onEnd: () => {
      setAiSpeaking(false);
      startListening(true);
    }});
  };

  const restart = () => {
    stop();
    stopListening();
    setStarted(false);
    setCandidateName('');
    setSkillLevel(null);
    setCurrentQuestionIndex(-1);
    setAnswers([]);
    setTimeStarted(null);
    setAiSpeaking(false);
  };

  if (!started) {
    return (
      <WelcomeScreen 
        candidateName={candidateName}
        setCandidateName={setCandidateName}
        startInterview={startInterview}
        speechSupported={combinedSpeechSupported}
      />
    );
  }

  if (skillLevel && currentQuestionIndex >= (AI_RESPONSES.questions[skillLevel]?.length || 0)) {
    return (
      <InterviewReport 
        candidateName={candidateName}
        answers={answers}
        timeStarted={timeStarted}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Excel Interviewer</h1>
                <p className="text-xs text-gray-500">Candidate: {candidateName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isListening ? <Mic className="h-5 w-5 text-blue-600 listening-indicator" /> : <MicOff className="h-5 w-5 text-gray-400" />}
              {aiSpeaking || isSpeaking ? <Volume2 className="h-5 w-5 text-green-600 speaking-indicator" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                {skillLevel === null ? 'Tell me your skill level from 1 to 10.' : currentQuestion ? currentQuestion.text : 'Preparing next question...'}
              </p>
            </div>

            {(interimTranscript || transcript) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600"><strong>Your voice:</strong> {interimTranscript || transcript}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isListening ? (
                <button onClick={() => startListening(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md flex items-center gap-2">
                  <Mic className="h-4 w-4" /> Start Listening
                </button>
              ) : (
                <button onClick={stopListening} className="bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm py-2 px-3 rounded-md flex items-center gap-2">
                  <MicOff className="h-4 w-4" /> Stop Listening
                </button>
              )}
              {aiSpeaking || isSpeaking ? (
                <button onClick={stop} className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md flex items-center gap-2">
                  <Pause className="h-4 w-4" /> Stop AI
                </button>
              ) : (
                <button onClick={() => currentQuestion && speak(currentQuestion.text)} className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md flex items-center gap-2">
                  <Play className="h-4 w-4" /> Repeat Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceExcelInterviewer;


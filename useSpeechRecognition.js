import { useState, useRef, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const continuousRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }
        
        setInterimTranscript(interimText);
        
        if (finalText) {
          setTranscript(finalText);
          setInterimTranscript('');
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (continuousRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Failed to restart recognition:', e);
            }
          }, 100);
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = (continuous = false) => {
    if (!isSupported || !recognitionRef.current) return;
    
    continuousRef.current = continuous;
    setTranscript('');
    setInterimTranscript('');
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    continuousRef.current = false;
    recognitionRef.current.stop();
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript: () => {
      setTranscript('');
      setInterimTranscript('');
    }
  };
};
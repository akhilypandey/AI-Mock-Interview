import { useState, useRef, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice options
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    
    // Select best voice
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    const preferredVoice = englishVoices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Alex') ||
      voice.name.includes('Samantha') ||
      voice.default
    ) || englishVoices[0] || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (options.onStart) options.onStart();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      if (options.onEnd) options.onEnd();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      utteranceRef.current = null;
      if (options.onError) options.onError(event);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  return {
    isSpeaking,
    isSupported,
    voices,
    speak,
    stop
  };
};
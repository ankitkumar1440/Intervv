import { useRef, useState, useCallback, useEffect } from 'react';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onLive, onFinal) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const srRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  const isSupported = Boolean(SR);

  useEffect(() => {
    if (!isSupported) return;

    const sr = new SR();

    sr.continuous = true;      // 👈 keep listening
    sr.interimResults = true;
    sr.lang = 'en-US';

    sr.onstart = () => {
      setIsListening(true);
      setError(null);
      finalTranscriptRef.current = '';
    };

    sr.onresult = (event) => {
      let liveText = '';

      // Reset silence timer on every speech detection
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        sr.stop();  // 👈 stop after 2 seconds silence
      }, 2000);

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript;
        } else {
          liveText += transcript;
        }
      }

      if (liveText) {
        onLive(liveText);
      }
    };

    sr.onend = () => {
      setIsListening(false);

      if (finalTranscriptRef.current) {
        onFinal(finalTranscriptRef.current);
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    sr.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setError(event.error);
      }
      setIsListening(false);
    };

    srRef.current = sr;

  }, [isSupported]);

  const startListening = useCallback(() => {
    srRef.current?.start();
  }, []);

  const stopListening = useCallback(() => {
    srRef.current?.stop();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    clearError
  };
};
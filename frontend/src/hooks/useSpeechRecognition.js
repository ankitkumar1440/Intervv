import { useRef, useState, useCallback, useEffect } from 'react';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onLive, onFinal) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const srRef = useRef(null);
  const silenceTimerRef = useRef(null);
  // Stores only the portion of speech already marked as "final" by the browser
  const committedRef = useRef('');

  const isSupported = Boolean(SR);

  useEffect(() => {
    if (!isSupported) return;

    const sr = new SR();

    // continuous=true: browser keeps the session alive; we stop it via silence timer
    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = 'en-US';

    sr.onstart = () => {
      setIsListening(true);
      setError(null);
      committedRef.current = '';
    };

    sr.onresult = (event) => {
      // Reset the silence timer on every new speech chunk
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => sr.stop(), 500);

      // Rebuild the committed portion from scratch using ALL final results so far
      // (avoids double-appending on repeated events for the same result index)
      let committed = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          committed += transcript;
        } else {
          interim += transcript;
        }
      }

      committedRef.current = committed;
      onLive(committed + interim);
    };

    sr.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      if (committedRef.current) {
        onFinal(committedRef.current);
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
    committedRef.current = '';
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
    clearError,
  };
};
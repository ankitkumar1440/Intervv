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

    sr.continuous = false;      // 👈 keep listening
    sr.interimResults = true;
    sr.lang = 'en-US';

    sr.onstart = () => {
      setIsListening(true);
      setError(null);
      finalTranscriptRef.current = '';
    };

    sr.onresult = (event) => {
  if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

  silenceTimerRef.current = setTimeout(() => sr.stop(), 2000);

  let interimText = '';

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscriptRef.current += transcript;
    } else {
      interimText += transcript;
    }
  }

  const display = finalTranscriptRef.current + interimText;
  onLive(display);
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
  finalTranscriptRef.current = '';
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
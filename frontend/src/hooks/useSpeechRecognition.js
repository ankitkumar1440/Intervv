import { useRef, useState, useCallback, useEffect } from 'react';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onLive, onFinal) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError]             = useState(null);
  const isSupported                   = Boolean(SR);

  // Always-current callback refs — never go stale inside event handlers
  const onLiveRef  = useRef(onLive);
  const onFinalRef = useRef(onFinal);
  useEffect(() => { onLiveRef.current  = onLive;  }, [onLive]);
  useEffect(() => { onFinalRef.current = onFinal; }, [onFinal]);

  const srRef            = useRef(null);
  const silenceTimerRef  = useRef(null);
  const committedRef     = useRef('');   // finalized speech text
  const lastInterimRef   = useRef('');   // fallback if nothing is ever 'final'
  const isListeningRef   = useRef(false);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const startListening = useCallback(() => {
    if (!isSupported) return;
    if (isListeningRef.current) return; // already running

    // Create a FRESH instance every time — reusing a stopped instance
    // throws InvalidStateError in Chrome/Safari
    const sr = new SR();
    sr.continuous     = true;
    sr.interimResults = true;
    sr.lang           = 'en-US';

    committedRef.current   = '';
    lastInterimRef.current = '';

    sr.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
    };

    sr.onresult = (event) => {
      // Reset silence timer on every new chunk
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => sr.stop(), 1500);

      // Rebuild from scratch — idempotent, never double-counts
      let committed = '';
      let interim   = '';

      for (let i = 0; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          committed += text;
        } else {
          interim += text;
        }
      }

      committedRef.current   = committed;
      lastInterimRef.current = interim;
      onLiveRef.current(committed + interim);
    };

    sr.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      clearSilenceTimer();
      srRef.current = null;

      // Use committed text; fall back to last interim if browser never
      // returned a final result (happens on some mobile browsers)
      const result = committedRef.current || lastInterimRef.current;
      if (result.trim()) {
        onFinalRef.current(result.trim());
      }
    };

    sr.onerror = (event) => {
      // 'no-speech' and 'aborted' are expected — don't surface as errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Mic error: ${event.error}`);
      }
      isListeningRef.current = false;
      setIsListening(false);
      clearSilenceTimer();
      srRef.current = null;
    };

    srRef.current = sr;
    try {
      sr.start();
    } catch (e) {
      // start() can throw if called before onend fires from a previous session
      setError('Could not start microphone. Try again.');
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    srRef.current?.stop();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isListening, isSupported, error, startListening, stopListening, clearError };
};
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

  const srRef             = useRef(null);
  const silenceTimerRef   = useRef(null);
  const shouldRestartRef  = useRef(false);  // true while user wants to keep listening
  const accumulatedRef    = useRef('');     // text collected across all sessions
  const sessionInterimRef = useRef('');     // interim from the current session only

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Creates and starts one SR session (continuous=false).
  // Restarts itself via onend while shouldRestartRef is true.
  const createSession = useCallback(() => {
    if (!isSupported) return;

    const sr = new SR();
    // continuous=false: one utterance per session.
    // Avoids the Android Chrome bug where continuous=true causes the browser
    // to restart internally, re-firing onresult with already-heard words.
    sr.continuous     = false;
    sr.interimResults = true;
    sr.lang           = 'en-US';

    // Per-session final text
    let sessionFinal = '';

    sr.onresult = (event) => {
      // Reset silence timer — if user pauses >1500ms we stop completely
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        shouldRestartRef.current = false;
        sr.stop();
      }, 1500);

      // Rebuild only from THIS session's results (no cross-session accumulation)
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

      sessionFinal = committed;
      sessionInterimRef.current = interim;

      // Show: everything confirmed so far + this session's text
      onLiveRef.current(accumulatedRef.current + committed + interim);
    };

    sr.onend = () => {
      clearSilenceTimer();

      // Add this session's confirmed text to the running total
      const sessionText = sessionFinal || sessionInterimRef.current;
      if (sessionText.trim()) {
        accumulatedRef.current += sessionText + ' ';
      }
      sessionInterimRef.current = '';

      if (shouldRestartRef.current) {
        // User is still listening — start a fresh session immediately
        try {
          createSession();
        } catch (_) {
          shouldRestartRef.current = false;
          setIsListening(false);
          const result = accumulatedRef.current.trim();
          if (result) onFinalRef.current(result);
        }
      } else {
        // Done — fire the final callback with everything accumulated
        setIsListening(false);
        srRef.current = null;
        const result = accumulatedRef.current.trim();
        accumulatedRef.current = '';
        if (result) onFinalRef.current(result);
      }
    };

    sr.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Mic error: ${event.error}`);
        shouldRestartRef.current = false;
        setIsListening(false);
        accumulatedRef.current = '';
      }
      // On no-speech, just let onend restart the session naturally
    };

    srRef.current = sr;
    try {
      sr.start();
    } catch (e) {
      setError('Could not start microphone. Try again.');
      shouldRestartRef.current = false;
      setIsListening(false);
    }
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    if (shouldRestartRef.current) return; // already running

    accumulatedRef.current    = '';
    sessionInterimRef.current = '';
    shouldRestartRef.current  = true;
    setIsListening(true);
    setError(null);
    createSession();
  }, [isSupported, createSession]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    clearSilenceTimer();
    srRef.current?.stop();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isListening, isSupported, error, startListening, stopListening, clearError };
};
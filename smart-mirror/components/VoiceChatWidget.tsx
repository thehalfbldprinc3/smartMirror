'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistantWidget() {
  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [botReply, setBotReply] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const botReplyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Sorry, your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognitionClass() as ISpeechRecognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      callGeminiAPI(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // TTS for bot reply
  useEffect(() => {
    if (!botReply) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(botReply);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [botReply]);

  const handleListenClick = () => {
    if (!recognitionRef.current) return;
    setUserText('');
    setBotReply('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  async function callGeminiAPI(userPrompt: string) {
    try {
      setBotReply('Thinking...');
      const promptWithInstruction = `Please answer briefly in 30 token or less: ${userPrompt}`;

      if (botReplyTimerRef.current) clearTimeout(botReplyTimerRef.current);

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptWithInstruction }),
      });

      const data = await res.json();
      setBotReply(data.reply);

      botReplyTimerRef.current = setTimeout(() => {
        setBotReply('');
        setUserText('');
      }, 8000);
    } catch (error) {
      console.error('Gemini API error:', error);
      setBotReply('Sorry, I had an issue processing that.');

      botReplyTimerRef.current = setTimeout(() => {
        setBotReply('');
        setUserText('');
      }, 8000);
    }
  }

  return (
  <motion.div
    layout
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="fixed bottom-6 right-6 z-50 inline-flex flex-col items-center gap-3
      bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl
      shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"
  >
    <AnimatePresence>
      {userText && (
        <motion.div
          key="user"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="glass-bubble self-end"
        >
          <p className="text-[10px] font-semibold text-white/70 mb-1">You</p>
          <p className="text-sm font-medium text-white">{userText}</p>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {botReply && (
        <motion.div
          key="bot"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
          className="glass-bubble self-start"
        >
          <p className="text-[10px] font-semibold text-white/70 mb-1">Assistant</p>
          <p className="text-sm font-medium text-white">{botReply}</p>
        </motion.div>
      )}
    </AnimatePresence>

    <button
      onClick={handleListenClick}
      aria-label="Activate Voice Assistant"
      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out
        ${
          isListening
            ? 'bg-white/25 border-white/60 text-white shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] animate-pulse'
            : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50'
        }`}
    >
      <FontAwesomeIcon icon={faMicrophone} className="h-6 w-6" />
    </button>

    {isListening && (
      <p className="text-[11px] text-white/60 animate-pulse mt-1 select-none">Listening...</p>
    )}
  </motion.div>
);
}
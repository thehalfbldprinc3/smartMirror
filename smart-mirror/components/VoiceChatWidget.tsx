'use client';

import { useState, useEffect, useRef } from 'react';

export default function VoiceAssistantWidget() {
  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [botReply, setBotReply] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const botReplyTimerRef = useRef<NodeJS.Timeout | null>(null); // New timer ref

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
      console.log('User said:', transcript);
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
      // Clear any existing timer
      if (botReplyTimerRef.current) {
        clearTimeout(botReplyTimerRef.current);
      }

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptWithInstruction }),
      });

      const data = await res.json();
      setBotReply(data.reply);

      // Set timer to auto-hide reply after 8 seconds
      botReplyTimerRef.current = setTimeout(() => {
        setBotReply('');
        setUserText('');
      }, 8000);
    } catch (error) {
      console.error('Gemini API error:', error);
      setBotReply('Sorry, I had an issue processing that.');

      // Hide error after 8 seconds too
      botReplyTimerRef.current = setTimeout(() => {
        setBotReply('');
        setUserText('');
      }, 8000);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center space-y-4 z-50">

      {/* User Message */}
      {userText && (
        <div className="bg-white text-black p-4 rounded-xl max-w-xs text-center shadow-md animate-fadeIn">
          <p className="font-medium">You:</p>
          <p className="text-sm">{userText}</p>
        </div>
      )}

      {/* Bot Reply */}
      {botReply && (
        <div className="bg-white text-black p-4 rounded-xl max-w-xs text-center shadow-md animate-fadeIn">
          <p className="font-medium">Bot:</p>
          <p className="text-sm">{botReply}</p>
        </div>
      )}

      {/* Mic Button */}
      <button
        onClick={handleListenClick}
        className={`w-20 h-20 rounded-full flex items-center justify-center ${
          isListening ? 'bg-gray-500 animate-pulse' : 'bg-gray-300 hover:bg-gray-400'
        } shadow-md transition-all duration-300`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1v10m0 0a4 4 0 004-4V5a4 4 0 00-8 0v2a4 4 4 004 4zm0 0v4m-6 4h12"
          />
        </svg>
      </button>

      {/* Listening Text */}
      {isListening && (
        <p className="text-gray-500 animate-pulse">Listening...</p>
      )}
    </div>
  );
}
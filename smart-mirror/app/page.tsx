'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import NewsWidget from '@/components/NewsWidget';
import CalendarWidget from '@/components/CalendarWidget';
import VoiceAssistantWidget from '@/components/VoiceChatWidget';

export default function Page() {
  const ownerName = process.env.NEXT_PUBLIC_MIRROR_OWNER_NAME || 'Friend';

  const [showGreeting, setShowGreeting] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const hideTimer = setTimeout(() => setShowGreeting(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${ownerName}!`;
    if (hour < 18) return `Good Afternoon, ${ownerName}!`;
    return `Good Evening, ${ownerName}!`;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative bg-black text-white">
      {showGreeting && (
        <div
          className={`absolute inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className="text-white text-4xl font-semibold">{getGreeting()}</h1>
        </div>
      )}

      <Header />

      {/* Main Layout */}
      <div className="flex-grow relative p-6 box-border overflow-hidden">
        {/* Calendar - Left Center */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <CalendarWidget />
        </div>

        {/* Weather - Top Right */}
        <div className="absolute top-8 right-8">
          <WeatherWidget />
        </div>

        {/* News - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <NewsWidget />
        </div>
        <VoiceAssistantWidget/>
      </div>
    </div>
  );
}
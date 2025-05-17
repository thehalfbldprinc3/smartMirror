'use client';

import { useEffect, useState } from 'react';

const FormalFunkClock = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glass-text-clock"
      aria-label="Current time"
      role="timer"
    >
      {time}
      <style jsx>{`
        .glass-text-clock {
          font-family: 'SF Pro Display', 'JetBrains Mono', 'Futura PT', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-align: center;
          user-select: none;
          color: transparent;
          background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(180, 200, 255, 0.3) 30%,
            rgba(255, 255, 255, 0.9) 70%,
            rgba(150, 180, 255, 0.2) 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          text-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.4),
            0 0 8px rgba(255, 255, 255, 0.2);
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          animation: shimmer 6s infinite linear;
          min-width: 250px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default FormalFunkClock;
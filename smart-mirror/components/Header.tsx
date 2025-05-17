'use client';

import { useEffect, useState } from 'react';
import SignInButtons from '@/components/signInButtons'
import SessionWrapper from '@/app/sessionWrapper';

const Header = () => {
  const [time, setTime] = useState<string>('');
  const ownerName = process.env.NEXT_PUBLIC_MIRROR_OWNER_NAME || 'Friend'; // Fallback if undefined

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="flex justify-between items-center p-6 bg-primary text-white shadow-lg rounded-xl">
      <div>
        <h1 className="text-xl font-semibold">{greeting()},<br></br> {ownerName}!</h1>
      </div>
      <div className="text-2xl font-bold">{time}</div>
      <SessionWrapper>
        <SignInButtons/>
      </SessionWrapper>
    </header>
  );
};

export default Header;
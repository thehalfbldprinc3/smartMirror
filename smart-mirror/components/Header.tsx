'use client';
import SignInButtons from '@/components/signInButtons';
import SessionWrapper from '@/app/sessionWrapper';
import FormalFunkClock from '@/components/ClockWidget';

const Header = () => {

  return (
    <header className="flex justify-between items-center p-6 bg-primary text-white shadow-lg rounded-xl">
      <FormalFunkClock></FormalFunkClock>
      <SessionWrapper>
        <div className="flex items-center gap-4">
          <SignInButtons />
        </div>
      </SessionWrapper>
    </header>
  );
};

export default Header;
'use client';
import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <p className="mb-4 text-center text-lg text-yellow-400 opacity-80">
        Checking auth status...
      </p>
    );
  }

  return (
    <div className="mb-4 flex flex-col items-center space-y-4">
      {session ? (
        <div className="flex items-center space-x-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User's Google profile photo"
              width={48}
              height={48}
              className="rounded-full shadow-md"
              priority
            />
          )}
          <button
            onClick={() => signOut().catch(err => console.error('Sign out failed:', err))}
            className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-base shadow-md hover:bg-white/20 transition focus:outline-none"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google").catch(err => console.error('Sign in failed:', err))}
          className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg shadow-md hover:bg-white/20 transition focus:outline-none"
          aria-label="Sign in with Google"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
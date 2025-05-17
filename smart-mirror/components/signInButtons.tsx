'use client';
import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="mb-4 text-center text-lg opacity-80">Checking auth status...</p>;
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
            className="px-4 py-2 rounded-full bg-black bg-opacity-40 text-white text-base shadow-md hover:bg-opacity-60 transition focus:outline-none"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google").catch(err => console.error('Sign in failed:', err))}
          className="px-6 py-3 rounded-full bg-black bg-opacity-40 text-white text-lg shadow-md hover:bg-opacity-60 transition focus:outline-none"
          aria-label="Sign in with Google"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <button
          onClick={() => signIn('credentials', { 
            email: 'test@example.com',
            password: 'demo123',
            callbackUrl: '/'
          })}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Try Demo Account
        </button>
      </div>
    </div>
  );
} 
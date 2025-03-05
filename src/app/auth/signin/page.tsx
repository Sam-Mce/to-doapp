'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn('credentials', { 
        email: 'test@example.com',
        password: 'demo123',
        callbackUrl: '/',
        redirect: true
      });
      
      if (!result?.ok) {
        setError('Failed to sign in. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Try Demo Account'}
        </button>
      </div>
    </div>
  );
} 
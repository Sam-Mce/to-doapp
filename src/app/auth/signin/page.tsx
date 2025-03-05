'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/'
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('credentials', {
        email: 'test@example.com',
        password: 'demo123',
        callbackUrl: '/'
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-purple-700/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Welcome to To-Doist ✒️</h1>
        <p className="text-center text-gray-600 mb-8">
          Your AI-powered task management companion
        </p>

        <button
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse delay-100">•</span>
              <span className="animate-pulse delay-200">•</span>
            </span>
          ) : (
            'Try Demo Account'
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          No sign up required for the demo account
        </p>
      </motion.div>
    </div>
  );
} 
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SubscribePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      });

      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <motion.main 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8 text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div className="mb-8 text-5xl font-bold">
          To-Doist ✒️
        </motion.div>
        <motion.h1 
          className="text-4xl font-bold mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          Upgrade to Premium ✨
        </motion.h1>
        
        <motion.div 
          className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Your trial has ended</h2>
          <p className="text-gray-300 mb-6">
            Continue enjoying AI-powered task management with our premium features:
          </p>
          
          <ul className="text-left space-y-4 mb-8">
            <li className="flex items-center">
              <span className="text-indigo-400 mr-2">✓</span>
              Unlimited AI task breakdowns
            </li>
            <li className="flex items-center">
              <span className="text-indigo-400 mr-2">✓</span>
              Smart task organization
            </li>
            <li className="flex items-center">
              <span className="text-indigo-400 mr-2">✓</span>
              Personalized task tips
            </li>
          </ul>

          <div className="text-3xl font-bold mb-8">
            £5<span className="text-lg text-gray-400">/month</span>
          </div>

          <motion.button
            onClick={handleSubscribe}
            className="w-full px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Subscribe Now
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  );
} 
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  priority?: string;
  description?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

interface Subtask {
  step: number;
  title: string;
  details: string;
}

export default function Todo({ id, text, completed, priority, description, onToggle, onDelete }: TodoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'tips' | 'breakdown' | null>(null);

  const handleGetTips = async () => {
    setIsLoading(true);
    setLoadingType('tips');
    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: text }),
      });
      const data = await response.json();
      setTips(data.tips);
      setSubtasks(null);
      setIsExpanded(true);
    } catch (error) {
      console.error('Error getting tips:', error);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleBreakdown = async () => {
    setIsLoading(true);
    setLoadingType('breakdown');
    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: text, action: 'breakdown' }),
      });
      const data = await response.json();
      setSubtasks(data.subtasks);
      setTips(null);
      setIsExpanded(true);
    } catch (error) {
      console.error('Error getting breakdown:', error);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <motion.div
      className="bg-[#151922] rounded-lg border border-gray-700 overflow-hidden shadow-lg"
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggle(id)}
              className="w-6 h-6 rounded border-gray-600 text-[#6b46c1] focus:ring-[#6b46c1] transition-transform hover:scale-110"
            />
          </div>
          <div className="flex-grow text-center">
            <div className={`text-2xl font-medium ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {text}
            </div>
            {priority && !completed && description && (
              <div className="text-sm text-gray-400 mt-2">
                Priority: {priority} - {description}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!completed && (
              <>
                <button
                  onClick={handleGetTips}
                  className="relative px-4 py-1.5 bg-[#6b46c1]/20 text-[#9f7aea] rounded hover:bg-[#6b46c1]/30 focus:outline-none shadow-lg shadow-[#6b46c1]/10 min-w-[100px]"
                  disabled={isLoading}
                >
                  {isLoading && loadingType === 'tips' ? (
                    <div className="flex items-center justify-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  ) : (
                    'Get Tips ✨'
                  )}
                </button>
                <button
                  onClick={handleBreakdown}
                  className="relative px-4 py-1.5 bg-[#6b46c1]/20 text-[#9f7aea] rounded hover:bg-[#6b46c1]/30 focus:outline-none shadow-lg shadow-[#6b46c1]/10 min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading && loadingType === 'breakdown' ? (
                    <div className="flex items-center justify-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#9f7aea]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  ) : (
                    'Break Down 📋'
                  )}
                </button>
              </>
            )}
            {isHovered && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onDelete(id)}
                className="text-red-400 hover:text-red-300 focus:outline-none"
              >
                🗑️
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (tips || subtasks) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-700"
          >
            <div className="p-4 bg-[#0f1117]">
              <div className="text-gray-300">
                {tips && (
                  <>
                    <h3 className="text-[#9f7aea] text-lg font-medium mb-3">✨ AI Tips:</h3>
                    <p className="text-base text-center">{tips}</p>
                  </>
                )}
                {subtasks && (
                  <>
                    <h3 className="text-[#9f7aea] text-lg font-medium mb-4">📋 Task Breakdown:</h3>
                    <div className="space-y-4">
                      {subtasks.map((subtask) => (
                        <div key={subtask.step} className="bg-[#151922] rounded-lg p-4 shadow-lg">
                          <h4 className="text-white text-lg font-medium mb-2">
                            Step {subtask.step}: {subtask.title}
                          </h4>
                          <p className="text-base text-gray-400">{subtask.details}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="text-center">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-6 px-3 py-1.5 bg-[#151922] text-gray-400 rounded hover:text-gray-300 focus:outline-none shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { fetchAIExplanation } from '../services/api';

const SuggestionPanel = ({ suggestions, metrics }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const handleGenerateAI = async () => {
    if (!metrics) return;
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const result = await fetchAIExplanation(metrics);
      if (result.fallback) {
        setAiResponse(result.fallback);
      } else {
        setAiResponse(result.explanation);
      }
    } catch (err) {
      setAiResponse("Failed to connect to the AI Engine. Please make sure the backend is running and the API key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-amber-500" size={24} />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Actionable Steps</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group cursor-pointer"
          >
            <ChevronRight className="text-indigo-400 group-hover:text-indigo-600 shrink-0 mt-0.5 transition-colors" size={18} />
            <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6"
      >
        <button 
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles size={16} /> Explain with AI</>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
              <div className="flex gap-2 items-center mb-2">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Diagnostic</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuggestionPanel;

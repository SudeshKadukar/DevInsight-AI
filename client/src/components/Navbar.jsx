import React, { useState, useEffect } from 'react';
import { Activity, Moon, Sun } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial OS preference or local storage
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const switchView = (view) => {
    window.dispatchEvent(new CustomEvent("devinsight:set-view", { detail: { view } }));
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
              DevInsight AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => switchView("ic")}
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2 py-1 rounded-full transition-colors"
            >
              IC View
            </button>
            <button
              onClick={() => switchView("ic")}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 rounded-full transition-colors"
            >
              5 Metrics
            </button>
            <button
              onClick={() => switchView("manager")}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 rounded-full transition-colors"
            >
              Manager
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {onLogout ? (
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 px-2 py-1 rounded-full transition-colors"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

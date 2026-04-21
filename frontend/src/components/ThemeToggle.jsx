import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="dark"
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[20px] absolute"
          >
            dark_mode
          </motion.span>
        ) : (
          <motion.span
            key="light"
            initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[20px] absolute"
          >
            light_mode
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;

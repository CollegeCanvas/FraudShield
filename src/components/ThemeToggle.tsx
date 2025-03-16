
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 backdrop-blur-md p-2 text-foreground hover:bg-secondary transition-all duration-300 focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative h-5 w-5 overflow-hidden">
        <Sun 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            theme === 'light' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  UserCheck, 
  Camera, 
  Languages,
  CheckCircle2,
  Clock,
  Menu
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { 
    state, 
    role, 
    setRole, 
    darkMode, 
    toggleDarkMode, 
    language, 
    setLanguage, 
    setActiveScreen,
    saveStatus 
  } = useAcademy();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setActiveScreen('dashboard')} 
              className="flex items-center space-x-3 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    Nad e Ali <span className="text-indigo-600 dark:text-indigo-400 font-bold">A-Level AI Academy</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-sm bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Aim for A*
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Lahore Grammar School, Gujrat • Physics, Chemistry & Computer Science
                </p>
              </div>
            </button>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Scan Question Button */}
            <button
              onClick={() => setActiveScreen('photo_solver')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Scan Question</span>
            </button>

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'English' ? 'Urdu' : 'English')}
              title={`Switch explanation mode to ${language === 'English' ? 'Urdu' : 'English'}`}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold">{language === 'English' ? 'EN' : 'اردو'}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setRole('student')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  role === 'student'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole('parent')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  role === 'parent'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Parent
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Sync Status Indicator */}
            <div className="hidden xl:flex items-center space-x-1 text-[11px] text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{saveStatus}</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

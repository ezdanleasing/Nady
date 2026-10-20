import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2
} from 'lucide-react';

export const FocusTimer: React.FC = () => {
  const { logStudyTime } = useAcademy();

  const [mode, setMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [studyMinutes, setStudyMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);

  // Sound alert toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      handleCompleteTimer();
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const handleCompleteTimer = () => {
    setIsRunning(false);

    if (mode === 'study') {
      const minutesCompleted = studyMinutes;
      logStudyTime(minutesCompleted);
      setSessionsCompleted((prev) => prev + 1);
      setLoggedNotice(`Logged ${minutesCompleted} minutes to your total study time!`);
      setTimeout(() => setLoggedNotice(null), 5000);

      // Play soft chime if sound enabled
      if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        } catch (e) {
          // ignore
        }
      }

      // Transition to break
      setMode('short_break');
      setSecondsLeft(breakMinutes * 60);
    } else {
      setMode('study');
      setSecondsLeft(studyMinutes * 60);
    }
  };

  const handleToggleRun = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'study') setSecondsLeft(studyMinutes * 60);
    else if (mode === 'short_break') setSecondsLeft(breakMinutes * 60);
    else setSecondsLeft(15 * 60);
  };

  const switchMode = (newMode: 'study' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'study') setSecondsLeft(studyMinutes * 60);
    else if (newMode === 'short_break') setSecondsLeft(breakMinutes * 60);
    else setSecondsLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalSeconds = mode === 'study' ? studyMinutes * 60 : mode === 'short_break' ? breakMinutes * 60 : 15 * 60;
  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-fadeIn">
      
      {/* Notice Banner */}
      {loggedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{loggedNotice}</span>
        </div>
      )}

      {/* Main Timer Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
        
        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-xs font-bold">
          <button
            onClick={() => switchMode('study')}
            className={`px-4 py-2 rounded-xl transition-all ${
              mode === 'study'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Study Focus ({studyMinutes}m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-4 py-2 rounded-xl transition-all ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Short Break ({breakMinutes}m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-4 py-2 rounded-xl transition-all ${
              mode === 'long_break'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Circular / Radial Timer Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="text-slate-100 dark:text-slate-700 stroke-current"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className={`${mode === 'study' ? 'text-indigo-600' : 'text-emerald-500'} stroke-current transition-all duration-500`}
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs uppercase font-bold text-slate-400 mt-1 tracking-widest">
              {mode === 'study' ? 'Deep Work Session' : 'Active Recovery'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleRun}
            className={`px-8 py-3.5 rounded-2xl font-black text-base flex items-center space-x-2 text-white shadow-xl transition-all hover:scale-103 active:scale-97 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : mode === 'study'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Session</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Durations */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-center space-x-2 text-xs">
          <span className="text-slate-400">Presets:</span>
          {[25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setStudyMinutes(mins);
                if (mode === 'study') {
                  setIsRunning(false);
                  setSecondsLeft(mins * 60);
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                studyMinutes === mins && mode === 'study'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Sessions Completed today */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Pomodoro Sessions Completed Today:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{sessionsCompleted} Sessions</span>
        </div>

      </div>

    </div>
  );
};

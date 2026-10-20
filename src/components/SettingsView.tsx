import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Settings,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Key,
  Server,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Globe,
  UserCheck
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, resetToDefault, darkMode, toggleDarkMode, language, setLanguage } = useAcademy();
  const [downloadNotice, setDownloadNotice] = useState(false);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nadeali_academy_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5 text-indigo-600" />
          <span>System Preferences & Architecture</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Academy Settings & Deployment Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Profile configuration, data backup, and technical documentation for Google Gemini API, Firebase Firestore, and full-stack deployment.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Registered Academic Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-semibold mb-0.5">Enrolled Student:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{state.student.name}</span>
            <p className="text-slate-500 mt-0.5">{state.student.school}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-semibold mb-0.5">Academic Target:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">3 × A* (A-Star)</span>
            <p className="text-slate-500 mt-0.5">Physics (9702), Chemistry (9701), CS (9618)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-semibold mb-0.5">Standard Timezone:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Asia/Karachi (PKT)</span>
            <p className="text-slate-500 mt-0.5">Synchronized for Gujrat, Pakistan timetable</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block font-semibold mb-0.5">Parent / Guardian:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{state.parent.name}</span>
            <p className="text-slate-500 mt-0.5">{state.parent.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance & Language */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Interface & Language Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Theme Mode</span>
              <span className="text-slate-400">Current: {darkMode ? 'Dark Navy' : 'Clean White'}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
            >
              Toggle {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Explanation Language</span>
              <span className="text-slate-400">Current: {language === 'English' ? 'English' : 'اردو'}</span>
            </div>
            <button
              onClick={() => setLanguage(language === 'English' ? 'Urdu' : 'English')}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-bold"
            >
              Switch to {language === 'English' ? 'Urdu' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* CLOUD CONFIGURATION & DEPLOYMENT GUIDE (SECTION 27) */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <Server className="w-5 h-5" />
          <h2 className="text-base font-bold">
            Phase 1 Deployment, Gemini & Firebase Setup Guide
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>1. Google Gemini API:</strong> The application uses the official modern <code>@google/genai</code> SDK on the server side (`server.ts`) with model <code>gemini-3.8-flash</code> for text tutoring and multimodal photo scanning. Your <code>GEMINI_API_KEY</code> is automatically injected via the Secrets panel.
          </p>

          <p>
            <strong>2. Persistent Storage Architecture:</strong> In addition to browser-level localStorage caching, all educational data (mistakes, study plan, flashcards, quiz attempts, syllabus mastery) persists server-side in <code>./data/academy-store.json</code> via <code>/api/storage/save</code> and <code>/api/storage/load</code>.
          </p>

          <p>
            <strong>3. Firebase Auth & Cloud Firestore Integration:</strong> When connecting external Firebase:
            <br />• Set up Firebase Authentication (Email/Password or Google Sign-In).
            <br />• Configure Firestore security rules: allow read/write to authorized student (Nad e Ali) and parent accounts.
            <br />• In Google Cloud, ensure the Cloud Run service URL is whitelisted in OAuth authorized origins.
          </p>

          <p>
            <strong>4. Mobile & Camera Optimization:</strong> Works natively across iOS Safari and Android Chrome via standard HTML5 <code>getUserMedia</code> and camera file capture.
          </p>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Data Backup & Account Management
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Academic Archive (.json)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all progress and study logs back to default pre-seeded state?')) {
                resetToDefault();
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Initial State</span>
          </button>
        </div>

        {downloadNotice && (
          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Academic archive downloaded successfully!</span>
          </p>
        )}
      </div>

    </div>
  );
};

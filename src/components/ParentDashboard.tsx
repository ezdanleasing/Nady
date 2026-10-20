import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Users2,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  Calendar,
  Mail,
  ShieldCheck,
  Bell,
  Sparkles,
  Heart,
  FileText,
  Printer
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { state, setRole } = useAcademy();
  const { student, parent, weeklyReport, recentQuizzes, mistakes, syllabuses, studyPlan } = state;

  const [frequency, setFrequency] = useState(parent.notificationFrequency || 'Weekly');
  const [alertsEnabled, setAlertsEnabled] = useState(parent.receiveAlerts ?? true);
  const [savedNotice, setSavedNotice] = useState(false);

  // Compute subject progress averages
  const calcSubjectAvg = (subject: 'Physics' | 'Chemistry' | 'Computer Science') => {
    const topics = syllabuses[subject]?.topics || [];
    if (!topics.length) return 0;
    const total = topics.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / topics.length);
  };

  const physicsAvg = calcSubjectAvg('Physics');
  const chemAvg = calcSubjectAvg('Chemistry');
  const csAvg = calcSubjectAvg('Computer Science');

  const handleSavePref = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Parent & Guardian Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome, {parent.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Academic progress overview for <strong className="text-white">{student.name}</strong> at <strong>Lahore Grammar School, Gujrat</strong>.
              Monitor study hours, quiz mastery, and receive tailored advice on supporting his journey toward 3 × A*.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Print / Save PDF Report</span>
            </button>
            <button
              onClick={() => setRole('student')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
            >
              Switch to Student View
            </button>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Study Time Logged</span>
            <span className="text-lg font-black text-amber-300">{(student.totalStudyMinutes / 60).toFixed(1)} Hours</span>
            <p className="text-[10px] text-slate-300 mt-0.5">{student.streakDays}-day active streak</p>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Tasks Mastered</span>
            <span className="text-lg font-black text-emerald-400">{student.completedTasksCount} Sessions</span>
            <p className="text-[10px] text-slate-300 mt-0.5">{student.pendingTasksCount} upcoming</p>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Average Quiz Score</span>
            <span className="text-lg font-black text-blue-300">93% Accuracy</span>
            <p className="text-[10px] text-slate-300 mt-0.5">Across Paper 1 sets</p>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Target Ambition</span>
            <span className="text-lg font-black text-amber-400">3 × A* Grades</span>
            <p className="text-[10px] text-slate-300 mt-0.5">Physics, Chem, CS</p>
          </div>
        </div>
      </div>

      {/* THREE SUBJECT PROGRESS BARS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Subject Syllabus Mastery Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Physics */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-900 dark:text-blue-300">Physics (CIE 9702)</span>
              <span className="font-black text-blue-600 dark:text-blue-400">{physicsAvg}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${physicsAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">Currently studying: Kinematics & SUVAT</span>
          </div>

          {/* Chemistry */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">Chemistry (CIE 9701)</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{chemAvg}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${chemAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">Currently studying: Stoichiometry & Titrations</span>
          </div>

          {/* CS */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-slate-900/60 border border-purple-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-900 dark:text-purple-300">Computer Science (9618)</span>
              <span className="font-black text-purple-600 dark:text-purple-400">{csAvg}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${csAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">Currently studying: Logic Gates & Truth Tables</span>
          </div>
        </div>
      </div>

      {/* WEEKLY REPORT FOR PARENTS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Official Academic Briefing
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {weeklyReport.week}
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Status: On Track for A*
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Key Strengths This Week</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {weeklyReport.strongestArea}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Priority Academic Focus</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {weeklyReport.priorityFocus}
            </p>
          </div>

        </div>

        {/* Parent Support Recommendation Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm space-y-2">
          <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-300 font-bold">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Recommended Parental Support Activity:</span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
            {weeklyReport.parentRecommendation}
          </p>
        </div>

        {/* Recurring mistakes note */}
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
            Exam Technique Observation:
          </span>
          <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
            {weeklyReport.recurringMistakesNote}
          </p>
        </div>
      </div>

      {/* PARENT PREFERENCES & EMAIL ALERTS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <span>Notification & Report Delivery Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered Parent Email
            </label>
            <input
              type="email"
              disabled
              value={parent.email}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Configured via Lahore Grammar School student registry.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Progress Report Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="Daily">Daily Summary</option>
              <option value="Weekly">Weekly Comprehensive Report (Recommended)</option>
              <option value="Bi-weekly">Bi-weekly Digest</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={handleSavePref}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Update Preferences
          </button>
          {savedNotice && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences updated successfully!</span>
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

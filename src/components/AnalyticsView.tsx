import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SubjectType } from '../types/academy';

export const AnalyticsView: React.FC = () => {
  const { state } = useAcademy();
  const { student, syllabuses, recentQuizzes, weeklyReport, studyPlan, mistakes } = state;

  const calcSubjectAvg = (subject: SubjectType) => {
    const topics = syllabuses[subject]?.topics || [];
    if (!topics.length) return 0;
    const total = topics.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / topics.length);
  };

  const physicsAvg = calcSubjectAvg('Physics');
  const chemAvg = calcSubjectAvg('Chemistry');
  const csAvg = calcSubjectAvg('Computer Science');

  // Mastery count across all subjects
  const allTopics = [
    ...syllabuses.Physics.topics,
    ...syllabuses.Chemistry.topics,
    ...syllabuses['Computer Science'].topics,
  ];

  const masteryCounts = {
    'Consistently Demonstrated': allTopics.filter((t) => t.mastery === 'Consistently Demonstrated').length,
    'Nearly Mastered': allTopics.filter((t) => t.mastery === 'Nearly Mastered').length,
    'Developing': allTopics.filter((t) => t.mastery === 'Developing').length,
    'Learning': allTopics.filter((t) => t.mastery === 'Learning').length,
    'Not Started': allTopics.filter((t) => t.mastery === 'Not Started').length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Evidence-Based Progress Tracking</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Performance & Mastery Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Objective evaluation of syllabus mastery, quiz scores, and active revision habits.
          <span className="text-amber-600 dark:text-amber-400 font-semibold ml-1">
            (Notice: Progress indicators reflect practice performance and are not official Cambridge exam forecasts).
          </span>
        </p>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold uppercase text-[10px]">Total Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {(student.totalStudyMinutes / 60).toFixed(1)} hrs
          </span>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center">
            <span>+2.5 hrs this week</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold uppercase text-[10px]">Quiz Accuracy</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">93%</span>
          <p className="text-[11px] text-slate-500 mt-1">Across 15 test items</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold uppercase text-[10px]">Study Streak</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {student.streakDays} Days
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Consistent daily habit</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold uppercase text-[10px]">Tasks Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {student.completedTasksCount} / {studyPlan.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled sessions</p>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Subject Syllabus Completion</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="text-blue-700 dark:text-blue-300">Physics (CIE 9702)</span>
              <span>{physicsAvg}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${physicsAvg}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="text-emerald-700 dark:text-emerald-300">Chemistry (CIE 9701)</span>
              <span>{chemAvg}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${chemAvg}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="text-purple-700 dark:text-purple-300">Computer Science (CIE 9618)</span>
              <span>{csAvg}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${csAvg}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* CAMBRIDGE A* GRADE READINESS MATRIX & THRESHOLD PREDICTOR */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Official Cambridge Curve Benchmarking
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>A* Grade Threshold & Readiness Matrix</span>
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Target: 3 × A* on First Sitting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Physics */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-900 dark:text-blue-300">Physics (9702)</span>
              <span className="px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Projected: A*
              </span>
            </div>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>CIE A* Boundary:</span>
                <span className="font-mono font-bold">~74%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Practice Trajectory:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">92% (+18% buffer)</span>
              </div>
              <div className="flex justify-between">
                <span>Core Leverage Paper:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Paper 2 & Paper 4</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[11px] text-blue-900 dark:text-blue-200">
              <strong>A* Focus:</strong> Master multi-step projectile numericals and uncertainty combining rules.
            </div>
          </div>

          {/* Chemistry */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Chemistry (9701)</span>
              <span className="px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Projected: A*
              </span>
            </div>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>CIE A* Boundary:</span>
                <span className="font-mono font-bold">~76%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Practice Trajectory:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">90% (+14% buffer)</span>
              </div>
              <div className="flex justify-between">
                <span>Core Leverage Paper:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Paper 1 & Paper 3</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-[11px] text-emerald-900 dark:text-emerald-200">
              <strong>A* Focus:</strong> Memorize qualitative test observations and Hess’s Law sign conventions.
            </div>
          </div>

          {/* Computer Science */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-slate-900/60 border border-purple-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-900 dark:text-purple-300">Computer Science (9618)</span>
              <span className="px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Projected: A*
              </span>
            </div>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>CIE A* Boundary:</span>
                <span className="font-mono font-bold">~72%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Practice Trajectory:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">94% (+22% buffer)</span>
              </div>
              <div className="flex justify-between">
                <span>Core Leverage Paper:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Paper 2 & Paper 4</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-[11px] text-purple-900 dark:text-purple-200">
              <strong>A* Focus:</strong> Adhere strictly to Cambridge 9618 arrow pseudocode and trace tables.
            </div>
          </div>
        </div>

        {/* Component Weighting Table */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            Cambridge A-Level Component Mark Contribution Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-900 dark:text-white">Paper 1 (MCQ)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">15.5% - 25%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-900 dark:text-white">Paper 2 (AS Theory)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">23% - 25%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-900 dark:text-white">Paper 3 (Practical)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">11.5% (Sciences)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-900 dark:text-white">Paper 4 (A2 Theory)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">38.5% - 25%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-900 dark:text-white">Paper 5 (Planning)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">11.5% - 25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Tier Breakdown */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Curriculum Topic Mastery Distribution ({allTopics.length} Total Topics)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 block">
              {masteryCounts['Consistently Demonstrated']}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Consistently Demonstrated</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
            <span className="text-xl font-black text-teal-700 dark:text-teal-300 block">
              {masteryCounts['Nearly Mastered']}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Nearly Mastered</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-xl font-black text-blue-700 dark:text-blue-300 block">
              {masteryCounts['Developing']}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Developing</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-xl font-black text-amber-700 dark:text-amber-300 block">
              {masteryCounts['Learning']}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Learning</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            <span className="text-xl font-black text-slate-700 dark:text-slate-300 block">
              {masteryCounts['Not Started']}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Not Started</span>
          </div>
        </div>
      </div>

      {/* Recent Quiz Performance History */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Quiz Log
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
          {recentQuizzes.map((qz) => (
            <div key={qz.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white mr-2">{qz.subject}:</span>
                <span className="text-slate-600 dark:text-slate-400">{qz.topic}</span>
                <span className="text-[10px] text-slate-400 ml-2 font-mono">({qz.date})</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-slate-400 text-[11px] font-mono">{qz.timeTaken}</span>
                <span className="font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {qz.score}/{qz.total} ({qz.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

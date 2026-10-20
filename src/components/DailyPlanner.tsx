import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  RefreshCw,
  Calendar,
  Layers,
  Flame,
  Target,
  Award
} from 'lucide-react';
import { StudyTask, SubjectType } from '../types/academy';

export const DailyPlanner: React.FC = () => {
  const { state, toggleTask, addTask, replaceStudyPlan, rescheduleMissedTask, setDailyStudyGoal } = useAcademy();
  const { studyPlan, student, mistakes, syllabuses } = state;

  const [activeDayFilter, setActiveDayFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAiScheduleModal, setShowAiScheduleModal] = useState<boolean>(false);
  const [recommendationMessage, setRecommendationMessage] = useState<string | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);

  // New task form state
  const [newDay, setNewDay] = useState<string>('Monday');
  const [newTime, setNewTime] = useState<string>('16:30 - 17:30');
  const [newSubject, setNewSubject] = useState<SubjectType>('Physics');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newObj, setNewObj] = useState<string>('');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  // AI Schedule Generator State
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState<boolean>(false);
  const [scheduleFocus, setScheduleFocus] = useState<string>('Balanced');
  const [notice, setNotice] = useState<string | null>(null);

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredTasks = activeDayFilter === 'All'
    ? studyPlan
    : studyPlan.filter((t) => t.day === activeDayFilter);

  // Deep "What Should I Study Now?" reasoning algorithm
  const handleWhatShouldIStudyNow = () => {
    const incomplete = studyPlan.filter((t) => !t.completed);
    if (incomplete.length === 0) {
      setRecommendationMessage(
        "Alhamdulillah! All planned study sessions for this period are completed."
      );
      setRecommendationReason(
        "Take a well-deserved break, review high-yield flashcards for 10 minutes, or attempt an A* exam challenge quiz."
      );
      return;
    }

    // Identify weak topics from mistake notebook
    const weakSubjs = mistakes.map((m) => m.subject);
    const weakMatch = incomplete.find((t) => weakSubjs.includes(t.subject) && t.priority === 'High');
    const targetTask = weakMatch || incomplete.find((t) => t.priority === 'High') || incomplete[0];

    setRecommendationMessage(
      `${targetTask.subject}: "${targetTask.topic}" (${targetTask.duration} Minutes)`
    );
    setRecommendationReason(
      `Selected based on 3 criteria: (1) Rated as High Priority for your upcoming Cambridge component, (2) Directly targets recent errors in your Mistake Notebook, (3) Fits within your scheduled evening study block after Lahore Grammar School classes.`
    );
  };

  // AI 7-Day Schedule Generator
  const handleGenerateAiSchedule = async () => {
    setIsGeneratingSchedule(true);
    setNotice(null);

    try {
      const res = await fetch('/api/gemini/generate-study-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            school: 'Lahore Grammar School, Gujrat',
            schoolHours: '08:00 - 14:30',
            sleepWindow: '22:30 - 06:30',
            eveningStudyWindow: '16:30 - 20:30',
            focus: scheduleFocus,
          },
          weakTopics: mistakes.map((m) => `${m.subject}: ${m.topic}`),
          upcomingTests: [
            'Physics Paper 1 Mock (2027-05-18)',
            'Chemistry Paper 2 Mock (2027-05-22)',
            'CS Paper 1 Theory Mock (2027-05-20)'
          ],
        }),
      });

      if (!res.ok) throw new Error('Schedule generation failed');
      const data = await res.json();

      if (data.tasks && data.tasks.length > 0) {
        replaceStudyPlan(data.tasks);
        setNotice('New personalized 7-Day A* study schedule generated and activated!');
        setShowAiScheduleModal(false);
      }
    } catch (e: any) {
      console.error(e);
      setNotice('Could not generate schedule. Please try again.');
    } finally {
      setIsGeneratingSchedule(false);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    addTask({
      day: newDay,
      time: newTime,
      subject: newSubject,
      topic: newTopic,
      learningObjective: newObj || 'Past paper questions and conceptual review',
      duration: Number(newDuration),
      priority: newPriority,
      completed: false,
      activityType: 'Targeted Exam Practice',
      revisionDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    });

    setShowAddModal(false);
    setNewTopic('');
    setNewObj('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Notice alert */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
              <span>Personalized Adaptive Study Planner (Phase 2)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Nad e Ali's A* Weekly Timetable
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Synchronized with Lahore Grammar School Gujrat hours (08:00 - 14:30) • 8-hour sleep protection • Spaced revision blocks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleWhatShouldIStudyNow}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102"
            >
              <Lightbulb className="w-4 h-4 fill-slate-950" />
              <span>What Should I Study Now?</span>
            </button>

            <button
              onClick={() => setShowAiScheduleModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI 7-Day Plan</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* AI "What Should I Study Now?" Dynamic Modal / Card */}
        {recommendationMessage && (
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs sm:text-sm space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Recommendation Engine:</span>
              </span>
              <button
                onClick={() => setRecommendationMessage(null)}
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {recommendationMessage}
            </p>
            {recommendationReason && (
              <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-sans bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
                <strong>Why This?:</strong> {recommendationReason}
              </p>
            )}
          </div>
        )}

        {/* Day Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-700 pt-4">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDayFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDayFilter === d
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Overview (LGS Gujrat Schedule) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block mb-0.5">
            LGS Gujrat School Hours
          </span>
          <span className="font-bold text-slate-900 dark:text-white">08:00 - 14:30</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Classes, laboratory sessions, discussions</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
            Rest & Lunch Window
          </span>
          <span className="font-bold text-slate-900 dark:text-white">14:30 - 16:30</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Healthy meal, decompression & prayer</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
            Target Academy Study
          </span>
          <span className="font-bold text-slate-900 dark:text-white">16:30 - 20:30 (with breaks)</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Active recall, past papers, problem sets</p>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-slate-800 border border-purple-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block mb-0.5">
            Sleep & Recovery
          </span>
          <span className="font-bold text-slate-900 dark:text-white">22:30 - 06:30 (8.0 Hours)</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Non-negotiable memory consolidation</p>
        </div>
      </div>

      {/* Daily Study Goal Target Settings Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-700/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Study Planner Daily Target
              </span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 font-medium">
                Syncs with Dashboard
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Daily Study Target: <span className="text-amber-300 font-extrabold">{Math.floor((student.dailyStudyGoalMinutes || 180) / 60)}h {(student.dailyStudyGoalMinutes || 180) % 60 > 0 ? `${(student.dailyStudyGoalMinutes || 180) % 60}m` : ''}</span> ({student.dailyStudyGoalMinutes || 180} min)
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Configured study hours drive your daily Study Progress bar and milestone reward unlock criteria on the student dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-300 font-medium mr-1">A* Presets:</span>
            {[
              { label: '2.0h (120m)', mins: 120 },
              { label: '2.5h (150m)', mins: 150 },
              { label: '3.0h (180m)', mins: 180, rec: true },
              { label: '3.5h (210m)', mins: 210 },
              { label: '4.0h (240m)', mins: 240 },
            ].map((preset) => {
              const isActive = (student.dailyStudyGoalMinutes || 180) === preset.mins;
              return (
                <button
                  key={preset.mins}
                  onClick={() => {
                    setDailyStudyGoal(preset.mins);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
                  }`}
                >
                  {preset.label}
                  {preset.rec && !isActive && <span className="ml-1 text-[9px] text-amber-300">• Rec</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task List with Auto-Reschedule Option */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Scheduled Sessions ({filteredTasks.length})
          </h2>
          <span className="text-xs text-slate-500">
            {filteredTasks.filter((t) => t.completed).length} of {filteredTasks.length} Completed
          </span>
        </div>

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              task.completed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-400'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  task.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600 bg-white dark:bg-slate-800'
                }`}
              >
                {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                    task.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                    task.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                  }`}>
                    {task.subject}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{task.day} • {task.time}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">({task.duration} min)</span>
                </div>

                <h3 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {task.topic}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {task.learningObjective}
                </p>
                <div className="mt-1 flex items-center space-x-3 text-[11px] text-slate-400">
                  <span>Activity: {task.activityType}</span>
                  <span>•</span>
                  <span>Spaced Revision: {task.revisionDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-center">
              {!task.completed && (
                <button
                  onClick={() => rescheduleMissedTask(task.id)}
                  title="Reschedule this task without cutting into sleep or school hours"
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reschedule</span>
                </button>
              )}

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                task.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                'bg-slate-200 text-slate-600 dark:bg-slate-700'
              }`}>
                {task.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Schedule Generator Modal */}
      {showAiScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Generate 7-Day A* Study Schedule
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini AI will synthesize a balanced timetable incorporating your school routine at <strong>Lahore Grammar School</strong>, weak topics from your Mistake Notebook, and upcoming mocks.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Schedule Focus Strategy</label>
                <select
                  value={scheduleFocus}
                  onChange={(e) => setScheduleFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Balanced">Balanced Across Physics, Chemistry, Computer Science</option>
                  <option value="Weak Topics Remediation">Heavier Weighting on Weak Topics & Past Mistakes</option>
                  <option value="Paper 1 MCQ Mastery">Focus on Paper 1 Multiple Choice Speed & Precision</option>
                  <option value="Paper 2 Structured Drill">Deep Focus on Paper 2 Calculations & Derivations</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p>• Weekdays: 16:30 – 20:30 (Max 2.5h focused work + breaks)</p>
                <p>• Guaranteed 8.0h sleep consolidation window (22:30 – 06:30)</p>
                <p>• Weekends: 2 targeted 90m blocks with active recall</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAiScheduleModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiSchedule}
                disabled={isGeneratingSchedule}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isGeneratingSchedule ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synthesizing Optimal Schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Apply 7-Day Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add New A-Level Study Session
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {days.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projectile Motion or Titration Analysis"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Learning Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 past paper questions on resolving forces"
                  value={newObj}
                  onChange={(e) => setNewObj(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Filter,
  Trash2,
  RotateCcw,
  BookOpen,
  Award,
  ArrowRight
} from 'lucide-react';
import { ErrorCategory, SubjectType, MistakeRecord } from '../types/academy';

export const MistakeNotebook: React.FC = () => {
  const { state, updateMistakeStatus, addMistake, setActiveScreen } = useAcademy();
  const { mistakes } = state;

  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New mistake state
  const [newSubj, setNewSubj] = useState<SubjectType>('Physics');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ErrorCategory>('Calculation error');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newStudentAns, setNewStudentAns] = useState<string>('');
  const [newCorrectAns, setNewCorrectAns] = useState<string>('');
  const [newExp, setNewExp] = useState<string>('');

  const categories: ErrorCategory[] = [
    'Conceptual misunderstanding',
    'Calculation error',
    'Incorrect formula',
    'Missing units / SI conversions',
    'Incorrect definition',
    'Misreading a question',
    'Programming logic',
    'Syntax error',
    'Missing examination points'
  ];

  const filteredMistakes = mistakes.filter((m) => {
    const matchSubj = subjectFilter === 'All' || m.subject === subjectFilter;
    const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSubj && matchCat && matchStatus;
  });

  const masteredCount = mistakes.filter((m) => m.status === 'Mastered').length;
  const underReviewCount = mistakes.filter((m) => m.status === 'Under Review' || m.status === 'Review Scheduled').length;

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    addMistake({
      subject: newSubj,
      topic: newTopic || 'General A-Level Problem',
      category: newCategory,
      question: newQuestion,
      studentAnswer: newStudentAns,
      correctAnswer: newCorrectAns,
      explanation: newExp,
      status: 'Under Review',
    });

    setShowAddModal(false);
    setNewQuestion('');
    setNewStudentAns('');
    setNewCorrectAns('');
    setNewExp('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Personalized Error Remediation (Phase 2)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Nad e Ali's Mistake Notebook
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              "The road to an A* is paved by cataloguing and eliminating every single mistake."
              Categorize conceptual lapses, calculation slips, missing units, and generate targeted remediation tests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveScreen('quiz')}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Generate Quiz from Mistakes</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mistake</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Logged Errors</span>
            <span className="text-base font-black text-amber-800 dark:text-amber-300">{mistakes.length} Total</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Under Active Review</span>
            <span className="text-base font-black text-rose-800 dark:text-rose-300">{underReviewCount} Traps</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mastered & Eliminated</span>
            <span className="text-base font-black text-emerald-800 dark:text-emerald-300">{masteredCount} Conquered</span>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Elimination Rate</span>
            <span className="text-base font-black text-indigo-800 dark:text-indigo-300">
              {mistakes.length ? Math.round((masteredCount / mistakes.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Physics', 'Chemistry', 'Computer Science'].map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  subjectFilter === s
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
            >
              <option value="All">All Error Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Review Scheduled">Review Scheduled</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistake Items Grid */}
      <div className="space-y-4">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60 gap-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-sm font-bold ${
                    m.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                    m.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                  }`}>
                    {m.subject}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.topic}</span>
                  <span className="text-slate-400">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 text-[10px] font-bold">
                    {m.category}
                  </span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Status:</span>
                  <select
                    value={m.status}
                    onChange={(e) => updateMistakeStatus(m.id, e.target.value as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      m.status === 'Mastered' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
                      m.status === 'Review Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
                      'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                    }`}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Review Scheduled">Review Scheduled</option>
                    <option value="Mastered">Mastered (No Longer Made)</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Question:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {m.question}
                </p>
              </div>

              {/* Student Answer vs Correct Answer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 font-sans block mb-1">
                    What Was Written (My Mistake):
                  </span>
                  <p className="text-rose-900 dark:text-rose-200">{m.studentAnswer}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-sans block mb-1">
                    Correct Cambridge Answer & Working:
                  </span>
                  <p className="text-emerald-900 dark:text-emerald-200">{m.correctAnswer}</p>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  💡 Root Cause & Remedy for A*:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {m.explanation}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-base font-semibold">No mistakes found matching this filter!</p>
          </div>
        )}
      </div>

      {/* Add Mistake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Record a Mistake to Conquer
            </h3>

            <form onSubmit={handleCreateMistake} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubj}
                    onChange={(e) => setNewSubj(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Error Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamics - Incline Vectors"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter the question text..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student's Initial Answer</label>
                <input
                  type="text"
                  placeholder="What was incorrectly written..."
                  value={newStudentAns}
                  onChange={(e) => setNewStudentAns(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Correct Answer & Method</label>
                <input
                  type="text"
                  placeholder="Correct value with units..."
                  value={newCorrectAns}
                  onChange={(e) => setNewCorrectAns(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Why Did It Happen? (Key Remedy)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Forgot to convert km/h to m/s before applying F = ma..."
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

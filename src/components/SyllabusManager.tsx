import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  BookOpen,
  CheckCircle,
  FileText,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Upload,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { SubjectType, MasteryLevel, SyllabusTopic } from '../types/academy';

export const SyllabusManager: React.FC = () => {
  const { state, updateTopicProgress, addExtractedTopics } = useAcademy();
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Physics');
  const [syllabusText, setSyllabusText] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Custom Topic Modal state
  const [showAddTopicModal, setShowAddTopicModal] = useState<boolean>(false);
  const [newTopicName, setNewTopicName] = useState<string>('');
  const [newSubtopicsInput, setNewSubtopicsInput] = useState<string>('');

  const syllabus = state.syllabuses[selectedSubject];

  const masteryLevels: MasteryLevel[] = [
    'Not Started',
    'Learning',
    'Developing',
    'Nearly Mastered',
    'Consistently Demonstrated'
  ];

  // Cambridge Exam Dates & Countdown
  const examDates: Record<string, string> = {
    'Paper 1 (Physics)': '2027-05-18T09:00:00',
    'Paper 2 (Physics)': '2027-05-22T09:00:00',
    'Paper 3 (Physics Practical)': '2027-05-28T09:00:00',
    'Paper 1 (Chemistry)': '2027-05-19T09:00:00',
    'Paper 2 (Chemistry)': '2027-05-25T09:00:00',
    'Paper 1 (CS Theory)': '2027-05-20T09:00:00',
    'Paper 2 (CS Programming)': '2027-05-27T09:00:00',
  };

  const getDaysUntilExam = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff <= 0) return 'Session Active';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} Days to Exam`;
  };

  const handleUpdateMastery = (topicId: string, mastery: MasteryLevel) => {
    let progress = 0;
    switch (mastery) {
      case 'Not Started': progress = 5; break;
      case 'Learning': progress = 35; break;
      case 'Developing': progress = 65; break;
      case 'Nearly Mastered': progress = 85; break;
      case 'Consistently Demonstrated': progress = 100; break;
    }
    updateTopicProgress(selectedSubject, topicId, progress, mastery);
  };

  const handleAnalyzeSyllabusText = async () => {
    if (!syllabusText.trim()) return;
    setAnalyzing(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/gemini/parse-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: syllabusText,
          subject: selectedSubject,
        }),
      });

      if (!res.ok) throw new Error('Failed to parse syllabus');
      const data = await res.json();

      if (data.topicsExtracted && data.topicsExtracted.length > 0) {
        const mappedTopics: SyllabusTopic[] = data.topicsExtracted.map((t: any, idx: number) => ({
          id: `ext_${Date.now()}_${idx}`,
          name: t.name,
          subtopics: t.subtopics || [],
          mastery: t.mastery || 'Learning',
          progress: t.progress || 25,
        }));

        addExtractedTopics(selectedSubject, mappedTopics);
        setStatusMsg(`Successfully extracted and verified ${mappedTopics.length} Cambridge syllabus topics!`);
      } else {
        setStatusMsg('Syllabus processed. No new distinct topics identified.');
      }
      setSyllabusText('');
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Error parsing syllabus extract. Please try pasting a cleaner excerpt.');
    } finally {
      setAnalyzing(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const subtopics = newSubtopicsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTopicObj: SyllabusTopic = {
      id: `top_${Date.now()}`,
      name: newTopicName.trim(),
      subtopics: subtopics.length ? subtopics : ['Core Principles', 'Worked Numerical Calculations'],
      mastery: 'Learning',
      progress: 20,
    };

    addExtractedTopics(selectedSubject, [newTopicObj]);
    setShowAddTopicModal(false);
    setNewTopicName('');
    setNewSubtopicsInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Cambridge Specification Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Syllabus Manager: Subject → Component → Topic → Objective
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Confirmed syllabus specifications for Nad e Ali (Lahore Grammar School, Gujrat).
              Never invents codes; all items follow Cambridge International CIE standard.
            </p>
          </div>

          {/* Subject Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-bold shrink-0">
            {(['Physics', 'Chemistry', 'Computer Science'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSubject === s
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {s} ({state.syllabuses[s]?.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official Syllabus Code & Assessment Components Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Examination Board & Session
            </span>
            <h2 className="text-lg font-black text-white">
              {syllabus.board} • Code: {syllabus.code} • Exam Session: {syllabus.session} ({syllabus.examYear})
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full border border-white/20">
              Target: 3 × A* (A-Star)
            </span>
            <button
              onClick={() => setShowAddTopicModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
          </div>
        </div>

        {/* Components Table with Countdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {syllabus.components.map((c, idx) => {
            const examKey = `${c.code} (${selectedSubject})`;
            const dateStr = examDates[examKey] || '2027-05-20T09:00:00';
            const countdown = getDaysUntilExam(dateStr);

            return (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 relative group">
                <span className="font-bold text-indigo-400 block">{c.code}</span>
                <p className="font-medium text-slate-200 truncate">{c.name}</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>{c.duration}</span>
                  <span className="text-amber-400 font-bold">{c.weight}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>{countdown}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOPIC LIST WITH EVIDENCE-BASED MASTERY */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedSubject} Syllabus Units ({syllabus.topics.length} Topics)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hierarchy: {selectedSubject} → CIE {syllabus.code} → Component → Topic → Subtopic
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            5-Tier Mastery Evidence
          </span>
        </div>

        <div className="space-y-3">
          {syllabus.topics.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-3 transition-all hover:border-indigo-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 mt-1">
                    {t.subtopics.map((sub, idx) => (
                      <span key={idx} className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] text-slate-400">Mastery:</span>
                  <select
                    value={t.mastery}
                    onChange={(e) => handleUpdateMastery(t.id, e.target.value as MasteryLevel)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      t.mastery === 'Consistently Demonstrated' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' :
                      t.mastery === 'Nearly Mastered' ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300' :
                      t.mastery === 'Developing' ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300' :
                      t.mastery === 'Learning' ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {masteryLevels.map((ml) => (
                      <option key={ml} value={ml}>{ml}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Syllabus Mastery Evidence</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Syllabus PDF & Text Parser */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Upload className="w-4 h-4 text-indigo-600" />
          <span>Upload or Paste Official Cambridge Syllabus Sections</span>
        </h3>
        <p className="text-xs text-slate-500">
          Paste teacher handouts, new topic learning objectives, or syllabus PDF extracts to automatically verify and align with the academy engine.
        </p>

        <textarea
          rows={3}
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          placeholder="Paste Cambridge 9702 / 9701 / 9618 learning objective text here..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
        />

        <div className="flex items-center justify-between">
          <button
            onClick={handleAnalyzeSyllabusText}
            disabled={analyzing || !syllabusText.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Extracting & Verifying Learning Objectives...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Verify Cambridge Objectives</span>
              </>
            )}
          </button>

          {statusMsg && (
            <span className="text-xs text-emerald-600 font-semibold animate-fadeIn">{statusMsg}</span>
          )}
        </div>
      </div>

      {/* Add Custom Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Topic to {selectedSubject} Syllabus
            </h3>

            <form onSubmit={handleAddCustomTopic} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circular Motion & Gravitation"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subtopics (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Centripetal acceleration, Gravitational potential, Kepler's laws"
                  value={newSubtopicsInput}
                  onChange={(e) => setNewSubtopicsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Layers,
  Sparkles,
  RotateCw,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  Atom,
  FlaskConical,
  Binary,
  Volume2,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Flashcard, SubjectType } from '../types/academy';

export const FlashcardsView: React.FC = () => {
  const { state, addFlashcard, reviewFlashcard } = useAcademy();
  const { flashcards } = state;

  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeDeck, setActiveDeck] = useState<string>('All');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [onlyDueToday, setOnlyDueToday] = useState<boolean>(false);

  // Quick AI generator state
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiSubject, setAiSubject] = useState<SubjectType>('Physics');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // New custom card state
  const [newFront, setNewFront] = useState<string>('');
  const [newBack, setNewBack] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredCards = flashcards.filter((f) => {
    const matchSubj = activeSubject === 'All' || f.subject === activeSubject;
    const matchDeck = activeDeck === 'All' || f.topic.toLowerCase().includes(activeDeck.toLowerCase());
    const matchDue = !onlyDueToday || f.reviewDue <= todayStr;
    return matchSubj && matchDeck && matchDue;
  });

  const activeCard: Flashcard | undefined = filteredCards[currentCardIndex];

  // Keyboard navigation: Space to flip, 1-4 for grading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCreateModal) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && activeCard) {
        if (e.key === '1') handleRateCard('Low', 1);
        if (e.key === '2') handleRateCard('Medium', 3);
        if (e.key === '3') handleRateCard('High', 7);
        if (e.key === '4') handleRateCard('Mastered', 14);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, activeCard, showCreateModal]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handleRateCard = (confidence: Flashcard['confidence'], days: Flashcard['intervalDays']) => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, confidence, days);
    handleNextCard();
  };

  // Text to speech for scientific definitions
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateAiFlashcard = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Generate a concise Cambridge A-Level revision flashcard for topic: ${aiTopic}`,
          subject: aiSubject,
        }),
      });
      const data = await res.json();
      addFlashcard({
        subject: aiSubject,
        topic: data.topic || aiTopic,
        front: `State the key principle and definition of ${data.topic || aiTopic}:`,
        back: `${data.simpleExplanation}\n\nFormulas / Units:\n${(data.formulas || []).join('\n')}\n\nExam Tip: ${data.examTips}`,
        intervalDays: 1,
        reviewDue: todayStr,
        confidence: 'Medium',
      });
      setAiTopic('');
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              <span>Spaced Repetition & Daily Revision Queue</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              A* Active Recall Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Spaced recall intervals: 1, 3, 7, 14, and 30 days. Tested methodology to lock A-Level definitions, formulas, and mechanisms into long-term memory.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setOnlyDueToday(!onlyDueToday)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                onlyDueToday
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              {onlyDueToday ? 'Showing: Due Today Queue' : 'Show Due Today Only'}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>New Flashcard</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-700 pt-4 text-xs font-semibold">
          {['All', 'Physics', 'Chemistry', 'Computer Science'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setActiveSubject(s);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubject === s
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Interactive Player */}
      {activeCard ? (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Card {currentCardIndex + 1} of {filteredCards.length}</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{activeCard.subject} • {activeCard.topic}</span>
              <button
                onClick={() => handleSpeak(isFlipped ? activeCard.back : activeCard.front)}
                title="Pronounce definition"
                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Container (Click to Flip) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 shadow-xl p-8 flex flex-col justify-between transition-all select-none group"
          >
            {/* Top Card Info */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                {isFlipped ? 'Answer & Working' : 'Question / Concept'}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 group-hover:text-rose-500">
                <RotateCw className="w-4 h-4" />
                <span>Click to flip (or Spacebar)</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {activeCard.front}
                  </h2>
                  <p className="text-xs text-slate-400 mt-4">
                    Recall the definition, units, or formula in your head before checking!
                  </p>
                </div>
              ) : (
                <div className="text-left font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {activeCard.back}
                </div>
              )}
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-3">
              <span>Interval: {activeCard.intervalDays} Days</span>
              <span>Next Review: {activeCard.reviewDue}</span>
            </div>
          </div>

          {/* Spaced Repetition Grading Buttons with Keyboard shortcuts (1-4) */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
              Rate Recall Accuracy (Keys 1 - 4):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
              <button
                onClick={() => handleRateCard('Low', 1)}
                className="py-3 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all flex flex-col items-center"
              >
                <span>[1] Again</span>
                <span className="text-[10px] font-normal text-rose-500 mt-0.5">1 Day Interval</span>
              </button>

              <button
                onClick={() => handleRateCard('Medium', 3)}
                className="py-3 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-all flex flex-col items-center"
              >
                <span>[2] Hard</span>
                <span className="text-[10px] font-normal text-amber-500 mt-0.5">3 Days Interval</span>
              </button>

              <button
                onClick={() => handleRateCard('High', 7)}
                className="py-3 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-all flex flex-col items-center"
              >
                <span>[3] Good</span>
                <span className="text-[10px] font-normal text-blue-500 mt-0.5">7 Days Interval</span>
              </button>

              <button
                onClick={() => handleRateCard('Mastered', 14)}
                className="py-3 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-all flex flex-col items-center"
              >
                <span>[4] Easy</span>
                <span className="text-[10px] font-normal text-emerald-500 mt-0.5">14 Days Interval</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-semibold">No flashcards found matching this filter.</p>
          <button
            onClick={() => {
              setOnlyDueToday(false);
              setActiveSubject('All');
            }}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* New Flashcard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Revision Flashcard
            </h3>

            {/* AI Generator Box */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Instantly with Gemini AI</span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value as any)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. Hess's Law or De Morgan's"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateAiFlashcard}
                disabled={isGenerating || !aiTopic.trim()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                {isGenerating ? <span>Generating...</span> : <span>Generate AI Card</span>}
              </button>
            </div>

            {/* Manual Form */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Or Create Manually:</span>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Front (Question / Prompt)</label>
                <textarea
                  rows={2}
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. State Newton's Second Law of Motion in words..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Back (Answer / Formulas / Units)</label>
                <textarea
                  rows={3}
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. F = dp/dt. Rate of change of momentum is directly proportional..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newFront.trim() || !newBack.trim()) return;
                  addFlashcard({
                    subject: aiSubject,
                    topic: 'Custom Concept',
                    front: newFront,
                    back: newBack,
                    intervalDays: 1,
                    reviewDue: todayStr,
                    confidence: 'Medium',
                  });
                  setShowCreateModal(false);
                  setNewFront('');
                  setNewBack('');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                Save Flashcard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

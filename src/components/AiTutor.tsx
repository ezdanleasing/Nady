import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Atom,
  FlaskConical,
  Binary,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TutorResponse {
  topic: string;
  simpleExplanation: string;
  detailedExplanation: string;
  stepByStepSolution: string[];
  formulas: string[];
  commonMistakes: string[];
  examTips: string;
  practiceQuestion: string;
  modelAnswer: string;
}

export const AiTutor: React.FC = () => {
  const { language, setLanguage, addFlashcard, addMistake } = useAcademy();
  const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Computer Science'>('Physics');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TutorResponse | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setToast('Speech Synthesis is not supported in this browser.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;
    window.speechSynthesis.cancel();
    const narration = `${result.topic}. ${result.simpleExplanation}. Detailed explanation: ${result.detailedExplanation}. Cambridge Exam tip: ${result.examTips}`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Suggested prompt chips for quick start
  const samplePrompts: Record<string, string[]> = {
    Physics: [
      'Explain how to resolve forces for a mass sliding on a rough 30° inclined plane.',
      'Derive SUVAT equation v² = u² + 2as using velocity-time graph area and gradient.',
      'Explain the difference between systematic and random errors with parallax example.'
    ],
    Chemistry: [
      'Explain why the second ionisation energy of Sodium is vastly higher than its first.',
      'Show step-by-step how to calculate molarity from titration of 25 cm³ NaOH with 0.1M HCl.',
      'Explain how hydrogen bonding affects the boiling point and ice density of water.'
    ],
    'Computer Science': [
      'Explain how De Morgan’s Laws work and simplify NOT(A AND B) step by step.',
      'Write pseudocode for Binary Search and explain why its time complexity is O(log n).',
      'Explain the Fetch-Execute cycle and what happens in MAR, MDR, PC, and CIR.'
    ]
  };

  const handleAskTutor = async (promptToUse?: string) => {
    const q = promptToUse || questionInput;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);
    setShowModelAnswer(false);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          subject,
          language,
        }),
      });

      if (!res.ok) throw new Error('Tutor response failed');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setToast('AI Tutor is momentarily busy. Please try again.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlashcard = () => {
    if (!result) return;
    addFlashcard({
      subject,
      topic: result.topic,
      front: result.simpleExplanation,
      back: `Formulas:\n${result.formulas.join(', ')}\n\nExam Tip: ${result.examTips}`,
      intervalDays: 3,
      reviewDue: new Date().toISOString().split('T')[0],
      confidence: 'Medium'
    });
    setToast('Added to Flashcards collection!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-xl animate-fade">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold mb-2">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Personalized A* Academic Tutor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Cambridge A-Level Intelligent Tutor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ask any concept, derivation, numerical calculation, or code logic. Answers structured into 9 Cambridge examiner dimensions.
            </p>
          </div>

          {/* Subject Pills & Language */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Physics', 'Chemistry', 'Computer Science'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subject === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s === 'Physics' && <Atom className="w-3.5 h-3.5" />}
                {s === 'Chemistry' && <FlaskConical className="w-3.5 h-3.5" />}
                {s === 'Computer Science' && <Binary className="w-3.5 h-3.5" />}
                <span>{s}</span>
              </button>
            ))}

            <button
              onClick={() => setLanguage(language === 'English' ? 'Urdu' : 'English')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'English' ? 'English Mode' : 'اردو موڈ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        
        {/* Sample Prompt Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested {subject} Topics & Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts[subject]?.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestionInput(p);
                  handleAskTutor(p);
                }}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={`Ask Nad e Ali's A-Level ${subject} tutor anything (numerical problem, formula derivation, definitions, or exam techniques)...`}
            className="w-full text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Tip: Provide specific numbers or question parts for precise Cambridge mark-scheme answers.
            </span>
            <button
              onClick={() => handleAskTutor()}
              disabled={loading || !questionInput.trim()}
              className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask Tutor</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 9-PART STRUCTURED ANSWER CARD */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 p-6 shadow-xl space-y-6 animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                1. Syllabus Topic
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {result.topic}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isSpeaking
                    ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                title={isSpeaking ? 'Stop listening' : 'Listen to tutor explanation'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveFlashcard}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                <span>Create Revision Flashcard</span>
              </button>
            </div>
          </div>

          {/* 2. Simple Explanation */}
          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              2. Simple Intuitive Explanation
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {result.simpleExplanation}
            </p>
          </div>

          {/* 3. Detailed Explanation */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              3. Deep Conceptual Breakdown
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {result.detailedExplanation}
            </p>
          </div>

          {/* 4. Step-by-Step Solution */}
          {result.stepByStepSolution && result.stepByStepSolution.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                4. Step-by-Step Working & Mathematical Logic
              </span>
              <div className="space-y-2">
                {result.stepByStepSolution.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Relevant Formulas or Definitions */}
          {result.formulas && result.formulas.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                5. Relevant Formulas & Official Definitions
              </span>
              <div className="flex flex-wrap gap-2">
                {result.formulas.map((f, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6 & 7: Common Mistakes & Examination Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 6. Common Mistakes */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>6. Common Cambridge Traps & Mistakes</span>
              </span>
              <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-1 list-disc list-inside mt-2">
                {result.commonMistakes?.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            {/* 7. Exam Tips */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>7. Examiner Technique for A*</span>
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 leading-relaxed">
                {result.examTips}
              </p>
            </div>

          </div>

          {/* 8 & 9: Practice Question & Model Answer (Attempt independently first!) */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileQuestion className="w-4 h-4" />
                <span>8. Independent Practice Question</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Attempt on paper first!
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {result.practiceQuestion}
            </p>

            {/* Model answer reveal button */}
            <div className="pt-2">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                <span>9. {showModelAnswer ? 'Hide' : 'Reveal'} Official Model Answer</span>
                {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showModelAnswer && (
                <div className="mt-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-line animate-fadeIn">
                  {result.modelAnswer}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

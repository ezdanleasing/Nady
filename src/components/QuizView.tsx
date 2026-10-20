import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  HelpCircle,
  Play,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  Award,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SubjectType, QuizQuestion } from '../types/academy';

export const QuizView: React.FC = () => {
  const { recordQuizResult, addMistake, setActiveScreen, state } = useAcademy();
  const { mistakes } = state;

  // Generator Configuration
  const [subject, setSubject] = useState<SubjectType>('Physics');
  const [topic, setTopic] = useState<string>('Kinematics & SUVAT');
  const [difficulty, setDifficulty] = useState<string>('Standard A-Level');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionFormat, setQuestionFormat] = useState<string>('Multiple Choice');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mode, setMode] = useState<'standard' | 'mistakes'>('standard');

  // Active Quiz State
  const [quizData, setQuizData] = useState<{
    title: string;
    subject: SubjectType;
    topic: string;
    questions: QuizQuestion[];
  } | null>(null);

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [savedMistakeIds, setSavedMistakeIds] = useState<Set<number>>(new Set());

  const topicPresets: Record<SubjectType, string[]> = {
    Physics: [
      'Kinematics & SUVAT Equations',
      'Dynamics & Newton\'s Laws',
      'Forces, Density & Pressure',
      'Work, Energy and Power',
      'Errors & Uncertainties',
      'Progressive & Stationary Waves',
      'Electric Current & Kirchhoff\'s Laws'
    ],
    Chemistry: [
      'Atomic Structure & Ionisation Energies',
      'Chemical Bonding & Intermolecular Forces',
      'Mole Calculations & Titrations',
      'States of Matter & Ideal Gas Law',
      'Chemical Energetics & Hess\'s Law',
      'Chemical Equilibria & Le Chatelier',
      'Organic Chemistry Functional Groups'
    ],
    'Computer Science': [
      'Logic Gates & Truth Tables',
      'Two\'s Complement & Data Representation',
      'Processor Architecture & Fetch-Execute',
      'Pseudocode & Algorithm Design',
      'Linear & Binary Search Algorithms',
      'Testing & Debugging Trace Tables'
    ]
  };

  const handleGenerateStandardQuiz = async () => {
    setIsGenerating(true);
    setQuizData(null);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setSavedMistakeIds(new Set());

    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          numQuestions,
          format: questionFormat,
        }),
      });

      if (!res.ok) throw new Error('Quiz generation failed');
      const data = await res.json();
      setQuizData(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMistakesQuiz = async () => {
    if (mistakes.length === 0) {
      alert("No mistakes currently logged in your Mistake Notebook!");
      return;
    }

    setIsGenerating(true);
    setQuizData(null);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setSavedMistakeIds(new Set());

    try {
      const res = await fetch('/api/gemini/generate-mistakes-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistakes: mistakes.slice(0, 5),
          subject,
        }),
      });

      if (!res.ok) throw new Error('Mistakes quiz generation failed');
      const data = await res.json();
      setQuizData(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    let correctCount = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / quizData.questions.length) * 100);
    setScore(correctCount);
    setIsSubmitted(true);

    const timeFormatted = `${Math.floor(secondsElapsed / 60)}m ${secondsElapsed % 60}s`;

    recordQuizResult({
      subject: quizData.subject,
      topic: quizData.topic,
      score: correctCount,
      total: quizData.questions.length,
      percentage,
      timeTaken: timeFormatted,
    });
  };

  const handleAddMistake = (q: QuizQuestion, studentOptIndex: number, idx: number) => {
    const studentAns = q.options[studentOptIndex] || 'No Answer';
    const correctAns = q.options[q.correctIndex];

    addMistake({
      subject: quizData?.subject || 'Physics',
      topic: quizData?.topic || 'Quiz Practice',
      category: 'Conceptual misunderstanding',
      question: q.question,
      studentAnswer: studentAns,
      correctAnswer: correctAns,
      explanation: q.explanation,
      status: 'Under Review',
    });

    setSavedMistakeIds((prev) => new Set(prev).add(idx));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cambridge A-Level Quiz Simulator (Phase 2)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Adaptive A* Practice Quizzes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Generate custom syllabus quizzes or generate a targeted test directly from your Mistake Notebook.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'standard' ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Standard Topic Quiz
            </button>
            <button
              onClick={() => setMode('mistakes')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                mode === 'mistakes' ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Mistakes Remediation</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ CONFIG PANEL */}
      {(!quizData || isSubmitted) && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          
          {mode === 'standard' ? (
            <>
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                1. Configure Your Syllabus Practice Quiz
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => {
                      const s = e.target.value as SubjectType;
                      setSubject(s);
                      setTopic(topicPresets[s][0]);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics (9702)</option>
                    <option value="Chemistry">Chemistry (9701)</option>
                    <option value="Computer Science">Computer Science (9618)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {topicPresets[subject].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Easy Foundation">Easy Foundation</option>
                    <option value="Standard A-Level">Standard A-Level</option>
                    <option value="A* Exam Challenge">A* Exam Challenge</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Count</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value={3}>3 Questions (Quick Sprint)</option>
                    <option value={5}>5 Questions (Standard Practice)</option>
                    <option value={10}>10 Questions (Paper 1 Deep Dive)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateStandardQuiz}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Generating Cambridge Practice Questions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Generate & Start Quiz</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Remedial Quiz from Mistake Notebook ({mistakes.length} Logged Traps)
                </h2>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini AI will synthesize questions specifically targeting the exact misconceptions, calculation errors, or missed units previously logged in your Mistake Notebook.
              </p>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">Targeting Logged Errors in:</span>
                {mistakes.slice(0, 3).map((m) => (
                  <div key={m.id} className="text-slate-600 dark:text-slate-300 font-medium">
                    • {m.subject} - {m.topic}: <span className="text-amber-700 dark:text-amber-400">"{m.category}"</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateMistakesQuiz}
                disabled={isGenerating || mistakes.length === 0}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Remediation Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Targeted Remedial Quiz</span>
                  </>
                )}
              </button>
            </>
          )}

        </div>
      )}

      {/* ACTIVE QUIZ PLAYER */}
      {quizData && !isSubmitted && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-fadeIn">
          
          {/* Top Progress & Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                {quizData.subject} • {quizData.topic}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Question {currentQIndex + 1} of {quizData.questions.length}
              </h2>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Paper 1 Speed Practice</span>
            </div>
          </div>

          {/* Current Question */}
          {quizData.questions[currentQIndex] && (
            <div className="space-y-4">
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {quizData.questions[currentQIndex].question}
              </p>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {quizData.questions[currentQIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQIndex, optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation & Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {currentQIndex < quizData.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md"
                >
                  Submit & Score Quiz
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* QUIZ RESULTS BREAKDOWN */}
      {isSubmitted && quizData && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-fadeIn">
          
          <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Quiz Completed! Score: {score} / {quizData.questions.length} ({Math.round((score / quizData.questions.length) * 100)}%)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Result recorded to Nad e Ali's performance analytics and persistent profile.
            </p>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Detailed Examiner Review & Mark Schemes
            </h3>

            {quizData.questions.map((q, idx) => {
              const studentOpt = selectedAnswers[idx];
              const isCorrect = studentOpt === q.correctIndex;
              const hasSaved = savedMistakeIds.has(idx);

              return (
                <div
                  key={q.id || idx}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Q{idx + 1}. {q.question}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {isCorrect ? 'Correct [1 mark]' : 'Incorrect [0 marks]'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-600 dark:text-slate-400">
                      Your answer: <strong>{q.options[studentOpt] || 'None selected'}</strong>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Correct answer: {q.options[q.correctIndex]}
                      </p>
                    )}
                    <p className="text-slate-700 dark:text-slate-300 mt-2 bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                      💡 <strong>Examiner Note:</strong> {q.explanation}
                    </p>
                  </div>

                  {/* Add to Mistake Notebook Button if incorrect */}
                  {!isCorrect && (
                    <button
                      onClick={() => handleAddMistake(q, studentOpt, idx)}
                      disabled={hasSaved}
                      className={`mt-3 flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                        hasSaved
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {hasSaved ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved in Mistake Notebook</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Save to Mistake Notebook for Spaced Review</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setQuizData(null);
              setIsSubmitted(false);
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Take Another Practice Quiz
          </button>

        </div>
      )}

    </div>
  );
};

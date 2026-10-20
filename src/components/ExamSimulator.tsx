import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Timer,
  CheckCircle,
  Flag,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Award
} from 'lucide-react';
import { SubjectType } from '../types/academy';

interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ExamSimulator: React.FC = () => {
  const { recordQuizResult } = useAcademy();

  const [subject, setSubject] = useState<SubjectType>('Physics');
  const [paperCode, setPaperCode] = useState<string>('Paper 1 (MCQ)');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [examActive, setExamActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45 * 60);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Sample verified exam questions for simulation
  const examPool: Record<SubjectType, ExamQuestion[]> = {
    Physics: [
      {
        id: 1,
        question: "Which of the following contains two vectors and one scalar quantity?",
        options: ["A. Displacement, force, mass", "B. Velocity, acceleration, momentum", "C. Distance, speed, time", "D. Electric current, power, energy"],
        correctIndex: 0,
        explanation: "Displacement and force are vectors (magnitude + direction), while mass is a scalar."
      },
      {
        id: 2,
        question: "A stone is dropped from rest from the top of a 80 m cliff. Assuming g = 9.81 m s⁻² and air resistance is negligible, what is its speed just before impact?",
        options: ["A. 28.0 m s⁻¹", "B. 39.6 m s⁻¹", "C. 44.3 m s⁻¹", "D. 78.4 m s⁻¹"],
        correctIndex: 1,
        explanation: "v² = u² + 2as -> v² = 0 + 2(9.81)(80) = 1569.6 -> v = 39.6 m s⁻¹."
      },
      {
        id: 3,
        question: "A car of mass 1000 kg travelling at 20 m s⁻¹ decelerates uniformly to rest in 5.0 s. What is the average braking force?",
        options: ["A. 2000 N", "B. 4000 N", "C. 10000 N", "D. 20000 N"],
        correctIndex: 1,
        explanation: "a = (0 - 20)/5 = -4 m s⁻²; F = ma = 1000 * 4 = 4000 N."
      },
      {
        id: 4,
        question: "What is the SI base unit expression for the Newton (N)?",
        options: ["A. kg m s⁻¹", "B. kg m s⁻²", "C. kg m² s⁻²", "D. kg s⁻²"],
        correctIndex: 1,
        explanation: "From F = ma: [F] = [m][a] = kg m s⁻²."
      },
      {
        id: 5,
        question: "The power output of an engine is 40 kW when moving a car at a constant speed of 25 m s⁻¹. What is the total resistive force opposing motion?",
        options: ["A. 1000 N", "B. 1600 N", "C. 2500 N", "D. 6250 N"],
        correctIndex: 1,
        explanation: "P = Fv -> F = P / v = 40000 / 25 = 1600 N."
      }
    ],
    Chemistry: [
      {
        id: 1,
        question: "Which electronic configuration represents an atom in its ground state with the highest first ionisation energy?",
        options: ["A. 1s² 2s² 2p³", "B. 1s² 2s² 2p⁴", "C. 1s² 2s² 2p⁶ 3s¹", "D. 1s² 2s² 2p⁶ 3s² 3p¹"],
        correctIndex: 0,
        explanation: "Nitrogen (1s² 2s² 2p³) has a stable half-filled 2p subshell, giving it a higher 1st IE than Oxygen."
      },
      {
        id: 2,
        question: "What is the bond angle in a molecule of water (H2O)?",
        options: ["A. 180°", "B. 120°", "C. 109.5°", "D. 104.5°"],
        correctIndex: 3,
        explanation: "Water has 2 bonding pairs and 2 lone pairs. Lone-pair/lone-pair repulsion reduces tetrahedral 109.5° by ~5° to 104.5°."
      },
      {
        id: 3,
        question: "Calculate the amount in moles of hydrogen gas produced when 2.4 g of Magnesium (Ar = 24.3) reacts with excess hydrochloric acid.",
        options: ["A. 0.050 mol", "B. 0.099 mol", "C. 0.198 mol", "D. 0.500 mol"],
        correctIndex: 1,
        explanation: "Mg + 2HCl -> MgCl2 + H2. Moles Mg = 2.4 / 24.3 = 0.0988 mol. Ratio 1:1 -> 0.099 mol H2."
      },
      {
        id: 4,
        question: "Which of the following compounds exhibits hydrogen bonding between its molecules in the liquid state?",
        options: ["A. CH3OCH3", "B. CH3CH2OH", "C. CH3CH2Cl", "D. CH3CHO"],
        correctIndex: 1,
        explanation: "Ethanol (CH3CH2OH) has an O-H bond where hydrogen is bonded to strongly electronegative oxygen."
      },
      {
        id: 5,
        question: "In the ideal gas equation pV = nRT, what is the value and standard SI units of the gas constant R?",
        options: ["A. 8.314 J K⁻¹ mol⁻¹", "B. 8.314 kJ K⁻¹ mol⁻¹", "C. 0.0821 dm³ atm K⁻¹ mol⁻¹", "D. 6.02 × 10²³ mol⁻¹"],
        correctIndex: 0,
        explanation: "In Cambridge CIE 9701, R = 8.314 J K⁻¹ mol⁻¹."
      }
    ],
    'Computer Science': [
      {
        id: 1,
        question: "What is the two's complement 8-bit binary representation of the decimal integer -18?",
        options: ["A. 00010010", "B. 11101101", "C. 11101110", "D. 10010010"],
        correctIndex: 2,
        explanation: "+18 = 00010010 -> invert bits = 11101101 -> add 1 = 11101110."
      },
      {
        id: 2,
        question: "Which logic gate outputs 0 ONLY when both inputs are 1?",
        options: ["A. AND", "B. OR", "C. NAND", "D. NOR"],
        correctIndex: 2,
        explanation: "NAND is NOT-AND: 1 AND 1 = 1 -> inverted = 0. All other combinations give 1."
      },
      {
        id: 3,
        question: "During the Fetch-Execute cycle, which processor register holds the address of the next instruction to be fetched?",
        options: ["A. Current Instruction Register (CIR)", "B. Program Counter (PC)", "C. Memory Data Register (MDR)", "D. Accumulator (ACC)"],
        correctIndex: 1,
        explanation: "The Program Counter (PC) stores the memory address of the next instruction."
      },
      {
        id: 4,
        question: "What is the worst-case time complexity of Binary Search on a sorted array of N elements?",
        options: ["A. O(1)", "B. O(log N)", "C. O(N)", "D. O(N²)"],
        correctIndex: 1,
        explanation: "Binary search halves the search space each step, giving O(log N) time."
      },
      {
        id: 5,
        question: "According to De Morgan's Law, what is the simplified equivalent of (A . B)'?",
        options: ["A. A' . B'", "B. A' + B'", "C. (A + B)'", "D. A + B"],
        correctIndex: 1,
        explanation: "De Morgan's first theorem: (A . B)' = A' + B'."
      }
    ]
  };

  const currentQuestions = examPool[subject] || examPool.Physics;

  // Timer hook
  useEffect(() => {
    let interval: any = null;
    if (examActive && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examActive, isFinished, timeLeft]);

  const handleStartExam = () => {
    setTimeLeft(durationMinutes * 60);
    setExamActive(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
  };

  const handleFinishExam = () => {
    let correct = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });

    setScore(correct);
    setIsFinished(true);
    setExamActive(false);

    recordQuizResult({
      subject,
      topic: `${paperCode} Simulation`,
      score: correct,
      total: currentQuestions.length,
      percentage: Math.round((correct / currentQuestions.length) * 100),
      timeTaken: `${durationMinutes}m Exam`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2">
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>Full-Length Examination Simulator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Timed Cambridge Exam Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Realistic examination simulator with countdown timer, question flagging, navigation palette, and provisional marking.
              <span className="text-amber-600 dark:text-amber-400 font-semibold ml-1">
                (Note: Distinguishes AI simulation practice from official exam papers).
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Exam Configuration Screen */}
      {!examActive && !isFinished && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Configure Your Exam Paper
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Physics">Physics (9702)</option>
                <option value="Chemistry">Chemistry (9701)</option>
                <option value="Computer Science">Computer Science (9618)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Paper Component</label>
              <select
                value={paperCode}
                onChange={(e) => setPaperCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Paper 1 (MCQ)">Paper 1 (Multiple Choice)</option>
                <option value="Paper 2 (Structured)">Paper 2 (AS Structured)</option>
                <option value="Paper 4 (A2 Theory)">Paper 4 (A Level Structured)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Session Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value={15}>15 Minutes (Express Sprint)</option>
                <option value={45}>45 Minutes (Half-Paper Mock)</option>
                <option value={75}>75 Minutes (Standard Cambridge Paper 1 & 2)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">Exam Simulator Instructions:</h4>
            <p>1. Time runs continuously once started. Practice under strictly silent exam conditions.</p>
            <p>2. Use the question grid palette to skip, review, or flag challenging questions.</p>
            <p>3. Submit upon completion to receive instant breakdown, correct solutions, and examiner tips.</p>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Start Exam Simulation Now
          </button>
        </div>
      )}

      {/* ACTIVE TIMED EXAM INTERFACE */}
      {examActive && !isFinished && (
        <div className="space-y-4">
          
          {/* Sticky Timer Bar */}
          <div className="sticky top-16 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                {subject} • {paperCode}
              </span>
              <span className="text-xs text-slate-400">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-black ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-amber-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleFinishExam}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all"
              >
                Submit Paper
              </button>
            </div>
          </div>

          {/* Question Grid Palette */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Jump to:</span>
            {currentQuestions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isFlag = flagged[idx];
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative ${
                    isCurrent
                      ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1}
              </span>
              <button
                onClick={() => setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
                className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg border transition-all ${
                  flagged[currentIndex]
                    ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestions[currentIndex]?.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestions[currentIndex]?.options.map((opt, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(currentQuestions.length - 1, prev + 1))}
                disabled={currentIndex === currentQuestions.length - 1}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-30"
              >
                Next Question
              </button>
            </div>
          </div>

        </div>
      )}

      {/* EXAM RESULTS */}
      {isFinished && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-fadeIn">
          <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Exam Submission Complete: {score} / {currentQuestions.length} ({Math.round((score / currentQuestions.length) * 100)}%)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provisional Cambridge Simulation Grade: <strong className="text-amber-600 dark:text-amber-400 font-bold">{score >= 4 ? 'A*' : score >= 3 ? 'A' : 'B'}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Mark Scheme & Worked Solutions
            </h3>

            {currentQuestions.map((q, idx) => {
              const studentOpt = answers[idx];
              const isCorrect = studentOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
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
                      {isCorrect ? 'Mark Awarded [1]' : 'No Mark [0]'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Your choice: <strong>{q.options[studentOpt] || 'Unattempted'}</strong>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                      Mark Scheme Answer: {q.options[q.correctIndex]}
                    </p>
                  )}
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white/60 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setIsFinished(false);
              setExamActive(false);
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Take Another Exam Simulation
          </button>
        </div>
      )}

    </div>
  );
};

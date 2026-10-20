import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface CommandWord {
  word: string;
  definition: string;
  examinerExpectation: string;
  commonPitfalls: string;
  exampleQuestion: string;
  modelAnswerSnippet: string;
}

const commandWordsData: CommandWord[] = [
  {
    word: 'Define',
    definition: 'Give the precise meaning of a word, phrase, concept or physical quantity.',
    examinerExpectation:
      'Candidates must quote the formal, complete syllabus definition. Missing a qualifying phrase (such as "per unit mass" or "per unit positive charge") results in zero marks.',
    commonPitfalls:
      'Writing an informal descriptive statement instead of the formal equation in words. E.g., for Electric Field Strength, writing "the force on a charge" instead of "force per unit positive charge".',
    exampleQuestion: 'Define gravitational potential at a point. [2]',
    modelAnswerSnippet:
      'Work done per unit mass in bringing a point mass from infinity to the point. [2 marks]'
  },
  {
    word: 'Explain',
    definition: 'Set out purposes or reasons, make the relationships between things clear, provide the why and/or how and support with relevant evidence.',
    examinerExpectation:
      'Requires underlying scientific principles, cause-and-effect reasoning, or link between microscopic behavior and macroscopic observations.',
    commonPitfalls:
      'CONFUSING WITH "DESCRIBE". Describing what happens without explaining WHY it happens. Candidates state "the temperature increases" without stating "because average kinetic energy of molecules increases".',
    exampleQuestion: 'Explain why the pressure of a fixed mass of gas increases as its temperature increases at constant volume. [3]',
    modelAnswerSnippet:
      'Higher temperature -> increased average kinetic energy / speed of molecules [1]. More frequent collisions with container walls [1]. Greater change in momentum per collision, exerting a larger force per unit area [1].'
  },
  {
    word: 'Describe',
    definition: 'State the points of a topic or give characteristics and main features.',
    examinerExpectation:
      'Recall factual sequences, experimental procedures, appearances, or patterns on a graph. Explaining the underlying reason is NOT required unless combined with "and explain".',
    commonPitfalls:
      'Writing lengthy theoretical justifications when the examiner only wants what can be observed (e.g. colour changes, precipitate formation, meter readings).',
    exampleQuestion: 'Describe an experiment to determine the internal resistance of a cell using a voltmeter, ammeter, and variable resistor. [4]',
    modelAnswerSnippet:
      'Record terminal potential difference V across cell and current I for different resistance settings [1]. Plot a graph of V on y-axis against I on x-axis [1]. The gradient equals -r (internal resistance) [1]. The y-intercept gives the electromotive force E [1].'
  },
  {
    word: 'Calculate',
    definition: 'Work out from given facts, figures or information.',
    examinerExpectation:
      'Full numerical working shown, including equation, substitutions, final value with correct number of significant figures and appropriate SI units.',
    commonPitfalls:
      'Omission of units or wrong power-of-ten conversions (e.g., converting cm³ to m³ by dividing by 100 instead of 10⁶). Deducts 1 mark.',
    exampleQuestion: 'Calculate the de Broglie wavelength of an electron moving with speed 2.4 × 10⁶ m s⁻¹. [3]',
    modelAnswerSnippet:
      'λ = h / p = h / (m v) [1] = (6.63 × 10⁻³⁴) / (9.11 × 10⁻³¹ × 2.4 × 10⁶) [1] = 3.03 × 10⁻¹⁰ m [1].'
  },
  {
    word: 'State',
    definition: 'Express in clear terms; give a specific name, value or brief answer without explanation or calculation.',
    examinerExpectation:
      'Direct, concise response. Usually 1 mark. Do not waste time writing paragraphs.',
    commonPitfalls:
      'Over-answering and introducing contradictory statements that cancel out the mark.',
    exampleQuestion: 'State Newton’s first law of motion. [1]',
    modelAnswerSnippet:
      'An object continues at rest or uniform motion in a straight line unless acted upon by a resultant external force. [1 mark]'
  },
  {
    word: 'Suggest',
    definition: 'Apply biological/chemical/physical knowledge to situations where there are a range of valid responses to make proposals or put forward considerations.',
    examinerExpectation:
      'Tests problem-solving on novel, unseen scenarios. No single specific textbook answer exists; examiners accept any physically sound proposal.',
    commonPitfalls:
      'Leaving the question blank assuming it was not in the syllabus! Always apply first principles.',
    exampleQuestion: 'Suggest one reason why the experimentally determined enthalpy of combustion is less exothermic than the data book value. [1]',
    modelAnswerSnippet:
      'Heat loss to the surroundings / beaker, or incomplete combustion of the fuel resulting in carbon/carbon monoxide. [1 mark]'
  },
  {
    word: 'Deduce',
    definition: 'Draw conclusions from information provided, through logical reasoning or calculation.',
    examinerExpectation:
      'Stepwise logical inference connecting given data or graphs to a specific deduction.',
    commonPitfalls:
      'Writing an intuitive guess without referencing the specific data or graph provided.',
    exampleQuestion: 'From the data in Table 1.1, deduce the order of reaction with respect to reactant A. [2]',
    modelAnswerSnippet:
      'Comparing experiments 1 and 2: when conc of A doubles, rate quadruples (increases by 2² = 4) while conc of B is constant [1]. Therefore, reaction is second order with respect to A [1].'
  },
  {
    word: 'Show that',
    definition: 'Provide structured steps, equations, or reasoning leading to a specified result.',
    examinerExpectation:
      'Because the final answer is already given in the question, examiners award marks ENTIRELY for the intermediate steps and rigorous substitutions.',
    commonPitfalls:
      'Skipping steps or writing only the formula and the given answer. Candidates receive 0 marks if working is not completely clear and uninterrupted.',
    exampleQuestion: 'Show that the kinetic energy of a non-relativistic particle can be expressed as p² / (2m). [2]',
    modelAnswerSnippet:
      'EK = ½mv² [1]. Since momentum p = mv -> v = p / m [1]. EK = ½m(p/m)² = p² / (2m) [Q.E.D.].'
  }
];

const miniQuizQuestions = [
  {
    q: 'The examiner asks: "_______ why the resistance of a metallic conductor increases with increasing temperature." What command word is required?',
    options: ['Describe', 'Explain', 'State', 'Calculate'],
    correct: 1,
    reason: 'The question asks for the underlying cause/reason (lattice ions vibrate with greater amplitude, colliding more frequently with conduction electrons).'
  },
  {
    q: 'The examiner gives the numerical answer in the question and asks you to reach it step-by-step. What is this command word?',
    options: ['Deduce', 'Show that', 'Estimate', 'State'],
    correct: 1,
    reason: '"Show that" questions supply the target value to allow follow-through, but require every intermediate step to be demonstrated.'
  },
  {
    q: 'A question asks for "Work done per unit charge". Which command word precedes this type of syllabus definition?',
    options: ['Define', 'Calculate', 'Explain', 'Suggest'],
    correct: 0,
    reason: '"Define" requires the formal definition of a physical quantity (e.g. potential difference / electromotive force).'
  }
];

export const CommandWordsGuide: React.FC = () => {
  const [searchWord, setSearchWord] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const filtered = commandWordsData.filter((c) =>
    c.word.toLowerCase().includes(searchWord.toLowerCase()) ||
    c.definition.toLowerCase().includes(searchWord.toLowerCase())
  );

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === miniQuizQuestions[quizIndex].correct) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizIndex((quizIndex + 1) % miniQuizQuestions.length);
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cambridge International Examination Secrets</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              A* Command Words & Exam Technique Dictionary
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Understand exactly what CIE examiners look for with each command word. Avoid the classic traps that drop students from A* to B.
            </p>
          </div>

          <div className="relative shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search command words..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white/10 text-white placeholder:text-slate-400 border border-white/20 focus:outline-hidden focus:ring-1 focus:ring-amber-300 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE MINI-QUIZ: TEST YOUR COMMAND WORD RECOGNITION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Interactive Test: Identify Examiner Command Intent
            </h2>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
            Question {quizIndex + 1} of {miniQuizQuestions.length} • Score: {quizScore}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {miniQuizQuestions[quizIndex].q}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {miniQuizQuestions[quizIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === miniQuizQuestions[quizIndex].correct;

              let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-2.5 text-xs rounded-xl border transition-all text-center ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Examiner Rationale:</strong> {miniQuizQuestions[quizIndex].reason}
              </p>

              <button
                onClick={handleNextQuiz}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shrink-0"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COMMAND WORDS DIRECTORY */}
      <div className="space-y-4">
        {filtered.map((c, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={c.word}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {c.word[0]}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {c.word}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {c.definition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    CIE Standard
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 space-y-4 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                  {/* Cambridge Expectation */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] block">
                      What the Cambridge Examiner Expects
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {c.examinerExpectation}
                    </p>
                  </div>

                  {/* Common Pitfalls / Trap to Avoid */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>The #1 Trap Where Marks Are Lost</span>
                    </span>
                    <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                      {c.commonPitfalls}
                    </p>
                  </div>

                  {/* Real Cambridge Question & Model Answer */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cambridge Past Paper Question & Model Answer</span>
                    </span>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      <strong>Question:</strong> {c.exampleQuestion}
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 font-mono text-[11px] text-emerald-900 dark:text-emerald-200">
                      <strong>Examiner Model Answer:</strong> {c.modelAnswerSnippet}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

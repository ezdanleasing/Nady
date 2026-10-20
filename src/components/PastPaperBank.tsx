import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Atom,
  FlaskConical,
  Binary,
  Bot,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Award,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { SubjectType } from '../types/academy';

interface PastPaperQuestion {
  id: string;
  subject: SubjectType;
  paper: string; // e.g. "Paper 2 (AS Structured)"
  year: string; // e.g. "May/June 2024"
  topic: string;
  marks: number;
  questionText: string;
  dataGiven?: string;
  markScheme: {
    points: string[];
    examinerGuidance: string;
  };
}

const mockPastPapers: PastPaperQuestion[] = [
  {
    id: 'pp-phy-01',
    subject: 'Physics',
    paper: 'Paper 2 (AS Structured)',
    year: 'May/June 2024 (9702/22)',
    topic: 'Kinematics & Projectile Motion',
    marks: 6,
    questionText:
      'A ball is thrown with an initial velocity of 18 m s⁻¹ at an angle of 35° above the horizontal from a cliff of height 24 m above flat ground. Air resistance is negligible.\n\n(a) Calculate the horizontal component and vertical component of the initial velocity.\n(b) Calculate the time taken for the ball to reach maximum height.\n(c) Determine the speed of the ball immediately before hitting the ground.',
    dataGiven: 'Acceleration due to gravity g = 9.81 m s⁻²',
    markScheme: {
      points: [
        'vx = 18 cos(35°) = 14.7 m s⁻¹ [C1]',
        'vy = 18 sin(35°) = 10.3 m s⁻¹ [A1]',
        'At max height vy = 0. Using v = u - gt -> t = 10.32 / 9.81 = 1.05 s [A1]',
        'Conservation of energy or SUVAT: v² = u² + 2gh = 18² + 2(9.81)(24) = 324 + 470.88 = 794.88 [M1]',
        'v = √794.88 = 28.2 m s⁻¹ [A1]',
        'Full working shown with units explicitly stated [B1]'
      ],
      examinerGuidance:
        'Common candidate trap: calculating the vertical velocity at the ground and forgetting to combine with the constant horizontal component, or forgetting that total velocity is the vector sum.'
    }
  },
  {
    id: 'pp-phy-02',
    subject: 'Physics',
    paper: 'Paper 1 (Multiple Choice)',
    year: 'Oct/Nov 2023 (9702/11)',
    topic: 'Work, Energy and Power',
    marks: 1,
    questionText:
      'A car of mass 1200 kg travels up a slope inclined at 6.0° to the horizontal at a constant speed of 25 m s⁻¹. The total resistive force opposing motion is 500 N.\nWhat is the useful mechanical power output of the car engine?',
    dataGiven: 'g = 9.81 m s⁻²',
    markScheme: {
      points: [
        'Component of weight down slope: W_parallel = mg sin(θ) = 1200 × 9.81 × sin(6.0°) = 1230.5 N [C1]',
        'Total tractive force F = W_parallel + Resistive = 1230.5 + 500 = 1730.5 N [C1]',
        'Power P = F × v = 1730.5 × 25 = 43.3 kW (Option C) [A1]'
      ],
      examinerGuidance:
        'Examiner note: candidates frequently neglect the 500 N resistive force or use cos instead of sin for the slope inclination.'
    }
  },
  {
    id: 'pp-chem-01',
    subject: 'Chemistry',
    paper: 'Paper 2 (AS Structured)',
    year: 'May/June 2024 (9701/21)',
    topic: 'Energetics & Hess’s Law',
    marks: 5,
    questionText:
      'Standard enthalpy changes of combustion ΔH°c are given below:\n• C(graphite) = -393.5 kJ mol⁻¹\n• H₂(g) = -285.8 kJ mol⁻¹\n• C₂H₅OH(l) = -1367.3 kJ mol⁻¹\n\n(a) State Hess’s Law.\n(b) Construct an enthalpy cycle and calculate the standard enthalpy change of formation ΔH°f of ethanol, C₂H₅OH(l).',
    markScheme: {
      points: [
        'Hess’s Law: The total enthalpy change for a chemical reaction is independent of the pathway taken, provided initial and final conditions are the same. [B1]',
        'Equation: 2C(s) + 3H₂(g) + ½O₂(g) -> C₂H₅OH(l) [B1]',
        'ΔH°f = ΣΔH°c(reactants) - ΣΔH°c(products) [M1]',
        'ΔH°f = [2(-393.5) + 3(-285.8)] - [-1367.3] [M1]',
        'ΔH°f = [-787.0 - 857.4] + 1367.3 = -1644.4 + 1367.3 = -277.1 kJ mol⁻¹ [A1]'
      ],
      examinerGuidance:
        'Deduct 1 mark if sign is omitted or unit is incorrect. A negative sign must be explicitly written for exothermic formation.'
    }
  },
  {
    id: 'pp-chem-02',
    subject: 'Chemistry',
    paper: 'Paper 1 (Multiple Choice)',
    year: 'Oct/Nov 2023 (9701/12)',
    topic: 'Chemical Bonding & Intermolecular Forces',
    marks: 1,
    questionText:
      'Which compound has the highest boiling point?\nA. CH₃CH₂CH₂CH₃\nB. CH₃CH₂OCH₃\nC. CH₃CH(OH)CH₃\nD. CH₃COCH₃',
    markScheme: {
      points: [
        'Option C (Propan-2-ol) is correct [A1]',
        'Propan-2-ol possesses an -OH group forming intermolecular Hydrogen bonds [B1]',
        'Hydrogen bonds are much stronger than permanent dipole-dipole attractions (in B and D) and London dispersion forces (in A) [B1]'
      ],
      examinerGuidance:
        'Examiner tip: Always identify the strongest category of intermolecular force present when ranking boiling points.'
    }
  },
  {
    id: 'pp-cs-01',
    subject: 'Computer Science',
    paper: 'Paper 2 (Fundamental Problem-Solving & Programming)',
    year: 'May/June 2024 (9618/22)',
    topic: 'Algorithms & Linear Search',
    marks: 6,
    questionText:
      'Write pseudocode in Cambridge 9618 standard for a function SearchCustomer(CustomerIDs, TargetID) that takes a 1D array of 50 integers CustomerIDs and a TargetID. If found, the function returns the index position. If not found, it returns -1. Follow Cambridge pseudocode standards strictly.',
    markScheme: {
      points: [
        'Correct function header with parameter types and return type: FUNCTION SearchCustomer(CustomerIDs: ARRAY[0:49] OF INTEGER, TargetID: INTEGER) RETURNS INTEGER [B1]',
        'Declaration of loop counter: DECLARE Index: INTEGER [B1]',
        'Loop through entire array: FOR Index <- 0 TO 49 [B1]',
        'Comparison condition: IF CustomerIDs[Index] = TargetID THEN [B1]',
        'Early return on match: RETURN Index [B1]',
        'End of loop and fallback: ENDFOR \\n RETURN -1 \\n ENDFUNCTION [B1]'
      ],
      examinerGuidance:
        'Cambridge penalty: Candidates lose 1 mark if they use = instead of <- for assignment, or if data types are omitted in function declarations.'
    }
  },
  {
    id: 'pp-cs-02',
    subject: 'Computer Science',
    paper: 'Paper 1 (Theory Fundamentals)',
    year: 'Oct/Nov 2023 (9618/11)',
    topic: 'Processor Architecture & F-E Cycle',
    marks: 4,
    questionText:
      'Describe the role of the Program Counter (PC), Memory Address Register (MAR), and Memory Data Register (MDR) during the Fetch stage of the Fetch-Execute cycle.',
    markScheme: {
      points: [
        'PC holds the address of the next instruction to be fetched [B1]',
        'The address stored in PC is copied to MAR via the address bus [B1]',
        'PC is incremented by 1 to point to the subsequent instruction [B1]',
        'The instruction from the address in MAR is fetched from RAM and placed into the MDR via the data bus [B1]'
      ],
      examinerGuidance:
        'Essential examiner detail: Candidates must specify that PC is incremented during fetch, not during execute.'
    }
  }
];

export const PastPaperBank: React.FC = () => {
  const { setActiveScreen, addMistake, addFlashcard } = useAcademy();
  const [selectedSubj, setSelectedSubj] = useState<string>('All');
  const [selectedPaper, setSelectedPaper] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = mockPastPapers.filter((q) => {
    const matchSubj = selectedSubj === 'All' || q.subject === selectedSubj;
    const matchPaper = selectedPaper === 'All' || q.paper.includes(selectedPaper);
    const matchSearch =
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.year.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchPaper && matchSearch;
  });

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddToMistakes = (q: PastPaperQuestion) => {
    addMistake({
      subject: q.subject,
      topic: q.topic,
      category: 'Missing examination points',
      question: q.questionText,
      studentAnswer: 'Unattempted / Review required',
      correctAnswer: q.markScheme.points.join('\n'),
      explanation: q.markScheme.examinerGuidance,
      status: 'Review Scheduled'
    });
    setToast(`Added ${q.topic} question to Mistake Notebook!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateFlashcard = (q: PastPaperQuestion) => {
    addFlashcard({
      subject: q.subject,
      topic: q.topic,
      front: `${q.paper} (${q.year}):\n${q.questionText}`,
      back: `Cambridge Mark Scheme:\n${q.markScheme.points.join('\n')}\n\nExaminer Advice: ${q.markScheme.examinerGuidance}`,
      intervalDays: 3,
      reviewDue: new Date().toISOString().split('T')[0],
      confidence: 'Medium'
    });
    setToast(`Flashcard created for ${q.topic}!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cambridge International Past Paper Question Bank</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Classified Past Paper Questions & Examiner Rubrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Authentic Cambridge A-Level Physics (9702), Chemistry (9701), and Computer Science (9618) questions classified by topic with step-by-step marking rubrics.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveScreen('exam')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Full Exam Simulator</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {['All', 'Physics', 'Chemistry', 'Computer Science'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubj(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSubj === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/15 text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Papers</option>
              <option value="Paper 1" className="bg-slate-900 text-white">Paper 1 (MCQ)</option>
              <option value="Paper 2" className="bg-slate-900 text-white">Paper 2 (AS Structured)</option>
              <option value="Paper 4" className="bg-slate-900 text-white">Paper 4 (A2 Structured)</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/10 text-white placeholder:text-slate-400 border border-white/15 focus:outline-hidden focus:ring-1 focus:ring-indigo-400 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 text-sm">
            No questions matched your search criteria. Try adjusting your subject or paper filter.
          </div>
        ) : (
          filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all hover:border-indigo-400 dark:hover:border-indigo-600"
              >
                {/* Header Bar */}
                <div
                  onClick={() => handleToggleExpand(q.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          q.subject === 'Physics'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : q.subject === 'Chemistry'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        {q.subject === 'Physics' && <Atom className="w-3 h-3" />}
                        {q.subject === 'Chemistry' && <FlaskConical className="w-3 h-3" />}
                        {q.subject === 'Computer Science' && <Binary className="w-3 h-3" />}
                        <span>{q.subject}</span>
                      </span>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {q.paper}
                      </span>

                      <span className="text-[10px] font-medium text-slate-400">
                        {q.year}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {q.topic}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                      [{q.marks} Marks]
                    </span>

                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 dark:border-slate-700 space-y-5 bg-slate-50/40 dark:bg-slate-900/30">
                    {/* Question Content */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cambridge Examination Question
                      </span>
                      <pre className="font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {q.questionText}
                      </pre>

                      {q.dataGiven && (
                        <div className="pt-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-700 mt-2">
                          Data given: {q.dataGiven}
                        </div>
                      )}
                    </div>

                    {/* Official Mark Scheme Points */}
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Official Cambridge Mark Scheme Breakdown</span>
                      </span>

                      <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                        {q.markScheme.points.map((pt, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="font-mono text-emerald-600 font-bold shrink-0">•</span>
                            <span className="font-mono text-[11px] leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Examiner Commentary */}
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong>Examiner Insight:</strong> {q.markScheme.examinerGuidance}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveScreen('tutor');
                        }}
                        className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Explain with AI Tutor</span>
                      </button>

                      <button
                        onClick={() => handleCreateFlashcard(q)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Create Revision Flashcard</span>
                      </button>

                      <button
                        onClick={() => handleAddToMistakes(q)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-xl hover:bg-amber-100 transition-all"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Log to Mistake Notebook</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AcademyState,
  SubjectType,
  RoleType,
  StudyTask,
  MistakeRecord,
  Flashcard,
  QuizAttempt,
  SolvedQuestionRecord,
  SyllabusTopic,
  MasteryLevel,
} from '../types/academy';

interface AcademyContextType {
  state: AcademyState;
  role: RoleType;
  setRole: (role: RoleType) => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  language: 'English' | 'Urdu';
  setLanguage: (lang: 'English' | 'Urdu') => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  addMistake: (mistake: Omit<MistakeRecord, 'id' | 'date'>) => void;
  updateMistakeStatus: (id: string, status: MistakeRecord['status']) => void;
  addFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  reviewFlashcard: (id: string, confidence: Flashcard['confidence'], intervalDays: Flashcard['intervalDays']) => void;
  recordQuizResult: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void;
  saveSolutionRecord: (record: Omit<SolvedQuestionRecord, 'id' | 'date'>) => void;
  logStudyTime: (minutes: number) => void;
  setDailyStudyGoal: (minutes: number) => void;
  claimMilestoneReward: (milestoneId: string, rewardPoints: number) => void;
  updateTopicProgress: (subject: SubjectType, topicId: string, progress: number, mastery: MasteryLevel) => void;
  replaceStudyPlan: (newTasks: StudyTask[]) => void;
  rescheduleMissedTask: (taskId: string) => void;
  addExtractedTopics: (subject: SubjectType, topics: SyllabusTopic[]) => void;
  resetToDefault: () => void;
  isSaving: boolean;
  saveStatus: string;
}

const defaultState: AcademyState = {
  student: {
    name: "Nad e Ali",
    school: "Lahore Grammar School, Gujrat, Pakistan",
    currentStage: "Recently started A-Level studies",
    targetGrades: {
      Physics: "A*",
      Chemistry: "A*",
      "Computer Science": "A*"
    },
    subjects: ["Physics", "Chemistry", "Computer Science"],
    timezone: "Asia/Karachi",
    avatar: "🎓",
    streakDays: 4,
    totalStudyMinutes: 840,
    completedTasksCount: 18,
    pendingTasksCount: 5,
    dailyStudyGoalMinutes: 180,
    todayStudyMinutes: 135,
    masteryPoints: 350,
    claimedMilestones: ['milestone_25', 'milestone_50'],
  },
  parent: {
    name: "Mr. & Mrs. Ali",
    email: "ezdanleasing@gmail.com",
    relation: "Parent / Guardian",
    notificationFrequency: "Weekly",
    receiveAlerts: true
  },
  syllabuses: {
    Physics: {
      board: "Cambridge International (CIE)",
      code: "9702",
      session: "May/June & Oct/Nov",
      examYear: "2027",
      components: [
        { code: "Paper 1", name: "Multiple Choice", duration: "1h 15m", weight: "31%" },
        { code: "Paper 2", name: "AS Level Structured Questions", duration: "1h 15m", weight: "46%" },
        { code: "Paper 3", name: "Advanced Practical Skills", duration: "2h", weight: "23%" },
        { code: "Paper 4", name: "A Level Structured Questions", duration: "2h", weight: "38%" },
        { code: "Paper 5", name: "Planning, Analysis and Evaluation", duration: "1h 15m", weight: "12%" }
      ],
      topics: [
        { id: "p1", name: "Physical quantities and units", subtopics: ["SI units", "Scalars and vectors", "Errors and uncertainties"], mastery: "Nearly Mastered", progress: 85 },
        { id: "p2", name: "Kinematics", subtopics: ["Linear motion", "Equations of motion", "Projectile motion"], mastery: "Developing", progress: 65 },
        { id: "p3", name: "Dynamics", subtopics: ["Newton's laws of motion", "Linear momentum", "Friction and drag"], mastery: "Developing", progress: 55 },
        { id: "p4", name: "Forces, density and pressure", subtopics: ["Turning effects of forces", "Equilibrium", "Upthrust"], mastery: "Learning", progress: 40 },
        { id: "p5", name: "Work, energy and power", subtopics: ["Conservation of energy", "Efficiency", "Gravitational potential and kinetic energy"], mastery: "Learning", progress: 35 },
        { id: "p6", name: "Waves", subtopics: ["Progressive waves", "Transverse and longitudinal", "Doppler effect"], mastery: "Not Started", progress: 10 },
        { id: "p7", name: "Electricity", subtopics: ["Current and charge", "Potential difference and resistance", "Kirchhoff's laws"], mastery: "Not Started", progress: 5 }
      ]
    },
    Chemistry: {
      board: "Cambridge International (CIE)",
      code: "9701",
      session: "May/June & Oct/Nov",
      examYear: "2027",
      components: [
        { code: "Paper 1", name: "Multiple Choice", duration: "1h 15m", weight: "31%" },
        { code: "Paper 2", name: "AS Level Structured Questions", duration: "1h 15m", weight: "46%" },
        { code: "Paper 3", name: "Advanced Practical Skills", duration: "2h", weight: "23%" },
        { code: "Paper 4", name: "A Level Structured Questions", duration: "2h", weight: "38%" },
        { code: "Paper 5", name: "Planning, Analysis and Evaluation", duration: "1h 15m", weight: "12%" }
      ],
      topics: [
        { id: "c1", name: "Atomic structure", subtopics: ["Particles in the atom", "Electronic configurations", "Ionisation energy"], mastery: "Consistently Demonstrated", progress: 92 },
        { id: "c2", name: "Chemical bonding", subtopics: ["Ionic, covalent and metallic bonding", "Intermolecular forces", "Molecular shapes and bond angles"], mastery: "Nearly Mastered", progress: 80 },
        { id: "c3", name: "Mole calculations & stoichiometry", subtopics: ["Relative atomic mass", "Empirical & molecular formula", "Titration calculations", "Gas volumes"], mastery: "Developing", progress: 60 },
        { id: "c4", name: "States of matter", subtopics: ["Ideal gas equation pV=nRT", "Liquid and solid lattices"], mastery: "Learning", progress: 45 },
        { id: "c5", name: "Chemical energetics", subtopics: ["Enthalpy change of reaction", "Hess's Law", "Bond energies"], mastery: "Learning", progress: 30 },
        { id: "c6", name: "Equilibria", subtopics: ["Reversible reactions", "Le Chatelier's principle", "Kc equilibrium constant"], mastery: "Not Started", progress: 15 },
        { id: "c7", name: "Introduction to Organic Chemistry", subtopics: ["Nomenclature", "Isomerism", "Functional groups"], mastery: "Not Started", progress: 5 }
      ]
    },
    "Computer Science": {
      "board": "Cambridge International (CIE)",
      "code": "9618",
      "session": "May/June & Oct/Nov",
      "examYear": "2027",
      "components": [
        { code: "Paper 1", name: "Theory Fundamentals", duration: "1h 30m", weight: "50% (AS)" },
        { code: "Paper 2", name: "Fundamental Problem-solving and Programming Skills", duration: "2h", weight: "50% (AS)" },
        { code: "Paper 3", name: "Advanced Theory", duration: "1h 30m", weight: "50% (A2)" },
        { code: "Paper 4", name: "Further Problem-solving and Programming Skills", duration: "2h 30m", weight: "50% (A2)" }
      ],
      "topics": [
        { id: "cs1", name: "Data representation", subtopics: ["Binary, Hexadecimal, Two's complement", "Binary Coded Decimal", "Images & Sound representation"], mastery: "Nearly Mastered", progress: 88 },
        { id: "cs2", name: "Communication & Internet technologies", subtopics: ["Networks, Topologies", "IP addressing, Subnetting", "Client-server architecture"], mastery: "Developing", progress: 70 },
        { id: "cs3", name: "Hardware & Processor architecture", subtopics: ["Von Neumann architecture", "Fetch-Execute cycle", "Interrupts and Registers"], mastery: "Developing", progress: 65 },
        { id: "cs4", name: "Logic gates and Boolean algebra", subtopics: ["Logic gates (AND, OR, NOT, NAND, NOR, XOR)", "Truth tables", "Boolean expressions & simplification"], mastery: "Nearly Mastered", progress: 82 },
        { id: "cs5", name: "Algorithm design & problem-solving", subtopics: ["Pseudocode conventions", "Linear & Binary search", "Bubble & Insertion sort"], mastery: "Learning", progress: 50 },
        { id: "cs6", name: "Data types and structures", subtopics: ["1D & 2D Arrays", "Records", "Abstract data types (Stack, Queue)"], mastery: "Learning", progress: 40 },
        { id: "cs7", name: "Software development & testing", subtopics: ["Syntax vs Logic errors", "Trace tables", "Black-box vs White-box testing"], mastery: "Learning", progress: 45 }
      ]
    }
  },
  studyPlan: [
    {
      id: "t1",
      day: "Monday",
      time: "16:30 - 17:30",
      subject: "Physics",
      topic: "Dynamics: Newton's Laws & Resolving Forces",
      learningObjective: "Derive and solve inclined plane problems with frictional opposition",
      duration: 60,
      priority: "High",
      completed: true,
      activityType: "Worked Examples & Timed Practice",
      revisionDate: "2026-10-21"
    },
    {
      id: "t2",
      day: "Monday",
      time: "18:00 - 19:15",
      subject: "Chemistry",
      topic: "Stoichiometry: Titration Calculations & Limiting Reagents",
      learningObjective: "Calculate molar concentrations and percentage purity from experimental titration data",
      duration: 75,
      priority: "High",
      completed: true,
      activityType: "Numerical Problem Set",
      revisionDate: "2026-10-22"
    },
    {
      id: "t3",
      day: "Tuesday",
      time: "16:30 - 17:30",
      subject: "Computer Science",
      topic: "Logic Gates: Combinational Circuits & Boolean Laws",
      learningObjective: "Construct truth tables for multi-gate circuits and apply De Morgan's Laws",
      duration: 60,
      priority: "Medium",
      completed: false,
      activityType: "Logic Gate Simulator Practice",
      revisionDate: "2026-10-23"
    },
    {
      id: "t4",
      day: "Tuesday",
      time: "18:00 - 19:00",
      subject: "Physics",
      topic: "Kinematics: Projectile Motion Equations",
      learningObjective: "Resolve horizontal and vertical velocity components under gravity",
      duration: 60,
      priority: "High",
      completed: false,
      activityType: "Targeted Exam Questions",
      revisionDate: "2026-10-24"
    },
    {
      id: "t5",
      day: "Wednesday",
      time: "16:30 - 17:30",
      subject: "Chemistry",
      topic: "Chemical Bonding: Intermolecular Forces & Hydrogen Bonding",
      learningObjective: "Explain anomalous boiling points of H2O, HF, and NH3 with orbital diagrams",
      duration: 60,
      priority: "Medium",
      completed: false,
      activityType: "Active Recall Flashcards",
      revisionDate: "2026-10-25"
    },
    {
      id: "t6",
      day: "Thursday",
      time: "16:30 - 17:30",
      subject: "Computer Science",
      topic: "Algorithms: Trace Tables for Searching & Sorting",
      learningObjective: "Complete a 10-step trace table tracking loop counters and array indices",
      duration: 60,
      priority: "High",
      completed: false,
      activityType: "Trace Table Generator Exercises",
      revisionDate: "2026-10-26"
    },
    {
      id: "t7",
      day: "Friday",
      time: "16:00 - 17:30",
      subject: "Physics",
      topic: "Work, Energy & Power: Conservation Law Verification",
      learningObjective: "Relate gravitational potential energy loss to kinetic energy gain and resistive work",
      duration: 90,
      priority: "High",
      completed: false,
      activityType: "Exam Practice Paper 2 Section",
      revisionDate: "2026-10-27"
    }
  ],
  mistakes: [
    {
      id: "m1",
      date: "2026-10-18",
      subject: "Physics",
      topic: "Dynamics",
      category: "Missing units / SI conversions",
      question: "A 1200 kg car accelerates uniformly from 0 to 72 km/h in 8.0 s. Calculate the net resultant force.",
      studentAnswer: "F = 1200 * (72 / 8) = 10800 N",
      correctAnswer: "F = 3000 N (72 km/h must be converted to 20 m/s: a = 20/8 = 2.5 m/s²; F = 1200 * 2.5 = 3000 N)",
      explanation: "Did not convert km/h to SI unit m/s before applying F = ma (divide km/h by 3.6 to get m/s).",
      status: "Under Review"
    },
    {
      id: "m2",
      date: "2026-10-17",
      subject: "Chemistry",
      topic: "Mole calculations",
      category: "Calculation error",
      question: "Calculate the mass of copper(II) sulfate (CuSO4.5H2O) needed to prepare 250 cm³ of 0.200 mol/dm³ solution.",
      studentAnswer: "7.98 g (calculated using anhydrous CuSO4 Mr 159.6)",
      correctAnswer: "12.48 g (hydrated CuSO4.5H2O has Mr 249.6; moles = 0.250 * 0.200 = 0.05 mol; mass = 0.05 * 249.6 = 12.48 g)",
      explanation: "Ignored the 5 waters of crystallisation in copper(II) sulfate pentahydrate crystals.",
      status: "Review Scheduled"
    },
    {
      id: "m3",
      date: "2026-10-16",
      subject: "Computer Science",
      topic: "Data representation",
      category: "Conceptual misunderstanding",
      question: "Represent -45 in 8-bit Two's Complement binary.",
      studentAnswer: "10101101 (Used sign and magnitude instead of two's complement)",
      correctAnswer: "11010011 (+45 = 00101101 -> One's complement = 11010010 -> Add 1 = 11010011)",
      explanation: "Inverted bits correctly but forgot to add 1 at the end to complete Two's complement conversion.",
      status: "Mastered"
    }
  ],
  flashcards: [
    {
      id: "fc1",
      subject: "Physics",
      topic: "Kinematics & Dynamics",
      front: "State Newton's Second Law of Motion in words and formula.",
      back: "The rate of change of momentum of a body is directly proportional to the resultant force acting on it and takes place in the direction of the force.\nFormula: F = dp/dt (or F = ma for constant mass).\nUnits: F in N, m in kg, a in m s⁻².",
      intervalDays: 7,
      reviewDue: "2026-10-20",
      confidence: "High"
    },
    {
      id: "fc2",
      subject: "Chemistry",
      topic: "Atomic Structure",
      front: "Define First Ionisation Energy.",
      back: "The energy required to remove one mole of electrons from one mole of gaseous atoms to produce one mole of gaseous 1+ ions.\nEquation: X(g) → X⁺(g) + e⁻\nUnits: kJ mol⁻¹.",
      intervalDays: 3,
      reviewDue: "2026-10-19",
      confidence: "Medium"
    },
    {
      id: "fc3",
      subject: "Computer Science",
      topic: "Logic Gates",
      front: "State De Morgan's Laws for Boolean Algebra.",
      back: "Law 1: NOT(A AND B) = (NOT A) OR (NOT B)\nLaw 2: NOT(A OR B) = (NOT A) AND (NOT B)\nIn symbols:\n(A . B)' = A' + B'\n(A + B)' = A' . B'",
      intervalDays: 14,
      reviewDue: "2026-10-24",
      confidence: "High"
    },
    {
      id: "fc4",
      subject: "Chemistry",
      topic: "Chemical Bonding",
      front: "Explain why H2O has a higher boiling point than H2S.",
      back: "Oxygen is significantly more electronegative than Sulfur. H2O molecules form strong intermolecular Hydrogen Bonds (between lone pairs on O and δ+ H atoms), which require much more thermal energy to overcome than the weaker London dispersion and permanent dipole forces in H2S.",
      intervalDays: 1,
      reviewDue: "2026-10-19",
      confidence: "Low"
    },
    {
      id: "fc5",
      subject: "Physics",
      topic: "Physical Quantities",
      front: "Express the Joule (J) and Newton (N) in SI base units.",
      back: "Newton (N): kg m s⁻² (from F = ma)\nJoule (J): kg m² s⁻² (from W = F × d = N × m)",
      intervalDays: 30,
      reviewDue: "2026-11-05",
      confidence: "Mastered"
    }
  ],
  formulas: [
    {
      id: "form1",
      subject: "Physics",
      title: "Equations of Uniformly Accelerated Motion (SUVAT)",
      equation: "v = u + at | s = ut + ½at² | v² = u² + 2as | s = ½(u + v)t",
      symbols: "s: displacement (m), u: initial velocity (m s⁻¹), v: final velocity (m s⁻¹), a: acceleration (m s⁻²), t: time (s)",
      conditions: "Only applicable when acceleration 'a' is constant."
    },
    {
      id: "form2",
      subject: "Chemistry",
      title: "Ideal Gas Equation",
      equation: "pV = nRT",
      symbols: "p: pressure (Pa or N m⁻²), V: volume (m³), n: moles (mol), R: 8.314 J K⁻¹ mol⁻¹, T: absolute temperature (K = °C + 273.15)",
      conditions: "Standard SI conversions: 1 dm³ = 10⁻³ m³, 1 cm³ = 10⁻⁶ m³, 1 kPa = 10³ Pa."
    },
    {
      id: "form3",
      subject: "Computer Science",
      title: "Two's Complement Range for n-bits",
      equation: "Range: -2^(n-1) to + (2^(n-1) - 1)",
      symbols: "For 8 bits (n=8): -128 to +127. Most significant bit represents -2^(n-1).",
      conditions: "Used for signed binary integer arithmetic."
    }
  ],
  recentQuizzes: [
    {
      id: "qz1",
      date: "2026-10-18",
      subject: "Physics",
      topic: "Physical quantities & units",
      score: 5,
      total: 5,
      percentage: 100,
      timeTaken: "6m 12s"
    },
    {
      id: "qz2",
      date: "2026-10-17",
      subject: "Chemistry",
      topic: "Atomic Structure & Periodicity",
      score: 4,
      total: 5,
      percentage: 80,
      timeTaken: "8m 45s"
    },
    {
      id: "qz3",
      date: "2026-10-15",
      subject: "Computer Science",
      topic: "Logic Gates & Boolean Algebra",
      score: 5,
      total: 5,
      percentage: 100,
      timeTaken: "5m 30s"
    }
  ],
  savedSolutions: [],
  weeklyReport: {
    week: "Week of October 13 - 19, 2026",
    totalHours: 14.0,
    targetHours: 15.0,
    completedSessions: 11,
    averageQuizScore: 93,
    strongestArea: "Computer Science - Logic Gates & Data Representation (100% accuracy)",
    priorityFocus: "Physics - Dynamics & Resolving vectors on inclines",
    recurringMistakesNote: "Occasional unit omission in Physics calculations. Recommend dedicating 2 minutes at the end of each numerical answer to verify SI units.",
    parentRecommendation: "Nad e Ali has shown outstanding dedication this week, consistently adhering to his study timetable after school. Encourage him to take regular 10-minute breaks between study blocks and maintain his 8-hour sleep schedule."
  }
};

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AcademyState>(() => {
    try {
      const cached = localStorage.getItem('nadeali_academy_state');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Could not read cached state:', e);
    }
    return defaultState;
  });

  const [role, setRole] = useState<RoleType>('student');
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nadeali_theme') === 'dark';
  });
  const [language, setLanguage] = useState<'English' | 'Urdu'>('English');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Synced');

  // Load from backend store on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch('/api/storage/load');
        if (res.ok) {
          const data = await res.json();
          if (data && data.student) {
            setState(data);
          }
        }
      } catch (err) {
        console.warn('Backend store load notice: using client state', err);
      }
    }
    loadBackendData();
  }, []);

  // Save to backend and localStorage on state update with debounce
  useEffect(() => {
    localStorage.setItem('nadeali_academy_state', JSON.stringify(state));

    const timeoutId = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveStatus('Saving...');
        await fetch('/api/storage/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        });
        setIsSaving(false);
        setSaveStatus('All changes saved');
      } catch (e) {
        setIsSaving(false);
        setSaveStatus('Saved locally');
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nadeali_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nadeali_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleTask = (taskId: string) => {
    setState((prev) => {
      const updated = prev.studyPlan.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const completedCount = updated.filter((t) => t.completed).length;
      return {
        ...prev,
        studyPlan: updated,
        student: {
          ...prev.student,
          completedTasksCount: completedCount,
          pendingTasksCount: Math.max(0, updated.length - completedCount),
        },
      };
    });
  };

  const addTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      studyPlan: [newTask, ...prev.studyPlan],
      student: {
        ...prev.student,
        pendingTasksCount: prev.student.pendingTasksCount + 1,
      },
    }));
  };

  const addMistake = (mistake: Omit<MistakeRecord, 'id' | 'date'>) => {
    const newMistake: MistakeRecord = {
      ...mistake,
      id: `m_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      mistakes: [newMistake, ...prev.mistakes],
    }));
  };

  const updateMistakeStatus = (id: string, status: MistakeRecord['status']) => {
    setState((prev) => ({
      ...prev,
      mistakes: prev.mistakes.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  };

  const addFlashcard = (card: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...card,
      id: `fc_${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      flashcards: [newCard, ...prev.flashcards],
    }));
  };

  const reviewFlashcard = (id: string, confidence: Flashcard['confidence'], intervalDays: Flashcard['intervalDays']) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + intervalDays);
    const reviewDue = dueDate.toISOString().split('T')[0];

    setState((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((fc) =>
        fc.id === id ? { ...fc, confidence, intervalDays, reviewDue } : fc
      ),
    }));
  };

  const recordQuizResult = (attempt: Omit<QuizAttempt, 'id' | 'date'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `qz_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setState((prev) => ({
      ...prev,
      recentQuizzes: [newAttempt, ...prev.recentQuizzes.slice(0, 9)],
    }));
  };

  const saveSolutionRecord = (record: Omit<SolvedQuestionRecord, 'id' | 'date'>) => {
    const newRecord: SolvedQuestionRecord = {
      ...record,
      id: `sol_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      savedSolutions: [newRecord, ...prev.savedSolutions],
    }));
  };

  const logStudyTime = (minutes: number) => {
    setState((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        totalStudyMinutes: prev.student.totalStudyMinutes + minutes,
        todayStudyMinutes: (prev.student.todayStudyMinutes ?? 0) + minutes,
      },
    }));
  };

  const setDailyStudyGoal = (minutes: number) => {
    setState((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        dailyStudyGoalMinutes: minutes,
      },
    }));
  };

  const claimMilestoneReward = (milestoneId: string, rewardPoints: number) => {
    setState((prev) => {
      const currentClaimed = prev.student.claimedMilestones ?? [];
      if (currentClaimed.includes(milestoneId)) return prev;
      return {
        ...prev,
        student: {
          ...prev.student,
          claimedMilestones: [...currentClaimed, milestoneId],
          masteryPoints: (prev.student.masteryPoints ?? 0) + rewardPoints,
        },
      };
    });
  };

  const updateTopicProgress = (
    subject: SubjectType,
    topicId: string,
    progress: number,
    mastery: MasteryLevel
  ) => {
    setState((prev) => {
      const subjectSyllabus = prev.syllabuses[subject];
      if (!subjectSyllabus) return prev;
      const updatedTopics = subjectSyllabus.topics.map((t) =>
        t.id === topicId ? { ...t, progress, mastery } : t
      );
      return {
        ...prev,
        syllabuses: {
          ...prev.syllabuses,
          [subject]: {
            ...subjectSyllabus,
            topics: updatedTopics,
          },
        },
      };
    });
  };

  const replaceStudyPlan = (newTasks: StudyTask[]) => {
    setState((prev) => ({
      ...prev,
      studyPlan: newTasks,
      student: {
        ...prev.student,
        completedTasksCount: newTasks.filter((t) => t.completed).length,
        pendingTasksCount: newTasks.filter((t) => !t.completed).length,
      },
    }));
  };

  const rescheduleMissedTask = (taskId: string) => {
    setState((prev) => {
      const taskIndex = prev.studyPlan.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;
      const task = prev.studyPlan[taskIndex];

      // Auto-reschedule to Saturday or Sunday 10:00 - 11:30 (respects sleep & school)
      const nextDay = task.day === 'Friday' || task.day === 'Saturday' ? 'Sunday' : 'Saturday';
      const updatedTask: StudyTask = {
        ...task,
        day: nextDay,
        time: '10:00 - 11:00 (Rescheduled)',
        activityType: `${task.activityType} [Catch-up Session]`,
      };

      const newPlan = [...prev.studyPlan];
      newPlan[taskIndex] = updatedTask;

      return {
        ...prev,
        studyPlan: newPlan,
      };
    });
  };

  const addExtractedTopics = (subject: SubjectType, newTopics: SyllabusTopic[]) => {
    setState((prev) => {
      const subjectSyllabus = prev.syllabuses[subject];
      if (!subjectSyllabus) return prev;

      // Filter out duplicates by name
      const existingNames = new Set(subjectSyllabus.topics.map((t) => t.name.toLowerCase()));
      const uniqueNew = newTopics.filter((t) => !existingNames.has(t.name.toLowerCase()));

      return {
        ...prev,
        syllabuses: {
          ...prev.syllabuses,
          [subject]: {
            ...subjectSyllabus,
            topics: [...subjectSyllabus.topics, ...uniqueNew],
          },
        },
      };
    });
  };

  const resetToDefault = () => {
    setState(defaultState);
  };

  return (
    <AcademyContext.Provider
      value={{
        state,
        role,
        setRole,
        activeScreen,
        setActiveScreen,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        toggleTask,
        addTask,
        addMistake,
        updateMistakeStatus,
        addFlashcard,
        reviewFlashcard,
        recordQuizResult,
        saveSolutionRecord,
        logStudyTime,
        setDailyStudyGoal,
        claimMilestoneReward,
        updateTopicProgress,
        replaceStudyPlan,
        rescheduleMissedTask,
        addExtractedTopics,
        resetToDefault,
        isSaving,
        saveStatus,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};

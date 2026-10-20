export type SubjectType = 'Physics' | 'Chemistry' | 'Computer Science';

export type RoleType = 'student' | 'parent';

export type MasteryLevel = 
  | 'Not Started' 
  | 'Learning' 
  | 'Developing' 
  | 'Nearly Mastered' 
  | 'Consistently Demonstrated';

export type ErrorCategory =
  | 'Conceptual misunderstanding'
  | 'Calculation error'
  | 'Incorrect formula'
  | 'Missing units / SI conversions'
  | 'Incorrect definition'
  | 'Misreading a question'
  | 'Programming logic'
  | 'Syntax error'
  | 'Missing examination points';

export interface StudentProfile {
  name: string;
  school: string;
  currentStage: string;
  targetGrades: Record<SubjectType, string>;
  subjects: SubjectType[];
  timezone: string;
  avatar: string;
  streakDays: number;
  totalStudyMinutes: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  dailyStudyGoalMinutes?: number;
  todayStudyMinutes?: number;
  masteryPoints?: number;
  claimedMilestones?: string[];
}

export interface ParentProfile {
  name: string;
  email: string;
  relation: string;
  notificationFrequency: 'Daily' | 'Weekly' | 'Bi-weekly';
  receiveAlerts: boolean;
}

export interface SyllabusComponent {
  code: string;
  name: string;
  duration: string;
  weight: string;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  subtopics: string[];
  mastery: MasteryLevel;
  progress: number; // 0 - 100
}

export interface SubjectSyllabus {
  board: string;
  code: string;
  session: string;
  examYear: string;
  components: SyllabusComponent[];
  topics: SyllabusTopic[];
}

export interface StudyTask {
  id: string;
  day: string;
  time: string;
  subject: SubjectType;
  topic: string;
  learningObjective: string;
  duration: number; // in minutes
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  activityType: string;
  revisionDate: string;
}

export interface MistakeRecord {
  id: string;
  date: string;
  subject: SubjectType;
  topic: string;
  category: ErrorCategory;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  status: 'Under Review' | 'Review Scheduled' | 'Mastered';
}

export interface Flashcard {
  id: string;
  subject: SubjectType;
  topic: string;
  front: string;
  back: string;
  intervalDays: 1 | 3 | 7 | 14 | 30;
  reviewDue: string;
  confidence: 'Low' | 'Medium' | 'High' | 'Mastered';
}

export interface FormulaItem {
  id: string;
  subject: SubjectType;
  title: string;
  equation: string;
  symbols: string;
  conditions: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  subject: SubjectType;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: string;
}

export interface SolvedQuestionRecord {
  id: string;
  date: string;
  subject: SubjectType;
  topic: string;
  mode: string;
  questionText: string;
  solution: string;
  finalAnswer: string;
  imageThumbnail?: string;
  notes?: string;
}

export interface WeeklyReportData {
  week: string;
  totalHours: number;
  targetHours: number;
  completedSessions: number;
  averageQuizScore: number;
  strongestArea: string;
  priorityFocus: string;
  recurringMistakesNote: string;
  parentRecommendation: string;
}

export interface AcademyState {
  student: StudentProfile;
  parent: ParentProfile;
  syllabuses: Record<SubjectType, SubjectSyllabus>;
  studyPlan: StudyTask[];
  mistakes: MistakeRecord[];
  flashcards: Flashcard[];
  formulas: FormulaItem[];
  recentQuizzes: QuizAttempt[];
  savedSolutions: SolvedQuestionRecord[];
  weeklyReport: WeeklyReportData;
}

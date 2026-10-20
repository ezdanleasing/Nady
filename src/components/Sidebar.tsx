import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  LayoutDashboard,
  Bot,
  Camera,
  Atom,
  FlaskConical,
  Binary,
  BookOpen,
  CalendarDays,
  Layers,
  HelpCircle,
  Timer,
  CheckSquare,
  AlertTriangle,
  FileCode,
  FolderArchive,
  BarChart3,
  Users2,
  Settings,
  Flame,
  Award,
  ChevronRight,
  X,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  sub?: string;
  count?: number;
  roleBadge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeScreen, setActiveScreen, role, state } = useAcademy();

  const navSections: NavSection[] = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
        { id: 'tutor', label: 'Advanced AI Tutor', icon: Bot, badge: 'Active' },
        { id: 'photo_solver', label: 'Photo Question Solver', icon: Camera, highlight: true },
      ],
    },
    {
      title: 'A-LEVEL SUBJECT CENTERS',
      items: [
        { id: 'physics', label: 'Physics (CIE 9702)', icon: Atom, sub: 'Kinematics & SUVAT' },
        { id: 'chemistry', label: 'Chemistry (CIE 9701)', icon: FlaskConical, sub: 'Calculators & Bonding' },
        { id: 'cs', label: 'Computer Science (9618)', icon: Binary, sub: 'Logic Gates & Trace' },
      ],
    },
    {
      title: 'ACADEMIC WORKFLOW',
      items: [
        { id: 'planner', label: 'Daily Study Planner', icon: CalendarDays },
        { id: 'past_papers', label: 'Past Paper Bank', icon: GraduationCap, badge: 'CIE' },
        { id: 'flashcards', label: 'Spaced Flashcards', icon: Layers, count: state.flashcards.length },
        { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
        { id: 'exam', label: 'Exam Simulator', icon: Timer },
        { id: 'marker', label: 'AI Answer Marking', icon: CheckSquare },
        { id: 'timer', label: 'Focus Study Timer', icon: Timer },
      ],
    },
    {
      title: 'MASTERY & REVISION',
      items: [
        { id: 'command_words', label: 'Command Words Guide', icon: Sparkles, badge: 'A* Tips' },
        { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle, count: state.mistakes.length },
        { id: 'formulas', label: 'Formula Notebook', icon: FileCode },
        { id: 'library', label: 'Notes & Documents', icon: FolderArchive },
        { id: 'syllabus', label: 'Syllabus Manager', icon: BookOpen },
        { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
        { id: 'parent_dashboard', label: 'Parent Dashboard', icon: Users2, roleBadge: 'Parent' },
        { id: 'settings', label: 'Settings & Cloud Setup', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    setActiveScreen(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      
      {/* Student Profile Card in Sidebar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border-2 border-indigo-500/30 flex items-center justify-center text-xl shadow-xs">
            {state.student.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {state.student.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Lahore Grammar School, Gujrat
            </p>
          </div>
        </div>

        {/* Quick Streak & Target Badges */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md py-1 px-2 text-amber-700 dark:text-amber-400 flex items-center justify-center space-x-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold">{state.student.streakDays} Day Streak</span>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-md py-1 px-2 text-indigo-700 dark:text-indigo-400 flex items-center justify-center space-x-1">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold">Target: 3 × A*</span>
          </div>
        </div>
      </div>

      {/* Nav Menu Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/30'
                        : item.highlight
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200/60 dark:border-indigo-800/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                      <div className="truncate">
                        <span className="truncate">{item.label}</span>
                        {item.sub && (
                          <span className={`block text-[10px] ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {item.sub}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {item.count}
                        </span>
                      )}
                      {item.roleBadge && role === 'parent' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          Parent
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tagline */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-center text-slate-400 dark:text-slate-500">
        <p className="font-semibold text-slate-600 dark:text-slate-400">Nad e Ali A-Level AI Academy</p>
        <p>Learn Smarter. Practice Better. Aim for A*.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl">
            <div className="absolute top-2 right-2 p-2">
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

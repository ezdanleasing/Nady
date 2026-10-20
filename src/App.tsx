import React, { useState } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AiTutor } from './components/AiTutor';
import { PhotoSolver } from './components/PhotoSolver';
import { PhysicsCenter } from './components/PhysicsCenter';
import { ChemistryCenter } from './components/ChemistryCenter';
import { ComputerScienceCenter } from './components/ComputerScienceCenter';
import { DailyPlanner } from './components/DailyPlanner';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { ExamSimulator } from './components/ExamSimulator';
import { AnswerMarker } from './components/AnswerMarker';
import { MistakeNotebook } from './components/MistakeNotebook';
import { FormulaNotebook } from './components/FormulaNotebook';
import { NotesLibrary } from './components/NotesLibrary';
import { AnalyticsView } from './components/AnalyticsView';
import { ParentDashboard } from './components/ParentDashboard';
import { SyllabusManager } from './components/SyllabusManager';
import { FocusTimer } from './components/FocusTimer';
import { SettingsView } from './components/SettingsView';
import { PastPaperBank } from './components/PastPaperBank';
import { CommandWordsGuide } from './components/CommandWordsGuide';

const MainLayout: React.FC = () => {
  const { activeScreen, role } = useAcademy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveScreen = () => {
    // If user is in Parent role and selects Parent view
    if (role === 'parent' && activeScreen === 'parent_dashboard') {
      return <ParentDashboard />;
    }

    switch (activeScreen) {
      case 'dashboard':
        return role === 'parent' ? <ParentDashboard /> : <DashboardView />;
      case 'tutor':
        return <AiTutor />;
      case 'photo_solver':
        return <PhotoSolver />;
      case 'physics':
        return <PhysicsCenter />;
      case 'chemistry':
        return <ChemistryCenter />;
      case 'cs':
        return <ComputerScienceCenter />;
      case 'planner':
        return <DailyPlanner />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'quiz':
        return <QuizView />;
      case 'exam':
        return <ExamSimulator />;
      case 'marker':
        return <AnswerMarker />;
      case 'mistakes':
        return <MistakeNotebook />;
      case 'formulas':
        return <FormulaNotebook />;
      case 'library':
        return <NotesLibrary />;
      case 'analytics':
        return <AnalyticsView />;
      case 'parent_dashboard':
        return <ParentDashboard />;
      case 'syllabus':
        return <SyllabusManager />;
      case 'timer':
        return <FocusTimer />;
      case 'past_papers':
        return <PastPaperBank />;
      case 'command_words':
        return <CommandWordsGuide />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <MainLayout />
    </AcademyProvider>
  );
}

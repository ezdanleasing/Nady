import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Sparkles,
  Camera,
  Bot,
  HelpCircle,
  Timer,
  CalendarDays,
  Layers,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  TrendingUp,
  Atom,
  FlaskConical,
  Binary,
  Lightbulb,
  BookOpen,
  GraduationCap,
  FileText,
  Target,
  Trophy,
  Gift,
  Plus,
  Check,
  Zap,
  X,
  RotateCcw
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    state,
    setActiveScreen,
    toggleTask,
    logStudyTime,
    setDailyStudyGoal,
    claimMilestoneReward
  } = useAcademy();
  const { student, studyPlan, syllabuses, mistakes, flashcards, recentQuizzes } = state;

  // Calculate subject progress averages
  const calcSubjectProgress = (subject: 'Physics' | 'Chemistry' | 'Computer Science') => {
    const topics = syllabuses[subject]?.topics || [];
    if (!topics.length) return 0;
    const total = topics.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / topics.length);
  };

  const physicsAvg = calcSubjectProgress('Physics');
  const chemistryAvg = calcSubjectProgress('Chemistry');
  const csAvg = calcSubjectProgress('Computer Science');

  // Today's tasks (Monday/Tuesday)
  const todayTasks = studyPlan.slice(0, 3);
  const completedToday = todayTasks.filter((t) => t.completed).length;

  // Flashcards due today
  const flashcardsDueToday = flashcards.filter(
    (f) => f.confidence === 'Low' || f.confidence === 'Medium' || f.intervalDays <= 3
  );

  // Recommended next activity
  const nextIncompleteTask = studyPlan.find((t) => !t.completed);

  // Daily Study Progress & Goal (synchronized with Study Planner)
  const dailyGoalMinutes = student.dailyStudyGoalMinutes || 180;
  const todayMinutes = student.todayStudyMinutes ?? 135;
  const progressPercent = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100));
  const claimedMilestones = student.claimedMilestones || [];
  const currentPoints = student.masteryPoints || 350;

  // Milestone definitions
  const milestones = [
    {
      id: 'milestone_25',
      title: 'A* Foundations',
      targetPercent: 25,
      targetMinutes: Math.round(dailyGoalMinutes * 0.25),
      rewardPoints: 25,
      badge: '🥉 Bronze Sprinter',
      description: 'First 25% of daily target reached! Great start to study routine.',
    },
    {
      id: 'milestone_50',
      title: 'Halfway Hero',
      targetPercent: 50,
      targetMinutes: Math.round(dailyGoalMinutes * 0.50),
      rewardPoints: 50,
      badge: '🥈 Silver Scholar',
      description: '50% mark achieved! Core past-paper problem sets crushed.',
    },
    {
      id: 'milestone_75',
      title: 'Exam Mastery',
      targetPercent: 75,
      targetMinutes: Math.round(dailyGoalMinutes * 0.75),
      rewardPoints: 75,
      badge: '🥇 Gold Practitioner',
      description: '75% daily target reached! Cambridge A* rhythm locked in.',
    },
    {
      id: 'milestone_100',
      title: 'Cambridge A* Distinction',
      targetPercent: 100,
      targetMinutes: dailyGoalMinutes,
      rewardPoints: 100,
      badge: '👑 Cambridge Champion',
      description: '100% daily goal achieved! Straight A* trajectory maintained.',
    },
  ];

  // State for Claim Reward celebration & UI controls
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [claimedRewardDetails, setClaimedRewardDetails] = useState<{
    id: string;
    title: string;
    points: number;
    badge: string;
    description: string;
    milestonePercent: number;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState<boolean>(false);
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  // Victory fanfare chime using Web Audio API
  const playVictoryFanfare = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [
        { freq: 523.25, time: 0, dur: 0.15 }, // C5
        { freq: 659.25, time: 0.12, dur: 0.15 }, // E5
        { freq: 783.99, time: 0.24, dur: 0.18 }, // G5
        { freq: 1046.50, time: 0.38, dur: 0.5 }, // C6
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);
      });
    } catch {
      // Audio not supported or blocked by user gesture
    }
  };

  const handleClaimReward = (m: (typeof milestones)[0]) => {
    claimMilestoneReward(m.id, m.rewardPoints);
    setClaimedRewardDetails({
      id: m.id,
      title: m.title,
      points: m.rewardPoints,
      badge: m.badge,
      description: m.description,
      milestonePercent: m.targetPercent,
    });
    setShowCelebrationModal(true);
    setShowConfetti(true);
    playVictoryFanfare();

    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  const handleQuickLog = (mins: number) => {
    logStudyTime(mins);
    setQuickNotice(`+${mins} min study session added!`);
    setTimeout(() => setQuickNotice(null), 3000);
  };

  const claimableCount = milestones.filter(
    (m) => todayMinutes >= m.targetMinutes && !claimedMilestones.includes(m.id)
  ).length;

  const confettiParticles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${(i * 2.5 + (i % 7) * 3) % 100}%`,
    delay: `${(i % 10) * 0.12}s`,
    duration: `${2.4 + (i % 5) * 0.35}s`,
    color: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#6366f1', '#eab308', '#06b6d4', '#ef4444'][i % 9],
    size: 7 + (i % 6) * 1.5,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Lahore Grammar School, Gujrat • A-Level Session 2026-2027</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Assalam-o-Alaikum, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-300">{student.name}</span>!
            </h1>
            
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Target: <span className="text-amber-400 font-bold">A* in Physics, Chemistry & Computer Science</span>. 
              Consistency is your competitive advantage. Keep solving past paper problems and eliminating mistakes.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs font-medium">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong>{student.streakDays} Day</strong> Study Streak</span>
              </span>
              <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs font-medium">
                <Clock className="w-4 h-4 text-indigo-300" />
                <span><strong>{(student.totalStudyMinutes / 60).toFixed(1)} hrs</strong> Logged</span>
              </span>
              <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><strong>{student.completedTasksCount}</strong> Tasks Mastered</span>
              </span>
            </div>
          </div>

          {/* "What Should I Study Now?" Quick Action Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl shrink-0 md:max-w-xs w-full">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Recommended Next Step</span>
            </div>
            {nextIncompleteTask ? (
              <div>
                <p className="text-xs font-semibold text-white truncate">{nextIncompleteTask.subject}: {nextIncompleteTask.topic}</p>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{nextIncompleteTask.learningObjective}</p>
                <button
                  onClick={() => setActiveScreen('planner')}
                  className="mt-3 w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Start This Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-200">All planned tasks completed! Excellent work.</p>
                <button
                  onClick={() => setActiveScreen('quiz')}
                  className="mt-3 w-full py-2 px-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Take an A* Challenge Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confetti & Keyframe Animation Styles */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          70% { opacity: 0.9; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), 0 0 25px rgba(245, 158, 11, 0.2); }
          50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.8), 0 0 45px rgba(245, 158, 11, 0.5); }
        }
        @keyframes modalSpring {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Confetti Rain Layer during Milestone Claim */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute top-0 rounded-xs"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size * 1.4}px`,
                backgroundColor: p.color,
                animation: `confettiFall ${p.duration} linear ${p.delay} forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Claim Reward Celebration Modal */}
      {showCelebrationModal && claimedRewardDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
            style={{ animation: 'modalSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy Icon with bouncing effect */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
              <Trophy className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Milestone Achieved ({claimedRewardDetails.milestonePercent}%)</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Reward Claimed!
            </h3>

            <p className="text-sm font-bold text-amber-400 mt-1">
              {claimedRewardDetails.title} • {claimedRewardDetails.badge}
            </p>

            <div className="my-5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xl font-extrabold text-amber-300">
                <Gift className="w-6 h-6 text-amber-400" />
                <span>+{claimedRewardDetails.points} A* Mastery Points</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {claimedRewardDetails.description}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Total A* Mastery Points:</span>
                <span className="font-extrabold text-white text-xs">{currentPoints + claimedRewardDetails.points} pts</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic mb-6">
              "MashAllah, Nad e Ali! Exceptional consistency at Lahore Grammar School, Gujrat. Each focused study session builds your Cambridge A* edge."
            </p>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:scale-102 flex items-center justify-center space-x-2"
            >
              <span>Keep Aiming for A*</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DAILY STUDY PROGRESS BAR CARD (FEATURE) */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-5 sm:p-6 transition-all">
        {/* Quick toast message */}
        {quickNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{quickNotice}</span>
          </div>
        )}

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Daily Study Progress
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                  Target: Study Planner
                </span>
                {claimableCount > 0 && (
                  <span
                    className="animate-pulse px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs"
                    style={{ animation: 'pulseGlow 2s infinite' }}
                  >
                    🎁 {claimableCount} Reward{claimableCount > 1 ? 's' : ''} Ready!
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Today's A* Commitment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target set in Study Planner: <strong className="text-slate-800 dark:text-slate-200">{Math.floor(dailyGoalMinutes / 60)}h {dailyGoalMinutes % 60 > 0 ? `${dailyGoalMinutes % 60}m` : ''}</strong> ({dailyGoalMinutes} min) • Synchronized with LGS schedule
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* A* Mastery Points chip */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{currentPoints} A* Points</span>
            </div>

            {/* Goal selector toggle */}
            <div className="relative">
              <button
                onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
              >
                <span>Goal: {Math.floor(dailyGoalMinutes / 60)}h {dailyGoalMinutes % 60 > 0 ? `${dailyGoalMinutes % 60}m` : ''}</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </button>

              {showGoalDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-2 text-xs">
                  <div className="px-2 py-1 font-bold text-slate-500 uppercase text-[10px]">
                    Change Daily Goal (min)
                  </div>
                  {[120, 150, 180, 210, 240].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDailyStudyGoal(mins);
                        setShowGoalDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        dailyGoalMinutes === mins
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{Math.floor(mins / 60)}h {mins % 60 > 0 ? `${mins % 60}m` : ''} ({mins} min)</span>
                      {mins === 180 && <span className="text-[9px] text-amber-500 font-bold">A* Rec</span>}
                      {dailyGoalMinutes === mins && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Big numbers & Percentage indicator */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              of {Math.floor(dailyGoalMinutes / 60)}h {dailyGoalMinutes % 60 > 0 ? `${dailyGoalMinutes % 60}m` : ''} daily goal
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              progressPercent >= 100
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}>
              {progressPercent}% Complete
            </span>
            {todayMinutes >= dailyGoalMinutes ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Daily Target Conquered! (+{todayMinutes - dailyGoalMinutes}m)</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {dailyGoalMinutes - todayMinutes} min remaining to 100%
              </span>
            )}
          </div>
        </div>

        {/* PROGRESS BAR WITH INTERACTIVE MARKERS */}
        <div className="relative mb-6">
          <div className="w-full bg-slate-100 dark:bg-slate-700/80 h-4 rounded-full overflow-hidden shadow-inner p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-400 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Milestone markers on bar */}
          <div className="absolute top-0 left-0 w-full h-4 pointer-events-none flex items-center">
            {[25, 50, 75, 100].map((pct) => (
              <div
                key={pct}
                className="absolute transform -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    progressPercent >= pct
                      ? 'bg-amber-400 border-white dark:border-slate-800 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4 MILESTONE CARDS WITH CLAIM REWARD BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {milestones.map((m) => {
            const isReached = todayMinutes >= m.targetMinutes;
            const isClaimed = claimedMilestones.includes(m.id);
            const canClaim = isReached && !isClaimed;

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isClaimed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                    : canClaim
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-300 dark:border-amber-700 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/70 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {m.targetPercent}% Goal ({m.targetMinutes}m)
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      +{m.rewardPoints} Pts
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>{m.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.badge}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  {isClaimed ? (
                    <div className="w-full py-1.5 px-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Reward Claimed</span>
                    </div>
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaimReward(m)}
                      className="w-full py-2 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-1.5 animate-pulse"
                      style={{ animation: 'pulseGlow 2s infinite' }}
                    >
                      <Gift className="w-4 h-4 text-slate-950" />
                      <span>Claim Reward! 🎁</span>
                    </button>
                  ) : (
                    <div className="w-full py-1.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-medium rounded-lg text-center">
                      <span>{m.targetMinutes - todayMinutes} min to unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK LOG & TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
              Quick Log Study:
            </span>
            <button
              onClick={() => handleQuickLog(15)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+15m</span>
            </button>
            <button
              onClick={() => handleQuickLog(30)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+30m</span>
            </button>
            <button
              onClick={() => handleQuickLog(45)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+45m</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveScreen('timer')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Focus Timer</span>
            </button>

            <button
              onClick={() => setActiveScreen('planner')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
              <span>Study Planner</span>
            </button>

            {/* Reset for testing */}
            <button
              onClick={() => {
                logStudyTime(-todayMinutes + 90);
                setQuickNotice('Reset today study time to 90 min for testing!');
                setTimeout(() => setQuickNotice(null), 3000);
              }}
              title="Reset today's study minutes to test milestone claiming"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS BUTTONS GRID */}
      <div>
        <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          Quick Access Hub
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { id: 'tutor', label: 'Ask AI Tutor', icon: Bot, color: 'from-blue-600 to-indigo-600' },
            { id: 'photo_solver', label: 'Scan Question', icon: Camera, color: 'from-indigo-600 to-purple-600', popular: true },
            { id: 'photo_solver', label: 'Solve Photo', icon: Sparkles, color: 'from-purple-600 to-pink-600' },
            { id: 'quiz', label: 'Generate Quiz', icon: HelpCircle, color: 'from-emerald-600 to-teal-600' },
            { id: 'exam', label: 'Exam Practice', icon: Timer, color: 'from-amber-600 to-orange-600' },
            { id: 'planner', label: 'Study Planner', icon: CalendarDays, color: 'from-cyan-600 to-blue-600' },
            { id: 'flashcards', label: 'Revise Flashcards', icon: Layers, color: 'from-rose-600 to-red-600' },
            { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle, color: 'from-slate-700 to-slate-900' },
          ].map((btn, index) => {
            const Icon = btn.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveScreen(btn.id)}
                className="group relative flex flex-col items-center text-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all active:scale-95"
              >
                {btn.popular && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-xs">
                    Multimodal
                  </span>
                )}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${btn.color} text-white flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CAMBRIDGE EXAMINATION SUCCESS BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border border-indigo-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Cambridge A* Examination Suite</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">New</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
              Classified Past Papers & Command Words Guide
            </h3>
            <p className="text-xs text-slate-300">
              Real CIE questions categorized by component, with official marking schemes and examiner rubrics.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveScreen('past_papers')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Past Paper Bank</span>
          </button>
          <button
            onClick={() => setActiveScreen('command_words')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Command Words</span>
          </button>
        </div>
      </div>

      {/* THREE SUBJECT MASTERY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Syllabus Mastery Progress
          </h2>
          <button
            onClick={() => setActiveScreen('syllabus')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>Full Syllabus Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Physics Card */}
          <div 
            onClick={() => setActiveScreen('physics')}
            className="cursor-pointer group p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-xs hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Atom className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Physics
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CIE 9702 • Target: A*</p>
                </div>
              </div>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">{physicsAvg}%</span>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${physicsAvg}%` }} 
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Current: Kinematics & SUVAT</span>
                <span>Paper 1 & 2 Mocks</span>
              </div>
            </div>
          </div>

          {/* Chemistry Card */}
          <div 
            onClick={() => setActiveScreen('chemistry')}
            className="cursor-pointer group p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xs hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Chemistry
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CIE 9701 • Target: A*</p>
                </div>
              </div>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{chemistryAvg}%</span>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${chemistryAvg}%` }} 
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Current: Stoichiometry & Titrations</span>
                <span>Bonding & Energetics</span>
              </div>
            </div>
          </div>

          {/* Computer Science Card */}
          <div 
            onClick={() => setActiveScreen('cs')}
            className="cursor-pointer group p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 shadow-xs hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Binary className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Computer Science
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CIE 9618 • Target: A*</p>
                </div>
              </div>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">{csAvg}%</span>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${csAvg}%` }} 
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Current: Logic Gates & Truth Tables</span>
                <span>Trace Tables & Two's Comp</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID: TODAY'S STUDY PLAN & WEAK TOPICS / REVISION QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Study Plan */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <span>Today's Study Plan</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for Lahore Grammar School schedule • Active Recall & Spaced Practice
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('planner')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open Planner →
            </button>
          </div>

          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start justify-between p-3.5 rounded-lg border transition-all ${
                  task.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-500'
                    : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-500 hover:border-indigo-600'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                        task.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                        task.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                      }`}>
                        {task.subject}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{task.time}</span>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">({task.duration} min)</span>
                    </div>
                    <h4 className={`text-sm font-semibold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {task.topic}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {task.learningObjective}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  task.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
                }`}>
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Weak Topics & Flashcards Due Queue */}
        <div className="space-y-6">
          
          {/* Weak Topics Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Weak Topics to Reinforce</span>
              </h3>
              <button
                onClick={() => setActiveScreen('mistakes')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Notebook ({mistakes.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {mistakes.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveScreen('mistakes')}
                  className="cursor-pointer p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-700 dark:text-amber-400">{m.subject} • {m.topic}</span>
                    <span className="text-[10px] text-slate-400">{m.category}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                    {m.question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flashcard Revision Queue Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Spaced Repetition Queue</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {flashcardsDueToday.length} Due
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Spaced recall intervals: 1, 3, 7, 14, 30 days. Regular reviews convert short-term knowledge into A* exam memory.
            </p>

            <button
              onClick={() => setActiveScreen('flashcards')}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-xs shadow-indigo-600/30"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Start Daily Review Session</span>
            </button>
          </div>

          {/* Recent Quiz Results Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Recent Quiz Scores</span>
              </h3>
              <button
                onClick={() => setActiveScreen('quiz')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Take Quiz
              </button>
            </div>

            <div className="space-y-2">
              {recentQuizzes.slice(0, 3).map((qz) => (
                <div key={qz.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <div className="truncate mr-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{qz.subject}: </span>
                    <span className="text-slate-500 dark:text-slate-400 truncate">{qz.topic}</span>
                  </div>
                  <span className={`font-bold px-1.5 py-0.5 rounded-sm ${
                    qz.percentage >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {qz.score}/{qz.total} ({qz.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

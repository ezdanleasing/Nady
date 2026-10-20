import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  FolderArchive,
  Upload,
  Search,
  FileText,
  Bookmark,
  Camera,
  Trash2,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { SolvedQuestionRecord, SubjectType } from '../types/academy';

export const NotesLibrary: React.FC = () => {
  const { state, saveSolutionRecord, addFlashcard, setActiveScreen } = useAcademy();
  const [filterSubj, setFilterSubj] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New Note State
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteSubject, setNoteSubject] = useState<SubjectType>('Physics');
  const [noteContent, setNoteContent] = useState<string>('');

  const savedSolutions = state.savedSolutions;

  const filtered = savedSolutions.filter((s) => {
    const matchSubj = filterSubj === 'All' || s.subject === filterSubj;
    const matchQuery =
      s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.finalAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchQuery;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    saveSolutionRecord({
      subject: noteSubject,
      topic: noteTitle,
      mode: 'Study Note',
      questionText: noteTitle,
      solution: noteContent,
      finalAnswer: 'A-Level Study Summary',
    });

    setShowUploadModal(false);
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
              <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
              <span>Personalized Academic Archive</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Notes & Solved Question Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              All questions scanned with camera, solved numericals, and teacher study sheets saved in one searchable repository.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveScreen('photo_solver')}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102"
            >
              <Camera className="w-4 h-4" />
              <span>Scan New Question</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {['All', 'Physics', 'Chemistry', 'Computer Science'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSubj(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterSubj === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search solved items, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Grid of Saved Records */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sol) => (
            <div
              key={sol.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                  sol.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                  sol.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                }`}>
                  {sol.subject}
                </span>
                <span className="text-[11px] text-slate-400">{sol.date}</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {sol.topic}
              </h3>

              {sol.imageThumbnail && (
                <div className="h-32 rounded-xl overflow-hidden bg-slate-900">
                  <img src={sol.imageThumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-90" />
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                {sol.questionText}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                Answer: {sol.finalAnswer}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Mode: {sol.mode}</span>
                <button
                  onClick={() => {
                    addFlashcard({
                      subject: sol.subject,
                      topic: sol.topic,
                      front: sol.questionText,
                      back: `Answer: ${sol.finalAnswer}\n\nWorking: ${sol.solution}`,
                      intervalDays: 1,
                      reviewDue: new Date().toISOString().split('T')[0],
                      confidence: 'Medium',
                    });
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create Flashcard →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500">
          <FolderArchive className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-semibold">No saved questions or notes yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Questions solved in the Photo Question Solver or AI Tutor will appear here when saved.
          </p>
          <button
            onClick={() => setActiveScreen('photo_solver')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Scan a Question Now
          </button>
        </div>
      )}

      {/* Manual Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Save Revision Note or Teacher Sheet
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hess's Law Notes"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Summary Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Paste formula derivations, chemical equations, or pseudocode..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

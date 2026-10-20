import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  FileCode,
  Search,
  Plus,
  Atom,
  FlaskConical,
  Binary,
  Bookmark,
  Check,
  Printer
} from 'lucide-react';
import { SubjectType } from '../types/academy';

export const FormulaNotebook: React.FC = () => {
  const { state } = useAcademy();
  const [filterSubj, setFilterSubj] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formulas = state.formulas;

  const filteredFormulas = formulas.filter((f) => {
    const matchSubj = filterSubj === 'All' || f.subject === filterSubj;
    const matchQuery =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.equation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.symbols.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold mb-2">
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Cambridge Equations, Symbols & Units</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Formula & Definition Notebook
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive list of all essential formulas for Physics (9702), Chemistry (9701), and Computer Science (9618) with exact SI units and boundary conditions.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Formula Sheet</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
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
              placeholder="Search equations, symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((f) => (
          <div
            key={f.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                f.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                f.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
              }`}>
                {f.subject}
              </span>
              <span className="text-xs font-bold text-slate-500">{f.title}</span>
            </div>

            {/* Equation highlighted */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-sm sm:text-base font-bold shadow-inner">
              {f.equation}
            </div>

            {/* Symbols */}
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                Symbols & SI Units:
              </span>
              <p className="font-mono text-[11px] leading-relaxed">{f.symbols}</p>
            </div>

            {/* Conditions */}
            {f.conditions && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px]">
                <strong>Conditions:</strong> {f.conditions}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

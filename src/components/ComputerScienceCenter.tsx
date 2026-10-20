import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Binary,
  Cpu,
  Code,
  Table,
  Bug,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle,
  FileCode,
  Layers
} from 'lucide-react';

export const ComputerScienceCenter: React.FC = () => {
  const { state, setActiveScreen } = useAcademy();
  const csSyllabus = state.syllabuses['Computer Science'];

  const [activeTab, setActiveTab] = useState<'logic_gates' | 'binary_converter' | 'code_tools' | 'topics' | 'cie_pseudocode_guide'>('logic_gates');

  // Logic Gate Simulator State
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'>('AND');
  const [inputA, setInputA] = useState<0 | 1>(0);
  const [inputB, setInputB] = useState<0 | 1>(1);

  // Binary Converter State
  const [decimalVal, setDecimalVal] = useState<number>(-45);

  // AI Code Tool State
  const [toolType, setToolType] = useState<string>('explain');
  const [codeSnippet, setCodeSnippet] = useState<string>(
`// Cambridge 9618 Pseudocode Linear Search
FUNCTION LinearSearch(ArrayToSearch, Target) RETURNS INTEGER
  DECLARE Index : INTEGER
  FOR Index <- 0 TO 9
    IF ArrayToSearch[Index] = Target THEN
      RETURN Index
    ENDIF
  ENDFOR
  RETURN -1
ENDFUNCTION`
  );
  const [codeResult, setCodeResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Compute logic gate output
  const evaluateGate = (gate: string, a: number, b: number): number => {
    switch (gate) {
      case 'AND': return (a && b) ? 1 : 0;
      case 'OR': return (a || b) ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      case 'XOR': return (a ^ b) ? 1 : 0;
      default: return 0;
    }
  };

  const currentOutput = evaluateGate(selectedGate, inputA, inputB);

  // Two's complement helper for 8 bits
  const getTwosComplement = (val: number): string => {
    if (val < -128 || val > 127) return 'Out of 8-bit range (-128 to +127)';
    let unsigned = val >= 0 ? val : 256 + val;
    return unsigned.toString(2).padStart(8, '0');
  };

  const handleRunCodeTool = async () => {
    setIsAnalyzing(true);
    setCodeResult(null);

    try {
      const res = await fetch('/api/gemini/code-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: toolType,
          code: codeSnippet,
          language: 'CIE 9618 Pseudocode',
        }),
      });

      if (!res.ok) throw new Error('Code tool failed');
      const data = await res.json();
      setCodeResult(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Binary className="w-3.5 h-3.5 text-purple-400" />
              <span>Cambridge International A-Level • Syllabus 9618</span>
            </div>
            <h1 className="text-2xl font-black">Computer Science Lab & Learning Center</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting A* across Theory Fundamentals (Paper 1), Problem-solving & Programming (Paper 2), Advanced Theory (Paper 3), and Further Programming (Paper 4).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveScreen('quiz')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Take CS Quiz
            </button>
            <button
              onClick={() => setActiveScreen('tutor')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
            >
              Ask CS Tutor
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('logic_gates')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'logic_gates' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Interactive Logic Gate Simulator
          </button>
          <button
            onClick={() => setActiveTab('binary_converter')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'binary_converter' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Two's Complement & Base Converter
          </button>
          <button
            onClick={() => setActiveTab('code_tools')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'code_tools' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            AI Pseudocode & Trace Table Tool
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'topics' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Syllabus Topics & Mastery
          </button>
          <button
            onClick={() => setActiveTab('cie_pseudocode_guide')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'cie_pseudocode_guide' ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            CIE 9618 Pseudocode Guide
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE LOGIC GATE SIMULATOR */}
      {activeTab === 'logic_gates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-600" />
                <span>Interactive Logic Gate Simulator</span>
              </h2>
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                CIE 9618 Paper 1
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any primary logic gate and toggle input bits (A, B) to observe real-time output and live truth table row evaluation.
            </p>

            {/* Gate selector pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGate(g)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    selectedGate === g
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {g} Gate
                </button>
              ))}
            </div>

            {/* Interactive Circuit Canvas Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Inputs */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-slate-300">Input A:</span>
                  <button
                    onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                    className={`w-12 h-12 rounded-xl font-mono text-lg font-black transition-all ${
                      inputA === 1
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 shadow-lg'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {inputA}
                  </button>
                </div>

                {selectedGate !== 'NOT' && (
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-slate-300">Input B:</span>
                    <button
                      onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                      className={`w-12 h-12 rounded-xl font-mono text-lg font-black transition-all ${
                        inputB === 1
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {inputB}
                    </button>
                  </div>
                )}
              </div>

              {/* Gate Graphic Representation */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-4 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500/50 flex flex-col items-center text-center shadow-inner">
                  <span className="text-xl font-black text-indigo-300 tracking-wider font-mono">
                    [{selectedGate}]
                  </span>
                  <span className="text-[10px] text-indigo-400 mt-1 uppercase font-semibold">
                    {selectedGate === 'AND' ? 'A . B' :
                     selectedGate === 'OR' ? 'A + B' :
                     selectedGate === 'NOT' ? 'A\'' :
                     selectedGate === 'NAND' ? '(A . B)\'' :
                     selectedGate === 'NOR' ? '(A + B)\'' :
                     'A ⊕ B'}
                  </span>
                </div>
              </div>

              {/* Output */}
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold text-slate-300">Output Q:</span>
                <div
                  className={`w-14 h-14 rounded-2xl font-mono text-2xl font-black flex items-center justify-center transition-all ${
                    currentOutput === 1
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 shadow-xl shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {currentOutput}
                </div>
              </div>

            </div>

            {/* Real-time Truth Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Live Truth Table for {selectedGate} Gate
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-700/60 font-mono font-bold text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="p-2.5">Input A</th>
                      {selectedGate !== 'NOT' && <th className="p-2.5">Input B</th>}
                      <th className="p-2.5">Output Q</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                    {(selectedGate === 'NOT' ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]).map((row, idx) => {
                      const aVal = row[0];
                      const bVal = row[1] ?? 0;
                      const out = evaluateGate(selectedGate, aVal, bVal);
                      const isMatch = selectedGate === 'NOT' 
                        ? inputA === aVal 
                        : inputA === aVal && inputB === bVal;

                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isMatch
                              ? 'bg-purple-100/80 dark:bg-purple-950/60 font-bold text-purple-900 dark:text-purple-200'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <td className="p-2.5">{aVal}</td>
                          {selectedGate !== 'NOT' && <td className="p-2.5">{bVal}</td>}
                          <td className="p-2.5">
                            <span className={out === 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                              {out}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Boolean Algebra Rules Sidebar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              De Morgan's & Boolean Laws (CIE 9618)
            </h3>

            <div className="space-y-3 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-purple-600 dark:text-purple-400 font-bold">De Morgan's Law 1:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-1">(A . B)' = A' + B'</p>
                <p className="text-[10px] text-slate-400 font-sans">NAND is equivalent to inverted OR</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-purple-600 dark:text-purple-400 font-bold">De Morgan's Law 2:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-1">(A + B)' = A' . B'</p>
                <p className="text-[10px] text-slate-400 font-sans">NOR is equivalent to inverted AND</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-purple-600 dark:text-purple-400 font-bold">Identity & Annulment:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-1">A + 0 = A | A . 1 = A</p>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">A + 1 = 1 | A . 0 = 0</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              <strong>Cambridge Exam Tip:</strong> When drawing combinational circuits in Paper 1, ensure gate symbols have clear rounded vs flat backs (e.g. AND vs OR) to avoid losing drawing marks.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TWO'S COMPLEMENT & BASE CONVERTER */}
      {activeTab === 'binary_converter' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Binary className="w-5 h-5 text-purple-600" />
            <span>8-Bit Two's Complement Integer Converter</span>
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            CIE 9618 requires converting signed integers between decimal, two's complement binary, and hexadecimal.
          </p>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter Signed Decimal Integer (-128 to +127):
            </label>
            <input
              type="number"
              min="-128"
              max="127"
              value={decimalVal}
              onChange={(e) => setDecimalVal(parseInt(e.target.value) || 0)}
              className="w-full text-base font-mono px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-slate-900 border border-purple-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block mb-1">
                8-Bit Two's Complement
              </span>
              <span className="text-xl font-mono font-black text-purple-900 dark:text-purple-200">
                {getTwosComplement(decimalVal)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
                Hexadecimal Representation
              </span>
              <span className="text-xl font-mono font-black text-indigo-900 dark:text-indigo-200">
                0x{(decimalVal >= 0 ? decimalVal : 256 + decimalVal).toString(16).toUpperCase().padStart(2, '0')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block mb-1">
                Most Significant Bit (MSB Sign)
              </span>
              <span className="text-xl font-mono font-black text-blue-900 dark:text-blue-200">
                {decimalVal < 0 ? '1 (Negative: -128 weight)' : '0 (Positive)'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Conversion Algorithm Method:</h4>
            <ol className="list-decimal list-inside space-y-1 font-mono text-[11px]">
              <li>Step 1: Write positive magnitude in 8-bit binary (e.g. +45 = 00101101).</li>
              <li>Step 2: Invert all bits (One's Complement): 11010010.</li>
              <li>Step 3: Add 1: 11010010 + 1 = 11010011 (-45 in Two's Complement).</li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 3: AI CODE & TRACE TABLE TOOLS */}
      {activeTab === 'code_tools' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-600" />
              <span>AI Code Explainer & Trace Table Generator (CIE 9618)</span>
            </h2>

            <div className="flex items-center space-x-2 text-xs">
              {(['explain', 'trace_table', 'debug', 'complexity'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setToolType(t)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    toolType === t
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t === 'explain' ? 'Explain Code' :
                   t === 'trace_table' ? 'Generate Trace Table' :
                   t === 'debug' ? 'Debug Assistant' : 'Complexity'}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={7}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleRunCodeTool}
            disabled={isAnalyzing}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin text-amber-300" /> : <Play className="w-4 h-4" />}
            <span>Analyze with Cambridge CS Lab Engine</span>
          </button>

          {codeResult && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 space-y-4 text-xs animate-fadeIn">
              <h3 className="font-bold text-sm text-purple-700 dark:text-purple-300">
                Cambridge Examiner Analysis
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {codeResult.analysis}
              </p>

              {codeResult.traceTable && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                    Line-by-Line Trace Table
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden font-mono">
                      <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                          <th className="p-2">Step</th>
                          <th className="p-2">Line</th>
                          <th className="p-2">Variables Tracked</th>
                          <th className="p-2">Output</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {codeResult.traceTable.map((t: any, i: number) => (
                          <tr key={i}>
                            <td className="p-2">{t.step}</td>
                            <td className="p-2">{t.line}</td>
                            <td className="p-2">{JSON.stringify(t.variables)}</td>
                            <td className="p-2">{t.output || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {codeResult.timeComplexity && (
                <div className="flex items-center space-x-4 font-mono">
                  <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-md">
                    Time: {codeResult.timeComplexity}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md">
                    Space: {codeResult.spaceComplexity}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TOPICS */}
      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Cambridge 9618 Computer Science Syllabus Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {csSyllabus.topics.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-purple-400 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.mastery === 'Nearly Mastered' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                    t.mastery === 'Developing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    t.mastery === 'Learning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-200 text-slate-600 dark:bg-slate-700'
                  }`}>
                    {t.mastery}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${t.progress}%` }} />
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  {t.subtopics.map((sub, idx) => (
                    <span key={idx} className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CAMBRIDGE OFFICIAL 9618 PSEUDOCODE SYNTAX GUIDE */}
      {activeTab === 'cie_pseudocode_guide' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                Official Examination Syntax Reference
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Cambridge 9618 Pseudocode Syntax Standards
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Zero Marks Lost to Syntax
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Variable Declaration & Assignment */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-purple-400 block font-sans">
                1. Variables & Assignment (CIE Standard)
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                Always declare data types and use <code className="text-amber-400 font-mono">&lt;-</code> for assignment (never use single '=').
              </p>
              <pre className="text-[11px] text-purple-300 bg-slate-950 p-3 rounded-lg overflow-x-auto">
{`DECLARE Counter : INTEGER
DECLARE Average : REAL
DECLARE StudentName : STRING
DECLARE IsFound : BOOLEAN

// Assignment with arrow:
Counter <- 0
Average <- 95.5
IsFound <- FALSE`}
              </pre>
            </div>

            {/* Arrays */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-purple-400 block font-sans">
                2. 1D & 2D Array Syntax
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                Declare lower and upper bounds using colon syntax:
              </p>
              <pre className="text-[11px] text-purple-300 bg-slate-950 p-3 rounded-lg overflow-x-auto">
{`// 1D Array (10 elements 0 to 9)
DECLARE Scores : ARRAY[0:9] OF INTEGER

// 2D Array (4 rows, 3 columns)
DECLARE Grid : ARRAY[1:4, 1:3] OF CHAR

Scores[0] <- 85
Grid[1, 2] <- 'X'`}
              </pre>
            </div>

            {/* Loops / Iteration */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-purple-400 block font-sans">
                3. Iteration Structures (Loops)
              </span>
              <pre className="text-[11px] text-purple-300 bg-slate-950 p-3 rounded-lg overflow-x-auto">
{`// Count-Controlled:
FOR i <- 1 TO 10 STEP 1
  OUTPUT i
NEXT i

// Post-Condition (runs at least once):
REPEAT
  INPUT UserNum
UNTIL UserNum > 0

// Pre-Condition:
WHILE Index <= 10 DO
  Index <- Index + 1
ENDWHILE`}
              </pre>
            </div>

            {/* File Handling */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-purple-400 block font-sans">
                4. File Handling Commands (Paper 2 & 4)
              </span>
              <pre className="text-[11px] text-purple-300 bg-slate-950 p-3 rounded-lg overflow-x-auto">
{`OPENFILE "Scores.txt" FOR READ
WHILE NOT EOF("Scores.txt") DO
  READFILE "Scores.txt", CurrentLine
  OUTPUT CurrentLine
ENDWHILE
CLOSEFILE "Scores.txt"

// Writing to file:
OPENFILE "Log.txt" FOR APPEND
WRITEFILE "Log.txt", "A* Mastered"
CLOSEFILE "Log.txt"`}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

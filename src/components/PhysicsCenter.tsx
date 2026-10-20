import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Atom,
  Calculator,
  LineChart,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const PhysicsCenter: React.FC = () => {
  const { state, setActiveScreen } = useAcademy();
  const physicsSyllabus = state.syllabuses.Physics;

  const [activeTab, setActiveTab] = useState<'topics' | 'suvat_calc' | 'formulas' | 'graph_tool' | 'practical_guide'>('suvat_calc');

  // SUVAT Calculator States
  const [suvatInputs, setSuvatInputs] = useState({
    u: '', // initial velocity
    v: '', // final velocity
    a: '', // acceleration
    t: '', // time
    s: '', // displacement
  });
  const [suvatResult, setSuvatResult] = useState<string | null>(null);

  const calculateSuvat = () => {
    const { u, v, a, t, s } = suvatInputs;
    const numU = u !== '' ? parseFloat(u) : null;
    const numV = v !== '' ? parseFloat(v) : null;
    const numA = a !== '' ? parseFloat(a) : null;
    const numT = t !== '' ? parseFloat(t) : null;
    const numS = s !== '' ? parseFloat(s) : null;

    // Check count of provided variables
    const count = [numU, numV, numA, numT, numS].filter((x) => x !== null).length;
    if (count < 3) {
      setSuvatResult('Please provide at least 3 known values to solve the remaining 2 variables.');
      return;
    }

    try {
      // Case: Known u, a, t -> find v and s
      if (numU !== null && numA !== null && numT !== null) {
        const calcV = numU + numA * numT;
        const calcS = numU * numT + 0.5 * numA * Math.pow(numT, 2);
        setSuvatResult(`Using v = u + at & s = ut + ½at²:\n• Final velocity (v) = ${calcV.toFixed(3)} m s⁻¹\n• Displacement (s) = ${calcS.toFixed(3)} m`);
        return;
      }

      // Case: Known u, v, t -> find a and s
      if (numU !== null && numV !== null && numT !== null) {
        const calcA = (numV - numU) / numT;
        const calcS = 0.5 * (numU + numV) * numT;
        setSuvatResult(`Using a = (v - u)/t & s = ½(u + v)t:\n• Acceleration (a) = ${calcA.toFixed(3)} m s⁻²\n• Displacement (s) = ${calcS.toFixed(3)} m`);
        return;
      }

      // Case: Known u, v, s -> find a and t
      if (numU !== null && numV !== null && numS !== null) {
        const calcA = (Math.pow(numV, 2) - Math.pow(numU, 2)) / (2 * numS);
        const calcT = (2 * numS) / (numU + numV);
        setSuvatResult(`Using v² = u² + 2as & t = 2s/(u + v):\n• Acceleration (a) = ${calcA.toFixed(3)} m s⁻²\n• Time (t) = ${calcT.toFixed(3)} s`);
        return;
      }

      // Case: Known u, a, s -> find v
      if (numU !== null && numA !== null && numS !== null) {
        const vSquared = Math.pow(numU, 2) + 2 * numA * numS;
        if (vSquared < 0) {
          setSuvatResult('Physical impossibility: v² < 0 with current inputs (object stops before reaching s).');
          return;
        }
        const calcV = Math.sqrt(vSquared);
        const calcT = (calcV - numU) / numA;
        setSuvatResult(`Using v² = u² + 2as & t = (v - u)/a:\n• Final velocity (v) = ±${calcV.toFixed(3)} m s⁻¹\n• Time (t) = ${calcT.toFixed(3)} s`);
        return;
      }

      setSuvatResult(`Successfully computed values based on Cambridge SUVAT kinematics principles.`);
    } catch (e: any) {
      setSuvatResult('Calculation error. Please check numerical inputs.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <Atom className="w-3.5 h-3.5 text-blue-400" />
              <span>Cambridge International A-Level • Syllabus 9702</span>
            </div>
            <h1 className="text-2xl font-black">Physics Learning Center</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting A* in Paper 1 (MCQ), Paper 2 (Structured), and Paper 3 (Practical).
              Master SI base units, vectors, SUVAT kinematics, Newton's laws, and wave mechanics.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveScreen('quiz')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Take Physics Quiz
            </button>
            <button
              onClick={() => setActiveScreen('tutor')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
            >
              Ask Physics AI Tutor
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('suvat_calc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'suvat_calc' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            SUVAT Kinematics Solver
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'topics' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Syllabus Topics & Mastery ({physicsSyllabus.topics.length})
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'formulas' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Formula Reference & SI Units
          </button>
          <button
            onClick={() => setActiveTab('graph_tool')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'graph_tool' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Motion Graphs & Gradients
          </button>
          <button
            onClick={() => setActiveTab('practical_guide')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'practical_guide' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Paper 3 & 5 Practical Uncertainties
          </button>
        </div>
      </div>

      {/* TAB 1: SUVAT KINEMATICS SOLVER */}
      {activeTab === 'suvat_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Interactive SUVAT Equations of Motion Solver</span>
              </h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                Constant Acceleration
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter any 3 known quantities to calculate the remaining 2 variables according to Cambridge A-Level specifications:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Velocity (u) in m s⁻¹
                </label>
                <input
                  type="number"
                  step="any"
                  value={suvatInputs.u}
                  onChange={(e) => setSuvatInputs({ ...suvatInputs, u: e.target.value })}
                  placeholder="e.g. 0 (at rest) or 15"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Final Velocity (v) in m s⁻¹
                </label>
                <input
                  type="number"
                  step="any"
                  value={suvatInputs.v}
                  onChange={(e) => setSuvatInputs({ ...suvatInputs, v: e.target.value })}
                  placeholder="e.g. 28.5"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Acceleration (a) in m s⁻² (use 9.81 for freefall)
                </label>
                <input
                  type="number"
                  step="any"
                  value={suvatInputs.a}
                  onChange={(e) => setSuvatInputs({ ...suvatInputs, a: e.target.value })}
                  placeholder="e.g. 9.81 or -2.5"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time (t) in s
                </label>
                <input
                  type="number"
                  step="any"
                  value={suvatInputs.t}
                  onChange={(e) => setSuvatInputs({ ...suvatInputs, t: e.target.value })}
                  placeholder="e.g. 4.0"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Displacement (s) in m
                </label>
                <input
                  type="number"
                  step="any"
                  value={suvatInputs.s}
                  onChange={(e) => setSuvatInputs({ ...suvatInputs, s: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={calculateSuvat}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Calculate Unknowns
              </button>
              <button
                onClick={() => {
                  setSuvatInputs({ u: '', v: '', a: '', t: '', s: '' });
                  setSuvatResult(null);
                }}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            </div>

            {suvatResult && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm font-mono whitespace-pre-line text-blue-950 dark:text-blue-200">
                {suvatResult}
              </div>
            )}
          </div>

          {/* SUVAT Formulas Sidebar Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              CIE 9702 SUVAT Formula List
            </h3>

            <div className="space-y-3 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1. v = u + at</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Missing displacement (s)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2. s = ut + ½at²</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Missing final velocity (v)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3. v² = u² + 2as</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Missing time (t)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-bold">4. s = ½(u + v)t</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Missing acceleration (a)</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              <strong>Examiner Note:</strong> Always define upward as positive or downward as positive before plugging values into SUVAT! If taking upward as positive, g = -9.81 m s⁻².
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPICS & MASTERY */}
      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Cambridge 9702 Syllabus Topics & Mastery Levels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicsSyllabus.topics.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-blue-400 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.mastery === 'Nearly Mastered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    t.mastery === 'Developing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    t.mastery === 'Learning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-200 text-slate-600 dark:bg-slate-700'
                  }`}>
                    {t.mastery}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${t.progress}%` }} />
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

      {/* TAB 3: FORMULAS & UNITS */}
      {activeTab === 'formulas' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Official Cambridge 9702 Formulae & Data Sheet Highlights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">SI Base Quantities & Units</h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• Mass: kilogram (kg)</li>
                <li>• Length: meter (m)</li>
                <li>• Time: second (s)</li>
                <li>• Electric Current: ampere (A)</li>
                <li>• Thermodynamic Temperature: kelvin (K)</li>
                <li>• Amount of substance: mole (mol)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Dynamics & Energy</h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 font-mono">
                <li>• Resultant Force: F = dp/dt = ma</li>
                <li>• Momentum: p = mv</li>
                <li>• Kinetic Energy: Ek = ½mv² = p²/(2m)</li>
                <li>• Gravitational Potential: Ep = mgh</li>
                <li>• Work: W = Fs cos θ</li>
                <li>• Power: P = W/t = Fv</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MOTION GRAPHS */}
      {activeTab === 'graph_tool' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            <span>Motion Graph Interpretation Rules (Cambridge Mark Scheme)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-2">Displacement-Time (s-t)</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Gradient:</strong> equals Velocity (v = Δs/Δt).<br />
                • Straight line: constant velocity.<br />
                • Curve upwards: accelerating.<br />
                • Flat line: at rest (velocity = 0).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-2">Velocity-Time (v-t)</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Gradient:</strong> equals Acceleration (a = Δv/Δt).<br />
                • <strong>Area under graph:</strong> equals Displacement (s).<br />
                • Area above time axis: forward displacement.<br />
                • Area below time axis: backward displacement.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-700">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-2">Acceleration-Time (a-t)</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • <strong>Area under graph:</strong> equals Change in Velocity (Δv).<br />
                • Zero area: no change in velocity (steady speed).<br />
                • Freefall near Earth surface: horizontal line at a = -9.81 m s⁻².
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CAMBRIDGE PRACTICAL SKILLS & UNCERTAINTIES (PAPER 3 & PAPER 5) */}
      {activeTab === 'practical_guide' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Cambridge Advanced Practical Masterclass
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Paper 3 & Paper 5 Practical Skills & Uncertainty Rules
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Target: 40/40 in Practical & Planning
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Uncertainty Combination Rules */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Combining Uncertainties (Official Cambridge Rules)
              </h3>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>• Adding or Subtracting (y = a ± b):</strong> Add ABSOLUTE uncertainties.<br />
                  <span className="font-mono text-blue-600 dark:text-blue-400">Δy = Δa + Δb</span>
                </p>
                <p>
                  <strong>• Multiplying or Dividing (y = a × b or a/b):</strong> Add FRACTIONAL or PERCENTAGE uncertainties.<br />
                  <span className="font-mono text-blue-600 dark:text-blue-400">Δy / y = (Δa / a) + (Δb / b)</span>
                </p>
                <p>
                  <strong>• Raising to a Power (y = xⁿ):</strong> Multiply percentage uncertainty by the power.<br />
                  <span className="font-mono text-blue-600 dark:text-blue-400">%Δy = n × (%Δx)</span>
                </p>
                <p>
                  <strong>• Multiplying by a Constant (y = 2πr):</strong> Constant has NO uncertainty.<br />
                  <span className="font-mono text-blue-600 dark:text-blue-400">%Δy = %Δr</span>
                </p>
              </div>
            </div>

            {/* Instrument Precisions */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Standard Instrument Precisions (Paper 3 Table Values)
              </h3>
              <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">Metre rule (millimeter markings):</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">± 1 mm (or ± 0.1 cm)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">Vernier caliper:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">± 0.1 mm (or ± 0.01 cm)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">Micrometer screw gauge:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">± 0.01 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-semibold">Digital stopwatch:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">± 0.2 s (human reaction time)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold">Liquid-in-glass thermometer:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">± 0.5 °C</span>
                </div>
              </div>
            </div>

            {/* Graph Analysis in Paper 3 & 5 */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                3. Gradient & Intercept Uncertainty from Best & Worst Lines
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                • <strong>Line of Best Fit:</strong> Must balance points equally above and below, passing through the centroid.<br />
                • <strong>Worst Acceptable Line:</strong> Must pass through top of top error bar to bottom of bottom error bar (or vice versa).<br />
                • <strong>Gradient Uncertainty:</strong> <span className="font-mono font-bold">|gradient(best) - gradient(worst)|</span>.<br />
                • <strong>y-Intercept Uncertainty:</strong> <span className="font-mono font-bold">|y-intercept(best) - y-intercept(worst)|</span>.<br />
                • Both values must be quoted to 1 significant figure in your final answer statement!
              </p>
            </div>

            {/* Examiner Paper 5 Planning Checklist */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">
                4. Paper 5 Planning Blueprint (15 Marks Checklist)
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                • <strong>Independent Variable (IV):</strong> State what you vary and the instrument used.<br />
                • <strong>Dependent Variable (DV):</strong> State what you measure and the instrument used.<br />
                • <strong>Control Variables:</strong> Name 2 key physical variables kept constant and explain HOW (e.g. water bath for temperature, fixed mass for tension).<br />
                • <strong>Linear Equation:</strong> Rearrange formula into <span className="font-mono">y = mx + c</span> format.<br />
                • <strong>Safety Precautions:</strong> Must be specific to the hazard (e.g. wearing safety goggles with stretched wire/spring, insulating hot apparatus).
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

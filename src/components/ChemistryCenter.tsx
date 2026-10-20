import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  FlaskConical,
  Calculator,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  Atom
} from 'lucide-react';

export const ChemistryCenter: React.FC = () => {
  const { state, setActiveScreen } = useAcademy();
  const chemSyllabus = state.syllabuses.Chemistry;

  const [activeTab, setActiveTab] = useState<'moles_calc' | 'titration_calc' | 'ideal_gas' | 'topics' | 'bonding' | 'qualitative_analysis'>('moles_calc');

  // Moles / Mr Calculator State
  const [compound, setCompound] = useState<'H2O' | 'NaCl' | 'CuSO4.5H2O' | 'CaCO3' | 'H2SO4' | 'C6H12O6' | 'Custom'>('CuSO4.5H2O');
  const [customMr, setCustomMr] = useState<string>('249.6');
  const [massInput, setMassInput] = useState<string>('12.48');
  const [molesResult, setMolesResult] = useState<string | null>(null);

  // Titration Calculator State
  const [acidConc, setAcidConc] = useState<string>('0.100'); // mol dm-3
  const [acidVol, setAcidVol] = useState<string>('25.0'); // cm3
  const [baseVol, setBaseVol] = useState<string>('22.4'); // cm3
  const [ratioAcidToBase, setRatioAcidToBase] = useState<string>('1'); // 1:1
  const [titrationResult, setTitrationResult] = useState<string | null>(null);

  // Ideal Gas State
  const [pressureKpa, setPressureKpa] = useState<string>('101.3');
  const [volDm3, setVolDm3] = useState<string>('2.5');
  const [tempC, setTempC] = useState<string>('25');
  const [gasMolesResult, setGasMolesResult] = useState<string | null>(null);

  // Common molar masses
  const presetMr: Record<string, number> = {
    H2O: 18.015,
    NaCl: 58.44,
    'CuSO4.5H2O': 249.68,
    CaCO3: 100.09,
    H2SO4: 98.08,
    C6H12O6: 180.16,
  };

  const calculateMoles = () => {
    const mr = compound === 'Custom' ? parseFloat(customMr) : presetMr[compound];
    const m = parseFloat(massInput);

    if (isNaN(mr) || isNaN(m) || mr <= 0) {
      setMolesResult('Please enter valid positive numbers.');
      return;
    }

    const n = m / mr;
    const molecules = n * 6.022e23;
    setMolesResult(
      `• Formula: ${compound} (Mr = ${mr.toFixed(2)} g mol⁻¹)\n• Given Mass (m) = ${m} g\n• Calculated Moles (n = m / Mr) = ${n.toFixed(4)} mol\n• Number of Particles (n × L) = ${molecules.toExponential(3)} particles`
    );
  };

  const calculateTitration = () => {
    const cA = parseFloat(acidConc);
    const vA = parseFloat(acidVol) / 1000; // dm3
    const vB = parseFloat(baseVol) / 1000; // dm3
    const ratio = parseFloat(ratioAcidToBase);

    if (isNaN(cA) || isNaN(vA) || isNaN(vB) || isNaN(ratio) || vB <= 0) {
      setTitrationResult('Please enter valid positive titration numbers.');
      return;
    }

    const molesAcid = cA * vA;
    const molesBase = molesAcid * ratio;
    const concBase = molesBase / vB;

    setTitrationResult(
      `• Moles of Acid = ${cA} × ${vA} = ${molesAcid.toFixed(5)} mol\n• Moles of Base Reacted = ${molesBase.toFixed(5)} mol (Stoichiometric ratio 1:${ratio})\n• Concentration of Unknown Base = ${concBase.toFixed(4)} mol dm⁻³\n• In g dm⁻³ (for NaOH, Mr=40): ${(concBase * 40).toFixed(2)} g dm⁻³`
    );
  };

  const calculateIdealGas = () => {
    const p = parseFloat(pressureKpa) * 1000; // Pa
    const v = parseFloat(volDm3) * 1e-3; // m3
    const t = parseFloat(tempC) + 273.15; // K
    const R = 8.314; // J K-1 mol-1

    if (isNaN(p) || isNaN(v) || isNaN(t) || t <= 0) {
      setGasMolesResult('Please enter valid gas parameters.');
      return;
    }

    const n = (p * v) / (R * t);
    setGasMolesResult(
      `• Converted Units: p = ${p} Pa, V = ${v} m³, T = ${t.toFixed(1)} K\n• Gas Constant R = 8.314 J K⁻¹ mol⁻¹\n• Moles of Gas (n = pV / RT) = ${n.toFixed(4)} mol\n• Molar volume at these conditions = ${(v / n * 1000).toFixed(2)} dm³ mol⁻¹`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cambridge International A-Level • Syllabus 9701</span>
            </div>
            <h1 className="text-2xl font-black">Chemistry Learning Center</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting A* across Physical, Inorganic, and Organic Chemistry.
              Master mole calculations, empirical formulas, ideal gases, atomic orbitals, and reaction pathways.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveScreen('quiz')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Take Chemistry Quiz
            </button>
            <button
              onClick={() => setActiveScreen('tutor')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
            >
              Ask Chemistry Tutor
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('moles_calc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'moles_calc' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Mole & Mr Calculator
          </button>
          <button
            onClick={() => setActiveTab('titration_calc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'titration_calc' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Titration & Concentration Tool
          </button>
          <button
            onClick={() => setActiveTab('ideal_gas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'ideal_gas' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Ideal Gas Solver (pV = nRT)
          </button>
          <button
            onClick={() => setActiveTab('bonding')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'bonding' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Bonding & Shapes Reference
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'topics' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Syllabus Topics & Progress
          </button>
          <button
            onClick={() => setActiveTab('qualitative_analysis')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'qualitative_analysis' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
          >
            Paper 3 Qualitative Analysis Notes
          </button>
        </div>
      </div>

      {/* TAB 1: MOLE & MR CALCULATOR */}
      {activeTab === 'moles_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Relative Molecular Mass (Mr) & Moles Calculator</span>
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                n = m / Mr
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an A-Level compound preset or input custom Mr with sample mass to determine stoichiometric moles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Compound Preset
                </label>
                <select
                  value={compound}
                  onChange={(e) => setCompound(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="CuSO4.5H2O">Copper(II) Sulfate Pentahydrate (CuSO4.5H2O)</option>
                  <option value="CaCO3">Calcium Carbonate (CaCO3)</option>
                  <option value="NaCl">Sodium Chloride (NaCl)</option>
                  <option value="H2SO4">Sulfuric Acid (H2SO4)</option>
                  <option value="C6H12O6">Glucose (C6H12O6)</option>
                  <option value="H2O">Water (H2O)</option>
                  <option value="Custom">Custom Mr...</option>
                </select>
              </div>

              {compound === 'Custom' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Molecular Mass (Mr) in g mol⁻¹
                  </label>
                  <input
                    type="number"
                    value={customMr}
                    onChange={(e) => setCustomMr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mass of Sample (m) in grams
                </label>
                <input
                  type="number"
                  value={massInput}
                  onChange={(e) => setMassInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={calculateMoles}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Calculate Stoichiometric Moles
            </button>

            {molesResult && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm font-mono whitespace-pre-line text-emerald-950 dark:text-emerald-200">
                {molesResult}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Key Stoichiometry Formulas
            </h3>

            <div className="space-y-3 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">1. n = m / Mr</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Solids: Mass in g, Mr in g mol⁻¹</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">2. n = c × V</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Solutions: c in mol dm⁻³, V in dm³ (cm³ / 1000)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">3. % Yield = (Actual / Theor.) × 100</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">Organic synthesis efficiency</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              <strong>Cambridge Tip:</strong> Remember Avogadro's constant L = 6.02 × 10²³ mol⁻¹. Round final answers to 3 significant figures unless specified otherwise!
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TITRATION CALCULATOR */}
      {activeTab === 'titration_calc' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <span>Volumetric Titration & Concentration Calculator</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Standard Acid Conc. (mol dm⁻³)
              </label>
              <input
                type="number"
                step="any"
                value={acidConc}
                onChange={(e) => setAcidConc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Volume of Acid (cm³)
              </label>
              <input
                type="number"
                step="any"
                value={acidVol}
                onChange={(e) => setAcidVol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Titre Volume of Base (cm³)
              </label>
              <input
                type="number"
                step="any"
                value={baseVol}
                onChange={(e) => setBaseVol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reaction Ratio (Moles Base / Acid)
              </label>
              <input
                type="number"
                step="any"
                value={ratioAcidToBase}
                onChange={(e) => setRatioAcidToBase(e.target.value)}
                placeholder="1 for HCl+NaOH, 2 for H2SO4+2NaOH"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={calculateTitration}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Calculate Base Concentration
          </button>

          {titrationResult && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm font-mono whitespace-pre-line text-emerald-950 dark:text-emerald-200">
              {titrationResult}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IDEAL GAS SOLVER */}
      {activeTab === 'ideal_gas' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Atom className="w-5 h-5 text-emerald-600" />
            <span>Ideal Gas Equation Calculator: pV = nRT</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pressure (p) in kPa
              </label>
              <input
                type="number"
                step="any"
                value={pressureKpa}
                onChange={(e) => setPressureKpa(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Volume (V) in dm³
              </label>
              <input
                type="number"
                step="any"
                value={volDm3}
                onChange={(e) => setVolDm3(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Temperature (T) in °C
              </label>
              <input
                type="number"
                step="any"
                value={tempC}
                onChange={(e) => setTempC(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={calculateIdealGas}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Calculate Moles of Gas
          </button>

          {gasMolesResult && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm font-mono whitespace-pre-line text-emerald-950 dark:text-emerald-200">
              {gasMolesResult}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BONDING & SHAPES */}
      {activeTab === 'bonding' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            VSEPR Theory: Molecular Shapes and Bond Angles (CIE 9701)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Linear (180°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">2 bonding pairs, 0 lone pairs. Example: BeCl2, CO2.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Trigonal Planar (120°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">3 bonding pairs, 0 lone pairs. Example: BF3, AlCl3.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Tetrahedral (109.5°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">4 bonding pairs, 0 lone pairs. Example: CH4, NH4+.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Pyramidal (107°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">3 bonding pairs, 1 lone pair. Example: NH3, PCl3 (lone pair repels more strongly by 2.5°).</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Non-Linear / Bent (104.5°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">2 bonding pairs, 2 lone pairs. Example: H2O.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Octahedral (90°)</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">6 bonding pairs, 0 lone pairs. Example: SF6.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TOPICS & MASTERY */}
      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Cambridge 9701 Chemistry Syllabus Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chemSyllabus.topics.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.mastery === 'Consistently Demonstrated' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    t.mastery === 'Nearly Mastered' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                    t.mastery === 'Developing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-slate-200 text-slate-600 dark:bg-slate-700'
                  }`}>
                    {t.mastery}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${t.progress}%` }} />
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

      {/* TAB 6: PAPER 3 QUALITATIVE ANALYSIS & ION IDENTIFICATION */}
      {activeTab === 'qualitative_analysis' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Official CIE 9701 Practical Reference
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Qualitative Analysis & Chemical Identification Notes
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Paper 3 Confidential Reference Sheet
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Cation Identification Table */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Characteristic Cation Reactions (NaOH & NH₃)
              </h3>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Al³⁺ (Aluminium):</span>
                  • NaOH: White ppt, soluble in excess (colourless solution).<br />
                  • NH₃: White ppt, insoluble in excess.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Zn²⁺ (Zinc):</span>
                  • NaOH: White ppt, soluble in excess.<br />
                  • NH₃: White ppt, <strong>soluble in excess</strong> (giving colourless solution).
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Ca²⁺ (Calcium):</span>
                  • NaOH: White ppt, insoluble in excess.<br />
                  • NH₃: No precipitate (or slight white haze at high conc).
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Cu²⁺ (Copper):</span>
                  • NaOH: Pale blue ppt, insoluble in excess.<br />
                  • NH₃: Pale blue ppt, <strong>dissolves in excess to deep blue solution</strong>.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Fe²⁺ & Fe³⁺ (Iron):</span>
                  • Fe²⁺: Green ppt, insoluble in excess (turns red-brown on standing in air).<br />
                  • Fe³⁺: Red-brown ppt, insoluble in excess of both reagents.
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">NH₄⁺ (Ammonium):</span>
                  • Ammonia produced on warming with NaOH (turns damp red litmus paper blue).
                </div>
              </div>
            </div>

            {/* Anions and Gases */}
            <div className="space-y-4">
              {/* Anion Table */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Anion Confirmation Tests
                </h3>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>• Halides (Cl⁻, Br⁻, I⁻):</strong> Acidify with dilute HNO₃, add aqueous AgNO₃.<br />
                    - Cl⁻: White ppt (dissolves in dilute NH₃).<br />
                    - Br⁻: Cream ppt (dissolves in concentrated NH₃).<br />
                    - I⁻: Yellow ppt (insoluble in concentrated NH₃).
                  </p>
                  <p>
                    <strong>• Sulfate (SO₄²⁻):</strong> Acidify with dilute HNO₃ or HCl, add aqueous Ba(NO₃)₂ or BaCl₂ → Dense white ppt of BaSO₄.
                  </p>
                  <p>
                    <strong>• Carbonate (CO₃²⁻):</strong> Add dilute acid → Vigorous effervescence of CO₂ gas (turns limewater milky).
                  </p>
                  <p>
                    <strong>• Nitrate (NO₃⁻):</strong> Add aqueous NaOH, then aluminum foil; warm gently → Ammonia gas pungent vapor evolved.
                  </p>
                </div>
              </div>

              {/* Gas Tests */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                  3. Key Gas Confirmation Tests
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <div><strong>• Ammonia (NH₃):</strong> Turns damp red litmus blue.</div>
                  <div><strong>• Carbon dioxide (CO₂):</strong> Turns limewater milky.</div>
                  <div><strong>• Chlorine (Cl₂):</strong> Bleaches damp litmus paper.</div>
                  <div><strong>• Hydrogen (H₂):</strong> 'Pops' with a lighted splint.</div>
                  <div><strong>• Oxygen (O₂):</strong> Relights a glowing splint.</div>
                  <div><strong>• Sulfur dioxide (SO₂):</strong> Decolourises purple acidified KMnO₄.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

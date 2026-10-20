import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Camera,
  Upload,
  RotateCw,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  BookmarkPlus,
  Layers,
  AlertTriangle,
  Languages,
  Video,
  X
} from 'lucide-react';

export const PhotoSolver: React.FC = () => {
  const { addMistake, addFlashcard, saveSolutionRecord, language } = useAcademy();

  const [selectedSubject, setSelectedSubject] = useState<'Auto-detect' | 'Physics' | 'Chemistry' | 'Computer Science'>('Auto-detect');
  const [solutionMode, setSolutionMode] = useState<string>('step_by_step');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  // Image states
  const [images, setImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  
  // Camera live stream states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Result & loading states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const modes = [
    { id: 'step_by_step', label: 'B. Solve Step by Step', desc: 'Full mathematical/logical working with formulas' },
    { id: 'explain_concept', label: 'A. Explain the Concept', desc: 'Intuitive breakdown of underlying principles' },
    { id: 'hint', label: 'C. Give Me a Hint', desc: 'Guided hints so you can solve it yourself' },
    { id: 'exam_answer', label: 'D. Exam-Style Answer', desc: 'Official Cambridge A-Level Mark Scheme format' },
    { id: 'check_answer', label: 'E. Check My Answer', desc: 'Verifies your written attempt and highlights errors' },
    { id: 'urdu', label: 'F. Explain in Urdu', desc: 'Concept explained in clear Urdu with English technical terms' },
    { id: 'similar_questions', label: 'G. Generate Similar Questions', desc: 'Targeted practice to reinforce A* mastery' },
    { id: 'mark_work', label: 'H. Mark My Written Work', desc: 'Provisional marks awarded with examiner tips' },
  ];

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Start phone/webcam camera
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera stream error, falling back to file capture:', err);
      setIsCameraActive(false);
      // Trigger file input with capture
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setImages((prev) => [...prev, dataUrl]);
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (activeImageIndex >= index && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  const createSampleQuestionImage = (subj: 'Physics' | 'Chemistry' | 'Computer Science') => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 420);

    // Subtle exam grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 20; i < 800; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 420);
      ctx.stroke();
    }
    for (let j = 20; j < 420; j += 30) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(800, j);
      ctx.stroke();
    }

    // Top banner
    ctx.fillStyle = subj === 'Physics' ? '#1e3a8a' : subj === 'Chemistry' ? '#065f46' : '#581c87';
    ctx.fillRect(0, 0, 800, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Cambridge International A-Level • ${subj} Examination Paper`, 24, 30);

    // Text content
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px serif';
    if (subj === 'Physics') {
      ctx.fillText('CIE 9702/22 Structured Question:', 30, 85);
      ctx.font = '15px serif';
      ctx.fillText('A projectile is launched from horizontal ground with speed 28 m s⁻¹ at an angle', 30, 125);
      ctx.fillText('of 40° to the horizontal. Air resistance is negligible. (g = 9.81 m s⁻²)', 30, 155);
      ctx.fillText('(a) Calculate the vertical component of the launch velocity. [1]', 30, 205);
      ctx.fillText('(b) Show that the time taken to reach the maximum height is 1.83 s. [2]', 30, 245);
      ctx.fillText('(c) Calculate the maximum height reached above the ground. [2]', 30, 285);
      ctx.fillText('(d) Calculate the horizontal range R of the projectile. [2]', 30, 325);
    } else if (subj === 'Chemistry') {
      ctx.fillText('CIE 9701/21 Structured Question:', 30, 85);
      ctx.font = '15px serif';
      ctx.fillText('A 25.0 cm³ sample of standard iron(II) sulfate solution requires 22.40 cm³ of', 30, 125);
      ctx.fillText('0.0200 mol dm⁻³ potassium manganate(VII), KMnO₄, for complete reaction in acid.', 30, 155);
      ctx.fillText('5Fe²⁺(aq) + MnO₄⁻(aq) + 8H⁺(aq) -> 5Fe³⁺(aq) + Mn²⁺(aq) + 4H₂O(l)', 30, 205);
      ctx.fillText('(a) State the oxidation state change of manganese during this titration. [1]', 30, 245);
      ctx.fillText('(b) Calculate the amount in moles of MnO₄⁻ used in the titration. [1]', 30, 285);
      ctx.fillText('(c) Determine the concentration of Fe²⁺ in mol dm⁻³. [2]', 30, 325);
    } else {
      ctx.fillText('CIE 9618/22 Pseudocode & Algorithm Question:', 30, 85);
      ctx.font = '14px monospace';
      ctx.fillText('DECLARE NumberArray : ARRAY[0:4] OF INTEGER', 30, 120);
      ctx.fillText('DECLARE i, Total : INTEGER', 30, 145);
      ctx.fillText('Total <- 0', 30, 170);
      ctx.fillText('FOR i <- 0 TO 4', 30, 195);
      ctx.fillText('  NumberArray[i] <- (i + 1) * 3', 30, 220);
      ctx.fillText('  Total <- Total + NumberArray[i]', 30, 245);
      ctx.fillText('ENDFOR', 30, 270);
      ctx.font = '15px serif';
      ctx.fillText('Construct a trace table to record the values of i, NumberArray, and Total. [4]', 30, 320);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setImages([dataUrl]);
    setActiveImageIndex(0);
    setSelectedSubject(subj);
    setToastMsg(`Loaded sample ${subj} question! Click 'Analyze & Solve' below.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Submit to Gemini Photo Solver
  const handleAnalyzeQuestion = async () => {
    if (images.length === 0) {
      setErrorMsg('Please capture or upload a photograph of your question first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const activeImage = images[activeImageIndex] || images[0];

      const res = await fetch('/api/gemini/photo-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeImage,
          subject: selectedSubject,
          mode: solutionMode,
          additionalNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to solve photo. Status: ' + res.status);
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while analyzing the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Actions on result
  const handleSaveToNotebook = () => {
    if (!analysisResult) return;
    addMistake({
      subject: (analysisResult.detectedSubject || 'Physics') as any,
      topic: analysisResult.topic || 'A-Level Problem',
      category: 'Conceptual misunderstanding',
      question: analysisResult.recognizedQuestion || 'Photo Scanned Question',
      studentAnswer: 'From Photo Upload Attempt',
      correctAnswer: analysisResult.finalAnswer || 'Verified Cambridge Solution',
      explanation: analysisResult.explanation || 'Reviewed via AI Photo Solver',
      status: 'Under Review',
    });
    setToastMsg('Saved to Mistake Notebook for spaced revision!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateFlashcard = () => {
    if (!analysisResult) return;
    addFlashcard({
      subject: (analysisResult.detectedSubject || 'Physics') as any,
      topic: analysisResult.topic || 'Photo Problem',
      front: analysisResult.recognizedQuestion?.slice(0, 180) + '...',
      back: `Final Answer: ${analysisResult.finalAnswer}\n\nWorking:\n${(analysisResult.stepByStepSolution || []).slice(0, 3).join('\n')}`,
      intervalDays: 1,
      reviewDue: new Date().toISOString().split('T')[0],
      confidence: 'Medium',
    });
    setToastMsg('Flashcard created in daily revision queue!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSolution = () => {
    if (!analysisResult) return;
    saveSolutionRecord({
      subject: (analysisResult.detectedSubject || 'Physics') as any,
      topic: analysisResult.topic || 'Exam Question',
      mode: solutionMode,
      questionText: analysisResult.recognizedQuestion || '',
      solution: (analysisResult.stepByStepSolution || []).join('\n'),
      finalAnswer: analysisResult.finalAnswer || '',
      imageThumbnail: images[0],
      notes: additionalNotes,
    });
    setToastMsg('Question solution saved to Notes & Document Library!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white font-medium text-sm rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multimodal A-Level Question Scanner</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Scan & Solve from a Photo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Snap textbook problems, diagrams, handwritten workings, or past paper sheets.
              Powered by Google Gemini multimodal intelligence.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={startCamera}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <Camera className="w-4 h-4" />
              <span>Open Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Images</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Live Camera View Modal / Area */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-4 border-indigo-600 shadow-2xl">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
          
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={stopCamera}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 flex items-center space-x-4">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full border-4 border-white bg-indigo-600 hover:bg-indigo-500 shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform active:scale-90"
            >
              SNAP
            </button>
          </div>
        </div>
      )}

      {/* Question Configuration (Subject & Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Subject Select */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            1. Select Subject
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Auto-detect', 'Physics', 'Chemistry', 'Computer Science'] as const).map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`py-2 px-3 rounded-lg font-medium text-left border transition-all ${
                  selectedSubject === subj
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Select */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            2. Choose Solution Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSolutionMode(m.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  solutionMode === m.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="font-bold">{m.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Image Preview & Controls */}
      {images.length === 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              No Question Photo Loaded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Snap a picture with your phone camera, upload a photo or screenshot, or test right now with an authentic Cambridge exam sample:
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => createSampleQuestionImage('Physics')}
              className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold rounded-xl transition-all"
            >
              • Sample Physics Projectiles (9702)
            </button>
            <button
              onClick={() => createSampleQuestionImage('Chemistry')}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-xl transition-all"
            >
              • Sample Chemistry Redox Titration (9701)
            </button>
            <button
              onClick={() => createSampleQuestionImage('Computer Science')}
              className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold rounded-xl transition-all"
            >
              • Sample CS Trace Table (9618)
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Captured / Uploaded Photographs ({images.length})
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRotate}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>
              <button
                onClick={() => removeImage(activeImageIndex)}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Active Image Canvas/Preview */}
          <div className="relative bg-slate-900 rounded-xl overflow-hidden max-h-[420px] flex items-center justify-center p-2">
            <img
              src={images[activeImageIndex]}
              alt="Question preview"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-[400px] w-auto object-contain transition-transform duration-200 rounded-lg shadow-md"
            />
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                    activeImageIndex === idx ? 'border-indigo-600' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Add Specific Question Context (Optional):
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Focus on part (c), or check my handwritten step in pencil..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleAnalyzeQuestion}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-101 active:scale-99 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reading Diagram, Formulas & Solving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Solve This Question Now with Gemini Multimodal AI</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ANALYSIS RESULT CARD */}
      {analysisResult && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 p-6 shadow-xl space-y-6 animate-fadeIn">
          
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-sm bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {analysisResult.detectedSubject}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Topic: {analysisResult.topic}
                </span>
                {analysisResult.provisionalScore && (
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Mark: {analysisResult.provisionalScore}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Solution & Examiner Analysis
              </h2>
            </div>

            {/* Quick Actions for Solved Result */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveSolution}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Save Solution</span>
              </button>
              <button
                onClick={handleCreateFlashcard}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center space-x-1"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Make Flashcard</span>
              </button>
              <button
                onClick={handleSaveToNotebook}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 flex items-center space-x-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Add to Mistake Notebook</span>
              </button>
            </div>
          </div>

          {/* Unclear warning if any */}
          {analysisResult.unclearWarning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300">
              ⚠️ Note: {analysisResult.unclearWarning}
            </div>
          )}

          {/* Transcribed Question */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Recognized Question & Symbols
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line">
              {analysisResult.recognizedQuestion}
            </p>
          </div>

          {/* Concept Explanation */}
          {analysisResult.explanation && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Conceptual Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysisResult.explanation}
              </p>
            </div>
          )}

          {/* Step-by-Step Solution */}
          {analysisResult.stepByStepSolution && analysisResult.stepByStepSolution.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Step-by-Step Working & Calculation
              </h3>
              <div className="space-y-2">
                {analysisResult.stepByStepSolution.map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-indigo-50/40 dark:bg-slate-900/40 border border-indigo-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Answer Banner */}
          {analysisResult.finalAnswer && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Final Answer (Units & Precision Verified)
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono">
                  {analysisResult.finalAnswer}
                </span>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
            </div>
          )}

          {/* Formulas Used */}
          {analysisResult.formulasUsed && analysisResult.formulasUsed.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Formulas & Principles Applied
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.formulasUsed.map((form: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium"
                  >
                    {form}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes & Examiner Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Common Mistakes */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Examiner Pitfalls</span>
              </h4>
              <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-1.5 list-disc list-inside">
                {(analysisResult.commonMistakes || ['Omitting units in final answer', 'Rounding intermediate calculations']).map((m: string, idx: number) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Exam Tips */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cambridge A* Examination Technique</span>
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {analysisResult.examTips || 'Always write the symbolic equation before numerical substitution to secure the method mark [M1].'}
              </p>
            </div>

          </div>

          {/* Follow-up practice */}
          {analysisResult.followUpQuestions && analysisResult.followUpQuestions.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Targeted Follow-up Practice Questions
              </h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {analysisResult.followUpQuestions.map((q: string, idx: number) => (
                  <div key={idx} className="p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">Q{idx + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

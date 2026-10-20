import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  CheckSquare,
  Upload,
  Camera,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookmarkPlus,
  RotateCw,
  X,
  FileText
} from 'lucide-react';
import { SubjectType } from '../types/academy';

export const AnswerMarker: React.FC = () => {
  const { addMistake, saveSolutionRecord } = useAcademy();

  const [inputMode, setInputMode] = useState<'text' | 'photo'>('text');
  const [subject, setSubject] = useState<SubjectType>('Physics');
  const [question, setQuestion] = useState<string>(
    'Explain why a body moving in a circular path at constant speed is accelerating, and state the direction of this acceleration.'
  );
  const [studentAnswer, setStudentAnswer] = useState<string>(
    'Because the direction of the velocity is constantly changing, even though the speed is constant. Acceleration is rate of change of velocity. The acceleration is directed towards the center of the circle.'
  );
  const [maxMarks, setMaxMarks] = useState<number>(3);
  const [markSchemeGuide, setMarkSchemeGuide] = useState<string>('');

  // Photo handwritten states
  const [handwrittenPhoto, setHandwrittenPhoto] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isMarking, setIsMarking] = useState<boolean>(false);
  const [markResult, setMarkResult] = useState<any | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setHandwrittenPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMark = async () => {
    setIsMarking(true);
    setMarkResult(null);

    try {
      if (inputMode === 'photo') {
        if (!handwrittenPhoto) {
          alert('Please upload or capture a photo of your handwritten work first.');
          setIsMarking(false);
          return;
        }

        const res = await fetch('/api/gemini/mark-photo-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: handwrittenPhoto,
            question,
            subject,
            maxMarks,
            markScheme: markSchemeGuide,
          }),
        });

        if (!res.ok) throw new Error('Photo marking failed');
        const data = await res.json();
        setMarkResult(data);
      } else {
        if (!studentAnswer.trim()) {
          alert('Please enter your typed answer.');
          setIsMarking(false);
          return;
        }

        const res = await fetch('/api/gemini/mark-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject,
            question,
            studentAnswer,
            maxMarks,
            markScheme: markSchemeGuide,
          }),
        });

        if (!res.ok) throw new Error('Marking failed');
        const data = await res.json();
        setMarkResult(data);
      }
    } catch (e: any) {
      console.error(e);
      alert('Failed to evaluate work. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };

  const handleSaveToMistakeNotebook = () => {
    if (!markResult) return;
    addMistake({
      subject,
      topic: 'Written Exam Answer',
      category: 'Missing examination points',
      question,
      studentAnswer: inputMode === 'photo' ? (markResult.transcribedWork || 'Handwritten Answer') : studentAnswer,
      correctAnswer: markResult.improvementTip || 'Complete Cambridge Mark Scheme Points',
      explanation: markResult.examinerComment || 'Reviewed via AI Cambridge Answer Marker',
      status: 'Under Review',
    });
    setSavedNotice('Added to Mistake Notebook for targeted remediation!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      {/* Toast Alert */}
      {savedNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xl animate-bounce">
          {savedNotice}
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cambridge Examiner Assessment Engine (Phase 3)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              AI Answer Marking & Detailed Examiner Feedback
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Type your response or take a photo of your handwritten paper.
              Marked according to official Cambridge [M], [A], and [B] mark codes.
            </p>
          </div>

          {/* Toggle Typed vs Handwritten Photo */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setInputMode('text')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                inputMode === 'text'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Type Answer</span>
            </button>
            <button
              onClick={() => setInputMode('photo')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                inputMode === 'photo'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Handwriting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="Physics">Physics (CIE 9702)</option>
              <option value="Chemistry">Chemistry (CIE 9701)</option>
              <option value="Computer Science">Computer Science (CIE 9618)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Marks Available</label>
            <input
              type="number"
              min={1}
              max={15}
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Exam Question:
          </label>
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        {/* Text Mode */}
        {inputMode === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nad e Ali's Written Response:
            </label>
            <textarea
              rows={5}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Type your complete written answer here..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        )}

        {/* Photo Handwritten Mode */}
        {inputMode === 'photo' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Upload Photograph of Handwritten Solution:
            </label>

            {!handwrittenPhoto ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/40 text-center flex flex-col items-center justify-center space-y-2 transition-all"
              >
                <Camera className="w-8 h-8 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click to Take Photo or Upload Image of Handwritten Sheet
                </span>
                <span className="text-[11px] text-slate-400">
                  Supports paper sheets, lined notebook pages, diagrams & numerical calculations
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative bg-slate-900 rounded-xl overflow-hidden max-h-[380px] flex items-center justify-center p-2">
                  <img
                    src={handwrittenPhoto}
                    alt="Handwritten work"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="max-h-[360px] w-auto object-contain rounded-lg"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    <button
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 text-xs flex items-center space-x-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate</span>
                    </button>
                    <button
                      onClick={() => setHandwrittenPhoto(null)}
                      className="p-1.5 rounded-lg bg-rose-600/80 text-white hover:bg-rose-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        <button
          onClick={handleMark}
          disabled={isMarking}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isMarking ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Analyzing against Cambridge A-Level Mark Scheme...</span>
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4" />
              <span>Mark My Response & Generate Examiner Feedback</span>
            </>
          )}
        </button>
      </div>

      {/* MARKING RESULT CARD */}
      {markResult && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-xl space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                Provisional AI Assessment (Cambridge Criteria)
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Score: {markResult.score} / {markResult.maxMarks} Marks ({markResult.percentage}%)
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                markResult.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {markResult.percentage >= 80 ? 'A* Performance' : 'Developing'}
              </span>

              <button
                onClick={handleSaveToMistakeNotebook}
                className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to Mistake Notebook</span>
              </button>
            </div>
          </div>

          {/* Transcribed Handwriting if photo mode */}
          {markResult.transcribedWork && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Transcribed Student Handwriting:
              </span>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {markResult.transcribedWork}
              </p>
            </div>
          )}

          {/* Points Awarded */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marks Awarded Criteria ([M], [A], [B])</span>
            </h3>
            <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1 list-disc list-inside font-medium">
              {(markResult.awardedPoints || []).map((pt: string, idx: number) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Missing Points */}
          {markResult.missingPoints && markResult.missingPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Marks Deducted / Missing Criteria</span>
              </h3>
              <ul className="text-xs text-rose-900 dark:text-rose-200 space-y-1 list-disc list-inside font-medium">
                {markResult.missingPoints.map((pt: string, idx: number) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examiner Comments & Improvement Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Examiner Feedback:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {markResult.examinerComment}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Next Step for 100% Mark:</span>
              </span>
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                {markResult.improvementTip}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center">
            Note: This evaluation is a provisional AI assessment benchmarked against Cambridge A-Level marking guidelines.
          </p>

        </div>
      )}

    </div>
  );
};

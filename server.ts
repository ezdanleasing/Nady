import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase payload limit for photo scanning and document uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent Storage file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'academy-store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully with model gemini-3.8-flash');
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI:', err);
  }
} else {
  console.warn('GEMINI_API_KEY environment variable is not defined.');
}

// Helper to sanitize base64 strings
function extractBase64Data(raw: string): { mimeType: string; data: string } {
  const match = raw.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: raw };
}

// ----------------------------------------------------
// Health & Config Endpoint
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    geminiModel: 'gemini-3.8-flash',
    student: 'Nad e Ali',
    school: 'Lahore Grammar School, Gujrat',
    syllabus: {
      physics: 'CIE 9702',
      chemistry: 'CIE 9701',
      computerScience: 'CIE 9618'
    },
    timezone: 'Asia/Karachi',
    serverTime: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Persistent Storage Endpoints
// ----------------------------------------------------
app.get('/api/storage/load', (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return res.json(JSON.parse(content));
    }
    return res.json({ initialized: false });
  } catch (error) {
    console.error('Error reading persistent store:', error);
    res.status(500).json({ error: 'Failed to read data store' });
  }
});

app.post('/api/storage/save', (req: Request, res: Response) => {
  try {
    const data = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Error saving persistent store:', error);
    res.status(500).json({ error: 'Failed to persist data' });
  }
});

// ----------------------------------------------------
// AI Tutor Endpoint
// ----------------------------------------------------
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  const { question, subject, language = 'English', history = [] } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!aiClient) {
    // Graceful helpful fallback for development if key is missing
    return res.json({
      topic: `${subject || 'General'} A-Level Concept`,
      simpleExplanation: `To solve this in ${subject || 'A-Level'}: Understand the key underlying definitions and the Cambridge examination expectations. (Note: Attach your GEMINI_API_KEY in the Secrets panel to activate full live Gemini tutoring.)`,
      detailedExplanation: `For ${subject || 'A-Levels'}, ensure you identify given quantities, quote formulas explicitly, and maintain correct SI units or precision throughout.`,
      stepByStepSolution: [
        'Step 1: Identify given variables and state the required target.',
        'Step 2: Choose the exact syllabus formula or chemical/computational rule.',
        'Step 3: Substitute numerical or logical values carefully with units.'
      ],
      formulas: ['Relevant formula or definition based on Cambridge syllabus'],
      commonMistakes: [
        'Forgetting units or standard SI conversions',
        'Rounding too early during multi-step calculations'
      ],
      examTips: 'Always quote the base formula before substituting numbers to secure partial credit method marks.',
      practiceQuestion: 'Try a similar question with altered numerical parameters to test your grasp.',
      modelAnswer: 'Full model answer demonstrating standard Cambridge marking points.'
    });
  }

  const systemPrompt = `You are the lead academic tutor for "Nad e Ali A-Level AI Academy".
The student is Nad e Ali from Lahore Grammar School, Gujrat, aiming for an A* in A-Level Physics (CIE 9702), Chemistry (CIE 9701), and Computer Science (CIE 9618).
Respond in ${language === 'Urdu' ? 'clear Urdu (using Urdu script or Nastaliq/Roman Urdu where appropriate with technical terms in English)' : 'clear, academic English with precise Cambridge examination terminology'}.

You MUST return a JSON object adhering strictly to this schema:
{
  "topic": "Specific syllabus topic name (e.g. Kinematics, Mole Calculations, Logic Gates)",
  "simpleExplanation": "Concise, intuitive 2-3 sentence overview for quick understanding",
  "detailedExplanation": "Deep conceptual breakdown explaining the 'why' and 'how'",
  "stepByStepSolution": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "formulas": ["Key formula or equation 1 with SI units", "Formula 2"],
  "commonMistakes": ["Mistake 1 commonly penalised by Cambridge examiners", "Mistake 2"],
  "examTips": "Crucial examination tip for achieving an A* on this topic",
  "practiceQuestion": "A targeted Cambridge A-Level style practice question",
  "modelAnswer": "Model answer for the practice question with mark breakdown"
}`;

  try {
    const prompt = `Subject: ${subject || 'A-Level'}\nStudent Question: ${question}\nLanguage: ${language}\nPrior Context: ${JSON.stringify(history.slice(-3))}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Tutor Error:', err);
    return res.status(500).json({
      error: 'AI Tutor service encountered an error. Please try again.',
      details: err?.message || String(err),
    });
  }
});

// ----------------------------------------------------
// Photo Question Solver Endpoint (Multimodal)
// ----------------------------------------------------
app.post('/api/gemini/photo-solve', async (req: Request, res: Response) => {
  const { imageBase64, subject = 'Auto-detect', mode = 'step_by_step', additionalNotes = '' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  if (!aiClient) {
    return res.json({
      recognizedQuestion: 'Recognized question text from image preview.',
      detectedSubject: subject !== 'Auto-detect' ? subject : 'Physics',
      topic: 'Mechanics & Dynamics (CIE 9702)',
      solutionMode: mode,
      explanation: 'To activate real-time Gemini Multimodal photo analysis, please verify your GEMINI_API_KEY in the Secrets panel.',
      stepByStepSolution: [
        '1. Diagram Analysis: Identify forces acting on the body.',
        '2. Resolve components perpendicular and parallel to the plane.',
        '3. Apply Newton’s Second Law: ΣF = ma.',
        '4. Calculate unknown acceleration or tension.'
      ],
      finalAnswer: 'a = 2.45 m s⁻²',
      formulasUsed: ['F = ma', 'W = mg', 'v² = u² + 2as'],
      commonMistakes: [
        'Confusing sine and cosine when resolving forces on an incline',
        'Forgetting sign convention for opposing friction'
      ],
      examTips: 'Cambridge Paper 2 examiners award 1 mark for stating the equation of motion before substituting numbers.',
      followUpQuestions: [
        'What would happen if the coefficient of friction doubled?',
        'Calculate the time taken to travel 5.0 meters down the plane.'
      ]
    });
  }

  try {
    const { mimeType, data } = extractBase64Data(imageBase64);

    const modeInstructions: Record<string, string> = {
      explain_concept: 'Focus on breaking down the underlying theory, diagrams, and physical/chemical/computational principles.',
      step_by_step: 'Provide an exhaustive, numbered step-by-step solution showing every calculation, substitution, and algebraic rearrangement.',
      hint: 'Do NOT give away the final answer. Provide 3 progressive hints that lead Nad e Ali to solve it himself.',
      exam_answer: 'Format strictly as a Cambridge A-Level Mark Scheme model answer with mark allocations (e.g. [M1], [A1], [B1]).',
      check_answer: 'Evaluate the student work shown in the photo, point out the exact step where an error occurred, and explain how to rectify it.',
      urdu: 'Provide all conceptual explanations and guidance in Urdu (Urdu script / Nastaliq or clear Roman Urdu) while maintaining standard scientific English symbols.',
      similar_questions: 'Generate 2 similar Cambridge A-Level standard questions with complete mark schemes to reinforce mastery.',
      mark_work: 'Mark the student handwritten work shown in the image out of total possible marks. Itemize marks awarded and marks lost.'
    };

    const specificModeGuide = modeInstructions[mode] || modeInstructions.step_by_step;

    const systemPrompt = `You are the Photo Question Solver engine for "Nad e Ali A-Level AI Academy" (Lahore Grammar School, Gujrat).
You are an expert Cambridge A-Level examiner in Physics (9702), Chemistry (9701), and Computer Science (9618).
Selected Subject Preference: ${subject}
Requested Mode: ${mode} (${specificModeGuide})
Additional Notes from student: ${additionalNotes || 'None'}

Instructions:
1. Carefully transcribe the exact question text, diagrams, labels, and numbers from the image. If handwritten, decipher it with care.
2. If essential symbols or values are cut off or unreadable, explicitly inform the student rather than hallucinating.
3. For Physics: Extract given values with units, select the formula, show step-by-step substitution, check SI units, evaluate reasonableness.
4. For Chemistry: Transcribe chemical formulas, balance equations, show mole ratios, state reaction conditions and reagents.
5. For Computer Science: Read pseudocode/code syntax, produce trace tables if algorithms are involved, identify logical/syntax errors.
6. Return a valid JSON object ONLY.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: data,
          },
        },
        {
          text: `Analyze this A-Level question image and provide the solution following mode: ${mode}.
Respond with this exact JSON structure:
{
  "recognizedQuestion": "Full transcribed question text and labels",
  "detectedSubject": "Physics" | "Chemistry" | "Computer Science",
  "topic": "Precise syllabus topic name",
  "solutionMode": "${mode}",
  "explanation": "Clear conceptual summary",
  "stepByStepSolution": ["Step 1: ...", "Step 2: ..."],
  "finalAnswer": "Precise final answer with correct units and significant figures",
  "formulasUsed": ["Formula 1", "Formula 2"],
  "commonMistakes": ["Frequent error 1", "Frequent error 2"],
  "examTips": "Cambridge examiner advice",
  "followUpQuestions": ["Practice question 1", "Practice question 2"],
  "provisionalScore": "e.g. 4/5 marks (if checking/marking work)",
  "unclearWarning": "Message if any text was blurred or partially cropped (or null if crystal clear)"
}`
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Photo Solve Error:', err);
    return res.status(500).json({
      error: 'Failed to analyze question image.',
      details: err?.message || String(err),
    });
  }
});

// ----------------------------------------------------
// Quiz Generator Endpoint
// ----------------------------------------------------
app.post('/api/gemini/generate-quiz', async (req: Request, res: Response) => {
  const { subject, topic, difficulty = 'Standard', numQuestions = 5, format = 'MCQ' } = req.body;

  if (!aiClient) {
    return res.json({
      title: `${subject} - ${topic} Practice Quiz`,
      subject,
      topic,
      difficulty,
      questions: [
        {
          id: 'q1',
          question: `Which of the following correctly describes the fundamental principle of ${topic} in A-Level ${subject}?`,
          options: [
            'Principle follows direct conservation in isolated systems',
            'Principle is only valid at absolute zero',
            'Principle assumes zero resistance in all media',
            'Principle varies inversely with time squared'
          ],
          correctIndex: 0,
          explanation: 'In Cambridge A-Level specifications, this law applies universally under standard conservation principles.',
          marks: 1
        },
        {
          id: 'q2',
          question: `In an examination question regarding ${topic}, what is the standard SI unit required for final quantitative answers?`,
          options: ['Standard SI base or derived unit', 'Arbitrary laboratory unit', 'Dimensionless ratio only', 'Imperial measure'],
          correctIndex: 0,
          explanation: 'Cambridge mark schemes explicitly award marks for standard SI units and correct significant figures.',
          marks: 1
        }
      ]
    });
  }

  try {
    const prompt = `Generate a realistic Cambridge A-Level practice quiz for Nad e Ali (Lahore Grammar School, Gujrat).
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty} (Options: Easy, Standard A-Level, A* Challenge)
Number of Questions: ${numQuestions}
Format: ${format} (e.g. Multiple Choice, Structured, Numerical, Programming)

Return a JSON object adhering to this schema:
{
  "title": "${subject}: ${topic} Quiz",
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Why this answer is correct according to Cambridge A-Level mark schemes",
      "marks": 1
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Quiz Gen Error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz', details: err?.message });
  }
});

// ----------------------------------------------------
// AI Answer Marking Endpoint
// ----------------------------------------------------
app.post('/api/gemini/mark-answer', async (req: Request, res: Response) => {
  const { question, studentAnswer, subject, maxMarks = 4, markScheme = '' } = req.body;

  if (!aiClient) {
    return res.json({
      score: Math.max(1, maxMarks - 1),
      maxMarks,
      percentage: Math.round(((maxMarks - 1) / maxMarks) * 100),
      awardedPoints: [
        'Correctly identified key principle and quoted relevant formula',
        'Correct substitution of numerical values'
      ],
      missingPoints: [
        'Did not state unit explicitly in final statement',
        'Could provide a clearer link between theory and conclusion'
      ],
      examinerComment: 'Good effort demonstrating solid understanding. Make sure to clearly state units and show all working to secure full A* credit.',
      improvementTip: 'Always write down the formula symbol form before substituting numbers.',
      isProvisional: true
    });
  }

  try {
    const prompt = `Mark this Cambridge A-Level student response.
Subject: ${subject}
Question: ${question}
Student's Submitted Answer: ${studentAnswer}
Maximum Marks: ${maxMarks}
Mark Scheme Guidelines (if available): ${markScheme || 'Apply official Cambridge A-Level standards'}

Return a JSON object:
{
  "score": 3,
  "maxMarks": ${maxMarks},
  "percentage": 75,
  "awardedPoints": ["Point 1 that earned mark", "Point 2 that earned mark"],
  "missingPoints": ["Point 1 missing or incorrect that lost mark"],
  "examinerComment": "Professional constructive examiner feedback",
  "improvementTip": "Specific action to turn this into full A* marks",
  "isProvisional": true
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Mark Answer Error:', err);
    return res.status(500).json({ error: 'Failed to mark answer', details: err?.message });
  }
});

// ----------------------------------------------------
// Computer Science Code Tools Endpoint
// ----------------------------------------------------
app.post('/api/gemini/code-tool', async (req: Request, res: Response) => {
  const { tool, code, language = 'Python', inputs = '' } = req.body;

  if (!aiClient) {
    return res.json({
      tool,
      analysis: `Analysis for ${tool} (${language}): Code operates with standard Cambridge 9618 logic.`,
      traceTable: [
        { step: 1, line: 1, variables: { i: 0, sum: 0 }, output: '-' },
        { step: 2, line: 3, variables: { i: 1, sum: 1 }, output: '-' },
        { step: 3, line: 3, variables: { i: 2, sum: 3 }, output: '3' }
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      errorsIdentified: [],
      correctedCode: code,
      testCases: [
        { input: '5', expected: '15', pass: true }
      ]
    });
  }

  try {
    const prompt = `You are the Computer Science Lab Tutor for A-Level CIE 9618.
Tool: ${tool} (e.g. explain, trace_table, debug, test_cases, complexity)
Language: ${language}
Code/Pseudocode:
${code}
Input parameters: ${inputs}

Return JSON with appropriate keys:
{
  "tool": "${tool}",
  "analysis": "Detailed Cambridge A-Level explanation",
  "traceTable": [{"step": 1, "line": 2, "variables": {"x": 10, "found": false}, "output": ""}],
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "errorsIdentified": ["Logical or syntax errors found"],
  "correctedCode": "Corrected code snippet with comments",
  "testCases": [{"input": "...", "expected": "...", "description": "Boundary test"}]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Code Tool Error:', err);
    return res.status(500).json({ error: 'Failed to run code tool', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 2: Generate Quiz from Mistake Notebook
// ----------------------------------------------------
app.post('/api/gemini/generate-mistakes-quiz', async (req: Request, res: Response) => {
  const { mistakes = [], subject } = req.body;

  if (!mistakes || mistakes.length === 0) {
    return res.status(400).json({ error: 'No mistakes provided for quiz generation' });
  }

  if (!aiClient) {
    return res.json({
      title: `${subject || 'Targeted'} Remedial Quiz from Mistake Notebook`,
      subject: subject || mistakes[0]?.subject || 'Physics',
      topic: 'Error Remediation & Active Recovery',
      difficulty: 'A* Exam Mastery',
      questions: mistakes.slice(0, 5).map((m: any, idx: number) => ({
        id: `mq_${idx}`,
        question: `Remedial Question based on past error in ${m.topic}: "${m.question}"`,
        options: [
          `Correct Cambridge working: ${m.correctAnswer}`,
          `Common error: ${m.studentAnswer}`,
          'Alternative incorrect variation with missing units',
          'Incorrect sign / inverted ratio'
        ],
        correctIndex: 0,
        explanation: `Remedy: ${m.explanation}`,
        marks: 1
      }))
    });
  }

  try {
    const prompt = `You are the lead examiner for Nad e Ali A-Level AI Academy.
The student made the following errors in past tests:
${JSON.stringify(mistakes.slice(0, 6))}

Generate a targeted 5-question remedial quiz that directly challenges these exact misconceptions and calculation traps.
Return a JSON object adhering to this schema:
{
  "title": "Mistake Remediation Quiz: ${subject || 'Multi-Subject'}",
  "subject": "${subject || 'Physics'}",
  "topic": "Targeted Mistake Remediation",
  "difficulty": "A* Challenge",
  "questions": [
    {
      "id": "q1",
      "question": "Question testing the corrected concept or calculation...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Why this addresses the previous mistake and secures A* marks",
      "marks": 1
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Mistakes Quiz Error:', err);
    return res.status(500).json({ error: 'Failed to generate remedial quiz', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 2: AI Adaptive Study Schedule Generator
// ----------------------------------------------------
app.post('/api/gemini/generate-study-schedule', async (req: Request, res: Response) => {
  const { preferences = {}, weakTopics = [], upcomingTests = [] } = req.body;

  if (!aiClient) {
    return res.json({
      scheduleSummary: 'Custom 7-day adaptive schedule optimized for Lahore Grammar School timetable.',
      tasks: [
        {
          id: `task_${Date.now()}_1`,
          day: 'Monday',
          time: '16:30 - 17:30',
          subject: 'Physics',
          topic: 'Dynamics & Incline Vectors',
          learningObjective: 'Resolve normal reaction and frictional force down a 30° rough incline',
          duration: 60,
          priority: 'High',
          completed: false,
          activityType: 'Active Problem Set',
          revisionDate: '2026-10-22'
        },
        {
          id: `task_${Date.now()}_2`,
          day: 'Tuesday',
          time: '16:30 - 17:30',
          subject: 'Chemistry',
          topic: 'Titrations & Molar Concentrations',
          learningObjective: 'Calculate concentration of unknown acid from standard alkali titration burette readings',
          duration: 60,
          priority: 'High',
          completed: false,
          activityType: 'Worked Examples & Calculations',
          revisionDate: '2026-10-23'
        }
      ]
    });
  }

  try {
    const prompt = `Generate a personalized, realistic 7-day A-Level study schedule for Nad e Ali (Lahore Grammar School, Gujrat).
Preferences & Routines:
${JSON.stringify(preferences)}
Identified Weak Topics:
${JSON.stringify(weakTopics)}
Upcoming Assessments:
${JSON.stringify(upcomingTests)}

Constraint Rules:
1. Respect Lahore Grammar School hours (08:00 - 14:30).
2. Schedule adequate rest and lunch (14:30 - 16:30).
3. Do NOT exceed 3 hours of focused evening study per day on weekdays.
4. Protect 8 hours of sleep (22:30 - 06:30).
5. Rotate Physics (CIE 9702), Chemistry (CIE 9701), and Computer Science (CIE 9618).
6. Implement active recall and spaced repetition practice.

Return a JSON object:
{
  "scheduleSummary": "Rationale for this week's structure",
  "tasks": [
    {
      "id": "t1",
      "day": "Monday",
      "time": "16:30 - 17:30",
      "subject": "Physics" | "Chemistry" | "Computer Science",
      "topic": "Topic name",
      "learningObjective": "Specific Cambridge syllabus objective",
      "duration": 60,
      "priority": "High" | "Medium",
      "completed": false,
      "activityType": "Worked Examples / Exam Practice / Flashcard Review",
      "revisionDate": "YYYY-MM-DD"
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Study Schedule Error:', err);
    return res.status(500).json({ error: 'Failed to generate study schedule', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 2: Syllabus Parser & Objective Extractor
// ----------------------------------------------------
app.post('/api/gemini/parse-syllabus', async (req: Request, res: Response) => {
  const { rawText, subject = 'Physics' } = req.body;

  if (!rawText) {
    return res.status(400).json({ error: 'Raw text is required' });
  }

  if (!aiClient) {
    return res.json({
      subject,
      syllabusCode: subject === 'Physics' ? '9702' : subject === 'Chemistry' ? '9701' : '9618',
      topicsExtracted: [
        {
          name: 'Extracted Syllabus Unit',
          subtopics: ['Key Subtopic 1', 'Key Subtopic 2'],
          learningObjectives: ['Candidate should be able to recall definitions and state equations'],
          mastery: 'Learning',
          progress: 25
        }
      ]
    });
  }

  try {
    const prompt = `Analyze this raw Cambridge A-Level ${subject} syllabus extract or teacher handout:
"""
${rawText}
"""

Extract structured topics, subtopics, and official learning objectives.
Return JSON:
{
  "subject": "${subject}",
  "syllabusCode": "e.g. 9702 / 9701 / 9618",
  "topicsExtracted": [
    {
      "name": "Topic title",
      "subtopics": ["Subtopic 1", "Subtopic 2"],
      "learningObjectives": ["Objective 1", "Objective 2"],
      "mastery": "Learning",
      "progress": 20
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Parse Syllabus Error:', err);
    return res.status(500).json({ error: 'Failed to parse syllabus', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 3: AI Handwritten Photo Answer Marking
// ----------------------------------------------------
app.post('/api/gemini/mark-photo-answer', async (req: Request, res: Response) => {
  const { imageBase64, question, subject = 'Physics', maxMarks = 4, markScheme = '' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image of handwritten answer is required' });
  }

  if (!aiClient) {
    return res.json({
      transcribedWork: 'Recognized student handwritten solution from photograph.',
      score: Math.max(1, maxMarks - 1),
      maxMarks,
      percentage: Math.round(((maxMarks - 1) / maxMarks) * 100),
      awardedPoints: [
        '[M1] Correct method stated with formula symbols',
        '[A1] Accurate numerical calculation and substitution'
      ],
      missingPoints: [
        'Did not include final SI unit explicitly or round to appropriate significant figures'
      ],
      examinerComment: 'Good handwritten working. Handwriting is legible and method is sound.',
      improvementTip: 'Always underline final answer with explicit units (e.g., m s⁻², mol dm⁻³).',
      isProvisional: true
    });
  }

  try {
    const { mimeType, data } = extractBase64Data(imageBase64);
    const systemPrompt = `You are a Senior Cambridge International A-Level Examiner marking handwritten work for Nad e Ali (Lahore Grammar School, Gujrat).
Subject: ${subject}
Question: ${question || 'Analyze and grade the handwritten solution presented'}
Total Marks Available: ${maxMarks}
Mark Scheme Benchmark: ${markScheme || 'Official Cambridge A-Level [M], [A], [B] mark conventions'}

Instructions:
1. Carefully transcribe the student's handwritten response. If any words or calculations are ambiguous, note it.
2. Evaluate work line-by-line according to Cambridge mark scheme conventions:
   - [M] marks for appropriate method/formula
   - [A] marks for correct numerical answer with unit
   - [B] marks for independent factual statement/definition
3. Award total marks out of ${maxMarks}.
4. Provide constructive examiner commentary and concrete tips to secure full A* credit.
5. Return JSON only.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: data,
          },
        },
        {
          text: `Evaluate this handwritten Cambridge A-Level response.
Respond strictly in JSON format:
{
  "transcribedWork": "Full transcription of student handwriting and calculations",
  "score": 3,
  "maxMarks": ${maxMarks},
  "percentage": 75,
  "awardedPoints": ["[M1] Awarded for...", "[A1] Awarded for..."],
  "missingPoints": ["Point missed or deduction reason"],
  "examinerComment": "Professional examiner evaluation",
  "improvementTip": "Precise instruction to turn this into 100% marks",
  "isProvisional": true
}`
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Photo Marking Error:', err);
    return res.status(500).json({ error: 'Failed to mark handwritten response', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 3: Generate Quiz from Document or Notes
// ----------------------------------------------------
app.post('/api/gemini/generate-notes-quiz', async (req: Request, res: Response) => {
  const { noteContent, subject = 'Physics', numQuestions = 5 } = req.body;

  if (!noteContent) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  if (!aiClient) {
    return res.json({
      title: `${subject} Quiz from Document Notes`,
      subject,
      topic: 'Document Active Recall',
      difficulty: 'Standard A-Level',
      questions: [
        {
          id: 'nq_1',
          question: `Based on your notes: Which statement aligns with the core principles of ${subject}?`,
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
          explanation: 'Directly verified from your uploaded document excerpt.',
          marks: 1
        }
      ]
    });
  }

  try {
    const prompt = `Generate a ${numQuestions}-question Cambridge A-Level multiple choice quiz testing comprehension of this uploaded note or document:
"""
${noteContent.slice(0, 4000)}
"""

Subject: ${subject}
Return JSON:
{
  "title": "${subject}: Document Comprehension Quiz",
  "subject": "${subject}",
  "topic": "Document Notes Practice",
  "difficulty": "Standard A-Level",
  "questions": [
    {
      "id": "q1",
      "question": "Question text based on document...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctIndex": 0,
      "explanation": "Why this answer is verified by the document",
      "marks": 1
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Notes Quiz Error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz from notes', details: err?.message });
  }
});

// ----------------------------------------------------
// Phase 3: Summarize Document & Generate Flashcards
// ----------------------------------------------------
app.post('/api/gemini/summarize-document', async (req: Request, res: Response) => {
  const { documentText, subject = 'Physics' } = req.body;

  if (!documentText) {
    return res.status(400).json({ error: 'Document text is required' });
  }

  if (!aiClient) {
    return res.json({
      summary: 'Executive Cambridge summary of uploaded material.',
      keyPoints: ['Point 1: Core definition', 'Point 2: Key calculation formula'],
      suggestedFlashcards: [
        { front: 'Key concept from document', back: 'Detailed explanation and formula' }
      ]
    });
  }

  try {
    const prompt = `Summarize this Cambridge A-Level ${subject} document for Nad e Ali (Lahore Grammar School, Gujrat).
Extract core principles, formulas, definitions, and generate 3 high-yield flashcards.
Document:
"""
${documentText.slice(0, 5000)}
"""

Return JSON:
{
  "summary": "Concise A* executive summary",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "suggestedFlashcards": [
    {
      "front": "Prompt / Question",
      "back": "Answer with formula and units"
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Document Summary Error:', err);
    return res.status(500).json({ error: 'Failed to summarize document', details: err?.message });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Nad e Ali A-Level AI Academy server running on port ${PORT} [env: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer();

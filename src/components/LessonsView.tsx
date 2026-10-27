import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  LessonStageId,
  StudentProfile,
  ViewId,
  VisualTokenKind,
  WorldId,
} from '../types/game';
import { playSound } from '../utils/sound';
import {
  FactFamilyBondSvg,
  FriendlyDivideCharacterSvg,
  FriendlyMultiplyCharacterSvg,
  KikoExplorerIllustration,
  VisualItemToken,
} from './MascotIllustrations';

interface LessonsViewProps {
  student: StudentProfile;
  initialStage?: LessonStageId;
  soundEnabled: boolean;
  onNavigate: (view: ViewId) => void;
  onMarkStageComplete: (stage: LessonStageId) => void;
  onSubmitPracticeQuiz: (params: {
    scorePct: number;
    correctCount: number;
    totalCount: number;
    answersLog: Array<{
      worldId: WorldId;
      category: string;
      question: string;
      chosenAnswer: number;
      correctAnswer: number;
      explanation: string;
      isCorrect: boolean;
    }>;
  }) => void;
}

export const LESSON_STAGES: Array<{
  id: LessonStageId;
  shortLabel: string;
  stepNum: string;
  title: string;
}> = [
  { id: 'materi-1', stepNum: '01', shortLabel: 'Materi 1: Perkalian', title: '1. Mengenal Perkalian' },
  { id: 'materi-2', stepNum: '02', shortLabel: 'Materi 2: Pembagian', title: '2. Mengenal Pembagian' },
  {
    id: 'materi-3',
    stepNum: '03',
    shortLabel: 'Materi 3: Hubungan',
    title: '3. Hubungan Perkalian & Pembagian',
  },
  {
    id: 'contoh-soal',
    stepNum: '04',
    shortLabel: 'Contoh Soal',
    title: 'Contoh Soal & Cara Penyelesaian',
  },
  { id: 'latihan', stepNum: '05', shortLabel: 'Latihan (8 Soal)', title: '4. Ayo Berlatih!' },
  { id: 'rangkuman', stepNum: '06', shortLabel: 'Rangkuman', title: '5. Rangkuman Pembelajaran' },
];

interface PracticeQuizItem {
  id: number;
  worldId: WorldId;
  category: string;
  prompt: string;
  options: Array<{ letter: 'A' | 'B' | 'C' | 'D'; value: number }>;
  correctValue: number;
  explanation: string;
  visualGroups?: number;
  visualPerGroup?: number;
  visualKind?: VisualTokenKind;
}

const CORE_CURRICULUM_QUIZ: PracticeQuizItem[] = [
  {
    id: 1,
    worldId: 1,
    category: 'Latihan Materi · Perkalian',
    prompt: '3 × 5 = ...',
    options: [
      { letter: 'A', value: 8 },
      { letter: 'B', value: 15 },
      { letter: 'C', value: 18 },
      { letter: 'D', value: 20 },
    ],
    correctValue: 15,
    explanation: '3 × 5 artinya 5 + 5 + 5 = 15.',
  },
  {
    id: 2,
    worldId: 1,
    category: 'Latihan Materi · Perkalian',
    prompt: '4 × 6 = ...',
    options: [
      { letter: 'A', value: 20 },
      { letter: 'B', value: 22 },
      { letter: 'C', value: 24 },
      { letter: 'D', value: 26 },
    ],
    correctValue: 24,
    explanation: '4 × 6 artinya 6 + 6 + 6 + 6 = 24.',
  },
  {
    id: 3,
    worldId: 1,
    category: 'Latihan Materi · Perkalian',
    prompt: '7 × 3 = ...',
    options: [
      { letter: 'A', value: 18 },
      { letter: 'B', value: 21 },
      { letter: 'C', value: 24 },
      { letter: 'D', value: 27 },
    ],
    correctValue: 21,
    explanation: '7 × 3 artinya angka 3 dijumlahkan 7 kali (3 + 3 + 3 + 3 + 3 + 3 + 3 = 21).',
  },
  {
    id: 4,
    worldId: 2,
    category: 'Latihan Materi · Pembagian',
    prompt: '20 ÷ 4 = ...',
    options: [
      { letter: 'A', value: 4 },
      { letter: 'B', value: 5 },
      { letter: 'C', value: 6 },
      { letter: 'D', value: 8 },
    ],
    correctValue: 5,
    explanation: 'Karena 4 × 5 = 20, maka 20 ÷ 4 = 5.',
  },
  {
    id: 5,
    worldId: 2,
    category: 'Latihan Materi · Pembagian',
    prompt: '24 ÷ 6 = ...',
    options: [
      { letter: 'A', value: 3 },
      { letter: 'B', value: 4 },
      { letter: 'C', value: 5 },
      { letter: 'D', value: 6 },
    ],
    correctValue: 4,
    explanation: 'Karena 6 × 4 = 24, maka 24 ÷ 6 = 4.',
  },
  {
    id: 6,
    worldId: 2,
    category: 'Latihan Materi · Pembagian',
    prompt: '35 ÷ 5 = ...',
    options: [
      { letter: 'A', value: 5 },
      { letter: 'B', value: 6 },
      { letter: 'C', value: 7 },
      { letter: 'D', value: 8 },
    ],
    correctValue: 7,
    explanation: 'Karena 5 × 7 = 35, maka 35 ÷ 5 = 7.',
  },
  {
    id: 7,
    worldId: 4,
    category: 'Latihan Materi · Soal Cerita',
    prompt: 'Ada 4 kantong berisi 5 kelereng. Berapa jumlah seluruh kelereng?',
    options: [
      { letter: 'A', value: 9 },
      { letter: 'B', value: 15 },
      { letter: 'C', value: 20 },
      { letter: 'D', value: 25 },
    ],
    correctValue: 20,
    explanation: '4 kantong × 5 kelereng = 5 + 5 + 5 + 5 = 20 kelereng.',
    visualGroups: 4,
    visualPerGroup: 5,
    visualKind: 'marble',
  },
  {
    id: 8,
    worldId: 4,
    category: 'Latihan Materi · Soal Cerita',
    prompt: 'Ada 24 kue dibagikan kepada 6 anak sama rata. Berapa kue setiap anak?',
    options: [
      { letter: 'A', value: 3 },
      { letter: 'B', value: 4 },
      { letter: 'C', value: 5 },
      { letter: 'D', value: 6 },
    ],
    correctValue: 4,
    explanation: '24 kue ÷ 6 anak = 4 kue untuk setiap anak.',
    visualGroups: 6,
    visualPerGroup: 4,
    visualKind: 'cookie',
  },
];

function buildRandomizedPracticeSet(): PracticeQuizItem[] {
  const letters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const makeOptions = (ans: number, step = 2) => {
    const set = new Set<number>([ans]);
    const offsets = [-step * 2, -step, -1, 1, step, step * 2, 3, -3];
    for (const off of offsets.sort(() => Math.random() - 0.5)) {
      if (set.size >= 4) break;
      if (ans + off > 0 && ans + off !== ans) set.add(ans + off);
    }
    while (set.size < 4) set.add(ans + set.size + 1);
    return Array.from(set)
      .sort((a, b) => a - b)
      .map((val, idx) => ({ letter: letters[idx], value: val }));
  };

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const q1a = rand(3, 6), q1b = rand(4, 7);
  const q2a = rand(4, 8), q2b = rand(3, 6);
  const q3a = rand(5, 9), q3b = rand(3, 5);
  const q4d = rand(3, 6), q4q = rand(4, 7);
  const q5d = rand(4, 7), q5q = rand(3, 6);
  const q6d = rand(5, 8), q6q = rand(4, 7);
  const q7g = rand(3, 5), q7p = rand(4, 6);
  const q8g = rand(3, 6), q8p = rand(3, 5);

  return [
    {
      id: 1,
      worldId: 1,
      category: 'Latihan Acak · Perkalian',
      prompt: `${q1a} × ${q1b} = ...`,
      options: makeOptions(q1a * q1b, q1b),
      correctValue: q1a * q1b,
      explanation: `${q1a} × ${q1b} = ${new Array(q1a).fill(q1b).join(' + ')} = ${q1a * q1b}.`,
    },
    {
      id: 2,
      worldId: 1,
      category: 'Latihan Acak · Perkalian',
      prompt: `${q2a} × ${q2b} = ...`,
      options: makeOptions(q2a * q2b, q2b),
      correctValue: q2a * q2b,
      explanation: `${q2a} × ${q2b} = ${q2a * q2b}.`,
    },
    {
      id: 3,
      worldId: 1,
      category: 'Latihan Acak · Perkalian',
      prompt: `${q3a} × ${q3b} = ...`,
      options: makeOptions(q3a * q3b, q3b),
      correctValue: q3a * q3b,
      explanation: `${q3a} × ${q3b} = ${q3a * q3b}.`,
    },
    {
      id: 4,
      worldId: 2,
      category: 'Latihan Acak · Pembagian',
      prompt: `${q4d * q4q} ÷ ${q4d} = ...`,
      options: makeOptions(q4q, 1),
      correctValue: q4q,
      explanation: `Karena ${q4d} × ${q4q} = ${q4d * q4q}, maka ${q4d * q4q} ÷ ${q4d} = ${q4q}.`,
    },
    {
      id: 5,
      worldId: 2,
      category: 'Latihan Acak · Pembagian',
      prompt: `${q5d * q5q} ÷ ${q5d} = ...`,
      options: makeOptions(q5q, 1),
      correctValue: q5q,
      explanation: `Karena ${q5d} × ${q5q} = ${q5d * q5q}, maka ${q5d * q5q} ÷ ${q5d} = ${q5q}.`,
    },
    {
      id: 6,
      worldId: 2,
      category: 'Latihan Acak · Pembagian',
      prompt: `${q6d * q6q} ÷ ${q6d} = ...`,
      options: makeOptions(q6q, 1),
      correctValue: q6q,
      explanation: `Karena ${q6d} × ${q6q} = ${q6d * q6q}, maka ${q6d * q6q} ÷ ${q6d} = ${q6q}.`,
    },
    {
      id: 7,
      worldId: 4,
      category: 'Latihan Acak · Soal Cerita',
      prompt: `Ada ${q7g} kotak berisi ${q7p} pensil. Berapa jumlah seluruh pensil?`,
      options: makeOptions(q7g * q7p, q7p),
      correctValue: q7g * q7p,
      explanation: `${q7g} kotak × ${q7p} pensil = ${q7g * q7p} pensil.`,
      visualGroups: q7g,
      visualPerGroup: q7p,
      visualKind: 'pencil',
    },
    {
      id: 8,
      worldId: 4,
      category: 'Latihan Acak · Soal Cerita',
      prompt: `Ada ${q8g * q8p} buah jeruk dibagikan kepada ${q8g} anak sama rata. Berapa jeruk setiap anak?`,
      options: makeOptions(q8p, 1),
      correctValue: q8p,
      explanation: `${q8g * q8p} jeruk ÷ ${q8g} anak = ${q8p} jeruk untuk setiap anak.`,
      visualGroups: q8g,
      visualPerGroup: q8p,
      visualKind: 'orange',
    },
  ];
}

const MULT_REFERENCE_TABLE = [
  { groups: 2, perGroup: 3, expr: '2 × 3', addition: '3 + 3', result: 6 },
  { groups: 3, perGroup: 4, expr: '3 × 4', addition: '4 + 4 + 4', result: 12 },
  { groups: 4, perGroup: 5, expr: '4 × 5', addition: '5 + 5 + 5 + 5', result: 20 },
  { groups: 5, perGroup: 2, expr: '5 × 2', addition: '2 + 2 + 2 + 2 + 2', result: 10 },
];

const DIV_REFERENCE_TABLE = [
  { total: 10, groups: 2, expr: '10 ÷ 2', result: 5 },
  { total: 12, groups: 3, expr: '12 ÷ 3', result: 4 },
  { total: 15, groups: 3, expr: '15 ÷ 3', result: 5 },
  { total: 20, groups: 4, expr: '20 ÷ 4', result: 5 },
  { total: 24, groups: 6, expr: '24 ÷ 6', result: 4 },
  { total: 30, groups: 5, expr: '30 ÷ 5', result: 6 },
];

interface WorkedExampleDef {
  id: string;
  badgeLabel: string;
  title: string;
  story: string;
  formula: string;
  conclusion: string;
  groups: number;
  perGroup: number;
  kind: VisualTokenKind;
  groupPrefix: string;
}

const WORKED_EXAMPLES: WorkedExampleDef[] = [
  {
    id: 'ex-mult-1',
    badgeLabel: 'Contoh Perkalian · Soal 1',
    title: 'Menghitung Kotak Pensil',
    story: 'Ada 5 kotak. Setiap kotak berisi 3 pensil. Berapa jumlah seluruh pensil?',
    formula: '5 × 3 = 3 + 3 + 3 + 3 + 3 = 15',
    conclusion: 'Jawaban: 15 pensil.',
    groups: 5,
    perGroup: 3,
    kind: 'pencil',
    groupPrefix: 'Kotak',
  },
  {
    id: 'ex-mult-2',
    badgeLabel: 'Contoh Perkalian · Soal 2',
    title: 'Barisan Tanaman di Halaman Sekolah',
    story:
      'Di halaman sekolah terdapat 4 baris tanaman. Setiap baris memiliki 6 tanaman. Berapa jumlah seluruh tanaman?',
    formula: '4 × 6 = 6 + 6 + 6 + 6 = 24',
    conclusion: 'Jawaban: 24 tanaman.',
    groups: 4,
    perGroup: 6,
    kind: 'flower',
    groupPrefix: 'Baris',
  },
  {
    id: 'ex-div-1',
    badgeLabel: 'Contoh Pembagian · Soal 1',
    title: 'Membagikan Buah Jeruk Ibu',
    story:
      'Ibu mempunyai 18 jeruk. Jeruk tersebut dibagikan kepada 3 anak sama rata. Berapa jeruk yang diterima setiap anak?',
    formula: '18 ÷ 3 = 6',
    conclusion: 'Jawaban: 6 jeruk untuk setiap anak.',
    groups: 3,
    perGroup: 6,
    kind: 'orange',
    groupPrefix: 'Anak',
  },
  {
    id: 'ex-div-2',
    badgeLabel: 'Contoh Pembagian · Soal 2',
    title: 'Membagikan Buku Kelompok Belajar',
    story:
      'Pak Guru mempunyai 28 buku. Buku tersebut akan dibagikan kepada 4 kelompok dengan jumlah yang sama. Berapa buku yang diterima setiap kelompok?',
    formula: '28 ÷ 4 = 7',
    conclusion: 'Jawaban: 7 buku untuk setiap kelompok.',
    groups: 4,
    perGroup: 7,
    kind: 'book',
    groupPrefix: 'Kelompok',
  },
];

export const LessonsView: React.FC<LessonsViewProps> = ({
  student,
  initialStage = 'materi-1',
  soundEnabled,
  onNavigate,
  onMarkStageComplete,
  onSubmitPracticeQuiz,
}) => {
  const [stage, setStage] = useState<LessonStageId>(initialStage);

  // Sync if parent passes a new initialStage
  useEffect(() => {
    setStage(initialStage);
  }, [initialStage]);

  // Materi 1 interactive state (Default: Rina's 3 plates × 4 apples = 12)
  const [plateCount, setPlateCount] = useState<number>(3);
  const [applesPerPlate, setApplesPerPlate] = useState<number>(4);

  // Materi 2 interactive state (Default: Doni's 12 candies ÷ 3 friends = 4)
  const [friendCount, setFriendCount] = useState<number>(3);
  const [candiesPerFriend, setCandiesPerFriend] = useState<number>(4);

  // Materi 3 interactive state (Default: 3 × 4 = 12)
  const [bondA, setBondA] = useState<number>(3);
  const [bondB, setBondB] = useState<number>(4);

  // Worked Examples reveal state
  const [revealedExamples, setRevealedExamples] = useState<Record<string, boolean>>({
    'ex-mult-1': true,
    'ex-mult-2': false,
    'ex-div-1': true,
    'ex-div-2': false,
  });

  // Stage 5: 8-Question Practice Quiz state
  const [quizQuestions, setQuizQuestions] = useState<PracticeQuizItem[]>(CORE_CURRICULUM_QUIZ);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizIncompleteNotice, setQuizIncompleteNotice] = useState<boolean>(false);

  const goToStage = (nextStage: LessonStageId, markCurrent = true) => {
    if (markCurrent) {
      onMarkStageComplete(stage);
    }
    setStage(nextStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations for Materi 1 & Materi 2
  const totalApples = plateCount * applesPerPlate;
  const multAdditionText = new Array(plateCount).fill(applesPerPlate).join(' + ');
  const isRinaDefault = plateCount === 3 && applesPerPlate === 4;

  const totalCandies = friendCount * candiesPerFriend;
  const isDoniDefault = friendCount === 3 && candiesPerFriend === 4;

  // Calculations for Quiz
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctQuizCount = quizQuestions.reduce(
    (sum, q) => sum + (selectedAnswers[q.id] === q.correctValue ? 1 : 0),
    0
  );
  const quizScorePct = Math.round((correctQuizCount / quizQuestions.length) * 100);

  const handleCheckQuizAnswers = () => {
    if (answeredCount < quizQuestions.length) {
      setQuizIncompleteNotice(true);
      playSound('wrong', soundEnabled);
      return;
    }

    setQuizIncompleteNotice(false);
    setQuizSubmitted(true);
    onMarkStageComplete('latihan');

    if (correctQuizCount >= 6) {
      playSound('victory', soundEnabled);
    } else {
      playSound('correct', soundEnabled);
    }

    onSubmitPracticeQuiz({
      scorePct: quizScorePct,
      correctCount: correctQuizCount,
      totalCount: quizQuestions.length,
      answersLog: quizQuestions.map((q) => ({
        worldId: q.worldId,
        category: q.category,
        question: q.prompt,
        chosenAnswer: selectedAnswers[q.id],
        correctAnswer: q.correctValue,
        explanation: q.explanation,
        isCorrect: selectedAnswers[q.id] === q.correctValue,
      })),
    });
  };

  const handleResetQuiz = (useRandomSet: boolean) => {
    setQuizQuestions(useRandomSet ? buildRandomizedPracticeSet() : CORE_CURRICULUM_QUIZ);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizIncompleteNotice(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stageIdx = LESSON_STAGES.findIndex((s) => s.id === stage);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Greeting Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-slate-500 tabular-nums">
            <span>Materi Pembelajaran Matematika</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <strong className="text-blue-700 font-semibold">Kelas 3 SD · Fase B</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-9 space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
              Yuk, Belajar Perkalian dan Pembagian!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Hai, <strong>{student.name}</strong>! Kalian pasti pernah menghitung jumlah benda atau
              membagikan sesuatu kepada teman, bukan? Ternyata kegiatan tersebut berhubungan dengan
              matematika. Yuk, pelajari tahap demi tahap dari Materi 1 sampai Rangkuman!
            </p>
          </div>
          <div className="lg:col-span-3 hidden lg:flex justify-end">
            <KikoExplorerIllustration className="w-28 h-28" />
          </div>
        </div>

        {/* 6-Stage Progressive Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
            role="tablist"
            aria-label="Tahapan Materi Pembelajaran"
          >
            {LESSON_STAGES.map((item, idx) => {
              const isActive = item.id === stage;
              const isDone = student.completedLessonStages.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goToStage(item.id, false)}
                  className={`text-left px-3.5 py-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:border-emerald-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <span
                      className={`block text-[10px] font-mono font-bold ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      Tahap {idx + 1}/6
                    </span>
                    <span className="block text-xs font-semibold truncate">{item.shortLabel}</span>
                  </div>
                  {isDone && !isActive && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          STAGE 1: 1. MENGENAL PERKALIAN
      ========================================================= */}
      {stage === 'materi-1' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Visual Story & Interactive Plate Simulator */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold text-emerald-700 mb-1">
                  Materi 1 · Konsep Dasar
                </p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  1. Mengenal Perkalian
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                  <strong>Apa itu perkalian?</strong> Perkalian adalah cara cepat untuk{' '}
                  <strong className="text-slate-900">
                    menjumlahkan bilangan yang sama secara berulang
                  </strong>
                  .
                </p>
              </div>

              {/* Story Context Box */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-emerald-800">
                    {isRinaDefault
                      ? 'Contoh Cerita: Apel Milik Rina'
                      : 'Simulasi Piring Apel Interaktif'}
                  </p>
                  {!isRinaDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setPlateCount(3);
                        setApplesPerPlate(4);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Kembali ke Contoh Rina (3 × 4)
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-800 leading-relaxed">
                  {isRinaDefault ? (
                    <>
                      Rina mempunyai <strong>3 piring</strong>. Setiap piring berisi{' '}
                      <strong>4 buah apel</strong>. Berapa jumlah seluruh apel Rina? Mari kita
                      hitung bersama!
                    </>
                  ) : (
                    <>
                      Sekarang terdapat <strong className="tabular-nums">{plateCount} piring</strong>
                      , dan setiap piring berisi{' '}
                      <strong className="tabular-nums">{applesPerPlate} buah apel</strong>. Mari
                      hitung seluruhnya!
                    </>
                  )}
                </p>

                {/* Plates Illustration */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {Array.from({ length: plateCount }).map((_, pIdx) => (
                    <React.Fragment key={pIdx}>
                      <div className="bg-white border-2 border-emerald-200 rounded-2xl px-4 py-3 text-center min-w-[108px] shadow-2xs">
                        <div className="flex flex-wrap justify-center gap-1.5 mb-2 max-w-[96px] mx-auto">
                          {Array.from({ length: applesPerPlate }).map((__, aIdx) => (
                            <VisualItemToken key={aIdx} kind="apple" className="w-6 h-6" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 block tabular-nums">
                          Piring {pIdx + 1} = {applesPerPlate} apel
                        </span>
                      </div>
                      {pIdx < plateCount - 1 && (
                        <span className="font-mono text-lg font-bold text-emerald-700">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Equations & Conclusion */}
                <div className="bg-white border border-emerald-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Jika dijumlahkan:</span>
                    <p className="font-mono text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                      {multAdditionText} = {totalApples}
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-slate-200">
                    <span className="text-xs text-slate-500 block mb-1">
                      Jika menggunakan perkalian:
                    </span>
                    <p className="font-mono text-base sm:text-lg font-bold text-blue-700 tabular-nums">
                      {plateCount} × {applesPerPlate} = {totalApples}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-emerald-950 text-center">
                  Kesimpulan: Jadi, jumlah seluruh apel adalah{' '}
                  <span className="underline decoration-emerald-500 decoration-2 tabular-nums">
                    {totalApples} buah
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Right: Reference Table & Interactive Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Cara Mudah Memahami Perkalian
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik salah satu baris tabel untuk melihat ilustrasi piring apelnya!
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-sm text-left border-collapse tabular-nums">
                    <thead>
                      <tr className="bg-sky-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                        <th className="py-3 px-4">Perkalian</th>
                        <th className="py-3 px-4">Penjumlahan</th>
                        <th className="py-3 px-4 text-right">Hasil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {MULT_REFERENCE_TABLE.map((row) => {
                        const activeRow =
                          plateCount === row.groups && applesPerPlate === row.perGroup;
                        return (
                          <tr
                            key={row.expr}
                            onClick={() => {
                              setPlateCount(row.groups);
                              setApplesPerPlate(row.perGroup);
                              playSound('step', soundEnabled);
                            }}
                            className={`cursor-pointer transition-colors ${
                              activeRow ? 'bg-amber-50 font-semibold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-blue-700">
                              {row.expr}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700">{row.addition}</td>
                            <td className="py-3 px-4 font-mono font-bold text-right text-slate-900">
                              {row.result}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Custom Number Adjuster */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">
                    Coba Ubah Sendiri Jumlah Piring &amp; Apel:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block mb-1.5">
                        Banyak Piring: <strong className="text-slate-900">{plateCount}</strong>
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setPlateCount((c) => Math.max(1, c - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Kurangi piring"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-sm tabular-nums">
                          {plateCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlateCount((c) => Math.min(6, c + 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Tambah piring"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block mb-1.5">
                        Apel / Piring: <strong className="text-slate-900">{applesPerPlate}</strong>
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setApplesPerPlate((c) => Math.max(1, c - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Kurangi apel"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-sm tabular-nums">
                          {applesPerPlate}
                        </span>
                        <button
                          type="button"
                          onClick={() => setApplesPerPlate((c) => Math.min(6, c + 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Tambah apel"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage Footer Navigation */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => goToStage('materi-2')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Selanjutnya: 2. Mengenal Pembagian</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 2: 2. MENGENAL PEMBAGIAN
      ========================================================= */}
      {stage === 'materi-2' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Doni's Candies Story & Interactive Sharing Stage */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">Materi 2 · Membagi Adil</p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  2. Mengenal Pembagian
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                  <strong>Apa itu pembagian?</strong> Pembagian adalah kegiatan{' '}
                  <strong className="text-slate-900">
                    membagi sejumlah benda menjadi beberapa kelompok dengan jumlah yang sama banyak
                  </strong>
                  .
                </p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-sky-900">
                    {isDoniDefault
                      ? 'Contoh Cerita: Permen Milik Doni'
                      : 'Simulasi Pembagian Permen Adil'}
                  </p>
                  {!isDoniDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setFriendCount(3);
                        setCandiesPerFriend(4);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Kembali ke Contoh Doni (12 ÷ 3)
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-800 leading-relaxed">
                  {isDoniDefault ? (
                    <>
                      Doni mempunyai <strong>12 permen</strong>. Ia ingin membagikan permen tersebut
                      kepada <strong>3 orang temannya</strong> secara adil. Berapa permen yang
                      diterima setiap teman? Mari kita hitung!
                    </>
                  ) : (
                    <>
                      Ada <strong className="tabular-nums">{totalCandies} permen</strong> yang
                      dibagikan secara adil kepada{' '}
                      <strong className="tabular-nums">{friendCount} orang teman</strong>:
                    </>
                  )}
                </p>

                {/* Friends Candy Groups */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {Array.from({ length: friendCount }).map((_, fIdx) => (
                    <div
                      key={fIdx}
                      className="bg-white border-2 border-sky-200 rounded-2xl px-4 py-3 text-center min-w-[118px] shadow-2xs"
                    >
                      <div className="flex flex-wrap justify-center gap-1.5 mb-2 max-w-[100px] mx-auto">
                        {Array.from({ length: candiesPerFriend }).map((__, cIdx) => (
                          <VisualItemToken key={cIdx} kind="candy" className="w-6 h-6" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 block tabular-nums">
                        Teman {fIdx + 1} dapat {candiesPerFriend}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-sky-200 rounded-xl p-4 text-center space-y-1">
                  <span className="text-xs text-slate-500 block">Maka kalimat matematikanya:</span>
                  <p className="font-mono text-xl font-bold text-blue-700 tabular-nums">
                    {totalCandies} ÷ {friendCount} = {candiesPerFriend}
                  </p>
                </div>

                <p className="text-sm font-semibold text-sky-950 text-center">
                  Kesimpulan: Setiap teman mendapatkan{' '}
                  <span className="underline decoration-blue-500 decoration-2 tabular-nums">
                    {candiesPerFriend} permen
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Right: Division Reference Table & Adjusters */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Cara Mudah Memahami Pembagian
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik baris pembagian di bawah untuk melihat pembagian permennya!
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-sm text-left border-collapse tabular-nums">
                    <thead>
                      <tr className="bg-amber-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                        <th className="py-3 px-5">Pembagian</th>
                        <th className="py-3 px-5 text-right">Hasil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {DIV_REFERENCE_TABLE.map((row) => {
                        const activeRow =
                          friendCount === row.groups && candiesPerFriend === row.result;
                        return (
                          <tr
                            key={row.expr}
                            onClick={() => {
                              setFriendCount(row.groups);
                              setCandiesPerFriend(row.result);
                              playSound('step', soundEnabled);
                            }}
                            className={`cursor-pointer transition-colors ${
                              activeRow ? 'bg-sky-50 font-semibold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2.5 px-5 font-mono font-bold text-blue-700">
                              {row.expr}
                            </td>
                            <td className="py-2.5 px-5 font-mono font-bold text-right text-slate-900">
                              {row.result}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Custom Sharing Adjuster */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">
                    Coba Atur Jumlah Teman &amp; Bagian Permen:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block mb-1.5">
                        Jumlah Teman: <strong className="text-slate-900">{friendCount}</strong>
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setFriendCount((c) => Math.max(2, c - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Kurangi jumlah teman"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-sm tabular-nums">
                          {friendCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFriendCount((c) => Math.min(6, c + 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Tambah jumlah teman"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <span className="text-xs text-slate-500 block mb-1.5">
                        Total Permen: <strong className="text-slate-900">{totalCandies}</strong>
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setCandiesPerFriend((c) => Math.max(2, c - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Kurangi permen"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-sm tabular-nums">
                          {totalCandies}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCandiesPerFriend((c) => Math.min(6, c + 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Tambah permen"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToStage('materi-1', false)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya: Materi 1</span>
            </button>

            <button
              type="button"
              onClick={() => goToStage('materi-3')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Selanjutnya: 3. Hubungan × dan ÷</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 3: 3. HUBUNGAN PERKALIAN DAN PEMBAGIAN
      ========================================================= */}
      {stage === 'materi-3' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-amber-700">
                  Materi 3 · Keluarga Fakta Bilangan (Fact Family)
                </p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  3. Hubungan Perkalian dan Pembagian
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Tahukah kalian? Perkalian dan pembagian ternyata{' '}
                  <strong className="text-slate-900">saling berhubungan</strong>! Jika kita
                  mengetahui satu hasil perkalian, kita langsung mengetahui dua pembagian sekaligus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center tabular-nums">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <span className="text-xs font-medium text-amber-900 block mb-1">
                    Jika kita tahu:
                  </span>
                  <p className="font-mono text-xl font-bold text-amber-950">
                    {bondA} × {bondB} = {bondA * bondB}
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                  <span className="text-xs font-medium text-sky-900 block mb-1">
                    Maka kita tahu:
                  </span>
                  <p className="font-mono text-xl font-bold text-blue-700">
                    {bondA * bondB} ÷ {bondA} = {bondB}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <span className="text-xs font-medium text-emerald-900 block mb-1">
                    Dan juga tahu:
                  </span>
                  <p className="font-mono text-xl font-bold text-emerald-800">
                    {bondA * bondB} ÷ {bondB} = {bondA}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                <strong className="text-slate-900">Ingat:</strong> Perkalian dapat membantu kita
                menghitung pembagian dengan jauh lebih mudah dan cepat!
              </div>
            </div>

            {/* Right: Interactive Number Bond Diagram */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Diagram Ikatan Bilangan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih pasangan angka untuk melihat hubungan ketiganya:
                </p>
              </div>

              <div className="flex justify-center py-2">
                <FactFamilyBondSvg a={bondA} b={bondB} />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 text-center">
                  Pilih Contoh Pasangan Bilangan:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    [3, 4],
                    [4, 5],
                    [4, 6],
                    [5, 7],
                  ].map(([a, b]) => {
                    const selected = bondA === a && bondB === b;
                    return (
                      <button
                        key={`${a}-${b}`}
                        type="button"
                        onClick={() => {
                          setBondA(a);
                          setBondB(b);
                          playSound('step', soundEnabled);
                        }}
                        className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-colors tabular-nums ${
                          selected
                            ? 'bg-blue-600 border-blue-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {a} &amp; {b} → {a * b}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToStage('materi-2', false)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya: Materi 2</span>
            </button>

            <button
              type="button"
              onClick={() => goToStage('contoh-soal')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Selanjutnya: Contoh Soal Cerita</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 4: CONTOH SOAL & CARA PENYELESAIAN
      ========================================================= */}
      {stage === 'contoh-soal' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Penerapan dalam Kehidupan Sehari-hari
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Contoh Soal Perkalian &amp; Pembagian
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Coba tebak jawabannya terlebih dahulu, lalu klik tombol untuk melihat langkah
                penyelesaiannya!
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setRevealedExamples({
                  'ex-mult-1': true,
                  'ex-mult-2': true,
                  'ex-div-1': true,
                  'ex-div-2': true,
                })
              }
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap"
            >
              Buka Semua Penyelesaian
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORKED_EXAMPLES.map((ex) => {
              const isShown = Boolean(revealedExamples[ex.id]);
              return (
                <article
                  key={ex.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-blue-700">{ex.badgeLabel}</div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{ex.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{ex.story}</p>

                    {/* Visual Everyday Items */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                      <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: ex.groups }).map((_, gIdx) => (
                          <div
                            key={gIdx}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-center"
                          >
                            <div className="flex flex-wrap justify-center gap-1 max-w-[84px] mx-auto mb-1">
                              {Array.from({ length: ex.perGroup }).map((__, iIdx) => (
                                <VisualItemToken key={iIdx} kind={ex.kind} className="w-4 h-4" />
                              ))}
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 block tabular-nums">
                              {ex.groupPrefix} {gIdx + 1} ({ex.perGroup})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRevealedExamples((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }));
                        playSound('step', soundEnabled);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {isShown ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Sembunyikan Penyelesaian</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>Lihat Cara Penyelesaian</span>
                        </>
                      )}
                    </button>

                    {isShown && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                        <span className="text-xs font-semibold text-emerald-800 block">
                          Penyelesaian:
                        </span>
                        <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
                          {ex.formula}
                        </p>
                        <p className="text-sm font-bold text-emerald-900">{ex.conclusion}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToStage('materi-3', false)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya: Materi 3</span>
            </button>

            <button
              type="button"
              onClick={() => goToStage('latihan')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Selanjutnya: 4. Ayo Berlatih! (8 Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 5: 4. AYO BERLATIH! (8 INTERACTIVE QUESTIONS)
      ========================================================= */}
      {stage === 'latihan' && (
        <div className="space-y-6">
          {/* Quiz Header & Live Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Kuis Evaluasi Mandiri · 8 Pertanyaan
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                4. Ayo Berlatih!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Sekarang, teman-teman sudah mengenal perkalian dan pembagian. Yuk, kerjakan 8 soal
                berikut!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right tabular-nums">
                <p className="text-sm font-bold text-slate-900">
                  {answeredCount}/{quizQuestions.length} soal dijawab
                </p>
                {student.practiceQuizBestScore !== null && (
                  <p className="text-xs text-emerald-700 font-semibold">
                    Nilai Terbaikmu: {student.practiceQuizBestScore}/100
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleResetQuiz(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Soal Acak Baru</span>
              </button>
            </div>
          </div>

          {/* Score Result Banner (when submitted) */}
          {quizSubmitted && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-800">
                  Hasil Kuis Tercatat ke Riwayat {student.name}
                </p>
                <h3 className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                  Nilai Kamu: {quizScorePct} / 100 ({correctQuizCount} dari {quizQuestions.length}{' '}
                  Benar)
                </h3>
                <p className="text-sm text-emerald-900">
                  Kamu mendapatkan tambahan <strong>+{correctQuizCount} Bintang</strong>! Periksa
                  pembahasan tiap nomor di bawah ini.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleResetQuiz(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
                >
                  Ulangi 8 Soal Utama
                </button>
                <button
                  type="button"
                  onClick={() => handleResetQuiz(true)}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
                >
                  Coba 8 Soal Acak Baru
                </button>
              </div>
            </div>
          )}

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizQuestions.map((q, idx) => {
              const userVal = selectedAnswers[q.id];
              const isRight = userVal === q.correctValue;

              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-800">Pertanyaan {idx + 1}</span>
                      <span>{q.category}</span>
                    </div>

                    <p className="font-display text-base sm:text-lg font-bold text-slate-900">
                      {idx + 1}. {q.prompt}
                    </p>

                    {q.visualGroups && q.visualPerGroup && q.visualKind && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap justify-center gap-2">
                        {Array.from({ length: q.visualGroups }).map((_, gIdx) => (
                          <div
                            key={gIdx}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 flex flex-wrap gap-1 max-w-[76px] justify-center"
                          >
                            {Array.from({ length: q.visualPerGroup! }).map((__, iIdx) => (
                              <VisualItemToken
                                key={iIdx}
                                kind={q.visualKind!}
                                className="w-4 h-4"
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {q.options.map((opt) => {
                        const isPicked = userVal === opt.value;
                        const isCorrectOpt = opt.value === q.correctValue;

                        let styleClass =
                          'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-400';
                        if (!quizSubmitted && isPicked) {
                          styleClass = 'bg-blue-600 border-blue-700 text-white';
                        } else if (quizSubmitted) {
                          if (isCorrectOpt) {
                            styleClass = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                          } else if (isPicked && !isCorrectOpt) {
                            styleClass = 'bg-red-50 border-red-400 text-red-900';
                          } else {
                            styleClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                          }
                        }

                        return (
                          <button
                            key={opt.letter}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => {
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.value }));
                              if (quizIncompleteNotice) setQuizIncompleteNotice(false);
                              playSound('step', soundEnabled);
                            }}
                            className={`py-2.5 px-3.5 rounded-xl border-2 font-semibold text-sm flex items-center justify-between transition-colors tabular-nums ${styleClass}`}
                          >
                            <span>
                              {opt.letter}. <strong className="font-mono">{opt.value}</strong>
                            </span>
                            {quizSubmitted && isCorrectOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && isPicked && !isCorrectOpt && (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div
                        className={`text-xs rounded-xl px-3.5 py-2.5 border ${
                          isRight
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-red-50/70 border-red-200 text-red-900'
                        }`}
                      >
                        <strong>{isRight ? '✓ Benar: ' : '✕ Pembahasan: '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {quizIncompleteNotice && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm font-medium text-amber-950">
              Masih ada soal yang belum dipilih jawabannya ({answeredCount}/8 soal dijawab). Yuk,
              lengkapi semua 8 nomor terlebih dahulu!
            </div>
          )}

          {/* Check Answers Action Bar */}
          {!quizSubmitted && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                Status Pengerjaan: {answeredCount}/{quizQuestions.length} soal dijawab
              </span>
              <button
                type="button"
                onClick={handleCheckQuizAnswers}
                className="px-7 py-3.5 text-sm font-bold text-white bg-emerald-600 border-b-4 border-emerald-800 hover:bg-emerald-700 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
              >
                Periksa Jawaban
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToStage('contoh-soal', false)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya: Contoh Soal</span>
            </button>

            <button
              type="button"
              onClick={() => goToStage('rangkuman')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
            >
              <span>Selanjutnya: 5. Rangkuman Pembelajaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 6: 5. RANGKUMAN PEMBELAJARAN
      ========================================================= */}
      {stage === 'rangkuman' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-700">Intisari Kelas 3 SD · Fase B</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              5. Rangkuman Pembelajaran
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Sebelum mengakhiri pembelajaran atau lanjut bermain papan petualangan, yuk kita ingat
              kembali tiga poin utama yang sudah dipelajari!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Summary 1: Perkalian */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center">
                <FriendlyMultiplyCharacterSvg className="w-20 h-20" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Perkalian (×)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
                  Penjumlahan berulang dengan bilangan yang sama. Contoh:{' '}
                  <strong className="font-mono text-slate-900">3 × 4 = 4 + 4 + 4 = 12</strong>.
                </p>
              </div>
            </div>

            {/* Summary 2: Pembagian */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center">
                <FriendlyDivideCharacterSvg className="w-20 h-20" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Pembagian (÷)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
                  Membagi benda menjadi beberapa kelompok dengan jumlah yang sama banyak. Contoh:{' '}
                  <strong className="font-mono text-slate-900">12 ÷ 3 = 4</strong>.
                </p>
              </div>
            </div>

            {/* Summary 3: Hubungan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center">
                <FactFamilyBondSvg a={3} b={4} className="w-32 h-20" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Hubungan Keduanya</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
                  Perkalian dan pembagian merupakan operasi hitung yang saling berkaitan dan saling
                  membantu.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Encouragement Card */}
          <div className="bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 border border-slate-200 rounded-3xl p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Apresiasi Belajar</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Hebat! Kamu Sudah Belajar, {student.name}!
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Jangan takut mencoba dan jangan menyerah ketika menemukan soal yang sulit. Terus
                berlatih agar semakin pintar berhitung!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onMarkStageComplete('rangkuman');
                  onNavigate('worlds');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
              >
                <span>Main Papan Petualangan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onMarkStageComplete('rangkuman');
                  onNavigate('progress');
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-700 active:translate-y-0.5 rounded-xl transition-all whitespace-nowrap"
              >
                <span>Lihat Nilai &amp; Riwayat</span>
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => goToStage('latihan', false)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya: Latihan Soal</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage Footnote Indicator */}
      <div className="text-center text-xs text-slate-400 tabular-nums">
        Tahap Pembelajaran {stageIdx + 1} dari {LESSON_STAGES.length}
      </div>
    </div>
  );
};

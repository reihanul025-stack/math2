import {
  AvatarColorId,
  BadgeDef,
  BadgeId,
  MathQuestion,
  RosterStore,
  StudentProfile,
  TileType,
  VisualTokenKind,
  WorldId,
  WorldMeta,
} from '../types/game';

export const ROSTER_STORAGE_KEY = 'MATH_ADVENTURE_ROSTER_V3';
const LEGACY_STORAGE_KEY = 'MATH_ADVENTURE_V2';

export const AVATAR_COLORS: Array<{
  id: AvatarColorId;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = [
  {
    id: 'blue',
    label: 'Biru Samudra',
    bgClass: 'bg-blue-600',
    textClass: 'text-white',
    borderClass: 'border-blue-600',
  },
  {
    id: 'emerald',
    label: 'Hijau Rimba',
    bgClass: 'bg-emerald-600',
    textClass: 'text-white',
    borderClass: 'border-emerald-600',
  },
  {
    id: 'amber',
    label: 'Kuning Mentari',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-950',
    borderClass: 'border-amber-500',
  },
  {
    id: 'rose',
    label: 'Merah Apel',
    bgClass: 'bg-rose-600',
    textClass: 'text-white',
    borderClass: 'border-rose-600',
  },
  {
    id: 'indigo',
    label: 'Nila Kastel',
    bgClass: 'bg-indigo-600',
    textClass: 'text-white',
    borderClass: 'border-indigo-600',
  },
  {
    id: 'teal',
    label: 'Toska Pulau',
    bgClass: 'bg-teal-600',
    textClass: 'text-white',
    borderClass: 'border-teal-600',
  },
];

export function getAvatarColorStyle(colorId: AvatarColorId) {
  return AVATAR_COLORS.find((c) => c.id === colorId) ?? AVATAR_COLORS[0];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const WORLDS: WorldMeta[] = [
  {
    id: 1,
    name: 'Hutan Perkalian',
    topic: 'Perkalian & Pola Loncat (0–10)',
    description:
      'Jelajahi kebun apel rindang sambil menguasai penjumlahan berulang, barisan loncat, faktor hilang, dan sifat pertukaran.',
    questionTypesSummary: '6 Variasi: Penjumlahan Berulang · Kelompok Benda · Angka Hilang · Pola Loncat · Sifat 0 & 1',
    boardSurfaceBg: 'bg-emerald-50/40',
    boardBorderColor: 'border-emerald-200',
  },
  {
    id: 2,
    name: 'Desa Pembagian',
    topic: 'Pembagian & Kebalikan Perkalian',
    description:
      'Bantu warga desa membagi kue dan permen sama rata, pengurangan berulang, pembagian puluhan, dan angka hilang.',
    questionTypesSummary: '6 Variasi: Bagi Rata · Pengurangan Berulang · Pembagi Hilang · Kebalikan · Puluhan',
    boardSurfaceBg: 'bg-amber-50/40',
    boardBorderColor: 'border-amber-200',
  },
  {
    id: 3,
    name: 'Pulau Tantangan',
    topic: 'Operasi Campuran & Teka-Teki Angka',
    description:
      'Pecahkan misteri harta karun dengan operasi hitung campuran, perbandingan nilai, mesin angka, dan bilangan misteri.',
    questionTypesSummary: '6 Variasi: Hitung Campuran · Selisih Ekspresi · Bilangan Misteri · Mesin Angka · Senilai',
    boardSurfaceBg: 'bg-sky-50/40',
    boardBorderColor: 'border-sky-200',
  },
  {
    id: 4,
    name: 'Kastel Matematika',
    topic: 'Soal Cerita Kontekstual 1 & 2 Langkah',
    description:
      'Selesaikan beragam soal cerita kehidupan nyata mulai dari koperasi sekolah, roda kendaraan, kebun, hingga soal dua langkah!',
    questionTypesSummary: '12 Variasi Cerita: Sekolah · Kendaraan · Tabungan · Panen Buah · Soal Cerita 2 Langkah',
    boardSurfaceBg: 'bg-indigo-50/40',
    boardBorderColor: 'border-indigo-200',
  },
];

export const WORLD_MAP: Record<WorldId, WorldMeta> = {
  1: WORLDS[0],
  2: WORLDS[1],
  3: WORLDS[2],
  4: WORLDS[3],
};

export const BOARD_TILES_META: TileType[] = [
  'start',
  'challenge',
  'challenge',
  'star',
  'challenge',
  'challenge',
  'mystery',
  'challenge',
  'challenge',
  'star',
  'challenge',
  'challenge',
  'mystery',
  'challenge',
  'star',
  'challenge',
  'mystery',
  'challenge',
  'challenge',
  'star',
  'challenge',
  'challenge',
  'mystery',
  'challenge',
  'finish',
];

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first_step',
    title: 'Langkah Pertama',
    desc: 'Menjawab soal matematika pertama di papan petualangan.',
    requirementLabel: 'Jawab minimal 1 soal',
  },
  {
    id: 'math_explorer',
    title: 'Penjelajah Cilik',
    desc: 'Membuka akses perjalanan menuju Dunia ke-2.',
    requirementLabel: 'Buka Dunia 2',
  },
  {
    id: 'perkalian_hero',
    title: 'Pahlawan Perkalian',
    desc: 'Menamatkan seluruh petak di Hutan Perkalian.',
    requirementLabel: 'Tamatkan Dunia 1',
  },
  {
    id: 'division_hero',
    title: 'Master Pembagian',
    desc: 'Menamatkan seluruh petak di Desa Pembagian.',
    requirementLabel: 'Tamatkan Dunia 2',
  },
  {
    id: 'star_collector',
    title: 'Kolektor Bintang',
    desc: 'Mengumpulkan minimal 25 bintang dari soal dan petak bonus.',
    requirementLabel: 'Kumpulkan 25 Bintang',
  },
  {
    id: 'math_king',
    title: 'Juara Kastel Matematika',
    desc: 'Menaklukkan Kastel Matematika dan soal cerita kontekstual.',
    requirementLabel: 'Tamatkan Dunia 4',
  },
];

export function createEmptyWorldStats(): StudentProfile['worldStats'] {
  return {
    1: { name: 'Hutan Perkalian', answered: 0, correct: 0, wrong: 0 },
    2: { name: 'Desa Pembagian', answered: 0, correct: 0, wrong: 0 },
    3: { name: 'Pulau Tantangan', answered: 0, correct: 0, wrong: 0 },
    4: { name: 'Kastel Matematika', answered: 0, correct: 0, wrong: 0 },
  };
}

export function createEmptyBadges(): Record<BadgeId, boolean> {
  return {
    first_step: false,
    math_explorer: false,
    perkalian_hero: false,
    division_hero: false,
    star_collector: false,
    math_king: false,
  };
}

export function createStudentProfile(params: {
  name: string;
  className?: string;
  absentNumber?: string;
  avatarColor?: AvatarColorId;
}): StudentProfile {
  const now = new Date().toISOString();
  return {
    id: `stu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: params.name.trim() || 'Siswa Kelas 3',
    className: params.className?.trim() || 'Kelas 3A',
    absentNumber: params.absentNumber?.trim() || '',
    avatarColor: params.avatarColor ?? 'blue',
    createdAt: now,
    lastPlayedAt: now,
    stars: 0,
    unlockedWorld: 1,
    completedWorlds: [],
    completedLessonStages: [],
    practiceQuizBestScore: null,
    totalAnswers: 0,
    totalCorrect: 0,
    worldStats: createEmptyWorldStats(),
    badges: createEmptyBadges(),
  };
}

export function createDefaultRosterStore(): RosterStore {
  const starterStudent = createStudentProfile({
    name: 'Siswa Tamu',
    className: 'Kelas 3A',
    absentNumber: '01',
    avatarColor: 'blue',
  });

  return {
    activeStudentId: starterStudent.id,
    soundEnabled: true,
    students: [starterStudent],
    sessionHistory: [],
    answerHistory: [],
  };
}

export function evaluateStudentBadges(student: StudentProfile): Record<BadgeId, boolean> {
  return {
    first_step: student.badges.first_step || student.totalAnswers >= 1,
    math_explorer: student.badges.math_explorer || student.unlockedWorld >= 2,
    perkalian_hero: student.badges.perkalian_hero || student.completedWorlds.includes(1),
    division_hero: student.badges.division_hero || student.completedWorlds.includes(2),
    star_collector: student.badges.star_collector || student.stars >= 25,
    math_king: student.badges.math_king || student.completedWorlds.includes(4),
  };
}

export function loadRosterStore(): RosterStore {
  const fallback = createDefaultRosterStore();
  if (typeof window === 'undefined') return fallback;

  try {
    const rawV3 = window.localStorage.getItem(ROSTER_STORAGE_KEY);
    if (rawV3) {
      const parsed = JSON.parse(rawV3) as Partial<RosterStore>;
      if (Array.isArray(parsed.students) && parsed.students.length > 0) {
        const activeExists = parsed.students.some((s) => s.id === parsed.activeStudentId);
        return {
          activeStudentId: activeExists ? parsed.activeStudentId! : parsed.students[0].id,
          soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
          students: parsed.students.map((s) => ({
            ...createStudentProfile({ name: s.name || 'Siswa Kelas 3' }),
            ...s,
            completedLessonStages: Array.isArray(s.completedLessonStages)
              ? s.completedLessonStages
              : [],
            practiceQuizBestScore:
              typeof s.practiceQuizBestScore === 'number' ? s.practiceQuizBestScore : null,
            worldStats: {
              ...createEmptyWorldStats(),
              ...(s.worldStats ?? {}),
            },
            badges: {
              ...createEmptyBadges(),
              ...(s.badges ?? {}),
            },
          })),
          sessionHistory: Array.isArray(parsed.sessionHistory)
            ? parsed.sessionHistory.slice(0, 150)
            : [],
          answerHistory: Array.isArray(parsed.answerHistory)
            ? parsed.answerHistory.slice(0, 300)
            : [],
        };
      }
    }

    // Migrate from V2 if present
    const rawV2 = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV2) {
      const v2 = JSON.parse(rawV2);
      const migratedStudent = createStudentProfile({
        name:
          typeof v2.studentName === 'string' && v2.studentName.trim()
            ? v2.studentName
            : 'Petualang Kelas 3',
        className: 'Kelas 3A',
        avatarColor: 'blue',
      });
      migratedStudent.stars = typeof v2.stars === 'number' ? v2.stars : 0;
      migratedStudent.unlockedWorld =
        typeof v2.unlockedWorld === 'number' && v2.unlockedWorld >= 1 && v2.unlockedWorld <= 4
          ? (v2.unlockedWorld as WorldId)
          : 1;
      migratedStudent.completedWorlds = Array.isArray(v2.completedWorlds) ? v2.completedWorlds : [];
      migratedStudent.totalAnswers = typeof v2.totalAnswers === 'number' ? v2.totalAnswers : 0;
      migratedStudent.totalCorrect = typeof v2.totalCorrect === 'number' ? v2.totalCorrect : 0;
      migratedStudent.worldStats = {
        ...createEmptyWorldStats(),
        ...(v2.worldStats ?? {}),
      };
      migratedStudent.badges = evaluateStudentBadges(migratedStudent);

      const migratedHistory = Array.isArray(v2.recentHistory)
        ? v2.recentHistory.map((h: Record<string, unknown>, idx: number) => ({
            id: String(h.id ?? `mig-${idx}`),
            studentId: migratedStudent.id,
            studentName: migratedStudent.name,
            className: migratedStudent.className,
            timestamp: String(h.timestamp ?? new Date().toISOString()),
            worldId: (Number(h.worldId) || 1) as WorldId,
            worldName: String(h.worldName ?? 'Hutan Perkalian'),
            category: 'Latihan Matematika',
            question: String(h.question ?? ''),
            chosenAnswer: Number(h.chosenAnswer ?? 0),
            correctAnswer: Number(h.correctAnswer ?? 0),
            explanation: '',
            isCorrect: Boolean(h.isCorrect),
          }))
        : [];

      return {
        activeStudentId: migratedStudent.id,
        soundEnabled: typeof v2.soundEnabled === 'boolean' ? v2.soundEnabled : true,
        students: [migratedStudent],
        sessionHistory: [],
        answerHistory: migratedHistory,
      };
    }

    return fallback;
  } catch {
    return fallback;
  }
}

/* ==============================================================
   VARIED MATH QUESTION ENGINE (KELAS 3 SD — 28 ARCHETYPES)
   Anti-repeat history buffer ensures fresh variety every roll!
============================================================== */
const recentSignatures: string[] = [];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSmartOptions(answer: number, stepHint = 1): number[] {
  const choices = new Set<number>([answer]);

  // Add pedagogically plausible distractors (off by stepHint, ±1, ±2, etc.)
  const candidateOffsets = [
    stepHint,
    -stepHint,
    stepHint * 2,
    1,
    -1,
    2,
    -2,
    3,
    -3,
    4,
    -4,
    5,
    -5,
  ];
  const shuffledOffsets = candidateOffsets.sort(() => Math.random() - 0.5);

  for (const offset of shuffledOffsets) {
    if (choices.size >= 4) break;
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      choices.add(candidate);
    }
  }

  let fallbackAdd = 1;
  while (choices.size < 4) {
    choices.add(answer + fallbackAdd);
    fallbackAdd++;
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

type QuestionDraft = Omit<MathQuestion, 'options'> & { stepHint?: number };

function buildWorld1Draft(): QuestionDraft {
  const variant = randInt(1, 6);

  if (variant === 1) {
    // Penjumlahan berulang -> hasil
    const groups = randInt(3, 6);
    const val = randInt(2, 7);
    const ans = groups * val;
    const sumStr = new Array(groups).fill(val).join(' + ');
    return {
      signature: `w1-rep-${groups}x${val}`,
      category: 'Penjumlahan Berulang',
      qText: `Berapakah hasil dari penjumlahan berulang berikut?`,
      equationDisplay: `${sumStr} = ?`,
      answer: ans,
      stepHint: val,
      explain: `Angka ${val} dijumlahkan berulang sebanyak ${groups} kali, sama dengan ${groups} × ${val} = ${ans}.`,
      visualGroupCount: Math.min(groups, 5),
      visualPerGroup: Math.min(val, 6),
      visualKind: 'apple',
    };
  }

  if (variant === 2) {
    // Fakta perkalian 2..9
    const a = randInt(2, 8);
    const b = randInt(3, 9);
    const ans = a * b;
    return {
      signature: `w1-fact-${a}x${b}`,
      category: 'Fakta Perkalian',
      qText: `Hitunglah hasil perkalian bilangan berikut:`,
      equationDisplay: `${a} × ${b} = ?`,
      answer: ans,
      stepHint: b,
      explain: `${a} kelompok yang masing-masing berisi ${b} berjumlah ${a} × ${b} = ${ans}.`,
      visualGroupCount: a <= 5 && b <= 6 ? a : undefined,
      visualPerGroup: a <= 5 && b <= 6 ? b : undefined,
      visualKind: 'apple',
    };
  }

  if (variant === 3) {
    // Faktor hilang: ? × b = ans atau a × ? = ans
    const missingFirst = Math.random() < 0.5;
    const a = randInt(2, 7);
    const b = randInt(2, 8);
    const prod = a * b;
    if (missingFirst) {
      return {
        signature: `w1-miss1-${a}x${b}`,
        category: 'Faktor yang Hilang',
        qText: `Bilangan berapakah yang tepat untuk mengisi kotak kosong?`,
        equationDisplay: `□ × ${b} = ${prod}`,
        answer: a,
        stepHint: 1,
        explain: `Karena ${a} × ${b} = ${prod}, maka bilangan yang tepat mengisi kotak kosong adalah ${a}.`,
        visualGroupCount: a <= 5 && b <= 6 ? a : undefined,
        visualPerGroup: a <= 5 && b <= 6 ? b : undefined,
        visualKind: 'apple',
      };
    }
    return {
      signature: `w1-miss2-${a}x${b}`,
      category: 'Faktor yang Hilang',
      qText: `Bilangan berapakah yang tepat untuk mengisi kotak kosong?`,
      equationDisplay: `${a} × □ = ${prod}`,
      answer: b,
      stepHint: 1,
      explain: `Karena ${a} × ${b} = ${prod}, maka bilangan yang tepat mengisi kotak kosong adalah ${b}.`,
      visualGroupCount: a <= 5 && b <= 6 ? a : undefined,
      visualPerGroup: a <= 5 && b <= 6 ? b : undefined,
      visualKind: 'apple',
    };
  }

  if (variant === 4) {
    // Barisan bilangan loncat (skip counting)
    const step = randInt(2, 6);
    const startMult = randInt(1, 3);
    const missingPos = randInt(2, 3); // index in 5-element sequence
    const seq = [0, 1, 2, 3, 4].map((i) => (startMult + i) * step);
    const ans = seq[missingPos];
    const displaySeq = seq.map((n, i) => (i === missingPos ? '...' : String(n))).join(',  ');
    return {
      signature: `w1-seq-${step}-${startMult}-${missingPos}`,
      category: 'Pola Bilangan Loncat',
      qText: `Perhatikan pola loncat +${step} berikut. Angka berapakah yang mengisi titik-titik?`,
      equationDisplay: displaySeq,
      answer: ans,
      stepHint: step,
      explain: `Setiap suku bertambah ${step} (kelipatan ${step}): ${seq[missingPos - 1]} + ${step} = ${ans}.`,
      visualKind: 'star',
    };
  }

  if (variant === 5) {
    // Sifat komutatif (pertukaran) atau sifat angka 0 & 1
    const isCommutative = Math.random() < 0.6;
    if (isCommutative) {
      const a = randInt(3, 9);
      const b = randInt(2, 8);
      if (a === b) return buildWorld1Draft();
      return {
        signature: `w1-comm-${a}x${b}`,
        category: 'Sifat Pertukaran',
        qText: `Gunakan sifat pertukaran perkalian untuk menentukan nilai n:`,
        equationDisplay: `${a} × ${b} = ${b} × n`,
        answer: a,
        stepHint: 1,
        explain: `Menurut sifat pertukaran (komutatif), ${a} × ${b} sama nilainya dengan ${b} × ${a} = ${a * b}. Jadi n = ${a}.`,
        visualKind: 'apple',
      };
    } else {
      const m = randInt(5, 15);
      const z = randInt(4, 12);
      return {
        signature: `w1-zeroone-${m}-${z}`,
        category: 'Sifat Angka 1 & 0',
        qText: `Berapakah hasil perhitungan sifat khusus perkalian berikut?`,
        equationDisplay: `(${m} × 1) + (${z} × 0) = ?`,
        answer: m,
        stepHint: 1,
        explain: `${m} × 1 = ${m}, sedangkan ${z} × 0 = 0. Maka ${m} + 0 = ${m}.`,
        visualKind: 'star',
      };
    }
  }

  // Variant 6: Kelompok benda visual kontekstual singkat
  const baskets = randInt(3, 5);
  const perBasket = randInt(3, 6);
  const ans = baskets * perBasket;
  const itemInfo = pickRandom([
    { label: 'keranjang apel', unit: 'buah apel', kind: 'apple' as VisualTokenKind },
    { label: 'vas bunga', unit: 'tangkai bunga', kind: 'flower' as VisualTokenKind },
    { label: 'kotak pensil', unit: 'batang pensil', kind: 'pencil' as VisualTokenKind },
  ]);
  return {
    signature: `w1-grp-${baskets}x${perBasket}-${itemInfo.kind}`,
    category: 'Kelompok Benda Sama Banyak',
    qText: `Ada ${baskets} ${itemInfo.label}. Masing-masing berisi ${perBasket} ${itemInfo.unit}. Berapa jumlah semuanya?`,
    equationDisplay: `${baskets} × ${perBasket} = ?`,
    answer: ans,
    stepHint: perBasket,
    explain: `${baskets} kelompok × ${perBasket} = ${ans} ${itemInfo.unit}.`,
    visualGroupCount: baskets,
    visualPerGroup: perBasket,
    visualKind: itemInfo.kind,
  };
}

function buildWorld2Draft(): QuestionDraft {
  const variant = randInt(1, 6);

  if (variant === 1) {
    // Fakta pembagian dasar
    const divisor = randInt(2, 7);
    const quotient = randInt(2, 8);
    const total = divisor * quotient;
    return {
      signature: `w2-div-${total}/${divisor}`,
      category: 'Pembagian Sama Rata',
      qText: `Berapakah hasil pembagian bilangan berikut?`,
      equationDisplay: `${total} ÷ ${divisor} = ?`,
      answer: quotient,
      stepHint: 1,
      explain: `${total} dibagi rata menjadi ${divisor} kelompok menghasilkan ${quotient} di tiap kelompok (karena ${divisor} × ${quotient} = ${total}).`,
      visualGroupCount: divisor <= 5 && quotient <= 6 ? divisor : undefined,
      visualPerGroup: divisor <= 5 && quotient <= 6 ? quotient : undefined,
      visualKind: 'cookie',
    };
  }

  if (variant === 2) {
    // Pengurangan berulang ke pembagian
    const divisor = randInt(3, 6);
    const times = randInt(3, 6);
    const total = divisor * times;
    const chain = `${total} − ${new Array(times).fill(divisor).join(' − ')} = 0`;
    return {
      signature: `w2-repsub-${total}/${divisor}`,
      category: 'Pengurangan Berulang',
      qText: `Perhatikan pengurangan berulang sampai habis berikut. Berapakah hasil dari ${total} ÷ ${divisor} ?`,
      equationDisplay: chain,
      answer: times,
      stepHint: 1,
      explain: `Angka ${total} dikurangi ${divisor} sebanyak ${times} kali hingga menjadi 0. Jadi ${total} ÷ ${divisor} = ${times}.`,
      visualGroupCount: divisor <= 5 ? divisor : undefined,
      visualPerGroup: times <= 6 ? times : undefined,
      visualKind: 'cookie',
    };
  }

  if (variant === 3) {
    // Angka hilang pada pembagian
    const missingDividend = Math.random() < 0.45;
    const divisor = randInt(2, 6);
    const quotient = randInt(3, 7);
    const total = divisor * quotient;

    if (missingDividend) {
      return {
        signature: `w2-missdiv1-${total}/${divisor}`,
        category: 'Bilangan yang Hilang',
        qText: `Tentukan bilangan yang tepat untuk mengisi kotak kosong:`,
        equationDisplay: `□ ÷ ${divisor} = ${quotient}`,
        answer: total,
        stepHint: divisor,
        explain: `Kebalikan dari pembagian adalah perkalian: ${quotient} × ${divisor} = ${total}. Maka ${total} ÷ ${divisor} = ${quotient}.`,
        visualKind: 'candy',
      };
    }
    return {
      signature: `w2-missdiv2-${total}/${divisor}`,
      category: 'Pembagi yang Hilang',
      qText: `Dibagi berapakah agar kalimat matematika berikut benar?`,
      equationDisplay: `${total} ÷ □ = ${quotient}`,
      answer: divisor,
      stepHint: 1,
      explain: `Karena ${divisor} × ${quotient} = ${total}, maka ${total} ÷ ${divisor} = ${quotient}.`,
      visualKind: 'candy',
    };
  }

  if (variant === 4) {
    // Hubungan kebalikan perkalian & pembagian
    const a = randInt(3, 8);
    const b = randInt(4, 9);
    const prod = a * b;
    return {
      signature: `w2-inv-${a}x${b}`,
      category: 'Kebalikan Perkalian',
      qText: `Diketahui fakta perkalian ${a} × ${b} = ${prod}. Maka berapakah hasil pembagian di bawah ini?`,
      equationDisplay: `${prod} ÷ ${a} = ?`,
      answer: b,
      stepHint: 1,
      explain: `Karena ${a} × ${b} = ${prod}, maka kebalikannya ${prod} ÷ ${a} = ${b}.`,
      visualKind: 'cookie',
    };
  }

  if (variant === 5) {
    // Pembagian puluhan sederhana (Kelas 3 SD: 40 ÷ 2, 60 ÷ 3, 80 ÷ 4, 90 ÷ 3, dll.)
    const divisor = randInt(2, 5);
    const tensFactor = randInt(1, 3);
    const quotient = tensFactor * 10;
    const total = divisor * quotient;
    return {
      signature: `w2-tens-${total}/${divisor}`,
      category: 'Pembagian Puluhan',
      qText: `Hitunglah pembagian bilangan puluhan berikut dengan cermat:`,
      equationDisplay: `${total} ÷ ${divisor} = ?`,
      answer: quotient,
      stepHint: 10,
      explain: `${total / 10} puluhan dibagi ${divisor} menghasilkan ${tensFactor} puluhan, yaitu ${quotient}.`,
      visualKind: 'candy',
    };
  }

  // Variant 6: Bagi rata visual ke piring
  const plates = randInt(2, 5);
  const perPlate = randInt(3, 6);
  const total = plates * perPlate;
  return {
    signature: `w2-plate-${total}/${plates}`,
    category: 'Membagi Sama Banyak',
    qText: `Ibu menata ${total} permen sama rata ke dalam ${plates} toples. Berapa permen di setiap toples?`,
    equationDisplay: `${total} ÷ ${plates} = ?`,
    answer: perPlate,
    stepHint: 1,
    explain: `${total} permen ÷ ${plates} toples = ${perPlate} butir permen tiap toples.`,
    visualGroupCount: plates,
    visualPerGroup: perPlate,
    visualKind: 'candy',
  };
}

function buildWorld3Draft(): QuestionDraft {
  const variant = randInt(1, 6);

  if (variant === 1) {
    // Hitung campuran: (a × b) + c atau (a × b) - c
    const a = randInt(3, 7);
    const b = randInt(3, 6);
    const c = randInt(4, 12);
    const isAdd = Math.random() < 0.55;
    const mult = a * b;
    if (isAdd) {
      return {
        signature: `w3-mixadd-${a}x${b}+${c}`,
        category: 'Operasi Hitung Campuran',
        qText: `Kerjakan perkalian di dalam tanda kurung terlebih dahulu:`,
        equationDisplay: `(${a} × ${b}) + ${c} = ?`,
        answer: mult + c,
        stepHint: 2,
        explain: `Langkah 1: ${a} × ${b} = ${mult}. Langkah 2: ${mult} + ${c} = ${mult + c}.`,
        visualKind: 'star',
      };
    }
    const safeC = Math.min(c, mult - 2);
    return {
      signature: `w3-mixsub-${a}x${b}-${safeC}`,
      category: 'Operasi Hitung Campuran',
      qText: `Kerjakan perkalian di dalam tanda kurung terlebih dahulu:`,
      equationDisplay: `(${a} × ${b}) − ${safeC} = ?`,
      answer: mult - safeC,
      stepHint: 2,
      explain: `Langkah 1: ${a} × ${b} = ${mult}. Langkah 2: ${mult} − ${safeC} = ${mult - safeC}.`,
      visualKind: 'star',
    };
  }

  if (variant === 2) {
    // Hitung campuran pembagian & perkalian: (total ÷ d) × m
    const d = randInt(2, 5);
    const q = randInt(3, 7);
    const m = randInt(2, 5);
    const total = d * q;
    const ans = q * m;
    return {
      signature: `w3-divmult-${total}/${d}x${m}`,
      category: 'Tantangan Dua Operasi',
      qText: `Hitunglah nilai dari operasi berantai berikut:`,
      equationDisplay: `(${total} ÷ ${d}) × ${m} = ?`,
      answer: ans,
      stepHint: m,
      explain: `Langkah 1: ${total} ÷ ${d} = ${q}. Langkah 2: ${q} × ${m} = ${ans}.`,
      visualKind: 'candy',
    };
  }

  if (variant === 3) {
    // Selisih atau jumlah dua perkalian
    const a1 = randInt(4, 7);
    const b1 = randInt(4, 6);
    const a2 = randInt(2, 4);
    const b2 = randInt(2, 4);
    const p1 = a1 * b1;
    const p2 = a2 * b2;
    const diff = p1 - p2;
    return {
      signature: `w3-diff-${a1}x${b1}-${a2}x${b2}`,
      category: 'Membandingkan Dua Hasil',
      qText: `Berapakah selisih antara hasil (${a1} × ${b1}) dan (${a2} × ${b2}) ?`,
      equationDisplay: `(${a1} × ${b1}) − (${a2} × ${b2}) = ?`,
      answer: diff,
      stepHint: 2,
      explain: `Hasil pertama ${a1} × ${b1} = ${p1}, hasil kedua ${a2} × ${b2} = ${p2}. Selisihnya adalah ${p1} − ${p2} = ${diff}.`,
      visualKind: 'star',
    };
  }

  if (variant === 4) {
    // Teka-teki bilangan misteri
    const isMultRiddle = Math.random() < 0.5;
    if (isMultRiddle) {
      const secret = randInt(4, 9);
      const factor = randInt(3, 7);
      const result = secret * factor;
      return {
        signature: `w3-riddleM-${secret}x${factor}`,
        category: 'Teka-Teki Bilangan Misteri',
        qText: `Aku adalah sebuah bilangan. Jika aku dikalikan ${factor}, hasilnya adalah ${result}. Bilangan berapakah aku?`,
        equationDisplay: `? × ${factor} = ${result}`,
        answer: secret,
        stepHint: 1,
        explain: `Untuk menemukan bilangan awal, bagi hasilnya: ${result} ÷ ${factor} = ${secret}.`,
        visualKind: 'marble',
      };
    } else {
      const divisor = randInt(3, 6);
      const result = randInt(4, 8);
      const secret = divisor * result;
      return {
        signature: `w3-riddleD-${secret}/${divisor}`,
        category: 'Teka-Teki Bilangan Misteri',
        qText: `Aku adalah sebuah bilangan. Jika aku dibagi ${divisor}, hasilnya adalah ${result}. Bilangan berapakah aku?`,
        equationDisplay: `? ÷ ${divisor} = ${result}`,
        answer: secret,
        stepHint: divisor,
        explain: `Kalikan hasil bagi dengan pembaginya: ${result} × ${divisor} = ${secret}.`,
        visualKind: 'marble',
      };
    }
  }

  if (variant === 5) {
    // Persamaan perkalian senilai: (e.g. 6 × 4 = 3 × ?)
    const pairs: Array<[number, number, number, number]> = [
      [6, 4, 3, 8],
      [4, 9, 6, 6],
      [8, 3, 4, 6],
      [6, 6, 4, 9],
      [10, 2, 4, 5],
      [8, 5, 4, 10],
      [9, 2, 3, 6],
      [6, 5, 3, 10],
    ];
    const [a, b, c, d] = pickRandom(pairs);
    return {
      signature: `w3-eq-${a}x${b}=${c}x${d}`,
      category: 'Kesetaraan Nilai',
      qText: `Agar kedua ruas bernilai sama besar, bilangan berapa yang mengisi kotak kosong?`,
      equationDisplay: `${a} × ${b} = ${c} × □`,
      answer: d,
      stepHint: 1,
      explain: `Ruas kiri ${a} × ${b} = ${a * b}. Agar ruas kanan juga bernilai ${a * b}, maka ${c} × ${d} = ${a * b}.`,
      visualKind: 'star',
    };
  }

  // Variant 6: Mesin Angka Pulau
  const multRule = randInt(3, 6);
  const addRule = randInt(2, 5);
  const inputNum = randInt(3, 7);
  const outputNum = inputNum * multRule + addRule;
  return {
    signature: `w3-machine-${inputNum}-${multRule}-${addRule}`,
    category: 'Mesin Angka Petualang',
    qText: `Mesin Angka Pulau mengalikan bilangan masuk dengan ${multRule}, lalu menambahkannya dengan ${addRule}. Jika angka ${inputNum} masuk, angka berapa yang keluar?`,
    equationDisplay: `${inputNum} → (× ${multRule}) → (+ ${addRule}) = ?`,
    answer: outputNum,
    stepHint: 2,
    explain: `${inputNum} × ${multRule} = ${inputNum * multRule}, kemudian ditambah ${addRule} menjadi ${outputNum}.`,
    visualKind: 'star',
  };
}

function buildWorld4Draft(): QuestionDraft {
  const variant = randInt(1, 10);

  switch (variant) {
    case 1: {
      const boxes = randInt(3, 6);
      const perBox = randInt(4, 8);
      const ans = boxes * perBox;
      return {
        signature: `w4-pencil-${boxes}x${perBox}`,
        category: 'Soal Cerita · Koperasi Sekolah',
        qText: `Ibu Guru membeli ${boxes} pak buku tulis di koperasi sekolah untuk hadiah lomba. Setiap pak berisi ${perBox} buku tulis. Berapa jumlah seluruh buku tulis yang dibeli Ibu Guru?`,
        answer: ans,
        stepHint: perBox,
        explain: `${boxes} pak × ${perBox} buku = ${ans} buku tulis seluruhnya.`,
        visualGroupCount: Math.min(boxes, 5),
        visualPerGroup: Math.min(perBox, 6),
        visualKind: 'pencil',
      };
    }
    case 2: {
      const kids = randInt(3, 6);
      const each = randInt(4, 8);
      const total = kids * each;
      return {
        signature: `w4-orange-${total}/${kids}`,
        category: 'Soal Cerita · Berbagi Buah',
        qText: `Paman memanen ${total} buah jeruk manis dari kebun dan membagikannya sama banyak kepada ${kids} tetangga. Berapa buah jeruk yang diterima setiap tetangga?`,
        answer: each,
        stepHint: 1,
        explain: `${total} buah jeruk ÷ ${kids} tetangga = ${each} buah jeruk untuk masing-masing tetangga.`,
        visualGroupCount: Math.min(kids, 5),
        visualPerGroup: Math.min(each, 6),
        visualKind: 'orange',
      };
    }
    case 3: {
      const rows = randInt(4, 7);
      const cols = randInt(4, 7);
      const ans = rows * cols;
      return {
        signature: `w4-flower-${rows}x${cols}`,
        category: 'Soal Cerita · Kebun Sekolah',
        qText: `Siswa Kelas 3 menata kebun sekolah menjadi ${rows} baris tanaman. Setiap baris ditanami ${cols} pot bunga matahari. Berapa total pot bunga di kebun tersebut?`,
        answer: ans,
        stepHint: cols,
        explain: `${rows} baris × ${cols} pot bunga = ${ans} pot bunga matahari.`,
        visualGroupCount: Math.min(rows, 5),
        visualPerGroup: Math.min(cols, 6),
        visualKind: 'flower',
      };
    }
    case 4: {
      const vehicle = pickRandom([
        { name: 'sepeda roda dua', wheels: 2 },
        { name: 'becak roda tiga', wheels: 3 },
        { name: 'mobil penumpang', wheels: 4 },
      ]);
      const count = randInt(5, 9);
      const ans = count * vehicle.wheels;
      return {
        signature: `w4-wheels-${count}x${vehicle.wheels}`,
        category: 'Soal Cerita · Lingkungan Sekitar',
        qText: `Di halaman parkir taman kota terlihat ada ${count} unit ${vehicle.name}. Berapakah jumlah seluruh roda dari kendaraan tersebut?`,
        answer: ans,
        stepHint: vehicle.wheels,
        explain: `Satu ${vehicle.name} memiliki ${vehicle.wheels} roda. Maka ${count} × ${vehicle.wheels} = ${ans} roda.`,
        visualKind: 'marble',
      };
    }
    case 5: {
      const bags = randInt(4, 6);
      const each = randInt(5, 9);
      const total = bags * each;
      return {
        signature: `w4-marble-${total}/${bags}`,
        category: 'Soal Cerita · Koleksi Bermain',
        qText: `Raka memiliki ${total} butir kelereng warna-warni yang akan disimpan sama rata ke dalam ${bags} kaleng kecil. Berapa butir kelereng di setiap kaleng?`,
        answer: each,
        stepHint: 1,
        explain: `${total} butir kelereng ÷ ${bags} kaleng = ${each} butir kelereng tiap kaleng.`,
        visualGroupCount: Math.min(bags, 5),
        visualPerGroup: Math.min(each, 6),
        visualKind: 'marble',
      };
    }
    case 6: {
      // Soal Cerita 2 Langkah (Perkalian lalu Pengurangan)
      const trays = randInt(3, 5);
      const perTray = randInt(5, 7);
      const eaten = randInt(3, 6);
      const baked = trays * perTray;
      const ans = baked - eaten;
      return {
        signature: `w4-2step1-${trays}x${perTray}-${eaten}`,
        category: 'Soal Cerita Dua Langkah',
        qText: `Kakak memanggang ${trays} loyang kue cokelat. Tiap loyang berisi ${perTray} potong kue. Setelah matang, ${eaten} potong kue dimakan bersama keluarga. Berapa potong kue yang tersisa?`,
        answer: ans,
        stepHint: 2,
        explain: `Langkah 1: Total kue = ${trays} × ${perTray} = ${baked} potong. Langkah 2: Sisa kue = ${baked} − ${eaten} = ${ans} potong.`,
        visualGroupCount: trays,
        visualPerGroup: Math.min(perTray, 6),
        visualKind: 'cookie',
      };
    }
    case 7: {
      // Soal Cerita 2 Langkah (Pengurangan lalu Pembagian)
      const kids = randInt(3, 5);
      const each = randInt(4, 7);
      const kept = randInt(3, 6);
      const harvested = kids * each + kept;
      return {
        signature: `w4-2step2-${harvested}-${kept}/${kids}`,
        category: 'Soal Cerita Dua Langkah',
        qText: `Ayah memetik ${harvested} buah apel. Sebanyak ${kept} buah disimpan di kulkas, lalu sisanya dibagikan sama rata kepada ${kids} anaknya. Berapa buah apel yang diterima tiap anak?`,
        answer: each,
        stepHint: 1,
        explain: `Langkah 1: Apel yang dibagikan = ${harvested} − ${kept} = ${kids * each} buah. Langkah 2: ${kids * each} ÷ ${kids} anak = ${each} buah apel per anak.`,
        visualGroupCount: kids,
        visualPerGroup: Math.min(each, 6),
        visualKind: 'apple',
      };
    }
    case 8: {
      // Regu belajar kelas 3
      const perGroup = randInt(4, 6);
      const groups = randInt(5, 7);
      const students = perGroup * groups;
      return {
        signature: `w4-class-${students}/${perGroup}`,
        category: 'Soal Cerita · Kegiatan Kelas',
        qText: `Sebanyak ${students} siswa Kelas 3 SD akan dibagi menjadi beberapa kelompok belajar. Jika setiap kelompok terdiri atas ${perGroup} siswa, berapa kelompok belajar yang terbentuk?`,
        answer: groups,
        stepHint: 1,
        explain: `${students} siswa ÷ ${perGroup} siswa per kelompok = ${groups} kelompok belajar.`,
        visualKind: 'star',
      };
    }
    case 9: {
      // Menabung koin ribuan
      const days = randInt(5, 8);
      const coinsPerDay = randInt(3, 6);
      const ans = days * coinsPerDay;
      return {
        signature: `w4-save-${days}x${coinsPerDay}`,
        category: 'Soal Cerita · Gemar Menabung',
        qText: `Siti rajin menyisihkan ${coinsPerDay} keping uang logam ke celengannya setiap hari. Berapa keping uang logam yang terkumpul setelah ${days} hari berturut-turut?`,
        answer: ans,
        stepHint: coinsPerDay,
        explain: `${days} hari × ${coinsPerDay} keping per hari = ${ans} keping uang logam.`,
        visualKind: 'star',
      };
    }
    default: {
      // Soal cerita 2 langkah (Perkalian + Penjumlahan)
      const packs = randInt(3, 5);
      const perPack = randInt(4, 6);
      const bonus = randInt(2, 5);
      const ans = packs * perPack + bonus;
      return {
        signature: `w4-2step3-${packs}x${perPack}+${bonus}`,
        category: 'Soal Cerita Dua Langkah',
        qText: `Dina membeli ${packs} bungkus permen susu. Tiap bungkus berisi ${perPack} permen. Penjual toko memberi tambahan bonus ${bonus} permen gratis. Berapa banyak permen Dina sekarang?`,
        answer: ans,
        stepHint: 2,
        explain: `Langkah 1: ${packs} × ${perPack} = ${packs * perPack} permen. Langkah 2: Ditambah bonus ${bonus} menjadi ${ans} permen.`,
        visualGroupCount: packs,
        visualPerGroup: perPack,
        visualKind: 'candy',
      };
    }
  }
}

export function generateMathQuestion(worldId: WorldId): MathQuestion {
  let chosenDraft: QuestionDraft | null = null;

  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate =
      worldId === 1
        ? buildWorld1Draft()
        : worldId === 2
        ? buildWorld2Draft()
        : worldId === 3
        ? buildWorld3Draft()
        : buildWorld4Draft();

    chosenDraft = candidate;
    if (!recentSignatures.includes(candidate.signature)) {
      break;
    }
  }

  const finalDraft = chosenDraft!;
  recentSignatures.push(finalDraft.signature);
  if (recentSignatures.length > 14) {
    recentSignatures.shift();
  }

  const { stepHint, ...rest } = finalDraft;
  return {
    ...rest,
    options: buildSmartOptions(rest.answer, stepHint ?? 1),
  };
}

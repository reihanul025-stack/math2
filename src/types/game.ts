export type ViewId = 'home' | 'lessons' | 'worlds' | 'game' | 'progress' | 'teacher';

export type LessonStageId =
  | 'materi-1'
  | 'materi-2'
  | 'materi-3'
  | 'contoh-soal'
  | 'latihan'
  | 'rangkuman';

export type WorldId = 1 | 2 | 3 | 4;

export type TileType = 'start' | 'challenge' | 'star' | 'mystery' | 'finish';

export type BadgeId =
  | 'first_step'
  | 'math_explorer'
  | 'perkalian_hero'
  | 'division_hero'
  | 'star_collector'
  | 'math_king';

export type AvatarColorId = 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'teal';

export interface WorldStat {
  name: string;
  answered: number;
  correct: number;
  wrong: number;
}

export interface AnswerHistoryItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  timestamp: string;
  worldId: WorldId;
  worldName: string;
  category: string;
  question: string;
  chosenAnswer: number;
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
}

export interface PlaySessionRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  worldId: WorldId;
  worldName: string;
  startedAt: string;
  endedAt: string;
  finalTile: number;
  completed: boolean;
  diceRolls: number;
  questionsAnswered: number;
  correctCount: number;
  wrongCount: number;
  starsEarned: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  absentNumber: string;
  avatarColor: AvatarColorId;
  createdAt: string;
  lastPlayedAt: string;
  stars: number;
  unlockedWorld: WorldId;
  completedWorlds: WorldId[];
  completedLessonStages: LessonStageId[];
  practiceQuizBestScore: number | null;
  totalAnswers: number;
  totalCorrect: number;
  worldStats: Record<WorldId, WorldStat>;
  badges: Record<BadgeId, boolean>;
}

export interface RosterStore {
  activeStudentId: string;
  soundEnabled: boolean;
  students: StudentProfile[];
  sessionHistory: PlaySessionRecord[];
  answerHistory: AnswerHistoryItem[];
}

export interface WorldMeta {
  id: WorldId;
  name: string;
  topic: string;
  description: string;
  questionTypesSummary: string;
  boardSurfaceBg: string;
  boardBorderColor: string;
}

export type VisualTokenKind =
  | 'apple'
  | 'cookie'
  | 'star'
  | 'candy'
  | 'pencil'
  | 'orange'
  | 'flower'
  | 'marble'
  | 'book';

export interface MathQuestion {
  signature: string;
  category: string;
  qText: string;
  equationDisplay?: string;
  answer: number;
  options: number[];
  explain: string;
  visualGroupCount?: number;
  visualPerGroup?: number;
  visualKind: VisualTokenKind;
}

export interface BadgeDef {
  id: BadgeId;
  title: string;
  desc: string;
  requirementLabel: string;
}

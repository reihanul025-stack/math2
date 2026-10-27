import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AvatarColorId,
  LessonStageId,
  PlaySessionRecord,
  StudentProfile,
  ViewId,
  WorldId,
} from '../types/game';
import {
  AVATAR_COLORS,
  WORLDS,
  getAvatarColorStyle,
  getInitials,
} from '../utils/mathGenerator';
import { HERO_ILLUSTRATION, WORLD_ILLUSTRATIONS } from '../utils/worldAssets';
import { StorybookIllustration } from './StorybookIllustration';

interface HomeViewProps {
  activeStudent: StudentProfile;
  students: StudentProfile[];
  recentSessions: PlaySessionRecord[];
  soundEnabled: boolean;
  onNavigate: (view: ViewId) => void;
  onOpenLessonStage: (stage: LessonStageId) => void;
  onStartWorld: (worldId: WorldId) => void;
  onOpenHelp: () => void;
  onOpenStudentModal: () => void;
  onSelectStudent: (studentId: string) => void;
  onAddStudentAndPlay: (params: {
    name: string;
    className: string;
    absentNumber: string;
    avatarColor: AvatarColorId;
  }) => void;
  onToggleSound: () => void;
}

const CURRICULUM_PATHWAY: Array<{
  id: LessonStageId;
  step: string;
  category: string;
  title: string;
  summary: string;
  formulaPreview: string;
}> = [
  {
    id: 'materi-1',
    step: 'Tahap 01',
    category: 'Konsep & Simulasi',
    title: '1. Mengenal Perkalian',
    summary: 'Penjumlahan berulang dengan contoh cerita 3 piring apel Rina dan tabel perkalian.',
    formulaPreview: '3 × 4 = 4 + 4 + 4 = 12',
  },
  {
    id: 'materi-2',
    step: 'Tahap 02',
    category: 'Konsep & Simulasi',
    title: '2. Mengenal Pembagian',
    summary: 'Membagi 12 permen Doni kepada 3 teman sama banyak dengan alat peraga visual.',
    formulaPreview: '12 ÷ 3 = 4 permen',
  },
  {
    id: 'materi-3',
    step: 'Tahap 03',
    category: 'Ikatan Bilangan',
    title: '3. Hubungan Perkalian & Pembagian',
    summary: 'Memahami bagaimana perkalian membantu kita menghitung pembagian lebih cepat.',
    formulaPreview: '3 × 4 = 12  ↔  12 ÷ 3 = 4',
  },
  {
    id: 'contoh-soal',
    step: 'Tahap 04',
    category: 'Pembahasan Cerita',
    title: 'Contoh Soal Sehari-hari',
    summary: '4 contoh soal bergambar (kotak pensil, baris tanaman, jeruk Ibu, dan buku Pak Guru).',
    formulaPreview: '5 × 3 = 15  ·  28 ÷ 4 = 7',
  },
  {
    id: 'latihan',
    step: 'Tahap 05',
    category: 'Evaluasi Mandiri',
    title: '4. Ayo Berlatih! (8 Soal)',
    summary: 'Kerjakan 8 soal pilihan ganda interaktif dengan pemeriksaan skor otomatis.',
    formulaPreview: '8 Pertanyaan · Skor 0–100',
  },
  {
    id: 'rangkuman',
    step: 'Tahap 06',
    category: 'Penutup Materi',
    title: '5. Rangkuman Pembelajaran',
    summary: 'Ringkasan visual tiga konsep inti sebelum melangkah ke papan permainan 4 dunia.',
    formulaPreview: 'Intisari × dan ÷ Kelas 3',
  },
];

function formatShortTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeStudent,
  students,
  recentSessions,
  soundEnabled,
  onNavigate,
  onOpenLessonStage,
  onStartWorld,
  onOpenHelp,
  onOpenStudentModal,
  onSelectStudent,
  onAddStudentAndPlay,
  onToggleSound,
}) => {
  const [quickName, setQuickName] = useState('');
  const [quickClass, setQuickClass] = useState('Kelas 3A');
  const [quickAbsent, setQuickAbsent] = useState('');
  const [quickColor, setQuickColor] = useState<AvatarColorId>('emerald');
  const [nameError, setNameError] = useState<string | null>(null);

  const accuracy =
    activeStudent.totalAnswers > 0
      ? Math.round((activeStudent.totalCorrect / activeStudent.totalAnswers) * 100)
      : 0;

  const activeAvatar = getAvatarColorStyle(activeStudent.avatarColor);
  const completedStagesCount = activeStudent.completedLessonStages.length;

  // Determine next recommended stage for active student
  const nextRecommendedStage: LessonStageId =
    CURRICULUM_PATHWAY.find((s) => !activeStudent.completedLessonStages.includes(s.id))?.id ??
    'materi-1';

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickName.trim();
    if (!trimmed) {
      setNameError('Masukkan nama lengkap siswa terlebih dahulu.');
      return;
    }
    onAddStudentAndPlay({
      name: trimmed,
      className: quickClass.trim() || 'Kelas 3A',
      absentNumber: quickAbsent.trim(),
      avatarColor: quickColor,
    });
    setQuickName('');
    setQuickAbsent('');
    setNameError(null);
  };

  // Sort leaderboard by stars descending, then totalCorrect descending
  const sortedStudents = [...students].sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.totalCorrect - a.totalCorrect;
  });

  return (
    <div className="space-y-12">
      {/* Active Student Workspace Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl ${activeAvatar.bgClass} ${activeAvatar.textClass} font-display font-bold text-sm flex items-center justify-center shrink-0`}
          >
            {getInitials(activeStudent.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
              <span className="text-slate-500">Siswa Aktif:</span>
              <strong className="font-display font-bold text-slate-900 truncate">
                {activeStudent.name}
              </strong>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="text-slate-600">{activeStudent.className}</span>
              {activeStudent.absentNumber && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-600 tabular-nums">
                    Absen {activeStudent.absentNumber}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-slate-500 tabular-nums mt-0.5">
              <span>
                Materi:{' '}
                <strong className="text-blue-700 font-semibold">{completedStagesCount}/6</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Nilai Latihan:{' '}
                <strong className="text-emerald-700 font-semibold">
                  {activeStudent.practiceQuizBestScore !== null
                    ? `${activeStudent.practiceQuizBestScore}/100`
                    : 'Belum'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Bintang:{' '}
                <strong className="text-amber-700 font-semibold">{activeStudent.stars}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Dunia:{' '}
                <strong className="text-slate-800 font-semibold">
                  {activeStudent.completedWorlds.length}/4
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Akurasi: <strong className="text-slate-800 font-semibold">{accuracy}%</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenStudentModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>Ganti / Tambah Nama ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Suara</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Senyap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Balanced 2-Column Illustrated Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700 mb-3">
            <span>Materi Pembelajaran Matematika</span>
            <span aria-hidden="true">·</span>
            <span>Kelas 3 SD</span>
            <span aria-hidden="true">·</span>
            <span>Fase B</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 leading-[1.14] tracking-tight text-balance mb-4">
            Yuk, Belajar Perkalian dan Pembagian!
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-7">
            Hai, teman-teman! Kalian pasti pernah menghitung jumlah benda atau membagikan sesuatu
            kepada teman secara adil, bukan? Yuk, kita pelajari konsep perkalian dan pembagian
            secara bertahap dengan gambar, simulasi interaktif, latihan kuis, dan papan petualangan!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenLessonStage(nextRecommendedStage)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 active:translate-y-0.5 rounded-xl transition-all duration-150 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {completedStagesCount > 0 && completedStagesCount < 6
                  ? 'Lanjutkan Belajar'
                  : 'Mulai Belajar'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onStartWorld(activeStudent.unlockedWorld)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-700 active:translate-y-0.5 rounded-xl transition-all duration-150 whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>Main Papan Petualangan</span>
            </button>

            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <span>Panduan</span>
            </button>
          </div>
        </div>

        {/* Right Illustrated Stage */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 flex-1 min-h-[260px] lg:min-h-[340px]">
            <StorybookIllustration
              src={HERO_ILLUSTRATION.src}
              alt={HERO_ILLUSTRATION.alt}
              fallbackGradient={HERO_ILLUSTRATION.fallbackGradient}
              className="w-full h-full min-h-[260px] lg:h-full"
              imgClassName="w-full h-full object-cover"
            />
            {/* Measured Contrast Scrim for Bottom Callout */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-900/45 to-transparent p-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-xs text-amber-300 font-medium tabular-nums">
                  Progres Belajar {activeStudent.name} · {completedStagesCount}/6 Tahap Materi
                </p>
                <p className="font-display text-base sm:text-lg font-bold">
                  Dunia {activeStudent.unlockedWorld}:{' '}
                  {WORLDS[activeStudent.unlockedWorld - 1].name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenLessonStage('latihan')}
                className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-amber-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Coba Kuis 8 Soal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SUSUNAN MATERI BERTAHAP (6 TAHAP KURIKULUM KELAS 3 SD FASE B) */}
      <section aria-labelledby="curriculum-pathway-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-700">
              Susunan Materi Interaktif &amp; Bertahap
            </p>
            <h2
              id="curriculum-pathway-heading"
              className="font-display text-2xl font-bold text-slate-900 mt-0.5"
            >
              Alur Belajar Perkalian &amp; Pembagian
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pilih tahap materi di bawah ini untuk membaca penjelasan visual, mencoba alat peraga,
              dan mengerjakan latihan soal.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 tabular-nums">
            Ketuntasan Materi {activeStudent.name}:{' '}
            <strong className="text-emerald-700">{completedStagesCount} dari 6 tahap</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM_PATHWAY.map((item) => {
            const isDone = activeStudent.completedLessonStages.includes(item.id);
            const isQuiz = item.id === 'latihan';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenLessonStage(item.id)}
                className={`group text-left bg-white border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isDone
                    ? 'border-emerald-300 hover:border-emerald-500'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-blue-700">{item.step}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selesai
                      </span>
                    ) : (
                      <span className="text-slate-400 whitespace-nowrap">Belum dibuka</span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg tabular-nums">
                    {isQuiz && activeStudent.practiceQuizBestScore !== null
                      ? `Skor Terbaik: ${activeStudent.practiceQuizBestScore}/100`
                      : item.formulaPreview}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                    <span>{isDone ? 'Ulangi' : 'Pelajari'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* DAFTAR NAMA PENGISI & PENDAFTARAN CEPAT SISWA */}
      <section
        aria-labelledby="roster-section-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Form Isi Nama Siswa Baru */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Buku Daftar Hadir Siswa</p>
            <h2
              id="roster-section-heading"
              className="font-display text-xl font-bold text-slate-900 mt-0.5"
            >
              Isi Nama Siswa Baru
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Belum ada namamu di daftar sebelah kanan? Isi nama dan kelasmu agar nilai latihan dan
              riwayat bermainmu tercatat sendiri!
            </p>
          </div>

          <form onSubmit={handleQuickRegister} className="space-y-3.5">
            <div>
              <label
                htmlFor="home-student-name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nama Lengkap Siswa
              </label>
              <input
                id="home-student-name"
                type="text"
                maxLength={40}
                placeholder="Contoh: Muhammad Rizky"
                value={quickName}
                onChange={(e) => {
                  setQuickName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
              {nameError && <p className="text-xs font-medium text-red-600 mt-1">{nameError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="home-student-class"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Kelas
                </label>
                <input
                  id="home-student-class"
                  type="text"
                  maxLength={20}
                  placeholder="Kelas 3A"
                  value={quickClass}
                  onChange={(e) => setQuickClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="home-student-absent"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  No. Absen
                </label>
                <input
                  id="home-student-absent"
                  type="text"
                  maxLength={6}
                  placeholder="Contoh: 07"
                  value={quickAbsent}
                  onChange={(e) => setQuickAbsent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 tabular-nums"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Warna Lencana
              </span>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setQuickColor(c.id)}
                    aria-label={`Pilih warna ${c.label}`}
                    className={`w-8 h-8 rounded-lg ${c.bgClass} transition-transform ${
                      quickColor === c.id
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-105'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-600 border-b-4 border-emerald-800 hover:bg-emerald-700 active:translate-y-0.5 rounded-xl transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan Nama &amp; Mulai Belajar</span>
            </button>
          </form>
        </div>

        {/* Right: Daftar Nama yang Sudah Mengisi & Riwayat Terbaru */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-blue-700">
                Daftar Pengisi &amp; Papan Bintang
              </p>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                Siswa yang Telah Mengisi ({students.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Lihat Riwayat Lengkap →
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {sortedStudents.map((stu, idx) => {
              const color = getAvatarColorStyle(stu.avatarColor);
              const isCurrent = stu.id === activeStudent.id;
              const stuAcc =
                stu.totalAnswers > 0
                  ? Math.round((stu.totalCorrect / stu.totalAnswers) * 100)
                  : 0;

              return (
                <div
                  key={stu.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5 tabular-nums">
                      {idx + 1}.
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl ${color.bgClass} ${color.textClass} font-display font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {getInitials(stu.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-slate-900 truncate">
                        {stu.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate tabular-nums">
                        {stu.className}
                        {stu.absentNumber ? ` · Absen ${stu.absentNumber}` : ''}
                        {' · '}Materi {stu.completedLessonStages.length}/6
                        {stu.practiceQuizBestScore !== null
                          ? ` · Kuis ${stu.practiceQuizBestScore}`
                          : ''}
                        {' · '}
                        {stu.totalAnswers} soal ({stuAcc}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 tabular-nums">
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-700">{stu.stars} Bintang</p>
                      <p className="text-[11px] text-slate-400">
                        {stu.completedWorlds.length}/4 Dunia · {formatShortTime(stu.lastPlayedAt)}
                      </p>
                    </div>

                    {isCurrent ? (
                      <span className="text-xs font-semibold text-emerald-700 w-16 text-right">
                        ✓ Aktif
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectStudent(stu.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Pakai
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Recent Activity Strip */}
          {recentSessions.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-500">
                Aktivitas Belajar &amp; Permainan Terakhir
              </p>
              <div className="space-y-1.5">
                {recentSessions.slice(0, 3).map((sess) => (
                  <div
                    key={sess.id}
                    className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2 tabular-nums"
                  >
                    <span>
                      <strong className="text-slate-900">{sess.studentName}</strong> menyelesaikan{' '}
                      <strong className="text-slate-800">{sess.worldName}</strong> (
                      {sess.diceRolls === 0
                        ? `Benar ${sess.correctCount}/${sess.questionsAnswered}`
                        : sess.completed
                          ? 'Tamat Finish'
                          : `Petak ${sess.finalTile}/24`}
                      )
                    </span>
                    <span className="text-slate-500">
                      +{sess.starsEarned} Bintang · {formatShortTime(sess.endedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4 ILLUSTRATED ADVENTURE WORLDS SHOWCASE */}
      <section aria-labelledby="empat-dunia-heading" className="space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-amber-700">Permainan Papan Interaktif</p>
            <h2 id="empat-dunia-heading" className="font-display text-2xl font-bold text-slate-900">
              Peta Empat Dunia Matematika
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('worlds')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
          >
            Buka Halaman Peta Lengkap →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WORLDS.map((w) => {
            const isUnlocked = w.id <= activeStudent.unlockedWorld;
            const isCompleted = activeStudent.completedWorlds.includes(w.id);
            const art = WORLD_ILLUSTRATIONS[w.id];

            return (
              <div
                key={w.id}
                className={`group bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-150 ${
                  isUnlocked
                    ? 'border-slate-200 hover:border-blue-400 cursor-pointer'
                    : 'border-slate-200/80 opacity-75'
                }`}
                onClick={() => {
                  if (isUnlocked) onStartWorld(w.id);
                }}
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <StorybookIllustration
                      src={art.src}
                      alt={art.alt}
                      fallbackGradient={art.fallbackGradient}
                      worldId={w.id}
                      className="w-full h-full"
                      imgClassName={`w-full h-full object-cover transition-transform duration-200 ${
                        isUnlocked ? 'group-hover:scale-105' : 'grayscale-[40%]'
                      }`}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span>Dunia {w.id}</span>
                      <span aria-hidden="true">·</span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tuntas
                        </span>
                      ) : isUnlocked ? (
                        <span className="font-semibold text-blue-700">Terbuka</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3" />
                          Terkunci
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900">{w.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{w.topic}</p>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUnlocked) onStartWorld(w.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      isUnlocked
                        ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? 'Mainkan Dunia Ini' : `Buka Setelah Dunia ${w.id - 1}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

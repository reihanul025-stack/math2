import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Users, XCircle } from 'lucide-react';
import {
  AnswerHistoryItem,
  PlaySessionRecord,
  StudentProfile,
  ViewId,
} from '../types/game';
import { BADGE_DEFS, WORLDS, getAvatarColorStyle, getInitials } from '../utils/mathGenerator';
import { BadgeEmblemSvg, WorldEmblemSvg } from './MascotIllustrations';

interface ProgressViewProps {
  activeStudent: StudentProfile;
  students: StudentProfile[];
  sessionHistory: PlaySessionRecord[];
  answerHistory: AnswerHistoryItem[];
  onNavigate: (view: ViewId) => void;
  onSelectStudent: (studentId: string) => void;
  onOpenStudentModal: () => void;
}

type ProgressTab = 'overview' | 'sessions' | 'answers';

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  activeStudent,
  students,
  sessionHistory,
  answerHistory,
  onNavigate,
  onSelectStudent,
  onOpenStudentModal,
}) => {
  const [tab, setTab] = useState<ProgressTab>('overview');
  const [historyScope, setHistoryScope] = useState<'active' | 'all'>('active');
  const [answerFilter, setAnswerFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  const accuracy =
    activeStudent.totalAnswers > 0
      ? Math.round((activeStudent.totalCorrect / activeStudent.totalAnswers) * 100)
      : 0;

  const unlockedBadgeCount = Object.values(activeStudent.badges).filter(Boolean).length;
  const avatar = getAvatarColorStyle(activeStudent.avatarColor);

  const filteredSessions = sessionHistory.filter((s) =>
    historyScope === 'all' ? true : s.studentId === activeStudent.id
  );

  const filteredAnswers = answerHistory.filter((a) => {
    if (historyScope === 'active' && a.studentId !== activeStudent.id) return false;
    if (answerFilter === 'correct' && !a.isCorrect) return false;
    if (answerFilter === 'wrong' && a.isCorrect) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & Student Selector */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-2 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Riwayat &amp; Progres Belajar
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Lihat koleksi lencana, riwayat sesi permainan papan, serta catatan jawaban soal tiap
            siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2">
            <div
              className={`w-7 h-7 rounded-lg ${avatar.bgClass} ${avatar.textClass} font-display font-bold text-xs flex items-center justify-center shrink-0`}
            >
              {getInitials(activeStudent.name)}
            </div>
            <label htmlFor="progress-student-select" className="sr-only">
              Pilih Siswa
            </label>
            <select
              id="progress-student-select"
              value={activeStudent.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="text-sm font-semibold text-slate-900 bg-transparent focus:outline-none pr-2"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenStudentModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap"
          >
            <Users className="w-4 h-4" />
            <span>Tambah Nama</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Row for Selected Student */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Ringkasan Statistik Siswa">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Total Bintang</p>
          <p className="font-display text-3xl font-bold text-amber-600 tabular-nums">
            {activeStudent.stars}
          </p>
          <p className="text-xs text-slate-400 mt-1 truncate">{activeStudent.name}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Materi &amp; Kuis Fase B</p>
          <p className="font-display text-3xl font-bold text-blue-700 tabular-nums">
            {activeStudent.completedLessonStages.length} / 6
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {activeStudent.practiceQuizBestScore !== null
              ? `Nilai Kuis: ${activeStudent.practiceQuizBestScore}/100`
              : 'Kuis 8 soal belum dikerjakan'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Akurasi Jawaban</p>
          <p className="font-display text-3xl font-bold text-emerald-700 tabular-nums">
            {accuracy}%
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {activeStudent.totalCorrect} benar dari {activeStudent.totalAnswers} soal
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Dunia Ditaklukkan</p>
          <p className="font-display text-3xl font-bold text-slate-900 tabular-nums">
            {activeStudent.completedWorlds.length} / 4
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {unlockedBadgeCount} / 6 lencana terbuka
          </p>
        </div>
      </section>

      {/* Segmented Navigation for Overview vs Histories */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div
          className="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl overflow-x-auto max-w-full"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'overview'}
            onClick={() => setTab('overview')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              tab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lencana &amp; Penguasaan
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sessions'}
            onClick={() => setTab('sessions')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              tab === 'sessions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Sesi Bermain ({filteredSessions.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'answers'}
            onClick={() => setTab('answers')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              tab === 'answers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Jawaban Soal ({filteredAnswers.length})
          </button>
        </div>

        {(tab === 'sessions' || tab === 'answers') && students.length > 1 && (
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setHistoryScope('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                historyScope === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hanya {activeStudent.name}
            </button>
            <button
              type="button"
              onClick={() => setHistoryScope('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                historyScope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Siswa ({students.length})
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: BADGES & WORLD MASTERY */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <section className="space-y-4" aria-labelledby="badges-heading">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2 id="badges-heading" className="font-display text-xl font-bold text-slate-900">
                  Koleksi Lencana {activeStudent.name}
                </h2>
                <p className="text-sm text-slate-600">
                  Selesaikan misi petualangan untuk membuka keenam lencana kehormatan.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap">
                Terbuka {unlockedBadgeCount} dari 6
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGE_DEFS.map((badge) => {
                const isUnlocked = activeStudent.badges[badge.id];
                return (
                  <div
                    key={badge.id}
                    className={`bg-white border rounded-2xl p-5 flex items-start gap-4 transition-opacity ${
                      isUnlocked ? 'border-amber-300' : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <BadgeEmblemSvg
                      id={badge.id}
                      unlocked={isUnlocked}
                      className="w-14 h-14 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terbuka
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                            <Lock className="w-3 h-3" />
                            Terkunci
                          </span>
                        )}
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-slate-500 truncate">{badge.requirementLabel}</span>
                      </div>

                      <h3 className="font-display text-base font-bold text-slate-900">
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="world-progress-heading">
            <h2
              id="world-progress-heading"
              className="font-display text-xl font-bold text-slate-900"
            >
              Rincian Penguasaan per Dunia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WORLDS.map((w) => {
                const s = activeStudent.worldStats[w.id];
                const wAcc = s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0;
                const isDone = activeStudent.completedWorlds.includes(w.id);

                return (
                  <div
                    key={w.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <WorldEmblemSvg worldId={w.id} className="w-12 h-12 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-display text-base font-bold text-slate-900 truncate">
                          {w.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold whitespace-nowrap ${
                            isDone ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {isDone ? '✓ Tuntas' : 'Belum Tamat'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full w-full bg-blue-600 origin-left transition-transform duration-200"
                          style={{ transform: `scaleX(${wAcc / 100})` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                        <span>
                          Benar {s.correct} / {s.answered} soal
                        </span>
                        <span className="font-semibold text-slate-800">
                          {s.answered > 0 ? `${wAcc}%` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: PLAY SESSION HISTORY */}
      {tab === 'sessions' && (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Riwayat Sesi Petualangan Papan
            </h2>
            <span className="text-xs text-slate-500">
              Setiap sesi permainan yang tamat maupun disimpan keluar tercatat di sini
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-sm text-slate-500">
                Belum ada sesi petualangan yang tercatat untuk pilihan ini.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('worlds')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Mulai Bermain Sekarang
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3.5 px-6">Waktu Selesai</th>
                    <th className="py-3.5 px-4">Nama Siswa</th>
                    <th className="py-3.5 px-4">Dunia</th>
                    <th className="py-3.5 px-4">Hasil Akhir</th>
                    <th className="py-3.5 px-4 text-right">Lemparan</th>
                    <th className="py-3.5 px-4 text-right">Benar / Soal</th>
                    <th className="py-3.5 px-6 text-right">Bintang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 tabular-nums">
                  {filteredSessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateTime(sess.endedAt)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {sess.studentName}{' '}
                        <span className="font-normal text-xs text-slate-500">
                          ({sess.className})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {sess.worldName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {sess.diceRolls === 0 ? (
                          <span className="font-semibold text-blue-700">
                            Nilai{' '}
                            {Math.round(
                              (sess.correctCount / Math.max(1, sess.questionsAnswered)) * 100
                            )}
                            /100
                          </span>
                        ) : sess.completed ? (
                          <span className="font-semibold text-emerald-700">✓ Tamat Finish</span>
                        ) : (
                          <span className="text-slate-600">Petak {sess.finalTile} / 24</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {sess.diceRolls > 0 ? `${sess.diceRolls}×` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                        {sess.correctCount} / {sess.questionsAnswered}
                      </td>
                      <td className="py-3.5 px-6 text-right font-bold text-amber-700">
                        +{sess.starsEarned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: DETAILED ANSWER HISTORY */}
      {tab === 'answers' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Pelajari kembali soal-soal yang pernah dikerjakan beserta pembahasannya:
            </p>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAnswerFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  answerFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setAnswerFilter('correct')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  answerFilter === 'correct'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Benar Saja
              </button>
              <button
                type="button"
                onClick={() => setAnswerFilter('wrong')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  answerFilter === 'wrong'
                    ? 'bg-white text-red-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Perlu Diperbaiki
              </button>
            </div>
          </div>

          {filteredAnswers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
              Belum ada catatan jawaban soal untuk filter ini.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnswers.slice(0, 50).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <strong className="font-semibold text-slate-900">{item.studentName}</strong>
                      <span aria-hidden="true">·</span>
                      <span>{item.worldName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-700 font-medium">{item.category}</span>
                    </div>
                    <span className="tabular-nums">{formatDateTime(item.timestamp)}</span>
                  </div>

                  <p className="font-display text-base font-bold text-slate-900">{item.question}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm pt-1 tabular-nums">
                    <span>
                      Jawaban Siswa:{' '}
                      <strong
                        className={`font-mono ${
                          item.isCorrect ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {item.chosenAnswer}
                      </strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>
                      Kunci Jawaban:{' '}
                      <strong className="font-mono text-slate-900">{item.correctAnswer}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Benar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                        <XCircle className="w-4 h-4" />
                        Kurang Tepat
                      </span>
                    )}
                  </div>

                  {item.explanation && (
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 mt-2">
                      <strong>Pembahasan: </strong>
                      {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

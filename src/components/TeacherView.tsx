import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  RotateCcw,
  Trash2,
  Unlock,
  UserPlus,
  XCircle,
} from 'lucide-react';
import {
  AnswerHistoryItem,
  PlaySessionRecord,
  StudentProfile,
  ViewId,
  WorldId,
} from '../types/game';
import { WORLDS, getAvatarColorStyle, getInitials } from '../utils/mathGenerator';
import { WorldEmblemSvg } from './MascotIllustrations';

interface TeacherViewProps {
  activeStudent: StudentProfile;
  students: StudentProfile[];
  sessionHistory: PlaySessionRecord[];
  answerHistory: AnswerHistoryItem[];
  onNavigate: (view: ViewId) => void;
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenStudentModal: () => void;
  onResetAllData: () => void;
  onUnlockAllWorldsForActive: () => void;
}

type TeacherTab = 'roster' | 'worlds' | 'logs';

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

export const TeacherView: React.FC<TeacherViewProps> = ({
  activeStudent,
  students,
  sessionHistory,
  answerHistory,
  onNavigate,
  onSelectStudent,
  onDeleteStudent,
  onOpenStudentModal,
  onResetAllData,
  onUnlockAllWorldsForActive,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('roster');
  const [selectedFilterId, setSelectedFilterId] = useState<string>('ALL');
  const [showResetModal, setShowResetModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(null);

  const scopedStudents =
    selectedFilterId === 'ALL'
      ? students
      : students.filter((s) => s.id === selectedFilterId);

  // Aggregate metrics across scopedStudents
  const totalStars = scopedStudents.reduce((acc, s) => acc + s.stars, 0);
  const totalAnswered = scopedStudents.reduce((acc, s) => acc + s.totalAnswers, 0);
  const totalCorrect = scopedStudents.reduce((acc, s) => acc + s.totalCorrect, 0);
  const overallAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const aggregatedWorldStats = WORLDS.map((w) => {
    const answered = scopedStudents.reduce((sum, s) => sum + s.worldStats[w.id].answered, 0);
    const correct = scopedStudents.reduce((sum, s) => sum + s.worldStats[w.id].correct, 0);
    const wrong = scopedStudents.reduce((sum, s) => sum + s.worldStats[w.id].wrong, 0);
    const completedCount = scopedStudents.filter((s) =>
      s.completedWorlds.includes(w.id)
    ).length;
    return {
      world: w,
      answered,
      correct,
      wrong,
      completedCount,
    };
  });

  // Identify remedial topic with highest wrong answers
  let worstTopicLabel: string | null = null;
  let maxWrong = 0;
  for (const row of aggregatedWorldStats) {
    if (row.wrong > maxWrong) {
      maxWrong = row.wrong;
      worstTopicLabel = `${row.world.name} (${row.wrong} jawaban salah)`;
    }
  }

  const scopedSessions = sessionHistory.filter((s) =>
    selectedFilterId === 'ALL' ? true : s.studentId === selectedFilterId
  );

  const scopedAnswers = answerHistory.filter((a) =>
    selectedFilterId === 'ALL' ? true : a.studentId === selectedFilterId
  );

  const handleExportCSV = () => {
    let csv = '=== REKAPITULASI DAFTAR NAMA SISWA PENGISI ===\n';
    csv +=
      'No,Nama Siswa,Kelas,No Absen,Tahap Materi,Nilai Kuis Latihan,Total Bintang,Dunia Tuntas,Soal Dijawab,Jawaban Benar,Jawaban Salah,Akurasi,Terakhir Aktif\n';

    students.forEach((s, idx) => {
      const wrong = s.totalAnswers - s.totalCorrect;
      const acc = s.totalAnswers > 0 ? `${Math.round((s.totalCorrect / s.totalAnswers) * 100)}%` : '0%';
      const quizVal = s.practiceQuizBestScore !== null ? `${s.practiceQuizBestScore}/100` : '-';
      csv += `${idx + 1},"${s.name}","${s.className}","${s.absentNumber || '-'}","${s.completedLessonStages.length}/6","${quizVal}",${s.stars},"${s.completedWorlds.length}/4",${s.totalAnswers},${s.totalCorrect},${wrong},"${acc}","${formatDateTime(s.lastPlayedAt)}"\n`;
    });

    csv += '\n=== RIWAYAT SESI BERMAIN & KUIS MATERI ===\n';
    csv += 'Waktu Selesai,Nama Siswa,Kelas,Kegiatan / Dunia,Status,Posisi Petak,Lemparan Dadu,Benar,Salah,Bintang\n';
    sessionHistory.forEach((sess) => {
      const statusLabel =
        sess.diceRolls === 0
          ? `Kuis (${Math.round((sess.correctCount / Math.max(1, sess.questionsAnswered)) * 100)}/100)`
          : sess.completed
            ? 'Tamat'
            : 'Belum Tamat';
      const tileLabel = sess.diceRolls === 0 ? '-' : `${sess.finalTile}/24`;
      csv += `"${formatDateTime(sess.endedAt)}","${sess.studentName}","${sess.className}","${sess.worldName}","${statusLabel}","${tileLabel}",${sess.diceRolls},${sess.correctCount},${sess.wrongCount},${sess.starsEarned}\n`;
    });

    csv += '\n=== RIWAYAT JAWABAN SOAL ===\n';
    csv += 'Waktu,Nama Siswa,Kelas,Dunia,Kategori Soal,Pertanyaan,Jawaban Siswa,Kunci Jawaban,Hasil\n';
    answerHistory.forEach((ans) => {
      csv += `"${formatDateTime(ans.timestamp)}","${ans.studentName}","${ans.className}","${ans.worldName}","${ans.category}","${ans.question.replace(/"/g, '""')}",${ans.chosenAnswer},${ans.correctAnswer},"${
        ans.isCorrect ? 'Benar' : 'Salah'
      }"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Lengkap_Math_Adventure_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNoticeBanner('Laporan lengkap daftar siswa dan seluruh riwayat (CSV) berhasil diunduh.');
  };

  return (
    <div className="space-y-8">
      {/* Header & Teacher Controls */}
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
            Dashboard Guru &amp; Rekap Nama Pengisi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola daftar nama siswa yang mengisi, evaluasi riwayat pengerjaan, dan unduh laporan
            nilai kelas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenStudentModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Tambah Siswa</span>
          </button>

          {activeStudent.unlockedWorld < 4 && (
            <button
              type="button"
              onClick={() => {
                onUnlockAllWorldsForActive();
                setNoticeBanner(
                  `Keempat dunia berhasil dibuka untuk siswa aktif (${activeStudent.name}).`
                );
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <Unlock className="w-4 h-4 text-blue-600" />
              <span>Buka 4 Dunia ({activeStudent.name})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekap CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Semua</span>
          </button>
        </div>
      </div>

      {/* Confirmation Notice Banner */}
      {noticeBanner && (
        <div
          role="status"
          className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-sm text-emerald-900"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{noticeBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setNoticeBanner(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Diagnostic Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Ringkasan Kelas">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Jumlah Siswa Pengisi</p>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {students.length} Siswa Terdaftar
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            Total {sessionHistory.length} sesi bermain · { totalStars } bintang
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">
            Akurasi Jawaban ({selectedFilterId === 'ALL' ? 'Seluruh Siswa' : 'Siswa Terpilih'})
          </p>
          <p className="font-display text-2xl font-bold text-blue-700 tabular-nums">
            {totalAnswered > 0 ? `${overallAccuracy}%` : 'Belum Ada Jawaban'}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {totalCorrect} benar dari {totalAnswered} soal dijawab
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500 mb-1">Evaluasi Materi Remedial</p>
          {worstTopicLabel ? (
            <div className="flex items-start gap-2 mt-1">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-base font-bold text-slate-900">{worstTopicLabel}</p>
                <p className="text-xs text-slate-500">Perlu penguatan konsep bersama Guru</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  Ketuntasan Terkendali Baik
                </p>
                <p className="text-xs text-slate-500">Belum ditemukan kendala materi menonjol</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Teacher Sub-Navigation & Student Scope Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div
          className="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl overflow-x-auto max-w-full"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'roster'}
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Nama Pengisi ({students.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'worlds'}
            onClick={() => setActiveTab('worlds')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'worlds'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Materi per Dunia
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'logs'}
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              activeTab === 'logs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log Riwayat Sesi &amp; Soal ({scopedAnswers.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <label htmlFor="teacher-student-filter" className="text-slate-600 font-medium">
            Filter Siswa:
          </label>
          <select
            id="teacher-student-filter"
            value={selectedFilterId}
            onChange={(e) => setSelectedFilterId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Semua Siswa ({students.length})</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: STUDENT ROSTER TABLE */}
      {activeTab === 'roster' && (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Daftar Seluruh Nama Siswa yang Mengisi
            </h2>
            <span className="text-xs text-slate-500">
              Klik &ldquo;Lihat Riwayat&rdquo; untuk memeriksa detail pengerjaan masing-masing siswa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3.5 px-6">No</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Kelas &amp; Absen</th>
                  <th className="py-3.5 px-4 text-right">Materi</th>
                  <th className="py-3.5 px-4 text-right">Nilai Kuis</th>
                  <th className="py-3.5 px-4 text-right">Bintang</th>
                  <th className="py-3.5 px-4 text-right">Dunia</th>
                  <th className="py-3.5 px-4 text-right">Benar / Soal</th>
                  <th className="py-3.5 px-4 text-right">Akurasi</th>
                  <th className="py-3.5 px-4">Terakhir Aktif</th>
                  <th className="py-3.5 px-6 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {scopedStudents.map((stu, idx) => {
                  const color = getAvatarColorStyle(stu.avatarColor);
                  const acc =
                    stu.totalAnswers > 0
                      ? `${Math.round((stu.totalCorrect / stu.totalAnswers) * 100)}%`
                      : '-';

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/70">
                      <td className="py-4 px-6 text-slate-400 font-mono text-xs">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${color.bgClass} ${color.textClass} font-display font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {getInitials(stu.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 whitespace-nowrap">{stu.name}</p>
                            {stu.id === activeStudent.id && (
                              <span className="text-[11px] font-semibold text-emerald-700">
                                Sedang Aktif
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        {stu.className}
                        {stu.absentNumber ? ` · No. ${stu.absentNumber}` : ''}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-blue-700 whitespace-nowrap">
                        {stu.completedLessonStages.length} / 6
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-emerald-700 whitespace-nowrap">
                        {stu.practiceQuizBestScore !== null ? `${stu.practiceQuizBestScore}/100` : '-'}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-amber-700">
                        {stu.stars}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                        {stu.completedWorlds.length} / 4
                      </td>
                      <td className="py-4 px-4 text-right text-slate-700 whitespace-nowrap">
                        <strong className="text-emerald-700">{stu.totalCorrect}</strong> /{' '}
                        {stu.totalAnswers}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900">{acc}</td>
                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateTime(stu.lastPlayedAt)}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFilterId(stu.id);
                              setActiveTab('logs');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Lihat Riwayat
                          </button>

                          {students.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setStudentToDelete(stu)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                              aria-label={`Hapus data ${stu.name}`}
                              title="Hapus siswa ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: WORLD MASTERY BREAKDOWN */}
      {activeTab === 'worlds' && (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Rekapitulasi Penguasaan Materi per Dunia
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3.5 px-6">Dunia Petualangan</th>
                  <th className="py-3.5 px-4">Materi Pokok</th>
                  <th className="py-3.5 px-4 text-right">Siswa Tuntas</th>
                  <th className="py-3.5 px-4 text-right">Soal Dijawab</th>
                  <th className="py-3.5 px-4 text-right">Benar</th>
                  <th className="py-3.5 px-4 text-right">Salah</th>
                  <th className="py-3.5 px-6 text-right">Akurasi Materi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {aggregatedWorldStats.map(({ world, answered, correct, wrong, completedCount }) => {
                  const accText =
                    answered > 0 ? `${Math.round((correct / answered) * 100)}%` : '-';

                  return (
                    <tr key={world.id as WorldId} className="hover:bg-slate-50/70">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <WorldEmblemSvg worldId={world.id} className="w-8 h-8 shrink-0" />
                          <span>{world.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{world.topic}</td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800">
                        {completedCount} / {scopedStudents.length} siswa
                      </td>
                      <td className="py-4 px-4 text-right text-slate-700">{answered}</td>
                      <td className="py-4 px-4 text-right font-semibold text-emerald-700">
                        {correct}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-red-600">{wrong}</td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">{accText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: COMBINED SESSION & ANSWER LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Sessions Log */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Log Sesi Permainan ({scopedSessions.length})
              </h2>
              {selectedFilterId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedFilterId('ALL')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Tampilkan Semua Siswa
                </button>
              )}
            </div>

            {scopedSessions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Belum ada riwayat sesi permainan yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-6">Waktu</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Dunia</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Benar / Soal</th>
                      <th className="py-3 px-6 text-right">Bintang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 tabular-nums">
                    {scopedSessions.slice(0, 25).map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                          {formatDateTime(sess.endedAt)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {sess.studentName} ({sess.className})
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
                            <span className="text-slate-600">Petak {sess.finalTile}/24</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-800">
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

          {/* Answers Log */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Log Detail Jawaban Soal ({scopedAnswers.length})
              </h2>
            </div>

            {scopedAnswers.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Belum ada riwayat jawaban soal yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="py-3 px-6">Waktu</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Pertanyaan</th>
                      <th className="py-3 px-4 text-right">Dijawab</th>
                      <th className="py-3 px-4 text-right">Kunci</th>
                      <th className="py-3 px-6">Hasil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 tabular-nums">
                    {scopedAnswers.slice(0, 40).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                          {formatDateTime(item.timestamp)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {item.studentName}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-blue-700 font-medium whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 max-w-md">{item.question}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                          {item.chosenAnswer}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-600">
                          {item.correctAnswer}
                        </td>
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          {item.isCorrect ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                              Benar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                              <XCircle className="w-4 h-4" />
                              Salah
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Delete Single Student Confirmation Modal */}
      {studentToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setStudentToDelete(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl animate-modal-enter space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-slate-900">
              Hapus Data {studentToDelete.name}?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Profil beserta riwayat sesi dan jawaban milik <strong>{studentToDelete.name}</strong>{' '}
              akan dihapus dari perangkat ini.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  if (selectedFilterId === studentToDelete.id) {
                    setSelectedFilterId('ALL');
                  }
                  setNoticeBanner(`Data siswa ${studentToDelete.name} telah dihapus.`);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Data Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl animate-modal-enter space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 id="reset-modal-title" className="font-display text-lg font-bold text-slate-900">
                Reset Seluruh Daftar Nama &amp; Riwayat?
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apakah Bapak/Ibu Guru yakin ingin menghapus seluruh daftar nama siswa, riwayat sesi,
              dan riwayat jawaban soal kembali ke awal?
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setSelectedFilterId('ALL');
                  setShowResetModal(false);
                  setNoticeBanner('Seluruh daftar siswa dan riwayat telah direset ke kondisi awal.');
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Ya, Reset Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

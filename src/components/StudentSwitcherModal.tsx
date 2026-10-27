import React, { useState } from 'react';
import { Check, UserPlus, Users, X } from 'lucide-react';
import { AvatarColorId, StudentProfile } from '../types/game';
import { AVATAR_COLORS, getAvatarColorStyle, getInitials } from '../utils/mathGenerator';

interface StudentSwitcherModalProps {
  open: boolean;
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (params: {
    name: string;
    className: string;
    absentNumber: string;
    avatarColor: AvatarColorId;
  }) => void;
  onClose: () => void;
}

export const StudentSwitcherModal: React.FC<StudentSwitcherModalProps> = ({
  open,
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onClose,
}) => {
  const [mode, setMode] = useState<'list' | 'add'>('list');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('Kelas 3A');
  const [absentNumber, setAbsentNumber] = useState('');
  const [avatarColor, setAvatarColor] = useState<AvatarColorId>('emerald');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('Tuliskan nama lengkapmu terlebih dahulu ya.');
      return;
    }
    onAddStudent({
      name: trimmed,
      className: className.trim() || 'Kelas 3A',
      absentNumber: absentNumber.trim(),
      avatarColor,
    });
    setName('');
    setAbsentNumber('');
    setErrorMsg(null);
    setMode('list');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl animate-modal-enter space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-blue-600">Daftar Penjelajah Kelas</p>
            <h2 id="student-modal-title" className="font-display text-xl font-bold text-slate-900">
              Pilih atau Isi Nama Siswa
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Tutup jendela daftar siswa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Segmented Mode Switch */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setMode('list');
              setErrorMsg(null);
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pilih Nama ({students.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('add');
              setErrorMsg(null);
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'add'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Isi Nama Siswa Baru</span>
          </button>
        </div>

        {mode === 'list' ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {students.map((stu) => {
              const isSelected = stu.id === activeStudentId;
              const color = getAvatarColorStyle(stu.avatarColor);
              const acc =
                stu.totalAnswers > 0
                  ? Math.round((stu.totalCorrect / stu.totalAnswers) * 100)
                  : 0;

              return (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => {
                    onSelectStudent(stu.id);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl ${color.bgClass} ${color.textClass} font-display font-bold text-sm flex items-center justify-center shrink-0`}
                    >
                      {getInitials(stu.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-slate-900 truncate">{stu.name}</p>
                      <p className="text-xs text-slate-500 truncate tabular-nums">
                        {stu.className}
                        {stu.absentNumber ? ` · Absen ${stu.absentNumber}` : ''}
                        {' · '}
                        {stu.stars} Bintang · {stu.completedWorlds.length}/4 Dunia · Akurasi {acc}%
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 whitespace-nowrap shrink-0">
                      <Check className="w-4 h-4" />
                      Aktif
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
                      Pilih →
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setMode('add')}
              className="w-full py-3 px-4 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50/40 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Nama Siswa Lainnya</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div>
              <label htmlFor="new-student-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Nama Lengkap Siswa
              </label>
              <input
                id="new-student-name"
                type="text"
                maxLength={40}
                placeholder="Contoh: Siti Nurhaliza"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                autoFocus
              />
              {errorMsg && <p className="text-xs font-medium text-red-600 mt-1">{errorMsg}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new-student-class" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Kelas
                </label>
                <input
                  id="new-student-class"
                  type="text"
                  maxLength={20}
                  placeholder="Contoh: Kelas 3A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label htmlFor="new-student-absent" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Nomor Absen (Opsional)
                </label>
                <input
                  id="new-student-absent"
                  type="text"
                  maxLength={6}
                  placeholder="Contoh: 12"
                  value={absentNumber}
                  onChange={(e) => setAbsentNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 tabular-nums"
                />
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-800 mb-2">
                Pilih Warna Lencana Penjelajah
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_COLORS.map((c) => {
                  const selected = avatarColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAvatarColor(c.id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
                        selected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass}`} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Simpan &amp; Mulai Bermain
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

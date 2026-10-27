import React from 'react';
import { ArrowLeft, CheckCircle2, Lock, Play, Users } from 'lucide-react';
import { StudentProfile, ViewId, WorldId } from '../types/game';
import { WORLDS, getAvatarColorStyle, getInitials } from '../utils/mathGenerator';
import { WORLD_ILLUSTRATIONS } from '../utils/worldAssets';
import { StorybookIllustration } from './StorybookIllustration';

interface WorldsViewProps {
  student: StudentProfile;
  onNavigate: (view: ViewId) => void;
  onStartWorld: (worldId: WorldId) => void;
  onOpenStudentModal: () => void;
}

export const WorldsView: React.FC<WorldsViewProps> = ({
  student,
  onNavigate,
  onStartWorld,
  onOpenStudentModal,
}) => {
  const avatar = getAvatarColorStyle(student.avatarColor);

  return (
    <div className="space-y-8">
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
            Pilih Dunia Petualangan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Setiap dunia menghadirkan variasi soal baru untuk mengasah ketelitian berhitungmu!
          </p>
        </div>

        {/* Active Player Pill-Free Bar */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <div
            className={`w-8 h-8 rounded-lg ${avatar.bgClass} ${avatar.textClass} font-display font-bold text-xs flex items-center justify-center shrink-0`}
          >
            {getInitials(student.name)}
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900">{student.name}</p>
            <p className="text-slate-500 tabular-nums">
              {student.className} · {student.completedWorlds.length}/4 Dunia Tuntas
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenStudentModal}
            className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ganti</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORLDS.map((world) => {
          const isUnlocked = world.id <= student.unlockedWorld;
          const isCompleted = student.completedWorlds.includes(world.id);
          const stats = student.worldStats[world.id];
          const accuracy =
            stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : null;
          const art = WORLD_ILLUSTRATIONS[world.id];

          return (
            <article
              key={world.id}
              className={`bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-150 ${
                isUnlocked
                  ? 'border-slate-200 hover:border-blue-400 shadow-xs'
                  : 'border-slate-200/80 opacity-80'
              }`}
            >
              <div>
                {/* World Storybook Landscape Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-100">
                  <StorybookIllustration
                    src={art.src}
                    alt={art.alt}
                    fallbackGradient={art.fallbackGradient}
                    worldId={world.id}
                    className="w-full h-full"
                    imgClassName={`w-full h-full object-cover ${
                      isUnlocked ? '' : 'grayscale-[55%]'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent px-5 py-4 text-white flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-amber-300 font-medium">
                        Dunia {world.id} · {world.topic}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-bold">{world.name}</h2>
                    </div>
                    <span className="text-xs font-semibold text-white/95 whitespace-nowrap">
                      {isCompleted ? '✓ Tuntas' : isUnlocked ? 'Siap Dijelajahi' : 'Terkunci'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">{world.description}</p>
                  <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                    <strong className="font-semibold text-slate-700">Cakupan Soal: </strong>
                    {world.questionTypesSummary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 tabular-nums">
                  {stats.answered > 0 ? (
                    <>
                      <strong className="text-slate-800">{stats.answered} soal</strong> dijawab
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                      <span>
                        Akurasi <strong className="text-emerald-700">{accuracy}%</strong>
                      </span>
                    </>
                  ) : (
                    <span>Belum ada riwayat pengerjaan</span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => onStartWorld(world.id)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-700 active:translate-y-0.5 rounded-xl transition-all duration-150 whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCompleted ? 'Mainkan Lagi' : 'Jelajahi Dunia'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl cursor-not-allowed whitespace-nowrap shrink-0"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Selesaikan Dunia {world.id - 1} Dulu</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

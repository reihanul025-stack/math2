import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, X } from 'lucide-react';
import {
  AnswerHistoryItem,
  AvatarColorId,
  BadgeId,
  LessonStageId,
  PlaySessionRecord,
  RosterStore,
  StudentProfile,
  ViewId,
  WorldId,
} from './types/game';
import {
  BADGE_DEFS,
  ROSTER_STORAGE_KEY,
  WORLD_MAP,
  createDefaultRosterStore,
  createStudentProfile,
  evaluateStudentBadges,
  loadRosterStore,
} from './utils/mathGenerator';
import { TopBar } from './components/TopBar';
import { HomeView } from './components/HomeView';
import { LessonsView } from './components/LessonsView';
import { WorldsView } from './components/WorldsView';
import { BoardGameView } from './components/BoardGameView';
import { ProgressView } from './components/ProgressView';
import { TeacherView } from './components/TeacherView';
import { HelpModal } from './components/HelpModal';
import { StudentSwitcherModal } from './components/StudentSwitcherModal';

export default function App() {
  const [roster, setRoster] = useState<RosterStore>(() => loadRosterStore());
  const [activeView, setActiveView] = useState<ViewId>('home');
  const [initialLessonStage, setInitialLessonStage] = useState<LessonStageId>('materi-1');
  const [currentWorldId, setCurrentWorldId] = useState<WorldId>(1);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist roster store to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
    } catch {
      // Ignore storage quota issues
    }
  }, [roster]);

  // Auto-dismiss notification toast
  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 4200);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  const activeStudent: StudentProfile = useMemo(() => {
    return (
      roster.students.find((s) => s.id === roster.activeStudentId) ?? roster.students[0]
    );
  }, [roster.activeStudentId, roster.students]);

  const updateActiveStudent = useCallback(
    (
      updater: (student: StudentProfile) => StudentProfile,
      extraStoreUpdate?: (prev: RosterStore, updatedStudent: StudentProfile) => Partial<RosterStore>
    ) => {
      setRoster((prev) => {
        const current =
          prev.students.find((s) => s.id === prev.activeStudentId) ?? prev.students[0];
        if (!current) return prev;

        const draft = updater(current);
        const nextBadges = evaluateStudentBadges(draft);

        const newlyEarned = (Object.keys(nextBadges) as BadgeId[]).find(
          (key) => nextBadges[key] && !current.badges[key]
        );
        if (newlyEarned) {
          const def = BADGE_DEFS.find((b) => b.id === newlyEarned);
          if (def) {
            setToastMessage(`Lencana Baru (${draft.name}): ${def.title}`);
          }
        }

        const finalizedStudent: StudentProfile = {
          ...draft,
          lastPlayedAt: new Date().toISOString(),
          badges: nextBadges,
        };

        const nextStudents = prev.students.map((s) =>
          s.id === current.id ? finalizedStudent : s
        );

        const extra = extraStoreUpdate ? extraStoreUpdate(prev, finalizedStudent) : {};

        return {
          ...prev,
          ...extra,
          students: nextStudents,
        };
      });
    },
    []
  );

  const handleNavigate = useCallback((view: ViewId) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenLessonStage = useCallback((stage: LessonStageId) => {
    setInitialLessonStage(stage);
    setActiveView('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartWorld = useCallback((worldId: WorldId) => {
    setCurrentWorldId(worldId);
    setActiveView('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleSound = useCallback(() => {
    setRoster((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const handleSelectStudent = useCallback((studentId: string) => {
    setRoster((prev) => {
      const target = prev.students.find((s) => s.id === studentId);
      if (target) {
        setToastMessage(`Siswa aktif: ${target.name} (${target.className})`);
      }
      return {
        ...prev,
        activeStudentId: studentId,
      };
    });
  }, []);

  const handleAddStudent = useCallback(
    (params: {
      name: string;
      className: string;
      absentNumber: string;
      avatarColor: AvatarColorId;
    }) => {
      const created = createStudentProfile(params);
      setRoster((prev) => ({
        ...prev,
        activeStudentId: created.id,
        students: [created, ...prev.students],
      }));
      setToastMessage(`Selamat datang, ${created.name}! Yuk mulai belajar bersama.`);
      return created;
    },
    []
  );

  const handleAddStudentAndPlay = useCallback(
    (params: {
      name: string;
      className: string;
      absentNumber: string;
      avatarColor: AvatarColorId;
    }) => {
      handleAddStudent(params);
      setInitialLessonStage('materi-1');
      setActiveView('lessons');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleAddStudent]
  );

  const handleDeleteStudent = useCallback((studentId: string) => {
    setRoster((prev) => {
      if (prev.students.length <= 1) return prev;
      const remaining = prev.students.filter((s) => s.id !== studentId);
      const nextActiveId =
        prev.activeStudentId === studentId ? remaining[0].id : prev.activeStudentId;
      return {
        ...prev,
        activeStudentId: nextActiveId,
        students: remaining,
        sessionHistory: prev.sessionHistory.filter((sess) => sess.studentId !== studentId),
        answerHistory: prev.answerHistory.filter((ans) => ans.studentId !== studentId),
      };
    });
  }, []);

  const handleMarkStageComplete = useCallback(
    (stage: LessonStageId) => {
      updateActiveStudent((stu) => {
        if (stu.completedLessonStages.includes(stage)) return stu;
        return {
          ...stu,
          completedLessonStages: [...stu.completedLessonStages, stage],
        };
      });
    },
    [updateActiveStudent]
  );

  const handleSubmitPracticeQuiz = useCallback(
    (params: {
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
    }) => {
      const nowIso = new Date().toISOString();
      updateActiveStudent(
        (stu) => {
          const nextWorldStats = { ...stu.worldStats };
          for (const item of params.answersLog) {
            const prevW = nextWorldStats[item.worldId];
            nextWorldStats[item.worldId] = {
              ...prevW,
              answered: prevW.answered + 1,
              correct: item.isCorrect ? prevW.correct + 1 : prevW.correct,
              wrong: item.isCorrect ? prevW.wrong : prevW.wrong + 1,
            };
          }

          const nextStages = stu.completedLessonStages.includes('latihan')
            ? stu.completedLessonStages
            : [...stu.completedLessonStages, 'latihan' as LessonStageId];

          const nextBest =
            stu.practiceQuizBestScore === null
              ? params.scorePct
              : Math.max(stu.practiceQuizBestScore, params.scorePct);

          return {
            ...stu,
            stars: stu.stars + params.correctCount,
            totalAnswers: stu.totalAnswers + params.totalCount,
            totalCorrect: stu.totalCorrect + params.correctCount,
            completedLessonStages: nextStages,
            practiceQuizBestScore: nextBest,
            worldStats: nextWorldStats,
          };
        },
        (prevStore, updatedStu) => {
          const newAnswerItems: AnswerHistoryItem[] = params.answersLog.map((ans, idx) => ({
            id: `quiz-ans-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            studentId: updatedStu.id,
            studentName: updatedStu.name,
            className: updatedStu.className,
            timestamp: nowIso,
            worldId: ans.worldId,
            worldName: 'Latihan Materi Fase B',
            category: ans.category,
            question: ans.question,
            chosenAnswer: ans.chosenAnswer,
            correctAnswer: ans.correctAnswer,
            explanation: ans.explanation,
            isCorrect: ans.isCorrect,
          }));

          const quizSession: PlaySessionRecord = {
            id: `quiz-sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            studentId: updatedStu.id,
            studentName: updatedStu.name,
            className: updatedStu.className,
            worldId: 1,
            worldName: 'Latihan Materi (8 Soal)',
            startedAt: nowIso,
            endedAt: nowIso,
            finalTile: 24,
            completed: true,
            diceRolls: 0,
            questionsAnswered: params.totalCount,
            correctCount: params.correctCount,
            wrongCount: params.totalCount - params.correctCount,
            starsEarned: params.correctCount,
          };

          return {
            answerHistory: [...newAnswerItems, ...prevStore.answerHistory].slice(0, 300),
            sessionHistory: [quizSession, ...prevStore.sessionHistory].slice(0, 150),
          };
        }
      );

      setToastMessage(
        `Latihan disimpan! Nilai ${activeStudent.name}: ${params.scorePct}/100 (+${params.correctCount} Bintang)`
      );
    },
    [activeStudent.name, updateActiveStudent]
  );

  const handleRecordAnswer = useCallback(
    (params: {
      worldId: WorldId;
      category: string;
      question: string;
      chosenAnswer: number;
      correctAnswer: number;
      explanation: string;
      isCorrect: boolean;
    }) => {
      updateActiveStudent(
        (stu) => {
          const prevW = stu.worldStats[params.worldId];
          return {
            ...stu,
            stars: params.isCorrect ? stu.stars + 1 : stu.stars,
            totalAnswers: stu.totalAnswers + 1,
            totalCorrect: params.isCorrect ? stu.totalCorrect + 1 : stu.totalCorrect,
            worldStats: {
              ...stu.worldStats,
              [params.worldId]: {
                ...prevW,
                answered: prevW.answered + 1,
                correct: params.isCorrect ? prevW.correct + 1 : prevW.correct,
                wrong: params.isCorrect ? prevW.wrong : prevW.wrong + 1,
              },
            },
          };
        },
        (prevStore, updatedStu) => {
          const historyItem: AnswerHistoryItem = {
            id: `ans-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            studentId: updatedStu.id,
            studentName: updatedStu.name,
            className: updatedStu.className,
            timestamp: new Date().toISOString(),
            worldId: params.worldId,
            worldName: WORLD_MAP[params.worldId].name,
            category: params.category,
            question: params.question,
            chosenAnswer: params.chosenAnswer,
            correctAnswer: params.correctAnswer,
            explanation: params.explanation,
            isCorrect: params.isCorrect,
          };
          return {
            answerHistory: [historyItem, ...prevStore.answerHistory].slice(0, 300),
          };
        }
      );
    },
    [updateActiveStudent]
  );

  const handleAwardBonusStars = useCallback(
    (amount: number) => {
      updateActiveStudent((stu) => ({
        ...stu,
        stars: stu.stars + amount,
      }));
    },
    [updateActiveStudent]
  );

  const handleCompleteWorld = useCallback(
    (worldId: WorldId, bonusStars: number) => {
      updateActiveStudent((stu) => {
        const completedWorlds = stu.completedWorlds.includes(worldId)
          ? stu.completedWorlds
          : [...stu.completedWorlds, worldId];
        const nextUnlocked =
          stu.unlockedWorld === worldId && worldId < 4
            ? ((worldId + 1) as WorldId)
            : stu.unlockedWorld;
        return {
          ...stu,
          stars: stu.stars + bonusStars,
          completedWorlds,
          unlockedWorld: nextUnlocked,
        };
      });
    },
    [updateActiveStudent]
  );

  const handleSaveSession = useCallback(
    (session: Omit<PlaySessionRecord, 'id' | 'studentId' | 'studentName' | 'className'>) => {
      setRoster((prev) => {
        const current =
          prev.students.find((s) => s.id === prev.activeStudentId) ?? prev.students[0];
        if (!current) return prev;

        const record: PlaySessionRecord = {
          ...session,
          id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          studentId: current.id,
          studentName: current.name,
          className: current.className,
        };

        return {
          ...prev,
          sessionHistory: [record, ...prevStoreSessionsSafe(prev.sessionHistory)].slice(0, 150),
        };
      });
    },
    []
  );

  const handleResetAllData = useCallback(() => {
    try {
      window.localStorage.removeItem(ROSTER_STORAGE_KEY);
      window.localStorage.removeItem('MATH_ADVENTURE_V2');
    } catch {
      // Ignore
    }
    setRoster(createDefaultRosterStore());
  }, []);

  const handleUnlockAllWorldsForActive = useCallback(() => {
    updateActiveStudent((stu) => ({
      ...stu,
      unlockedWorld: 4,
    }));
  }, [updateActiveStudent]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar activeView={activeView} onNavigate={handleNavigate} />

      {/* Toast Notification for Badge Unlocks, Quiz Scores & Student Switches */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 bg-white border border-amber-300 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-modal-enter max-w-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold text-slate-900">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8 sm:py-10">
        {activeView === 'home' && (
          <HomeView
            activeStudent={activeStudent}
            students={roster.students}
            recentSessions={roster.sessionHistory}
            soundEnabled={roster.soundEnabled}
            onNavigate={handleNavigate}
            onOpenLessonStage={handleOpenLessonStage}
            onStartWorld={handleStartWorld}
            onOpenHelp={() => setHelpOpen(true)}
            onOpenStudentModal={() => setStudentModalOpen(true)}
            onSelectStudent={handleSelectStudent}
            onAddStudentAndPlay={handleAddStudentAndPlay}
            onToggleSound={handleToggleSound}
          />
        )}

        {activeView === 'lessons' && (
          <LessonsView
            student={activeStudent}
            initialStage={initialLessonStage}
            soundEnabled={roster.soundEnabled}
            onNavigate={handleNavigate}
            onMarkStageComplete={handleMarkStageComplete}
            onSubmitPracticeQuiz={handleSubmitPracticeQuiz}
          />
        )}

        {activeView === 'worlds' && (
          <WorldsView
            student={activeStudent}
            onNavigate={handleNavigate}
            onStartWorld={handleStartWorld}
            onOpenStudentModal={() => setStudentModalOpen(true)}
          />
        )}

        {activeView === 'game' && (
          <BoardGameView
            student={activeStudent}
            worldId={currentWorldId}
            soundEnabled={roster.soundEnabled}
            onToggleSound={handleToggleSound}
            onRecordAnswer={handleRecordAnswer}
            onAwardBonusStars={handleAwardBonusStars}
            onCompleteWorld={handleCompleteWorld}
            onSaveSession={handleSaveSession}
            onExitToWorlds={() => handleNavigate('worlds')}
            onStartNextWorld={handleStartWorld}
          />
        )}

        {activeView === 'progress' && (
          <ProgressView
            activeStudent={activeStudent}
            students={roster.students}
            sessionHistory={roster.sessionHistory}
            answerHistory={roster.answerHistory}
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
            onOpenStudentModal={() => setStudentModalOpen(true)}
          />
        )}

        {activeView === 'teacher' && (
          <TeacherView
            activeStudent={activeStudent}
            students={roster.students}
            sessionHistory={roster.sessionHistory}
            answerHistory={roster.answerHistory}
            onNavigate={handleNavigate}
            onSelectStudent={handleSelectStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenStudentModal={() => setStudentModalOpen(true)}
            onResetAllData={handleResetAllData}
            onUnlockAllWorldsForActive={handleUnlockAllWorldsForActive}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Math Adventure · Media Pembelajaran Matematika Kelas 3 SD (Fase B: Perkalian &amp;
            Pembagian)
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setStudentModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Daftar Nama Siswa
            </button>
            <button
              type="button"
              onClick={() => handleOpenLessonStage('materi-1')}
              className="hover:text-slate-900 transition-colors"
            >
              Materi Fase B
            </button>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Panduan Bermain
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('progress')}
              className="hover:text-slate-900 transition-colors"
            >
              Riwayat &amp; Progres
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('teacher')}
              className="hover:text-slate-900 transition-colors"
            >
              Evaluasi Guru
            </button>
          </div>
        </div>
      </footer>

      <StudentSwitcherModal
        open={studentModalOpen}
        students={roster.students}
        activeStudentId={activeStudent.id}
        onSelectStudent={handleSelectStudent}
        onAddStudent={handleAddStudent}
        onClose={() => setStudentModalOpen(false)}
      />

      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onStartAdventure={() => handleNavigate('worlds')}
      />
    </div>
  );
}

function prevStoreSessionsSafe(list: PlaySessionRecord[] | undefined): PlaySessionRecord[] {
  return Array.isArray(list) ? list : [];
}

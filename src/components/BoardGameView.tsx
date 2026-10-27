import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  Flag,
  Gift,
  HelpCircle,
  RotateCcw,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { MathQuestion, PlaySessionRecord, StudentProfile, TileType, WorldId } from '../types/game';
import { BOARD_TILES_META, WORLD_MAP, generateMathQuestion } from '../utils/mathGenerator';
import { WORLD_ILLUSTRATIONS } from '../utils/worldAssets';
import { playSound } from '../utils/sound';
import { DiceSvg, KikoPawnSvg, VisualItemToken } from './MascotIllustrations';
import { StorybookIllustration } from './StorybookIllustration';

interface BoardGameViewProps {
  student: StudentProfile;
  worldId: WorldId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRecordAnswer: (params: {
    worldId: WorldId;
    category: string;
    question: string;
    chosenAnswer: number;
    correctAnswer: number;
    explanation: string;
    isCorrect: boolean;
  }) => void;
  onAwardBonusStars: (amount: number) => void;
  onCompleteWorld: (worldId: WorldId, bonusStars: number) => void;
  onSaveSession: (session: Omit<PlaySessionRecord, 'id' | 'studentId' | 'studentName' | 'className'>) => void;
  onExitToWorlds: () => void;
  onStartNextWorld: (nextWorldId: WorldId) => void;
}

export const BoardGameView: React.FC<BoardGameViewProps> = ({
  student,
  worldId,
  soundEnabled,
  onToggleSound,
  onRecordAnswer,
  onAwardBonusStars,
  onCompleteWorld,
  onSaveSession,
  onExitToWorlds,
  onStartNextWorld,
}) => {
  const world = WORLD_MAP[worldId];
  const worldArt = WORLD_ILLUSTRATIONS[worldId];

  const [playerPosition, setPlayerPosition] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [diceEnabled, setDiceEnabled] = useState<boolean>(true);
  const [sessionStars, setSessionStars] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Tekan tombol Lempar Dadu untuk memulai perjalanan Kiko!'
  );

  // Session counters for history log
  const sessionStartRef = useRef<string>(new Date().toISOString());
  const sessionSavedRef = useRef<boolean>(false);
  const [diceRollsCount, setDiceRollsCount] = useState<number>(0);
  const [sessionAnswered, setSessionAnswered] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionWrong, setSessionWrong] = useState<number>(0);

  // Quiz Modal state
  const [activeQuestion, setActiveQuestion] = useState<MathQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Victory & Exit Confirmation Modals
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  // Reset board session whenever worldId changes
  useEffect(() => {
    clearAllTimers();
    sessionStartRef.current = new Date().toISOString();
    sessionSavedRef.current = false;
    setPlayerPosition(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setDiceEnabled(true);
    setSessionStars(0);
    setStreakCount(0);
    setDiceRollsCount(0);
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionWrong(0);
    setActiveQuestion(null);
    setSelectedOption(null);
    setShowVictoryModal(false);
    setShowExitConfirm(false);
    setStatusMessage(`Selamat datang di ${world.name}, ${student.name}! Ayo lempar dadu.`);

    return () => {
      clearAllTimers();
    };
  }, [worldId, world.name, student.name, clearAllTimers]);

  const commitSessionHistory = useCallback(
    (completed: boolean, finalTile: number, totalStarsInSession: number) => {
      if (sessionSavedRef.current) return;
      if (!completed && diceRollsCount === 0 && sessionAnswered === 0) return;

      sessionSavedRef.current = true;
      onSaveSession({
        worldId,
        worldName: world.name,
        startedAt: sessionStartRef.current,
        endedAt: new Date().toISOString(),
        finalTile,
        completed,
        diceRolls: diceRollsCount,
        questionsAnswered: sessionAnswered,
        correctCount: sessionCorrect,
        wrongCount: sessionWrong,
        starsEarned: totalStarsInSession,
      });
    },
    [
      diceRollsCount,
      onSaveSession,
      sessionAnswered,
      sessionCorrect,
      sessionWrong,
      world.name,
      worldId,
    ]
  );

  const triggerVictory = useCallback(
    (currentStars: number) => {
      const victoryBonus = 5;
      const finalStars = currentStars + victoryBonus;
      playSound('victory', soundEnabled);
      setSessionStars(finalStars);
      onCompleteWorld(worldId, victoryBonus);
      commitSessionHistory(true, 24, finalStars);
      setShowVictoryModal(true);
      setStatusMessage(`Luar biasa! ${student.name} berhasil menaklukkan ${world.name}!`);
    },
    [commitSessionHistory, onCompleteWorld, soundEnabled, student.name, world.name, worldId]
  );

  const evaluateLandingTile = useCallback(
    (landedIndex: number, currentStars: number) => {
      if (landedIndex >= 24) {
        scheduleTimeout(() => {
          triggerVictory(currentStars);
        }, 260);
        return;
      }

      const tileType = BOARD_TILES_META[landedIndex];

      if (tileType === 'challenge') {
        setStatusMessage('Petak Tantangan! Pecahkan soal matematika berikut.');
        scheduleTimeout(() => {
          const q = generateMathQuestion(worldId);
          setActiveQuestion(q);
          setSelectedOption(null);
        }, 260);
      } else if (tileType === 'star') {
        playSound('correct', soundEnabled);
        setSessionStars((s) => s + 2);
        onAwardBonusStars(2);
        setStatusMessage('Petak Bintang! Kamu langsung mendapat +2 Bintang bonus.');
        setDiceEnabled(true);
      } else if (tileType === 'mystery') {
        playSound('mystery', soundEnabled);
        const moveAhead = Math.random() < 0.5 && landedIndex < 22;
        if (moveAhead) {
          const boostedPos = landedIndex + 2;
          setPlayerPosition(boostedPos);
          setStatusMessage('Kotak Kejutan: Angin kencang membantumu melaju +2 petak!');
        } else {
          setSessionStars((s) => s + 3);
          onAwardBonusStars(3);
          setStatusMessage('Kotak Kejutan: Kamu menemukan peti berisi +3 Bintang!');
        }
        setDiceEnabled(true);
      } else {
        setDiceEnabled(true);
      }
    },
    [onAwardBonusStars, scheduleTimeout, soundEnabled, triggerVictory, worldId]
  );

  const handleRollDice = useCallback(() => {
    if (!diceEnabled || isRolling || isMoving || playerPosition >= 24 || activeQuestion) return;

    setDiceEnabled(false);
    setIsRolling(true);
    setDiceRollsCount((c) => c + 1);
    playSound('dice', soundEnabled);
    setStatusMessage('Mengocok dadu...');

    scheduleTimeout(() => {
      setIsRolling(false);
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setStatusMessage(`Dadu angka ${rolled}! Kiko melangkah ${rolled} petak.`);
      setIsMoving(true);

      let currentPos = playerPosition;
      let stepsLeft = rolled;

      const stepOnce = () => {
        if (stepsLeft > 0 && currentPos < 24) {
          currentPos += 1;
          stepsLeft -= 1;
          setPlayerPosition(currentPos);
          playSound('step', soundEnabled);
          scheduleTimeout(stepOnce, 210);
        } else {
          setIsMoving(false);
          evaluateLandingTile(currentPos, sessionStars);
        }
      };

      scheduleTimeout(stepOnce, 170);
    }, 400);
  }, [
    activeQuestion,
    diceEnabled,
    evaluateLandingTile,
    isMoving,
    isRolling,
    playerPosition,
    scheduleTimeout,
    sessionStars,
    soundEnabled,
  ]);

  const handleSelectQuizOption = useCallback(
    (option: number) => {
      if (!activeQuestion || selectedOption !== null) return;
      setSelectedOption(option);

      const isCorrect = option === activeQuestion.answer;
      setSessionAnswered((c) => c + 1);

      if (isCorrect) {
        playSound('correct', soundEnabled);
        setSessionStars((s) => s + 1);
        setSessionCorrect((c) => c + 1);
        setStreakCount((s) => s + 1);
      } else {
        playSound('wrong', soundEnabled);
        setSessionWrong((c) => c + 1);
        setStreakCount(0);
      }

      const fullQuestionLabel = activeQuestion.equationDisplay
        ? `${activeQuestion.qText} [${activeQuestion.equationDisplay}]`
        : activeQuestion.qText;

      onRecordAnswer({
        worldId,
        category: activeQuestion.category,
        question: fullQuestionLabel,
        chosenAnswer: option,
        correctAnswer: activeQuestion.answer,
        explanation: activeQuestion.explain,
        isCorrect,
      });
    },
    [activeQuestion, onRecordAnswer, selectedOption, soundEnabled, worldId]
  );

  const handleCloseQuiz = useCallback(() => {
    setActiveQuestion(null);
    setSelectedOption(null);
    setDiceEnabled(true);
    setStatusMessage('Bagus! Lempar dadu lagi untuk melanjutkan petualangan.');
  }, []);

  const handleRestartSameWorld = () => {
    clearAllTimers();
    sessionStartRef.current = new Date().toISOString();
    sessionSavedRef.current = false;
    setPlayerPosition(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setDiceEnabled(true);
    setSessionStars(0);
    setStreakCount(0);
    setDiceRollsCount(0);
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionWrong(0);
    setShowVictoryModal(false);
    setStatusMessage(`Memulai ulang ${world.name}. Ayo lempar dadu!`);
  };

  const handleConfirmExit = () => {
    commitSessionHistory(false, playerPosition, sessionStars);
    onExitToWorlds();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showVictoryModal || showExitConfirm) return;

      if (activeQuestion) {
        if (selectedOption === null && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = Number(e.key) - 1;
          if (activeQuestion.options[idx] !== undefined) {
            e.preventDefault();
            handleSelectQuizOption(activeQuestion.options[idx]);
          }
        } else if (selectedOption !== null && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCloseQuiz();
        }
        return;
      }

      if (e.key === ' ' && diceEnabled && !isRolling && !isMoving) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'BUTTON' && tag !== 'INPUT') {
          e.preventDefault();
          handleRollDice();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeQuestion,
    diceEnabled,
    handleCloseQuiz,
    handleRollDice,
    handleSelectQuizOption,
    isMoving,
    isRolling,
    selectedOption,
    showExitConfirm,
    showVictoryModal,
  ]);

  const progressPct = Math.round((playerPosition / 24) * 100);

  // Build 5x5 serpentine cells
  const gridCells: Array<{ tileIndex: number; tileType: TileType; directionHint: string }> = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const tileIndex = row % 2 === 0 ? row * 5 + col : row * 5 + (4 - col);
      let directionHint = '';
      if (tileIndex < 24) {
        if (tileIndex % 5 === 4) {
          directionHint = '↓';
        } else if (row % 2 === 0) {
          directionHint = '→';
        } else {
          directionHint = '←';
        }
      }
      gridCells.push({
        tileIndex,
        tileType: BOARD_TILES_META[tileIndex],
        directionHint,
      });
    }
  }

  const getTileStyle = (tileType: TileType, isVisited: boolean, isCurrent: boolean) => {
    const ring = isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : '';
    switch (tileType) {
      case 'start':
        return `bg-emerald-100 border-emerald-400 border-b-4 text-emerald-950 ${ring}`;
      case 'finish':
        return `bg-amber-100 border-amber-400 border-b-4 text-amber-950 ${ring}`;
      case 'star':
        return `bg-amber-50 border-amber-300 border-b-4 text-amber-900 ${ring}`;
      case 'mystery':
        return `bg-indigo-50 border-indigo-300 border-b-4 text-indigo-900 ${ring}`;
      default:
        return `${
          isVisited
            ? 'bg-blue-50 border-blue-300 border-b-4 text-blue-950'
            : 'bg-white border-slate-200 border-b-4 text-slate-800'
        } ${ring}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenic Illustrated World Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 sm:h-40">
        <StorybookIllustration
          src={worldArt.src}
          alt={worldArt.alt}
          fallbackGradient={worldArt.fallbackGradient}
          worldId={worldId}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/55 to-slate-950/40 px-5 py-4 flex flex-wrap items-center justify-between gap-4 text-white">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                if (playerPosition > 0 && playerPosition < 24) {
                  setShowExitConfirm(true);
                } else {
                  onExitToWorlds();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Peta Dunia</span>
            </button>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              Dunia {worldId}: {world.name}
            </h1>
            <p className="text-xs text-slate-200">
              Pemain: <strong>{student.name}</strong> ({student.className}) · {world.topic}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm tabular-nums">
            <div className="text-right">
              <p className="text-xs text-slate-300">Bintang Sesi Ini</p>
              <p className="font-display font-bold text-amber-300 text-base">
                +{sessionStars} (Total: {student.stars})
              </p>
            </div>

            {streakCount >= 2 && (
              <div className="inline-flex items-center gap-1 text-amber-300 font-bold">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{streakCount}× Beruntun!</span>
              </div>
            )}

            <button
              type="button"
              onClick={onToggleSound}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-xs transition-colors whitespace-nowrap"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Suara</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Senyap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone (65%): Tactile 5x5 Serpentine Board */}
        <div
          className={`lg:col-span-8 ${world.boardSurfaceBg} border-2 ${world.boardBorderColor} rounded-3xl p-3 sm:p-5`}
        >
          <div
            className="grid grid-cols-5 gap-2 sm:gap-3"
            role="grid"
            aria-label="Papan Permainan 25 Petak"
          >
            {gridCells.map(({ tileIndex, tileType, directionHint }) => {
              const isCurrent = playerPosition === tileIndex;
              const isVisited = tileIndex < playerPosition;

              return (
                <div
                  key={tileIndex}
                  role="gridcell"
                  aria-label={`Petak ${tileIndex} (${tileType})${
                    isCurrent ? ', Posisi Kiko saat ini' : ''
                  }`}
                  className={`aspect-square rounded-xl sm:rounded-2xl border p-1.5 sm:p-2.5 flex flex-col items-center justify-between relative select-none transition-transform duration-150 ${getTileStyle(
                    tileType,
                    isVisited,
                    isCurrent
                  )}`}
                >
                  <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold opacity-75 tabular-nums">
                    <span>{tileType === 'start' ? '00' : tileIndex}</span>
                    <span aria-hidden="true">{directionHint}</span>
                  </div>

                  <div className="my-auto flex items-center justify-center">
                    {tileType === 'start' && (
                      <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                    )}
                    {tileType === 'finish' && (
                      <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" />
                    )}
                    {tileType === 'star' && (
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-400" />
                    )}
                    {tileType === 'mystery' && (
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    )}
                    {tileType === 'challenge' && (
                      <HelpCircle
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          isVisited ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      />
                    )}
                  </div>

                  <span className="text-[10px] sm:text-xs font-semibold tracking-tight truncate max-w-full">
                    {tileType === 'start'
                      ? 'Mulai'
                      : tileType === 'finish'
                      ? 'Finish'
                      : tileType === 'star'
                      ? '+2 Bintang'
                      : tileType === 'mystery'
                      ? 'Kejutan'
                      : 'Soal'}
                  </span>

                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="animate-bounce-pawn drop-shadow-md">
                        <KikoPawnSvg className="w-10 h-10 sm:w-12 sm:h-12" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Zone (35%): Dice & Mission Control Deck */}
        <div className="lg:col-span-4 space-y-5">
          {/* Dice Control Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-blue-600">Kontrol Dadu</p>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Giliran {student.name}
                </h2>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">
                {diceRollsCount} lemparan
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col items-center text-center">
              <DiceSvg value={diceValue} rolling={isRolling} className="w-20 h-20 mb-3" />
              <p className="text-sm font-medium text-slate-700 leading-snug min-h-[2.5rem] flex items-center justify-center">
                {statusMessage}
              </p>
            </div>

            <button
              type="button"
              disabled={!diceEnabled || isRolling || isMoving || playerPosition >= 24}
              onClick={handleRollDice}
              className="w-full py-3.5 px-5 text-base font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5 rounded-xl transition-all duration-150 whitespace-nowrap"
            >
              {isRolling ? 'Mengocok Dadu...' : isMoving ? 'Kiko Melangkah...' : 'Lempar Dadu'}
            </button>

            <p className="text-xs text-center text-slate-400">
              Tekan tombol <kbd className="font-mono font-semibold">Spasi</kbd> di papan ketik untuk
              melempar dadu.
            </p>
          </div>

          {/* Journey Progress & Session Score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900 tabular-nums">
              <span>Perjalanan Menuju Finish</span>
              <span>{progressPct}%</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full w-full bg-emerald-500 origin-left transition-transform duration-200"
                style={{ transform: `scaleX(${progressPct / 100})` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums pt-1">
              <span>
                Petak: <strong className="text-slate-800">{playerPosition} / 24</strong>
              </span>
              <span>
                Benar: <strong className="text-emerald-700">{sessionCorrect}</strong> · Salah:{' '}
                <strong className="text-red-600">{sessionWrong}</strong>
              </span>
            </div>
          </div>

          {/* Clean Tile Legend */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900">Arti Petak Papan</h3>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Soal Variatif (+1)</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                <span>Bonus +2 Bintang</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kotak Kejutan</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Finish (+5 Bintang)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VARIED QUIZ CHALLENGE MODAL */}
      {activeQuestion && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-modal-heading"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl animate-modal-enter space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span className="font-semibold text-blue-700">{activeQuestion.category}</span>
              <span>
                {world.name} · Petak {playerPosition}
              </span>
            </div>

            {/* Visual Item Grouping Aid (when applicable) */}
            {activeQuestion.visualGroupCount && activeQuestion.visualPerGroup && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: Math.min(activeQuestion.visualGroupCount, 5) }).map(
                    (_, gIdx) => (
                      <div
                        key={gIdx}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 flex flex-wrap items-center justify-center gap-1 max-w-[92px]"
                      >
                        {Array.from({ length: Math.min(activeQuestion.visualPerGroup!, 6) }).map(
                          (__, iIdx) => (
                            <VisualItemToken
                              key={iIdx}
                              kind={activeQuestion.visualKind}
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                          )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <h3
              id="quiz-modal-heading"
              className="font-display text-base sm:text-lg font-bold text-slate-900 text-center leading-relaxed text-balance"
            >
              {activeQuestion.qText}
            </h3>

            {/* Highlighted Math Expression Box (for missing numbers, skip counting, mixed ops) */}
            {activeQuestion.equationDisplay && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl py-3.5 px-4 text-center">
                <p className="font-mono text-xl sm:text-2xl font-bold text-blue-950 tracking-wide tabular-nums">
                  {activeQuestion.equationDisplay}
                </p>
              </div>
            )}

            {/* 4 Multiple Choice Options */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {activeQuestion.options.map((opt, idx) => {
                const isChosen = selectedOption === opt;
                const isAnswer = opt === activeQuestion.answer;

                let btnStyle =
                  'bg-slate-50 border-slate-200 border-b-4 text-slate-900 hover:bg-blue-50 hover:border-blue-400';
                if (selectedOption !== null) {
                  if (isAnswer) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 border-b-4 text-emerald-900';
                  } else if (isChosen && !isAnswer) {
                    btnStyle = 'bg-red-50 border-red-400 border-b-4 text-red-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-65';
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectQuizOption(opt)}
                    className={`py-3.5 px-4 border-2 rounded-xl font-mono text-lg font-bold tabular-nums transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="text-xs font-sans font-medium text-slate-400">
                      {idx + 1}.
                    </span>
                    <span>{opt}</span>
                    <span className="w-4">
                      {selectedOption !== null && isAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {selectedOption !== null && isChosen && !isAnswer && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pedagogical Explanation */}
            {selectedOption !== null && (
              <div
                className={`rounded-xl p-4 border text-sm leading-relaxed ${
                  selectedOption === activeQuestion.answer
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {selectedOption === activeQuestion.answer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Hebat, {student.name}! Jawabanmu Benar (+1 Bintang)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>
                        Mari Pelajari: Kunci jawaban yang tepat adalah {activeQuestion.answer}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm opacity-90">{activeQuestion.explain}</p>
              </div>
            )}

            {selectedOption !== null && (
              <button
                type="button"
                onClick={handleCloseQuiz}
                className="w-full py-3 px-5 text-sm font-bold text-white bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-700 rounded-xl transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Lanjut Melangkah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {showVictoryModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-modal-heading"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-7 text-center shadow-xl animate-modal-enter space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Trophy className="w-9 h-9" />
            </div>

            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1">
                Riwayat Sesi Tersimpan Otomatis
              </p>
              <h2 id="victory-modal-heading" className="font-display text-2xl font-bold text-slate-900">
                Selamat, {student.name}!
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Kamu telah menuntaskan <strong>{world.name}</strong> dengan{' '}
                <strong className="tabular-nums">{sessionCorrect} jawaban benar</strong> dan meraih
                total <strong className="tabular-nums text-amber-700">+{sessionStars} bintang</strong>!
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              {worldId < 4 ? (
                <button
                  type="button"
                  onClick={() => onStartNextWorld((worldId + 1) as WorldId)}
                  className="w-full py-3 px-5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 rounded-xl transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Lanjut ke Dunia {worldId + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExitToWorlds}
                  className="w-full py-3 px-5 text-sm font-bold text-amber-950 bg-amber-400 border-b-4 border-amber-600 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap"
                >
                  Kembali ke Peta Kejuaraan
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleRestartSameWorld}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Main Lagi</span>
                </button>
                <button
                  type="button"
                  onClick={onExitToWorlds}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                >
                  Pilih Dunia Lain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXIT CONFIRMATION MODAL */}
      {showExitConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-confirm-heading"
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-xl animate-modal-enter space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="exit-confirm-heading" className="font-display text-lg font-bold text-slate-900">
              Keluar &amp; Simpan Riwayat Sesi?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Perjalanan <strong>{student.name}</strong> hingga petak {playerPosition} beserta
              bintang yang didapat akan dicatat ke dalam buku riwayat permainan.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Lanjut Main
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Simpan &amp; Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

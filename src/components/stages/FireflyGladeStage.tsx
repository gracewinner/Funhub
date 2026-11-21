import { useCallback, useEffect, useRef, useState } from 'react';
import { Flame, Flower2, Leaf, Sun, Volume2 } from 'lucide-react';
import { StageComponentProps } from '../../types/game';
import { soundEngine } from '../../utils/sound';

const BLOSSOMS = [
  {
    id: 0,
    label: 'Sun Blossom',
    keyHint: '1',
    bg: 'bg-amber-400',
    activeBg: 'bg-amber-200 ring-4 ring-white scale-105',
    text: 'text-emerald-950',
    icon: Sun,
  },
  {
    id: 1,
    label: 'Lagoon Lotus',
    keyHint: '2',
    bg: 'bg-teal-400',
    activeBg: 'bg-teal-200 ring-4 ring-white scale-105',
    text: 'text-emerald-950',
    icon: Flower2,
  },
  {
    id: 2,
    label: 'Coral Orchid',
    keyHint: '3',
    bg: 'bg-rose-400',
    activeBg: 'bg-rose-200 ring-4 ring-white scale-105',
    text: 'text-emerald-950',
    icon: Flame,
  },
  {
    id: 3,
    label: 'Emerald Fern',
    keyHint: '4',
    bg: 'bg-emerald-400',
    activeBg: 'bg-emerald-200 ring-4 ring-white scale-105',
    text: 'text-emerald-950',
    icon: Leaf,
  },
];

const TOTAL_ROUNDS = 4;

export function FireflyGladeStage({
  paused,
  onBuddyReact,
  onHeartsChange,
  onScoreChange,
  onGoalProgressChange,
  onWin,
  onLose,
}: StageComponentProps) {
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isShowing, setIsShowing] = useState(true);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [statusPrompt, setStatusPrompt] = useState(
    'Watch and listen to the glowing firefly melody!'
  );

  const timersRef = useRef<number[]>([]);
  const finishedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const playSequence = useCallback(
    (seq: number[]) => {
      clearTimers();
      setIsShowing(true);
      setPlayerStep(0);
      setStatusPrompt('Listen closely to the glowing blossoms...');

      seq.forEach((padId, idx) => {
        const startDelay = 550 + idx * 650;
        const t1 = window.setTimeout(() => {
          setActivePad(padId);
          soundEngine.playNote(padId);
        }, startDelay);
        const t2 = window.setTimeout(() => {
          setActivePad(null);
        }, startDelay + 380);
        timersRef.current.push(t1, t2);
      });

      const doneDelay = 550 + seq.length * 650 + 180;
      const tDone = window.setTimeout(() => {
        setIsShowing(false);
        setStatusPrompt('Your turn! Tap the blossoms in the same order.');
      }, doneDelay);
      timersRef.current.push(tDone);
    },
    [clearTimers]
  );

  const startRound = useCallback(
    (targetRound: number) => {
      const length = targetRound + 2; // 3, 4, 5, 6 notes
      const nextSeq = Array.from({ length }, () =>
        Math.floor(Math.random() * BLOSSOMS.length)
      );
      setRound(targetRound);
      setSequence(nextSeq);
      onGoalProgressChange(`Melody ${targetRound} / ${TOTAL_ROUNDS}`);
      playSequence(nextSeq);
    },
    [onGoalProgressChange, playSequence]
  );

  useEffect(() => {
    onHeartsChange(3);
    onScoreChange(0);
    onBuddyReact('happy', 'Follow the glowing blossom tunes to guide Pipkin!');
    startRound(1);
    return clearTimers;
  }, [clearTimers, onBuddyReact, onHeartsChange, onScoreChange, startRound]);

  const handlePadPress = useCallback(
    (padId: number) => {
      if (paused || isShowing || finishedRef.current) return;

      setActivePad(padId);
      const t = window.setTimeout(() => setActivePad(null), 220);
      timersRef.current.push(t);

      const expected = sequence[playerStep];
      if (padId === expected) {
        soundEngine.playNote(padId);
        const nextStep = playerStep + 1;
        const nextScore = score + 25;
        setScore(nextScore);
        onScoreChange(nextScore);

        if (nextStep >= sequence.length) {
          const roundBonus = 40;
          const updatedScore = nextScore + roundBonus;
          setScore(updatedScore);
          onScoreChange(updatedScore);

          if (round >= TOTAL_ROUNDS) {
            finishedRef.current = true;
            soundEngine.playVictory();
            onBuddyReact('celebrating', 'Pipkin found the lantern trail home!');
            const stars: 1 | 2 | 3 = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;
            const winTimer = window.setTimeout(() => {
              onWin({
                score: updatedScore,
                stars,
                summaryText: `You echoed all ${TOTAL_ROUNDS} firefly songs and guided Pipkin home!`,
              });
            }, 450);
            timersRef.current.push(winTimer);
          } else {
            soundEngine.playCombo();
            onBuddyReact(
              'combo',
              `Melody ${round} complete! Pipkin hopped closer!`
            );
            setIsShowing(true);
            setStatusPrompt('Awesome! Get ready for the next melody...');
            const nextTimer = window.setTimeout(() => {
              startRound(round + 1);
            }, 950);
            timersRef.current.push(nextTimer);
          }
        } else {
          setPlayerStep(nextStep);
          onBuddyReact('happy', 'Nice ear! Keep going!');
        }
      } else {
        soundEngine.playOops();
        const nextHearts = Math.max(0, hearts - 1);
        setHearts(nextHearts);
        onHeartsChange(nextHearts);

        if (nextHearts <= 0) {
          finishedRef.current = true;
          onBuddyReact('oops', 'Oh no, the fireflies scattered!');
          onLose(score, 'The firefly lantern melody got mixed up!');
        } else {
          onBuddyReact('oops', 'Oops! Watch the melody again—you got this!');
          setStatusPrompt('Not quite! Let us replay that melody for you.');
          setIsShowing(true);
          const replayTimer = window.setTimeout(() => {
            playSequence(sequence);
          }, 800);
          timersRef.current.push(replayTimer);
        }
      }
    },
    [
      hearts,
      isShowing,
      onBuddyReact,
      onHeartsChange,
      onLose,
      onScoreChange,
      onWin,
      paused,
      playSequence,
      playerStep,
      round,
      score,
      sequence,
      startRound,
    ]
  );

  // Keyboard 1-4 support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        handlePadPress(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePadPress]);

  return (
    <div className="w-full min-h-[460px] sm:min-h-[520px] rounded-3xl border border-emerald-800 bg-gradient-to-b from-[#123E35] to-[#0A251F] p-6 sm:p-8 flex flex-col justify-between text-white shadow-inner">
      {/* Top Lantern Trail Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-amber-300">
            Round {round} of {TOTAL_ROUNDS} · {sequence.length} Notes
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5">
            {statusPrompt}
          </h2>
        </div>

        <button
          type="button"
          disabled={isShowing || paused}
          onClick={() => playSequence(sequence)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-45 text-sm font-bold border border-emerald-600/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-300" aria-hidden="true" />
          <span>Hear Again</span>
        </button>
      </div>

      {/* Step dots showing progress within current melody */}
      <div className="my-5 flex items-center justify-center gap-2.5">
        {sequence.map((_, idx) => (
          <div
            key={idx}
            className={`w-4 h-4 rounded-full transition-all ${
              idx < playerStep
                ? 'bg-amber-400 scale-110'
                : idx === playerStep && !isShowing
                ? 'bg-white ring-4 ring-amber-300/40'
                : 'bg-emerald-800 border border-emerald-600/60'
            }`}
          />
        ))}
      </div>

      {/* 4 Interactive Glowing Jungle Blossoms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
        {BLOSSOMS.map((pad) => {
          const Icon = pad.icon;
          const lit = activePad === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              disabled={isShowing || paused}
              onClick={() => handlePadPress(pad.id)}
              className={`h-36 sm:h-44 rounded-3xl p-4 flex flex-col items-center justify-center gap-2.5 border-2 border-white/25 shadow-lg transition-all duration-150 cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                lit ? pad.activeBg : `${pad.bg} hover:brightness-105 active:scale-95`
              } ${pad.text}`}
            >
              <Icon className="w-10 h-10" aria-hidden="true" />
              <span className="text-sm font-extrabold whitespace-nowrap">
                {pad.label}
              </span>
              <span className="text-xs font-bold opacity-75">
                Key {pad.keyHint}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 text-center text-xs font-semibold text-emerald-200/75">
        Tip: Watch the glowing petals and count the chimes!
      </div>
    </div>
  );
}

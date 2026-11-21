import { useCallback, useEffect, useRef, useState } from 'react';
import { Award, Droplets, Flower2, Leaf, Sparkles, Sun } from 'lucide-react';
import { StageComponentProps } from '../../types/game';
import { soundEngine } from '../../utils/sound';
import { BuddyAvatar } from '../BuddyAvatar';

type PadSymbol = 'sun' | 'leaf' | 'flower' | 'sparkle';

interface LilyPad {
  id: number;
  symbol: PadSymbol;
  colorName: 'Amber' | 'Teal' | 'Coral' | 'Emerald';
  bgClass: string;
  hasAcorn: boolean;
  isCorrect: boolean;
}

interface RiverRow {
  clueText: string;
  clueSymbol: PadSymbol;
  clueColor: LilyPad['colorName'];
  pads: LilyPad[];
}

const SYMBOLS: Array<{ id: PadSymbol; label: string; icon: typeof Sun }> = [
  { id: 'sun', label: 'Sun', icon: Sun },
  { id: 'leaf', label: 'Leaf', icon: Leaf },
  { id: 'flower', label: 'Blossom', icon: Flower2 },
  { id: 'sparkle', label: 'Star', icon: Sparkles },
];

const COLORS: Array<{
  name: LilyPad['colorName'];
  bgClass: string;
}> = [
  { name: 'Amber', bgClass: 'bg-amber-400 text-emerald-950 border-amber-200' },
  { name: 'Teal', bgClass: 'bg-teal-400 text-emerald-950 border-teal-200' },
  { name: 'Coral', bgClass: 'bg-rose-400 text-emerald-950 border-rose-200' },
  {
    name: 'Emerald',
    bgClass: 'bg-emerald-400 text-emerald-950 border-emerald-200',
  },
];

const TOTAL_CROSSINGS = 6;

function buildRow(): RiverRow {
  const targetSym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const targetCol = COLORS[Math.floor(Math.random() * COLORS.length)];
  const correctIdx = Math.floor(Math.random() * 4);
  const acornIdx = Math.random() < 0.75 ? correctIdx : -1;

  const usedCombos = new Set<string>([`${targetSym.id}-${targetCol.name}`]);
  const pads: LilyPad[] = [];

  for (let i = 0; i < 4; i++) {
    if (i === correctIdx) {
      pads.push({
        id: i,
        symbol: targetSym.id,
        colorName: targetCol.name,
        bgClass: targetCol.bgClass,
        hasAcorn: i === acornIdx,
        isCorrect: true,
      });
    } else {
      let sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      let col = COLORS[Math.floor(Math.random() * COLORS.length)];
      while (usedCombos.has(`${sym.id}-${col.name}`)) {
        sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        col = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      usedCombos.add(`${sym.id}-${col.name}`);
      pads.push({
        id: i,
        symbol: sym.id,
        colorName: col.name,
        bgClass: col.bgClass,
        hasAcorn: false,
        isCorrect: false,
      });
    }
  }

  return {
    clueText: `${targetCol.name} ${targetSym.label}`,
    clueSymbol: targetSym.id,
    clueColor: targetCol.name,
    pads,
  };
}

export function RiverstoneStage({
  buddy,
  paused,
  onBuddyReact,
  onHeartsChange,
  onScoreChange,
  onGoalProgressChange,
  onWin,
  onLose,
}: StageComponentProps) {
  const [crossing, setCrossing] = useState(1);
  const [row, setRow] = useState<RiverRow>(() => buildRow());
  const [timeLeft, setTimeLeft] = useState(100);
  const [buddyPadIdx, setBuddyPadIdx] = useState<number | null>(null);

  const stateRef = useRef({
    hearts: 3,
    score: 0,
    timeLeft: 100,
    crossing: 1,
    finished: false,
  });

  useEffect(() => {
    onHeartsChange(3);
    onScoreChange(0);
    onGoalProgressChange(`Crossing 1 / ${TOTAL_CROSSINGS}`);
    onBuddyReact(
      'happy',
      'Read Sora’s lilypad clue and hop across the safe stone!'
    );
  }, [onBuddyReact, onGoalProgressChange, onHeartsChange, onScoreChange]);

  const handleRippleTimeout = useCallback(() => {
    const st = stateRef.current;
    if (st.finished) return;
    soundEngine.playOops();
    st.hearts = Math.max(0, st.hearts - 1);
    onHeartsChange(st.hearts);
    if (st.hearts <= 0) {
      st.finished = true;
      onLose(st.score, 'The playful river ripples washed away the lilypads!');
    } else {
      onBuddyReact('oops', 'Splash! Hop a little quicker before the ripple!');
      setRow(buildRow());
      st.timeLeft = 100;
      setTimeLeft(100);
    }
  }, [onBuddyReact, onHeartsChange, onLose]);

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      const st = stateRef.current;
      if (st.finished) return;
      const drop = 1.6 + st.crossing * 0.2;
      if (st.timeLeft - drop <= 0) {
        handleRippleTimeout();
      } else {
        st.timeLeft -= drop;
        setTimeLeft(st.timeLeft);
      }
    }, 120);
    return () => window.clearInterval(interval);
  }, [handleRippleTimeout, paused]);

  const handlePadClick = (pad: LilyPad, idx: number) => {
    const st = stateRef.current;
    if (paused || st.finished) return;

    if (pad.isCorrect) {
      soundEngine.playHop();
      setBuddyPadIdx(idx);
      const speedBonus = Math.round(st.timeLeft * 0.3);
      const acornBonus = pad.hasAcorn ? 25 : 0;
      st.score += 30 + speedBonus + acornBonus;
      onScoreChange(st.score);

      if (pad.hasAcorn) {
        onBuddyReact('combo', 'Golden Acorn bonus +25! Great hop!');
      } else {
        onBuddyReact('happy', 'Safe landing! Ready for the next stone!');
      }

      if (st.crossing >= TOTAL_CROSSINGS) {
        st.finished = true;
        soundEngine.playVictory();
        const stars: 1 | 2 | 3 =
          st.hearts === 3 ? 3 : st.hearts === 2 ? 2 : 1;
        window.setTimeout(() => {
          onWin({
            score: st.score + st.hearts * 30,
            stars,
            summaryText: `You hopped safely across all ${TOTAL_CROSSINGS} enchanted river rows!`,
          });
        }, 420);
      } else {
        st.crossing += 1;
        const nextCross = st.crossing;
        window.setTimeout(() => {
          setBuddyPadIdx(null);
          setCrossing(nextCross);
          setRow(buildRow());
          st.timeLeft = 100;
          setTimeLeft(100);
          onGoalProgressChange(`Crossing ${nextCross} / ${TOTAL_CROSSINGS}`);
        }, 320);
      }
    } else {
      soundEngine.playOops();
      st.hearts = Math.max(0, st.hearts - 1);
      onHeartsChange(st.hearts);
      if (st.hearts <= 0) {
        st.finished = true;
        onLose(st.score, 'That decoy lilypad wobbled into the stream!');
      } else {
        onBuddyReact(
          'oops',
          `Careful! Look for the ${row.clueText} lilypad!`
        );
      }
    }
  };

  const ClueIcon =
    SYMBOLS.find((s) => s.id === row.clueSymbol)?.icon ?? Sparkles;

  return (
    <div className="w-full min-h-[460px] sm:min-h-[520px] rounded-3xl border border-teal-700/60 bg-gradient-to-b from-[#0E4A53] via-[#0B3B45] to-[#082A33] p-6 sm:p-8 flex flex-col justify-between text-white shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-teal-950/75 rounded-2xl p-4 border border-teal-300/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0">
            <ClueIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-200">
              Crossing {crossing} of {TOTAL_CROSSINGS} · Sora&apos;s Clue
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Hop onto: <span className="text-amber-300">{row.clueText}</span>
            </h2>
          </div>
        </div>

        <div className="w-full sm:w-52">
          <div className="flex items-center justify-between text-xs font-bold mb-1 text-teal-100">
            <span className="inline-flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-teal-300" />
              Ripple Timer
            </span>
            <span className="tabular-nums">{Math.ceil(timeLeft)}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-teal-900 overflow-hidden border border-white/15">
            <div
              style={{ width: `${timeLeft}%` }}
              className={`h-full transition-all duration-100 ${
                timeLeft < 30 ? 'bg-rose-400' : 'bg-teal-300'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 my-4">
        {Array.from({ length: TOTAL_CROSSINGS }).map((_, idx) => {
          const step = idx + 1;
          return (
            <div
              key={step}
              className={`h-3 flex-1 max-w-16 rounded-full transition-colors ${
                step < crossing
                  ? 'bg-amber-400'
                  : step === crossing
                  ? 'bg-white'
                  : 'bg-teal-900 border border-teal-700'
              }`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
        {row.pads.map((pad, idx) => {
          const Icon =
            SYMBOLS.find((s) => s.id === pad.symbol)?.icon ?? Sparkles;
          const buddyHere = buddyPadIdx === idx;
          return (
            <button
              key={`${crossing}-${pad.id}`}
              type="button"
              onClick={() => handlePadClick(pad, idx)}
              className={`relative h-40 sm:h-48 rounded-full border-4 shadow-lg flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${pad.bgClass}`}
            >
              {pad.hasAcorn && (
                <div className="absolute -top-2 right-4 bg-amber-100 text-amber-900 border border-amber-500 rounded-xl px-2 py-0.5 text-[11px] font-extrabold flex items-center gap-1 shadow">
                  <Award className="w-3 h-3" aria-hidden="true" />
                  +25
                </div>
              )}

              {buddyHere ? (
                <BuddyAvatar buddy={buddy} mood="celebrating" size={84} />
              ) : (
                <>
                  <Icon className="w-11 h-11" aria-hidden="true" />
                  <span className="text-sm font-extrabold">
                    {pad.colorName}{' '}
                    {SYMBOLS.find((s) => s.id === pad.symbol)?.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs font-semibold text-teal-100/75 mt-2">
        Match both the color and the symbol shown in Sora&apos;s Clue above!
      </div>
    </div>
  );
}

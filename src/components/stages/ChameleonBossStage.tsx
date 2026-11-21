import { useCallback, useEffect, useRef, useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { CHAMELEON_BOSS_IMAGE } from '../../data/gameData';
import { StageComponentProps } from '../../types/game';
import { soundEngine } from '../../utils/sound';
import { ResilientImage } from '../ResilientImage';

type ChameleonColor = 'amber' | 'teal' | 'coral' | 'emerald';

interface ColorBubble {
  id: number;
  color: ChameleonColor;
  isStarfruit: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const COLOR_MAP: Record<
  ChameleonColor,
  { label: string; bg: string; ring: string }
> = {
  amber: {
    label: 'Sun Amber',
    bg: 'bg-amber-400 text-emerald-950 border-amber-100',
    ring: 'ring-amber-400',
  },
  teal: {
    label: 'Lagoon Teal',
    bg: 'bg-teal-400 text-emerald-950 border-teal-100',
    ring: 'ring-teal-400',
  },
  coral: {
    label: 'Berry Coral',
    bg: 'bg-rose-400 text-emerald-950 border-rose-100',
    ring: 'ring-rose-400',
  },
  emerald: {
    label: 'Leaf Emerald',
    bg: 'bg-emerald-400 text-emerald-950 border-emerald-100',
    ring: 'ring-emerald-400',
  },
};

const ALL_COLORS: ChameleonColor[] = ['amber', 'teal', 'coral', 'emerald'];
const TOTAL_PHASES = 3;
const SHIELD_HITS_NEEDED = 3;

export function ChameleonBossStage({
  paused,
  onBuddyReact,
  onHeartsChange,
  onScoreChange,
  onGoalProgressChange,
  onWin,
  onLose,
}: StageComponentProps) {
  const [phase, setPhase] = useState(1);
  const [bossColor, setBossColor] = useState<ChameleonColor>('amber');
  const [shieldLeft, setShieldLeft] = useState(SHIELD_HITS_NEEDED);
  const [bossStunned, setBossStunned] = useState(false);
  const [bossPerch, setBossPerch] = useState(1); // 0..3
  const [bubbles, setBubbles] = useState<ColorBubble[]>([]);

  const stateRef = useRef({
    phase: 1,
    bossColor: 'amber' as ChameleonColor,
    shieldLeft: SHIELD_HITS_NEEDED,
    bossStunned: false,
    score: 0,
    hearts: 3,
    nextId: 1,
    lastSpawn: 0,
    finished: false,
  });

  useEffect(() => {
    onHeartsChange(3);
    onScoreChange(0);
    onGoalProgressChange(`Phase 1 / ${TOTAL_PHASES}`);
    onBuddyReact(
      'determined',
      'Pop 3 Sun Amber bubbles to drop King Chameleon’s shield!'
    );
  }, [onBuddyReact, onGoalProgressChange, onHeartsChange, onScoreChange]);

  const pickNewColor = useCallback((exclude?: ChameleonColor) => {
    const pool = ALL_COLORS.filter((c) => c !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  // Floating bubble physics & spawner
  useEffect(() => {
    if (paused) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = stateRef.current;
      if (st.finished) return;

      if (now - st.lastSpawn > 760) {
        st.lastSpawn = now;
        const isStarfruit = Math.random() < 0.16;
        // Ensure plenty of target-color bubbles appear
        const color =
          Math.random() < 0.48
            ? st.bossColor
            : ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];

        setBubbles((prev) => {
          if (prev.length >= 10) return prev;
          return [
            ...prev,
            {
              id: st.nextId++,
              color,
              isStarfruit,
              x: 12 + Math.random() * 76,
              y: 92,
              vx: (Math.random() - 0.5) * 22,
              vy: -(20 + Math.random() * 14),
            },
          ];
        });
      }

      setBubbles((prev) =>
        prev
          .map((b) => {
            let nx = b.x + b.vx * dt;
            let vx = b.vx;
            if (nx < 8 || nx > 92) {
              vx = -vx;
              nx = Math.max(8, Math.min(92, nx));
            }
            return {
              ...b,
              x: nx,
              y: b.y + b.vy * dt,
              vx,
            };
          })
          .filter((b) => b.y > -8)
      );

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [paused]);

  const handleBubbleClick = (bubble: ColorBubble) => {
    if (paused || stateRef.current.finished) return;
    const st = stateRef.current;

    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    if (bubble.isStarfruit) {
      soundEngine.playCombo();
      st.score += 35;
      onScoreChange(st.score);
      onBuddyReact('combo', 'Sweet Starfruit +35 points!');
      return;
    }

    if (st.bossStunned) {
      soundEngine.playBubblePop();
      st.score += 15;
      onScoreChange(st.score);
      return;
    }

    if (bubble.color === st.bossColor) {
      soundEngine.playBubblePop();
      st.score += 25;
      st.shieldLeft = Math.max(0, st.shieldLeft - 1);
      setShieldLeft(st.shieldLeft);
      onScoreChange(st.score);

      if (st.shieldLeft === 0) {
        st.bossStunned = true;
        setBossStunned(true);
        soundEngine.playBossHit();
        onBuddyReact(
          'combo',
          'Shield cracked! Tap King Chameleon on his branch now!'
        );
      } else {
        onBuddyReact(
          'happy',
          `Nice pop! ${st.shieldLeft} more ${
            COLOR_MAP[st.bossColor].label
          } bubble${st.shieldLeft > 1 ? 's' : ''}!`
        );
      }
    } else {
      soundEngine.playOops();
      st.hearts = Math.max(0, st.hearts - 1);
      onHeartsChange(st.hearts);
      if (st.hearts <= 0) {
        st.finished = true;
        onLose(
          st.score,
          'Those decoy color bubbles fizzed out your Rainbow Splash!'
        );
      } else {
        onBuddyReact(
          'oops',
          `Wrong color! Pop ${COLOR_MAP[st.bossColor].label} bubbles!`
        );
      }
    }
  };

  const handleTagChameleon = () => {
    if (paused || stateRef.current.finished) return;
    const st = stateRef.current;
    if (!st.bossStunned) {
      soundEngine.playClick();
      onBuddyReact(
        'idle',
        `Pop ${st.shieldLeft} ${COLOR_MAP[st.bossColor].label} bubbles first!`
      );
      return;
    }

    soundEngine.playVictory();
    st.score += 75;
    onScoreChange(st.score);

    if (st.phase >= TOTAL_PHASES) {
      st.finished = true;
      const stars: 1 | 2 | 3 = st.hearts === 3 ? 3 : st.hearts === 2 ? 2 : 1;
      onBuddyReact(
        'celebrating',
        'King Chameleon is smiling! We earned the Canopy Crown!'
      );
      window.setTimeout(() => {
        onWin({
          score: st.score + st.hearts * 40,
          stars,
          summaryText:
            'You broke all 3 camouflage shields and restored the Canopy Sun Medallion!',
        });
      }, 420);
    } else {
      const nextPhase = st.phase + 1;
      const nextColor = pickNewColor(st.bossColor);
      st.phase = nextPhase;
      st.bossColor = nextColor;
      st.shieldLeft = SHIELD_HITS_NEEDED;
      st.bossStunned = false;

      setPhase(nextPhase);
      setBossColor(nextColor);
      setShieldLeft(SHIELD_HITS_NEEDED);
      setBossStunned(false);
      setBossPerch((prev) => (prev + 1 + Math.floor(Math.random() * 2)) % 4);
      onGoalProgressChange(`Phase ${nextPhase} / ${TOTAL_PHASES}`);
      onBuddyReact(
        'combo',
        `Rainbow Splash! Now pop ${COLOR_MAP[nextColor].label} bubbles!`
      );
    }
  };

  const activeColorMeta = COLOR_MAP[bossColor];

  return (
    <div className="w-full min-h-[480px] sm:min-h-[540px] rounded-3xl border border-emerald-800 bg-gradient-to-b from-[#133A3F] via-[#0D2C26] to-[#081E19] p-5 sm:p-6 flex flex-col justify-between text-white shadow-inner">
      {/* Grand Boss Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-emerald-950/75 rounded-2xl p-4 border border-white/10">
        <div>
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Grand Finale · Phase {phase} of {TOTAL_PHASES}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">
            {bossStunned
              ? 'Shield Down! Tap King Chameleon!'
              : `Pop ${activeColorMeta.label} Bubbles (${shieldLeft} left)`}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-emerald-100/80">
            Target Color:
          </div>
          <div
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${activeColorMeta.bg}`}
          >
            {activeColorMeta.label}
          </div>
        </div>
      </div>

      {/* 4 Canopy Perches at Top */}
      <div className="grid grid-cols-4 gap-3 my-4">
        {[0, 1, 2, 3].map((perchIdx) => {
          const isHere = bossPerch === perchIdx;
          return (
            <div
              key={perchIdx}
              className={`h-24 sm:h-28 rounded-2xl border flex items-center justify-center relative transition-colors ${
                isHere
                  ? 'bg-emerald-900/90 border-amber-300/60'
                  : 'bg-emerald-950/45 border-white/10'
              }`}
            >
              {isHere ? (
                <button
                  type="button"
                  onClick={handleTagChameleon}
                  aria-label="Tap King Chameleon"
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-transform cursor-pointer ${
                    bossStunned
                      ? 'border-amber-300 ring-4 ring-amber-400/70 scale-110 animate-pulse'
                      : `border-white/50 ring-4 ${activeColorMeta.ring}`
                  }`}
                >
                  <ResilientImage
                    src={CHAMELEON_BOSS_IMAGE}
                    alt="King Chameleon perched on a canopy branch"
                    className="w-full h-full object-cover"
                    fallbackTitle="King Chameleon"
                  />
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-200/40">
                  Branch {perchIdx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bubble Arena */}
      <div className="relative flex-1 min-h-[240px] rounded-2xl bg-emerald-950/55 border border-white/10 overflow-hidden">
        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleBubbleClick(b)}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            aria-label={
              b.isStarfruit
                ? 'Bonus Starfruit Bubble'
                : `${COLOR_MAP[b.color].label} Bubble`
            }
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 shadow-lg flex items-center justify-center font-extrabold text-xs transition-transform hover:scale-110 active:scale-90 cursor-pointer ${
              b.isStarfruit
                ? 'bg-yellow-300 text-amber-950 border-white'
                : COLOR_MAP[b.color].bg
            }`}
          >
            {b.isStarfruit ? (
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            ) : (
              <span>{COLOR_MAP[b.color].label.split(' ')[1]}</span>
            )}
          </button>
        ))}

        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-emerald-200/70 pointer-events-none">
            Shifting bubbles rising through the canopy...
          </div>
        )}
      </div>
    </div>
  );
}

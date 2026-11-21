import { useCallback, useEffect, useRef, useState } from 'react';
import { Disc3, Music } from 'lucide-react';
import { BONGO_BOSS_IMAGE } from '../../data/gameData';
import { StageComponentProps } from '../../types/game';
import { soundEngine } from '../../utils/sound';
import { BuddyAvatar } from '../BuddyAvatar';
import { ResilientImage } from '../ResilientImage';

interface CoconutHazard {
  id: number;
  lane: number;
  x: number;
}

interface BeatRing {
  id: number;
  lane: number;
  x: number;
  hit: boolean;
}

export function BongoBossStage({
  buddy,
  paused,
  onBuddyReact,
  onHeartsChange,
  onScoreChange,
  onGoalProgressChange,
  onWin,
  onLose,
}: StageComponentProps) {
  const [playerLane, setPlayerLane] = useState(1);
  const [groove, setGroove] = useState(0);
  const [coconuts, setCoconuts] = useState<CoconutHazard[]>([]);
  const [beats, setBeats] = useState<BeatRing[]>([]);
  const [bongoBounce, setBongoBounce] = useState(false);

  const stateRef = useRef({
    lane: 1,
    groove: 0,
    score: 0,
    hearts: 3,
    nextId: 1,
    lastBeatSpawn: 0,
    lastCoconutSpawn: 0,
    coconuts: [] as CoconutHazard[],
    beats: [] as BeatRing[],
    finished: false,
  });

  useEffect(() => {
    onHeartsChange(3);
    onScoreChange(0);
    onGoalProgressChange('Groove: 0%');
    onBuddyReact(
      'determined',
      'Hop lanes to dodge coconuts, and tap the Drum when beat rings reach Gold!'
    );
  }, [onBuddyReact, onGoalProgressChange, onHeartsChange, onScoreChange]);

  const moveLane = useCallback((nextLane: number) => {
    const clamped = Math.max(0, Math.min(2, nextLane));
    if (clamped !== stateRef.current.lane) {
      stateRef.current.lane = clamped;
      setPlayerLane(clamped);
      soundEngine.playHop();
    }
  }, []);

  const hitDrum = useCallback(() => {
    if (paused || stateRef.current.finished) return;
    const st = stateRef.current;
    soundEngine.playDrum(st.lane);

    let matched = false;
    st.beats = st.beats.map((b) => {
      if (!matched && !b.hit && b.lane === st.lane && b.x >= 9 && b.x <= 32) {
        matched = true;
        return { ...b, hit: true };
      }
      return b;
    });
    setBeats(st.beats.filter((b) => !b.hit));

    if (matched) {
      st.groove = Math.min(100, st.groove + 14);
      st.score += 35;
      setGroove(st.groove);
      setBongoBounce(true);
      window.setTimeout(() => setBongoBounce(false), 220);
      soundEngine.playBossHit();
      onScoreChange(st.score);
      onGoalProgressChange(`Groove: ${st.groove}%`);
      onBuddyReact('combo', 'Awesome beat! Bongo is dancing!');

      if (st.groove >= 100 && !st.finished) {
        st.finished = true;
        const stars: 1 | 2 | 3 =
          st.hearts === 3 ? 3 : st.hearts === 2 ? 2 : 1;
        onWin({
          score: st.score + st.hearts * 40,
          stars,
          summaryText:
            'Bongo loved your jungle rhythm and opened the Rope Bridge!',
        });
      }
    } else {
      onBuddyReact('idle', 'Wait for the beat ring to reach your gold drum!');
    }
  }, [onBuddyReact, onGoalProgressChange, onScoreChange, onWin, paused]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (paused) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moveLane(stateRef.current.lane - 1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveLane(stateRef.current.lane + 1);
      } else if (e.key === '1' || e.key === '2' || e.key === '3') {
        moveLane(Number(e.key) - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        hitDrum();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hitDrum, moveLane, paused]);

  useEffect(() => {
    if (paused) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = stateRef.current;
      if (st.finished) return;

      if (now - st.lastBeatSpawn > 1350) {
        st.lastBeatSpawn = now;
        const lane = Math.floor(Math.random() * 3);
        st.beats.push({ id: st.nextId++, lane, x: 92, hit: false });
      }

      if (now - st.lastCoconutSpawn > 1750) {
        st.lastCoconutSpawn = now;
        const lane = Math.floor(Math.random() * 3);
        st.coconuts.push({ id: st.nextId++, lane, x: 95 });
      }

      st.beats = st.beats
        .map((b) => ({ ...b, x: b.x - 32 * dt }))
        .filter((b) => !b.hit && b.x > 4);
      setBeats(st.beats);

      const nextCoconuts: CoconutHazard[] = [];
      for (const c of st.coconuts) {
        const nx = c.x - 38 * dt;
        if (c.lane === st.lane && nx >= 12 && nx <= 22) {
          st.hearts = Math.max(0, st.hearts - 1);
          soundEngine.playOops();
          onHeartsChange(st.hearts);
          onBuddyReact('oops', 'Bonk! Hop to another lane to dodge coconuts!');
          if (st.hearts <= 0 && !st.finished) {
            st.finished = true;
            onLose(
              st.score,
              'Rolling coconuts knocked you off the beat! Try hopping lanes sooner.'
            );
          }
          continue;
        }
        if (nx > 4) nextCoconuts.push({ ...c, x: nx });
      }
      st.coconuts = nextCoconuts;
      setCoconuts(nextCoconuts);

      if (!st.finished) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [onBuddyReact, onHeartsChange, onLose, paused]);

  return (
    <div className="w-full min-h-[460px] sm:min-h-[520px] rounded-3xl border border-emerald-800 bg-gradient-to-b from-[#174636] to-[#0B281E] p-5 sm:p-6 flex flex-col justify-between text-white shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-emerald-950/65 rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 transition-transform ${
              bongoBounce ? 'scale-110' : 'scale-100'
            }`}
          >
            <ResilientImage
              src={BONGO_BOSS_IMAGE}
              alt="Bongo the Gorilla drumming"
              className="w-full h-full object-cover"
              fallbackTitle="Bongo"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">
              Friendly Boss · Rope Bridge Showdown
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Bongo the Drum-Loving Gorilla
            </h2>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex items-center justify-between text-xs font-bold mb-1 tabular-nums">
            <span>Bongo&apos;s Groove Meter</span>
            <span className="text-amber-300">{groove}%</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-emerald-900 overflow-hidden border border-white/15">
            <div
              style={{ width: `${groove}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="my-4 space-y-3">
        {[0, 1, 2].map((laneIdx) => {
          const isPlayerHere = playerLane === laneIdx;
          const laneBeats = beats.filter((b) => b.lane === laneIdx);
          const laneCoconuts = coconuts.filter((c) => c.lane === laneIdx);

          return (
            <div
              key={laneIdx}
              role="button"
              tabIndex={0}
              onClick={() => moveLane(laneIdx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') moveLane(laneIdx);
              }}
              aria-label={`Bridge lane ${laneIdx + 1}`}
              className={`relative h-20 sm:h-24 rounded-2xl border transition-colors cursor-pointer overflow-hidden flex items-center ${
                isPlayerHere
                  ? 'bg-emerald-800/75 border-amber-400/80'
                  : 'bg-emerald-950/55 border-white/10 hover:border-white/25'
              }`}
            >
              <div
                aria-hidden="true"
                className="absolute left-[14%] w-14 h-14 rounded-full border-2 border-dashed border-amber-300/70 bg-amber-400/10 flex items-center justify-center"
              >
                <Disc3 className="w-6 h-6 text-amber-300/60" />
              </div>

              {isPlayerHere && (
                <div className="absolute left-[13%] z-10 pointer-events-none">
                  <BuddyAvatar
                    buddy={buddy}
                    mood={bongoBounce ? 'combo' : 'determined'}
                    size={68}
                  />
                </div>
              )}

              {laneBeats.map((b) => (
                <div
                  key={b.id}
                  style={{ left: `${b.x}%` }}
                  className="absolute -translate-x-1/2 w-12 h-12 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center pointer-events-none"
                >
                  <Music className="w-5 h-5 text-emerald-950" />
                </div>
              ))}

              {laneCoconuts.map((c) => (
                <div
                  key={c.id}
                  style={{ left: `${c.x}%` }}
                  className="absolute -translate-x-1/2 w-10 h-10 rounded-full bg-amber-900 border-2 border-rose-300 shadow-md flex items-center justify-center pointer-events-none"
                >
                  <span className="text-xs font-extrabold text-rose-200">
                    !
                  </span>
                </div>
              ))}

              <span className="ml-auto mr-4 text-xs font-bold text-emerald-200/60 pointer-events-none">
                Lane {laneIdx + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-medium text-emerald-100/80">
          Tap a lane (or Up/Down) to dodge coconuts · Press{' '}
          <strong className="text-amber-300">Space</strong> or tap{' '}
          <strong className="text-amber-300">Hit Jungle Drum</strong> on gold
          rings!
        </p>

        <button
          type="button"
          onClick={hitDrum}
          className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-extrabold text-base shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Hit Jungle Drum!
        </button>
      </div>
    </div>
  );
}

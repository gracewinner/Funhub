import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { BuddyMood, StageComponentProps } from '../../types/game';
import { soundEngine } from '../../utils/sound';
import { BuddyAvatar } from '../BuddyAvatar';

type ItemKind = 'mango' | 'berry' | 'starfruit' | 'pinecone';

interface FallingItem {
  id: number;
  kind: ItemKind;
  x: number;
  y: number;
  speed: number;
  wobbleSeed: number;
}

interface FloatingPop {
  id: number;
  x: number;
  y: number;
  text: string;
  positive: boolean;
}

const TARGET_SCORE = 220;

export function VineCrossingStage({
  buddy,
  paused,
  onBuddyReact,
  onHeartsChange,
  onScoreChange,
  onGoalProgressChange,
  onWin,
  onLose,
}: StageComponentProps) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [pops, setPops] = useState<FloatingPop[]>([]);
  const [combo, setCombo] = useState(0);
  const [magnetActive, setMagnetActive] = useState(false);
  const [buddyMood, setBuddyMood] = useState<BuddyMood>('determined');

  const stateRef = useRef({
    playerX: 50,
    items: [] as FallingItem[],
    score: 0,
    hearts: 3,
    combo: 0,
    magnetUntil: 0,
    nextId: 1,
    lastSpawn: 0,
    finished: false,
    keys: { left: false, right: false },
  });

  useEffect(() => {
    onHeartsChange(3);
    onScoreChange(0);
    onGoalProgressChange(`0 / ${TARGET_SCORE} pts`);
    onBuddyReact('happy', 'Slide to catch mangoes! Dodge prickly pinecones!');
  }, [onBuddyReact, onGoalProgressChange, onHeartsChange, onScoreChange]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = false;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const st = stateRef.current;

      if (st.finished) return;

      if (st.keys.left) {
        st.playerX = Math.max(10, st.playerX - 75 * dt);
      }
      if (st.keys.right) {
        st.playerX = Math.min(90, st.playerX + 75 * dt);
      }

      const hasMagnet = now < st.magnetUntil;
      setMagnetActive(hasMagnet);
      setPlayerX(st.playerX);

      if (now - st.lastSpawn > 680) {
        st.lastSpawn = now;
        const roll = Math.random();
        let kind: ItemKind = 'mango';
        if (roll < 0.24) kind = 'pinecone';
        else if (roll < 0.36) kind = 'starfruit';
        else if (roll < 0.62) kind = 'berry';

        const speedBase =
          kind === 'starfruit' ? 35 : kind === 'pinecone' ? 33 : 28;
        st.items.push({
          id: st.nextId++,
          kind,
          x: 10 + Math.random() * 80,
          y: -6,
          speed: speedBase + Math.random() * 11,
          wobbleSeed: Math.random() * Math.PI * 2,
        });
      }

      const nextList: FallingItem[] = [];
      const newPops: FloatingPop[] = [];

      for (const item of st.items) {
        let nx = item.x;
        const ny = item.y + item.speed * dt;

        if (hasMagnet && item.kind !== 'pinecone' && ny > 25) {
          nx += (st.playerX - nx) * Math.min(1, dt * 6);
        } else if (item.kind === 'pinecone') {
          nx += Math.sin(ny * 0.12 + item.wobbleSeed) * 14 * dt;
          nx = Math.max(8, Math.min(92, nx));
        }

        const caught =
          ny >= 76 && ny <= 90 && Math.abs(nx - st.playerX) <= 10.5;

        if (caught) {
          if (item.kind === 'pinecone') {
            st.hearts = Math.max(0, st.hearts - 1);
            st.combo = 0;
            st.magnetUntil = 0;
            setCombo(0);
            setBuddyMood('oops');
            soundEngine.playOops();
            onHeartsChange(st.hearts);
            onBuddyReact('oops', 'Ouch! Prickly Mud-Pinecone!');
            newPops.push({
              id: st.nextId++,
              x: nx,
              y: 78,
              text: '-1 Heart',
              positive: false,
            });

            if (st.hearts <= 0 && !st.finished) {
              st.finished = true;
              onLose(
                st.score,
                'Too many prickly pinecones bumped your basket!'
              );
            }
          } else {
            const pts =
              item.kind === 'starfruit'
                ? 35
                : item.kind === 'berry'
                ? 20
                : 15;
            st.combo += 1;
            const bonus = st.combo >= 5 ? 10 : 0;
            st.score += pts + bonus;
            setCombo(st.combo);
            onScoreChange(st.score);
            onGoalProgressChange(
              `${Math.min(st.score, TARGET_SCORE)} / ${TARGET_SCORE} pts`
            );

            if (st.combo === 5) {
              st.magnetUntil = now + 5500;
              soundEngine.playCombo();
              setBuddyMood('combo');
              onBuddyReact('combo', '5-Catch Combo! Golden Magnet ON!');
            } else {
              soundEngine.playCatch(st.combo);
              setBuddyMood('happy');
              if (item.kind === 'starfruit') {
                onBuddyReact('combo', 'Whoa! Golden Starfruit +35!');
              }
            }

            newPops.push({
              id: st.nextId++,
              x: nx,
              y: 76,
              text: `+${pts + bonus}`,
              positive: true,
            });

            if (st.score >= TARGET_SCORE && !st.finished) {
              st.finished = true;
              const stars: 1 | 2 | 3 =
                st.hearts === 3 ? 3 : st.hearts === 2 ? 2 : 1;
              onWin({
                score: st.score,
                stars,
                summaryText: `You gathered ${st.score} mango points for the treetop picnic!`,
              });
            }
          }
          continue;
        }

        if (ny < 103) {
          nextList.push({ ...item, x: nx, y: ny });
        }
      }

      st.items = nextList;
      setItems(nextList);
      if (newPops.length > 0) {
        setPops((prev) => [...prev.slice(-4), ...newPops]);
      }

      if (!st.finished) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [
    paused,
    onBuddyReact,
    onGoalProgressChange,
    onHeartsChange,
    onLose,
    onScoreChange,
    onWin,
  ]);

  useEffect(() => {
    if (pops.length === 0) return;
    const t = window.setTimeout(() => {
      setPops((prev) => prev.slice(1));
    }, 650);
    return () => window.clearTimeout(t);
  }, [pops]);

  const handlePointerMove = (clientX: number) => {
    if (paused || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, pct));
    stateRef.current.playerX = clamped;
    setPlayerX(clamped);
  };

  return (
    <div
      ref={arenaRef}
      onPointerMove={(e) => handlePointerMove(e.clientX)}
      onPointerDown={(e) => handlePointerMove(e.clientX)}
      className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-emerald-800 bg-gradient-to-b from-[#134E3A] via-[#0F3D2E] to-[#0A291F] select-none touch-none cursor-ew-resize shadow-inner"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-700/35 to-transparent pointer-events-none"
      />
      <div className="absolute top-4 left-5 flex items-center gap-3 text-xs font-bold text-emerald-100/90 pointer-events-none tabular-nums">
        <span>Combo Streak: {combo}</span>
        {magnetActive && (
          <span className="inline-flex items-center gap-1 text-amber-300">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Golden Magnet Active!
          </span>
        )}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {item.kind === 'mango' && (
            <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-100 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 -mt-7 border border-emerald-900" />
            </div>
          )}
          {item.kind === 'berry' && (
            <div className="w-9 h-9 rounded-full bg-teal-400 border-2 border-teal-100 shadow-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/75" />
            </div>
          )}
          {item.kind === 'starfruit' && (
            <div className="w-11 h-11 rounded-2xl rotate-45 bg-yellow-300 border-2 border-white shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 -rotate-45 text-amber-700" />
            </div>
          )}
          {item.kind === 'pinecone' && (
            <div className="w-10 h-10 rounded-xl rotate-12 bg-rose-700 border-2 border-rose-200 shadow-md flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">!</span>
            </div>
          )}
        </div>
      ))}

      {pops.map((pop) => (
        <div
          key={pop.id}
          style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
          className={`absolute -translate-x-1/2 font-extrabold text-sm pointer-events-none transition-transform ${
            pop.positive ? 'text-amber-300' : 'text-rose-300'
          }`}
        >
          {pop.text}
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-emerald-950 to-emerald-900/70 border-t border-emerald-700/40 pointer-events-none"
      />

      <div
        style={{ left: `${playerX}%` }}
        className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
      >
        {magnetActive && (
          <div
            aria-hidden="true"
            className="w-24 h-24 rounded-full border-2 border-amber-300/70 bg-amber-300/10 absolute -top-2"
          />
        )}
        <BuddyAvatar buddy={buddy} mood={buddyMood} size={82} />
      </div>
    </div>
  );
}

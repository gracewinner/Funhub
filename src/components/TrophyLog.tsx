import { useState } from 'react';
import { Award, RotateCcw, Star, Trophy } from 'lucide-react';
import {
  CHAPTERS,
  VICTORY_EMBLEM_IMAGE,
  getTotalStars,
} from '../data/gameData';
import { PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/sound';
import { ResilientImage } from './ResilientImage';

interface TrophyLogProps {
  profile: PlayerProfile;
  onResetAdventure: () => void;
  onBackToMap: () => void;
}

export function TrophyLog({
  profile,
  onResetAdventure,
  onBackToMap,
}: TrophyLogProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const totalStars = getTotalStars(profile);
  const completedCount = Object.values(profile.progress).filter(
    (p) => p.completed
  ).length;
  const totalScore = Object.values(profile.progress).reduce(
    (sum, p) => sum + p.bestScore,
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            Adventure Keepsakes
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            {profile.buddy.name}&apos;s Trophy Log
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onBackToMap();
          }}
          className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Back to Trail Map
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Medallion & Totals */}
        <section className="lg:col-span-4 bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-900 shadow-sm flex flex-col items-center text-center">
          <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-md">
            <ResilientImage
              src={VICTORY_EMBLEM_IMAGE}
              alt="Golden Jungle Sun Medallion Emblem"
              className="w-full h-full object-cover"
              fallbackTitle="Canopy Sun Medallion"
            />
          </div>

          <h2 className="text-2xl font-extrabold mt-5">
            {completedCount === 5
              ? 'Champion of the Canopy!'
              : 'Jungle Explorer'}
          </h2>
          <p className="text-sm text-emerald-100/80 mt-1">
            {completedCount === 5
              ? 'You befriended every creature and restored the Sun Medallion!'
              : 'Earn stars in each chapter to unlock special Buddy Studio hats and capes.'}
          </p>

          <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/15 tabular-nums">
            <div>
              <div className="text-2xl font-extrabold text-amber-400">
                {totalStars}
              </div>
              <div className="text-xs text-emerald-100/75">of 15 Stars</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">
                {completedCount}/5
              </div>
              <div className="text-xs text-emerald-100/75">Chapters</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-teal-300">
                {totalScore}
              </div>
              <div className="text-xs text-emerald-100/75">Total Points</div>
            </div>
          </div>
        </section>

        {/* Right Chapter Badges & High Scores */}
        <section className="lg:col-span-8 bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span>Chapter Medals & Animal Friends</span>
            </h2>
          </div>

          <div className="divide-y divide-emerald-950/10">
            {CHAPTERS.map((ch) => {
              const prog = profile.progress[ch.id];
              return (
                <div
                  key={ch.id}
                  className="py-4 first:pt-1 last:pb-1 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-lg ${
                        prog.completed
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-[#F4F7F2] text-emerald-900/45 border border-emerald-950/10'
                      }`}
                    >
                      {prog.completed ? (
                        <Award className="w-6 h-6" aria-hidden="true" />
                      ) : (
                        <span className="tabular-nums">{ch.number}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-bold text-emerald-950 truncate">
                        {ch.title}
                      </div>
                      <div className="text-xs text-emerald-900/70">
                        Friend: {ch.friendName} · {ch.friendTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 tabular-nums">
                    <div className="text-right">
                      <div className="text-xs text-emerald-900/65">
                        Best Score
                      </div>
                      <div className="text-sm font-extrabold text-emerald-950">
                        {prog.bestScore}
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      aria-label={`${prog.stars} out of 3 stars`}
                    >
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= prog.stars
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-emerald-950/15'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safe two-step reset */}
          <div className="mt-6 pt-5 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-emerald-900/70">
              Progress saves automatically on this device.
            </p>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Start Fresh Adventure</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700">
                  Erase all stars?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setConfirmReset(false);
                    onResetAdventure();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

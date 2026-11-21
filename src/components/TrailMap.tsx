import { useState } from 'react';
import { Crown, Lock, Play, Star } from 'lucide-react';
import {
  CHAPTERS,
  WORLD_MAP_IMAGE,
  getNextPlayableChapterId,
  getTotalStars,
  isChapterUnlocked,
} from '../data/gameData';
import { ChapterId, PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/sound';
import { BuddyAvatar } from './BuddyAvatar';
import { ResilientImage } from './ResilientImage';

interface TrailMapProps {
  profile: PlayerProfile;
  onStartChapter: (chapterId: ChapterId) => void;
  onOpenStudio: () => void;
}

export function TrailMap({
  profile,
  onStartChapter,
  onOpenStudio,
}: TrailMapProps) {
  const [selectedId, setSelectedId] = useState<ChapterId>(() =>
    getNextPlayableChapterId(profile)
  );
  const selectedChapter =
    CHAPTERS.find((c) => c.id === selectedId) ?? CHAPTERS[0];
  const selectedProgress = profile.progress[selectedChapter.id];
  const selectedUnlocked = isChapterUnlocked(selectedChapter.id, profile);
  const totalStars = getTotalStars(profile);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header summary bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            Interactive Canopy Trail
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Enchanted Jungle Map
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-emerald-950 tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <Star
              className="w-4 h-4 text-amber-500 fill-amber-400"
              aria-hidden="true"
            />
            {totalStars} / 15 Stars
          </span>
          <span aria-hidden="true" className="text-emerald-950/30">
            ·
          </span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenStudio();
            }}
            className="text-teal-700 hover:text-teal-900 underline underline-offset-4 cursor-pointer"
          >
            Dress Up {profile.buddy.name}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Map Canvas */}
        <section
          aria-label="Jungle trail chapter map"
          className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-emerald-950/15 bg-emerald-950 min-h-[380px] sm:min-h-[460px] shadow-sm"
        >
          <ResilientImage
            src={WORLD_MAP_IMAGE}
            alt="Aerial enchanted jungle trail map"
            className="absolute inset-0 w-full h-full object-cover"
            fallbackTitle="Enchanted Jungle Trail"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-emerald-950/35 via-emerald-950/15 to-emerald-950/55"
          />

          {/* SVG Path connecting the 5 stops */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M 19 74 Q 26 56, 34 46 T 52 63 T 68 38 T 82 24"
              fill="none"
              stroke="rgba(254, 243, 199, 0.85)"
              strokeWidth="1.2"
              strokeDasharray="2.2 2"
              strokeLinecap="round"
            />
          </svg>

          {/* 5 Interactive Chapter Nodes */}
          {CHAPTERS.map((ch) => {
            const unlocked = isChapterUnlocked(ch.id, profile);
            const prog = profile.progress[ch.id];
            const isSelected = ch.id === selectedChapter.id;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedId(ch.id);
                }}
                style={{
                  left: `${ch.mapPosition.x}%`,
                  top: `${ch.mapPosition.y}%`,
                }}
                aria-label={`Chapter ${ch.number}: ${ch.title}${
                  unlocked ? '' : ' (Locked)'
                }`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 rounded-2xl transition-transform ${
                  isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg border-2 shadow-md transition-colors ${
                    !unlocked
                      ? 'bg-slate-800/90 text-slate-300 border-slate-400/50'
                      : isSelected
                      ? 'bg-amber-400 text-emerald-950 border-white ring-4 ring-amber-300/50'
                      : prog.completed
                      ? 'bg-emerald-600 text-white border-emerald-200'
                      : 'bg-white text-emerald-950 border-amber-400'
                  }`}
                >
                  {!unlocked ? (
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  ) : ch.isBoss ? (
                    <Crown className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <span className="tabular-nums">{ch.number}</span>
                  )}
                </div>

                {/* Star indicator under node */}
                <div className="mt-1 px-2 py-0.5 rounded-lg bg-emerald-950/85 text-white text-[11px] font-bold flex items-center gap-0.5 border border-white/15 whitespace-nowrap">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= prog.stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-emerald-100/30'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </section>

        {/* Selected Chapter Briefing Card */}
        <aside className="lg:col-span-5 bg-white border border-emerald-950/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-teal-700">
                  Chapter {selectedChapter.number} ·{' '}
                  {selectedChapter.isBoss
                    ? 'Friendly Boss Stage'
                    : selectedChapter.subtitle}
                </p>
                <h2 className="text-2xl font-extrabold text-emerald-950 mt-1 leading-tight">
                  {selectedChapter.title}
                </h2>
              </div>

              {selectedChapter.portraitUrl ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-950/15 shrink-0">
                  <ResilientImage
                    src={selectedChapter.portraitUrl}
                    alt={selectedChapter.friendName}
                    className="w-full h-full object-cover"
                    fallbackTitle={selectedChapter.friendName}
                  />
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-2xl p-1 border border-emerald-200/70 shrink-0">
                  <BuddyAvatar
                    buddy={profile.buddy}
                    mood={selectedUnlocked ? 'happy' : 'idle'}
                    size={56}
                  />
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-emerald-950/80 leading-relaxed">
              {selectedChapter.storyIntro}
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#F4F7F2] border border-emerald-950/10 space-y-2.5">
              <div>
                <div className="text-xs font-bold text-emerald-900/70">
                  Your Goal
                </div>
                <div className="text-sm font-bold text-emerald-950">
                  {selectedChapter.goalLabel}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900/70">
                  How to Play
                </div>
                <div className="text-sm text-emerald-950/85 leading-snug">
                  {selectedChapter.howToPlay}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900/70">
                  Controls
                </div>
                <div className="text-xs font-medium text-emerald-900/80">
                  {selectedChapter.controlsHint}
                </div>
              </div>
            </div>

            {/* Best record */}
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-900/75 tabular-nums">
              <span>
                Best Score:{' '}
                <strong className="text-emerald-950">
                  {selectedProgress.bestScore}
                </strong>
              </span>
              <span>
                Stars Earned:{' '}
                <strong className="text-emerald-950">
                  {selectedProgress.stars} / 3
                </strong>
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-emerald-950/10">
            {selectedUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playCombo();
                  onStartChapter(selectedChapter.id);
                }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-base shadow-sm transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>
                  {selectedProgress.completed
                    ? `Replay Chapter ${selectedChapter.number}`
                    : `Start Chapter ${selectedChapter.number}`}
                </span>
              </button>
            ) : (
              <div className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold text-center border border-slate-200 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Complete Chapter {selectedChapter.number - 1} to Unlock
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

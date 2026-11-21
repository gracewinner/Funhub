import { useState } from 'react';
import { Compass, Palette, Play, Star } from 'lucide-react';
import {
  SPECIES_OPTIONS,
  WORLD_MAP_IMAGE,
  getTotalStars,
} from '../data/gameData';
import { BuddySpecies, PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/sound';
import { BuddyAvatar } from './BuddyAvatar';
import { ResilientImage } from './ResilientImage';

interface TitleMenuProps {
  profile: PlayerProfile;
  onStartAdventure: () => void;
  onOpenStudio: () => void;
  onQuickSpeciesSelect: (species: BuddySpecies, defaultName: string) => void;
}

export function TitleMenu({
  profile,
  onStartAdventure,
  onOpenStudio,
  onQuickSpeciesSelect,
}: TitleMenuProps) {
  const [previewMood, setPreviewMood] = useState<'idle' | 'happy' | 'celebrating'>('idle');
  const totalStars = getTotalStars(profile);
  const completedCount = Object.values(profile.progress).filter(
    (p) => p.completed
  ).length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Story Welcome & Quick Buddy Selection */}
        <section className="lg:col-span-6 bg-white border border-emerald-950/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-sm font-semibold text-teal-700 tracking-tight mb-2">
              Enchanted Jungle Story Adventure · Ages 6–9
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-950 leading-[1.08] tracking-tight text-balance">
              Explore the Treetop Trail with {profile.buddy.name}
            </h1>
            <p className="mt-4 text-base text-emerald-950/80 leading-relaxed max-w-xl">
              Dash through mango vines, echo glowing firefly songs, out-groove
              Bongo the Gorilla, hop enchanted riverstones, and outsmart King
              Chameleon across 5 interactive chapters.
            </p>

            {/* Quick Species Picker */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-bold text-emerald-950">
                  Choose Your Animal Buddy
                </span>
                <span className="text-xs font-medium text-emerald-900/65">
                  Reacts live as you play
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SPECIES_OPTIONS.map((sp) => {
                  const selected = profile.buddy.species === sp.id;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playNote(
                          SPECIES_OPTIONS.findIndex((o) => o.id === sp.id)
                        );
                        setPreviewMood('happy');
                        onQuickSpeciesSelect(sp.id, sp.defaultName);
                        window.setTimeout(() => setPreviewMood('idle'), 900);
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                        selected
                          ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                          : 'bg-[#F4F7F2] text-emerald-950 border-emerald-950/10 hover:border-emerald-700/40'
                      }`}
                    >
                      <div className="text-sm font-bold whitespace-nowrap truncate">
                        {sp.defaultName}
                      </div>
                      <div
                        className={`text-xs whitespace-nowrap truncate ${
                          selected ? 'text-emerald-100' : 'text-emerald-900/70'
                        }`}
                      >
                        {sp.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playCombo();
                  onStartAdventure();
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-base shadow-sm transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>
                  {profile.hasStarted ? 'Continue Adventure' : 'Start Adventure'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenStudio();
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#F4F7F2] hover:bg-emerald-100/70 text-emerald-950 font-bold text-sm border border-emerald-950/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                <Palette className="w-4 h-4" aria-hidden="true" />
                <span>Customize Buddy</span>
              </button>
            </div>

            {profile.hasStarted && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900/80 tabular-nums">
                <Star
                  className="w-4 h-4 text-amber-500 fill-amber-400"
                  aria-hidden="true"
                />
                <span>{totalStars}/15 Stars</span>
                <span aria-hidden="true">·</span>
                <span>{completedCount}/5 Chapters</span>
              </div>
            )}
          </div>
        </section>

        {/* Right Illustrated Canopy Stage & Live Buddy Preview */}
        <section className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-emerald-950/10 min-h-[380px] flex flex-col justify-between bg-emerald-950">
          <ResilientImage
            src={WORLD_MAP_IMAGE}
            alt="Sunlit enchanted jungle canopy map with waterfalls and treehouses"
            className="absolute inset-0 w-full h-full object-cover"
            fallbackTitle="Enchanted Jungle Canopy"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/35 to-emerald-950/20"
          />

          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-100 bg-emerald-950/75 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15">
              <Compass className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>5 Story Stages · 2 Friendly Bosses</span>
            </div>
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex items-end justify-between gap-4">
            <div className="text-white max-w-xs">
              <p className="text-xs font-semibold text-amber-300 mb-1">
                Ready for Adventure
              </p>
              <h2 className="text-2xl font-bold leading-tight">
                Meet {profile.buddy.name}
              </h2>
              <p className="text-sm text-emerald-100/90 mt-1.5">
                Tap your buddy anytime to say hello and hear a cheerful jungle
                chime!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playCombo();
                setPreviewMood('celebrating');
                window.setTimeout(() => setPreviewMood('idle'), 1200);
              }}
              aria-label={`Wave hello to ${profile.buddy.name}`}
              className="shrink-0 bg-white/95 hover:bg-white rounded-3xl p-3 shadow-lg border border-white/60 transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <BuddyAvatar
                buddy={profile.buddy}
                mood={previewMood}
                size={112}
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

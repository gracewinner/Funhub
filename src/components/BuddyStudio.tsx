import { useState } from 'react';
import { Check, Lock, Sparkles, Star } from 'lucide-react';
import {
  CAPE_OPTIONS,
  COLOR_PALETTES,
  HAT_OPTIONS,
  SPECIES_OPTIONS,
  getTotalStars,
} from '../data/gameData';
import { BuddyConfig, BuddyMood, PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/sound';
import { BuddyAvatar } from './BuddyAvatar';

interface BuddyStudioProps {
  profile: PlayerProfile;
  onUpdateBuddy: (buddy: BuddyConfig) => void;
  onBackToMap: () => void;
}

export function BuddyStudio({
  profile,
  onUpdateBuddy,
  onBackToMap,
}: BuddyStudioProps) {
  const [mood, setMood] = useState<BuddyMood>('happy');
  const [buddyBubble, setBuddyBubble] = useState(
    'Pick a cool hat and color for our jungle quest!'
  );
  const totalStars = getTotalStars(profile);

  const triggerPreviewReaction = (nextMood: BuddyMood, msg: string) => {
    setMood(nextMood);
    setBuddyBubble(msg);
    if (nextMood === 'combo' || nextMood === 'celebrating') {
      soundEngine.playCombo();
    } else if (nextMood === 'oops') {
      soundEngine.playOops();
    } else {
      soundEngine.playNote(2);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            Companion Workshop
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Buddy Studio
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-emerald-950 tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <Star
              className="w-4 h-4 text-amber-500 fill-amber-400"
              aria-hidden="true"
            />
            {totalStars} Stars Unlocked
          </span>
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
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Live Preview Stage */}
        <section className="lg:col-span-5 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-sm flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-emerald-200/80 mb-4">
            <span>Live Reaction Preview</span>
            <span className="capitalize text-amber-300">
              Mood: {mood === 'oops' ? 'Surprised' : mood}
            </span>
          </div>

          <div className="w-52 h-52 rounded-3xl bg-gradient-to-b from-emerald-800/80 to-emerald-900/90 border border-emerald-700/60 flex items-center justify-center shadow-inner">
            <BuddyAvatar buddy={profile.buddy} mood={mood} size={172} />
          </div>

          <div className="mt-5 w-full bg-white text-emerald-950 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-bold text-teal-700">
              {profile.buddy.name} says:
            </div>
            <p className="text-sm font-semibold mt-0.5">{buddyBubble}</p>
          </div>

          {/* Reaction tester buttons */}
          <div className="mt-5 w-full">
            <div className="text-xs font-semibold text-emerald-200/80 mb-2">
              Test Live Gameplay Expressions
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'happy', label: 'Happy', msg: 'Yay! Ready to explore!' },
                  { id: 'combo', label: 'Combo', msg: 'Whoa! Super streak!' },
                  { id: 'oops', label: 'Oops', msg: 'Whoa! Watch that pinecone!' },
                  {
                    id: 'celebrating',
                    label: 'Victory',
                    msg: 'We did it! Three cheers!',
                  },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => triggerPreviewReaction(btn.id, btn.msg)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    mood === btn.id
                      ? 'bg-amber-400 text-emerald-950'
                      : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Customization Controls */}
        <section className="lg:col-span-7 bg-white border border-emerald-950/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
          {/* Buddy Name Input */}
          <div>
            <label
              htmlFor="buddy-name-input"
              className="block text-sm font-bold text-emerald-950 mb-2"
            >
              Buddy Name
            </label>
            <input
              id="buddy-name-input"
              type="text"
              maxLength={14}
              value={profile.buddy.name}
              onChange={(e) =>
                onUpdateBuddy({ ...profile.buddy, name: e.target.value })
              }
              onBlur={() => {
                if (!profile.buddy.name.trim()) {
                  onUpdateBuddy({ ...profile.buddy, name: 'Pip' });
                }
              }}
              placeholder="Enter a fun name"
              className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-[#F4F7F2] border border-emerald-950/15 text-emerald-950 font-bold text-base focus:outline-2 focus:outline-amber-500"
            />
          </div>

          {/* Species Picker */}
          <div>
            <div className="text-sm font-bold text-emerald-950 mb-2.5">
              Animal Friend
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SPECIES_OPTIONS.map((sp) => {
                const active = profile.buddy.species === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playNote(1);
                      setMood('happy');
                      setBuddyBubble(`Hi! I'm ${profile.buddy.name} the ${sp.label}!`);
                      onUpdateBuddy({ ...profile.buddy, species: sp.id });
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                        : 'bg-[#F4F7F2] text-emerald-950 border-emerald-950/10 hover:border-emerald-700/40'
                    }`}
                  >
                    <div className="text-sm font-bold whitespace-nowrap">
                      {sp.label}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-snug ${
                        active ? 'text-emerald-100' : 'text-emerald-900/70'
                      }`}
                    >
                      {sp.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div>
            <div className="text-sm font-bold text-emerald-950 mb-2.5">
              Coat & Feather Colors
            </div>
            <div className="flex flex-wrap gap-3">
              {COLOR_PALETTES.map((pal) => {
                const active = profile.buddy.colorId === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setMood('happy');
                      setBuddyBubble(`${pal.label} looks awesome!`);
                      onUpdateBuddy({ ...profile.buddy, colorId: pal.id });
                    }}
                    className={`inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-emerald-900 text-white border-emerald-900'
                        : 'bg-[#F4F7F2] text-emerald-950 border-emerald-950/10 hover:border-emerald-700/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: pal.primary }}
                      aria-hidden="true"
                    />
                    <span>{pal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hats */}
          <div>
            <div className="text-sm font-bold text-emerald-950 mb-2.5">
              Hats & Crowns
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {HAT_OPTIONS.map((hat) => {
                const unlocked = totalStars >= hat.starsRequired;
                const active = profile.buddy.hatId === hat.id;
                return (
                  <button
                    key={hat.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      soundEngine.playCatch(2);
                      setMood('celebrating');
                      setBuddyBubble(`Ooh, I love the ${hat.label}!`);
                      onUpdateBuddy({ ...profile.buddy, hatId: hat.id });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      !unlocked
                        ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                        : active
                        ? 'bg-amber-400 text-emerald-950 border-amber-500 font-bold cursor-pointer'
                        : 'bg-[#F4F7F2] text-emerald-950 border-emerald-950/10 hover:border-emerald-700/40 cursor-pointer'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">
                        {hat.label}
                      </div>
                      <div className="text-xs opacity-80">
                        {unlocked
                          ? active
                            ? 'Equipped'
                            : 'Unlocked'
                          : `Needs ${hat.starsRequired} Stars`}
                      </div>
                    </div>
                    {!unlocked ? (
                      <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : active ? (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Sparkles
                        className="w-4 h-4 text-amber-600 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capes */}
          <div>
            <div className="text-sm font-bold text-emerald-950 mb-2.5">
              Scarves & Capes
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CAPE_OPTIONS.map((cape) => {
                const unlocked = totalStars >= cape.starsRequired;
                const active = profile.buddy.capeId === cape.id;
                return (
                  <button
                    key={cape.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      soundEngine.playCatch(3);
                      setMood('combo');
                      setBuddyBubble(`Ready to swoop in my ${cape.label}!`);
                      onUpdateBuddy({ ...profile.buddy, capeId: cape.id });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      !unlocked
                        ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                        : active
                        ? 'bg-amber-400 text-emerald-950 border-amber-500 font-bold cursor-pointer'
                        : 'bg-[#F4F7F2] text-emerald-950 border-emerald-950/10 hover:border-emerald-700/40 cursor-pointer'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">
                        {cape.label}
                      </div>
                      <div className="text-xs opacity-80">
                        {unlocked
                          ? active
                            ? 'Equipped'
                            : 'Unlocked'
                          : `Needs ${cape.starsRequired} Stars`}
                      </div>
                    </div>
                    {!unlocked ? (
                      <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : active ? (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

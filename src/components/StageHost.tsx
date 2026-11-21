import { useCallback, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CHAPTERS, CHAPTER_MAP } from '../data/gameData';
import {
  BuddyMood,
  ChapterId,
  PlayerProfile,
  StageOutcome,
  StagePhase,
} from '../types/game';
import { soundEngine } from '../utils/sound';
import { BuddyAvatar, BuddyHudCard } from './BuddyAvatar';
import { BongoBossStage } from './stages/BongoBossStage';
import { ChameleonBossStage } from './stages/ChameleonBossStage';
import { FireflyGladeStage } from './stages/FireflyGladeStage';
import { RiverstoneStage } from './stages/RiverstoneStage';
import { VineCrossingStage } from './stages/VineCrossingStage';

interface StageHostProps {
  chapterId: ChapterId;
  profile: PlayerProfile;
  onToggleSound: () => void;
  onExitToMap: () => void;
  onStageWin: (chapterId: ChapterId, outcome: StageOutcome) => void;
  onSelectChapter: (chapterId: ChapterId) => void;
}

export function StageHost({
  chapterId,
  profile,
  onToggleSound,
  onExitToMap,
  onStageWin,
  onSelectChapter,
}: StageHostProps) {
  const chapter = CHAPTER_MAP[chapterId];
  const [phase, setPhase] = useState<StagePhase>('INTRO');
  const [runKey, setRunKey] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [goalLabel, setGoalLabel] = useState(chapter.goalLabel);
  const [buddyMood, setBuddyMood] = useState<BuddyMood>('happy');
  const [buddyMessage, setBuddyMessage] = useState(chapter.buddyTip);
  const [outcome, setOutcome] = useState<StageOutcome | null>(null);
  const [loseReason, setLoseReason] = useState('');

  const handleBuddyReact = useCallback((mood: BuddyMood, message: string) => {
    setBuddyMood(mood);
    setBuddyMessage(message);
  }, []);

  const handleWin = useCallback(
    (result: StageOutcome) => {
      setOutcome(result);
      setPhase('VICTORY');
      setBuddyMood('celebrating');
      setBuddyMessage('We did it! That was amazing!');
      soundEngine.playVictory();
      onStageWin(chapterId, result);
    },
    [chapterId, onStageWin]
  );

  const handleLose = useCallback((finalScore: number, reason: string) => {
    setScore(finalScore);
    setLoseReason(reason);
    setPhase('TRY_AGAIN');
    setBuddyMood('oops');
    setBuddyMessage('No worries! Let us try that together again!');
  }, []);

  const handleRestart = () => {
    soundEngine.playClick();
    setOutcome(null);
    setLoseReason('');
    setHearts(3);
    setScore(0);
    setGoalLabel(chapter.goalLabel);
    setBuddyMood('happy');
    setBuddyMessage(chapter.buddyTip);
    setRunKey((k) => k + 1);
    setPhase('PLAYING');
  };

  const nextChapter = CHAPTERS.find((c) => c.number === chapter.number + 1);

  const renderStage = () => {
    const commonProps = {
      buddy: profile.buddy,
      paused: phase !== 'PLAYING',
      onBuddyReact: handleBuddyReact,
      onHeartsChange: setHearts,
      onScoreChange: setScore,
      onGoalProgressChange: setGoalLabel,
      onWin: handleWin,
      onLose: handleLose,
    };

    switch (chapterId) {
      case 'vine-crossing':
        return <VineCrossingStage key={runKey} {...commonProps} />;
      case 'firefly-glade':
        return <FireflyGladeStage key={runKey} {...commonProps} />;
      case 'bongo-boss':
        return <BongoBossStage key={runKey} {...commonProps} />;
      case 'riverstone-hopper':
        return <RiverstoneStage key={runKey} {...commonProps} />;
      case 'chameleon-boss':
        return <ChameleonBossStage key={runKey} {...commonProps} />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
      {/* Unobtrusive Top Stage HUD Strip */}
      <div className="bg-white border border-emerald-950/10 rounded-2xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onExitToMap();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F7F2] hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Trail Map</span>
          </button>
          <div className="min-w-0">
            <div className="text-xs font-bold text-teal-700 truncate">
              Chapter {chapter.number} · {goalLabel}
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-emerald-950 truncate">
              {chapter.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 tabular-nums shrink-0">
          {/* Hearts with explicit numeric count */}
          <div
            className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-950"
            aria-label={`Hearts: ${hearts} out of 3`}
          >
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-300 fill-slate-200'
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-xs font-bold text-emerald-900/75">
              {hearts}/3
            </span>
          </div>

          <div className="text-sm font-extrabold text-emerald-950">
            Score: <span className="text-amber-600">{score}</span>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={profile.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 rounded-xl bg-[#F4F7F2] hover:bg-emerald-100 text-emerald-950 transition-colors cursor-pointer"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
          </button>

          {phase === 'PLAYING' && (
            <button
              type="button"
              onClick={() => setPhase('PAUSED')}
              aria-label="Pause stage"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pause</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage Play Arena + Modal States */}
      <div className="relative">
        {renderStage()}

        {/* Intro Modal */}
        {phase === 'INTRO' && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white text-emerald-950 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-emerald-950/10">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 rounded-2xl p-2 border border-emerald-200 shrink-0">
                  <BuddyAvatar buddy={profile.buddy} mood="happy" size={76} />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-700">
                    Chapter {chapter.number} Briefing
                  </p>
                  <h2 className="text-2xl font-extrabold leading-tight">
                    {chapter.title}
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm text-emerald-950/85 leading-relaxed">
                {chapter.storyIntro}
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-[#F4F7F2] border border-emerald-950/10 space-y-1.5">
                <div className="text-xs font-bold text-emerald-900/70">
                  How to Play
                </div>
                <p className="text-sm font-semibold text-emerald-950">
                  {chapter.howToPlay}
                </p>
                <p className="text-xs text-emerald-900/75 pt-1">
                  Controls: {chapter.controlsHint}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onExitToMap}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCombo();
                    setPhase('PLAYING');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Start Stage</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Modal */}
        {phase === 'PAUSED' && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white text-emerald-950 rounded-3xl max-w-sm w-full p-6 text-center shadow-xl">
              <h2 className="text-2xl font-extrabold">Adventure Paused</h2>
              <p className="text-sm text-emerald-900/75 mt-1">
                Take a breather with {profile.buddy.name}!
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setPhase('PLAYING')}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm cursor-pointer"
                >
                  Resume Playing
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full py-3 rounded-xl bg-[#F4F7F2] hover:bg-emerald-100 text-emerald-950 font-bold text-sm cursor-pointer"
                >
                  Restart Chapter
                </button>
                <button
                  type="button"
                  onClick={onExitToMap}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                >
                  Exit to Trail Map
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {phase === 'VICTORY' && outcome && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-emerald-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white text-emerald-950 rounded-3xl max-w-md w-full p-6 sm:p-7 text-center shadow-xl">
              <div className="mx-auto w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <BuddyAvatar
                  buddy={profile.buddy}
                  mood="celebrating"
                  size={84}
                />
              </div>

              <p className="text-xs font-bold text-teal-700 mt-4">
                Chapter {chapter.number} Complete
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
                {chapter.title} Cleared!
              </h2>

              <div className="flex items-center justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-9 h-9 ${
                      s <= outcome.stars
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="text-sm text-emerald-950/80">
                {outcome.summaryText}
              </p>

              <div className="mt-4 py-2.5 px-4 rounded-xl bg-[#F4F7F2] inline-block text-sm font-extrabold tabular-nums">
                Final Score: {outcome.score}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4F7F2] hover:bg-emerald-100 text-emerald-950 text-sm font-bold cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Play Again</span>
                </button>

                {nextChapter ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playCombo();
                      onSelectChapter(nextChapter.id);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>Next: Chapter {nextChapter.number}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onExitToMap}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-sm cursor-pointer"
                  >
                    Celebrate on Map
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Try Again Modal */}
        {phase === 'TRY_AGAIN' && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-emerald-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white text-emerald-950 rounded-3xl max-w-md w-full p-6 sm:p-7 text-center shadow-xl">
              <div className="mx-auto w-24 h-24 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <BuddyAvatar buddy={profile.buddy} mood="oops" size={84} />
              </div>

              <h2 className="text-2xl font-extrabold mt-4">
                So Close! Try Again?
              </h2>
              <p className="text-sm text-emerald-950/80 mt-2">{loseReason}</p>
              <p className="text-xs font-bold text-teal-700 mt-2 tabular-nums">
                Score this round: {score}
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onExitToMap}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold cursor-pointer"
                >
                  Trail Map
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Reactive Buddy HUD Bar below Stage */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <BuddyHudCard
          buddy={profile.buddy}
          mood={buddyMood}
          message={buddyMessage}
        />

        <div className="text-xs font-medium text-emerald-900/75 max-w-md">
          <strong className="text-emerald-950">Controls:</strong>{' '}
          {chapter.controlsHint}
        </div>
      </div>
    </main>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { BuddyStudio } from './components/BuddyStudio';
import { StageHost } from './components/StageHost';
import { TitleMenu } from './components/TitleMenu';
import { TopBar } from './components/TopBar';
import { TrailMap } from './components/TrailMap';
import { TrophyLog } from './components/TrophyLog';
import { getNextPlayableChapterId } from './data/gameData';
import {
  BuddyConfig,
  BuddySpecies,
  ChapterId,
  GameScreen,
  PlayerProfile,
  StageOutcome,
} from './types/game';
import { soundEngine } from './utils/sound';
import { loadProfile, resetProfile, saveProfile } from './utils/storage';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [screen, setScreen] = useState<GameScreen>('TITLE_MENU');
  const [activeChapterId, setActiveChapterId] =
    useState<ChapterId>('vine-crossing');

  useEffect(() => {
    soundEngine.setEnabled(profile.soundEnabled);
    saveProfile(profile);
  }, [profile]);

  const handleStartAdventure = () => {
    setProfile((prev) => ({ ...prev, hasStarted: true }));
    setScreen('TRAIL_MAP');
  };

  const handleQuickSpeciesSelect = (
    species: BuddySpecies,
    defaultName: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      buddy: {
        ...prev.buddy,
        species,
        name: defaultName,
      },
    }));
  };

  const handleUpdateBuddy = (buddy: BuddyConfig) => {
    setProfile((prev) => ({ ...prev, buddy }));
  };

  const handleStartChapter = (chapterId: ChapterId) => {
    setActiveChapterId(chapterId);
    setProfile((prev) => ({ ...prev, hasStarted: true }));
    setScreen('STAGE_PLAY');
  };

  const handlePlayNext = () => {
    soundEngine.playCombo();
    const nextId = getNextPlayableChapterId(profile);
    handleStartChapter(nextId);
  };

  const handleStageWin = useCallback(
    (chapterId: ChapterId, outcome: StageOutcome) => {
      setProfile((prev) => {
        const existing = prev.progress[chapterId];
        return {
          ...prev,
          hasStarted: true,
          progress: {
            ...prev.progress,
            [chapterId]: {
              completed: true,
              stars: Math.max(existing.stars, outcome.stars),
              bestScore: Math.max(existing.bestScore, outcome.score),
            },
          },
        };
      });
    },
    []
  );

  const handleToggleSound = () => {
    setProfile((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const handleResetAdventure = () => {
    const fresh = resetProfile();
    setProfile(fresh);
    setScreen('TITLE_MENU');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#132A1F] flex flex-col">
      {screen !== 'STAGE_PLAY' && (
        <TopBar
          currentScreen={screen}
          onNavigate={(nextScreen) => {
            soundEngine.playClick();
            setScreen(nextScreen);
          }}
          onPlayNext={handlePlayNext}
        />
      )}

      <div className="flex-1">
        {screen === 'TITLE_MENU' && (
          <TitleMenu
            profile={profile}
            onStartAdventure={handleStartAdventure}
            onOpenStudio={() => setScreen('BUDDY_STUDIO')}
            onQuickSpeciesSelect={handleQuickSpeciesSelect}
          />
        )}

        {screen === 'TRAIL_MAP' && (
          <TrailMap
            profile={profile}
            onStartChapter={handleStartChapter}
            onOpenStudio={() => setScreen('BUDDY_STUDIO')}
          />
        )}

        {screen === 'BUDDY_STUDIO' && (
          <BuddyStudio
            profile={profile}
            onUpdateBuddy={handleUpdateBuddy}
            onBackToMap={() => setScreen('TRAIL_MAP')}
          />
        )}

        {screen === 'TROPHY_LOG' && (
          <TrophyLog
            profile={profile}
            onResetAdventure={handleResetAdventure}
            onBackToMap={() => setScreen('TRAIL_MAP')}
          />
        )}

        {screen === 'STAGE_PLAY' && (
          <StageHost
            key={activeChapterId}
            chapterId={activeChapterId}
            profile={profile}
            onToggleSound={handleToggleSound}
            onExitToMap={() => setScreen('TRAIL_MAP')}
            onStageWin={handleStageWin}
            onSelectChapter={handleStartChapter}
          />
        )}
      </div>
    </div>
  );
}

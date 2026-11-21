export type BuddySpecies = 'red_panda' | 'toucan' | 'frog' | 'capybara';

export type BuddyMood =
  | 'idle'
  | 'happy'
  | 'combo'
  | 'oops'
  | 'determined'
  | 'celebrating';

export type GameScreen =
  | 'TITLE_MENU'
  | 'TRAIL_MAP'
  | 'BUDDY_STUDIO'
  | 'TROPHY_LOG'
  | 'STAGE_PLAY';

export type StagePhase = 'INTRO' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'TRY_AGAIN';

export type ChapterId =
  | 'vine-crossing'
  | 'firefly-glade'
  | 'bongo-boss'
  | 'riverstone-hopper'
  | 'chameleon-boss';

export interface BuddyConfig {
  name: string;
  species: BuddySpecies;
  colorId: string;
  hatId: string;
  capeId: string;
}

export interface ChapterProgress {
  completed: boolean;
  stars: number; // 0 to 3
  bestScore: number;
}

export interface PlayerProfile {
  hasStarted: boolean;
  buddy: BuddyConfig;
  progress: Record<ChapterId, ChapterProgress>;
  soundEnabled: boolean;
}

export interface ChapterMeta {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  isBoss: boolean;
  storyIntro: string;
  howToPlay: string;
  controlsHint: string;
  buddyTip: string;
  goalLabel: string;
  friendName: string;
  friendTitle: string;
  mapPosition: { x: number; y: number };
  portraitUrl?: string;
}

export interface ColorPaletteOption {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  belly: string;
}

export interface GearOption {
  id: string;
  label: string;
  starsRequired: number;
  accentColor: string;
  secondaryColor?: string;
}

export interface BuddyReaction {
  mood: BuddyMood;
  message: string;
  timestamp: number;
}

export interface StageOutcome {
  score: number;
  stars: 1 | 2 | 3;
  summaryText: string;
}

export interface StageComponentProps {
  buddy: BuddyConfig;
  paused: boolean;
  onBuddyReact: (mood: BuddyMood, message: string) => void;
  onHeartsChange: (hearts: number) => void;
  onScoreChange: (score: number) => void;
  onGoalProgressChange: (label: string) => void;
  onWin: (outcome: StageOutcome) => void;
  onLose: (score: number, reason: string) => void;
}

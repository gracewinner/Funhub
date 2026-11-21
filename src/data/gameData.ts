import worldMapBgImg from '../assets/images/jungle_world_map_bg_1795249271745.jpg';
import bongoBossImg from '../assets/images/boss_bongo_gorilla_1795249270867.jpg';
import chameleonBossImg from '../assets/images/boss_king_chameleon_1795249270771.jpg';
import victoryEmblemImg from '../assets/images/jungle_victory_emblem_1795249270462.jpg';
import {
  BuddySpecies,
  ChapterId,
  ChapterMeta,
  ColorPaletteOption,
  GearOption,
  PlayerProfile,
} from '../types/game';

export const WORLD_MAP_IMAGE = worldMapBgImg;
export const BONGO_BOSS_IMAGE = bongoBossImg;
export const CHAMELEON_BOSS_IMAGE = chameleonBossImg;
export const VICTORY_EMBLEM_IMAGE = victoryEmblemImg;

export const SPECIES_OPTIONS: Array<{
  id: BuddySpecies;
  label: string;
  defaultName: string;
  tagline: string;
}> = [
  {
    id: 'red_panda',
    label: 'Red Panda',
    defaultName: 'Pip',
    tagline: 'Nimble vine climber with a fluffy tail',
  },
  {
    id: 'toucan',
    label: 'Toucan',
    defaultName: 'Tilly',
    tagline: 'Cheerful flyer who loves berry treats',
  },
  {
    id: 'frog',
    label: 'Tree Frog',
    defaultName: 'Milo',
    tagline: 'Bouncy lilypad jumper with big bright eyes',
  },
  {
    id: 'capybara',
    label: 'Capybara',
    defaultName: 'Coco',
    tagline: 'Calm river explorer who makes friends everywhere',
  },
];

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: 'sunlit_amber',
    label: 'Sunlit Amber',
    primary: '#D97706',
    secondary: '#92400E',
    belly: '#FEF3C7',
  },
  {
    id: 'canopy_emerald',
    label: 'Canopy Emerald',
    primary: '#059669',
    secondary: '#065F46',
    belly: '#D1FAE5',
  },
  {
    id: 'lagoon_teal',
    label: 'Lagoon Teal',
    primary: '#0D9488',
    secondary: '#115E59',
    belly: '#CCFBF1',
  },
  {
    id: 'berry_coral',
    label: 'Berry Coral',
    primary: '#E11D48',
    secondary: '#881337',
    belly: '#FFE4E6',
  },
  {
    id: 'cloud_mocha',
    label: 'Warm Cocoa',
    primary: '#8D5B4C',
    secondary: '#4E3129',
    belly: '#F5EBE0',
  },
];

export const HAT_OPTIONS: GearOption[] = [
  {
    id: 'none',
    label: 'No Hat',
    starsRequired: 0,
    accentColor: '#64748B',
  },
  {
    id: 'leaf_cap',
    label: 'Sprout Leaf',
    starsRequired: 0,
    accentColor: '#16A34A',
    secondaryColor: '#86EFAC',
  },
  {
    id: 'explorer_hat',
    label: 'Ranger Brim',
    starsRequired: 2,
    accentColor: '#B45309',
    secondaryColor: '#FDE68A',
  },
  {
    id: 'firefly_crown',
    label: 'Firefly Tiara',
    starsRequired: 4,
    accentColor: '#F59E0B',
    secondaryColor: '#FEF08A',
  },
  {
    id: 'bongo_feathers',
    label: 'Drum Plume',
    starsRequired: 7,
    accentColor: '#DC2626',
    secondaryColor: '#FBBF24',
  },
  {
    id: 'canopy_crown',
    label: 'Canopy Crown',
    starsRequired: 11,
    accentColor: '#EAB308',
    secondaryColor: '#10B981',
  },
];

export const CAPE_OPTIONS: GearOption[] = [
  {
    id: 'none',
    label: 'No Cape',
    starsRequired: 0,
    accentColor: '#64748B',
  },
  {
    id: 'vine_scarf',
    label: 'Moss Scarf',
    starsRequired: 0,
    accentColor: '#15803D',
  },
  {
    id: 'sunset_cape',
    label: 'Mango Cape',
    starsRequired: 3,
    accentColor: '#EA580C',
  },
  {
    id: 'river_cloak',
    label: 'River Cloak',
    starsRequired: 6,
    accentColor: '#0284C7',
  },
  {
    id: 'rainbow_mantle',
    label: 'Rainbow Mantle',
    starsRequired: 9,
    accentColor: '#DB2777',
  },
];

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'vine-crossing',
    number: 1,
    title: 'Whispering Vine Crossing',
    subtitle: 'Sun-Mango Arcade Catch',
    isBoss: false,
    storyIntro:
      'A playful canopy breeze just shook the mango trees! Gather sweet Sun-Mangoes and Glow-Berries for the treetop picnic while dodging bouncy Mud-Pinecones.',
    howToPlay:
      'Slide your buddy left and right to catch falling fruit. Catch 5 in a row to activate the Golden Magnet!',
    controlsHint: 'Move mouse, drag finger, or press Left / Right Arrow keys',
    buddyTip: 'Watch out for prickly Mud-Pinecones—they bounce!',
    goalLabel: 'Collect 220 Mango Points',
    friendName: 'Mango Tree Chorus',
    friendTitle: 'Keeper of the Entry Gate',
    mapPosition: { x: 19, y: 74 },
  },
  {
    id: 'firefly-glade',
    number: 2,
    title: 'Firefly Echo Glade',
    subtitle: 'Musical Blossom Memory',
    isBoss: false,
    storyIntro:
      'Little Pipkin the baby sloth wandered into the twilight fern glade! Echo the glowing flower songs so Pipkin can follow the musical lantern trail home.',
    howToPlay:
      'Watch and listen as the 4 glowing jungle blossoms chime in order, then tap them back in the exact same sequence across 4 rounds.',
    controlsHint: 'Click or tap the glowing blossoms (or press keys 1, 2, 3, 4)',
    buddyTip: 'Hum along with the chimes to remember the pattern!',
    goalLabel: 'Complete 4 Blossom Melodies',
    friendName: 'Pipkin the Baby Sloth',
    friendTitle: 'Lantern Trail Guide',
    mapPosition: { x: 34, y: 46 },
  },
  {
    id: 'bongo-boss',
    number: 3,
    title: "Bongo's Bridge Dance-Off",
    subtitle: 'Friendly Boss Showdown',
    isBoss: true,
    storyIntro:
      'Big Bongo the Gorilla loves drumming on the rope bridge so much he forgot to let travelers pass! Out-groove him in a 3-lane rhythm dance-off to win him over.',
    howToPlay:
      'Hop across the 3 bridge lanes to dodge rolling coconuts, and tap the glowing Jungle Drums when beat rings enter the gold target zone!',
    controlsHint: 'Click a lane or press 1 / 2 / 3 (or Up / Down arrows) + Space / Tap Drum',
    buddyTip: 'Hit drums inside the gold ring to fill Bongo’s Groove Meter!',
    goalLabel: 'Fill Groove Meter to 100%',
    friendName: 'Bongo the Gorilla',
    friendTitle: 'Rhythm Master of the Bridge',
    mapPosition: { x: 52, y: 63 },
    portraitUrl: BONGO_BOSS_IMAGE,
  },
  {
    id: 'riverstone-hopper',
    number: 4,
    title: 'Riverstone Hopper',
    subtitle: 'Enchanted Stream Crossing',
    isBoss: false,
    storyIntro:
      'The sparkling waterfall river has playful shifting lilypads! Follow the River Spirit’s symbol clues to hop across safe stepping stones and grab Golden Acorns.',
    howToPlay:
      'Check the Target Clue banner at the top, then click the matching lilypad in the glowing row ahead before the gentle current washes it away.',
    controlsHint: 'Click or tap the matching lilypad in the active row',
    buddyTip: 'Match both the shape and color clue carefully!',
    goalLabel: 'Cross 6 Enchanted River Rows',
    friendName: 'Sora the River Otter',
    friendTitle: 'Waterfall Ferry Captain',
    mapPosition: { x: 68, y: 38 },
  },
  {
    id: 'chameleon-boss',
    number: 5,
    title: "King Chameleon's Canopy Maze",
    subtitle: 'Grand Finale Boss',
    isBoss: true,
    storyIntro:
      'Mischievous King Chameleon has hidden the Canopy Sun Medallion behind his shimmering color bubbles! Spot where he perches, pop matching shield bubbles, and tag him with Rainbow Splashes!',
    howToPlay:
      'Pop floating bubbles that match King Chameleon’s current color to drop his shield, catch Starfruits for bonus points, then tap King Chameleon on his shimmering branch!',
    controlsHint: 'Click or tap matching color bubbles and tap King Chameleon when stunned',
    buddyTip: 'Look for his glowing eyes and acorn crown when his shield drops!',
    goalLabel: 'Break 3 Camouflage Phases',
    friendName: 'King Chameleon',
    friendTitle: 'Sovereign of the Treetops',
    mapPosition: { x: 82, y: 24 },
    portraitUrl: CHAMELEON_BOSS_IMAGE,
  },
];

export const CHAPTER_MAP: Record<ChapterId, ChapterMeta> = CHAPTERS.reduce(
  (acc, ch) => {
    acc[ch.id] = ch;
    return acc;
  },
  {} as Record<ChapterId, ChapterMeta>
);

export function createInitialProfile(): PlayerProfile {
  return {
    hasStarted: false,
    buddy: {
      name: 'Pip',
      species: 'red_panda',
      colorId: 'sunlit_amber',
      hatId: 'leaf_cap',
      capeId: 'vine_scarf',
    },
    progress: {
      'vine-crossing': { completed: false, stars: 0, bestScore: 0 },
      'firefly-glade': { completed: false, stars: 0, bestScore: 0 },
      'bongo-boss': { completed: false, stars: 0, bestScore: 0 },
      'riverstone-hopper': { completed: false, stars: 0, bestScore: 0 },
      'chameleon-boss': { completed: false, stars: 0, bestScore: 0 },
    },
    soundEnabled: true,
  };
}

export function getTotalStars(profile: PlayerProfile): number {
  return Object.values(profile.progress).reduce(
    (sum, item) => sum + item.stars,
    0
  );
}

export function isChapterUnlocked(
  chapterId: ChapterId,
  profile: PlayerProfile
): boolean {
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  if (idx <= 0) return true;
  const prevChapter = CHAPTERS[idx - 1];
  return profile.progress[prevChapter.id]?.completed ?? false;
}

export function getNextPlayableChapterId(profile: PlayerProfile): ChapterId {
  for (const ch of CHAPTERS) {
    if (!profile.progress[ch.id]?.completed && isChapterUnlocked(ch.id, profile)) {
      return ch.id;
    }
  }
  return 'vine-crossing';
}

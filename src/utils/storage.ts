import { createInitialProfile } from '../data/gameData';
import { PlayerProfile } from '../types/game';

const STORAGE_KEY = 'canopy_quest_profile_v1';

export function loadProfile(): PlayerProfile {
  const fallback = createInitialProfile();
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    return {
      hasStarted: Boolean(parsed.hasStarted),
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      buddy: {
        ...fallback.buddy,
        ...(parsed.buddy ?? {}),
      },
      progress: {
        ...fallback.progress,
        ...(parsed.progress ?? {}),
      },
    };
  } catch {
    return fallback;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetProfile(): PlayerProfile {
  const fresh = createInitialProfile();
  saveProfile(fresh);
  return fresh;
}

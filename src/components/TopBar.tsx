import { Play } from 'lucide-react';
import { GameScreen } from '../types/game';

interface TopBarProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onPlayNext: () => void;
}

export function TopBar({
  currentScreen,
  onNavigate,
  onPlayNext,
}: TopBarProps) {
  const navItems: Array<{ screen: GameScreen; label: string }> = [
    { screen: 'TRAIL_MAP', label: 'Trail Map' },
    { screen: 'BUDDY_STUDIO', label: 'Buddy Studio' },
    { screen: 'TROPHY_LOG', label: 'Trophy Log' },
  ];

  return (
    <header className="bg-[#F4F7F2]/95 backdrop-blur-sm border-b border-emerald-950/10 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('TITLE_MENU')}
          className="text-xl font-extrabold tracking-tight text-emerald-950 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 rounded-md"
        >
          Canopy Quest
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-5 sm:gap-7 overflow-x-auto"
        >
          {navItems.map((item) => {
            const active = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`text-sm font-semibold py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                  active
                    ? 'text-emerald-950 border-amber-500'
                    : 'text-emerald-900/70 border-transparent hover:text-emerald-950 hover:border-emerald-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onPlayNext}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Play Next</span>
          </button>
        </div>
      </div>
    </header>
  );
}

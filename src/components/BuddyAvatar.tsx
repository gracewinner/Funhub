import { COLOR_PALETTES, CAPE_OPTIONS, HAT_OPTIONS } from '../data/gameData';
import { BuddyConfig, BuddyMood } from '../types/game';

interface BuddyAvatarProps {
  buddy: BuddyConfig;
  mood?: BuddyMood;
  size?: number;
  className?: string;
}

export function BuddyAvatar({
  buddy,
  mood = 'idle',
  size = 112,
  className = '',
}: BuddyAvatarProps) {
  const palette =
    COLOR_PALETTES.find((c) => c.id === buddy.colorId) ?? COLOR_PALETTES[0];
  const hat = HAT_OPTIONS.find((h) => h.id === buddy.hatId) ?? HAT_OPTIONS[0];
  const cape = CAPE_OPTIONS.find((c) => c.id === buddy.capeId) ?? CAPE_OPTIONS[0];

  const animClass =
    mood === 'celebrating' || mood === 'combo'
      ? 'animate-buddy-cheer'
      : mood === 'oops'
      ? 'animate-buddy-oops'
      : 'animate-buddy-idle';

  const renderEyes = () => {
    if (mood === 'celebrating' || mood === 'happy') {
      return (
        <g stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M 38 48 Q 43 42 48 48" />
          <path d="M 62 48 Q 67 42 72 48" />
        </g>
      );
    }
    if (mood === 'combo') {
      return (
        <g>
          <polygon
            points="43,40 45.5,45 51,45.5 47,49 48,54.5 43,51.5 38,54.5 39,49 35,45.5 40.5,45"
            fill="#F59E0B"
            stroke="#1C1917"
            strokeWidth="1.5"
          />
          <polygon
            points="67,40 69.5,45 75,45.5 71,49 72,54.5 67,51.5 62,54.5 63,49 59,45.5 64.5,45"
            fill="#F59E0B"
            stroke="#1C1917"
            strokeWidth="1.5"
          />
        </g>
      );
    }
    if (mood === 'oops') {
      return (
        <g stroke="#1C1917" strokeWidth="3" strokeLinecap="round">
          <line x1="38" y1="43" x2="47" y2="51" />
          <line x1="47" y1="43" x2="38" y2="51" />
          <line x1="63" y1="43" x2="72" y2="51" />
          <line x1="72" y1="43" x2="63" y2="51" />
        </g>
      );
    }
    if (mood === 'determined') {
      return (
        <g>
          <circle cx="43" cy="48" r="4.8" fill="#1C1917" />
          <circle cx="67" cy="48" r="4.8" fill="#1C1917" />
          <circle cx="44.5" cy="46.2" r="1.7" fill="#FFFFFF" />
          <circle cx="68.5" cy="46.2" r="1.7" fill="#FFFFFF" />
          <path
            d="M 37 40 L 48 43"
            stroke="#1C1917"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M 73 40 L 62 43"
            stroke="#1C1917"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
      );
    }
    return (
      <g>
        <circle cx="43" cy="48" r="4.8" fill="#1C1917" />
        <circle cx="67" cy="48" r="4.8" fill="#1C1917" />
        <circle cx="44.6" cy="46.2" r="1.8" fill="#FFFFFF" />
        <circle cx="68.6" cy="46.2" r="1.8" fill="#FFFFFF" />
      </g>
    );
  };

  const renderMouth = () => {
    if (buddy.species === 'toucan') {
      return (
        <g>
          <path
            d="M 55 48 C 72 48, 84 54, 80 63 C 74 66, 62 64, 55 59 Z"
            fill="#F59E0B"
            stroke="#1C1917"
            strokeWidth="2.4"
          />
          <path
            d="M 72 52 C 79 54, 82 58, 79 62"
            fill="#EF4444"
            stroke="#1C1917"
            strokeWidth="2"
          />
        </g>
      );
    }
    if (mood === 'oops') {
      return (
        <ellipse
          cx="55"
          cy="60"
          rx="4.2"
          ry="5.2"
          fill="#1C1917"
        />
      );
    }
    if (mood === 'celebrating' || mood === 'combo' || mood === 'happy') {
      return (
        <path
          d="M 47 57 Q 55 67 63 57 Z"
          fill="#F43F5E"
          stroke="#1C1917"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      );
    }
    return (
      <path
        d="M 48 58 Q 55 64 62 58"
        fill="none"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    );
  };

  const renderCape = () => {
    if (cape.id === 'none') return null;
    if (cape.id === 'vine_scarf') {
      return (
        <g>
          <path
            d="M 33 69 Q 55 78 77 69 L 73 79 Q 55 86 37 79 Z"
            fill={cape.accentColor}
            stroke="#1C1917"
            strokeWidth="2.2"
          />
          <path
            d="M 65 75 L 74 91 L 61 88 Z"
            fill="#22C55E"
            stroke="#1C1917"
            strokeWidth="2"
          />
        </g>
      );
    }
    if (cape.id === 'rainbow_mantle') {
      return (
        <g>
          <path
            d="M 31 70 Q 55 77 79 70 L 89 96 Q 55 104 21 96 Z"
            fill="#EC4899"
            stroke="#1C1917"
            strokeWidth="2.2"
          />
          <path d="M 36 73 L 30 96 L 80 96 L 74 73 Z" fill="#F59E0B" opacity="0.85" />
          <path d="M 43 74 L 40 97 L 70 97 L 67 74 Z" fill="#10B981" opacity="0.9" />
        </g>
      );
    }
    return (
      <path
        d="M 32 70 Q 55 77 78 70 L 87 95 Q 55 103 23 95 Z"
        fill={cape.accentColor}
        stroke="#1C1917"
        strokeWidth="2.2"
      />
    );
  };

  const renderHat = () => {
    if (hat.id === 'none') return null;
    if (hat.id === 'leaf_cap') {
      return (
        <g transform="translate(55, 22)">
          <path
            d="M 0 0 C -14 -14, -28 -6, -22 6 C -14 10, -4 6, 0 0 Z"
            fill="#22C55E"
            stroke="#1C1917"
            strokeWidth="2.2"
          />
          <path
            d="M 0 0 C 14 -15, 28 -4, 20 7 C 12 10, 4 6, 0 0 Z"
            fill="#16A34A"
            stroke="#1C1917"
            strokeWidth="2.2"
          />
          <line x1="0" y1="0" x2="0" y2="-10" stroke="#15803D" strokeWidth="2.4" />
        </g>
      );
    }
    if (hat.id === 'explorer_hat') {
      return (
        <g>
          <path
            d="M 32 28 C 34 11, 76 11, 78 28 Z"
            fill="#D97706"
            stroke="#1C1917"
            strokeWidth="2.3"
          />
          <ellipse
            cx="55"
            cy="28"
            rx="32"
            ry="6.5"
            fill="#B45309"
            stroke="#1C1917"
            strokeWidth="2.3"
          />
          <rect x="34" y="22" width="42" height="4.5" rx="2" fill="#FDE68A" />
        </g>
      );
    }
    if (hat.id === 'firefly_crown') {
      return (
        <g>
          <path
            d="M 33 27 L 39 14 L 48 23 L 55 10 L 62 23 L 71 14 L 77 27 Z"
            fill="#FBBF24"
            stroke="#1C1917"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="55" cy="10" r="3.5" fill="#FEF08A" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="39" cy="14" r="2.8" fill="#FEF08A" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="71" cy="14" r="2.8" fill="#FEF08A" stroke="#1C1917" strokeWidth="1.5" />
        </g>
      );
    }
    if (hat.id === 'bongo_feathers') {
      return (
        <g>
          <path d="M 46 24 C 38 6, 48 2, 52 22" fill="#EF4444" stroke="#1C1917" strokeWidth="2" />
          <path d="M 55 23 C 52 2, 62 2, 59 23" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />
          <path d="M 62 24 C 66 6, 74 10, 65 25" fill="#10B981" stroke="#1C1917" strokeWidth="2" />
          <rect
            x="33"
            y="22"
            width="44"
            height="7"
            rx="3.5"
            fill="#DC2626"
            stroke="#1C1917"
            strokeWidth="2.2"
          />
        </g>
      );
    }
    // canopy_crown
    return (
      <g>
        <path
          d="M 32 27 L 37 11 L 46 21 L 55 6 L 64 21 L 73 11 L 78 27 Z"
          fill="#EAB308"
          stroke="#1C1917"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
        <circle cx="55" cy="19" r="4" fill="#10B981" stroke="#1C1917" strokeWidth="1.8" />
        <circle cx="42" cy="21" r="2.6" fill="#06B6D4" stroke="#1C1917" strokeWidth="1.5" />
        <circle cx="68" cy="21" r="2.6" fill="#F43F5E" stroke="#1C1917" strokeWidth="1.5" />
      </g>
    );
  };

  const renderSpeciesFeatures = () => {
    switch (buddy.species) {
      case 'red_panda':
        return (
          <g>
            {/* Fluffy striped tail */}
            <path
              d="M 74 86 C 95 85, 102 66, 90 58 C 82 54, 76 64, 78 75"
              fill={palette.primary}
              stroke="#1C1917"
              strokeWidth="2.4"
            />
            <path d="M 87 65 L 95 69" stroke={palette.secondary} strokeWidth="4" strokeLinecap="round" />
            <path d="M 82 76 L 92 79" stroke={palette.secondary} strokeWidth="4" strokeLinecap="round" />
            {/* Ears */}
            <circle cx="33" cy="31" r="10" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.4" />
            <circle cx="33" cy="31" r="5" fill={palette.belly} />
            <circle cx="77" cy="31" r="10" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.4" />
            <circle cx="77" cy="31" r="5" fill={palette.belly} />
          </g>
        );
      case 'toucan':
        return (
          <g>
            {/* Wings */}
            <ellipse
              cx="29"
              cy="79"
              rx="8"
              ry="14"
              transform="rotate(14 29 79)"
              fill={palette.secondary}
              stroke="#1C1917"
              strokeWidth="2.3"
            />
            <ellipse
              cx="81"
              cy="79"
              rx="8"
              ry="14"
              transform="rotate(-14 81 79)"
              fill={palette.secondary}
              stroke="#1C1917"
              strokeWidth="2.3"
            />
            {/* Crest tuft */}
            <path
              d="M 48 25 C 52 15, 62 15, 63 25"
              fill={palette.secondary}
              stroke="#1C1917"
              strokeWidth="2.2"
            />
          </g>
        );
      case 'frog':
        return (
          <g>
            {/* Big frog eye bumps */}
            <circle cx="42" cy="32" r="11" fill={palette.primary} stroke="#1C1917" strokeWidth="2.4" />
            <circle cx="68" cy="32" r="11" fill={palette.primary} stroke="#1C1917" strokeWidth="2.4" />
            <circle cx="42" cy="32" r="6" fill="#FFFFFF" />
            <circle cx="68" cy="32" r="6" fill="#FFFFFF" />
          </g>
        );
      case 'capybara':
        return (
          <g>
            {/* Rounded ears */}
            <ellipse cx="34" cy="32" rx="7" ry="9" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.3" />
            <ellipse cx="76" cy="32" rx="7" ry="9" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.3" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 110 110"
        width={size}
        height={size}
        role="img"
        aria-label={`${buddy.name} the ${buddy.species.replace('_', ' ')}`}
      >
        {/* Soft shadow */}
        <ellipse cx="55" cy="102" rx="28" ry="5.5" fill="rgba(15, 61, 46, 0.22)" />

        {/* Back cape layer */}
        {renderCape()}

        {/* Species back features */}
        {renderSpeciesFeatures()}

        {/* Body */}
        <ellipse
          cx="55"
          cy="79"
          rx="24"
          ry="20"
          fill={palette.primary}
          stroke="#1C1917"
          strokeWidth="2.5"
        />
        <ellipse cx="55" cy="81" rx="15" ry="13" fill={palette.belly} />

        {/* Paws / Feet */}
        <ellipse cx="41" cy="96" rx="7" ry="4.5" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.2" />
        <ellipse cx="69" cy="96" rx="7" ry="4.5" fill={palette.secondary} stroke="#1C1917" strokeWidth="2.2" />

        {/* Head */}
        <ellipse
          cx="55"
          cy="49"
          rx={buddy.species === 'capybara' ? 27 : 25}
          ry={buddy.species === 'frog' ? 21 : 23}
          fill={palette.primary}
          stroke="#1C1917"
          strokeWidth="2.5"
        />

        {/* Facial patch */}
        {buddy.species === 'red_panda' && (
          <>
            <ellipse cx="42" cy="54" rx="8" ry="6" fill={palette.belly} />
            <ellipse cx="68" cy="54" rx="8" ry="6" fill={palette.belly} />
          </>
        )}
        {buddy.species === 'toucan' && (
          <ellipse cx="52" cy="50" rx="16" ry="13" fill={palette.belly} />
        )}
        {buddy.species === 'capybara' && (
          <ellipse cx="55" cy="56" rx="14" ry="10" fill={palette.secondary} opacity="0.35" />
        )}

        {/* Cheeks */}
        <circle cx="35" cy="55" r="4" fill="#FB7185" opacity="0.65" />
        <circle cx="75" cy="55" r="4" fill="#FB7185" opacity="0.65" />

        {/* Eyes & Mouth */}
        {renderEyes()}
        {buddy.species !== 'toucan' && buddy.species !== 'frog' && (
          <ellipse cx="55" cy="53.5" rx="3.8" ry="2.6" fill="#1C1917" />
        )}
        {renderMouth()}

        {/* Hat */}
        {renderHat()}
      </svg>
    </div>
  );
}

interface BuddyHudCardProps {
  buddy: BuddyConfig;
  mood: BuddyMood;
  message: string;
}

export function BuddyHudCard({ buddy, mood, message }: BuddyHudCardProps) {
  return (
    <div className="flex items-end gap-3 bg-white/95 backdrop-blur-sm border border-emerald-900/15 rounded-2xl p-3 shadow-md max-w-xs">
      <div className="shrink-0 bg-emerald-50 rounded-xl p-1 border border-emerald-200/70">
        <BuddyAvatar buddy={buddy} mood={mood} size={64} />
      </div>
      <div className="min-w-0 flex-1 pb-0.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <span className="truncate">{buddy.name}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-700 capitalize">
            {mood === 'oops' ? 'Steady!' : mood}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-800 leading-snug mt-0.5">
          {message}
        </p>
      </div>
    </div>
  );
}

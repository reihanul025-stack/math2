import React from 'react';
import { BadgeId, VisualTokenKind, WorldId } from '../types/game';

export const KikoExplorerIllustration: React.FC<{ className?: string }> = ({
  className = 'w-44 h-44',
}) => (
  <svg
    viewBox="0 0 220 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Kiko si Rubah Penjelajah Matematika"
  >
    <circle cx="110" cy="114" r="88" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="3" />
    <circle cx="168" cy="54" r="14" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
    <path
      d="M168 45L170.5 51.5L177 54L170.5 56.5L168 63L165.5 56.5L159 54L165.5 51.5L168 45Z"
      fill="#F59E0B"
    />

    <path
      d="M148 158C174 156 190 135 184 114C179 98 162 104 152 122C145 135 142 148 148 158Z"
      fill="#EA580C"
    />
    <path
      d="M184 114C181 103 171 102 163 110C168 117 175 121 183 121C184 119 184.5 116.5 184 114Z"
      fill="#FFFBEB"
    />

    <rect x="76" y="130" width="68" height="54" rx="24" fill="#F97316" />
    <path d="M92 132H128V182H92V132Z" fill="#FFFBEB" />
    <path d="M76 140C76 132 84 130 94 130V178H82C78 178 76 172 76 164V140Z" fill="#1D4ED8" />
    <path
      d="M144 140C144 132 136 130 126 130V178H138C142 178 144 172 144 164V140Z"
      fill="#1D4ED8"
    />

    <path d="M95 134L110 154L125 134" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
    <circle cx="110" cy="157" r="10" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
    <path d="M110 151L112.5 157L110 163L107.5 157L110 151Z" fill="#DC2626" />

    <path d="M62 84L52 38L92 62Z" fill="#EA580C" />
    <path d="M65 78L59 49L84 64Z" fill="#FDE68A" />
    <path d="M158 84L168 38L128 62Z" fill="#EA580C" />
    <path d="M155 78L161 49L136 64Z" fill="#FDE68A" />

    <ellipse cx="110" cy="58" rx="42" ry="10" fill="#D97706" />
    <path d="M80 56C80 39 93 30 110 30C127 30 140 39 140 56H80Z" fill="#F59E0B" />
    <rect x="82" y="50" width="56" height="6" rx="3" fill="#1E3A8A" />

    <path
      d="M58 98C58 72 80 56 110 56C140 56 162 72 162 98C162 122 140 138 110 138C80 138 58 122 58 98Z"
      fill="#F97316"
    />
    <path
      d="M58 102C68 96 86 100 98 114C104 121 106 130 110 138C80 138 58 122 58 102Z"
      fill="#FFFBEB"
    />
    <path
      d="M162 102C152 96 134 100 122 114C116 121 114 130 110 138C140 138 162 122 162 102Z"
      fill="#FFFBEB"
    />

    <circle cx="88" cy="96" r="7" fill="#0F172A" />
    <circle cx="86" cy="93.5" r="2.5" fill="#FFFFFF" />
    <circle cx="132" cy="96" r="7" fill="#0F172A" />
    <circle cx="130" cy="93.5" r="2.5" fill="#FFFFFF" />

    <ellipse cx="110" cy="110" rx="7" ry="5" fill="#0F172A" />
    <path d="M101 119C104 124 116 124 119 119" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

    <g transform="translate(26, 62)">
      <rect width="30" height="30" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
      <path d="M11 11L19 19M19 11L11 19" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" />
    </g>
    <g transform="translate(164, 148)">
      <rect width="30" height="30" rx="8" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="2" />
      <line x1="9" y1="15" x2="21" y2="15" stroke="#D97706" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="15" cy="10" r="2" fill="#D97706" />
      <circle cx="15" cy="20" r="2" fill="#D97706" />
    </g>
  </svg>
);

export const KikoPawnSvg: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Pion Kiko"
  >
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="3.5" />
    <path d="M16 26L13 12L26 20Z" fill="#EA580C" />
    <path d="M48 26L51 12L38 20Z" fill="#EA580C" />
    <ellipse cx="32" cy="34" rx="18" ry="15" fill="#F97316" />
    <path d="M14 36C20 33 26 36 32 49C21 49 14 43 14 36Z" fill="#FFFBEB" />
    <path d="M50 36C44 33 38 36 32 49C43 49 50 43 50 36Z" fill="#FFFBEB" />
    <circle cx="25" cy="32" r="2.8" fill="#0F172A" />
    <circle cx="39" cy="32" r="2.8" fill="#0F172A" />
    <ellipse cx="32" cy="38" rx="3.2" ry="2.3" fill="#0F172A" />
  </svg>
);

export const FriendlyMultiplyCharacterSvg: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16',
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="36" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="2.5" />
    <path
      d="M24 24L56 56M56 24L24 56"
      stroke="#16A34A"
      strokeWidth="13"
      strokeLinecap="round"
    />
    <circle cx="33" cy="35" r="4.2" fill="#FFFFFF" />
    <circle cx="47" cy="35" r="4.2" fill="#FFFFFF" />
    <circle cx="33.5" cy="35" r="2.1" fill="#0F172A" />
    <circle cx="47.5" cy="35" r="2.1" fill="#0F172A" />
    <path
      d="M35 45C37 48 43 48 45 45"
      stroke="#FFFFFF"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

export const FriendlyDivideCharacterSvg: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16',
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="36" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="2.5" />
    <rect x="18" y="34" width="44" height="12" rx="6" fill="#0284C7" />
    <circle cx="40" cy="21" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <circle cx="40" cy="59" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <circle cx="33" cy="40" r="3.4" fill="#FFFFFF" />
    <circle cx="47" cy="40" r="3.4" fill="#FFFFFF" />
    <circle cx="33.5" cy="40" r="1.7" fill="#0F172A" />
    <circle cx="47.5" cy="40" r="1.7" fill="#0F172A" />
  </svg>
);

export const FactFamilyBondSvg: React.FC<{
  a: number;
  b: number;
  className?: string;
}> = ({ a, b, className = 'w-full max-w-[260px]' }) => {
  const product = a * b;
  return (
    <svg viewBox="0 0 260 175" fill="none" className={className} role="img" aria-label={`Ikatan bilangan ${product}, ${a}, dan ${b}`}>
      {/* Connector Lines */}
      <line x1="130" y1="52" x2="68" y2="128" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="52" x2="192" y2="128" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
      <line x1="68" y1="128" x2="192" y2="128" stroke="#FDE68A" strokeWidth="4" strokeDasharray="6 6" />

      {/* Top Total Node */}
      <circle cx="130" cy="44" r="32" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
      <text
        x="130"
        y="51"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="22"
      >
        {product}
      </text>

      {/* Left Factor Node */}
      <circle cx="68" cy="130" r="27" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
      <text
        x="68"
        y="137"
        textAnchor="middle"
        fill="#78350F"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="20"
      >
        {a}
      </text>

      {/* Right Factor Node */}
      <circle cx="192" cy="130" r="27" fill="#DCFCE7" stroke="#10B981" strokeWidth="3" />
      <text
        x="192"
        y="137"
        textAnchor="middle"
        fill="#065F46"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="20"
      >
        {b}
      </text>

      {/* Operator Badges */}
      <circle cx="130" cy="128" r="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <text
        x="130"
        y="133"
        textAnchor="middle"
        fill="#475569"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="14"
      >
        ×
      </text>

      <circle cx="94" cy="88" r="12" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
      <text
        x="94"
        y="93"
        textAnchor="middle"
        fill="#1D4ED8"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="14"
      >
        ÷
      </text>

      <circle cx="166" cy="88" r="12" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
      <text
        x="166"
        y="93"
        textAnchor="middle"
        fill="#1D4ED8"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="14"
      >
        ÷
      </text>
    </svg>
  );
};

export const WorldEmblemSvg: React.FC<{ worldId: WorldId; className?: string }> = ({
  worldId,
  className = 'w-14 h-14',
}) => {
  if (worldId === 1) {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#ECFDF5" />
        <rect x="28" y="40" width="8" height="14" rx="2" fill="#92400E" />
        <circle cx="32" cy="26" r="14" fill="#10B981" />
        <circle cx="22" cy="32" r="10" fill="#059669" />
        <circle cx="42" cy="32" r="10" fill="#34D399" />
        <circle cx="27" cy="23" r="2.5" fill="#EF4444" />
        <circle cx="38" cy="28" r="2.5" fill="#EF4444" />
      </svg>
    );
  }
  if (worldId === 2) {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#FFFBEB" />
        <path
          d="M14 32L32 16L50 32V50H14V32Z"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M11 32L32 14L53 32"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="27" y="36" width="10" height="14" rx="3" fill="#D97706" />
        <circle cx="32" cy="26" r="4" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
      </svg>
    );
  }
  if (worldId === 3) {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#F0F9FF" />
        <path d="M12 48C18 42 46 42 52 48H12Z" fill="#FCD34D" />
        <path
          d="M8 50C16 47 24 53 32 50C40 47 48 53 56 50"
          stroke="#0284C7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M32 43C32 33 35 25 39 19" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M39 19C31 17 24 21 22 26C28 24 34 23 39 19Z" fill="#10B981" />
        <path d="M39 19C46 17 52 22 53 28C48 25 43 23 39 19Z" fill="#059669" />
        <path d="M39 19C36 12 43 10 49 13C44 15 41 16 39 19Z" fill="#34D399" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#EEF2FF" />
      <rect
        x="16"
        y="26"
        width="32"
        height="24"
        rx="2"
        fill="#C7D2FE"
        stroke="#4F46E5"
        strokeWidth="2.5"
      />
      <rect
        x="14"
        y="18"
        width="10"
        height="32"
        rx="2"
        fill="#E0E7FF"
        stroke="#4F46E5"
        strokeWidth="2.5"
      />
      <rect
        x="40"
        y="18"
        width="10"
        height="32"
        rx="2"
        fill="#E0E7FF"
        stroke="#4F46E5"
        strokeWidth="2.5"
      />
      <path d="M14 18L19 11L24 18H14Z" fill="#6366F1" />
      <path d="M40 18L45 11L50 18H40Z" fill="#6366F1" />
      <path d="M27 50V39C27 36.2 29.2 34 32 34C34.8 34 37 36.2 37 39V50H27Z" fill="#4338CA" />
      <path
        d="M32 14V26M32 14L40 17L32 20"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DiceSvg: React.FC<{ value: number | null; rolling: boolean; className?: string }> = ({
  value,
  rolling,
  className = 'w-20 h-20',
}) => {
  const pipCoords: Record<number, Array<[number, number]>> = {
    1: [[32, 32]],
    2: [
      [20, 20],
      [44, 44],
    ],
    3: [
      [20, 20],
      [32, 32],
      [44, 44],
    ],
    4: [
      [20, 20],
      [44, 20],
      [20, 44],
      [44, 44],
    ],
    5: [
      [20, 20],
      [44, 20],
      [32, 32],
      [20, 44],
      [44, 44],
    ],
    6: [
      [20, 18],
      [44, 18],
      [20, 32],
      [44, 32],
      [20, 46],
      [44, 46],
    ],
  };

  const activeValue = value && pipCoords[value] ? value : 5;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${className} ${rolling ? 'animate-dice-shake' : ''}`}
      role="img"
      aria-label={value ? `Dadu angka ${value}` : 'Dadu siap dilempar'}
    >
      <rect x="6" y="8" width="52" height="52" rx="14" fill="#CBD5E1" />
      <rect x="6" y="4" width="52" height="52" rx="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      {pipCoords[activeValue].map(([cx, cy], idx) => (
        <circle
          key={idx}
          cx={cx}
          cy={cy - 2}
          r="4.6"
          fill={activeValue === 1 || activeValue === 4 ? '#DC2626' : '#1E3A8A'}
        />
      ))}
    </svg>
  );
};

export const VisualItemToken: React.FC<{
  kind: VisualTokenKind;
  className?: string;
}> = ({ kind, className = 'w-5 h-5' }) => {
  switch (kind) {
    case 'apple':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 6C12 4 13.5 2.5 15.5 2.5" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="14" r="7.5" fill="#EF4444" />
          <circle cx="9.5" cy="11.5" r="1.8" fill="#FCA5A5" />
        </svg>
      );
    case 'cookie':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <circle cx="9" cy="10" r="1.3" fill="#451A03" />
          <circle cx="14.5" cy="9.5" r="1.3" fill="#451A03" />
          <circle cx="12.5" cy="14.5" r="1.4" fill="#451A03" />
          <circle cx="8.5" cy="14.5" r="1.1" fill="#451A03" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3L14.7 8.5L20.8 9.4L16.4 13.7L17.4 19.8L12 16.9L6.6 19.8L7.6 13.7L3.2 9.4L9.3 8.5L12 3Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="1.3"
          />
        </svg>
      );
    case 'candy':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 8L7.5 12L3 16V8Z" fill="#EC4899" />
          <path d="M21 8L16.5 12L21 16V8Z" fill="#EC4899" />
          <circle cx="12" cy="12" r="5.5" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
        </svg>
      );
    case 'pencil':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="9" y="4" width="6" height="13" rx="1" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          <path d="M9 17L12 21L15 17H9Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
        </svg>
      );
    case 'orange':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="13" r="7.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.4" />
          <path d="M12 5.5C13.5 3.5 15.5 3.5 16.5 4.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="7" r="3.5" fill="#FBBF24" />
          <circle cx="17" cy="12" r="3.5" fill="#FBBF24" />
          <circle cx="12" cy="17" r="3.5" fill="#FBBF24" />
          <circle cx="7" cy="12" r="3.5" fill="#FBBF24" />
          <circle cx="12" cy="12" r="3.2" fill="#92400E" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="5" y="4" width="14" height="16" rx="2" fill="#2563EB" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M8 4V20" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="11" y1="9" x2="16" y2="9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="12.5" x2="15" y2="12.5" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.6" />
          <path d="M9 9C10.5 7.5 13 8 14.5 10" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const BadgeEmblemSvg: React.FC<{ id: BadgeId; unlocked: boolean; className?: string }> = ({
  id,
  unlocked,
  className = 'w-12 h-12',
}) => {
  const palette = unlocked
    ? { bg: '#FEF3C7', stroke: '#D97706', fg: '#B45309' }
    : { bg: '#F1F5F9', stroke: '#CBD5E1', fg: '#94A3B8' };

  return (
    <svg viewBox="0 0 56 56" fill="none" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill={palette.bg} stroke={palette.stroke} strokeWidth="2.5" />
      {id === 'first_step' && (
        <path
          d="M28 38V20M28 24C22 24 19 20 19 16C24 16 28 19 28 24ZM28 28C34 28 37 24 37 20C32 20 28 23 28 28Z"
          stroke={palette.fg}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {id === 'math_explorer' && (
        <>
          <circle cx="28" cy="28" r="12" stroke={palette.fg} strokeWidth="2.5" />
          <path d="M24 32L26.5 26.5L32 24L29.5 29.5L24 32Z" fill={palette.fg} />
        </>
      )}
      {id === 'perkalian_hero' && (
        <path d="M21 21L35 35M35 21L21 35" stroke={palette.fg} strokeWidth="3.5" strokeLinecap="round" />
      )}
      {id === 'division_hero' && (
        <>
          <line x1="19" y1="28" x2="37" y2="28" stroke={palette.fg} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="28" cy="20" r="2.8" fill={palette.fg} />
          <circle cx="28" cy="36" r="2.8" fill={palette.fg} />
        </>
      )}
      {id === 'star_collector' && (
        <path
          d="M28 15L31.6 22.4L39.8 23.6L33.9 29.3L35.3 37.5L28 33.6L20.7 37.5L22.1 29.3L16.2 23.6L24.4 22.4L28 15Z"
          fill={unlocked ? '#F59E0B' : 'none'}
          stroke={palette.fg}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      )}
      {id === 'math_king' && (
        <path
          d="M17 36H39L41 22L33 27L28 18L23 27L15 22L17 36Z"
          fill={unlocked ? '#F59E0B' : 'none'}
          stroke={palette.fg}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

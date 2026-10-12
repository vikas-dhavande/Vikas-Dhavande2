'use client';

import React, { useMemo } from 'react';

export interface BlobatarConfig {
  animate?: 'hover' | 'always' | 'none';
  seed?: string;
  colors?: string[];
}

export interface BlobatarProps {
  name?: string;
  id?: string;
  src?: string;
  size?: number | string;
  className?: string;
  blobatar?: BlobatarConfig;
}

// Deterministic string hasher (djb2)
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Curated vibrant color palettes in OKLCH / modern RGB
const COLOR_PALETTES = [
  ['#6366f1', '#a855f7', '#ec4899'], // Indigo - Purple - Pink
  ['#3b82f6', '#06b6d4', '#10b981'], // Blue - Cyan - Emerald
  ['#f59e0b', '#ef4444', '#ec4899'], // Amber - Red - Pink
  ['#8b5cf6', '#d946ef', '#06b6d4'], // Violet - Fuchsia - Cyan
  ['#10b981', '#14b8a6', '#0284c7'], // Emerald - Teal - Sky
  ['#f43f5e', '#fb923c', '#eab308'], // Rose - Orange - Yellow
];

export function Blobatar({
  name = 'Anonymous',
  id,
  src,
  size = 40,
  className = '',
  blobatar = { animate: 'hover' },
}: BlobatarProps) {
  const seedString = id || name || 'blobatar';

  const { palette, points, eyeStyle, mouthPath } = useMemo(() => {
    const hash = hashString(seedString);
    const pal = COLOR_PALETTES[hash % COLOR_PALETTES.length];

    // Generate 6 organic control points for fluid polygon/bezier blob
    const numPoints = 6;
    const baseRadius = 38;
    const pts: [number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      // Deterministic offset based on char codes
      const offset = ((hash >> (i * 3)) & 15) - 7;
      const r = baseRadius + offset;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      pts.push([Math.round(x), Math.round(y)]);
    }

    // Determine eye / personality features
    const eyeVariation = (hash >> 4) % 3;
    const mouthVariation = (hash >> 8) % 3;

    return {
      palette: pal,
      points: pts,
      eyeStyle: eyeVariation,
      mouthPath: mouthVariation,
    };
  }, [seedString]);

  // Generate smooth closed spline path
  const pathData = useMemo(() => {
    if (points.length < 3) return '';
    let d = `M ${points[0][0]},${points[0][1]} `;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const midX = (p1[0] + p2[0]) / 2;
      const midY = (p1[1] + p2[1]) / 2;
      d += `Q ${p1[0]},${p1[1]} ${midX},${midY} `;
    }
    d += 'Z';
    return d;
  }, [points]);

  const animationClass =
    blobatar.animate === 'hover'
      ? 'transition-transform duration-300 ease-out hover:scale-110 hover:rotate-6 cursor-pointer'
      : blobatar.animate === 'always'
      ? 'animate-pulse'
      : '';

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none rounded-full overflow-hidden ${animationClass} ${className}`}
      style={{ width: dimension, height: dimension }}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${hashString(seedString)}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette[0]} />
            <stop offset="50%" stopColor={palette[1]} />
            <stop offset="100%" stopColor={palette[2]} />
          </linearGradient>
          <filter id={`shadow-${hashString(seedString)}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Organic Fluid Blob */}
        <path
          d={pathData}
          fill={`url(#grad-${hashString(seedString)})`}
          filter={`url(#shadow-${hashString(seedString)})`}
        />

        {/* Inner Highlight Reflection */}
        <ellipse cx="38" cy="32" rx="12" ry="6" transform="rotate(-30 38 32)" fill="white" fillOpacity="0.35" />

        {/* Personality Eyes */}
        {eyeStyle === 0 && (
          // Happy closed curved eyes
          <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 36,46 Q 42,40 48,46" />
            <path d="M 54,46 Q 60,40 66,46" />
          </g>
        )}
        {eyeStyle === 1 && (
          // Playful dot eyes with pupils
          <g fill="#ffffff">
            <circle cx="42" cy="46" r="4.5" />
            <circle cx="60" cy="46" r="4.5" />
            <circle cx="43" cy="45" r="1.5" fill="#1e1b4b" />
            <circle cx="61" cy="45" r="1.5" fill="#1e1b4b" />
          </g>
        )}
        {eyeStyle === 2 && (
          // Winking eyes
          <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 36,46 Q 42,41 48,46" />
            <circle cx="60" cy="45" r="4" fill="#ffffff" stroke="none" />
          </g>
        )}

        {/* Personality Mouth */}
        {mouthPath === 0 && (
          <path d="M 44,57 Q 51,64 58,57" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
        {mouthPath === 1 && (
          <circle cx="51" cy="58" r="2.5" fill="#ffffff" />
        )}
        {mouthPath === 2 && (
          <path d="M 46,58 Q 51,61 56,58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
}

export default Blobatar;

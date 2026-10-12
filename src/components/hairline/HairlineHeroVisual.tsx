'use client';

import React, { useState } from 'react';
import { SemiconductorFigure } from './SemiconductorFigure';
import { HairlineFigure } from './HairlineFigure';
import { Flex } from '@/once-ui/components';

export function HairlineHeroVisual() {
  const [mode, setMode] = useState<'semiconductor' | 'hairline'>('semiconductor');

  return (
    <div className="flex flex-col items-center w-full max-w-[420px]">
      <Flex gap="8" marginBottom="12" horizontal="center">
        <button
          type="button"
          onClick={() => setMode('semiconductor')}
          className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
            mode === 'semiconductor'
              ? 'bg-neutral-strong text-neutral-on-solid-strong border-neutral-strong font-semibold shadow-sm'
              : 'bg-surface text-neutral-weak hover:text-neutral-strong border-neutral-medium'
          }`}
        >
          Silicon Die Simulation
        </button>
        <button
          type="button"
          onClick={() => setMode('hairline')}
          className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
            mode === 'hairline'
              ? 'bg-neutral-strong text-neutral-on-solid-strong border-neutral-strong font-semibold shadow-sm'
              : 'bg-surface text-neutral-weak hover:text-neutral-strong border-neutral-medium'
          }`}
        >
          3D Isometric Hairline
        </button>
      </Flex>

      {mode === 'semiconductor' ? (
        <SemiconductorFigure />
      ) : (
        <HairlineFigure className="w-full" />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Terrain, Cabinet, Hub, Branches, Exploded, Terminal } from '@lucasmarkes/hairline/react';
import { Flex, Text } from '@/once-ui/components';

export type HairlinePreset = 'terrain' | 'cabinet' | 'hub' | 'branches' | 'exploded' | 'terminal';

interface HairlineFigureProps {
  initialPreset?: HairlinePreset;
  className?: string;
  intensity?: number;
}

const PRESETS: { id: HairlinePreset; label: string; component: typeof Terrain }[] = [
  { id: 'terrain', label: '3D Terrain', component: Terrain },
  { id: 'cabinet', label: 'Server Blade Rack', component: Cabinet },
  { id: 'hub', label: 'Distributed Hub', component: Hub },
  { id: 'branches', label: 'Git Graph', component: Branches },
  { id: 'exploded', label: 'System Layers', component: Exploded },
  { id: 'terminal', label: 'Console', component: Terminal },
];

export function HairlineFigure({
  initialPreset = 'terrain',
  className = '',
  intensity = 0.65,
}: HairlineFigureProps) {
  const [activePreset, setActivePreset] = useState<HairlinePreset>(initialPreset);

  const current = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];
  const FigureComponent = current.component;

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border border-neutral-medium shadow-l ${className}`}>
      {/* Top preset selector */}
      <Flex gap="8" marginBottom="12" horizontal="center" wrap fillWidth>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePreset(p.id)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all border ${
              activePreset === p.id
                ? 'bg-neutral-strong text-neutral-on-solid-strong border-neutral-strong font-semibold shadow-sm'
                : 'bg-surface text-neutral-weak hover:text-neutral-strong border-neutral-medium hover:border-neutral-strong'
            }`}
          >
            {p.label}
          </button>
        ))}
      </Flex>

      {/* 3D Hairline Canvas */}
      <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center overflow-hidden">
        <FigureComponent
          intensity={intensity}
          play={true}
          theme="auto"
          className="w-full h-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
        />
      </div>

      <Flex marginTop="12" horizontal="center">
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Interactive 3D Isometric Mesh • Hover or drag cursor to articulate
        </Text>
      </Flex>
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface SemiconductorFigureProps {
  className?: string;
}

export function SemiconductorFigure({ className = '' }: SemiconductorFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [smoothTilt, setSmoothTilt] = useState<{ rx: number; ry: number; lift: number }>({
    rx: 0,
    ry: 0,
    lift: 0,
  });
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  // Smooth pointer interpolation loop
  useEffect(() => {
    let animId: number;
    const targetRx = pointer.active ? (pointer.y / 150) * -8 : 0;
    const targetRy = pointer.active ? (pointer.x / 150) * 12 : 0;
    const targetLift = pointer.active ? 14 : 0;

    const animate = () => {
      setSmoothTilt((prev) => {
        const nextRx = prev.rx + (targetRx - prev.rx) * 0.12;
        const nextRy = prev.ry + (targetRy - prev.ry) * 0.12;
        const nextLift = prev.lift + (targetLift - prev.lift) * 0.12;
        return { rx: nextRx, ry: nextRy, lift: nextLift };
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [pointer]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPointer({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointer({ x: 0, y: 0, active: false });
    setActiveBlock(null);
  }, []);

  // Isometric projection helper (30 degree isometric angle)
  // [u, v, z] in world coords -> [X, Y] in SVG canvas
  const ISO_COS = 0.866025; // cos(30 deg)
  const ISO_SIN = 0.5; // sin(30 deg)
  const CX = 250;
  const CY = 220;

  const project = (u: number, v: number, z: number): [number, number] => {
    const x = CX + (u - v) * ISO_COS;
    const y = CY + (u + v) * ISO_SIN - z;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  };

  const toPath = (pts: [number, number][], closed = true): string => {
    if (pts.length === 0) return '';
    const d = `M ${pts[0][0]},${pts[0][1]} ` + pts.slice(1).map((p) => `L ${p[0]},${p[1]}`).join(' ');
    return closed ? `${d} Z` : d;
  };

  const lift = smoothTilt.lift;

  // Base Package (Carrier Board)
  const pkgBase = [
    project(-140, -140, 0),
    project(140, -140, 0),
    project(140, 140, 0),
    project(-140, 140, 0),
  ];
  const pkgTop = [
    project(-140, -140, 12),
    project(140, -140, 12),
    project(140, 140, 12),
    project(-140, 140, 12),
  ];

  // Silicon Interposer Layer
  const interposerBase = [
    project(-110, -110, 12 + lift * 0.3),
    project(110, -110, 12 + lift * 0.3),
    project(110, 110, 12 + lift * 0.3),
    project(-110, 110, 12 + lift * 0.3),
  ];
  const interposerTop = [
    project(-110, -110, 18 + lift * 0.3),
    project(110, -110, 18 + lift * 0.3),
    project(110, 110, 18 + lift * 0.3),
    project(-110, 110, 18 + lift * 0.3),
  ];

  // Elevated Silicon Die (Microprocessor Core)
  const dieZ = 24 + lift;
  const dieH = 14;
  const dieBase = [
    project(-75, -75, dieZ),
    project(75, -75, dieZ),
    project(75, 75, dieZ),
    project(-75, 75, dieZ),
  ];
  const dieTop = [
    project(-75, -75, dieZ + dieH),
    project(75, -75, dieZ + dieH),
    project(75, 75, dieZ + dieH),
    project(-75, 75, dieZ + dieH),
  ];

  // Microarchitectural Core Blocks on Die Surface
  const coreBlocks = [
    { id: 'ALU-0', u: -60, v: -60, w: 50, h: 50, label: 'Neural / AI Core' },
    { id: 'ALU-1', u: 10, v: -60, w: 50, h: 50, label: 'Compute Core 0' },
    { id: 'L3-CACHE', u: -60, v: 10, w: 50, h: 50, label: 'Shared L3 Cache' },
    { id: 'IO-SYS', u: 10, v: 10, w: 50, h: 50, label: 'PCIe / Memory Controller' },
  ];

  // Traces radiating outward
  const tracePins = [
    [-110, -80], [-110, -40], [-110, 0], [-110, 40], [-110, 80],
    [110, -80], [110, -40], [110, 0], [110, 40], [110, 80],
    [-80, -110], [-40, -110], [0, -110], [40, -110], [80, -110],
    [-80, 110], [-40, 110], [0, 110], [40, 110], [80, 110],
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[500px] aspect-[5/4] select-none flex flex-col items-center justify-center transition-transform duration-300 ease-out cursor-crosshair ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${smoothTilt.rx}deg) rotateY(${smoothTilt.ry}deg)`,
      }}
    >
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="traceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
          <filter id="siliconGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- PACKAGE BASE (Carrier Substrate) --- */}
        <polygon
          points={pkgBase.map((p) => p.join(',')).join(' ')}
          className="fill-muted/20 stroke-border"
          strokeWidth="1.2"
        />
        {/* Package Extrusion Walls */}
        <path
          d={`M ${pkgBase[1][0]},${pkgBase[1][1]} L ${pkgTop[1][0]},${pkgTop[1][1]} L ${pkgTop[2][0]},${pkgTop[2][1]} L ${pkgBase[2][0]},${pkgBase[2][1]} Z`}
          className="fill-muted/40 stroke-border"
          strokeWidth="1.2"
        />
        <path
          d={`M ${pkgBase[2][0]},${pkgBase[2][1]} L ${pkgTop[2][0]},${pkgTop[2][1]} L ${pkgTop[3][0]},${pkgTop[3][1]} L ${pkgBase[3][0]},${pkgBase[3][1]} Z`}
          className="fill-muted/50 stroke-border"
          strokeWidth="1.2"
        />
        <polygon
          points={pkgTop.map((p) => p.join(',')).join(' ')}
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />

        {/* Carrier PCB Trace Circuits */}
        {tracePins.map(([px, py], idx) => {
          const start = project(px, py, 13);
          const mid = project(px * 0.75, py * 0.75, 13);
          const end = project(px * 0.5, py * 0.5, 13 + lift * 0.3);
          return (
            <path
              key={`trace-${idx}`}
              d={`M ${start[0]},${start[1]} L ${mid[0]},${mid[1]} L ${end[0]},${end[1]}`}
              className="stroke-foreground/30 hover:stroke-foreground transition-colors duration-200"
              strokeWidth={idx % 2 === 0 ? '1.4' : '0.8'}
              strokeDasharray={idx % 3 === 0 ? '3,3' : undefined}
            />
          );
        })}

        {/* --- INTERPOSER LAYER --- */}
        <path
          d={`M ${interposerBase[2][0]},${interposerBase[2][1]} L ${interposerTop[2][0]},${interposerTop[2][1]} L ${interposerTop[3][0]},${interposerTop[3][1]} L ${interposerBase[3][0]},${interposerBase[3][1]} Z`}
          className="fill-muted/60 stroke-border"
          strokeWidth="1.2"
        />
        <polygon
          points={interposerTop.map((p) => p.join(',')).join(' ')}
          className="fill-card/90 stroke-border"
          strokeWidth="1.4"
        />

        {/* --- SILICON DIE (Microprocessor CPU/SoC) --- */}
        {/* Die Side Walls */}
        <path
          d={`M ${dieBase[1][0]},${dieBase[1][1]} L ${dieTop[1][0]},${dieTop[1][1]} L ${dieTop[2][0]},${dieTop[2][1]} L ${dieBase[2][0]},${dieBase[2][1]} Z`}
          className="fill-muted/70 stroke-foreground/40"
          strokeWidth="1.6"
        />
        <path
          d={`M ${dieBase[2][0]},${dieBase[2][1]} L ${dieTop[2][0]},${dieTop[2][1]} L ${dieTop[3][0]},${dieTop[3][1]} L ${dieBase[3][0]},${dieBase[3][1]} Z`}
          className="fill-muted/90 stroke-foreground/50"
          strokeWidth="1.6"
        />

        {/* Die Top Surface */}
        <polygon
          points={dieTop.map((p) => p.join(',')).join(' ')}
          className="fill-background stroke-foreground"
          strokeWidth="2"
        />

        {/* Microarchitectural Processing Blocks */}
        {coreBlocks.map((blk) => {
          const z = dieZ + dieH + 0.5;
          const b0 = project(blk.u, blk.v, z);
          const b1 = project(blk.u + blk.w, blk.v, z);
          const b2 = project(blk.u + blk.w, blk.v + blk.h, z);
          const b3 = project(blk.u, blk.v + blk.h, z);
          const isHovered = activeBlock === blk.id;

          return (
            <g
              key={blk.id}
              className="cursor-pointer"
              onMouseEnter={() => setActiveBlock(blk.id)}
            >
              <polygon
                points={`${b0[0]},${b0[1]} ${b1[0]},${b1[1]} ${b2[0]},${b2[1]} ${b3[0]},${b3[1]}`}
                className={`${
                  isHovered ? 'fill-primary/20 stroke-primary' : 'fill-muted/30 stroke-foreground/60'
                } transition-all duration-150`}
                strokeWidth={isHovered ? '2' : '1.2'}
              />
              {/* Internal Bus Lines */}
              <line
                x1={b0[0] + (b1[0] - b0[0]) * 0.5}
                y1={b0[1] + (b1[1] - b0[1]) * 0.5}
                x2={b3[0] + (b2[0] - b3[0]) * 0.5}
                y2={b3[1] + (b2[1] - b3[1]) * 0.5}
                className="stroke-foreground/25"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
            </g>
          );
        })}

        {/* Central Core Interconnect Hub */}
        <circle
          cx={project(0, 0, dieZ + dieH + 1)[0]}
          cy={project(0, 0, dieZ + dieH + 1)[1]}
          r={pointer.active ? '5' : '3.5'}
          className="fill-foreground stroke-background transition-all duration-200"
          strokeWidth="1.5"
        />
      </svg>

      {/* Dynamic Telemetry / Status Overlay */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[420px] px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DIE: 6nm FINFET SILICON</span>
        </div>
        <div>
          {activeBlock
            ? coreBlocks.find((b) => b.id === activeBlock)?.label
            : pointer.active
            ? `INTERCONNECT: DELTA (${Math.round(pointer.x)}, ${Math.round(pointer.y)})`
            : 'POINTER IDLE — REST POSE'}
        </div>
      </div>
    </div>
  );
}

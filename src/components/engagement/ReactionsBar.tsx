'use client';

import React, { useState } from 'react';

export type EmojiType = '👍' | '❤️' | '🔥' | '🚀' | '🤯';

interface ReactionsBarProps {
  targetId: string;
  initialCounts?: Record<EmojiType, number>;
  userReaction?: EmojiType | null;
  isAuthenticated?: boolean;
  onReact?: (emoji: EmojiType) => void;
  onRequireAuth?: () => void;
}

const EMOJI_OPTIONS: { emoji: EmojiType; label: string }[] = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🤯', label: 'Mind-Blown' },
];

export function ReactionsBar({
  targetId,
  initialCounts = { '👍': 12, '❤️': 8, '🔥': 15, '🚀': 9, '🤯': 4 },
  userReaction = null,
  isAuthenticated = false,
  onReact,
  onRequireAuth,
}: ReactionsBarProps) {
  const [counts, setCounts] = useState<Record<EmojiType, number>>(initialCounts);
  const [activeReaction, setActiveReaction] = useState<EmojiType | null>(userReaction);

  const handleClick = (emoji: EmojiType) => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (activeReaction === emoji) {
      // Toggle off
      setActiveReaction(null);
      setCounts((prev) => ({ ...prev, [emoji]: Math.max(0, prev[emoji] - 1) }));
    } else {
      // Toggle on or switch
      setCounts((prev) => {
        const next = { ...prev };
        if (activeReaction) {
          next[activeReaction] = Math.max(0, next[activeReaction] - 1);
        }
        next[emoji] = (next[emoji] || 0) + 1;
        return next;
      });
      setActiveReaction(emoji);
    }

    if (onReact) onReact(emoji);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-4 rounded-xl bg-muted/40 border border-border w-fit my-4">
      <span className="text-xs font-mono text-muted-foreground mr-1">REACTIONS</span>
      {EMOJI_OPTIONS.map(({ emoji, label }) => {
        const isSelected = activeReaction === emoji;
        const count = counts[emoji] || 0;

        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
            aria-label={`${label} (${count})`}
            aria-pressed={isSelected}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-all duration-150 border ${
              isSelected
                ? 'bg-primary/10 border-primary/40 text-primary font-medium scale-105 shadow-sm'
                : 'bg-background hover:bg-muted border-border text-foreground hover:scale-102'
            }`}
          >
            <span className="text-base select-none">{emoji}</span>
            <span className="text-xs font-mono">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { Player } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  players: Player[];
  currentIndex: number;
  winCondition: number;
}

export function ScoreBar({ players, currentIndex, winCondition }: ScoreBarProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {players.map((player, i) => (
        <div
          key={player.id}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
            i === currentIndex ? "bg-white/20 ring-2 ring-violet-400" : "bg-white/5"
          )}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: player.color }} />
          <span className="text-white/80 font-medium">{player.name}</span>
          <span className="text-white/50 tabular-nums">{player.timeline.length}/{winCondition}</span>
        </div>
      ))}
    </div>
  );
}

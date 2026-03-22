"use client";

import { Player } from "@/types/game";
import { Timeline } from "@/components/game/Timeline";

interface PlayerTimelineProps {
  player: Player;
}

export function PlayerTimeline({ player }: PlayerTimelineProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
        <h3 className="text-white font-semibold">{player.name}</h3>
        <span className="text-white/40 text-sm ml-auto">{player.timeline.length} cards</span>
      </div>
      <Timeline songs={player.timeline} />
    </div>
  );
}

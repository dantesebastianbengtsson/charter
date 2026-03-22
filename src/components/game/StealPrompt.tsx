"use client";

import { Player, Song } from "@/types/game";
import { Timeline } from "./Timeline";
import { Button } from "@/components/ui/Button";

interface StealPromptProps {
  stealer: Player;
  song: Song;
  onSteal: (insertIndex: number) => void;
  onDecline: () => void;
}

export function StealPrompt({
  stealer,
  song,
  onSteal,
  onDecline,
}: StealPromptProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stealer.color }}
          />
          <h3 className="text-lg font-bold text-white">
            {stealer.name} can steal!
          </h3>
        </div>
        <p className="text-white/50 text-sm">
          Place &quot;{song.title}&quot; ({song.year}) on your timeline, or pass
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-3">
        <p className="text-white/40 text-xs mb-2 text-center">
          {stealer.name}&apos;s Timeline
        </p>
        <Timeline songs={stealer.timeline} onPlace={onSteal} interactive />
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onDecline}>
          Pass
        </Button>
      </div>
    </div>
  );
}

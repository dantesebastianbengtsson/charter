"use client";

import { useGame } from "@/hooks/useGame";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WinnerAnnouncement } from "@/components/results/WinnerAnnouncement";
import { PlayerTimeline } from "@/components/results/PlayerTimeline";
import { Button } from "@/components/ui/Button";

export default function ResultsPage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.phase !== "finished") {
      router.replace("/");
    }
  }, [state.phase, router]);

  if (state.phase !== "finished") return null;

  const handlePlayAgain = () => {
    dispatch({ type: "RESET_GAME" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <WinnerAnnouncement
          players={state.players}
          winCondition={state.winCondition}
        />

        <h2 className="text-white/50 text-sm font-semibold uppercase tracking-wider text-center">
          Final Timelines
        </h2>

        <div className="space-y-4">
          {[...state.players]
            .sort((a, b) => b.timeline.length - a.timeline.length)
            .map((player) => (
              <PlayerTimeline key={player.id} player={player} />
            ))}
        </div>

        <div className="text-center pt-4 pb-8">
          <Button size="lg" onClick={handlePlayAgain}>
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useGame } from "@/hooks/useGame";
import { useAudio } from "@/hooks/useAudio";
import { TurnBanner } from "./TurnBanner";
import { ScoreBar } from "./ScoreBar";
import { MysteryCard } from "./MysteryCard";
import { AudioPlayer } from "./AudioPlayer";
import { Timeline } from "./Timeline";
import { ResultFeedback } from "./ResultFeedback";
import { StealPrompt } from "./StealPrompt";

export function GameBoard() {
  const { state, dispatch } = useGame();
  const audio = useAudio();

  const currentPlayer = state.players[state.currentPlayerIndex];
  const stealingPlayer =
    state.stealingPlayerIndex !== null ? state.players[state.stealingPlayerIndex] : null;

  const handlePlace = (insertIndex: number) => {
    audio.stop();
    dispatch({ type: "PLACE_CARD", insertIndex });
  };

  const handleSteal = (insertIndex: number) => {
    dispatch({ type: "STEAL_CARD", insertIndex });
  };

  const handleNextTurn = () => {
    dispatch({ type: "NEXT_TURN" });
  };

  const hasPreview = !!state.currentSong?.previewUrl;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      <div className="px-4 pt-6 pb-4 space-y-3">
        <TurnBanner player={currentPlayer} cardsLeft={state.deck.length} />
        <ScoreBar players={state.players} currentIndex={state.currentPlayerIndex} winCondition={state.winCondition} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <MysteryCard song={state.currentSong} isRevealed={state.isRevealed} />
        {state.phase === "playing" && (
          <AudioPlayer
            isPlaying={audio.isPlaying}
            progress={audio.progress}
            onToggle={() => state.currentSong && audio.toggle(state.currentSong.previewUrl)}
            disabled={!hasPreview}
          />
        )}
      </div>

      <div className="px-4 pb-8 space-y-4">
        {state.phase === "playing" && (
          <>
            <p className="text-center text-white/50 text-sm">Tap a slot to place this song on your timeline</p>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-2 text-center">{currentPlayer.name}&apos;s Timeline</p>
              <Timeline songs={currentPlayer.timeline} onPlace={handlePlace} interactive />
            </div>
          </>
        )}

        {state.phase === "stealing" && stealingPlayer && state.currentSong && (
          <StealPrompt
            stealer={stealingPlayer}
            song={state.currentSong}
            onSteal={handleSteal}
            onDecline={() => dispatch({ type: "DECLINE_STEAL" })}
          />
        )}

        {state.phase === "feedback" && (
          <ResultFeedback result={state.placementResult} onContinue={handleNextTurn} />
        )}
      </div>
    </div>
  );
}

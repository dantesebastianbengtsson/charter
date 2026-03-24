"use client";

import { useGame } from "@/hooks/useGame";
import { useAudio } from "@/hooks/useAudio";
import { motion } from "framer-motion";
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
    state.stealingPlayerIndex !== null
      ? state.players[state.stealingPlayerIndex]
      : null;

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

  const hasPreview = !!state.currentSong?.deezerId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 space-y-3">
        <TurnBanner player={currentPlayer} cardsLeft={state.deck.length} isSuddenDeath={state.isSuddenDeath} />
        <ScoreBar
          players={state.players}
          currentIndex={state.currentPlayerIndex}
          winCondition={state.winCondition}
          eliminatedPlayerIds={state.eliminatedPlayerIds}
        />
      </div>

      {/* Mystery Card + Audio */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <MysteryCard key={state.currentSong?.deezerId ?? state.currentPlayerIndex} song={state.currentSong} isRevealed={state.isRevealed} />
        {(state.phase === "playing" || state.phase === "wrong_feedback" || state.phase === "stealing") && (
          <AudioPlayer
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            progress={audio.progress}
            onToggle={() =>
              state.currentSong?.deezerId && audio.toggleDeezer(state.currentSong.deezerId)
            }
            disabled={!hasPreview}
          />
        )}
      </div>

      {/* Timeline / Steal / Feedback */}
      <div className="px-4 pb-8 space-y-4">
        {state.phase === "playing" && (
          <>
            <p className="text-center text-white/50 text-sm">
              Tap a slot to place this song on your timeline
            </p>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-2 text-center">
                {currentPlayer.name}&apos;s Timeline
              </p>
              <Timeline
                songs={currentPlayer.timeline}
                onPlace={handlePlace}
                interactive
              />
            </div>
          </>
        )}

        {state.phase === "wrong_feedback" && stealingPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-red-500/20 border-red-500/40 text-red-300">
              <span className="text-lg">❌</span>
              <span className="font-bold text-lg">Wrong!</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: stealingPlayer.color }}
              />
              <span>
                <strong className="text-white">{stealingPlayer.name}</strong> gets a chance to steal
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: "PROCEED_TO_STEAL" })}
              className="mt-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {state.phase === "stealing" && stealingPlayer && (
          <StealPrompt
            stealer={stealingPlayer}
            onSteal={handleSteal}
            onDecline={() => dispatch({ type: "DECLINE_STEAL" })}
          />
        )}

        {state.phase === "feedback" && (
          <ResultFeedback
            result={state.placementResult}
            onContinue={handleNextTurn}
          />
        )}
      </div>
    </div>
  );
}

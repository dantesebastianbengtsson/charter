"use client";

import { Player } from "@/types/game";
import { useConfetti } from "@/hooks/useConfetti";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface WinnerAnnouncementProps {
  players: Player[];
  winCondition: number;
}

export function WinnerAnnouncement({
  players,
  winCondition,
}: WinnerAnnouncementProps) {
  const fire = useConfetti();

  const sorted = [...players].sort(
    (a, b) => b.timeline.length - a.timeline.length
  );
  const topScore = sorted[0].timeline.length;
  const winners = sorted.filter((p) => p.timeline.length === topScore);
  const isTie = winners.length > 1;

  useEffect(() => {
    fire();
  }, [fire]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 12 }}
      className="text-center py-8"
    >
      <p className="text-6xl mb-4">{isTie ? "🤝" : "🏆"}</p>
      {isTie ? (
        <>
          <h1 className="text-4xl font-black text-white mb-2">It&apos;s a Tie!</h1>
          <p className="text-white/50">
            {winners.map((w) => w.name).join(" & ")} tied with {topScore} songs
          </p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-black text-white mb-2">
            {winners[0].name} Wins!
          </h1>
          <p className="text-white/50">
            with {topScore} songs in their timeline
          </p>
        </>
      )}
    </motion.div>
  );
}

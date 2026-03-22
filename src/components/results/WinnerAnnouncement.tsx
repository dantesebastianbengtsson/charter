"use client";

import { Player } from "@/types/game";
import { useConfetti } from "@/hooks/useConfetti";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface WinnerAnnouncementProps {
  players: Player[];
  winCondition: number;
}

export function WinnerAnnouncement({ players, winCondition }: WinnerAnnouncementProps) {
  const fire = useConfetti();
  const winner =
    players.find((p) => p.timeline.length >= winCondition) ??
    [...players].sort((a, b) => b.timeline.length - a.timeline.length)[0];

  useEffect(() => { fire(); }, [fire]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 12 }}
      className="text-center py-8"
    >
      <p className="text-6xl mb-4">🏆</p>
      <h1 className="text-4xl font-black text-white mb-2">{winner.name} Wins!</h1>
      <p className="text-white/50">with {winner.timeline.length} songs in their timeline</p>
    </motion.div>
  );
}

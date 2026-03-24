"use client";

import { Player } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";

interface TurnBannerProps {
  player: Player;
  cardsLeft: number;
  isSuddenDeath?: boolean;
}

export function TurnBanner({ player, cardsLeft, isSuddenDeath }: TurnBannerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={player.id}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="text-center"
      >
        {isSuddenDeath && (
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-red-400 font-bold text-sm tracking-widest uppercase mb-1"
          >
            Sudden Death
          </motion.p>
        )}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <h2 className="text-xl font-bold text-white">
            {player.name}&apos;s Turn
          </h2>
        </div>
        <p className="text-white/40 text-sm">{cardsLeft} cards left in deck</p>
      </motion.div>
    </AnimatePresence>
  );
}

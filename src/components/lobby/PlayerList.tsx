"use client";

import { useGame } from "@/hooks/useGame";
import { motion, AnimatePresence } from "framer-motion";

export function PlayerList() {
  const { state, dispatch } = useGame();

  if (state.players.length === 0) {
    return <p className="text-white/40 text-center py-8">Add at least 2 players to start</p>;
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {state.players.map((player) => (
          <motion.li
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
          >
            <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: player.color }} />
            <span className="flex-1 text-white font-medium">{player.name}</span>
            <button
              onClick={() => dispatch({ type: "REMOVE_PLAYER", playerId: player.id })}
              className="text-white/30 hover:text-red-400 transition-colors text-xl leading-none cursor-pointer"
            >&times;</button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

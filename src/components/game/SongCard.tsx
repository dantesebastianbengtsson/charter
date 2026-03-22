"use client";

import { Song } from "@/types/game";
import { motion } from "framer-motion";

interface SongCardProps {
  song: Song;
  compact?: boolean;
}

export function SongCard({ song, compact }: SongCardProps) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`shrink-0 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm overflow-hidden ${compact ? "w-24" : "w-32"}`}
    >
      <div className={`bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 flex items-center justify-center ${compact ? "h-24" : "h-32"}`}>
        <span className="text-3xl">🎵</span>
      </div>
      <div className={`p-2 ${compact ? "space-y-0" : "space-y-1"}`}>
        <p className={`text-white font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}>{song.title}</p>
        <p className={`text-white/50 truncate ${compact ? "text-[10px]" : "text-xs"}`}>{song.artist}</p>
        <p className="text-violet-400 font-bold text-sm">{song.year}</p>
      </div>
    </motion.div>
  );
}

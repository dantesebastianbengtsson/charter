"use client";

import { Song } from "@/types/game";
import { motion } from "framer-motion";

interface MysteryCardProps {
  song: Song | null;
  isRevealed: boolean;
}

export function MysteryCard({ song, isRevealed }: MysteryCardProps) {
  return (
    <div className="perspective-[1000px] w-44 h-60 mx-auto">
      <motion.div
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex flex-col items-center justify-center shadow-2xl shadow-violet-600/30 border border-white/20"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-6xl mb-3">🎧</span>
          <p className="text-white/80 font-semibold text-lg">Listen...</p>
          <p className="text-white/40 text-sm mt-1">Place this song</p>
        </div>
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-900 to-fuchsia-900 flex flex-col items-center justify-center shadow-2xl border border-white/20 p-4 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {song && (
            <>
              <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <span className="text-4xl">🎵</span>
              </div>
              <p className="text-white font-bold text-base leading-tight">{song.title}</p>
              <p className="text-white/60 text-sm mt-1">{song.artist}</p>
              <p className="text-violet-300 font-bold text-2xl mt-2">{song.year}</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

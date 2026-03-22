"use client";

import { motion } from "framer-motion";

interface DropZoneProps {
  onClick: () => void;
  label?: string;
}

export function DropZone({ onClick, label }: DropZoneProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="shrink-0 w-16 h-40 rounded-xl border-2 border-dashed border-violet-500/50 hover:border-violet-400 hover:bg-violet-500/10 transition-colors flex items-center justify-center cursor-pointer group"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-violet-400/60 group-hover:text-violet-300 text-2xl font-light"
      >{label || "+"}</motion.span>
    </motion.button>
  );
}

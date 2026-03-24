"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultFeedbackProps {
  result: "correct" | "wrong" | null;
  onContinue: () => void;
}

export function ResultFeedback({ result, onContinue }: ResultFeedbackProps) {
  useEffect(() => {
    if (!result) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [result, onContinue]);

  if (!result) return null;

  const isCorrect = result === "correct";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={onContinue}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border cursor-pointer transition-colors ${
            isCorrect
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
          }`}
        >
          <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
          <span className="font-bold text-lg">
            {isCorrect ? "Correct!" : "Wrong!"}
          </span>
        </button>
        <p className="text-white/40 text-sm">
          Press Enter or tap to continue
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

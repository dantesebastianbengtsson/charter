"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ResultFeedbackProps {
  result: "correct" | "wrong" | null;
  onContinue: () => void;
}

export function ResultFeedback({ result, onContinue }: ResultFeedbackProps) {
  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onContinue}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">
            {result === "correct" ? "✅" : "❌"}
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {result === "correct" ? "Correct!" : "Wrong!"}
          </p>
          <p className="text-white/50 text-sm">Tap to continue</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { useGame } from "@/hooks/useGame";

export function GameSettings() {
  const { state, dispatch } = useGame();

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between text-white/70">
        <span>Cards to win</span>
        <span className="text-white font-bold text-xl tabular-nums">{state.winCondition}</span>
      </label>
      <input
        type="range"
        min={5}
        max={15}
        value={state.winCondition}
        onChange={(e) => dispatch({ type: "SET_WIN_CONDITION", count: parseInt(e.target.value) })}
        className="w-full accent-violet-500"
      />
      <div className="flex justify-between text-sm text-white/30">
        <span>5 (quick)</span>
        <span>15 (marathon)</span>
      </div>
    </div>
  );
}

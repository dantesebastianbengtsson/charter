"use client";

import { useState, FormEvent } from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/Button";

export function AddPlayerForm() {
  const { dispatch, state } = useGame();
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_PLAYER", name: trimmed });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player name..."
        maxLength={20}
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
      />
      <Button type="submit" disabled={!name.trim() || state.players.length >= 10}>Add</Button>
    </form>
  );
}

"use client";

import { useGame } from "@/hooks/useGame";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GameBoard } from "@/components/game/GameBoard";

export default function GamePage() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.phase === "lobby") {
      router.replace("/");
    }
    if (state.phase === "finished") {
      router.replace("/results");
    }
  }, [state.phase, router]);

  if (state.phase === "lobby" || state.phase === "finished") {
    return null;
  }

  return <GameBoard />;
}

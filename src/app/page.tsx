"use client";

import { useGame } from "@/hooks/useGame";
import { AddPlayerForm } from "@/components/lobby/AddPlayerForm";
import { PlayerList } from "@/components/lobby/PlayerList";
import { GameSettings } from "@/components/lobby/GameSettings";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchSongs } from "@/lib/songs";

export default function LobbyPage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  const handleStart = async () => {
    const songs = await fetchSongs();
    dispatch({ type: "START_GAME", deck: songs });
    router.push("/game");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Charter
          </h1>
          <p className="text-white/40 mt-2">The music timeline game</p>
        </div>

        {/* Add Players */}
        <div className="space-y-4">
          <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            Players
          </h2>
          <AddPlayerForm />
          <PlayerList />
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            Settings
          </h2>
          <GameSettings />
        </div>

        {/* Start */}
        <Button
          size="lg"
          className="w-full"
          disabled={state.players.length < 2}
          onClick={handleStart}
        >
          {state.players.length < 2
            ? `Need ${2 - state.players.length} more player${state.players.length === 0 ? "s" : ""}`
            : "Start Game"}
        </Button>
      </motion.div>
    </div>
  );
}

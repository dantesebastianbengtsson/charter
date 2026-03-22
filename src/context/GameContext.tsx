"use client";

import {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { GameState, GameAction, Player, Song } from "@/types/game";
import { getShuffledDeck } from "@/lib/songs";
import {
  validatePlacement,
  checkWinCondition,
  insertIntoTimeline,
} from "@/lib/game-logic";
import { generateId } from "@/lib/utils";

const PLAYER_COLORS = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
  "#EC4899", "#F97316", "#14B8A6", "#6366F1", "#D946EF",
];

const initialState: GameState = {
  phase: "lobby",
  players: [],
  currentPlayerIndex: 0,
  currentSong: null,
  deck: [],
  winCondition: 10,
  placementResult: null,
  stealingPlayerIndex: null,
  isRevealed: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER": {
      if (state.players.length >= 10) return state;
      const newPlayer: Player = {
        id: generateId(),
        name: action.name,
        color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length],
        timeline: [],
      };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case "REMOVE_PLAYER": {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.playerId),
      };
    }

    case "SET_WIN_CONDITION": {
      return { ...state, winCondition: action.count };
    }

    case "START_GAME": {
      if (state.players.length < 2) return state;
      const deck = getShuffledDeck();

      // Deal one card to each player
      const players = state.players.map((p, i) => ({
        ...p,
        timeline: [deck[i]],
      }));

      const remaining = deck.slice(state.players.length);
      const currentSong = remaining[0];
      const deckAfterDraw = remaining.slice(1);

      return {
        ...state,
        phase: "playing",
        players,
        deck: deckAfterDraw,
        currentSong,
        currentPlayerIndex: 0,
        placementResult: null,
        stealingPlayerIndex: null,
        isRevealed: false,
      };
    }

    case "PLACE_CARD": {
      if (!state.currentSong) return state;
      const player = state.players[state.currentPlayerIndex];
      const correct = validatePlacement(
        player.timeline,
        state.currentSong,
        action.insertIndex
      );

      if (correct) {
        const updatedPlayers = state.players.map((p, i) =>
          i === state.currentPlayerIndex
            ? {
                ...p,
                timeline: insertIntoTimeline(
                  p.timeline,
                  state.currentSong!,
                  action.insertIndex
                ),
              }
            : p
        );
        return {
          ...state,
          players: updatedPlayers,
          placementResult: "correct",
          isRevealed: true,
          phase: "feedback",
        };
      } else {
        const nextPlayerIdx =
          (state.currentPlayerIndex + 1) % state.players.length;
        return {
          ...state,
          placementResult: "wrong",
          isRevealed: true,
          phase: "stealing",
          stealingPlayerIndex: nextPlayerIdx,
        };
      }
    }

    case "REVEAL_CARD": {
      return { ...state, isRevealed: true };
    }

    case "STEAL_CARD": {
      if (!state.currentSong || state.stealingPlayerIndex === null) return state;
      const stealer = state.players[state.stealingPlayerIndex];
      const correct = validatePlacement(
        stealer.timeline,
        state.currentSong,
        action.insertIndex
      );

      if (correct) {
        const updatedPlayers = state.players.map((p, i) =>
          i === state.stealingPlayerIndex
            ? {
                ...p,
                timeline: insertIntoTimeline(
                  p.timeline,
                  state.currentSong!,
                  action.insertIndex
                ),
              }
            : p
        );
        return {
          ...state,
          players: updatedPlayers,
          placementResult: "correct",
          phase: "feedback",
        };
      } else {
        return { ...state, placementResult: "wrong", phase: "feedback" };
      }
    }

    case "DECLINE_STEAL": {
      return { ...state, phase: "feedback" };
    }

    case "NEXT_TURN": {
      const winner = checkWinCondition(state.players, state.winCondition);
      if (winner) {
        return { ...state, phase: "finished" };
      }

      if (state.deck.length === 0) {
        return { ...state, phase: "finished" };
      }

      const nextIndex =
        (state.currentPlayerIndex + 1) % state.players.length;
      const nextSong = state.deck[0];
      const remainingDeck = state.deck.slice(1);

      return {
        ...state,
        phase: "playing",
        currentPlayerIndex: nextIndex,
        currentSong: nextSong,
        deck: remainingDeck,
        placementResult: null,
        stealingPlayerIndex: null,
        isRevealed: false,
      };
    }

    case "RESET_GAME": {
      return {
        ...initialState,
        players: state.players.map((p) => ({ ...p, timeline: [] })),
      };
    }

    default:
      return state;
  }
}

export const GameContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

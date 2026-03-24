"use client";

import {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { GameState, GameAction, Player, Song } from "@/types/game";
import { shuffle } from "@/lib/utils";
import {
  validatePlacement,
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
  isSuddenDeath: false,
  eliminatedPlayerIds: [],
};

function getNextActivePlayer(
  currentIndex: number,
  players: Player[],
  eliminatedIds: string[]
): number {
  let next = (currentIndex + 1) % players.length;
  let checked = 0;
  while (eliminatedIds.includes(players[next].id) && checked < players.length) {
    next = (next + 1) % players.length;
    checked++;
  }
  return next;
}

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
      const deck = shuffle([...action.deck]);

      // Deal one card to each player
      const players = state.players.map((p, i) => ({
        ...p,
        timeline: [deck[i]],
      }));

      const remaining = deck.slice(state.players.length);
      const currentSong = remaining[0];
      const deckAfterDraw = remaining.slice(1);

      // First player: whoever has the oldest starting card
      let oldestIndex = 0;
      let oldestYear = players[0].timeline[0].year;
      for (let i = 1; i < players.length; i++) {
        if (players[i].timeline[0].year < oldestYear) {
          oldestYear = players[i].timeline[0].year;
          oldestIndex = i;
        }
      }

      return {
        ...state,
        phase: "playing",
        players,
        deck: deckAfterDraw,
        currentSong,
        currentPlayerIndex: oldestIndex,
        placementResult: null,
        stealingPlayerIndex: null,
        isRevealed: false,
        isSuddenDeath: false,
        eliminatedPlayerIds: [],
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
        const nextPlayerIdx = getNextActivePlayer(
          state.currentPlayerIndex,
          state.players,
          state.eliminatedPlayerIds
        );
        return {
          ...state,
          placementResult: "wrong",
          isRevealed: false,
          phase: "wrong_feedback",
          stealingPlayerIndex: nextPlayerIdx,
        };
      }
    }

    case "REVEAL_CARD": {
      return { ...state, isRevealed: true };
    }

    case "PROCEED_TO_STEAL": {
      return { ...state, phase: "stealing" };
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
          isRevealed: true,
          phase: "feedback",
        };
      } else {
        return { ...state, placementResult: "wrong", isRevealed: true, phase: "feedback" };
      }
    }

    case "DECLINE_STEAL": {
      return { ...state, isRevealed: true, phase: "feedback" };
    }

    case "NEXT_TURN": {
      // Check if any player has reached the win condition
      const sorted = [...state.players]
        .filter((p) => !state.eliminatedPlayerIds.includes(p.id))
        .sort((a, b) => b.timeline.length - a.timeline.length);

      const leader = sorted[0];
      const runnerUp = sorted[1];

      if (leader && leader.timeline.length >= state.winCondition) {
        const gap = leader.timeline.length - (runnerUp?.timeline.length ?? 0);

        if (gap >= 2) {
          // Clear win — leader is 2+ ahead
          return { ...state, phase: "finished" };
        }

        // Gap is 0 or 1 — enter or continue sudden death
        if (!state.isSuddenDeath) {
          // Enter sudden death: eliminate everyone except leader and tied-for-second players
          const secondScore = runnerUp.timeline.length;
          const contenderIds = sorted
            .filter(
              (p) =>
                p.timeline.length === leader.timeline.length ||
                p.timeline.length === secondScore
            )
            .map((p) => p.id);

          const eliminated = state.players
            .filter((p) => !contenderIds.includes(p.id))
            .map((p) => p.id);

          const nextIndex = getNextActivePlayer(
            state.currentPlayerIndex,
            state.players,
            eliminated
          );

          if (state.deck.length === 0) {
            return { ...state, phase: "finished" };
          }

          return {
            ...state,
            phase: "playing",
            isSuddenDeath: true,
            eliminatedPlayerIds: eliminated,
            currentPlayerIndex: nextIndex,
            currentSong: state.deck[0],
            deck: state.deck.slice(1),
            placementResult: null,
            stealingPlayerIndex: null,
            isRevealed: false,
          };
        }

        // Already in sudden death — check if leader now has 2+ gap
        // (handled above). If not, continue playing.
      }

      // Deck exhausted
      if (state.deck.length === 0) {
        return { ...state, phase: "finished" };
      }

      const nextIndex = getNextActivePlayer(
        state.currentPlayerIndex,
        state.players,
        state.eliminatedPlayerIds
      );
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

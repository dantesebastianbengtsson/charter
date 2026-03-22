export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  previewUrl: string;
  albumArtUrl: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  timeline: Song[];
}

export type GamePhase =
  | "lobby"
  | "playing"
  | "revealing"
  | "stealing"
  | "feedback"
  | "finished";

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentSong: Song | null;
  deck: Song[];
  winCondition: number;
  placementResult: "correct" | "wrong" | null;
  stealingPlayerIndex: number | null;
  isRevealed: boolean;
}

export type GameAction =
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "SET_WIN_CONDITION"; count: number }
  | { type: "START_GAME" }
  | { type: "PLACE_CARD"; insertIndex: number }
  | { type: "REVEAL_CARD" }
  | { type: "STEAL_CARD"; insertIndex: number }
  | { type: "DECLINE_STEAL" }
  | { type: "NEXT_TURN" }
  | { type: "RESET_GAME" };

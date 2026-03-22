import { Song, Player } from "@/types/game";

export function validatePlacement(
  timeline: Song[],
  song: Song,
  insertIndex: number
): boolean {
  const before = timeline[insertIndex - 1];
  const after = timeline[insertIndex];
  const fitsBefore = !before || before.year <= song.year;
  const fitsAfter = !after || song.year <= after.year;
  return fitsBefore && fitsAfter;
}

export function checkWinCondition(
  players: Player[],
  winCondition: number
): Player | null {
  return players.find((p) => p.timeline.length >= winCondition) ?? null;
}

export function insertIntoTimeline(
  timeline: Song[],
  song: Song,
  insertIndex: number
): Song[] {
  const next = [...timeline];
  next.splice(insertIndex, 0, song);
  return next;
}

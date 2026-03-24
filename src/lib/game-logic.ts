import { Song, Player } from "@/types/game";

export function validatePlacement(
  timeline: Song[],
  song: Song,
  insertIndex: number
): boolean {
  const before = timeline[insertIndex - 1];
  const after = timeline[insertIndex];

  // Same-year adjacency: placing next to a card with the same year is always valid
  if (before && before.year === song.year) return true;
  if (after && after.year === song.year) return true;

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

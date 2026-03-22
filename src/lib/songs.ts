import { Song } from "@/types/game";
import { shuffle } from "./utils";
import songsData from "@/data/songs.json";

export function getShuffledDeck(): Song[] {
  return shuffle(songsData as Song[]);
}

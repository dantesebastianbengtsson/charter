import { Song } from "@/types/game";
import { supabase } from "./supabase";

export async function fetchSongs(): Promise<Song[]> {
  const { data, error } = await supabase.from("songs").select("*");

  if (error) {
    throw new Error(`Failed to fetch songs: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    year: row.year,
    previewUrl: row.preview_url,
    albumArtUrl: row.album_art_url,
    deezerId: row.deezer_id,
  }));
}

"use client";

import { Song } from "@/types/game";
import { SongCard } from "./SongCard";
import { DropZone } from "./DropZone";

interface TimelineProps {
  songs: Song[];
  onPlace?: (index: number) => void;
  interactive?: boolean;
}

export function Timeline({ songs, onPlace, interactive = false }: TimelineProps) {
  const elements: React.ReactNode[] = [];

  if (interactive && onPlace) {
    elements.push(<DropZone key="drop-0" onClick={() => onPlace(0)} />);
    songs.forEach((song, i) => {
      elements.push(<SongCard key={song.id} song={song} compact />);
      elements.push(<DropZone key={`drop-${i + 1}`} onClick={() => onPlace(i + 1)} />);
    });
  } else {
    songs.forEach((song) => {
      elements.push(<SongCard key={song.id} song={song} compact />);
    });
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-2 px-4 min-w-min">
        {songs.length === 0 && !interactive && <p className="text-white/30 text-sm italic">Empty timeline</p>}
        {elements}
      </div>
    </div>
  );
}

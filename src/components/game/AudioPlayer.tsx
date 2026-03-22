"use client";

interface AudioPlayerProps {
  isPlaying: boolean;
  progress: number;
  onToggle: () => void;
  disabled?: boolean;
}

export function AudioPlayer({
  isPlaying,
  progress,
  onToggle,
  disabled,
}: AudioPlayerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onToggle}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white/10 border-2 border-violet-400
          flex items-center justify-center text-2xl hover:bg-violet-600/30
          transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {disabled && (
        <p className="text-white/30 text-xs">No preview available</p>
      )}
    </div>
  );
}

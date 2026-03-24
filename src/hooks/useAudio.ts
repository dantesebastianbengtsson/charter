"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const previewCache = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const fetchPreviewUrl = useCallback(async (deezerId: number): Promise<string> => {
    const cached = previewCache.current.get(deezerId);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/preview?id=${deezerId}`);
      if (!res.ok) return "";
      const data = await res.json();
      if (data.previewUrl) {
        previewCache.current.set(deezerId, data.previewUrl);
      }
      return data.previewUrl || "";
    } catch {
      return "";
    }
  }, []);

  const playUrl = useCallback((url: string) => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    audio.src = url;
    audio.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setIsLoading(false);
  }, []);

  const playDeezer = useCallback(async (deezerId: number) => {
    setIsLoading(true);
    const url = await fetchPreviewUrl(deezerId);
    if (url) {
      playUrl(url);
    } else {
      setIsLoading(false);
    }
  }, [fetchPreviewUrl, playUrl]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggleDeezer = useCallback(
    (deezerId: number) => {
      if (isPlaying) {
        pause();
      } else {
        playDeezer(deezerId);
      }
    },
    [isPlaying, pause, playDeezer]
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  }, []);

  return { isPlaying, isLoading, progress, playDeezer, pause, toggleDeezer, stop };
}

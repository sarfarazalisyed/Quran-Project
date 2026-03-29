"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Repeat, Loader2 } from "lucide-react";
import { TOP_RECITERS } from "@/lib/reciter-data";

export interface AudioPlayerProps {
  surahNumber: number;
  ayahNumber: number | null;
  totalAyahs: number;
  reciterId: string;
  onAyahChange: (ayah: number) => void;
  onReciterChange?: (id: string) => void;
  onClose?: () => void;
}

export function AudioPlayer({
  surahNumber,
  ayahNumber,
  totalAyahs,
  reciterId,
  onAyahChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoop, setShouldLoop] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playing current instance if it changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (ayahNumber === null) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    playAyah(ayahNumber);
  }, [ayahNumber, reciterId]);

  function playAyah(num: number) {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsLoading(true);
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterId}/number/${getGlobalAyahNumber(surahNumber, num)}`;
    
    // Al Quran Cloud uses global ayah number for their CDN (1-6236)
    // Unfortunately, we have to fetch the global number if we don't have it.
    // However, the standard endpoint `http://api.alquran.cloud/v1/ayah/{surah}:{ayah}/ar.alafasy` works!
    
    const audioUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${num}/${reciterId}`;
    
    fetch(audioUrl)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200 && data.data.audio) {
          const audio = new Audio(data.data.audio);
          audioRef.current = audio;
          
          audio.addEventListener("playing", () => {
            setIsLoading(false);
            setIsPlaying(true);
          });

          audio.addEventListener("waiting", () => setIsLoading(true));

          audio.addEventListener("ended", () => {
            if (shouldLoop) {
              audio.play();
            } else if (num < totalAyahs) {
              onAyahChange(num + 1);
            } else {
              setIsPlaying(false);
            }
          });

          audio.addEventListener("error", () => {
            setIsLoading(false);
            setIsPlaying(false);
          });

          audio.play().catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
          });
        }
      });
  }

  function togglePlayPause() {
    if (!audioRef.current || ayahNumber === null) {
      if (ayahNumber === null && totalAyahs > 0) {
        onAyahChange(1); // Start with first ayah
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  // Not rendering this entirely right now - keeping it headless mostly to integrate directly with SurahReader layout
  return null; 
}

// Global ayah calc could be complex so using their /ayah/{surah}:{ayah}/ endpoint above
function getGlobalAyahNumber(surah: number, ayah: number) {
  return 1; // placeholder, endpoint takes care of it
}

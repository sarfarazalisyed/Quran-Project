import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Reciter } from "@/lib/reciter-data";

export interface AudioState {
  // Current playing context
  currentSurah: number | null; // 1-114
  currentSurahName: string | null;
  currentReciter: Reciter | null;
  
  // Playback state
  isPlaying: boolean;
  playbackSpeed: number;
  loopMode: "off" | "surah" | "all";
  
  // Actions
  playSurah: (surahId: number, surahName: string, reciter: Reciter) => void;
  togglePlayPause: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setLoopMode: (mode: "off" | "surah" | "all") => void;
  nextSurah: () => void;
  prevSurah: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      currentSurah: null,
      currentSurahName: null,
      currentReciter: null,
      isPlaying: false,
      playbackSpeed: 1,
      loopMode: "all",
      
      playSurah: (surahId, surahName, reciter) => 
        set({ currentSurah: surahId, currentSurahName: surahName, currentReciter: reciter, isPlaying: true }),
      
      togglePlayPause: () => 
        set((state) => ({ isPlaying: !state.isPlaying })),
      
      setPlaying: (playing) => 
        set({ isPlaying: playing }),
      
      setSpeed: (speed) => 
        set({ playbackSpeed: speed }),
      
      setLoopMode: (mode) => 
        set({ loopMode: mode }),
      
      nextSurah: () => {
        const { currentSurah } = get();
        if (currentSurah && currentSurah < 114) {
          set({ currentSurah: currentSurah + 1, currentSurahName: `Surah ${currentSurah + 1}` }); 
          // We will eventually need a mapping to get the exact name, or the player relies on surah ID
        }
      },
      
      prevSurah: () => {
        const { currentSurah } = get();
        if (currentSurah && currentSurah > 1) {
          set({ currentSurah: currentSurah - 1, currentSurahName: `Surah ${currentSurah - 1}` });
        }
      }
    }),
    {
      name: "quran-audio-storage",
      partialize: (state) => ({
        currentSurah: state.currentSurah,
        currentSurahName: state.currentSurahName,
        currentReciter: state.currentReciter,
        playbackSpeed: state.playbackSpeed,
        loopMode: state.loopMode,
      }),
    }
  )
);

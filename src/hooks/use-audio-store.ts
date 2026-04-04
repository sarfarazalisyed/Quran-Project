import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Reciter } from "@/lib/reciter-data";

export const SURAH_NAMES = [
  "Al-Faatiha", "Al-Baqara", "Aal-i-Imraan", "An-Nisaa", "Al-Maaida", "Al-An'aam", "Al-A'raaf", "Al-Anfaal", "At-Tawba", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Israa", "Al-Kahf", "Maryam", "Taa-Haa",
  "Al-Anbiyaa", "Al-Hajj", "Al-Muminun", "An-Noor", "Al-Furqaan", "Ash-Shu'araa", "An-Naml", "Al-Qasas", "Al-Ankaboot", "Ar-Room",
  "Luqman", "As-Sajda", "Al-Ahzaab", "Saba", "Faatir", "Yaseen", "As-Saaffaat", "Saad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhaan", "Al-Jaathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujuraat", "Qaaf",
  "Adz-Dzaariyaat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahmaan", "Al-Waaqia", "Al-Hadid", "Al-Mujaadila", "Al-Hashr", "Al-Mumtahana",
  "As-Saff", "Al-Jumu'a", "Al-Munaafiqoon", "At-Taghaabun", "At-Talaaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haaqqa", "Al-Ma'aarij",
  "Nooh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyaama", "Al-Insaan", "Al-Mursalaat", "An-Naba", "An-Naazi'aat", "Abasa",
  "At-Takweer", "Al-Infitaar", "Al-Mutaffifeen", "Al-Inshiqaaq", "Al-Burooj", "At-Taariq", "Al-A'laa", "Al-Ghaashiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Lail", "Ad-Dhuhaa", "Ash-Sharh", "At-Teen", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-Aadiyaat",
  "Al-Qaari'a", "At-Takaathur", "Al-Asr", "Al-Humaza", "Al-Feel", "Quraish", "Al-Maa'un", "Al-Kawthar", "Al-Kaafiroon", "An-Nasr",
  "Al-Masad", "Al-Ikhlaas", "Al-Falaq", "An-Naas"
];

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
          const nextId = currentSurah + 1;
          set({ currentSurah: nextId, currentSurahName: SURAH_NAMES[nextId - 1] }); 
        }
      },
      
      prevSurah: () => {
        const { currentSurah } = get();
        if (currentSurah && currentSurah > 1) {
          const prevId = currentSurah - 1;
          set({ currentSurah: prevId, currentSurahName: SURAH_NAMES[prevId - 1] });
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

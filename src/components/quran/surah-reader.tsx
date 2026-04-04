"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Bookmark,
  Copy,
  Minus,
  Plus,
  Check,
  Headphones,
  Settings2,
  ListMusic,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Loader2,
} from "lucide-react";
import { TOP_RECITERS } from "@/lib/reciter-data";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useReadingProgress } from "@/hooks/use-reading-progress";

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

interface TranslationAyah {
  number: number;
  numberInSurah: number;
  text: string;
}

export function SurahReader({ surahId }: { surahId: number }) {
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [translation, setTranslation] = useState<TranslationAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  
  const router = useRouter();
  
  // Audio state
  const [reciterId, setReciterId] = useState<string>(TOP_RECITERS[0].id);
  const [showReciters, setShowReciters] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [loopMode, setLoopMode] = useState<"off" | "ayah" | "surah">("off");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { saveProgress } = useReadingProgress();

  useEffect(() => {
    fetchSurah();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [surahId]);

  // Handle auto-play of next surah if passed via URL
  useEffect(() => {
    if (surah && !playingAyah && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("playAyah") === "1") {
        setPlayingAyah(1);
        window.history.replaceState({}, '', `/quran/${surahId}`);
      }
    }
  }, [surah]);

  async function fetchSurah() {
    setLoading(true);
    try {
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`),
      ]);
      const arData = await arRes.json();
      const enData = await enRes.json();

      if (arData.code === 200) setSurah(arData.data);
      if (enData.code === 200) setTranslation(enData.data.ayahs);

      // Save last read placeholder (will implement full feature later)
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "qp_lastRead",
          JSON.stringify({ surah: surahId, timestamp: Date.now() })
        );
      }
    } catch (err) {
      console.error("Failed to fetch surah:", err);
    } finally {
      setLoading(false);
    }
  }

  // Effect to handle audio playback sequence
  useEffect(() => {
    if (playingAyah === null) return;
    
    setIsAudioLoading(true);
    
    // We fetch the specific audio file from alquran.cloud API for the global ayah number
    // To do this, we need the global ayah number (ayah.number)
    const currentAyah = surah?.ayahs.find(a => a.numberInSurah === playingAyah);
    if (!currentAyah) {
      setPlayingAyah(null);
      setIsAudioLoading(false);
      return;
    }

    // Direct url to cdn for ayah by global number
    const surahStr = String(surahId).padStart(3, '0');
    const ayahStr = String(currentAyah.numberInSurah).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surahStr}${ayahStr}.mp3`;
    
    const audio = new Audio(audioUrl);
    
    audio.addEventListener("playing", () => setIsAudioLoading(false));
    
    audio.addEventListener("ended", () => {
      // Loop logic
      if (loopMode === "ayah") {
        audio.currentTime = 0;
        audio.play();
      } else {
        // Move to next ayah or stop
        setPlayingAyah(prev => {
          if (!prev) return null;
          if (prev < (surah?.numberOfAyahs || 0)) {
            // Wait a small gap between ayahs
            setTimeout(() => {
              const nextEl = document.getElementById(`ayah-${prev + 1}`);
              if (nextEl) {
                nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 500);
            return prev + 1;
          }
          if (loopMode === "surah") return 1;
          
          if (surahId < 114) {
            router.push(`/quran/${surahId + 1}?playAyah=1`);
            return null;
          }
          return null;
        });
      }
    });

    audio.addEventListener("error", () => {
      console.error("Failed to load audio");
      setIsAudioLoading(false);
      setPlayingAyah(null);
    });

    // Handle bismillah overlap issues (sometimes ayah 1 includes it, sometimes it doesn't)
    audio.play().catch(e => {
      console.error("Playback prevented:", e);
      setIsAudioLoading(false);
      setPlayingAyah(null);
    });
    
    // Save reading progress when an ayah is played
    saveProgress(surahId, currentAyah.numberInSurah);

    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, [playingAyah, reciterId, surah, loopMode]);

  function togglePlayAyah(ayahNumberInSurah: number) {
    if (playingAyah === ayahNumberInSurah) {
      // Toggle pause/play
      if (audioRef.current) {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          setPlayingAyah(null);
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAyah(ayahNumberInSurah);
    }
  }

  function handleNextAyah() {
    if (playingAyah && playingAyah < (surah?.numberOfAyahs || 1)) {
      setPlayingAyah(playingAyah + 1);
    }
  }

  function handlePrevAyah() {
    if (playingAyah && playingAyah > 1) {
      setPlayingAyah(playingAyah - 1);
    }
  }

  function copyAyah(arabicText: string, englishText: string, ayahNum: number) {
    const text = `${arabicText}\n\n${englishText}\n\n— Surah ${surah?.englishName}, Ayah ${ayahNum}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAyah(ayahNum);
      setTimeout(() => setCopiedAyah(null), 2000);
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="h-32 rounded-2xl bg-card animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Surah not found.</p>
        <Link href="/quran">
          <Button variant="outline" className="mt-4">
            ← Back to Surah List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
      {/* Surah Header */}
      <Card className="p-6 sm:p-8 text-center mb-6 relative overflow-hidden bg-card/50 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
        <div className="relative z-10">
          {/* Nav */}
          <div className="flex items-center justify-between mb-4">
            <Link href={surahId > 1 ? `/quran/${surahId - 1}` : "/quran"}>
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{surahId > 1 ? "Previous" : "List"}</span>
              </Button>
            </Link>
            <Link href="/quran">
              <Button variant="outline" size="sm" className="rounded-full px-6 shadow-sm">
                All Surahs
              </Button>
            </Link>
            <Link
              href={
                surahId < 114 ? `/quran/${surahId + 1}` : `/quran/${surahId}`
              }
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:bg-primary/10 transition-colors"
                disabled={surahId >= 114}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Surah name */}
          <p
            className="text-4xl sm:text-5xl text-primary mb-3 mt-4"
            style={{ fontFamily: "var(--font-arabic)" }}
            dir="rtl"
          >
            {surah.name}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">
            {surah.englishName}
          </h1>
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {surah.englishNameTranslation}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge
              variant="outline"
              className={
                surah.revelationType === "Meccan"
                  ? "border-amber-custom/30 bg-amber-custom/5 text-amber-custom"
                  : "border-sky-custom/30 bg-sky-custom/5 text-sky-custom"
              }
            >
              {surah.revelationType === "Meccan" ? "Makki" : "Madani"}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground bg-accent/50 px-3 py-0.5 rounded-full">
              {surah.numberOfAyahs} Ayahs
            </span>
          </div>
        </div>
      </Card>

      {/* Reader Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border rounded-xl p-3 mb-8 gap-4 shadow-sm">
        
        {/* Reciter Selector */}
        <div className="relative w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-[260px] justify-between text-sm h-10 border-primary/20 hover:bg-primary/5"
            onClick={() => setShowReciters(!showReciters)}
          >
            <div className="flex items-center gap-2 truncate">
              <Headphones className="w-4 h-4 text-primary" />
              <span className="truncate">{TOP_RECITERS.find(r => r.id === reciterId)?.name}</span>
            </div>
            <Settings2 className="w-4 h-4 text-muted-foreground ml-2" />
          </Button>

          {showReciters && (
            <div className="absolute top-12 left-0 w-full sm:w-[320px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <div className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2 mb-1">
                  Select Reciter
                </div>
                {TOP_RECITERS.map((reciter) => (
                  <button
                    key={reciter.id}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                      reciterId === reciter.id 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "hover:bg-accent hover:text-foreground text-muted-foreground"
                    }`}
                    onClick={() => {
                      setReciterId(reciter.id);
                      setShowReciters(false);
                      // If playing, it will automatically switch to new reciter upon next ayah or if restarted
                      if (playingAyah) {
                        setPlayingAyah(playingAyah); // triggers effect re-run
                      }
                    }}
                  >
                    <div className="truncate pr-4">{reciter.name}</div>
                    <Badge variant="secondary" className={`text-[10px] shrink-0 ${reciterId === reciter.id ? "bg-primary-foreground/20 text-white border-none" : ""}`}>
                      {reciter.style}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1 bg-accent/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-background"
            onClick={() => setFontSize((s) => Math.max(20, s - 4))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <div className="text-xs font-medium w-16 text-center text-muted-foreground">
            {fontSize}px
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-background"
            onClick={() => setFontSize((s) => Math.min(60, s + 4))}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Bismillah */}
      {surahId !== 1 && surahId !== 9 && (
        <div className="mb-10 text-center animate-in fade-in duration-700 delay-300">
          <p
            className="text-3xl sm:text-4xl text-primary/90 py-4"
            style={{ fontFamily: "var(--font-arabic)" }}
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah, i) => {
          const trans = translation[i];
          const isPlaying = playingAyah === ayah.numberInSurah;
          const isCopied = copiedAyah === ayah.numberInSurah;

          return (
            <Card
              key={ayah.number}
              className={`p-6 sm:p-8 transition-all duration-300 ${
                isPlaying 
                  ? "border-l-4 border-l-green-500 shadow-lg shadow-primary/5 bg-primary/[0.03] scale-[1.01]" 
                  : "hover:border-primary/20"
              }`}
              id={`ayah-${ayah.numberInSurah}`}
            >
              {/* Ayah header & actions */}
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-colors ${
                  isPlaying 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-primary/30 bg-primary/5 text-primary"
                }`}>
                  {ayah.numberInSurah}
                </div>
                <div className="flex items-center gap-1 bg-background rounded-full border border-border p-1 shadow-sm">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-9 h-9 rounded-full transition-all ${isPlaying ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                          onClick={() => togglePlayAyah(ayah.numberInSurah)}
                        />
                      }
                    >
                      {isPlaying ? (
                        isAudioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? "Pause Ayah" : "Play Ayah"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            copyAyah(
                              ayah.text,
                              trans?.text || "",
                              ayah.numberInSurah
                            )
                          }
                        />
                      }
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>{isCopied ? "Copied!" : "Copy Ayah"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-9 h-9 rounded-full transition-colors ${
                            isBookmarked(surahId, ayah.numberInSurah) 
                              ? "bg-primary/20 text-primary" 
                              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                          }`}
                          onClick={() => toggleBookmark(surahId, ayah.numberInSurah, surah.englishName)}
                        />
                      }
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked(surahId, ayah.numberInSurah) ? "fill-current" : ""}`} />
                    </TooltipTrigger>
                    <TooltipContent>
                      {isBookmarked(surahId, ayah.numberInSurah) ? "Remove Bookmark" : "Bookmark Ayah"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Arabic Text */}
              <p
                className={`text-right transition-colors duration-300 ${isPlaying ? "text-primary" : "text-foreground"}`}
                style={{
                  fontFamily: "var(--font-arabic)",
                  fontSize: `${fontSize}px`,
                  wordSpacing: "6px",
                  lineHeight: "2.4",
                }}
                dir="rtl"
              >
                {ayah.text}
              </p>

              {/* Translation */}
              {trans && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="text-[1.05rem] text-muted-foreground leading-relaxed">
                    {trans.text}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between mt-12 mb-12">
        {surahId > 1 ? (
          <Link href={`/quran/${surahId - 1}`}>
            <Button variant="outline" className="gap-2 rounded-full px-6">
              <ChevronLeft className="w-4 h-4" />
              Previous Surah
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {surahId < 114 && (
          <Link href={`/quran/${surahId + 1}`}>
            <Button variant="default" className="gap-2 rounded-full px-8 shadow-md">
              Next Surah
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Sticky Audio Player */}
      {playingAyah !== null && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Glassmorphism backdrop */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-background/80 backdrop-blur-xl border-t border-primary/20 shadow-[0_-10px_40px_-10px_rgba(var(--primary),0.1)]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between gap-4">
            
            {/* Playing Info */}
            <div className="flex-1 min-w-0 hidden sm:flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <ListMusic className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col truncate">
                <div className="font-semibold truncate">
                  Surah {surah.englishName} • Ayah {playingAyah} of {surah.numberOfAyahs}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {TOP_RECITERS.find(r => r.id === reciterId)?.name}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 flex justify-center items-center gap-3 sm:gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`hidden sm:flex hover:bg-accent ${loopMode !== "off" ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => {
                  if (loopMode === "off") setLoopMode("ayah");
                  else if (loopMode === "ayah") setLoopMode("surah");
                  else setLoopMode("off");
                }}
                title={`Loop mode: ${loopMode}`}
              >
                {loopMode === "ayah" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </Button>

              <Button 
                variant="secondary" 
                size="icon" 
                className="w-10 h-10 rounded-full"
                onClick={handlePrevAyah}
                disabled={playingAyah <= 1}
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button 
                size="icon" 
                className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
                onClick={() => setPlayingAyah(null)}
              >
                {isAudioLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Pause className="w-6 h-6" />}
              </Button>

              <Button 
                variant="secondary" 
                size="icon" 
                className="w-10 h-10 rounded-full"
                onClick={handleNextAyah}
                disabled={playingAyah >= surah.numberOfAyahs}
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className={`sm:hidden hover:bg-accent ${loopMode !== "off" ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => {
                  if (loopMode === "off") setLoopMode("ayah");
                  else if (loopMode === "ayah") setLoopMode("surah");
                  else setLoopMode("off");
                }}
              >
                {loopMode === "ayah" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile simplified info */}
            <div className="flex-1 flex sm:hidden justify-end">
               <div className="text-xs font-semibold px-3 py-1.5 bg-accent/50 rounded-full">
                 Ayah {playingAyah} of {surah.numberOfAyahs}
               </div>
            </div>

            {/* Right Spacing / Extras */}
            <div className="flex-1 hidden sm:flex justify-end items-center gap-2 text-sm font-medium text-muted-foreground">
               Ayah {playingAyah} of {surah.numberOfAyahs}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

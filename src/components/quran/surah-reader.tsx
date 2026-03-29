"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Share2,
  Copy,
  Volume2,
  Minus,
  Plus,
  Check,
} from "lucide-react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurah();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [surahId]);

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

      // Save last read
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

  function playAyah(ayahNumber: number) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingAyah === ayahNumber) {
      setPlayingAyah(null);
      return;
    }

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`
    );
    audio.play();
    audioRef.current = audio;
    setPlayingAyah(ayahNumber);

    audio.addEventListener("ended", () => {
      setPlayingAyah(null);
      audioRef.current = null;
    });
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Surah Header */}
      <Card className="p-6 sm:p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
        <div className="relative z-10">
          {/* Nav */}
          <div className="flex items-center justify-between mb-4">
            <Link href={surahId > 1 ? `/quran/${surahId - 1}` : "/quran"}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="w-4 h-4" />
                {surahId > 1 ? "Prev" : "List"}
              </Button>
            </Link>
            <Link href="/quran">
              <Button variant="ghost" size="sm">
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
                className="gap-1"
                disabled={surahId >= 114}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Surah name */}
          <p
            className="text-3xl sm:text-4xl text-primary mb-2"
            style={{ fontFamily: "var(--font-arabic)" }}
            dir="rtl"
          >
            {surah.name}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">
            {surah.englishName}
          </h1>
          <p className="text-sm text-muted-foreground mb-3">
            {surah.englishNameTranslation}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge
              variant="outline"
              className={
                surah.revelationType === "Meccan"
                  ? "border-amber-custom/30 text-amber-custom"
                  : "border-sky-custom/30 text-sky-custom"
              }
            >
              {surah.revelationType === "Meccan" ? "Makki" : "Madani"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {surah.numberOfAyahs} Ayahs
            </span>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2 mb-6">
        <span className="text-xs text-muted-foreground">Font Size</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setFontSize((s) => Math.max(18, s - 2))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm font-mono w-8 text-center">{fontSize}</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setFontSize((s) => Math.min(48, s + 2))}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Bismillah */}
      {surahId !== 1 && surahId !== 9 && (
        <p
          className="text-2xl sm:text-3xl text-center text-primary/80 py-6 leading-[2.2]"
          style={{ fontFamily: "var(--font-arabic)" }}
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      )}

      {/* Ayahs */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah, i) => {
          const trans = translation[i];
          const isPlaying = playingAyah === ayah.number;
          const isCopied = copiedAyah === ayah.numberInSurah;

          return (
            <Card
              key={ayah.number}
              className={`p-5 sm:p-6 transition-all duration-200 ${
                isPlaying ? "border-primary/30 bg-primary/5" : ""
              }`}
              id={`ayah-${ayah.numberInSurah}`}
            >
              {/* Ayah number & actions bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-primary/30 bg-primary/5 text-xs font-bold text-primary">
                  {ayah.numberInSurah}
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`w-8 h-8 ${isPlaying ? "text-primary" : "text-muted-foreground"}`}
                          onClick={() => playAyah(ayah.number)}
                        />
                      }
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground"
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
                    <TooltipContent>{isCopied ? "Copied!" : "Copy"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground"
                        />
                      }
                    >
                      <Bookmark className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>Bookmark</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Arabic Text */}
              <p
                className="text-primary/90 leading-[2.4] mb-4 text-right"
                style={{
                  fontFamily: "var(--font-arabic)",
                  fontSize: `${fontSize}px`,
                  wordSpacing: "6px",
                }}
                dir="rtl"
              >
                {ayah.text}
              </p>

              {/* Translation */}
              {trans && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {trans.text}
                  </p>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between mt-8 mb-12">
        {surahId > 1 ? (
          <Link href={`/quran/${surahId - 1}`}>
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous Surah
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {surahId < 114 && (
          <Link href={`/quran/${surahId + 1}`}>
            <Button variant="outline" className="gap-2">
              Next Surah
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

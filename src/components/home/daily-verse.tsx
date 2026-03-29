"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface VerseData {
  arabic: string;
  english: string;
  surahName: string;
  surahNameAr: string;
  ayahNumber: number;
  surahNumber: number;
}

export function DailyVerse() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyVerse();
  }, []);

  async function fetchDailyVerse() {
    try {
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const ayahNumber = (dayOfYear % 6236) + 1;

      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih`
      );
      const data = await res.json();
      if (data.code === 200) {
        const ar = data.data[0];
        const en = data.data[1];
        setVerse({
          arabic: ar.text,
          english: en.text,
          surahName: ar.surah.englishName,
          surahNameAr: ar.surah.name,
          ayahNumber: ar.numberInSurah,
          surahNumber: ar.surah.number,
        });
      }
    } catch {
      console.error("Daily verse fetch failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6" id="daily-verse-section">
      <div className="max-w-3xl mx-auto">
        <Card className="relative overflow-hidden p-8 sm:p-10 text-center bg-card/70 backdrop-blur-sm border-border">
          {/* Top gold accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Label */}
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-6">
            ✦ Verse of the Day
          </p>

          {loading ? (
            <div className="space-y-4">
              <div className="h-16 rounded-lg bg-muted animate-pulse" />
              <div className="h-10 rounded-lg bg-muted animate-pulse max-w-md mx-auto" />
            </div>
          ) : verse ? (
            <>
              {/* Arabic */}
              <p
                className="text-2xl sm:text-3xl lg:text-4xl text-primary/90 leading-[2.2] mb-6"
                dir="rtl"
                style={{ fontFamily: "var(--font-arabic)" }}
              >
                {verse.arabic}
              </p>

              {/* Translation */}
              <p className="text-base sm:text-lg text-muted-foreground italic leading-relaxed mb-6 max-w-xl mx-auto">
                &ldquo;{verse.english}&rdquo;
              </p>

              {/* Reference */}
              <div className="flex items-center justify-center gap-3 mb-4 text-sm">
                <span className="font-semibold text-foreground">
                  {verse.surahName} ({verse.surahNameAr})
                </span>
                <span className="text-muted-foreground">
                  Ayah {verse.ayahNumber}
                </span>
              </div>

              {/* Link */}
              <Link href={`/quran/${verse.surahNumber}`}>
                <Button variant="ghost" className="text-primary gap-1">
                  Read full Surah <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground italic">
              Could not load verse. Please try again later.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}

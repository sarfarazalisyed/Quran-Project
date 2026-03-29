"use client";

import { useBookmarks } from "@/hooks/use-bookmarks";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookOpen, Bookmark, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const { bookmarks, isLoaded } = useBookmarks();

  if (!isLoaded) {
    return <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-40 bg-card rounded-xl"></div>
      <div className="h-20 bg-card rounded-xl"></div>
    </div>;
  }

  // Group by surah
  const grouped = bookmarks.reduce((acc, curr) => {
    if (!acc[curr.surahId]) {
      acc[curr.surahId] = {
        name: curr.surahName,
        ayahs: []
      };
    }
    acc[curr.surahId].ayahs.push(curr.ayahInSurah);
    return acc;
  }, {} as Record<number, { name: string, ayahs: number[] }>);

  // Sort by surah id
  const sortedSurahs = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Verses</h1>
        <p className="text-muted-foreground">Quickly access verses you've bookmarked for reflection or memorization.</p>
      </div>

      {sortedSurahs.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm border-dashed">
          <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">Read the Quran and click the bookmark icon on any verse to save it here.</p>
          <Link href="/quran">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" /> Start Reading
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedSurahs.map(surahId => (
            <Card key={surahId} className="overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {surahId}
                  </div>
                  <h2 className="font-semibold text-lg">{grouped[surahId].name}</h2>
                </div>
                <Link href={`/quran/${surahId}`}>
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1 text-primary hover:text-primary hover:bg-primary/10">
                    Go to Surah <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="divide-y divide-border/50">
                {grouped[surahId].ayahs.sort((a, b) => a - b).map(ayah => (
                  <Link 
                    key={`${surahId}_${ayah}`}
                    href={`/quran/${surahId}#ayah-${ayah}`}
                    className="block hover:bg-accent/50 transition-colors p-4 sm:px-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4 text-primary fill-current opacity-50" />
                        <span className="font-medium">Ayah {ayah}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

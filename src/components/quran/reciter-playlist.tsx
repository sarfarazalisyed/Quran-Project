"use client";

import { useAudioStore } from "@/hooks/use-audio-store";
import { Reciter } from "@/lib/reciter-data";
import { Play, Pause, ListMusic, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export function ReciterPlaylist({ 
  reciter, 
  surahs 
}: { 
  reciter: Reciter; 
  surahs: Surah[];
}) {
  const { currentReciter, currentSurah, isPlaying, playSurah, togglePlayPause } = useAudioStore();

  const isCurrentReciter = currentReciter?.id === reciter.id;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="p-4 sm:p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <ListMusic className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            Surah Playlist
          </h2>
        </div>
        <div className="text-sm text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
          114 Tracks
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {surahs.map((surah) => {
          const isPlayingThis = isCurrentReciter && currentSurah === surah.number && isPlaying;
          const isActiveThis = isCurrentReciter && currentSurah === surah.number;

          return (
            <div 
              key={surah.number}
              onClick={() => {
                if (isActiveThis) {
                  togglePlayPause();
                } else {
                  playSurah(surah.number, surah.englishName, reciter);
                }
              }}
              className={`group flex items-center justify-between p-4 sm:px-6 hover:bg-primary/5 transition-all cursor-pointer ${
                isActiveThis ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Track Number / Play Icon */}
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-background border group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors relative">
                  {isPlayingThis ? (
                    <AudioWaveform className="w-5 h-5 text-primary animate-pulse" />
                  ) : isActiveThis ? (
                    <Pause className="w-5 h-5 text-primary" />
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:hidden">
                        {surah.number}
                      </span>
                      <Play className="w-5 h-5 text-primary ml-1 hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Track Details */}
                <div className="flex flex-col">
                  <span className={`font-semibold md:text-lg ${isActiveThis ? "text-primary" : "group-hover:text-primary transition-colors"}`}>
                    {surah.englishName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {surah.revelationType} • {surah.numberOfAyahs} Ayahs
                  </span>
                </div>
              </div>

              {/* Arabic Name (Hidden on very small screens) */}
              <div className="hidden sm:block text-right">
                <span className="text-2xl font-arabic text-foreground opacity-90">
                  {surah.name}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {surah.englishNameTranslation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

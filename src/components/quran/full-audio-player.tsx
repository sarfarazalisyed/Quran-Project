"use client";

import { useState, useEffect, useRef } from "react";
import { useAudioStore } from "@/hooks/use-audio-store";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, X, Maximize2, Minimize2,
  Repeat1, Repeat, Settings2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FullAudioPlayer() {
  const { 
    currentSurah, currentSurahName, currentReciter, 
    isPlaying, playbackSpeed, loopMode,
    setPlaying, setSpeed, setLoopMode, nextSurah, prevSurah,
    playSurah
  } = useAudioStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Re-appear if it was dismissed but a new track is selected
  useEffect(() => {
    if (currentSurah && isDismissed) {
      setIsDismissed(false);
    }
  }, [currentSurah, isDismissed]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    // Create new Audio object if it doesn't exist
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    
    const handleEnded = () => {
      if (loopMode === "surah") {
        audio.currentTime = 0;
        audio.play();
      } else if (loopMode === "all") {
        if (currentSurah && currentSurah < 114) {
          nextSurah();
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [loopMode, currentSurah, nextSurah, setPlaying]);

  // Sync isPlaying state with the actual audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy restriction
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSurah, setPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // If no surah is picked and not dismissed, just return null securely
  if (!currentSurah || !currentReciter || isDismissed) return null;

  const audioSrc = `https://cdn.islamic.network/quran/audio-surah/128/${currentReciter.id}/${currentSurah}.mp3`;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleDismiss = () => {
    setPlaying(false);
    setIsDismissed(true);
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* spacer to prevent content from hiding behind player */}
      <div className={`${isExpanded ? "h-32" : "h-20"} transition-all duration-300`} />

      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? "md:h-24 h-32" : "h-20"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted group cursor-pointer overflow-hidden">
          <div 
            className="h-full bg-primary relative transition-all duration-100 ease-linear"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={(e) => handleSeek([parseFloat(e.target.value)])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4 h-16 mt-1">
            
            {/* Track Info */}
            <div className="flex items-center gap-3 w-1/3 truncate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <span className="text-primary font-bold text-lg">{currentSurah}</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm md:text-base truncate">
                  {currentSurahName || `Surah ${currentSurah}`}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {currentReciter.name}
                </span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-2 md:gap-4 w-1/3 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex text-muted-foreground hover:text-foreground"
                onClick={prevSurah}
                disabled={currentSurah === 1}
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </Button>

              <Button 
                onClick={() => setPlaying(!isPlaying)}
                size="icon"
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
              >
                {isBuffering ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-1" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex text-muted-foreground hover:text-foreground"
                onClick={nextSurah}
                disabled={currentSurah === 114}
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </Button>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-end gap-2 w-1/3">
              <span className="text-xs text-muted-foreground hidden lg:inline-block w-24 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center justify-center p-2 rounded-md hover:bg-accent text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <span className="text-xs font-bold">{playbackSpeed}x</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="min-w-[4rem]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <DropdownMenuItem 
                      key={speed} 
                      onClick={() => setSpeed(speed)}
                      className={playbackSpeed === speed ? "bg-primary/10 text-primary font-bold" : ""}
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                className={`hidden md:flex ${loopMode !== 'off' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                onClick={() => setLoopMode(loopMode === 'off' ? 'all' : loopMode === 'all' ? 'surah' : 'off')}
              >
                {loopMode === 'surah' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-muted-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Settings2 className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDismiss}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Expanded Controls */}
          {isExpanded && (
            <div className="md:hidden flex items-center justify-between gap-4 mt-2 px-2 animate-in slide-in-from-top-2 fade-in zoom-in-95">
              <Button variant="ghost" size="sm" onClick={prevSurah} disabled={currentSurah === 1}>
                <SkipBack className="w-4 h-4 mr-1" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Button variant="ghost" size="sm" onClick={nextSurah} disabled={currentSurah === 114}>
                Next <SkipForward className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

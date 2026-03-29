"use client";

import { useState, useEffect } from "react";

export interface ReadingProgress {
  surahId: number;
  ayahInSurah: number;
  timestamp: number;
}

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("qp_lastRead");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveProgress = (surahId: number, ayahInSurah: number) => {
    const record = { surahId, ayahInSurah, timestamp: Date.now() };
    setProgress(record);
    localStorage.setItem("qp_lastRead", JSON.stringify(record));
  };

  return { progress, saveProgress };
}

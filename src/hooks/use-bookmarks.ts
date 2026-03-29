"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Bookmark {
  id: string; // surah_ayah
  surahId: number;
  ayahInSurah: number;
  surahName: string;
  timestamp: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // Load from local storage initially
  useEffect(() => {
    const saved = localStorage.getItem("qp_bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Optional: Sync with Supabase if logged in
  useEffect(() => {
    if (!isLoaded) return;
    
    async function syncWithDb() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // We could add full sync logic here. For now, it's local-first.
      // E.g., const { data } = await supabase.from('bookmarks').select('*')
    }
    
    syncWithDb();
  }, [isLoaded, supabase]);

  const toggleBookmark = (surahId: number, ayahInSurah: number, surahName: string) => {
    const id = `${surahId}_${ayahInSurah}`;
    
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === id);
      const newBookmarks = exists 
        ? prev.filter(b => b.id !== id)
        : [...prev, { id, surahId, ayahInSurah, surahName, timestamp: Date.now() }];
      
      localStorage.setItem("qp_bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (surahId: number, ayahInSurah: number) => {
    return bookmarks.some(b => b.id === `${surahId}_${ayahInSurah}`);
  };

  return { bookmarks, toggleBookmark, isBookmarked, isLoaded };
}

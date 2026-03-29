"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "makki" | "madani">("all");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((data) => {
        if (data.code === 200) setSurahs(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = surahs.filter((s) => {
    const matchSearch =
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.number) === search;
    const matchFilter =
      filter === "all" ||
      (filter === "makki" && s.revelationType === "Meccan") ||
      (filter === "madani" && s.revelationType === "Medinan");
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border py-8 sm:py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          The Holy Quran
        </h1>
        <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mt-3" />
        <p className="text-muted-foreground mt-3">
          114 Surahs • 6,236 Ayahs • 30 Juz
        </p>
      </div>

      {/* Search & Filter — Sticky */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by surah name, number, or meaning..."
              className="pl-9 pr-8 bg-card border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="surah-search"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 shrink-0">
            {(["all", "makki", "madani"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className={`text-xs ${filter === f ? "" : "text-muted-foreground"}`}
                id={`filter-${f}`}
              >
                {f === "all" ? "All" : f === "makki" ? "☀️ Makki" : "🌙 Madani"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Surah Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} surah{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((surah) => (
                <Link
                  key={surah.number}
                  href={`/quran/${surah.number}`}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/25 hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5"
                  id={`surah-${surah.number}`}
                >
                  {/* Number diamond */}
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center border-2 border-primary/40 rounded-lg rotate-45 bg-primary/5 group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                    <span className="text-xs font-bold text-primary group-hover:text-primary-foreground -rotate-45 transition-colors">
                      {surah.number}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {surah.englishName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {surah.englishNameTranslation}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${
                          surah.revelationType === "Meccan"
                            ? "border-amber-custom/30 text-amber-custom"
                            : "border-sky-custom/30 text-sky-custom"
                        }`}
                      >
                        {surah.revelationType === "Meccan" ? "Makki" : "Madani"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {surah.numberOfAyahs} ayahs
                      </span>
                    </div>
                  </div>

                  {/* Arabic Name */}
                  <span
                    className="text-xl text-muted-foreground/50 group-hover:text-primary/80 transition-colors shrink-0"
                    style={{ fontFamily: "var(--font-arabic)" }}
                    dir="rtl"
                  >
                    {surah.name}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

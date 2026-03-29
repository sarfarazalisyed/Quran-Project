import type { Metadata } from "next";
import { SurahList } from "@/components/quran/surah-list";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Read the Holy Quran — All 114 Surahs",
  description:
    "Browse and read all 114 Surahs of the Holy Quran with beautiful Arabic typography, English translations, and audio recitations. Search by surah name or filter by Makki/Madani.",
};

export default function QuranPage() {
  return (
    <>
      <SurahList />
      <Footer />
    </>
  );
}

import { TOP_RECITERS } from "@/lib/reciter-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronLeft, Headphones, Radio, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReciterPlaylist } from "@/components/quran/reciter-playlist";

type Props = {
  params: Promise<{ reciterId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const reciter = TOP_RECITERS.find((r) => r.id === resolvedParams.reciterId);
  if (!reciter) return { title: "Not Found" };
  return {
    title: `Listen to ${reciter.name}`,
    description: `Listen to the full Quran recited by ${reciter.name} (${reciter.style}).`,
  };
}

export default async function ReciterPage({ params }: Props) {
  const resolvedParams = await params;
  const reciter = TOP_RECITERS.find((r) => r.id === resolvedParams.reciterId);

  if (!reciter) {
    notFound();
  }

  // Fetch full surah list for Tracklist displaying
  let surahs = [];
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah", { next: { revalidate: 86400 } }); // Cache 1 day
    const data = await res.json();
    surahs = data.data;
  } catch (error) {
    console.error("Failed to load surahs:", error);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
      <Link href="/recitation" className="inline-block mb-6">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Back to Reciters
        </Button>
      </Link>

      {/* Reciter Header Profile */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-lg p-6 md:p-10 mb-8 mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Headphones className="w-64 h-64" />
        </div>

        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 border-4 border-background shadow-xl flex items-center justify-center shrink-0 relative z-10">
          <User className="w-16 h-16 text-primary" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-lg">
            HQ Audio
          </div>
        </div>

        <div className="text-center md:text-left relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            {reciter.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/15 text-primary border border-primary/20 backdrop-blur-sm">
              <Radio className="w-4 h-4" />
              {reciter.style}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border">
              {reciter.language}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border">
              114 Surahs
            </span>
          </div>
        </div>
      </div>

      <ReciterPlaylist reciter={reciter} surahs={surahs} />
    </div>
  );
}

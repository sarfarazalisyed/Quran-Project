import { TOP_RECITERS } from "@/lib/reciter-data";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Headphones, PlayCircle, Music } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listen to Quran",
  description: "Listen to full Surahs by world-renowned reciters including Mishary Alafasy, Abdul Basit, and Al-Husary.",
};

export default function RecitationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="mb-12 text-center mt-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Headphones className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Listen & Reflect</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Immerse yourself in beautifully recited audio from world-renowned Qaris. Select a reciter to start a continuous playlist.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TOP_RECITERS.map((reciter) => (
          <Link key={reciter.id} href={`/recitation/${reciter.id}`}>
            <Card className="group relative overflow-hidden backdrop-blur-xl border-border/50 bg-card hover:bg-accent/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 cursor-pointer h-full border">
              
              {/* Background abstract decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-primary/10 transition-colors" />
              
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Music className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
                    {reciter.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {reciter.style}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {reciter.language}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Listening
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

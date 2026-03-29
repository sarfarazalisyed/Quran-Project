import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-16 pt-16" id="hero-section">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 30deg, oklch(0.78 0.12 80 / 0.4) 30deg 60deg, transparent 60deg 90deg)`,
            backgroundSize: "120px 120px",
            animation: "rotatePattern 200s linear infinite",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[80px]" />
        {/* Floating stars */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/15"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              fontSize: `${0.5 + (i % 3) * 0.3}rem`,
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-10">
        {/* Text Group */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Open Source Quran Platform
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Read, Listen &<br />
            <span className="bg-gradient-to-r from-primary via-gold-light to-primary bg-clip-text text-transparent">
              Understand
            </span>{" "}
            the Quran
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A beautifully crafted platform to help you build a meaningful
            relationship with the Holy Quran through reading, recitation,
            memorization, and daily goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/quran">
              <Button size="lg" className="gap-2 rounded-xl px-8 text-base" id="hero-start-reading">
                <BookOpen className="w-5 h-5" />
                Start Reading
              </Button>
            </Link>
            <Link href="/recitation">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl px-8 text-base" id="hero-listen">
                <Headphones className="w-5 h-5" />
                Listen to Recitation
              </Button>
            </Link>
          </div>
        </div>

        {/* Bismillah Card */}
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-8 sm:p-10 text-center"
               style={{ animation: "glow 4s ease-in-out infinite" }}>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl text-primary leading-[2.2] mb-3"
              style={{ fontFamily: "var(--font-arabic)" }}
              dir="rtl"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground italic">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, List } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-16 px-4 sm:px-6" id="cta-section">
      <div className="max-w-3xl mx-auto">
        <Card className="relative overflow-hidden p-10 sm:p-14 text-center">
          {/* Decorative radials */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald/3 rounded-full blur-[60px]" />
          </div>

          <div className="relative z-10">
            <p className="text-4xl mb-4">🕋</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Start reading from Surah Al-Fatiha, or explore the 114 surahs of
              the Holy Quran. Set daily goals, track your progress, and
              memorize at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/quran/1">
                <Button size="lg" className="gap-2 rounded-xl" id="start-fatiha">
                  <BookOpen className="w-5 h-5" />
                  Start from Al-Fatiha
                </Button>
              </Link>
              <Link href="/quran">
                <Button variant="outline" size="lg" className="gap-2 rounded-xl" id="browse-surahs">
                  <List className="w-5 h-5" />
                  Browse All Surahs
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Headphones,
  HandHeart,
  BarChart3,
  Target,
  Search,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Read Quran",
    desc: "Beautiful Arabic typography with word-by-word translations in multiple languages.",
    href: "/quran",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Headphones,
    title: "Listen",
    desc: "Recitations from 600+ world-renowned reciters in Murattal & Mujawwad styles.",
    href: "/recitation",
    gradient: "from-emerald/20 to-emerald/5",
    iconColor: "text-emerald",
  },
  {
    icon: HandHeart,
    title: "Duas & Athkar",
    desc: "Curated morning/evening supplications with counters and audio pronunciation.",
    href: "/duas",
    gradient: "from-teal/20 to-teal/5",
    iconColor: "text-teal",
  },
  {
    icon: BarChart3,
    title: "Memorize",
    desc: "Smart Hifz tracker with spaced repetition, practice modes, and progress heatmaps.",
    href: "/hifz",
    gradient: "from-sky-custom/20 to-sky-custom/5",
    iconColor: "text-sky-custom",
  },
  {
    icon: Target,
    title: "Daily Goals",
    desc: "Set reading targets, track streaks, and complete the Quran at your own pace.",
    href: "/goals",
    gradient: "from-amber-custom/20 to-amber-custom/5",
    iconColor: "text-amber-custom",
  },
  {
    icon: Search,
    title: "Search & Study",
    desc: "Full-text search across translations, topic browsing, and deep Tafsir study.",
    href: "/search",
    gradient: "from-rose-custom/20 to-rose-custom/5",
    iconColor: "text-rose-custom",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-16 px-4 sm:px-6" id="features-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything You Need
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive tools for your Quran journey — reading, listening,
            memorizing, and more.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href} id={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="group h-full p-6 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {feature.desc}
                  </p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

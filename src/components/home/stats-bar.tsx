const STATS = [
  { value: "114", label: "Surahs" },
  { value: "6,236", label: "Ayahs" },
  { value: "600+", label: "Reciters" },
  { value: "100+", label: "Translations" },
];

export function StatsBar() {
  return (
    <section className="bg-card border-y border-border py-8" id="stats-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="block text-xs text-muted-foreground uppercase tracking-[0.15em] mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

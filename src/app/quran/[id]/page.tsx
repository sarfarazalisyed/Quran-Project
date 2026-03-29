import { SurahReader } from "@/components/quran/surah-reader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const id = params.id;
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (data.code === 200) {
      const surah = data.data;
      return {
        title: `Surah ${surah.englishName} (${surah.name}) — Read & Listen`,
        description: `Read Surah ${surah.englishName} (${surah.englishNameTranslation}) with Arabic text, English translation, and audio recitation. ${surah.numberOfAyahs} ayahs, ${surah.revelationType === "Meccan" ? "Makki" : "Madani"} surah.`,
      };
    }
  } catch {}
  return { title: `Surah ${id} — Quran Project` };
}

export default async function SurahPage(props: PageProps) {
  const params = await props.params;
  const surahId = parseInt(params.id, 10);
  return <SurahReader surahId={surahId} />;
}

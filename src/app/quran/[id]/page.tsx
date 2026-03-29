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
  
  // Fetch data again for JSON-LD (Next.js dedupes this automatically in production)
  let jsonLd = {};
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (data.code === 200) {
      const surah = data.data;
      
      // We take the first 3 ayahs for the FAQPage schema to avoid huge payloads
      const mainEntity = surah.ayahs.slice(0, 3).map((ayah: any) => ({
        "@type": "Question",
        "name": `What is the meaning of Surah ${surah.englishName} verse ${ayah.numberInSurah}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ayah.text
        }
      }));

      // Add general questions about the surah
      mainEntity.unshift({
        "@type": "Question",
        "name": `What is Surah ${surah.englishName} about?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Surah ${surah.englishName} (${surah.englishNameTranslation}) is a ${surah.revelationType === "Meccan" ? "Makki" : "Madani"} surah containing ${surah.numberOfAyahs} ayahs.`
        }
      });

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": mainEntity
      };
    }
  } catch (err) {
    console.error("Failed to generate JSON-LD", err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SurahReader surahId={surahId} />
    </>
  );
}

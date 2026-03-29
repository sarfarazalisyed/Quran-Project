import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://quran-project.com'

  // Fetch all 114 surahs to build dynamic sitemap
  let surahUrls: MetadataRoute.Sitemap = []
  
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah')
    const data = await res.json()
    
    if (data.code === 200) {
      surahUrls = data.data.map((surah: any) => ({
        url: `${baseUrl}/quran/${surah.number}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Failed to generate sitemap for surahs', error)
    // Fallback if API fails
    surahUrls = Array.from({ length: 114 }, (_, i) => ({
      url: `${baseUrl}/quran/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/quran`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  return [...staticRoutes, ...surahUrls]
}

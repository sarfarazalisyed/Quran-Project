# Quran Platform — Complete Product Plan
> A Quran.com-inspired platform built for global Muslims, Urdu/Hindi speakers, kids, and non-Muslims — with AEO-first architecture and Tadabur-powered audio features.

---

## Table of Contents
1. [Vision & Mission](#1-vision--mission)
2. [Target Audience](#2-target-audience)
3. [Competitive Edge](#3-competitive-edge)
4. [Product Roadmap](#4-product-roadmap)
5. [Feature Breakdown](#5-feature-breakdown)
6. [Tadabur Integration](#6-tadabur-integration)
7. [Tech Stack](#7-tech-stack)
8. [AEO Strategy](#8-aeo-strategy)
9. [Monetisation Plan](#9-monetisation-plan)
10. [Go-to-Market Strategy](#10-go-to-market-strategy)
11. [Revenue Projections](#11-revenue-projections)
12. [Immediate Next Steps](#12-immediate-next-steps)

---

## 1. Vision & Mission

**Vision:** Become the most trusted, accessible, and intelligent Quran platform for the next generation of Muslims and curious non-Muslims worldwide.

**Mission:** Make the Quran understandable, beautiful, and interactive for every person — regardless of their language, age, or background — using modern technology and AI.

**Platform name ideas:**
- `noor.app` — meaning light
- `tilawat.in` — meaning recitation
- `quranly.com` — modern and memorable

---

## 2. Target Audience

| Segment | Size | Need |
|---|---|---|
| Global Muslims | 1.8 billion | Daily reading, recitation, understanding |
| Indian / Urdu-speaking users | 200M+ | Urdu translation, Nastaliq font, RTL UI |
| Kids & students | Huge, underserved | Simple UI, hifz practice, gamification |
| Non-Muslims learning Islam | Growing | Plain-English explainers, context, no jargon |

---

## 3. Competitive Edge

### Why you win over Quran.com

| Feature | Quran.com | Your Platform |
|---|---|---|
| Urdu-first UX (Nastaliq font, RTL) | Partial | Full support |
| Word-by-word highlight during audio | Basic | Real-time via Tadabur timestamps |
| Number of reciters | ~15 | 600+ via Tadabur |
| Kids mode | None | Dedicated experience |
| AI verse explanation | None | Built-in (Claude API) |
| Non-Muslim onboarding | None | Dedicated intro experience |
| AEO optimisation | None | First-mover advantage |
| Reciter comparison tool | None | Unique feature |
| Hifz practice mode | Basic | Word-level pause-and-test |

---

## 4. Product Roadmap

### Phase 1 — MVP (Months 1–3)
> Goal: Launch a working, beautiful reader with audio. Get first 1,000 users.

- [ ] Quran reader — Arabic with transliteration
- [ ] Translations — English, Urdu, Hindi
- [ ] Audio recitation — top 10 reciters from Tadabur
- [ ] Verse bookmarks and reading progress
- [ ] Mobile-responsive design
- [ ] Basic AEO setup (schema markup, llms.txt, meta)
- [ ] Supabase auth (email + Google)

### Phase 2 — Engagement (Months 4–6)
> Goal: Build sticky features that bring users back daily.

- [ ] Word-by-word translation (tap any word)
- [ ] Real-time word highlighting during audio (Tadabur timestamps)
- [ ] Tafsir / commentary — Ibn Kathir, Maariful Quran
- [ ] Kids mode — simplified UI, encouraging UX
- [ ] Verse search by topic and keyword
- [ ] Reciter picker (browse 600+ reciters)
- [ ] Reciter comparison (same verse, different styles)
- [ ] Daily verse with email/push notification
- [ ] Urdu-first UI with Nastaliq font option

### Phase 3 — Monetisation (Months 7–12)
> Goal: Launch paid features and generate consistent revenue.

- [ ] Sadaqah / donation system with Ramadan campaigns
- [ ] Premium plan (offline access, no ads, advanced features)
- [ ] Hifz (memorisation) practice mode — word-level pause-and-test
- [ ] AI verse explanation — "Ask about this verse" (Claude API)
- [ ] Tajweed pronunciation checker (Tadabur-Whisper model)
- [ ] Structured hifz course (paid program)
- [ ] Audio verse search — hum or recite to identify verse

### Phase 4 — Scale (Year 2)
> Goal: Become the go-to platform. Expand content and languages.

- [ ] Bengali, Tamil, Turkish translations
- [ ] Scholar-verified content badges
- [ ] Community features — notes, discussions
- [ ] Mobile app (React Native)
- [ ] API for other Islamic developers
- [ ] Classroom mode for Islamic schools

---

## 5. Feature Breakdown

### Core Reader
- Clean Arabic text in Uthmani script
- Toggle between simple and Uthmani Arabic
- Transliteration for non-Arabic readers
- Side-by-side translation (English + Urdu)
- Adjustable font size
- Night mode / dark mode

### Audio System (powered by Tadabur)
- 600+ reciters to choose from
- Real-time word highlighting using JSON timestamps
- Playback speed control (0.5x to 1.5x)
- Loop a single verse or a range
- Background audio with lock screen controls

### Hifz Mode
- Play verse word-by-word with pauses
- User completes the next word
- AI checks pronunciation (Tadabur-Whisper)
- Progress tracking per surah
- Streak system for daily practice

### Kids Mode
- Large Arabic text, bright colours
- Simple English + Urdu translation only
- Animated encouragement on completion
- Parental progress dashboard
- Short Islamic stories alongside surahs

### AI Features
- "What does this verse mean?" — powered by Claude API
- Topic-based verse finder ("Show me verses about gratitude")
- Non-Muslim explainer mode — historical and contextual notes
- Pronunciation scoring for kids' recitation practice

---

## 6. Tadabur Integration

### What is Tadabur?
Tadabur is an open research dataset by Faisal Alherran — the largest Quranic audio corpus in existence.

| Stat | Value |
|---|---|
| Total audio | 1,400+ hours |
| Distinct reciters | 600+ |
| Verse-level files | 365,000+ |
| Surahs covered | 113 (Al-Fatiha missing — source separately) |
| Alignment | Word-level JSON timestamps |
| License | CC BY-NC 4.0 |
| Models | Tadabur-Whisper-Small (available now) |

### The JSON structure that powers everything
```json
{
  "reciter_id": 88,
  "surah_id": 3,
  "ayah_id": 82,
  "word_alignments": [
    { "word": "أفلا", "start": 0.089, "end": 0.87 },
    { "word": "يتدبرون", "start": 0.87, "end": 1.92 }
  ],
  "text_ar_uthmani": "أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ",
  "ayah_duration_s": 10.9,
  "audio_filename": "tadabur_spk0088_S3_A82_db1f8e71_000003.wav"
}
```

### Features unlocked by Tadabur

| Feature | How Tadabur enables it |
|---|---|
| Word highlighting | `word_alignments[].start` and `.end` timestamps |
| Reciter picker | 600+ `reciter_id` values |
| Hifz mode | Pause audio at word boundaries using timestamps |
| Reciter comparison | Same surah/ayah, different reciter_id |
| Pronunciation scoring | Tadabur-Whisper-Small model via HuggingFace API |
| Audio verse search | Run user audio through Whisper, match output |

### Integration steps
1. Explore dataset: `pip install datasets && load_dataset("FaisaI/tadabur", streaming=True)`
2. Download top 15 reciters' files (start small)
3. Upload audio to Cloudflare R2 (zero egress cost)
4. Import JSON metadata into Supabase `verse_audio` table
5. Build the word-highlight player component in Next.js
6. Add reciter picker UI connected to Supabase

### License action required
Contact Faisal Alherran on LinkedIn before commercial launch. Explain the platform's mission (Islamic education, non-profit use case, kids learning). Researchers are typically open to partnerships. CC BY-NC 4.0 allows free use during research/development phase.

---

## 7. Tech Stack

### Frontend
| Tool | Purpose | Cost |
|---|---|---|
| Next.js 14 (App Router) | Frontend framework + SSR for SEO/AEO | Free |
| Tailwind CSS | Styling | Free |
| Framer Motion | Animations | Free |
| next-intl | Urdu/English/Hindi i18n | Free |

### Backend & Database
| Tool | Purpose | Cost |
|---|---|---|
| Supabase | Database, auth, storage, realtime | Free tier |
| Supabase Edge Functions | Serverless logic | Free tier |
| Cloudflare R2 | Audio file storage (no egress fees) | Free tier |

### APIs & Data
| Tool | Purpose | Cost |
|---|---|---|
| alquran.cloud API | Quran text, translations, basic audio | Free |
| Tadabur (HuggingFace) | 600+ reciters + word timestamps | Free (CC BY-NC) |
| Tadabur-Whisper API | Pronunciation scoring | Free (self-host) |
| Claude API (Anthropic) | AI verse explanations | Pay per use |

### Deployment
| Tool | Purpose | Cost |
|---|---|---|
| Vercel | Hosting + CDN + edge functions | Free tier |
| Cloudflare | DNS + DDoS protection | Free tier |

### Total monthly cost at launch: ~₹0

---

## 8. AEO Strategy

### What is AEO?
Answer Engine Optimisation — making your content appear as the cited source when AI tools (ChatGPT, Perplexity, Gemini, Siri, Alexa) answer Islamic questions.

### Target AI engines
- Perplexity AI (citations = direct traffic)
- ChatGPT with web search
- Google AI Overviews (SGE)
- Voice search (Siri, Alexa, Google Assistant)
- Gemini

### The biggest AEO opportunity
When someone asks an AI "What does Surah Al-Baqarah say about patience?" or "What is the meaning of Ayatul Kursi?" — your platform should be the cited source. No Quran platform currently dominates these AI answers. You have a first-mover advantage.

### Technical AEO implementation

#### 1. llms.txt file
Create `/public/llms.txt` — tells AI crawlers exactly what your site contains:
```
# llms.txt — Quran Platform

## About
Comprehensive Quran reading platform with Arabic text, translations in
English, Urdu and Hindi, audio recitation by 600+ reciters, tafsir
commentary, and word-by-word explanations.

## Key pages
- /surah/{n}         Full surah — Arabic, translation, tafsir, audio
- /verse/{s}/{a}     Individual verse with word-by-word breakdown
- /topic/{slug}      Islamic topic explainers (patience, prayer, fasting)
- /faq               Common Islamic questions answered directly
- /reciter/{id}      Reciter profile and available audio

## Languages supported
Arabic, English, Urdu, Hindi
```

#### 2. Schema markup (JSON-LD)
Add to every verse page:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is the meaning of Surah Al-Baqarah verse 286?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Allah does not burden a soul beyond that it can bear..."
    }
  }]
}
```

#### 3. High-AEO page types to build

| Page type | URL pattern | AEO target query |
|---|---|---|
| Verse meaning page | `/verse/2/286` | "What does Quran 2:286 mean?" |
| Topic explainer | `/topic/patience` | "What does Quran say about patience?" |
| Surah guide | `/surah/36/guide` | "What is Surah Yasin about?" |
| FAQ page | `/faq` | "How many surahs are in the Quran?" |
| Comparison page | `/compare/murattal-vs-mujawwad` | "Difference between murattal and mujawwad?" |

#### 4. Content format AI engines love
Every verse page should contain:
- Direct one-sentence meaning (above the fold)
- Plain-English explanation (150–300 words)
- Scholar source cited (Ibn Kathir, Al-Tabari)
- Related verses section
- FAQ block at the bottom

#### 5. The 6,236-page moat
Build one dedicated, well-optimised page per verse. That is 6,236 pages, each answering a specific question an AI might receive. No competitor has done this well in Urdu. Use Next.js `generateStaticParams` to pre-render all of them at build time — zero server cost, maximum crawlability.

#### 6. Authority signals
- Cite classical scholars (Ibn Kathir, Al-Nawawi, Al-Tabari) by name
- Build backlinks from IslamQA, Wikipedia Islamic articles, Muslim blogs
- Maintain fast Core Web Vitals (Vercel edge = fast globally)
- Get indexed by Perplexity by submitting sitemap + llms.txt

---

## 9. Monetisation Plan

### Model 1 — Sadaqah / Donations (launch immediately)
- Prominent but tasteful donation button
- Ramadan campaign: "Support this platform this Ramadan"
- Optional recurring monthly sadaqah
- Show transparency: "Here's what your donation funds"
- **Target:** ₹1–5 lakh/month at scale

### Model 2 — Premium Subscription
**Price:** ₹99/month or ₹799/year

**Premium features:**
- Full offline mode (download surahs + audio)
- All 600+ reciters (free tier: top 10)
- Advanced hifz mode with AI pronunciation scoring
- No ads
- Exclusive tafsir content
- Kids mode with full features

**Target:** ₹3–10 lakh/month at 3,000–10,000 subscribers

### Model 3 — Courses (Phase 3+)
- Structured hifz program: "Memorise Juz Amma in 30 days" — ₹999
- Tajweed course for beginners — ₹1,499
- Quran for non-Muslims: Introduction course — ₹499
- **Target:** ₹5–20 lakh/month at scale

### Revenue summary

| Stream | Month 6 | Month 12 | Year 2 |
|---|---|---|---|
| Donations | ₹50K | ₹2L | ₹5L/mo |
| Premium subs | ₹30K | ₹3L | ₹10L/mo |
| Courses | — | ₹1L | ₹10L/mo |
| **Total** | **₹80K** | **₹6L** | **₹25L/mo** |

---

## 10. Go-to-Market Strategy

### Launch channels (zero budget)

**WhatsApp (highest ROI)**
- Share in Muslim community groups, Islamic school groups, Hifz student groups
- Create a broadcast list from day 1
- Share a new verse + reflection every Friday (Jumu'ah)

**Reddit**
- r/islam, r/learnquran, r/islamiclearning
- Post genuinely helpful content, not ads
- Answer questions and link naturally

**Twitter / X**
- Daily verse thread
- "Did you know?" Islamic facts
- Tag Islamic scholars and influencers

**YouTube Shorts / Instagram Reels**
- 30-second verse recitation clips with word highlighting
- The animated word highlight feature is extremely shareable

**Ramadan push**
- Launch or major update during Ramadan — highest Islamic content engagement of the year
- "Read the full Quran this Ramadan" campaign
- Free premium for the full month of Ramadan

### Partnership targets
- Islamic schools and madrasas in Hyderabad (start local)
- Online Quran tutors (offer them referral revenue)
- Islamic YouTube creators (affiliate program)
- IslamQA, SeekersGuidance (content exchange / backlinks)

---

## 11. Revenue Projections

### Conservative scenario

| Milestone | Timeline | Monthly Revenue |
|---|---|---|
| Launch MVP | Month 3 | ₹10,000 (donations) |
| 1,000 users | Month 4 | ₹50,000 |
| 5,000 users | Month 6 | ₹1,00,000 |
| 20,000 users | Month 9 | ₹3,00,000 |
| 50,000 users | Month 12 | ₹6,00,000 |
| 2,00,000 users | Year 2 | ₹25,00,000+ |

### Key assumption
3–5% of users convert to premium (₹99/month). Donations add 20–30% on top.

---

## 12. Immediate Next Steps

### This week
- [ ] Register domain (noor.app / tilawat.in / yourname.com)
- [ ] Create GitHub repo
- [ ] Set up Next.js 14 + Tailwind + Supabase project
- [ ] Explore Tadabur dataset on HuggingFace
- [ ] Contact Faisal Alherran (Tadabur author) on LinkedIn

### Week 2–3
- [ ] Build Quran reader using alquran.cloud API
- [ ] Set up Supabase schema (verses, users, bookmarks, audio)
- [ ] Integrate top 10 Tadabur reciters with audio player
- [ ] Build word-highlight player component

### Week 4
- [ ] Deploy to Vercel
- [ ] Add llms.txt and schema markup
- [ ] Submit sitemap to Google Search Console
- [ ] Soft launch — share with friends and family
- [ ] Post in 3 WhatsApp groups and r/islam

### Month 2
- [ ] Add Urdu translation + Nastaliq font
- [ ] Launch kids mode MVP
- [ ] Add donation button (Razorpay / Stripe)
- [ ] Start writing 10 AEO-optimised verse pages per week
- [ ] Build email list from users

---

## Appendix A — Supabase Schema (starter)

```sql
-- Verses (from alquran.cloud)
create table verses (
  id serial primary key,
  surah_id int not null,
  ayah_id int not null,
  text_ar_uthmani text,
  text_ar_simple text,
  translation_en text,
  translation_ur text,
  translation_hi text
);

-- Audio files (from Tadabur)
create table verse_audio (
  id serial primary key,
  surah_id int not null,
  ayah_id int not null,
  reciter_id int not null,
  audio_url text not null,
  duration_s float,
  word_alignments jsonb
);

-- Users
create table user_profiles (
  id uuid references auth.users primary key,
  display_name text,
  preferred_reciter int default 1,
  preferred_translation text default 'en',
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Bookmarks
create table bookmarks (
  id serial primary key,
  user_id uuid references user_profiles(id),
  surah_id int,
  ayah_id int,
  note text,
  created_at timestamptz default now()
);

-- Reading progress
create table reading_progress (
  user_id uuid references user_profiles(id),
  surah_id int,
  last_ayah_id int,
  updated_at timestamptz default now(),
  primary key (user_id, surah_id)
);
```

---

## Appendix B — Tadabur Quick Start

```python
# Explore the dataset
from datasets import load_dataset

ds = load_dataset("FaisaI/tadabur", split="train", streaming=True)

for sample in ds.take(3):
    print(f"Reciter: {sample['reciter_id']}")
    print(f"Surah {sample['surah_id']}, Ayah {sample['ayah_id']}")
    print(f"Duration: {sample['ayah_duration_s']}s")
    print(f"Word alignments: {sample['word_alignments'][:2]}")
    print("---")
```

---

## Appendix C — llms.txt Template

Save as `/public/llms.txt` in your Next.js project:

```
# [Your Platform Name] — Quran Reading & Learning Platform

## About
The most accessible Quran reading platform for global Muslims,
Urdu-speaking users, kids, and non-Muslims exploring Islam.
Includes Arabic text, word-by-word translation, 600+ audio reciters,
tafsir commentary, and AI-powered verse explanations.

## Content
- Complete Quran: all 114 surahs, 6,236 verses
- Translations: English, Urdu, Hindi
- Audio: 600+ reciters with word-level synchronisation
- Tafsir: Ibn Kathir, Maariful Quran
- Topics: patience, prayer, fasting, forgiveness, family, justice

## Key URL patterns
- /surah/{1-114}             Full surah page
- /verse/{surah}/{ayah}      Individual verse deep-dive
- /topic/{topic-slug}        Islamic topic guide
- /reciter/{id}              Reciter profile
- /faq                       Islamic questions answered
- /kids                      Kids-friendly Quran experience

## Languages
Arabic (Uthmani script), English, Urdu (Nastaliq), Hindi

## Contact
[your email]
```

---

*Built with Next.js · Supabase · Tadabur · Cloudflare R2 · Vercel*
*Last updated: March 2026*
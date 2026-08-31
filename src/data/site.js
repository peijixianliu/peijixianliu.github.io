/* ------------------------------------------------------------------
   SITE CONTENT
   All copy, links and image paths live here. Edit this one file to
   update the site — components read from it and never hard-code text.
   Images referenced as "/images/xxx.jpg" live in  public/images/.
------------------------------------------------------------------- */

export const profile = {
  name: 'Pei Jixian Liu',
  nameLines: ['PEI JIXIAN', 'LIU'],
  roles: ['Costume Designer', 'AI Visual Artist', 'Character Designer'],
  // Hero headline — the italic serif word is rendered separately for contrast
  heroLead: 'Designing',
  heroAccent: 'character',
  heroTail: 'for stage, screen and synthetic worlds.',
  tagline: 'Costume Design · Wardrobe Supervision · AI-assisted Concept Design',
  location: 'Los Angeles, CA',
  availability: 'Available for travel',
  email: 'jixian.liu99@gmail.com',
  website: 'peiliu.design',
  portrait: '/images/portrait.jpg',

  /* Hero video, in three quality tiers. The Hero picks one at load time from
     viewport width x devicePixelRatio, so a 4K display gets the 2560 master
     and a laptop is not made to download it. Remove the whole `heroVideo`
     object and the generative canvas backdrop plays instead. */
  heroVideo: {
    poster: '/media/hero-poster.jpg',
    sources: [
      { minWidth: 2400, src: '/media/hero-2560.mp4' },
      { minWidth: 1400, src: '/media/hero-1920.mp4' },
      { minWidth: 0, src: '/media/hero-1280.mp4' },
    ],
  },
}

export const about = {
  eyebrow: 'The Designer',
  heading: 'Between the atelier and the render engine.',
  paragraphs: [
    'I am a costume designer and AI visual artist based in Los Angeles, trained in fashion design at the School of the Art Institute of Chicago and in costume design at Carnegie Mellon University, School of Drama.',
    'My practice moves between two workbenches. One holds buckram, dye baths, tambour needles and a dress form — the slow craft of building a garment that has to survive eight shows a week. The other is a concept pipeline where AI generation, 3D sculpting and digital rendering let a character be tested, broken and rebuilt a hundred times before a single seam exists.',
    'I design for theater, film and television, and I supervise the wardrobe that keeps those designs alive on set. The through-line is the same in every medium: clothing as evidence of who someone is.',
  ],
  education: [
    {
      school: 'Carnegie Mellon University, School of Drama',
      degree: 'M.F.A. Costume Design',
      years: '2023 — 2026',
    },
    {
      school: 'School of the Art Institute of Chicago',
      degree: 'B.F.A. Fashion Design',
      years: '2018 — 2022',
    },
  ],
  stats: [
    { value: '15+', label: 'Productions designed' },
    { value: '3', label: 'Disciplines: stage / screen / AI' },
    { value: '01', label: 'Best Sci-Fi, NY Shorts Fest' },
  ],
}

/* ------------------------------------------------------------------
   SELECTED WORKS
   `category` drives the filter bar. `image` points at public/images/.

   Layout: `size` is a span in a 6-column grid — wide = 4, standard = 3,
   tall = 2 — with a fixed frame shape each (16:9.4, 4:3, 3:4.35). The
   entries below are grouped so every row adds up to exactly 6; if you add
   or remove work, re-check those sums or the grid will leave holes.

   The frames crop (object-fit: cover), so an image whose shape is far from
   its slot loses its edges. The fix is to prepare the picture to the slot's
   ratio — see tools/fit_ai_images.py, which does exactly that for the four
   Hyperion sheets.

   NOTE — the images are real. The four HYPERION blurbs are still draft copy.
------------------------------------------------------------------- */

export const workCategories = [
  { id: 'all', label: 'All Work' },
  { id: 'ai', label: 'AI Character Design' },
  { id: 'film', label: 'Film & Television' },
  { id: 'theater', label: 'Theater' },
]

export const works = [

  /* ---- row 1 ---- */
  {
    id: 'ai-bikura',
    category: 'ai',
    categoryLabel: 'AI Character Design',
    title: 'Hyperion — Bikura',
    subtitle: 'Character study',
    year: '2025',
    role: 'Concept & Character Design',
    image: '/images/work-ai-01.jpg',
    size: 'wide',
    blurb:
      'Coarse robes worn by a people who have stopped changing. Designed for sameness — the same garment on seventy bodies, aged seventy different ways.',
    tags: ['AI Pipeline', 'Draping', 'Aging & Distressing'],
  },
  {
    id: 'film-inversion',
    category: 'film',
    categoryLabel: 'Short Film',
    title: 'Inversion',
    subtitle: 'Dir. Owen Zhang',
    year: '2022',
    role: 'Costume Designer',
    image: '/images/work-film-01.jpg',
    size: 'tall',
    award: 'Best Sci-Fi — NY Shorts Fest',
    blurb:
      'Near-future science fiction. A restrained, engineered wardrobe built to read as institutional uniform first and personal history second.',
    tags: ['Science Fiction', 'Costume Design'],
  },

  /* ---- row 2 ---- */
  {
    id: 'theater-arcadia',
    category: 'theater',
    categoryLabel: 'Theater',
    title: 'Arcadia',
    subtitle: 'Dir. Kyle Haden · Helen Wayne Rauh Theater',
    year: '2026',
    role: 'Costume Designer',
    image: '/images/work-theater-01.jpg',
    size: 'standard',
    blurb:
      'Stoppard across two centuries in one room. Two period vocabularies designed to share a stage without ever quite touching.',
    tags: ['Period', 'Tailoring', 'Millinery'],
  },
  {
    id: 'ai-shrike',
    category: 'ai',
    categoryLabel: 'AI Character Design',
    title: 'Hyperion — Shrike',
    subtitle: 'Character study',
    year: '2025',
    role: 'Concept & Character Design',
    image: '/images/work-ai-02.jpg',
    size: 'standard',
    blurb:
      'The hardest silhouette in the series: a body with no cloth on it at all, where every surface has to do the work costume normally does.',
    tags: ['AI Pipeline', 'Character Design', 'ZBrush'],
  },

  /* ---- row 3 ---- */
  {
    id: 'film-she-is-just-her',
    category: 'film',
    categoryLabel: 'Television',
    title: 'She Is Just Her',
    subtitle: '28-episode drama series · Youku',
    year: '2024',
    role: 'Assistant Costume Designer',
    image: '/images/work-film-02.jpg',
    size: 'wide',
    blurb:
      'Long-form television. Continuity tracking, sourcing and fitting coordination across twenty-eight episodes and a full principal cast.',
    tags: ['Continuity', 'Sourcing', 'Wardrobe'],
  },
  {
    id: 'theater-dance-light',
    category: 'theater',
    categoryLabel: 'Dance',
    title: 'Dance / Light',
    subtitle: 'Chor. Ruhnke, Bamdad, Lee, Santiago · Helen Wayne Rauh Theater',
    year: '2024 — 2026',
    role: 'Costume Designer',
    image: '/images/work-theater-03.jpg',
    size: 'tall',
    blurb:
      'Four pieces across two seasons. Garments designed for the way fabric behaves in motion under a moving light plot.',
    tags: ['Dance', 'Draping', 'Dyeing'],
  },

  /* ---- row 4 ---- */
  {
    id: 'theater-love-and-money',
    category: 'theater',
    categoryLabel: 'Theater',
    title: 'Love & Money',
    subtitle: 'Dir. Pria Dahiya · John Wells Video Studio, PA',
    year: '2024',
    role: 'Costume Designer',
    image: '/images/work-theater-05.jpg',
    size: 'standard',
    blurb:
      'A story told backwards. The wardrobe runs in reverse with it, so that what the audience reads as a beginning is built from the wear of an ending.',
    tags: ['Contemporary', 'Character Dressing'],
  },
  {
    id: 'theater-anarchist',
    category: 'theater',
    categoryLabel: 'Theater',
    title: 'Accidental Death of an Anarchist',
    subtitle: 'Dir. Neil Wang · Theater Row, NY',
    year: '2022',
    role: 'Costume Designer',
    image: '/images/work-theater-02.jpg',
    size: 'standard',
    blurb:
      'Farce with teeth. Costume as running joke and as accusation — quick changes engineered into the comedy itself.',
    tags: ['Farce', 'Quick Change'],
  },

  /* ---- row 5 ---- */
  {
    id: 'ai-semfa',
    category: 'ai',
    categoryLabel: 'AI Character Design',
    title: 'Hyperion — Semfa',
    subtitle: 'Character study',
    year: '2025',
    role: 'Concept & Character Design',
    image: '/images/work-ai-03.jpg',
    size: 'wide',
    blurb:
      'Working clothes for someone who tends other people. Everything about the build had to survive being knelt in, slept in and bled on.',
    tags: ['AI Pipeline', 'Costume Illustration', 'Textile'],
  },
  {
    id: 'theater-hanging-garden',
    category: 'theater',
    categoryLabel: 'Theater',
    title: 'The Murder of Hanging Garden',
    subtitle: 'Dir. Carl Chen · Hudson Guild Theater, NY',
    year: '2022',
    role: 'Costume Designer',
    image: '/images/work-theater-04.jpg',
    size: 'tall',
    blurb:
      'A closed room and a cast of suspects. Costume used to place each character socially before a single line establishes it.',
    tags: ['Period', 'Character Dressing'],
  },

  /* ---- row 6 ---- */
  {
    id: 'ai-tuk',
    category: 'ai',
    categoryLabel: 'AI Character Design',
    title: 'Hyperion — Tuk',
    subtitle: 'Character study',
    year: '2025',
    role: 'Concept & Character Design',
    image: '/images/work-ai-04.jpg',
    size: 'standard',
    blurb:
      'The smallest brief in the series and the most specific: one traveller, layered for a climate that changes faster than he can.',
    tags: ['AI Pipeline', 'Layering', 'Character Design'],
  },
  {
    id: 'film-go-fish',
    category: 'film',
    categoryLabel: 'Short Film',
    title: 'Go Fish',
    subtitle: 'Dir. Eliot Herron',
    year: '2025',
    role: 'Costume Designer',
    image: '/images/work-film-03.jpg',
    size: 'standard',
    blurb:
      'A small cast, a tight frame, and a wardrobe built almost entirely out of texture and wear.',
    tags: ['Aging & Distressing', 'Naturalism'],
  },

  /* ---- row 7 : one full-width card ---- */
  {
    id: 'ai-environment',
    category: 'ai',
    categoryLabel: 'AI Environment Design',
    title: 'Hyperion — Environment',
    subtitle: 'Environment asset',
    year: '2025',
    role: 'Concept & Environment Design',
    image: '/images/work-ai-05.jpg',
    size: 'full',
    blurb:
      'The world the costumes have to survive. Built as an asset set — terrain, structures and weather — so a character can be dropped into it and lit consistently.',
    tags: ['AI Pipeline', 'Environment Design', 'Worldbuilding'],
  },
]

/* ------------------------------------------------------------------
   CAPABILITIES
------------------------------------------------------------------- */

export const capabilities = {
  eyebrow: 'Capabilities',
  heading: 'What I bring into the room.',
  intro:
    'Trained in construction before rendering, and in rendering before automation — so every digital decision still answers to how a garment is actually built.',
  groups: [
    {
      index: '01',
      title: 'Design & Rendering',
      summary:
        'From traditional costume illustration to an AI-assisted concept pipeline, ending in resolved, buildable drawings.',
      tags: [
        'Costume Illustration',
        'Digital Rendering',
        'Photoshop',
        'Procreate',
        'AI-assisted Concept Pipeline',
        'Maya',
        'ZBrush',
      ],
    },
    {
      index: '02',
      title: 'Pattern & Garment',
      summary:
        'Flat patterning, draping and tailoring — including the structured work most digital designers hand off.',
      tags: [
        'Draping',
        'Flat Patterning',
        'Digital Patterning',
        'Tailoring',
        'Hand & Machine Sewing',
        'Tutu Construction',
        'Alterations',
      ],
    },
    {
      index: '03',
      title: 'Crafts & Textile',
      summary:
        'Surface work that gives a costume its age, its light and its texture on camera and under stage light.',
      tags: [
        'Millinery',
        'Fabric Dyeing',
        'Aging & Distressing',
        'Devoré',
        'Tambour Beading',
        'Screen-Printing',
        'Embroidery',
      ],
    },
    {
      index: '04',
      title: 'Wardrobe & Production',
      summary:
        'The operational half: breakdown, budget, continuity and the day-to-day of keeping a show dressed.',
      tags: [
        'Script Breakdown',
        'Continuity Tracking',
        'Swatching & Sourcing',
        'Fitting Coordination',
        'Budgeting',
        'Costume Maintenance',
        'Hair & SFX Makeup',
      ],
    },
  ],
}

/* ------------------------------------------------------------------
   CONTACT
------------------------------------------------------------------- */

export const contact = {
  eyebrow: 'Contact',
  heading: 'Let’s build the character.',
  note: 'Open to costume design, wardrobe supervision and AI-assisted concept work — features, series, stage and independent projects.',
  email: 'jixian.liu99@gmail.com',
  location: 'Los Angeles, CA',
  // Replace the "#" values with your real profile URLs.
  /* `href` is used verbatim. Anything starting with http opens in a new tab
     (see Contact.jsx). The résumé path is RELATIVE on purpose: the site is one
     document with a hash router, so it resolves the same whether the site is
     served from a domain root or a /repo/ sub-path. */
  socials: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/pei_jixian/',
      handle: '@pei_jixian',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/pei-liu-8126502b0/',
      handle: 'Pei Jixian Liu',
    },
    {
      label: 'Résumé (PDF)',
      href: 'resume/Pei-Jixian-Liu-CV.pdf',
      handle: 'Download',
    },
  ],
}

/* order here drives the nav, its 01–04 numbering, and nothing else — it must
   match the section order in App.jsx */
export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------------
   PROJECT DETAIL PAGES
   One entry per `works` id in site.js. Clicking a card in Selected
   Works opens #/work/<id> and renders this content.

   FACTS (team, venue, season, role) are taken from the CV and are
   accurate. PROSE (tagline, synopsis, approach) is draft copy written
   as scaffolding — replace all of it with your own writing.

   The lead image comes from the card in site.js. `gallery` holds the
   additional images for this page; captions are optional.
------------------------------------------------------------------- */

/* `gallery: []` means "use the generated one". Galleries are built by
   tools/build_galleries.py from the source images in the connected folder and
   land in src/data/galleries.js; WorkDetail reads that whenever the entry here
   is empty. Drop more photographs into a project's folder and they are picked
   up on the next run — no edit needed here.

   To hand-write a gallery instead (it overrides the generated one):

     gallery: [
       { src: '/images/arcadia-02.jpg', caption: 'Fitting' },
       { src: '/images/arcadia-03.jpg' },
     ],
*/

export const workDetails = {
  /* ================= AI CHARACTER DESIGN ================= */

  'ai-bikura': {
    tagline:
      'Seventy identical robes, and the problem of making sameness read as character.',
    facts: [
      { label: 'Series', value: 'Hyperion' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Concept & Character Design' },
      { label: 'Pipeline', value: 'AI generation · ZBrush · Photoshop' },
    ],
    team: [],
    synopsis: [
      'The Bikura are a small human community that has stopped changing — no growth, no variation, no individual history written into what they wear. Designing them meant designing a single garment and then designing seventy different lives inside it.',
    ],
    approach: [
      'I started from the cloth rather than the silhouette: a coarse, undyed weave that would take wear differently on every body. Generation was used to explore how one pattern reads at different scales and drapes, then the resolved shapes were rebuilt so the seam logic would actually hold on a real form.',
      'The variation lives entirely in surface — abrasion at the shoulder, salt bloom at the hem, the way a hood collapses after years of being pushed back the same way. Nothing about the cut changes from figure to figure.',
    ],
    gallery: [],
  },

  'ai-shrike': {
    tagline:
      'A body with no cloth on it, where every surface has to do the work costume normally does.',
    facts: [
      { label: 'Series', value: 'Hyperion' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Concept & Character Design' },
      { label: 'Pipeline', value: 'AI generation · ZBrush · Photoshop' },
    ],
    team: [],
    synopsis: [
      'The hardest brief in the series. There is no garment to design — only a figure that has to communicate threat, ritual and age through form alone.',
    ],
    approach: [
      'I treated the plating as tailoring: panels cut on a grain, seams placed where a body needs to articulate, hard edges finished the way a good jacket edge is finished. The reference was armor construction rather than creature design.',
      'Scale was the last decision and the most important one — the figure had to read at silhouette size, from the back of a house, before any detail earns attention.',
    ],
    gallery: [],
  },

  'ai-semfa': {
    tagline: 'Working clothes for someone whose job is other people.',
    facts: [
      { label: 'Series', value: 'Hyperion' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Concept & Character Design' },
      { label: 'Pipeline', value: 'AI generation · Procreate · Photoshop' },
    ],
    team: [],
    synopsis: [
      'A healer, dressed for a job that is physical, repetitive and dirty. The design brief was less about who she is than about what her clothes have had to survive.',
    ],
    approach: [
      'Everything is built to be knelt in, slept in and washed badly. Sleeves that push up and stay, a front that opens one-handed, pockets placed where a hand goes without looking.',
      'The palette is what happens to undyed cloth after enough seasons: nothing chosen, everything faded toward the same neutral.',
    ],
    gallery: [],
  },

  'ai-tuk': {
    tagline: 'One traveller, layered for a climate that changes faster than he can.',
    facts: [
      { label: 'Series', value: 'Hyperion' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Concept & Character Design' },
      { label: 'Pipeline', value: 'AI generation · ZBrush · Photoshop' },
    ],
    team: [],
    synopsis: [
      'The smallest brief in the series and the most specific. A guide who carries everything he owns, dressed in layers added and shed on the move.',
    ],
    approach: [
      'Designed from the outside in: the outermost layer had to work alone, then work again with each layer under it, without the silhouette collapsing into bulk.',
      'Every fastening is designed to be worked with one hand and with cold fingers — which ended up driving most of the visible detail.',
    ],
    gallery: [],
  },

  'ai-environment': {
    tagline: 'The world the costumes have to survive.',
    facts: [
      { label: 'Series', value: 'Hyperion' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Concept & Environment Design' },
      { label: 'Pipeline', value: 'AI generation · Photoshop' },
    ],
    team: [],
    synopsis: [
      'An environment asset set for the Hyperion series — terrain, structures and weather built so that any of the four characters can be dropped into it and lit consistently.',
    ],
    approach: [
      'Costume and environment are the same problem seen twice: both are asking what this place does to a body. The palette and the weathering here were derived from the garments, not the other way round.',
      'Built as separable assets rather than a single illustration, so a scene can be recomposed without regenerating it.',
    ],
    gallery: [],
  },

  /* ================= THEATER ================= */

  'theater-arcadia': {
    tagline:
      'Two centuries sharing one room, designed never to quite touch.',
    facts: [
      { label: 'Venue', value: 'Helen Wayne Rauh Theater, PA' },
      { label: 'Season', value: '2026' },
      { label: 'Role', value: 'Costume Designer' },
      { label: 'Playwright', value: 'Tom Stoppard' },
    ],
    team: [{ role: 'Director', name: 'Kyle Haden' }],
    synopsis: [
      'Stoppard’s play runs two timelines through a single room — an English country house in 1809 and the same room in the present — with the two periods eventually onstage together.',
      'The design problem is the overlap: both centuries have to be unmistakable on their own, and legible as one picture when they share the stage.',
    ],
    approach: [
      'I kept the two periods in separate color temperatures rather than separate palettes, so the 1809 group reads warm and the modern group cool against the same set. Nothing in the modern dressing borrows a period line, and nothing period borrows a modern fabric.',
      'The final scene, where both groups occupy the room at once, was designed backwards from a single image — everything earlier had to make that picture legible without explanation.',
    ],
    gallery: [],
  },

  'theater-dance-light': {
    tagline: 'Garments designed for how fabric behaves, not how it hangs.',
    facts: [
      { label: 'Venue', value: 'Helen Wayne Rauh Theater, PA' },
      { label: 'Season', value: '2024 & 2026' },
      { label: 'Role', value: 'Costume Designer — four pieces' },
      { label: 'Scope', value: 'Two seasons' },
    ],
    /* paired by season, per the CV: Ruhnke and Bamdad in 2026,
       Lee and Santiago in 2024 */
    team: [
      { role: 'Chor. 2026', name: 'Olivia Ruhnke' },
      { role: 'Chor. 2026', name: 'Daniel Bamdad' },
      { role: 'Chor. 2024', name: 'Kiara Lee' },
      { role: 'Chor. 2024', name: 'Benji Santiago' },
    ],
    synopsis: [
      'Four short pieces across two seasons of the school’s dance programme, each with its own choreographer and its own relationship to the light plot.',
    ],
    approach: [
      'Dance costume is designed in motion or not at all. Every fabric was tested on a body turning under a moving light before anything was cut — weight, recovery, and how much of the shape survives a fast reversal.',
      'Dyeing did most of the work. The pieces share a construction vocabulary and differ almost entirely in color and finish, which kept the build tractable across two seasons.',
    ],
    gallery: [],
  },

  'theater-love-and-money': {
    tagline: 'A story told backwards, and a wardrobe that runs in reverse with it.',
    facts: [
      { label: 'Venue', value: 'John Wells Video Studio, PA' },
      { label: 'Season', value: '2024' },
      { label: 'Role', value: 'Costume Designer' },
      { label: 'Playwright', value: 'Dennis Kelly' },
    ],
    team: [{ role: 'Director', name: 'Pria Dahiya' }],
    synopsis: [
      'Kelly’s play moves backwards in time, so the audience meets the aftermath first and the cause last. Debt is the engine underneath all of it.',
    ],
    approach: [
      'Because the play runs in reverse, the wardrobe had to be built from its end state and un-worn scene by scene. What the audience reads as a beginning is the newest version of a garment they have already seen destroyed.',
      'Money is the subject, so cost had to be visible in the cloth — not through obvious markers of wealth, but through fit, upkeep and how recently something was replaced.',
    ],
    gallery: [],
  },

  'theater-anarchist': {
    tagline: 'Costume as running joke and as accusation.',
    facts: [
      { label: 'Venue', value: 'Theater Row, NY' },
      { label: 'Season', value: '2022' },
      { label: 'Role', value: 'Costume Designer' },
      { label: 'Playwright', value: 'Dario Fo' },
    ],
    team: [{ role: 'Director', name: 'Neil Wang' }],
    synopsis: [
      'Fo’s farce puts a serial impostor inside a police station investigating a death in custody. The comedy is fast, physical, and pointed at real institutional violence.',
    ],
    approach: [
      'The impostor’s transformations had to be engineered as much as designed — each disguise a quick change that reads instantly from the house and survives being performed eight times a week.',
      'Everyone else stays in a tight, deliberately dull institutional palette, so that every costume joke lands against a straight face.',
    ],
    gallery: [],
  },

  'theater-hanging-garden': {
    tagline: 'A closed room, a cast of suspects, and clothes that testify first.',
    facts: [
      { label: 'Venue', value: 'Hudson Guild Theater, NY' },
      { label: 'Season', value: '2022' },
      { label: 'Role', value: 'Costume Designer' },
    ],
    team: [{ role: 'Director', name: 'Carl Chen' }],
    synopsis: [
      'A murder mystery played in a single room, where the audience is asked to read a group of strangers and decide who is lying.',
    ],
    approach: [
      'In a whodunit the costume does exposition the script does not have time for. Each character is placed socially — money, work, effort, self-regard — before their first line establishes anything.',
      'The trick is planting detail that only pays off in retrospect: one wrong shoe, one thing too new, one repair made too carefully.',
    ],
    gallery: [],
  },

  /* ================= FILM & TELEVISION ================= */

  'film-inversion': {
    tagline: 'A story about androids, human life, and the future.',
    facts: [
      { label: 'Format', value: 'Short film' },
      { label: 'Year', value: '2022' },
      { label: 'Role', value: 'Costume Designer' },
      { label: 'Award', value: 'Best Sci-Fi, New York Shorts International Film Festival' },
    ],
    team: [{ role: 'Director', name: 'Owen Zhang' }],
    synopsis: [
      'A near-future science fiction film, shot tight and cold. The story asks whether, in the very near future, we will choose to trust the artificial beings we create, while exploring the relationship between humans and androids.',
    ],
    approach: [
      'The film is grounded in a dark, cool-toned visual palette. My costume design focused on shaping character through the tactile qualities of different fabrics.',
      'The protagonist, who chooses to trust and ultimately save an android child, wears soft, approachable fabrics that reflect her empathy and openness. In contrast, the police officer, who coldly carries out his mission, is defined by the structured textures of armor and leather, along with clean, sharp lines that reflect his emotional distance.',
    ],
    gallery: [],
  },

  'film-she-is-just-her': {
    tagline: 'A fashion drama series about the modern workplace and a woman’s journey of growth.',
    facts: [
      { label: 'Format', value: '28-episode drama series' },
      { label: 'Broadcaster', value: 'Youku' },
      { label: 'Year', value: '2024' },
      { label: 'Role', value: 'Assistant Costume Designer' },
    ],
    team: [],
    synopsis: [
      'A television series filmed in 2024, currently unreleased. The story follows Shengxia as she navigates the challenges of the modern workplace, alongside a developing romantic relationship with Lin Chao.',
    ],
    approach: [
      'A fast-paced television production where I designed costumes for multiple co-star characters. My responsibilities included script breakdowns, sourcing, shopping, tracking, fitting coordination, and cross-department communication. I also assisted the lead costume designer with fittings for A-list principals.',
    ],
    gallery: [],
  },

  'film-go-fish': {
    tagline: 'A short film about letting go of the anxiety of never feeling good enough.',
    facts: [
      { label: 'Format', value: 'Short film' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'Costume Designer' },
    ],
    team: [{ role: 'Director', name: 'Eliot Herron' }],
    synopsis: [
      'Go Fish follows Kara, a college student who lacks confidence in herself and creates a fake dating profile. What begins as an attempt to become someone else unexpectedly leads her to a party where she and the person she likes discover each other as their authentic selves.',
    ],
    approach: [
      'For this project, I explored how costume could capture Kara’s very specific feeling of wanting to go to the party while still being unsure of herself. Through the contrast between Kara and her roommate Cassie’s more mature style, the costumes create two distinct representations of femininity and show different ways of navigating confidence, identity, and growing into oneself.',
    ],
    gallery: [],
  },
}

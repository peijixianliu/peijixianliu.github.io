# Pei Jixian Liu — Portfolio

Dark, editorial portfolio site. React + Vite, desktop-first, 1700px content width.

## Deploy to GitHub Pages

Two routes. The first needs no build and no toolchain.

**1 — serve `docs/` (recommended, works immediately)**

`docs/` is the whole site as plain files: one `index.html` beside real image
and video folders, all paths relative, every image below the fold lazy-loaded.

```bash
git init && git add . && git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source → Deploy from a branch → `main` / `docs`**.
The site is live at `https://<you>.github.io/<repo>/` in a minute or two.

Rebuild `docs/` after any change and commit it again:

```bash
node tools/build_preview.mjs
```

**2 — build the React app in CI**

`.github/workflows/deploy.yml` runs `npm install && npm run build` on a GitHub
runner and publishes `dist/`. Switch to it with **Settings → Pages → Source →
GitHub Actions**. Nothing else to change: `vite.config.js` already sets
`base: './'`, so the asset paths work at a project-page URL.

Either way the router is hash-based (`#/work/<id>`), so there are no 404s on
refresh and no server rewrites to configure.

### Custom domain

Put the domain in `docs/CNAME` (one line, no protocol) and set it under
Settings → Pages. `tools/build_preview.mjs` rewrites `docs/` on every run, so
also add it to the file list there if you want it regenerated automatically.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Node 18+ required.

## Where everything lives

```
src/data/site.js          ← cards: all text, links, the works array. Edit first.
src/data/workDetails.js   ← one entry per project: the detail page content
src/router.js             ← 20-line hash router (#/work/<id>)
src/components/           ← one component per section, plus WorkDetail
src/styles/               ← design tokens (global.css) + a stylesheet per section
public/images/            ← project images and portrait
public/media/             ← hero video encodes (see below)
tools/import_images.py       ← pulls the real covers in from the connected folder
tools/fit_ai_images.py       ← fits the Hyperion sheets to their card shapes
tools/make_placeholders.py   ← regenerates the placeholder art (never overwrites)
tools/build_galleries.py     ← cuts the detail-page galleries from the sources
tools/preview_thumbs.py      ← downscales images for the inlined preview only
tools/build_preview.mjs      ← builds the dependency-free preview HTML
```

## Images

Run, in this order — each step reads what the one before it wrote:

```bash
python3 tools/import_images.py     # covers   -> public/images/
python3 tools/fit_ai_images.py     # fits the Hyperion sheets to their cards
python3 tools/build_galleries.py   # gallery  -> public/images/gal/ + galleries.js
```

The grid crops with `object-fit: cover`, so a picture whose shape is far from
its slot loses its edges. That is fine for a production still and fatal for a
character line-up, where an edge is a whole figure. `fit_ai_images.py` prepares
each Hyperion sheet to its slot's exact ratio so the browser has nothing left
to crop: Shrike and Semfa are cut down to their left two figures and padded
back out to shape, Tuk keeps all four and is padded top and bottom, Bikura is
left alone. The padding is the per-row median of a band of background columns,
which extends the white and gradient grounds without smearing the faint
horizontal rules in them.

## Project detail pages

Clicking a card opens `#/work/<id>` — a full page with a lead image, a facts
and creative-team column, "The work" / "The approach" prose, an image gallery
and prev/next navigation. Routing is a hash router in `src/router.js`; there is
no dependency and it works on any static host.

### The gallery

Each project folder may hold a `Gallery/` subfolder. Everything in it — nested
subfolders included — becomes that project's gallery, in sorted order. **No
`Gallery/` folder means no gallery**, which is how a project opts out (She Is
Just Her does). A copy of the cover left inside `Gallery/` is skipped
automatically, matched on file contents rather than name. Videos are skipped.

Nothing is cropped. These are production photographs and process boards —
portrait, landscape and panoramic, all mixed — so the gallery is a **justified
layout**, the kind photo sites use: images are packed into rows, and each row's
height is chosen so the row fills the width exactly. Every image in a row keeps
its own aspect ratio and comes out the same height as its neighbours, so the
rows read level with nothing cut off. The packing is done at build time in
`build_galleries.py`, which knows the ratios; the CSS only has to set
`flex-grow: <ratio>` per figure. A short last row is held to the height of the
row above by a phantom spacer rather than stretching one image across the page.

`GAP` and `SHELL` in the script mirror `--gap` in `.detail__gallery` and the
shell width. **Change one and change the other**, or the row heights drift.

Captions are only for the Hyperion process boards — a research sheet or a node
graph is unreadable without a label. They live in the `CAPTIONS` dict in the
script, keyed by source filename. Production photography ships uncaptioned.

Galleries are written to `src/data/galleries.js` (generated — don't edit it).
Adding or removing files in a `Gallery/` folder and re-running is the whole
workflow.

Content lives in `src/data/workDetails.js`, keyed by the same `id` as the card:

```js
'theater-arcadia': {
  tagline: 'one line under the title',
  facts:   [{ label: 'Venue', value: '…' }],      // the sticky left column
  team:    [{ role: 'Director', name: '…' }],     // omit for personal work
  synopsis:['paragraph', 'paragraph'],            // what the piece is
  approach:['paragraph', 'paragraph'],            // how you designed it
  gallery: [{ src: '/images/x.jpg', caption: '…' }],
}
```

Every field is optional — a missing block simply is not rendered. A card with
no `workDetails` entry still opens; it just shows the facts from the card.

### Colors, type, spacing

All in `src/styles/global.css` under `:root`. Changing `--accent` re-tints the
whole site. `--shell: 1700px` is the content width; `--section-pad` is the
vertical rhythm between sections.

## Swapping in real content

**Text and projects** — `src/data/site.js`. Each entry in `works` takes:

```js
{
  id: 'unique-id',
  category: 'ai' | 'film' | 'theater',
  categoryLabel: 'Label shown on the image',
  title, subtitle, year, role,
  image: '/images/your-file.jpg',
  size: 'wide' | 'standard' | 'tall',   // controls the grid span
  award: 'optional badge text',
  blurb: 'shown on hover',
  tags: ['…'],
}
```

`size` maps to a 6-column grid: `wide` = 4 columns, `standard` = 3, `tall` = 2.
Keep the sizes in each row adding up to 6 for a flush layout.

**Images** — drop files into `public/images/` and point `image:` at them.
Recommended: JPEG, ~1600px on the long edge, under 400 KB each.

**Hero video** — three encodes live in `public/media/`, and the Hero picks one
at load time from `window.innerWidth x devicePixelRatio`:

| file | width | CRF | size | used when |
|---|---|---|---|---|
| `hero-2560.mp4` | 2560 | 22 | 7.8 MB | effective width >= 2400 (4K / retina) |
| `hero-1920.mp4` | 1920 | 21 | 5.5 MB | effective width >= 1400 (most laptops) |
| `hero-1280.mp4` | 1280 | 23 | 2.2 MB | everything smaller |

The tiers and their breakpoints are declared in `profile.heroVideo.sources`
(`src/data/site.js`), largest first. Delete the whole `heroVideo` object and the
generative canvas backdrop plays instead. To re-encode from a new master:

```bash
ffmpeg -i source.mov -an -vf "fps=30,scale=1920:-2" -c:v libx264 -crf 21 \
  -preset slow -pix_fmt yuv420p -profile:v high -movflags +faststart \
  public/media/hero-1920.mp4
```

CRF is the quality dial: lower is better and bigger, and each -2 is roughly
+40% file size. Do not go above ~23 for footage with dark, detailed scenes —
that is where blocking shows up first.

**Hero surface** — the grain over the video is driven by three variables at the
top of `src/styles/global.css`:

```css
--hero-grain-size: 96px;      /* smaller = finer grain */
--hero-grain-opacity: 0.005;  /* smaller = more transparent */
--hero-video-bright: 1;       /* the video's own brightness */
--hero-wash: 0.4;             /* the gradient overlay's strength */
--hero-scrim: 1;              /* 0 removes the text-band scrim */
```

`tools/grain-tuner.template.html` builds a page with live sliders for the first
four.

The scrim is separate on purpose. At `--hero-wash: 0.4` and full video
brightness the picture looks its best, but the montage's white shots (the tent,
the cave mouth) put the title at ~1.4:1 contrast — invisible. `.hero__scrim`
darkens only the lower band where the type sits, which brings the worst frame
to 3.2:1 (WCAG large-text minimum is 3:1) while leaving the top two thirds of
the frame untouched. If the hero video is ever replaced with something evenly
dark, `--hero-scrim: 0` turns it off.

**Social links** — `contact.socials` in `src/data/site.js`. Replace the `#`
placeholders with real URLs.

## Placeholder content to replace

- Every cover and gallery image is now the real thing. The remaining
  placeholders are words, not pictures: the `tagline` / `synopsis` / `approach`
  prose in `workDetails.js`, and the `#` links in `contact.socials`.
- The four HYPERION entries carry draft blurb copy — the titles are the user's,
  the descriptions are not.
- Every theater and film entry is taken from the CV and is accurate.

## Preview build

`node tools/build_preview.mjs` writes three files, all mirroring the React
components and reading the same stylesheets, with `src/` still the source of
truth:

| file | images | for |
|---|---|---|
| `local.html` | **linked** to `public/` | looking at the real thing. Copy it to the project root and open it. No size ceiling, so this is full resolution. |
| `standalone.html` | inlined, downscaled | one self-contained file to send someone |
| `artifact.html` | inlined, downscaled | publishing |

The two inlined files carry every image as base64 (~1.37x) in a single page
with a hard 16 MB ceiling, so their images are downscaled by
`tools/preview_thumbs.py` and are **not** representative of the shipped
quality. `local.html` is. If the inlined pages go over budget, take it out of
the hero video (`HERO_MAX` in `build_preview.mjs`) before the image tiers —
the tiers are set from measured layout widths and dropping below them puts the
page back to upscaling its own images.

/**
 * Builds a dependency-free preview of the site.
 *
 *   node tools/build_preview.mjs
 *
 * Produces:
 *   dist-preview/standalone.html  — full HTML document, open it in any browser
 *   dist-preview/artifact.html    — body-content only, for publishing
 *
 * The markup mirrors the React components 1:1 and the CSS is read straight
 * from src/styles, so the preview and the real app stay visually identical.
 * The React + Vite app in src/ remains the source of truth for development.
 *
 * Images are emitted as <img data-img="file.jpg"> and their data URIs are
 * defined ONCE in a JS map at the bottom — otherwise every reuse of an image
 * (the detail pages share a gallery pool) would duplicate its base64 payload
 * and the page would run to tens of megabytes.
 */
import { readFile, writeFile, mkdir, readdir, rm, cp } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'dist-preview')

const site = await import(pathToFileURL(path.join(root, 'src/data/site.js')).href)
const { profile, about, works, workCategories, capabilities, contact, nav } = site
const { workDetails } = await import(
  pathToFileURL(path.join(root, 'src/data/workDetails.js')).href
)
const { galleries } = await import(
  pathToFileURL(path.join(root, 'src/data/galleries.js')).href
)

/* ---------- css ---------- */
const cssFiles = [
  'global.css',
  'nav.css',
  'hero.css',
  'about.css',
  'works.css',
  'capabilities.css',
  'contact.css',
  'detail.css',
  'mobile.css', // must stay last — see the header of that file
]
const css = (
  await Promise.all(
    cssFiles.map((f) => readFile(path.join(root, 'src/styles', f), 'utf8'))
  )
).join('\n\n')

/* ---------- images, collected once ----------
   Read from the downscaled preview copies, not the shipped assets: the
   published artifact has a 16 MB ceiling and base64 costs ~1.37x. */
await mkdir(out, { recursive: true })
/* The thumbnails are only needed by the two INLINED builds. docs/ links to
   public/ directly, so a machine without Python or Pillow can still produce
   the deployable site — it just gets a warning and no artifact/standalone. */
let haveThumbs = true
try {
  execFileSync('python3', [path.join(root, 'tools/preview_thumbs.py')], {
    stdio: ['ignore', 'inherit', 'inherit'],
  })
} catch {
  haveThumbs = false
  console.warn(
    '  ! could not run tools/preview_thumbs.py (needs python3 + Pillow).\n' +
      '    docs/ will still be correct; artifact.html and standalone.html will not be.'
  )
}
const imgDir = path.join(out, '.thumbs')
const imgData = {}
await mkdir(imgDir, { recursive: true })
/* recursive: gallery shots live in .thumbs/gal/, and the key has to keep that
   prefix so it matches the `/images/gal/x.jpg` in the data */
const collect = async (dir, prefix = '') => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix + entry.name
    if (entry.isDirectory()) await collect(path.join(dir, entry.name), rel + '/')
    else {
      const buf = await readFile(path.join(dir, entry.name))
      imgData[rel] = `data:image/jpeg;base64,${buf.toString('base64')}`
    }
  }
}
await collect(imgDir)
const used = new Set()
const missing = new Set()
const img = (src) => {
  const key = String(src).replace('/images/', '').replace(/\.(png|webp|jpeg)$/i, '.jpg')
  /* recorded either way: `used` drives the docs/ image map, which points at
     public/ and does not care whether a preview thumbnail was made */
  used.add(key)
  if (!imgData[key]) missing.add(key)
  return `data-img="${key}"`
}

/* ---------- hero video ----------
   The 1280 encode, not the 1920 one the site serves. The preview inlines
   everything into a single 16 MB page, and the 1920 file costs 7.5 MB of that
   budget in base64 — which is what used to force the images down to a size
   where they were being upscaled into their own layout. Motion in the hero is
   worth more in a review than hero sharpness; picture sharpness everywhere else
   is worth more than both. The shipped site is unaffected: it picks its encode
   from the viewport (see profile.heroVideo in site.js). */
const HERO_MAX = 'public/media/hero-1280.mp4'
let heroVideo = ''
let heroPoster = ''
try {
  const v = await readFile(path.join(root, HERO_MAX))
  heroVideo = `data:video/mp4;base64,${v.toString('base64')}`
  const pj = await readFile(path.join(root, 'public/media/hero-poster-small.jpg'))
  heroPoster = `data:image/jpeg;base64,${pj.toString('base64')}`
} catch {
  /* no video yet — the generative canvas backdrop is used instead */
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pad = (n) => String(n).padStart(2, '0')

/* ================= home ================= */

const navHtml = `
<header class="nav" id="siteNav">
  <div class="nav__inner shell">
    <a class="nav__brand" href="#top">
      <span class="nav__mark"></span>
      <span class="nav__brandText"><strong>PEI JIXIAN LIU</strong><em>${esc(profile.roles[0])}</em></span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      ${nav
        .map(
          (item, i) =>
            `<a href="#${item.id}" class="nav__link" data-nav="${item.id}"><span class="nav__num">${pad(i + 1)}</span>${esc(item.label)}</a>`
        )
        .join('')}
    </nav>
    <a class="nav__cta" href="mailto:${contact.email}"><span class="nav__ctaDot"></span><span>Get in touch</span></a>
  </div>
</header>`

const heroHtml = `
<section class="hero" id="top">
  <div class="hero__bg">
    ${
      heroVideo
        ? `<video class="hero__video is-ready" src="${heroVideo}" poster="${heroPoster}" autoplay muted loop playsinline preload="auto"></video>`
        : `<canvas class="hero__canvas" id="heroCanvas"></canvas>`
    }
    <div class="hero__wash"></div>
    <div class="hero__grain"></div>
    <div class="hero__scrim"></div>
    <div class="hero__vignette"></div>
  </div>
  <div class="hero__inner shell">
    <div class="hero__main">
      <h1 class="hero__title">
        <span class="hero__line">PEI JIXIAN</span>
        <span class="hero__line hero__line--serif">Liu<i class="hero__period"></i></span>
      </h1>
      <div class="hero__aside">
        <p class="hero__lede">${esc(profile.heroLead)} <em>${esc(profile.heroAccent)}</em> ${esc(profile.heroTail)}</p>
        <ul class="hero__roles">${profile.roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        <div class="hero__actions">
          <a class="btn btn--primary" href="#work"><span>Selected Work</span><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 12L12 3M12 3H5.5M12 3V9.5" stroke="currentColor" stroke-width="1.2"/></svg></a>
          <a class="btn btn--ghost" href="mailto:${contact.email}"><span>${esc(contact.email)}</span></a>
        </div>
      </div>
    </div>

    <div class="hero__foot">
      <a class="hero__scroll" href="#about"><span class="hero__scrollRail"><i></i></span><span class="mono">Scroll</span></a>
      <ul class="hero__index"><li><b>01</b> Stage</li><li><b>02</b> Screen</li><li><b>03</b> Synthetic</li></ul>
    </div>
  </div>
</section>`

const aboutHtml = `
<section class="section section--hairline about" id="about">
  <div class="shell">
    <div class="about__grid">
      <div class="about__portraitCol reveal">
        <figure class="portrait">
          <div class="portrait__frame">
            <img ${img(profile.portrait)} alt="${esc(profile.name)}">
            <span class="portrait__corner portrait__corner--tl"></span>
            <span class="portrait__corner portrait__corner--br"></span>
            <div class="portrait__scan"></div>
          </div>
          <figcaption class="portrait__caption">
            <span class="mono">${esc(profile.name)}</span>
            <span class="mono">${esc(profile.location)} · 2026</span>
          </figcaption>
        </figure>
        <ul class="about__contact">
          <li><span class="mono">Email</span><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
          <li><span class="mono">Based in</span><span>${esc(profile.location)}</span></li>
        </ul>
      </div>

      <div class="about__textCol">
        <div class="reveal">
          <p class="eyebrow">${esc(about.eyebrow)}</p>
          <h2 class="section-title about__heading">Between the atelier <br> and the <em>render engine.</em></h2>
        </div>
        <div class="about__body">
          ${about.paragraphs.map((p, i) => `<p class="lede reveal" style="transition-delay:${90 * (i + 1)}ms">${esc(p)}</p>`).join('')}
        </div>
        <div class="about__edu reveal" style="transition-delay:120ms">
          <p class="mono about__eduTitle">Education</p>
          <ul>
            ${about.education
              .map(
                (e) =>
                  `<li><span class="about__eduYears mono">${esc(e.years)}</span><span class="about__eduSchool">${esc(e.school)}</span><span class="about__eduDegree">${esc(e.degree)}</span></li>`
              )
              .join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="about__stats reveal">
      ${about.stats
        .map(
          (s, i) =>
            `<div class="stat"><span class="stat__idx mono">${pad(i + 1)}</span><span class="stat__value">${esc(s.value)}</span><span class="stat__label">${esc(s.label)}</span></div>`
        )
        .join('')}
    </div>
  </div>
</section>`

const cardHtml = (work, i) => `
<article class="card card--${work.size} reveal" data-cat="${work.category}" style="transition-delay:${(i % 3) * 90}ms">
  <a class="card__link" href="#/work/${work.id}" aria-label="${esc(work.title)} — view project">
    <div class="card__media">
      <img ${img(work.image)} alt="${esc(work.title)}" loading="lazy" decoding="async">
      <div class="card__veil"></div>
      ${work.award ? `<span class="card__award"><i></i>${esc(work.award)}</span>` : ''}
      <div class="card__hover">
        <p>${esc(work.blurb)}</p>
        <ul class="card__tags">${work.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="card__meta">
      <div class="card__metaMain">
        <p class="card__kicker mono"><span class="card__idx" data-idx>${pad(i + 1)}</span>${esc(work.categoryLabel)}</p>
        <h3 class="card__title">${esc(work.title)}</h3>
        <p class="card__sub">${esc(work.subtitle)}</p>
      </div>
      <div class="card__metaSide"><span class="mono">${esc(work.year)}</span><span class="card__role">${esc(work.role)}</span></div>
    </div>
  </a>
</article>`

const worksHtml = `
<section class="section section--hairline works" id="work">
  <div class="shell">
    <div class="works__head">
      <div class="reveal">
        <p class="eyebrow">Selected Works</p>
        <h2 class="section-title works__title">Three vocabularies, <em>one</em> hand.</h2>
      </div>
      <div class="works__filters reveal" style="transition-delay:120ms">
        ${workCategories
          .map((c) => {
            const count =
              c.id === 'all' ? works.length : works.filter((w) => w.category === c.id).length
            return `<button class="chip${c.id === 'all' ? ' is-active' : ''}" data-filter="${c.id}">${esc(c.label)}<sup>${pad(count)}</sup></button>`
          })
          .join('')}
      </div>
    </div>
    <div class="works__grid works__grid--editorial" id="worksGrid">
      ${works.map((w, i) => cardHtml(w, i)).join('')}
    </div>
  </div>
</section>`

const capsHtml = `
<section class="section section--hairline caps" id="capabilities">
  <div class="shell caps__grid">
    <div class="caps__aside">
      <div class="caps__asideInner reveal">
        <p class="eyebrow">${esc(capabilities.eyebrow)}</p>
        <h2 class="section-title caps__title">What I bring <br> <em>into the room.</em></h2>
        <p class="lede caps__intro">${esc(capabilities.intro)}</p>
        <div class="caps__legend"><span class="mono">04 Disciplines</span><span class="caps__legendRule"></span><span class="mono">Craft → Pipeline</span></div>
      </div>
    </div>
    <div class="caps__cards">
      ${capabilities.groups
        .map(
          (g, i) => `
      <article class="capCard reveal" style="transition-delay:${(i % 2) * 110}ms">
        <div class="capCard__top"><span class="capCard__idx mono">${esc(g.index)}</span><span class="capCard__rule"></span></div>
        <h3 class="capCard__title">${esc(g.title)}</h3>
        <p class="capCard__summary">${esc(g.summary)}</p>
        <ul class="capCard__tags">${g.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>`

const contactHtml = `
<section class="contact" id="contact">
  <div class="contact__glow"></div>
  <div class="contact__grid"></div>
  <div class="shell contact__inner">
    <div class="contact__top">
      <div class="reveal"><p class="eyebrow">${esc(contact.eyebrow)}</p></div>
      <div class="contact__status reveal" style="transition-delay:80ms"><span class="contact__pulse"></span><span class="mono">Available for 2026 — 2027 projects</span></div>
    </div>
    <div class="contact__headline reveal" style="transition-delay:60ms">
      <h2>Let’s build <br> the <em>character.</em></h2>
    </div>
    <div class="contact__mailWrap reveal" style="transition-delay:140ms">
      <a class="contact__mail" href="mailto:${contact.email}">
        <span class="contact__mailText">${esc(contact.email)}</span>
        <span class="contact__mailArrow"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 20L20 6M20 6H10M20 6V16" stroke="currentColor" stroke-width="1.3"/></svg></span>
      </a>
      <p class="contact__note lede">${esc(contact.note)}</p>
    </div>
    <div class="contact__links reveal" style="transition-delay:180ms">
      ${contact.socials
        .map(
          (s, i) => `
      <a class="socialRow" href="${s.href}"><span class="socialRow__idx mono">${pad(i + 1)}</span><span class="socialRow__label">${esc(s.label)}</span><span class="socialRow__handle">${esc(s.handle)}</span><span class="socialRow__arrow">↗</span></a>`
        )
        .join('')}
    </div>
    <div class="contact__foot">
      <div class="contact__footCol"><span class="mono">© 2026 ${esc(profile.name)}</span><span class="mono">All rights reserved</span></div>
      <div class="contact__footCol contact__footCol--center"><span class="mono">${esc(contact.location)}</span></div>
      <div class="contact__footCol contact__footCol--right"><a class="mono contact__toTop" href="#top">Back to top ↑</a></div>
    </div>
  </div>
  <div class="contact__wordmark">PEI JIXIAN LIU</div>
</section>`

/* ================= detail pages ================= */

const detailHtml = (work, i) => {
  const d = workDetails[work.id] || {}
  /* same precedence as WorkDetail.jsx: hand-written wins, generated fills in.
     The generated shape is pre-packed into justified rows; a hand-written flat
     list is wrapped so both render through one path. */
  const galRows = d.gallery?.length
    ? d.gallery.map((sh) => ({ shots: [sh] }))
    : galleries[work.id] || []
  const galCount = galRows.reduce((n, r) => n + r.shots.length, 0)
  const prev = works[(i - 1 + works.length) % works.length]
  const next = works[(i + 1) % works.length]

  return `
<article class="detail" data-work="${work.id}" hidden>
  <header class="detail__top">
    <div class="shell">
      <a class="detail__back" href="#work"><span>←</span> Selected work</a>
      <p class="eyebrow detail__eyebrow">${esc(work.categoryLabel)} · ${esc(work.year)}</p>
      <h1 class="detail__title">${esc(work.title)}</h1>
      ${d.tagline ? `<p class="detail__tagline">${esc(d.tagline)}</p>` : ''}
      <p class="detail__sub mono">${esc(work.subtitle)}</p>
    </div>
  </header>

  <div class="detail__lead reveal">
    <div class="shell">
      <figure>
        <img ${img(work.image)} alt="${esc(work.title)}" loading="lazy" decoding="async">
        ${work.award ? `<figcaption class="detail__award"><i></i>${esc(work.award)}</figcaption>` : ''}
      </figure>
    </div>
  </div>

  <div class="shell detail__body">
    <aside class="detail__facts">
      <div class="detail__factsInner">
        ${
          d.facts?.length
            ? `<dl class="factList">${d.facts
                .map(
                  (f) =>
                    `<div class="factList__row"><dt class="mono">${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`
                )
                .join('')}</dl>`
            : ''
        }
        ${
          d.team?.length
            ? `<p class="mono detail__factsTitle">Creative team</p><dl class="factList">${d.team
                .map(
                  (m) =>
                    `<div class="factList__row"><dt class="mono">${esc(m.role)}</dt><dd>${esc(m.name)}</dd></div>`
                )
                .join('')}</dl>`
            : ''
        }
        <ul class="detail__tags">${work.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
    </aside>

    <div class="detail__prose">
      ${
        d.synopsis?.length
          ? `<div class="detail__block reveal"><h2 class="detail__h2">The <em>work</em></h2>${d.synopsis
              .map((t) => `<p class="lede">${esc(t)}</p>`)
              .join('')}</div>`
          : ''
      }
      ${
        d.approach?.length
          ? `<div class="detail__block reveal" style="transition-delay:80ms"><h2 class="detail__h2">The <em>approach</em></h2>${d.approach
              .map((t) => `<p class="lede">${esc(t)}</p>`)
              .join('')}</div>`
          : ''
      }
    </div>
  </div>

  ${
    galCount
      ? `<section class="shell detail__gallerySection">
    <div class="detail__galleryHead">
      <p class="eyebrow">Gallery</p>
      <span class="mono">${pad(galCount)} images</span>
    </div>
    <div class="detail__gallery">
      ${(() => {
        let n = 0
        return galRows
          .map(
            (row) => `<div class="shotRow">${row.shots
              .map((g, i) => {
                n += 1
                return `
        <figure class="shot reveal" style="--r:${g.r || 1.5};transition-delay:${i * 70}ms">
          <div class="shot__frame">
            <img ${img(g.src)} alt="${esc(g.caption || work.title)}" loading="lazy" decoding="async">
            <span class="shot__idx mono">${pad(n)}</span>
          </div>
          ${g.caption ? `<figcaption class="shot__caption">${esc(g.caption)}</figcaption>` : ''}
        </figure>`
              })
              .join('')}${row.pad > 0 ? `<i class="shotRow__pad" style="flex-grow:${row.pad}"></i>` : ''}</div>`
          )
          .join('')
      })()}
    </div>
  </section>`
      : ''
  }

  <nav class="shell detail__pagerWrap" aria-label="Project navigation">
    <div class="detail__pager">
      <a class="pager pager--prev" href="#/work/${prev.id}"><span class="mono">Previous</span><strong>${esc(prev.title)}</strong></a>
      <a class="pager pager--cta" href="mailto:${contact.email}"><span class="mono">Enquiries</span><strong>${esc(contact.email)}</strong></a>
      <a class="pager pager--next" href="#/work/${next.id}"><span class="mono">Next</span><strong>${esc(next.title)}</strong></a>
    </div>
  </nav>
</article>`
}

const detailsHtml = works.map((w, i) => detailHtml(w, i)).join('\n')

/* ================= runtime js ================= */
const js = `
(function () {
  // ---- assign the image data URIs once ----
  var IMG = __IMG__;
  document.querySelectorAll('img[data-img]').forEach(function (el) {
    var src = IMG[el.dataset.img];
    if (src) el.src = src;
  });

  var navEl = document.getElementById('siteNav');
  var home = document.getElementById('homeRoot');
  var details = Array.prototype.slice.call(document.querySelectorAll('.detail[data-work]'));

  // ---- reveal ----
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  function armReveals(scope) {
    scope.querySelectorAll('.reveal:not(.is-in)').forEach(function (n) { revObs.observe(n); });
  }

  function syncNav() {
    navEl.classList.toggle('nav--solid', home.hidden || window.scrollY > 40);
  }

  // ---- routing: #/work/<id> is a project page, anything else is home ----
  function route() {
    var m = /^#\\/work\\/([\\w-]+)$/.exec(window.location.hash || '');
    var id = m ? m[1] : null;
    var shown = null;
    details.forEach(function (d) {
      var on = d.dataset.work === id;
      d.hidden = !on;
      if (on) shown = d;
    });
    home.hidden = !!shown;
    syncNav();

    if (shown) {
      window.scrollTo(0, 0);
      armReveals(shown);
    } else {
      armReveals(home);
      var h = window.location.hash;
      if (h && h.charAt(1) !== '/') {
        var target = document.getElementById(h.slice(1));
        if (target) requestAnimationFrame(function () { target.scrollIntoView(); });
      }
    }
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', syncNav, { passive: true });

  // ---- active section in the nav ----
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = links.map(function (l) { return document.getElementById(l.dataset.nav); }).filter(Boolean);
  var navObs = new IntersectionObserver(function (entries) {
    if (home.hidden) return;
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.toggle('is-active', l.dataset.nav === e.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { navObs.observe(s); });

  // ---- work filters ----
  var grid = document.getElementById('worksGrid');
  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      grid.classList.toggle('works__grid--editorial', f === 'all');
      grid.classList.toggle('works__grid--uniform', f !== 'all');
      var n = 0;
      grid.querySelectorAll('.card').forEach(function (card) {
        var show = f === 'all' || card.dataset.cat === f;
        card.style.display = show ? '' : 'none';
        if (show) {
          n++;
          card.querySelector('[data-idx]').textContent = String(n).padStart(2, '0');
          card.classList.add('is-in');
        }
      });
    });
  });

  // ---- hero backdrop (only present when there is no video) ----
  var canvas = document.getElementById('heroCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, t = 0, LINES = 64;
    var pointer = { x: 0.5, y: 0.5 }, eased = { x: 0.5, y: 0.5 };
    var resize = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) {
      pointer.x = e.clientX / window.innerWidth; pointer.y = e.clientY / window.innerHeight;
    }, { passive: true });
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      eased.x += (pointer.x - eased.x) * 0.035;
      eased.y += (pointer.y - eased.y) * 0.035;
      var cx = (eased.x - 0.5) * 90, cy = (eased.y - 0.5) * 60;
      var step = Math.max(6, Math.round(W / 190));
      for (var i = 0; i < LINES; i++) {
        var p = i / (LINES - 1);
        var baseY = H * (0.14 + Math.pow(p, 1.18) * 0.92);
        var edge = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
        var alpha = 0.05 + edge * 0.27;
        ctx.beginPath();
        for (var x = -40; x <= W + 40; x += step) {
          var nx = x / W;
          var fold = Math.sin(nx * 3.1 + t * 0.28 + p * 5.2) * (26 + p * 44)
                   + Math.sin(nx * 7.4 - t * 0.19 + p * 9.1) * (11 + p * 17)
                   + Math.sin(nx * 13.6 + t * 0.11 + i * 0.42) * 5.5;
          var drift = Math.sin(t * 0.13 + p * 2.4) * 14;
          var y = baseY + fold + drift + cy * (0.3 + p) + Math.sin(nx * 2 + t * 0.07) * cx * 0.25;
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        if (i % 23 === 9) { ctx.strokeStyle = 'rgba(111,227,255,' + (alpha * 1.5) + ')'; ctx.lineWidth = 1.15; }
        else if (i % 11 === 4) { ctx.strokeStyle = 'rgba(77,157,255,' + (alpha * 1.25) + ')'; ctx.lineWidth = 1; }
        else { var g = 150 + Math.round(p * 60); ctx.strokeStyle = 'rgba(' + (g - 40) + ',' + (g - 10) + ',' + (g + 40) + ',' + alpha + ')'; ctx.lineWidth = 0.75; }
        ctx.stroke();
      }
      t += 0.006;
      requestAnimationFrame(draw);
    };
    resize(); draw();
  }

  route();
})();
`

/* ================= assemble ================= */
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">`

const imgMapLiteral = JSON.stringify(
  Object.fromEntries([...used].filter((k) => imgData[k]).map((k) => [k, imgData[k]]))
)
if (missing.size) {
  console.warn(
    `  ! ${missing.size} image(s) have no preview thumbnail — the inlined builds` +
      ` will show gaps there. docs/ is unaffected.`
  )
}

const body = `
<div class="grain"></div>
${navHtml}
<main>
<div id="homeRoot">
${heroHtml}
${aboutHtml}
${worksHtml}
${capsHtml}
${contactHtml}
</div>
${detailsHtml}
</main>
<script>${js.replace('__IMG__', imgMapLiteral)}<\/script>`

const artifact = `<title>Pei Jixian Liu</title>
${fonts}
<style>
${css}
</style>
${body}
`

const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pei Jixian Liu — Costume Design &amp; AI Character Design</title>
${fonts}
<style>
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`

/* ---------- full-quality local copy ----------
   `standalone.html` and `artifact.html` inline everything, which caps how sharp
   they can be: one page, 16 MB, 115 images. `local.html` links to the real
   files in public/ instead, so it has no ceiling at all — drop it at the root of
   the project folder and open it, and you are looking at the shipped assets at
   full resolution. It is the honest answer to "why is everything soft". */
const localImgMap = JSON.stringify(
  Object.fromEntries([...used].map((k) => [k, `public/images/${k}`]))
)
const localBody = body.replace(imgMapLiteral, localImgMap).replace(
  heroVideo,
  'public/media/hero-1920.mp4'
)
const local = standalone
  .replace(body, localBody)
  .replace('<title>Pei', '<title>[local, full quality] Pei')

/* ---------- docs/ : the deployable static site ----------
   Every <img> below the fold carries loading="lazy": in the inlined builds the
   pictures are data URIs and cost nothing extra, but here they are 44 MB of
   real files on a real connection, and without it a visitor downloads every
   gallery of every project before seeing the hero.

   GitHub Pages can serve a folder as-is, so this is the whole site with no
   build step and no toolchain: one index.html beside real image and video
   files. Paths are relative, which is what makes it work at a project-page URL
   (user.github.io/repo/) as well as at a domain root.

   It is NOT the repo root, because Vite owns index.html there. Pages setting:
   Deploy from a branch -> main -> /docs. */
const docs = path.join(root, 'docs')
const docsImgMap = JSON.stringify(
  Object.fromEntries([...used].map((k) => [k, `images/${k}`]))
)
const docsHtml = standalone
  .replace(imgMapLiteral, docsImgMap)
  .replace(heroVideo, 'media/hero-1920.mp4')

await rm(docs, { recursive: true, force: true })
await mkdir(docs, { recursive: true })
await writeFile(path.join(docs, 'index.html'), docsHtml)
await cp(path.join(root, 'public/images'), path.join(docs, 'images'), { recursive: true })
await cp(path.join(root, 'public/media'), path.join(docs, 'media'), { recursive: true })
/* stops Pages running the output through Jekyll, which ignores files and
   folders beginning with an underscore */
await writeFile(path.join(docs, '.nojekyll'), '')

await writeFile(path.join(out, 'artifact.html'), artifact)
await writeFile(path.join(out, 'standalone.html'), standalone)
await writeFile(path.join(out, 'local.html'), local)
const mb = (Buffer.byteLength(artifact) / 1024 / 1024).toFixed(1)
console.log(
  `wrote dist-preview — ${used.size} images inlined once, ${works.length} detail pages, artifact ${mb} MB` +
    `\n  local.html links to public/ instead — full resolution, no size ceiling` +
    `\n  docs/ is the deployable static site — commit it and point GitHub Pages at /docs`
)
if (Number(mb) > 15) {
  console.warn('  ! close to the 16 MB artifact ceiling — lower MAX_EDGE/QUALITY in tools/preview_thumbs.py, or inline hero-1280.mp4 instead')
}

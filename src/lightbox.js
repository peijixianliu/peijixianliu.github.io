/**
 * Click a gallery image to open it full-screen.
 *
 * Written as plain DOM code with delegated listeners rather than as a React
 * component, because it has to run in BOTH builds: the React app calls
 * initLightbox() once from App, and tools/build_preview.mjs inlines this same
 * file into the standalone/docs page. One implementation, no drift.
 *
 * Delegation is also what makes it survive React re-renders and the preview's
 * show/hide routing — nothing is bound to individual figures, so galleries can
 * appear and disappear underneath it.
 *
 * The list of images is taken from the gallery the clicked figure belongs to,
 * in DOM order, so arrowing through a sectioned gallery (Dance / Light) walks
 * all four pieces in the order they are shown.
 */

const GALLERY = '.detail__gallery'
const ITEM = '.shot'

let overlay = null
let items = []
let index = 0
let lastFocus = null

function build() {
  if (overlay) return overlay

  overlay = document.createElement('div')
  overlay.className = 'lbox'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'Image viewer')
  overlay.hidden = true
  overlay.innerHTML = `
    <button class="lbox__close" type="button" aria-label="Close">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.3" fill="none"/>
      </svg>
    </button>
    <button class="lbox__nav lbox__nav--prev" type="button" aria-label="Previous image">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M15 4L7 12l8 8" stroke="currentColor" stroke-width="1.4" fill="none"/>
      </svg>
    </button>
    <button class="lbox__nav lbox__nav--next" type="button" aria-label="Next image">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M9 4l8 8-8 8" stroke="currentColor" stroke-width="1.4" fill="none"/>
      </svg>
    </button>
    <figure class="lbox__figure">
      <img class="lbox__img" alt="">
      <figcaption class="lbox__meta">
        <span class="lbox__caption"></span>
        <span class="lbox__count mono"></span>
      </figcaption>
    </figure>`

  // the backdrop closes; anything inside the figure does not
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.lbox__figure') || e.target.closest('.lbox__nav')) return
    close()
  })
  overlay.querySelector('.lbox__close').addEventListener('click', close)
  overlay
    .querySelector('.lbox__nav--prev')
    .addEventListener('click', () => step(-1))
  overlay
    .querySelector('.lbox__nav--next')
    .addEventListener('click', () => step(1))

  document.body.appendChild(overlay)
  return overlay
}

function show() {
  const item = items[index]
  if (!item) return
  const img = overlay.querySelector('.lbox__img')
  /* clear first so a slow large image never shows the previous one under the
     new caption */
  img.removeAttribute('src')
  img.src = item.src
  img.alt = item.caption || item.alt || ''
  overlay.querySelector('.lbox__caption').textContent = item.caption || ''
  overlay.querySelector('.lbox__count').textContent =
    `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`

  const single = items.length < 2
  overlay.querySelectorAll('.lbox__nav').forEach((b) => {
    b.hidden = single
  })
}

function step(delta) {
  if (!items.length) return
  index = (index + delta + items.length) % items.length
  show()
}

function open(figure) {
  const gallery = figure.closest(GALLERY)
  if (!gallery) return

  const figures = [...gallery.querySelectorAll(ITEM)]
  items = figures.map((f) => {
    const img = f.querySelector('img')
    return {
      src: img ? img.currentSrc || img.src : '',
      alt: img ? img.alt : '',
      caption: f.querySelector('.shot__caption')?.textContent.trim() || '',
    }
  })
  index = Math.max(0, figures.indexOf(figure))
  if (!items.length) return

  lastFocus = document.activeElement
  build()
  show()
  overlay.hidden = false
  /* the site's own scroll listeners keep working; this just stops the page
     behind the overlay from moving under the pointer */
  document.documentElement.classList.add('has-lbox')
  requestAnimationFrame(() => overlay.classList.add('is-open'))
  overlay.querySelector('.lbox__close').focus()
}

function close() {
  if (!overlay || overlay.hidden) return
  overlay.classList.remove('is-open')
  document.documentElement.classList.remove('has-lbox')
  overlay.hidden = true
  overlay.querySelector('.lbox__img').removeAttribute('src')
  if (lastFocus && lastFocus.focus) lastFocus.focus()
  lastFocus = null
}

function isOpen() {
  return overlay && !overlay.hidden
}

function initLightbox() {
  if (document.documentElement.dataset.lbox) return // idempotent
  document.documentElement.dataset.lbox = '1'

  /* Figures are not buttons in the markup, so make them behave like one here
     rather than in two separate templates. */
  const arm = (f) => {
    if (f.dataset.lboxArmed) return
    f.dataset.lboxArmed = '1'
    f.tabIndex = 0
    f.setAttribute('role', 'button')
    f.setAttribute('aria-label', 'View image full screen')
  }
  const armAll = () => document.querySelectorAll(`${GALLERY} ${ITEM}`).forEach(arm)
  armAll()
  /* galleries arrive later in React, and on route changes in the preview */
  new MutationObserver(armAll).observe(document.body, {
    childList: true,
    subtree: true,
  })

  document.addEventListener('click', (e) => {
    const figure = e.target.closest(`${GALLERY} ${ITEM}`)
    if (figure) {
      e.preventDefault()
      open(figure)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) {
      const figure = document.activeElement?.closest?.(`${GALLERY} ${ITEM}`)
      if (figure && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        open(figure)
      }
      return
    }
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'Tab') {
      /* keep focus inside the dialog */
      const focusable = [...overlay.querySelectorAll('button:not([hidden])')]
      const i = focusable.indexOf(document.activeElement)
      e.preventDefault()
      const nextIdx = e.shiftKey ? i - 1 : i + 1
      focusable[(nextIdx + focusable.length) % focusable.length].focus()
    }
  })
}

export { initLightbox }

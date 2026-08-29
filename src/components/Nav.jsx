import { useEffect, useState } from 'react'
import { nav, profile, contact } from '../data/site.js'
import '../styles/nav.css'

export default function Nav({ route = { name: 'home' } }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  const onDetail = route.name === 'work'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // the home sections do not exist on a project page
    if (onDetail) {
      setActive('work')
      return
    }
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onDetail])

  return (
    <header className={`nav ${scrolled || onDetail ? 'nav--solid' : ''}`}>
      <div className="nav__inner shell">
        <a className="nav__brand" href="#top">
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__brandText">
            <strong>PEI JIXIAN LIU</strong>
            <em>{profile.roles[0]}</em>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
            >
              <span className="nav__num">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="nav__cta" href={`mailto:${contact.email}`}>
          <span className="nav__ctaDot" aria-hidden="true" />
          <span>Get in touch</span>
        </a>
      </div>
    </header>
  )
}

import Reveal from './Reveal.jsx'
import { contact, profile } from '../data/site.js'
import '../styles/contact.css'

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section className="contact" id="contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="contact__grid" aria-hidden="true" />

      <div className="shell contact__inner">
        <div className="contact__top">
          <Reveal>
            <p className="eyebrow">{contact.eyebrow}</p>
          </Reveal>
          <Reveal delay={80} className="contact__status">
            <span className="contact__pulse" aria-hidden="true" />
            <span className="mono">Available for 2026 — 2027 projects</span>
          </Reveal>
        </div>

        <Reveal delay={60} className="contact__headline">
          <h2>
            Let’s build <br />
            the <em>character.</em>
          </h2>
        </Reveal>

        <Reveal delay={140} className="contact__mailWrap">
          <a className="contact__mail" href={`mailto:${contact.email}`}>
            <span className="contact__mailText">{contact.email}</span>
            <span className="contact__mailArrow" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M6 20L20 6M20 6H10M20 6V16"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            </span>
          </a>
          <p className="contact__note lede">{contact.note}</p>
        </Reveal>

        <Reveal delay={180} className="contact__links">
          {contact.socials.map((social, i) => (
            <a
              key={social.label}
              className="socialRow"
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <span className="socialRow__idx mono">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="socialRow__label">{social.label}</span>
              <span className="socialRow__handle">{social.handle}</span>
              <span className="socialRow__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </Reveal>

        <div className="contact__foot">
          <div className="contact__footCol">
            <span className="mono">© {year} {profile.name}</span>
            <span className="mono">All rights reserved</span>
          </div>
          <div className="contact__footCol contact__footCol--center">
            <span className="mono">{contact.location}</span>
          </div>
          <div className="contact__footCol contact__footCol--right">
            <a className="mono contact__toTop" href="#top">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>

      <div className="contact__wordmark" aria-hidden="true">
        PEI JIXIAN LIU
      </div>
    </section>
  )
}

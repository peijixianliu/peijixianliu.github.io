import Reveal from './Reveal.jsx'
import { about, profile, contact } from '../data/site.js'
import '../styles/about.css'

export default function About() {
  return (
    <section className="section section--hairline about" id="about">
      <div className="shell">
        <div className="about__grid">
          {/* ---------- portrait column ---------- */}
          <Reveal className="about__portraitCol">
            <figure className="portrait">
              <div className="portrait__frame">
                <img
                  src={profile.portrait}
                  alt={`${profile.name}, costume designer and AI visual artist`}
                  loading="lazy"
                />
                <span className="portrait__corner portrait__corner--tl" />
                <span className="portrait__corner portrait__corner--br" />
                <div className="portrait__scan" />
              </div>
              <figcaption className="portrait__caption">
                <span className="mono">{profile.name}</span>
                <span className="mono">
                  {profile.location} · {new Date().getFullYear()}
                </span>
              </figcaption>
            </figure>

            <ul className="about__contact">
              <li>
                <span className="mono">Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <span className="mono">Based in</span>
                <span>{profile.location}</span>
              </li>
            </ul>
          </Reveal>

          {/* ---------- text column ---------- */}
          <div className="about__textCol">
            <Reveal>
              <p className="eyebrow">{about.eyebrow}</p>
              <h2 className="section-title about__heading">
                Between the atelier <br />
                and the <em>render engine.</em>
              </h2>
            </Reveal>

            <div className="about__body">
              {about.paragraphs.map((text, i) => (
                <Reveal as="p" key={i} delay={90 * (i + 1)} className="lede">
                  {text}
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="about__edu">
              <p className="mono about__eduTitle">Education</p>
              <ul>
                {about.education.map((item) => (
                  <li key={item.school}>
                    <span className="about__eduYears mono">{item.years}</span>
                    <span className="about__eduSchool">{item.school}</span>
                    <span className="about__eduDegree">{item.degree}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* ---------- stats ---------- */}
        <Reveal className="about__stats">
          {about.stats.map((stat, i) => (
            <div className="stat" key={stat.label}>
              <span className="stat__idx mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

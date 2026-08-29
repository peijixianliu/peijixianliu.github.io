import { useEffect, useRef, useState } from 'react'
import HeroBackdrop from './HeroBackdrop.jsx'
import { profile, contact } from '../data/site.js'
import '../styles/hero.css'

/**
 * Picks the smallest hero encode that still covers the display.
 * Runs once on mount so it can read devicePixelRatio.
 */
function useHeroSource() {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!profile.heroVideo?.sources?.length) return
    const effective = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)
    const match =
      profile.heroVideo.sources.find((s) => effective >= s.minWidth) ??
      profile.heroVideo.sources[profile.heroVideo.sources.length - 1]
    setSrc(match.src)
  }, [])

  return src
}

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const videoSrc = useHeroSource()

  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        {/* The encode is chosen by useHeroSource above. If it fails to load —
            or if profile.heroVideo is removed — the generative canvas plays. */}
        {videoSrc && (
          <video
            ref={videoRef}
            className={`hero__video ${videoReady ? 'is-ready' : ''}`}
            src={videoSrc}
            poster={profile.heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          />
        )}
        {!videoReady && <HeroBackdrop />}
        <div className="hero__wash" />
        <div className="hero__grain" />
        <div className="hero__scrim" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__inner shell">
        <div className="hero__main">
          <h1 className="hero__title">
            <span className="hero__line">PEI JIXIAN</span>
            <span className="hero__line hero__line--serif">
              Liu
              <i className="hero__period" aria-hidden="true" />
            </span>
          </h1>

          <div className="hero__aside">
            <p className="hero__lede">
              {profile.heroLead} <em>{profile.heroAccent}</em> {profile.heroTail}
            </p>

            <ul className="hero__roles">
              {profile.roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>

            <div className="hero__actions">
              <a className="btn btn--primary" href="#work">
                <span>Selected Work</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M3 12L12 3M12 3H5.5M12 3V9.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
              <a className="btn btn--ghost" href={`mailto:${contact.email}`}>
                <span>{contact.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hero__foot">
          <a className="hero__scroll" href="#about">
            <span className="hero__scrollRail" aria-hidden="true">
              <i />
            </span>
            <span className="mono">Scroll</span>
          </a>

          <ul className="hero__index">
            <li>
              <b>01</b> Stage
            </li>
            <li>
              <b>02</b> Screen
            </li>
            <li>
              <b>03</b> Synthetic
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

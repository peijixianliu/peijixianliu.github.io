import { useMemo, useState } from 'react'
import Reveal from './Reveal.jsx'
import { works, workCategories } from '../data/site.js'
import '../styles/works.css'

export default function Works() {
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? works : works.filter((w) => w.category === filter)),
    [filter]
  )

  return (
    <section className="section section--hairline works" id="work">
      <div className="shell">
        <div className="works__head">
          <Reveal>
            <p className="eyebrow">Selected Works</p>
            <h2 className="section-title works__title">
              Nine projects, <em>three</em> vocabularies.
            </h2>
          </Reveal>

          <Reveal delay={120} className="works__filters">
            {workCategories.map((cat) => {
              const count =
                cat.id === 'all'
                  ? works.length
                  : works.filter((w) => w.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  className={`chip ${filter === cat.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(cat.id)}
                >
                  {cat.label}
                  <sup>{String(count).padStart(2, '0')}</sup>
                </button>
              )
            })}
          </Reveal>
        </div>

        <div
          className={`works__grid ${
            filter === 'all' ? 'works__grid--editorial' : 'works__grid--uniform'
          }`}
        >
          {visible.map((work, i) => (
            <Reveal
              as="article"
              key={work.id}
              delay={(i % 3) * 90}
              className={`card card--${work.size}`}
            >
              <a className="card__link" href={`#/work/${work.id}`} aria-label={`${work.title} — view project`}>
                <div className="card__media">
                  <img src={work.image} alt={work.title} loading="lazy" />
                  <div className="card__veil" />

                  {work.award && (
                    <span className="card__award">
                      <i aria-hidden="true" />
                      {work.award}
                    </span>
                  )}

                  <div className="card__hover">
                    <p>{work.blurb}</p>
                    <ul className="card__tags">
                      {work.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card__meta">
                  <div className="card__metaMain">
                    <p className="card__kicker mono">
                      <span className="card__idx">{String(i + 1).padStart(2, '0')}</span>
                      {work.categoryLabel}
                    </p>
                    <h3 className="card__title">{work.title}</h3>
                    <p className="card__sub">{work.subtitle}</p>
                  </div>
                  <div className="card__metaSide">
                    <span className="mono">{work.year}</span>
                    <span className="card__role">{work.role}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

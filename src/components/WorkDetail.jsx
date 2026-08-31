import Reveal from './Reveal.jsx'
import { works, contact } from '../data/site.js'
import { workDetails } from '../data/workDetails.js'
import { galleries } from '../data/galleries.js'
import '../styles/detail.css'

export default function WorkDetail({ id }) {
  const index = works.findIndex((w) => w.id === id)
  const work = works[index]
  const detail = workDetails[id]
  /* A hand-written gallery in workDetails.js wins; otherwise the generated one
     from tools/build_galleries.py is used. The generated shape is already
     packed into justified rows ([{ shots, pad }]); a hand-written flat list is
     wrapped so both render through the same code. */
  const sections = detail?.gallery?.length
    ? [{ rows: detail.gallery.map((s) => ({ shots: [s] })) }]
    : galleries[id] || []
  const shotCount = sections.reduce(
    (n, sec) => n + sec.rows.reduce((m, row) => m + row.shots.length, 0),
    0
  )

  if (!work) {
    return (
      <section className="detail detail--missing">
        <div className="shell">
          <p className="eyebrow">Not found</p>
          <h1 className="detail__title">That project isn’t here.</h1>
          <a className="detail__back" href="#work">
            <span aria-hidden="true">←</span> Back to selected work
          </a>
        </div>
      </section>
    )
  }

  const prev = works[(index - 1 + works.length) % works.length]
  const next = works[(index + 1) % works.length]

  return (
    <article className="detail">
      {/* ---------- masthead ---------- */}
      <header className="detail__top">
        <div className="shell">
          <a className="detail__back" href="#work">
            <span aria-hidden="true">←</span> Selected work
          </a>

          <p className="eyebrow detail__eyebrow">
            {work.categoryLabel} · {work.year}
          </p>

          <h1 className="detail__title">{work.title}</h1>

          {detail?.tagline && <p className="detail__tagline">{detail.tagline}</p>}

          <p className="detail__sub mono">{work.subtitle}</p>
        </div>
      </header>

      {/* ---------- lead image ---------- */}
      <Reveal className="detail__lead">
        <div className="shell">
          <figure>
            <img src={work.image} alt={work.title} />
            {work.award && (
              <figcaption className="detail__award">
                <i aria-hidden="true" />
                {work.award}
              </figcaption>
            )}
          </figure>
        </div>
      </Reveal>

      {/* ---------- facts + prose ---------- */}
      <div className="shell detail__body">
        <aside className="detail__facts">
          <div className="detail__factsInner">
            {detail?.facts?.length > 0 && (
              <dl className="factList">
                {detail.facts.map((fact) => (
                  <div className="factList__row" key={fact.label}>
                    <dt className="mono">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {detail?.team?.length > 0 && (
              <>
                <p className="mono detail__factsTitle">Creative team</p>
                <dl className="factList">
                  {detail.team.map((member, i) => (
                    <div className="factList__row" key={`${member.role}-${i}`}>
                      <dt className="mono">{member.role}</dt>
                      <dd>{member.name}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <ul className="detail__tags">
              {work.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="detail__prose">
          {detail?.synopsis?.length > 0 && (
            <Reveal className="detail__block">
              <h2 className="detail__h2">
                The <em>work</em>
              </h2>
              {detail.synopsis.map((text, i) => (
                <p className="lede" key={i}>
                  {text}
                </p>
              ))}
            </Reveal>
          )}

          {detail?.approach?.length > 0 && (
            <Reveal className="detail__block" delay={80}>
              <h2 className="detail__h2">
                The <em>approach</em>
              </h2>
              {detail.approach.map((text, i) => (
                <p className="lede" key={i}>
                  {text}
                </p>
              ))}
            </Reveal>
          )}
        </div>
      </div>

      {/* ---------- gallery ---------- */}
      {shotCount > 0 && (
        <section className="shell detail__gallerySection">
          <div className="detail__galleryHead">
            <p className="eyebrow">Gallery</p>
            <span className="mono">
              {String(shotCount).padStart(2, '0')} images
            </span>
          </div>

          <div className="detail__gallery">
            {(() => {
              let n = 0
              return sections.map((section, si) => (
                <div className="galSection" key={si}>
                  {section.title && (
                    <header className="galSection__head">
                      <span className="galSection__idx mono">
                        {String(si + 1).padStart(2, '0')}
                      </span>
                      <h3 className="galSection__title">{section.title}</h3>
                      {section.note && (
                        <span className="galSection__note mono">{section.note}</span>
                      )}
                    </header>
                  )}

                  {section.rows.map((row, ri) => (
                    <div className="shotRow" key={ri}>
                      {row.shots.map((item, i) => {
                        n += 1
                        const idx = n
                        return (
                          <Reveal
                            as="figure"
                            key={item.src}
                            delay={i * 70}
                            className="shot"
                            /* flex-grow is the image's aspect ratio — that is
                               what makes every image in the row the same
                               height */
                            style={{ '--r': item.r || 1.5 }}
                          >
                            <div className="shot__frame">
                              <img
                                src={item.src}
                                alt={item.caption || work.title}
                                loading="lazy"
                              />
                              <span className="shot__idx mono">
                                {String(idx).padStart(2, '0')}
                              </span>
                            </div>
                            {item.caption && (
                              <figcaption className="shot__caption">
                                {item.caption}
                              </figcaption>
                            )}
                          </Reveal>
                        )
                      })}
                      {row.pad > 0 && (
                        <i className="shotRow__pad" style={{ flexGrow: row.pad }} />
                      )}
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
        </section>
      )}

      {/* ---------- footer nav ---------- */}
      <nav className="shell detail__pagerWrap" aria-label="Project navigation">
        <div className="detail__pager">
          <a className="pager pager--prev" href={`#/work/${prev.id}`}>
            <span className="mono">Previous</span>
            <strong>{prev.title}</strong>
          </a>

          <a className="pager pager--cta" href={`mailto:${contact.email}`}>
            <span className="mono">Enquiries</span>
            <strong>{contact.email}</strong>
          </a>

          <a className="pager pager--next" href={`#/work/${next.id}`}>
            <span className="mono">Next</span>
            <strong>{next.title}</strong>
          </a>
        </div>
      </nav>
    </article>
  )
}

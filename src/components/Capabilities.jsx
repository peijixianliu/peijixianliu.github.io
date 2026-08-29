import Reveal from './Reveal.jsx'
import { capabilities } from '../data/site.js'
import '../styles/capabilities.css'

export default function Capabilities() {
  return (
    <section className="section section--hairline caps" id="capabilities">
      <div className="shell caps__grid">
        <div className="caps__aside">
          <Reveal className="caps__asideInner">
            <p className="eyebrow">{capabilities.eyebrow}</p>
            <h2 className="section-title caps__title">
              What I bring <br />
              <em>into the room.</em>
            </h2>
            <p className="lede caps__intro">{capabilities.intro}</p>

            <div className="caps__legend">
              <span className="mono">04 Disciplines</span>
              <span className="caps__legendRule" />
              <span className="mono">Craft → Pipeline</span>
            </div>
          </Reveal>
        </div>

        <div className="caps__cards">
          {capabilities.groups.map((group, i) => (
            <Reveal
              as="article"
              key={group.index}
              delay={(i % 2) * 110}
              className="capCard"
            >
              <div className="capCard__top">
                <span className="capCard__idx mono">{group.index}</span>
                <span className="capCard__rule" />
              </div>

              <h3 className="capCard__title">{group.title}</h3>
              <p className="capCard__summary">{group.summary}</p>

              <ul className="capCard__tags">
                {group.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

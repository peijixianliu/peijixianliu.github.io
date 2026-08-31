import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Works from './components/Works.jsx'
import Capabilities from './components/Capabilities.jsx'
import Contact from './components/Contact.jsx'
import WorkDetail from './components/WorkDetail.jsx'
import { useRoute } from './router.js'
import { initLightbox } from './lightbox.js'
/* last import wins the cascade — the mobile patch refines every section
   stylesheet, so it has to come after all of them */
import './styles/lightbox.css'
import './styles/mobile.css'

export default function App() {
  const route = useRoute()

  /* delegated, idempotent, and independent of React's tree — see
     src/lightbox.js */
  useEffect(initLightbox, [])

  useEffect(() => {
    // opening a project starts at the top; coming back honours the #section
    if (route.name === 'work') {
      window.scrollTo(0, 0)
      return
    }
    const hash = window.location.hash
    if (hash && !hash.startsWith('#/')) {
      const target = document.getElementById(hash.slice(1))
      if (target) requestAnimationFrame(() => target.scrollIntoView())
    }
  }, [route])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav route={route} />
      <main>
        {route.name === 'work' ? (
          <WorkDetail id={route.id} />
        ) : (
          <>
            <Hero />
            <About />
            <Works />
            <Capabilities />
            <Contact />
          </>
        )}
      </main>
    </>
  )
}

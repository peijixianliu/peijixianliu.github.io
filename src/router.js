import { useEffect, useState } from 'react'

/**
 * Deliberately tiny hash router — no dependency, works on any static host.
 *
 *   #/work/<id>   → a project detail page
 *   anything else → the home page (so plain "#about" anchors keep working)
 */
export function parseHash(hash) {
  const match = /^#\/work\/([\w-]+)$/.exec(hash || '')
  return match ? { name: 'work', id: match[1] } : { name: 'home' }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

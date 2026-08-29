import { useEffect, useRef } from 'react'

/**
 * Generative hero backdrop — a slow field of flowing lines that reads
 * somewhere between fabric folds and a topographic scan. Used as the
 * default background, and as the fallback if no hero video is present.
 */
export default function HeroBackdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let raf = 0
    let t = 0

    // pointer parallax, eased
    const pointer = { x: 0.5, y: 0.5 }
    const eased = { x: 0.5, y: 0.5 }

    const LINES = 64

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointerMove = (e) => {
      pointer.x = e.clientX / window.innerWidth
      pointer.y = e.clientY / window.innerHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      eased.x += (pointer.x - eased.x) * 0.035
      eased.y += (pointer.y - eased.y) * 0.035

      const cx = (eased.x - 0.5) * 90
      const cy = (eased.y - 0.5) * 60

      const step = Math.max(6, Math.round(width / 190))

      for (let i = 0; i < LINES; i++) {
        const p = i / (LINES - 1)

        // vertical distribution, denser toward the lower third
        const baseY = height * (0.14 + Math.pow(p, 1.18) * 0.92)

        // fade the band in at the top and out at the bottom
        const edge = Math.sin(Math.PI * Math.min(1, Math.max(0, p)))
        const alpha = 0.05 + edge * 0.27

        // a handful of lines carry the accent colour
        const isAccent = i % 11 === 4
        const isBright = i % 23 === 9

        ctx.beginPath()

        for (let x = -40; x <= width + 40; x += step) {
          const nx = x / width

          const fold =
            Math.sin(nx * 3.1 + t * 0.28 + p * 5.2) * (26 + p * 44) +
            Math.sin(nx * 7.4 - t * 0.19 + p * 9.1) * (11 + p * 17) +
            Math.sin(nx * 13.6 + t * 0.11 + i * 0.42) * 5.5

          const drift = Math.sin(t * 0.13 + p * 2.4) * 14

          const y = baseY + fold + drift + cy * (0.3 + p) + Math.sin(nx * 2 + t * 0.07) * cx * 0.25

          if (x === -40) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        if (isBright) {
          ctx.strokeStyle = `rgba(111, 227, 255, ${alpha * 1.5})`
          ctx.lineWidth = 1.15
        } else if (isAccent) {
          ctx.strokeStyle = `rgba(77, 157, 255, ${alpha * 1.25})`
          ctx.lineWidth = 1
        } else {
          const g = 150 + Math.round(p * 60)
          ctx.strokeStyle = `rgba(${g - 40}, ${g - 10}, ${g + 40}, ${alpha})`
          ctx.lineWidth = 0.75
        }

        ctx.stroke()
      }

      if (!reduced) t += 0.006
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}

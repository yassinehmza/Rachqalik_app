import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './layered-text.css'

function buildDefaultLines() {
  const words = ['Sleep', 'Recovery', 'Energy', 'Focus', 'Performance', 'Wellness']
  const lines = [{ top: '\u00A0', bottom: words[0] }]

  for (let i = 0; i < words.length - 1; i += 1) {
    lines.push({ top: words[i], bottom: words[i + 1] })
  }

  lines.push({ top: words[words.length - 1], bottom: '\u00A0' })
  return lines
}

export function LayeredText({
  lines,
  fontSize = '76px',
  fontSizeMd = '40px',
  lineHeight = 86,
  lineHeightMd = 50,
  className = '',
}) {
  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const resolvedLines = useMemo(() => lines || buildDefaultLines(), [lines])

  const calculateTranslateX = (index) => {
    const baseOffset = 28
    const baseOffsetMd = 16
    const centerIndex = Math.floor(resolvedLines.length / 2)

    return {
      desktop: (index - centerIndex) * baseOffset,
      mobile: (index - centerIndex) * baseOffsetMd,
    }
  }

  useEffect(() => {
    if (!containerRef.current) return undefined

    const container = containerRef.current
    const paragraphs = container.querySelectorAll('p')

    timelineRef.current = gsap.timeline({ paused: true })
    timelineRef.current.to(paragraphs, {
      y: window.innerWidth >= 768 ? -lineHeight : -lineHeightMd,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.08,
    })

    const handleMouseEnter = () => timelineRef.current?.play()
    const handleMouseLeave = () => timelineRef.current?.reverse()

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      timelineRef.current?.kill()
    }
  }, [resolvedLines, lineHeight, lineHeightMd])

  return (
    <div
      ref={containerRef}
      className={`layered-text ${className}`}
      style={{ '--lt-font-size': fontSize, '--lt-md-font-size': fontSizeMd, '--lt-line-height': `${lineHeight}px` }}
    >
      <ul className="layered-text-list">
        {resolvedLines.map((line, index) => {
          const translateX = calculateTranslateX(index)
          const even = index % 2 === 0

          return (
            <li
              key={`${line.top}-${line.bottom}-${index}`}
              className={`layered-text-item ${even ? 'layered-text-item-even' : 'layered-text-item-odd'}`}
              style={{
                height: `${lineHeight}px`,
                transform: `translateX(${translateX.desktop}px) skew(${even ? '60deg, -30deg' : '0deg, -30deg'}) scaleY(${even ? '0.66667' : '1.33333'})`,
                '--lt-md-height': `${lineHeightMd}px`,
                '--lt-md-translate-x': `${translateX.mobile}px`,
              }}
            >
              <p className="layered-text-line" style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight - 10}px` }}>
                {line.top}
              </p>
              <p className="layered-text-line" style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight - 10}px` }}>
                {line.bottom}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

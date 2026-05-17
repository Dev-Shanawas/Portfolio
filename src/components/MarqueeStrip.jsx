import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * MarqueeStrip — infinite horizontal marquee with GSAP.
 * Duplicates children so the loop feels seamless.
 * `speed` = seconds to traverse one full width.
 * `direction` = 'left' | 'right'
 */
const MarqueeStrip = ({
    items,
    speed = 25,
    direction = 'left',
    className = '',
    separator = '✦',
}) => {
    const trackRef = useRef(null)
    const animRef = useRef(null)

    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        const totalWidth = track.scrollWidth / 2 // half because we duplicate

        animRef.current = gsap.to(track, {
            x: direction === 'left' ? -totalWidth : totalWidth,
            duration: speed,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
        })

        // Slow on hover
        const onEnter = () => gsap.to(animRef.current, { timeScale: 0.3, duration: 0.5 })
        const onLeave = () => gsap.to(animRef.current, { timeScale: 1, duration: 0.5 })
        track.parentElement?.addEventListener('mouseenter', onEnter)
        track.parentElement?.addEventListener('mouseleave', onLeave)
        return () => {
            animRef.current?.kill()
            track.parentElement?.removeEventListener('mouseenter', onEnter)
            track.parentElement?.removeEventListener('mouseleave', onLeave)
        }
    }, [speed, direction])

    const allItems = [...items, ...items] // duplicate for seamless loop

    return (
        <div className={`overflow-hidden ${className}`} style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
            <div ref={trackRef} className="flex items-center" style={{ width: 'max-content', gap: 0 }}>
                {allItems.map((item, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-6 px-6 font-mono text-sm whitespace-nowrap"
                        style={{ color: 'rgba(226,232,240,0.25)', letterSpacing: '0.1em', userSelect: 'none' }}
                    >
                        {item}
                        <span style={{ color: 'var(--color-accent)', fontSize: '0.5rem' }}>{separator}</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

export default MarqueeStrip

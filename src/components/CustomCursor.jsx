import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * CustomCursor — dot + outline with lerp-based lag and hover state.
 * Falls back to hidden on touch/mobile devices.
 */
const CustomCursor = () => {
    const dotRef = useRef(null)
    const outlineRef = useRef(null)
    const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

    useEffect(() => {
        const dot = dotRef.current
        const outline = outlineRef.current
        if (!dot || !outline) return

        let rafId

        const onMove = (e) => {
            targetRef.current.x = e.clientX
            targetRef.current.y = e.clientY
            // Dot follows instantly via GSAP
            gsap.set(dot, { x: e.clientX, y: e.clientY })
        }

        const lerp = (a, b, t) => a + (b - a) * t

        const loop = () => {
            posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.12)
            posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.12)
            gsap.set(outline, { x: posRef.current.x, y: posRef.current.y })
            rafId = requestAnimationFrame(loop)
        }
        loop()

        const addHover = () => {
            dot.classList.add('hovering')
            outline.classList.add('hovering')
        }
        const removeHover = () => {
            dot.classList.remove('hovering')
            outline.classList.remove('hovering')
        }

        const updateInteractives = () => {
            document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
                el.addEventListener('mouseenter', addHover)
                el.addEventListener('mouseleave', removeHover)
            })
        }
        updateInteractives()

        const observer = new MutationObserver(updateInteractives)
        observer.observe(document.body, { childList: true, subtree: true })

        window.addEventListener('mousemove', onMove)

        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(rafId)
            observer.disconnect()
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
            <div ref={outlineRef} className="cursor-outline" aria-hidden="true" />
        </>
    )
}

export default CustomCursor

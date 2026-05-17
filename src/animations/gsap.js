import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Text Splitting ─────────────────────────────────────────────────────────── */
export function splitTextIntoChars(element) {
    if (!element) return []
    const text = element.textContent
    element.textContent = ''
    return text.split('').map((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.className = 'split-char'
        element.appendChild(span)
        return span
    })
}

export function splitTextIntoWords(element) {
    if (!element) return []
    const text = element.textContent
    element.textContent = ''
    return text.split(' ').map((word, i, arr) => {
        const wrapper = document.createElement('span')
        wrapper.style.cssText = 'display:inline-block;overflow:hidden;'
        const inner = document.createElement('span')
        inner.textContent = word
        inner.className = 'split-char'
        inner.style.cssText = 'display:inline-block;'
        wrapper.appendChild(inner)
        if (i < arr.length - 1) wrapper.appendChild(document.createTextNode('\u00A0'))
        element.appendChild(wrapper)
        return inner
    })
}

/* ─── Hero Reveal Timeline ───────────────────────────────────────────────────── */
export function heroRevealTimeline(subtitle, ctaChildren, scrollIndicator) {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    const targets = [subtitle, ctaChildren, scrollIndicator].filter(Boolean)
    if (targets.length) {
        tl.set(targets, { opacity: 0, y: 30 })
            .to(subtitle, { opacity: 1, y: 0, duration: 0.9 })
            .to(ctaChildren, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 }, '-=0.4')
            .to(scrollIndicator, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
    }
    return tl
}

/* ─── Scroll Text Reveal ─────────────────────────────────────────────────────── */
export function createScrollTextReveal(words, trigger, options = {}) {
    gsap.set(words, { y: 60, opacity: 0, rotateX: -40, transformOrigin: 'top' })
    return gsap.to(words, {
        y: 0, opacity: 1, rotateX: 0,
        stagger: options.stagger || 0.06,
        duration: options.duration || 1.1,
        ease: options.ease || 'power3.out',
        scrollTrigger: {
            trigger,
            start: options.start || 'top 82%',
            toggleActions: 'play none none reverse',
            ...options.scrollTrigger,
        },
    })
}

/* ─── Magnetic Button ────────────────────────────────────────────────────────── */
export function initMagneticButton(el, strength = 0.35) {
    if (!el) return () => { }
    const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * strength
        const y = (e.clientY - r.top - r.height / 2) * strength
        gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' })
        const inner = el.querySelector('.mag-inner')
        if (inner) gsap.to(inner, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: 'power2.out' })
    }
    const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
        const inner = el.querySelector('.mag-inner')
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
    }
}

/* ─── 3D Card Tilt ───────────────────────────────────────────────────────────── */
export function initTiltEffect(el, intensity = 12) {
    if (!el) return () => { }
    const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2
        gsap.to(el, {
            rotateY: x * intensity, rotateX: -y * intensity,
            rotateZ: x * (intensity * 0.07), scale: 1.02,
            duration: 0.4, ease: 'power2.out', transformPerspective: 1200,
        })
    }
    const onLeave = () => {
        gsap.to(el, { rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.4)' })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
    }
}

/* ─── Glitch Flash ───────────────────────────────────────────────────────────── */
export function glitchFlash(el) {
    if (!el) return
    return gsap.timeline({ repeat: 3, repeatDelay: 0.05 })
        .to(el, { opacity: 0.15, x: 3, skewX: 5, duration: 0.04 })
        .to(el, { opacity: 0.85, x: -3, skewX: -3, duration: 0.04 })
        .to(el, { opacity: 1, x: 0, skewX: 0, duration: 0.04 })
}

/* ─── Timeline Line Draw ─────────────────────────────────────────────────────── */
export function animateTimelineLine(lineEl, trigger) {
    return gsap.to(lineEl, {
        scaleY: 1, ease: 'none',
        scrollTrigger: {
            trigger, start: 'top 55%', end: 'bottom 45%', scrub: 0.6,
        },
    })
}

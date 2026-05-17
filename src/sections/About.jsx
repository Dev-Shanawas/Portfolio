import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initTiltEffect } from '../animations/gsap'

gsap.registerPlugin(ScrollTrigger)

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'
function ScrambleText({ text, delay = 0, duration = 1000 }) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const chars = text.split('')
        const totalFrames = Math.ceil((duration / 1000) * 60)
        const rfp = chars.length / totalFrames
        let iter = 0, frame
        const t = setTimeout(() => {
            const run = () => {
                const res = Math.floor(iter * rfp)
                if (el) el.textContent = chars.map((c, i) => i < res ? c : CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
                iter++
                if (res >= chars.length) { if (el) el.textContent = text; return }
                frame = requestAnimationFrame(run)
            }
            requestAnimationFrame(run)
        }, delay)
        return () => { clearTimeout(t); cancelAnimationFrame(frame) }
    }, [text, delay, duration])
    return <span ref={ref}>{text}</span>
}

const About = () => {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const imageRef = useRef(null)
    const bgTextRef = useRef(null)
    const statsRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Scrub background text
            gsap.to(bgTextRef.current, {
                xPercent: -30,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
            })

            // Heading reveal — simple fade+slide (no text split to avoid overflow)
            gsap.fromTo(headingRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
                }
            )

            // Stats
            const statEls = statsRef.current?.querySelectorAll('.stat-card')
            if (statEls?.length) {
                gsap.fromTo(statEls,
                    { opacity: 0, scale: 0.8, y: 30 },
                    {
                        opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 1, ease: 'back.out(1.7)',
                        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
                    }
                )
            }

            // Image reveal
            gsap.fromTo(imageRef.current,
                { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 },
                {
                    clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.4, ease: 'power3.out',
                    scrollTrigger: { trigger: imageRef.current, start: 'top 80%' }
                }
            )
        }, sectionRef)

        const cleanupTilt = initTiltEffect(imageRef.current, 10)
        return () => { ctx.revert(); cleanupTilt() }
    }, [])

    return (
        <section ref={sectionRef} id="about" className="section py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-void relative overflow-hidden">
            {/* Scrolling background text */}
            <div ref={bgTextRef} className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap pointer-events-none select-none" style={{ opacity: 0.025, fontSize: '22vw', fontWeight: 900, fontFamily: 'Syne,sans-serif', color: '#fff', zIndex: 0 }}>
                SHANAWAS K ✦ SOFTWARE ENGINEER ✦ FULL STACK DEVELOPER ✦ AI ENTHUSIAST ✦
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">

                    {/* Image card */}
                    <div ref={imageRef} className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ cursor: 'none' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-surface to-void" />
                        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 40% 40%, rgba(0,212,255,0.08), transparent 60%)' }} />
                        {/* Giant letter */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <span className="font-display font-black" style={{ fontSize: '18rem', color: 'rgba(255,255,255,0.035)', lineHeight: 1 }}>S</span>
                        </div>
                        {/* SVG abstract lines */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" style={{ opacity: 0.07 }}>
                            <circle cx="200" cy="250" r="150" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
                            <circle cx="200" cy="250" r="100" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
                            <line x1="50" y1="250" x2="350" y2="250" stroke="#00d4ff" strokeWidth="0.5" />
                            <line x1="200" y1="100" x2="200" y2="400" stroke="#00d4ff" strokeWidth="0.5" />
                        </svg>
                        {/* Bottom metadata label */}
                        <div className="absolute bottom-6 left-6">
                            <span className="block font-mono text-[8px] uppercase tracking-[0.3em] text-white/30 mb-1">Build Ref</span>
                            <span className="font-mono text-[11px] text-accent glow-text">
                                <ScrambleText text="v2.0.26_build" delay={1500} duration={800} />
                            </span>
                        </div>
                        {/* Glow neon border */}
                        <div className="absolute inset-0 rounded-3xl glow-neon pointer-events-none" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.08) inset, 0 0 30px rgba(0,212,255,0.15)' }} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-8" style={{ minWidth: 0 }}>
                        <div>
                            <p className="section-label mb-4">The Narrative</p>
                            <h2
                                ref={headingRef}
                                className="font-display font-black text-bright leading-[1.0]"
                                style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)', overflowWrap: 'break-word', wordBreak: 'break-word', maxWidth: '100%' }}
                            >
                                Bridging the gap between Logic &amp; Art
                            </h2>
                        </div>

                        <div className="flex flex-col gap-5 text-lg leading-relaxed max-w-lg" style={{ color: 'rgba(226,232,240,0.45)' }}>
                            <p>I don&apos;t just build websites — I conceive <span style={{ color: '#e2e8f0', fontWeight: 500 }}>digital ecosystems</span>. My work lives at the intersection of robust engineering and cinematic motion design.</p>
                            <p>With a focus on <span style={{ color: '#00d4ff', fontStyle: 'italic', fontWeight: 600 }}>Awwwards-level</span> interaction quality, I prioritize the feel of every scroll, hover, and transition.</p>
                        </div>

                        {/* Stats */}
                        <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { num: '12+', label: 'Projects' },
                                { num: '2 yr', label: 'Experience' },
                                { num: '12', label: 'Awards' },
                            ].map(({ num, label }, i) => (
                                <div key={label} className="stat-card glass rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.06), transparent)' }} />
                                    <div className="font-display font-black text-bright text-4xl mb-1 relative z-10">
                                        <ScrambleText text={num} delay={1800 + i * 200} duration={900} />
                                    </div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] relative z-10" style={{ color: 'rgba(226,232,240,0.3)' }}>{label}</p>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#contact"
                            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                            className="self-start flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] group cursor-none"
                            style={{ color: 'rgba(226,232,240,0.35)' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(226,232,240,0.35)'}
                        >
                            <span>Get in touch</span>
                            <div className="w-6 h-px bg-current transition-all group-hover:w-10" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About

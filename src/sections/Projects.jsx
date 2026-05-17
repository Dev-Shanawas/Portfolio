import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
    {
        id: 1, title: 'Gig Marketplace',
        category: 'Marketplace Platform',
        description: 'Engineered a scalable backend platform connecting 1,000+ gig workers with employers, enabling real-time gig-job matching and reducing fulfillment time by 40%.',
        tags: ['React', 'PHP', 'Node JS', 'Socket IO', 'SQL'], color: '#00d4ff',
        bg: 'linear-gradient(160deg, #0a1628 0%, #020408 100%)',
        accent: 'rgba(0,212,255,0.12)',
    },
    {
        id: 2, title: 'IEEE Smart Quiz',
        category: 'Web Application',
        description: 'Developed a smart quiz web application used to conduct 100+ live quiz events, enabling real-time participation, leaderboards, and "challenge your friends" features.',
        tags: ['Node.js', 'PHP', 'MongoDB'], color: '#7c3aed',
        bg: 'linear-gradient(160deg, #0d0a1a 0%, #020408 100%)',
        accent: 'rgba(124,58,237,0.12)',
    },
    {
        id: 3, title: 'VoiceStack',
        category: 'AI Communications',
        description: 'AI-powered phone system supporting 2,000+ dental practices and processing 100K+ calls/day with real-time post-call intelligence.',
        tags: ['Node.js', 'PostgreSQL', 'AI', 'Microservices'], color: '#f59e0b',
        bg: 'linear-gradient(160deg, #1a1205 0%, #020408 100%)',
        accent: 'rgba(245,158,11,0.12)',
    },
]

const ProjectCard = ({ project, index }) => {
    const cardRef = useRef(null)

    const onEnter = () => gsap.to(cardRef.current, { scale: 1.03, duration: 0.4, ease: 'power2.out' })
    const onLeave = () => gsap.to(cardRef.current, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' })

    return (
        <div
            ref={cardRef}
            className="flex-shrink-0 relative overflow-hidden group cursor-none"
            style={{
                width: 'clamp(280px, 32vw, 460px)',
                height: '100%',
                background: project.bg,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 28,
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        >
            {/* Accent glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse at 50% 110%, ${project.accent} 0%, transparent 65%)` }}
            />

            {/* Card index */}
            <div className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.3em]" style={{ color: `${project.color}60` }}>
                0{index + 1}
            </div>

            {/* Arrow button */}
            <div
                className="absolute top-6 left-6 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ border: `1px solid ${project.color}40`, background: `${project.color}10` }}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-500">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
            </div>

            {/* Content at bottom */}
            <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <span
                    className="self-start font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
                    style={{ background: `${project.color}12`, color: project.color, border: `1px solid ${project.color}25` }}
                >
                    {project.category}
                </span>

                <h3
                    className="font-display font-black text-bright leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', letterSpacing: '-0.03em' }}
                >
                    {project.title}
                </h3>

                <p
                    className="text-sm leading-relaxed mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: 'rgba(226,232,240,0.45)' }}
                >
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    {project.tags.map(tag => (
                        <span key={tag} className="font-mono text-[7px] uppercase tracking-[0.18em]" style={{ color: project.color }}>{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Projects = () => {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const headRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
                }
            )

            // Horizontal scroll — pin the section and drive track
            const track = trackRef.current
            if (!track) return
            const totalScroll = track.scrollWidth - track.parentElement.offsetWidth

            gsap.to(track, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${totalScroll}`,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="bg-void"
            style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
            {/* ── Heading — always above cards, never overlapping ── */}
            <div
                ref={headRef}
                className="flex-none flex items-end justify-between px-6 md:px-14"
                style={{ paddingTop: '5.5rem', paddingBottom: '2rem', opacity: 0 }}
            >
                <div>
                    <p className="section-label mb-2">Portfolio</p>
                    <h2
                        className="font-display font-black text-bright leading-none"
                        style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                    >
                        Selected <span className="text-gradient">Work</span>
                    </h2>
                </div>
                <span className="hidden md:block font-mono text-[9px] uppercase tracking-[0.25em] self-end mb-1.5" style={{ color: 'rgba(226,232,240,0.2)' }}>
                    Scroll to explore →
                </span>
            </div>

            {/* ── Card track — fills remaining height ── */}
            <div className="flex-1 relative overflow-hidden">
                <div
                    ref={trackRef}
                    className="absolute top-0 bottom-0 left-0 flex items-stretch gap-5 px-6 md:px-14 pb-8"
                    style={{ width: 'max-content' }}
                >
                    {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}

                    {/* End CTA */}
                    <div
                        className="flex-shrink-0 flex flex-col justify-center gap-6 pl-10 pr-4"
                        style={{ width: 'clamp(180px, 18vw, 260px)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <p className="section-label">More Work</p>
                        <h4 className="font-display font-black text-bright text-2xl leading-snug">
                            See the full archive
                        </h4>
                        <button className="self-start px-6 py-3 rounded-full glass font-mono text-[9px] uppercase tracking-[0.2em] text-bright cursor-none hover:bg-white/10 transition-colors">
                            View All
                        </button>
                    </div>
                </div>
            </div>

            {/* Faint giant number */}
            <div
                className="absolute bottom-0 right-0 pointer-events-none select-none font-display font-black leading-none"
                style={{ fontSize: '28vw', color: 'rgba(255,255,255,0.013)', bottom: '-2vw', right: '-1vw' }}
            >
                03
            </div>
        </section>
    )
}

export default Projects

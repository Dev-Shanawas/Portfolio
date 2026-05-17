import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
    {
        period: 'July 2025 — Present',
        role: 'Software Development Engineer',
        company: 'CareStack',
        description: 'Designed and implemented scalable backend services for VoiceStack, supporting 2,000+ dental practices and processing 100K+ calls/day. Optimized APIs for core AI-driven features, reducing operational friction and improving system responsiveness by 30%.',
        stack: ['Node.js', 'PostgreSQL', 'Microservices', 'AI'],
        color: '#00d4ff',
    },
    {
        period: 'Apr 2024 — May 2025',
        role: 'Software Engineer',
        company: 'PurpleSoft',
        description: 'Built and maintained scalable backend modules for CRM applications, supporting 5,000+ active users and managing 200K+ customer records. Collaborated on real-time data sync, reducing delays by 30%.',
        stack: ['Laravel', 'PHP', 'MySQL', 'WebSockets'],
        color: '#7c3aed',
    },
    {
        period: 'Jan 2024 — Mar 2024',
        role: 'Software Engineer Intern',
        company: 'Centaur Digital',
        description: 'Gained hands-on experience in full-stack development, contributing to internal tools and participating in code reviews and agile sprints.',
        stack: ['JavaScript', 'React', 'Node.js', 'Git'],
        color: '#06ffa5',
    },
]

const ExperienceItem = ({ exp, index }) => {
    const itemRef = useRef(null)
    const dotRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(itemRef.current,
                { opacity: 0, x: 50, rotateY: 15 },
                {
                    opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power4.out',
                    delay: index * 0.12,
                    scrollTrigger: { trigger: itemRef.current, start: 'top 86%', toggleActions: 'play none none reverse' }
                }
            )
            // Dot pulse
            gsap.to(dotRef.current, {
                boxShadow: `0 0 0 8px ${exp.color}00, 0 0 20px ${exp.color}`,
                duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'
            })
        }, itemRef)
        return () => ctx.revert()
    }, [index, exp.color])

    return (
        <div ref={itemRef} className="relative pl-10 md:pl-20 pb-20 opacity-0">
            {/* Timeline dot */}
            <div
                ref={dotRef}
                className="absolute left-[-3px] top-2 w-[7px] h-[7px] rounded-full z-10"
                style={{ background: exp.color }}
            />

            {/* Period + log ref */}
            <div className="flex items-center gap-4 mb-5">
                <span
                    className="font-mono text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-sm"
                    style={{ background: `${exp.color}10`, color: exp.color, border: `1px solid ${exp.color}20` }}
                >
                    {exp.period}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'rgba(226,232,240,0.2)' }}>
                    LOG_{String(index).padStart(2, '0')}
                </span>
            </div>

            {/* Card */}
            <div
                className="glass-strong rounded-3xl p-7 md:p-9 relative overflow-hidden group cursor-none border border-transparent hover:border-white/10 transition-colors duration-500 max-w-2xl"
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(ellipse at 0% 50%, ${exp.color}08, transparent 60%)` }} />

                <div className="mb-5">
                    <h3 className="font-display font-black text-bright text-2xl md:text-3xl tracking-tight mb-1 relative z-10">
                        {exp.role}
                    </h3>
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest relative z-10" style={{ color: exp.color, opacity: 0.8 }}>
                        <span className="w-5 h-px" style={{ background: exp.color }} />
                        {exp.company}
                    </p>
                </div>

                <p className="text-base md:text-lg leading-relaxed mb-7 max-w-xl relative z-10" style={{ color: 'rgba(226,232,240,0.45)' }}>
                    {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 relative z-10">
                    {exp.stack.map(t => (
                        <span key={t}
                            className="font-mono text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg cursor-none transition-colors duration-300"
                            style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.3)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${exp.color}50`; e.currentTarget.style.color = exp.color }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(226,232,240,0.3)' }}
                        >{t}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Experience = () => {
    const sectionRef = useRef(null)
    const lineRef = useRef(null)
    const bgRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Scrolling background word
            gsap.to(bgRef.current, {
                yPercent: -25,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
            })

            // Timeline line draw
            gsap.fromTo(lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1, ease: 'none',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', end: 'bottom 50%', scrub: 0.6 }
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="experience" className="section py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-void relative overflow-hidden">
            {/* Background parallax text */}
            <div ref={bgRef} className="absolute top-0 right-[-2vw] pointer-events-none select-none" style={{ zIndex: 0 }}>
                <span className="font-display font-black uppercase" style={{ fontSize: '28vw', color: 'rgba(255,255,255,0.015)', lineHeight: 1 }}>PATH</span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24">
                    <p className="section-label mb-3">Journey</p>
                    <h2 className="font-display font-black text-bright leading-[0.9]" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)' }}>
                        Professional <span className="text-gradient">Timeline</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Rail */}
                    <div className="timeline-rail" />
                    <div ref={lineRef} className="timeline-fill" style={{ height: '100%' }} />

                    {/* Items */}
                    <div>
                        {experiences.map((exp, i) => <ExperienceItem key={i} exp={exp} index={i} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Experience

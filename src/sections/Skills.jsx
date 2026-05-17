import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initTiltEffect } from '../animations/gsap'

import { FaReact, FaNodeJs, FaPython, FaAws, FaBrain, FaGitAlt, FaInfinity, FaLinux } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiPostgresql, SiMongodb, SiDocker, SiKubernetes, SiNestjs, SiCplusplus, SiRedis, SiRabbitmq, SiFirebase, SiLaravel, SiPostman, SiGrafana } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger)

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'
function ScrambleNum({ text, delay = 0 }) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const chars = text.split('')
        const totalFrames = Math.ceil(800 / 1000 * 60)
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
    }, [text, delay])
    return <span ref={ref}>{text}</span>
}

const skills = [
    { name: 'Node.js / Nest.js', color: '#539e43', icon: FaNodeJs },
    { name: 'Postgres / MongoDB', color: '#336791', icon: SiPostgresql },
    { name: 'TS / JavaScript', color: '#3178c6', icon: SiTypescript },
    { name: 'Python / C++', color: '#4b8bbe', icon: FaPython },
    { name: 'React / Tailwind', color: '#00d8ff', icon: FaReact },
    { name: 'Docker / K8s', color: '#2496ed', icon: SiDocker },
    { name: 'AWS / GCP', color: '#ff9900', icon: FaAws },
    { name: 'LLM / AI Tools', color: '#ffffff', icon: FaBrain },
    { name: 'Redis / RabbitMQ', color: '#dc382d', icon: SiRedis },
    { name: 'Firestore / Firebase', color: '#ffca28', icon: SiFirebase },
    { name: 'Laravel / PHP', color: '#ff2d20', icon: SiLaravel },
    { name: 'Git / GitHub', color: '#f05032', icon: FaGitAlt },
    { name: 'Postman', color: '#ff6c37', icon: SiPostman },
    { name: 'Grafana', color: '#f46800', icon: SiGrafana },
    { name: 'CI / CD', color: '#ffffff', icon: FaInfinity },
    { name: 'Linux (Shell)', color: '#fcc624', icon: FaLinux },
]

const SkillCard = ({ skill, index }) => {
    const cardRef = useRef(null)
    const Icon = skill.icon

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                {
                    opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out',
                    delay: index * 0.05,
                    scrollTrigger: { trigger: cardRef.current, start: 'top 92%' }
                }
            )
        }, cardRef)

        const cleanupTilt = initTiltEffect(cardRef.current, 10)
        return () => { ctx.revert(); cleanupTilt() }
    }, [index])

    return (
        <div
            ref={cardRef}
            className="glass-strong rounded-2xl p-5 relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
            style={{ cursor: 'none' }}
        >
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl"
                style={{ background: skill.color }} />

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ background: `${skill.color}15`, color: skill.color, border: `1px solid ${skill.color}25` }}>
                    <Icon />
                </div>
                <div>
                    <h3 className="font-display font-bold text-bright text-sm tracking-tight">{skill.name}</h3>
                </div>
            </div>
        </div>
    )
}

const Skills = () => {
    const sectionRef = useRef(null)

    return (
        <section ref={sectionRef} id="skills" className="section py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-void relative overflow-hidden">
            {/* Orbital rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 0 }}>
                <div className="w-[70vw] h-[70vw] rounded-full animate-spin-slow" style={{ border: '1px solid rgba(0,212,255,0.04)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full animate-spin-reverse" style={{ border: '1px solid rgba(124,58,237,0.04)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full animate-spin-slow" style={{ border: '1px solid rgba(6,255,165,0.05)', animationDuration: '50s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16">
                    <p className="section-label mb-3">Core Engine</p>
                    <h2 className="font-display font-black text-bright leading-[0.9]" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)' }}>
                        Mastering the <span className="text-gradient">Modern Stack</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {skills.map((s, i) => <SkillCard key={s.name} skill={s} index={i} />)}
                </div>

                {/* Tech pill wall */}
                <div className="mt-20 pt-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] mb-6" style={{ color: 'rgba(226,232,240,0.25)' }}>Also working with</p>
                    <div className="flex flex-wrap gap-3">
                        {['Nest js', 'Kafka', 'BullMQ', 'WebSockets', 'REST APIs', 'Microservices', 'BigQuery', 'GCP', 'Monitoring', 'LLMs', 'Al-driven workflows', 'Al-assisted development'].map(tech => (
                            <span
                                key={tech}
                                className="font-mono text-[9px] uppercase tracking-[0.18em] px-4 py-2 rounded-full cursor-none transition-all duration-300"
                                style={{ border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(226,232,240,0.3)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)'; e.currentTarget.style.color = '#00d4ff' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(226,232,240,0.3)' }}
                            >{tech}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills

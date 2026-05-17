import React, { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initMagneticButton } from '../animations/gsap'

gsap.registerPlugin(ScrollTrigger)

// ─── Star canvas ─────────────────────────────────────────────────────────────
function ParticleCanvas() {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return
        const ctx = canvas.getContext('2d')
        let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight
        let mouse = { x: W / 2, y: H / 2 }, tm = { x: W / 2, y: H / 2 }

        // Offscreen canvas for static gradients
        const offscreen = document.createElement('canvas')
        const octx = offscreen.getContext('2d')
        const buildGradients = () => {
            offscreen.width = W; offscreen.height = H
                ;[[W * .3, H * .4, W * .5, 'rgba(30,8,80,0.16)'], [W * .75, H * .65, W * .45, 'rgba(0,40,80,0.11)'], [W * .55, H * .15, W * .3, 'rgba(60,0,100,0.08)']].forEach(([cx, cy, cr, col]) => {
                    const g = octx.createRadialGradient(cx, cy, 0, cx, cy, cr)
                    g.addColorStop(0, col); g.addColorStop(1, 'transparent')
                    octx.fillStyle = g; octx.fillRect(0, 0, W, H)
                })
        }

        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; build(); buildGradients() }
        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', e => { tm.x = e.clientX; tm.y = e.clientY })
        const COLS = [[200, 220, 255], [220, 235, 255], [255, 255, 255], [255, 245, 230], [255, 235, 200]]
        let layers = []
        function build() {
            layers = [
                Array.from({ length: 150 }, () => { const c = COLS[~~(Math.random() * COLS.length)]; return { ox: Math.random() * W, oy: Math.random() * H, x: 0, y: 0, r: Math.random() * .55 + .15, a: Math.random() * .4 + .1, ts: Math.random() * 1.5 + .4, tp: Math.random() * Math.PI * 2, c, p: .01 } }),
                Array.from({ length: 60 }, () => { const c = COLS[~~(Math.random() * COLS.length)]; return { ox: Math.random() * W, oy: Math.random() * H, x: 0, y: 0, r: Math.random() * .9 + .4, a: Math.random() * .5 + .2, ts: Math.random() * 2 + .5, tp: Math.random() * Math.PI * 2, c, p: .022 } }),
                Array.from({ length: 12 }, () => { const c = COLS[~~(Math.random() * COLS.length)]; return { ox: Math.random() * W, oy: Math.random() * H, x: 0, y: 0, r: Math.random() * 1.4 + .8, a: Math.random() * .5 + .45, ts: Math.random() * 2.5 + .5, tp: Math.random() * Math.PI * 2, c, p: .04, g: true } }),
            ]
            layers.forEach(l => l.forEach(s => { s.x = s.ox; s.y = s.oy; s.rgba = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},` }))
        }
        build(); buildGradients()
        const sh = []; let st = setTimeout(function sp() { sh.push({ x: Math.random() * W * .7, y: Math.random() * H * .35, len: Math.random() * 160 + 80, spd: Math.random() * 8 + 6, ang: Math.PI / 4 + (Math.random() - .5) * .4, life: 1 }); st = setTimeout(sp, Math.random() * 5000 + 4000) }, 2500)
        let raf, t = 0
        const lerp = (a, b, f) => a + (b - a) * f
        const draw = () => {
            ctx.clearRect(0, 0, W, H); t += .016
            ctx.drawImage(offscreen, 0, 0)
            mouse.x = lerp(mouse.x, tm.x, .06); mouse.y = lerp(mouse.y, tm.y, .06)
            const ox = (mouse.x / W - .5) * 2, oy = (mouse.y / H - .5) * 2
            layers.forEach(l => l.forEach(s => {
                s.x = s.ox + ox * s.p * W * .5; s.y = s.oy + oy * s.p * H * .5
                const tw = .5 + .5 * Math.sin(t * s.ts + s.tp), al = s.a * (.55 + .45 * tw)
                if (s.g) { const gr = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7); gr.addColorStop(0, `${s.rgba}${al * .5})`); gr.addColorStop(1, 'transparent'); ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill() }
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `${s.rgba}${al})`; ctx.fill()
                if (s.g && s.r > 1.2) { const sp = s.r * 5 * tw; ctx.strokeStyle = `${s.rgba}${al * .28})`; ctx.lineWidth = .5;[[-sp, 0, sp, 0], [0, -sp, 0, sp]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(s.x + x1, s.y + y1); ctx.lineTo(s.x + x2, s.y + y2); ctx.stroke() }) }
            }))
            for (let i = sh.length - 1; i >= 0; i--) { const s = sh[i]; s.x += Math.cos(s.ang) * s.spd; s.y += Math.sin(s.ang) * s.spd; s.life -= .018; if (s.life <= 0) { sh.splice(i, 1); continue } const tx = s.x - Math.cos(s.ang) * s.len * s.life, ty = s.y - Math.sin(s.ang) * s.len * s.life, gr = ctx.createLinearGradient(tx, ty, s.x, s.y); gr.addColorStop(0, 'transparent'); gr.addColorStop(.7, `rgba(200,220,255,${s.life * .5})`); gr.addColorStop(1, `rgba(255,255,255,${s.life})`); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.strokeStyle = gr; ctx.lineWidth = 1.5; ctx.stroke() }
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(raf); clearTimeout(st); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Html, Sparkles, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { FaReact, FaNodeJs, FaJs, FaPython, FaCube, FaAws, FaBrain } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiPhp, SiPostgresql, SiMongodb, SiRedis, SiRabbitmq, SiDocker, SiKubernetes } from 'react-icons/si';

// ─── Stunning Orbital 3D Tech Core ────────────────────────────────────────

const TECH_ITEMS = [
    { name: 'REACT', icon: FaReact, color: '#00d8ff', radius: 1.5, speed: 0.6, angle: 0, inclination: 0.2 },
    { name: 'NODE.JS', icon: FaNodeJs, color: '#539e43', radius: 1.8, speed: 0.4, angle: Math.PI / 3, inclination: -0.3 },
    { name: 'TS', icon: SiTypescript, color: '#3178c6', radius: 2.1, speed: 0.5, angle: (Math.PI * 4) / 3, inclination: -0.4 },
    { name: 'POSTGRES', icon: SiPostgresql, color: '#336791', radius: 2.5, speed: 0.35, angle: Math.PI / 2, inclination: 0.1 },
    { name: 'MONGODB', icon: SiMongodb, color: '#47a248', radius: 2.9, speed: 0.25, angle: (Math.PI * 2) / 3, inclination: -0.1 },
    { name: 'LLM', icon: FaBrain, color: '#ffffff', radius: 3.3, speed: 0.15, angle: Math.PI, inclination: 0.3 },
    { name: 'DOCKER', icon: SiDocker, color: '#2496ed', radius: 3.7, speed: 0.1, angle: (Math.PI * 5) / 3, inclination: -0.4 },
    { name: 'AWS', icon: FaAws, color: '#ff9900', radius: 4.1, speed: 0.05, angle: Math.PI / 8, inclination: -0.2 },
]
const techItems = TECH_ITEMS.map(t => t.name)

function OrbitingNode({ name, icon: Icon, color, radius, speed, angle, inclination, coreRef }) {
    const groupRef = useRef();

    // Randomize initial offset to prevent synchronized unnatural movement
    const offset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime * speed + offset + angle;

        // Calculate orbital position
        const x = Math.cos(t) * radius;
        const z = Math.sin(t) * radius;
        const y = Math.sin(t) * radius * inclination; // Inclination effect

        // Smoothly update position
        groupRef.current.position.set(x, y, z);
    });

    return (
        <group ref={groupRef}>
            {/* Glowing dot representing the satellite */}
            <mesh>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <pointLight color={color} intensity={0.5} distance={2} />

            {/* High-contrast HTML pill */}
            <Html center distanceFactor={15} zIndexRange={[100, 0]} occlude={[coreRef]}>
                <div style={{
                    background: 'rgba(2, 4, 8, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: color,
                    padding: '6px',
                    borderRadius: '50%',
                    border: `1px solid ${color}40`,
                    boxShadow: `0 0 10px ${color}30, inset 0 0 8px ${color}20`,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                }}>
                    <Icon />
                </div>
            </Html>
        </group>
    );
}

function OrbitalSystem() {
    const systemRef = useRef();
    const coreRef = useRef();

    useFrame((state) => {
        const { pointer, clock } = state;
        const t = clock.elapsedTime;

        // Core continuous rotation
        if (coreRef.current) {
            coreRef.current.rotation.x = t * 0.2;
            coreRef.current.rotation.y = t * 0.3;
        }

        // Gentle parallax effect on the entire system based on mouse
        if (systemRef.current) {
            // Target rotations based on mouse pointer
            const targetX = (pointer.y * Math.PI) / 6;
            const targetY = (pointer.x * Math.PI) / 6;

            systemRef.current.rotation.x = THREE.MathUtils.lerp(systemRef.current.rotation.x, targetX, 0.05);
            systemRef.current.rotation.y = THREE.MathUtils.lerp(systemRef.current.rotation.y, targetY, 0.05);
        }
    });

    return (
        <group ref={systemRef} position={[0, 0, 0]}>
            {/* Central glowing wireframe core */}
            <Icosahedron ref={coreRef} args={[1.2, 1]} castShadow receiveShadow>
                <meshStandardMaterial
                    color="#0a0a0a"
                    emissive="#7c3aed"
                    emissiveIntensity={1.5}
                    wireframe
                    wireframeLinewidth={2}
                />
            </Icosahedron>

            {/* Inner core solid base */}
            <Icosahedron args={[1.15, 1]}>
                <meshStandardMaterial color="#020408" roughness={0.8} />
            </Icosahedron>

            <pointLight color="#7c3aed" intensity={3} distance={10} />

            {/* Orbiting Tech Pills */}
            {TECH_ITEMS.map((tech, i) => (
                <OrbitingNode key={i} {...tech} coreRef={coreRef} />
            ))}
        </group>
    );
}

function FloatingTech({ tiltRef }) {
    return (
        <div ref={tiltRef} style={{ width: '100%', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 0, 9], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
            >
                <ambientLight intensity={0.1} />
                <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={1} color="#ffffff" />

                <OrbitalSystem />

                <Environment preset="city" />
            </Canvas>
        </div>
    )
}

// ─── Glitch / scramble hook ──────────────────────────────────────────────────
const ROLES = ['AI Enthusiast', 'Software Engineer', 'Full-stack Developer']
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}'
function useGlitch(items, holdMs = 2200, scrambleMs = 600) {
    const [display, setDisplay] = useState(items[0])
    const [ri, setRi] = useState(0)
    useEffect(() => {
        const holdTimer = setTimeout(() => {
            const next = (ri + 1) % items.length
            const target = items[next]
            const frames = Math.ceil((scrambleMs / 1000) * 60)
            let frame = 0
            const tick = setInterval(() => {
                const resolved = Math.floor((frame / frames) * target.length)
                setDisplay(
                    target.split('').map((ch, i) =>
                        i < resolved
                            ? ch
                            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                    ).join('')
                )
                frame++
                if (frame > frames) { clearInterval(tick); setDisplay(target); setRi(next) }
            }, 1000 / 60)
            return () => clearInterval(tick)
        }, holdMs)
        return () => clearTimeout(holdTimer)
    }, [ri, items, holdMs, scrambleMs])
    return display
}

const GlitchRole = React.memo(() => {
    const role = useGlitch(ROLES);
    return (
        <span className="font-display font-black text-gradient" style={{ fontSize: 'clamp(1rem,2.5vw,1.8rem)', letterSpacing: '-0.03em', minWidth: '15ch', display: 'inline-block' }}>{role}</span>
    );
});

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
    const sectionRef = useRef(null)
    const parallaxRef = useRef(null)
    const contentRef = useRef(null)
    const tiltRef = useRef(null)
    const btn2Ref = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const els = contentRef.current?.querySelectorAll('[data-reveal]') || []
            gsap.fromTo(els, { opacity: 0, y: 38 }, { opacity: 1, y: 0, stagger: .11, duration: .9, ease: 'power3.out', delay: .35 })
        }, sectionRef)

        // Mouse → tilt monitor + parallax blobs
        const onMove = (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2
            const ny = (e.clientY / window.innerHeight - 0.5) * 2
            // Blob parallax
            gsap.to(parallaxRef.current, { x: nx * -18, y: ny * 12, duration: 1.4, ease: 'power2.out' })
            // Keyboard tilt
            if (tiltRef.current) {
                gsap.to(tiltRef.current, {
                    rotateY: nx * 12,
                    rotateX: ny * -8,
                    duration: 0.9,
                    ease: 'power2.out',
                    transformPerspective: 900,
                    transformOrigin: 'center center',
                })
            }
        }
        window.addEventListener('mousemove', onMove)
        const c2 = initMagneticButton(btn2Ref.current)
        return () => { ctx.revert(); window.removeEventListener('mousemove', onMove); c2?.() }
    }, [])

    const socials = [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shanawask/', color: '#0077b5', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
        { label: 'GitHub', href: 'https://git.selfmade.ninja/Shanawas', color: '#e2e8f0', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> },
    ]

    const techItems = ['NEXT.JS', 'THREE.JS', 'GSAP', 'PYTHON', 'TYPESCRIPT', 'AI / ML', 'NODE.JS', 'REACT']

    return (
        <section ref={sectionRef} id="home" className="relative w-full min-h-screen flex flex-col overflow-hidden" style={{ background: '#020408' }}>
            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)', backgroundSize: '90px 90px', zIndex: 1 }} />

            {/* Blobs */}
            <div ref={parallaxRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, willChange: 'transform' }}>
                <div style={{ position: 'absolute', top: '22%', left: '5%', width: 380, height: 380, background: 'radial-gradient(circle,rgba(0,212,255,0.06),transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '4%', width: 320, height: 320, background: 'radial-gradient(circle,rgba(124,58,237,0.07),transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
            </div>

            {/* Badge */}
            <div className="absolute top-24 right-6 md:right-14 z-20 glass px-4 py-2 rounded-full flex items-center gap-2.5">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent3 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-accent3" /></span>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-accent3">Solving problems</span>
            </div>

            {/* Two-column layout */}
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 md:px-14 lg:px-20 pt-24 pb-8">

                {/* LEFT */}
                <div ref={contentRef} className="flex flex-col justify-center">
                    <div data-reveal className="flex items-center gap-3 mb-5" style={{ opacity: 0 }}>
                        <span className="text-3xl">👋</span>
                        <span className="font-mono text-base md:text-lg tracking-wider" style={{ color: 'rgba(226,232,240,0.4)' }}>Hey! This is</span>
                    </div>
                    <h1 data-reveal className="font-display font-black text-bright leading-[0.9] mb-4" style={{ fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', letterSpacing: '-0.04em', opacity: 0 }}>Shanawas</h1>
                    <div data-reveal className="flex items-baseline gap-3 mb-7 flex-wrap" style={{ opacity: 0, minHeight: '1.2em' }}>
                        <span className="font-display font-semibold" style={{ fontSize: 'clamp(1rem,2.5vw,1.8rem)', color: 'rgba(226,232,240,0.3)', letterSpacing: '-0.02em' }}>I&apos;m a</span>
                        <GlitchRole />
                    </div>
                    <p data-reveal className="font-body text-base md:text-lg leading-[1.8] mb-8 max-w-lg" style={{ color: 'rgba(226,232,240,0.38)', opacity: 0 }}>
                        I build products that are <span style={{ color: 'rgba(226,232,240,0.72)' }}>fast, scalable, and actually useful</span>. From backend architecture to clean frontend experiences, I turn ideas into real-world applications.
                    </p>
                    <div data-reveal className="flex flex-col sm:flex-row items-start gap-4 mb-8" style={{ opacity: 0 }}>
                        <button ref={btn2Ref} className="magnetic-btn px-9 py-4 rounded-full font-mono text-xs tracking-[0.25em] uppercase cursor-none" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#020408', boxShadow: '0 0 36px rgba(0,212,255,0.22)' }} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                            <span className="mag-inner">Let&apos;s Talk</span>
                        </button>
                    </div>
                    <div data-reveal className="flex items-center gap-3" style={{ opacity: 0 }}>
                        {socials.map(({ label, href, icon, color }) => (
                            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-11 h-11 rounded-full glass flex items-center justify-center cursor-none transition-all duration-300" style={{ color: 'rgba(226,232,240,0.35)' }} onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.boxShadow = `0 0 18px ${color}40`; e.currentTarget.style.borderColor = color }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,232,240,0.35)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>{icon}</a>
                        ))}
                        <span className="w-px h-5 mx-2" style={{ background: 'rgba(255,255,255,0.07)' }} />
                        <span className="font-mono text-[8px] uppercase tracking-[0.25em]" style={{ color: 'rgba(226,232,240,0.18)' }}>Follow</span>
                    </div>
                </div>

                {/* RIGHT — Floating 3D Logos */}
                <div className="hidden lg:flex items-center justify-center relative py-8 w-full h-full">
                    {/* Ambient glow behind 3D cluster */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,212,255,0.07) 0%,rgba(124,58,237,0.06) 45%,transparent 70%)', filter: 'blur(20px)' }} />
                    <FloatingTech tiltRef={tiltRef} />
                </div>
            </div>

            {/* Marquee — fixed to very bottom, below all content */}
            <div className="relative z-10 w-full overflow-hidden" style={{ opacity: 0.18, marginTop: 'auto' }}>
                <div style={{ maskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)' }}>
                    <div className="flex" style={{ animation: 'marqueeScroll 28s linear infinite', width: 'max-content' }}>
                        {[...techItems, ...techItems].map((t, i) => (
                            <span key={i} className="font-mono text-xs tracking-[0.2em] uppercase px-6 py-3" style={{ color: '#00d4ff', whiteSpace: 'nowrap' }}>{t}<span className="opacity-25 ml-4">✦</span></span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-6 right-8 z-10 flex items-center gap-2.5 opacity-30">
                <span className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: 'rgba(226,232,240,0.4)' }}>Scroll</span>
                <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom,rgba(0,212,255,0.8),transparent)' }} />
            </div>

            {/* Bottom fade */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '16vh', background: 'linear-gradient(transparent,#020408)', zIndex: 5, pointerEvents: 'none' }} />

            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </section>
    )
}

export default Hero

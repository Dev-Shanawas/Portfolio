import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const Navbar = () => {
    const navRef = useRef(null)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: 3.2 }
        )
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scroll = (e, id) => {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    const links = [
        { label: 'Work', id: 'projects' },
        { label: 'Core', id: 'skills' },
        { label: 'Log', id: 'experience' },
        { label: 'Contact', id: 'contact' },
    ]

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-6 md:px-12 py-5"
            style={{ opacity: 0 }}
        >
            {/* Logo */}
            <a href="#" onClick={e => scroll(e, 'home')} className="group flex items-center gap-3 cursor-none">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg group-hover:bg-accent group-hover:border-accent group-hover:text-void transition-all duration-500">
                    👦
                </div>
                <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.35em] text-white/30 group-hover:text-white/70 transition-colors">
                    Shanawas
                </span>
            </a>

            {/* Pill nav */}
            <div
                className="hidden sm:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 transition-all duration-700"
                style={{
                    background: scrolled ? 'rgba(2,4,8,0.7)' : 'rgba(255,255,255,0.03)',
                    backdropFilter: scrolled ? 'blur(30px)' : 'blur(10px)',
                    border: `1px solid ${scrolled ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: scrolled ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                {links.map(({ label, id }) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        onClick={e => scroll(e, id)}
                        className="nav-link px-5 py-2 rounded-full hover:bg-white/5 hover:text-bright transition-all duration-300"
                    >
                        {label}
                    </a>
                ))}
            </div>

            {/* Metadata */}
            <div className="hidden lg:flex flex-col items-end gap-0.5">
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">GMT +5:30</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-accent opacity-40">Online</span>
            </div>

            {/* Mobile burger */}
            <button className="sm:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg glass cursor-none">
                <span className="w-5 h-px bg-white/60" />
                <span className="w-5 h-px bg-white/30" />
            </button>
        </nav>
    )
}

export default Navbar

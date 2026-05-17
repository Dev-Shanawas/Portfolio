import React from 'react'

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer
            className="relative border-t px-6 md:px-24 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'var(--color-void)' }}
        >
            <p className="font-mono text-xs tracking-widest text-muted">
                © {year} Shanawas. Crafted with ♥ &amp; GSAP.
            </p>
            <p className="font-mono text-xs text-muted" style={{ letterSpacing: '0.1em' }}>
                Built with React · Three.js · GSAP
            </p>
            <a
                href="#home"
                className="group flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
                style={{ color: 'rgba(226,232,240,0.3)', transition: 'color 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(226,232,240,0.3)' }}
            >
                Back to top
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
            </a>
        </footer>
    )
}

export default Footer

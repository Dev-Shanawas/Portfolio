import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initMagneticButton } from '../animations/gsap'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const formRef = useRef(null)
    const btnRef = useRef(null)
    const [sent, setSent] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: '' })

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            )
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 40, scale: 0.97 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3,
                    scrollTrigger: { trigger: formRef.current, start: 'top 85%' }
                }
            )
        }, sectionRef)
        const cleanup = initMagneticButton(btnRef.current, 0.5)
        return () => { ctx.revert(); cleanup() }
    }, [sent])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        gsap.to(btnRef.current, {
            scale: 0.9, duration: 0.15, yoyo: true, repeat: 1,
            onComplete: async () => {
                try {
                    const formData = new FormData()
                    formData.append("access_key", "da0e2f93-ccf8-4d4d-9e28-1de94883a17d")
                    formData.append("name", form.name)
                    formData.append("email", form.email)
                    formData.append("message", form.message)

                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: formData
                    })

                    const data = await response.json()

                    if (data.success) {
                        gsap.to(btnRef.current, {
                            rotateX: 90, opacity: 0, duration: 0.3, ease: 'power2.in',
                            onComplete: () => {
                                setSent(true)
                                setIsSubmitting(false)
                            }
                        })
                    } else {
                        alert(data.message || "Something went wrong. Please try again.")
                        setIsSubmitting(false)
                    }
                } catch (error) {
                    console.error("Submission error:", error)
                    alert("Failed to send message. Please check your connection.")
                    setIsSubmitting(false)
                }
            }
        })
    }

    return (
        <section ref={sectionRef} id="contact" className="section py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-void relative overflow-hidden">
            {/* Giant BG word */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" style={{ zIndex: 0, fontSize: 'clamp(6rem, 28vw, 25rem)', fontWeight: 900, fontFamily: 'Syne,sans-serif', color: 'rgba(255,255,255,0.013)', whiteSpace: 'nowrap', transform: 'translate(-50%, -50%)' }}>
                TALK
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section head */}
                <div ref={headingRef} className="text-center mb-20" style={{ opacity: 0 }}>
                    <p className="section-label mb-4">Open Channel</p>
                    <h2 className="font-display font-black text-bright leading-[0.88] mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}>
                        <div style={{ textAlign: 'center' }}>
                            Let&apos;s build{' '}<span className="text-gradient italic">something</span>
                        </div>
                        <div style={{ textAlign: 'center', color: 'rgba(226,232,240,0.35)' }}>
                            extraordinary
                        </div>
                    </h2>
                    <p className="font-body text-lg max-w-xl mx-auto" style={{ color: 'rgba(226,232,240,0.35)' }}>
                        Feel free to reach out.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
                    {/* Contact links */}
                    <div className="lg:col-span-2 flex flex-col gap-7">
                        {[
                            { label: 'Email', value: 'shanawaskamal20@gmail.com', href: 'mailto:shanawaskamal20@gmail.com' },
                            { label: 'LinkedIn', value: 'linkedin.com/in/shanawas-k', href: 'https://linkedin.com/in/shanawas-k' },
                            { label: 'GitHub', value: 'github.com/shanawaskamal', href: 'https://github.com/shanawaskamal' },
                        ].map(({ label, value, href }) => (
                            <a key={label} href={href}
                                className="group flex flex-col gap-1 cursor-none py-4 border-b"
                                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                            >
                                <span className="font-mono text-[8px] uppercase tracking-[0.3em] group-hover:text-accent transition-colors" style={{ color: 'rgba(226,232,240,0.25)' }}>{label}</span>
                                <span className="font-body text-lg text-bright group-hover:text-accent transition-colors duration-300">{value}</span>
                            </a>
                        ))}

                        {/* Availability tag */}
                        <div className="mt-4 flex items-center gap-3 glass rounded-2xl px-5 py-4">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent3 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent3" />
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent3">Making life easier</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div ref={formRef} className="lg:col-span-3 glass-strong rounded-3xl p-8 md:p-12" style={{ opacity: 0 }}>
                        {sent ? (
                            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-accent3/10 border border-accent3/30 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06ffa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-display font-black text-bright text-2xl mb-2">Message received.</p>
                                    <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(226,232,240,0.3)' }}>I&apos;ll be in touch within 24h</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-9">
                                <div className="flex flex-col gap-1">
                                    <label className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: 'rgba(226,232,240,0.3)' }}>Name</label>
                                    <input
                                        required type="text" placeholder="Your name"
                                        name="name"
                                        disabled={isSubmitting}
                                        value={form.name}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        className="form-input disabled:opacity-50" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: 'rgba(226,232,240,0.3)' }}>Email</label>
                                    <input
                                        required type="email" placeholder="you@brand.com"
                                        name="email"
                                        disabled={isSubmitting}
                                        value={form.email}
                                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        className="form-input disabled:opacity-50" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: 'rgba(226,232,240,0.3)' }}>Message</label>
                                    <textarea
                                        required rows={5} placeholder="Tell me about your vision..."
                                        name="message"
                                        disabled={isSubmitting}
                                        value={form.message}
                                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                        className="form-input resize-none disabled:opacity-50" />
                                </div>
                                <button
                                    ref={btnRef}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="magnetic-btn self-start px-12 py-5 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-bold disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: '#020408', boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}
                                >
                                    <span className="mag-inner">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact

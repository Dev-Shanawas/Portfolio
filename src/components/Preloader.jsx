import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * Preloader — counts 0→100 then reveals site with a 3-slab wipe exit.
 * Slabs use 100vh height so GSAP can animate their clipPath cleanly.
 */
const STAGES = [
    'BOOT SEQUENCE...',
    'LOADING MODULES...',
    'CALIBRATING MOTION...',
    'COMPILING SHADERS...',
    'READY.',
]

const Preloader = ({ onComplete }) => {
    const [count, setCount] = useState(0)
    const [stage, setStage] = useState(0)
    const slabsRef = useRef(null)
    const counterRef = useRef(null)
    const statusRef = useRef(null)
    const doneRef = useRef(false)

    // Simulate loading counter
    useEffect(() => {
        let val = 0
        const step = () => {
            val += Math.floor(Math.random() * 8) + 3
            if (val >= 100) {
                val = 100
                setCount(100)
            } else {
                setCount(val)
                setTimeout(step, 60)
            }
        }
        setTimeout(step, 200)
    }, [])

    // Cycle stage label
    useEffect(() => {
        const t = setInterval(() => setStage(p => Math.min(p + 1, STAGES.length - 1)), 900)
        return () => clearInterval(t)
    }, [])

    // Exit animation when count hits 100
    useEffect(() => {
        if (count < 100 || doneRef.current) return
        doneRef.current = true

        const tl = gsap.timeline({ onComplete })
        tl.to([counterRef.current, statusRef.current], {
            yPercent: -120, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.05,
        })
            .to(slabsRef.current.children, {
                clipPath: 'inset(0 0 100% 0)',
                duration: 1.1,
                stagger: { amount: 0.25, from: 'center' },
                ease: 'expo.inOut',
            }, '-=0.1')
    }, [count, onComplete])

    return (
        <div className="fixed inset-0 z-[9999]" aria-hidden="true">
            {/* Three vertical slabs */}
            <div ref={slabsRef} className="absolute inset-0 flex">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="flex-1 bg-void"
                        style={{ clipPath: 'inset(0 0 0% 0)' }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none">
                <div ref={counterRef} className="flex items-baseline gap-1">
                    <span className="font-display font-black text-bright leading-none" style={{ fontSize: 'clamp(5rem, 18vw, 12rem)', letterSpacing: '-0.05em' }}>
                        {String(count).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-accent opacity-60 text-2xl mb-2">%</span>
                </div>
                <div ref={statusRef} className="flex flex-col items-center gap-3">
                    <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-accent">
                        {STAGES[stage]}
                    </p>
                    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-accent"
                            style={{ width: `${count}%`, transition: 'width 0.06s linear', boxShadow: '0 0 8px #00d4ff' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Preloader

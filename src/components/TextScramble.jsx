import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * TextScramble — Renders text with a cryptographic scramble reveal.
 * Characters cycle through random chars before settling on the real letter.
 * Triggers on mount and re-runs on hover if `hoverScramble` is true.
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?'

const TextScramble = ({
    text,
    className = '',
    style = {},
    as: Tag = 'span',
    delay = 0,
    duration = 1200, // ms for full word to resolve
    hoverScramble = false,
    onComplete,
}) => {
    const elRef = useRef(null)
    const frameRef = useRef(null)
    const iterRef = useRef(0)

    const scramble = (targetText, startDelay = 0) => {
        const chars = targetText.split('')
        const totalFrames = Math.ceil((duration / 1000) * 60) // 60fps
        const resolvePerFrame = chars.length / totalFrames

        let iteration = 0
        clearInterval(frameRef.current)

        setTimeout(() => {
            frameRef.current = setInterval(() => {
                if (!elRef.current) return
                const resolved = Math.floor(iteration * resolvePerFrame)
                elRef.current.textContent = chars
                    .map((char, i) => {
                        if (char === ' ') return '\u00A0'
                        if (i < resolved) return char
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join('')
                iteration++
                if (resolved >= chars.length) {
                    clearInterval(frameRef.current)
                    elRef.current.textContent = targetText
                    onComplete?.()
                }
            }, 1000 / 60)
        }, startDelay)
    }

    useEffect(() => {
        scramble(text, delay)
        return () => clearInterval(frameRef.current)
    }, [text, delay])

    const handleHover = () => {
        if (hoverScramble) scramble(text)
    }

    return (
        <Tag
            ref={elRef}
            className={className}
            style={{ fontFamily: 'JetBrains Mono, monospace', ...style }}
            onMouseEnter={handleHover}
        >
            {text}
        </Tag>
    )
}

export default TextScramble

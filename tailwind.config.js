/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#020408',
        'deep': '#050c14',
        'surface': '#0a1628',
        'accent': '#00d4ff',
        'accent2': '#7c3aed',
        'accent3': '#06ffa5',
        'muted': 'rgba(226,232,240,0.35)',
        'bright': '#e2e8f0',
      },
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% -10%, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spinSlow 30s linear infinite',
        'spin-reverse': 'spinReverse 48s linear infinite',
        'ping': 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'orbit': 'orbit 22s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
        pulseGlow: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        spinReverse: { to: { transform: 'rotate(-360deg)' } },
        ping: { '75%,100%': { transform: 'scale(2)', opacity: '0' } },
        orbit: { from: { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' }, to: { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}

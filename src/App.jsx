import React, { useState, useEffect } from 'react'
import './index.css'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'

import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {/* Grain noise overlay — always rendered */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor — hidden on mobile via CSS */}
      <CustomCursor />

      {/* Preloader */}
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Main site — rendered but invisible during preload */}
      <div
        style={{
          visibility: isLoading ? 'hidden' : 'visible',
          transition: 'visibility 0s',
        }}
      >
        <Navbar />
        <main>
          <Hero />

          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App

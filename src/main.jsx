import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initLenis } from './utils/lenis.js'

// Initialize smooth scroll globally before render
initLenis()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

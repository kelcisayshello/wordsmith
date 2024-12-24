import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wordsmith from './Wordsmith.tsx'

// CSS Style Sheets
import './css/wordsmith.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wordsmith />
  </StrictMode>,
)

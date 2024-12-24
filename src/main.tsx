import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wordsmith from './Wordsmith.tsx'

// CSS Style Sheet
import './css/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wordsmith />
  </StrictMode>,
)

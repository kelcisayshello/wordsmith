import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/global.css'
import Wordsmith from './Wordsmith.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wordsmith />
  </StrictMode>,
)

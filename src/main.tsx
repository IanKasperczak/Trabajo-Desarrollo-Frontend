import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ColorModeProvider from './context/ColorModeProvider'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </StrictMode>,
)

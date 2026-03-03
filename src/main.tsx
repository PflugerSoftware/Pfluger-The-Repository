import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProjectsProvider } from './context/ProjectsContext'
import { ErrorBoundary } from './components/System/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </ErrorBoundary>
  </StrictMode>,
)

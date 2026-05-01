import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProjectsProvider } from './context/ProjectsContext'
import { ErrorBoundary } from './components/System/ErrorBoundary'
import { AuthProvider } from './components/System/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)

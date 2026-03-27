import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

import { ThemeProvider } from './components/System/ThemeManager';
import { AuthProvider, useAuth } from './components/System/AuthContext';
import { ProtectedRoute } from './components/Router/ProtectedRoute';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { logPageView } from './services/analytics';
import { resolveProjectIdentifier } from './services/projects';

// Eagerly loaded (small, always needed)
import Home from './views/Home';
import Login from './views/Login';

// Lazy loaded views (only loaded when route is visited)
const TheRepo = lazy(() => import('./views/Repo/TheRepo'));
const Schedule = lazy(() => import('./views/Repo/Schedule'));
const Contacts = lazy(() => import('./views/Repo/Contacts'));
const ResearchMap = lazy(() => import('./views/Campus/ResearchMap'));
const Portfolio = lazy(() => import('./views/Explore/Portfolio'));
const PitchSubmission = lazy(() => import('./views/Pitch/PitchSubmission'));
const Collaborate = lazy(() => import('./views/Contact/Collaborate'));
const AboutRB = lazy(() => import('./views/About/AboutRB'));
const AboutProcess = lazy(() => import('./views/About/AboutProcess'));
const AboutAI = lazy(() => import('./views/About/AboutAI'));
const AboutTools = lazy(() => import('./views/About/AboutTools'));
const AboutSources = lazy(() => import('./views/About/AboutSources'));
const SurveyPage = lazy(() => import('./views/Survey/SurveyPage'));

// Project dashboards (used in overlay route)
import { ProjectDashboard, DynamicProjectDashboard } from './views/projects';
import { showcaseConfig } from './data/projects/X00-block-showcase/project/showcaseConfig';

// Project overlay wrapper component
function ProjectOverlay() {
  const { projectId: identifier } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (!identifier) {
      navigate('/');
      return;
    }
    resolveProjectIdentifier(identifier).then(id => {
      if (id) {
        setResolvedId(id);
      } else {
        navigate('/');
      }
      setResolving(false);
    });
  }, [identifier, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  if (resolving) return null;
  if (!resolvedId) return null;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={handleClose}
        />

        {/* Slide-in panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          <div className="h-full bg-background/80 backdrop-blur-xl overflow-y-auto">
            {resolvedId === 'X00-DEMO' ? (
              <ProjectDashboard config={showcaseConfig} onBack={handleClose} />
            ) : (
              <DynamicProjectDashboard projectId={resolvedId} onBack={handleClose} />
            )}
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Track page views when location changes (user.id comes directly from auth)
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\//g, '-');
      logPageView(user.id, pageName, null);
    }
  }, [location.pathname, isAuthenticated, user?.id]);

  // Lock body scroll when on project overlay routes
  useEffect(() => {
    const isProjectOverlay = location.pathname.startsWith('/explore/') && location.pathname !== '/explore';
    if (isProjectOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname]);

  // Handler for opening projects (navigates to /explore/:projectId)
  const openProject = (projectId: string) => {
    navigate(`/explore/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar onLogoClick={() => navigate('/')} />

      <div className="h-20" />

      <main>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home onOpenProject={openProject} />} />
          <Route path="/campus" element={<ResearchMap onOpenProjectDashboard={openProject} />} />
          <Route path="/explore" element={<Portfolio onOpenProjectDashboard={openProject} />} />
          <Route path="/contact" element={<Collaborate />} />
          <Route path="/login" element={<Login onSuccess={() => navigate('/')} />} />

          {/* About Routes */}
          <Route path="/about" element={<AboutRB />} />
          <Route path="/about/research&benchmarking" element={<AboutRB />} />
          <Route path="/about/process" element={<AboutProcess />} />
          <Route path="/about/tools" element={<ProtectedRoute><AboutTools /></ProtectedRoute>} />
          <Route path="/about/ai" element={<AboutAI />} />
          <Route path="/about/sources" element={<AboutSources />} />

          {/* Internal Routes (Protected) */}
          <Route
            path="/repository"
            element={
              <ProtectedRoute>
                <TheRepo onOpenProject={openProject} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repository/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pitch"
            element={
              <ProtectedRoute>
                <PitchSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pitch/mypitches"
            element={
              <ProtectedRoute>
                <PitchSubmission />
              </ProtectedRoute>
            }
          />

          {/* Project Overlay Route */}
          <Route path="/explore/:projectId" element={<ProjectOverlay />} />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Home onOpenProject={openProject} />} />
        </Routes>
        </Suspense>
      </main>
    </div>
  );
}

/** Routes survey paths to full-screen layout (no navbar), everything else to AppContent */
function AppRoutes() {
  const location = useLocation();

  if (location.pathname.startsWith('/survey/')) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/survey/:slug" element={<SurveyPage />} />
        </Routes>
      </Suspense>
    );
  }

  return <AppContent />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

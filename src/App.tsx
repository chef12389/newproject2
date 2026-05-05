import { Suspense, lazy, type ReactNode, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AISprite from '@/components/AISprite'
import { CommentDrawer } from '@/components/CommentDrawer'
import DynamicBackground from '@/components/DynamicBackground'
import StarField from '@/components/StarField'
import { ToastContainer, ToastProvider } from '@/components/ToastNotification'
import { HOME_ENTRY_DELAY_MS, HOME_ENTRY_SESSION_KEY } from '@/lib/assistant'
import { getCurrentSessionMode, isAuthReady, isAuthenticated, subscribeAuthState } from '@/lib/auth'
import { isEntryProloguePending } from '@/lib/entryPrologue'
import AchievementPage from './pages/AchievementPage'
import ArchitectureDetail from './pages/ArchitectureDetail'
import BooksPage from './pages/BooksPage'
import CommentsHub from './pages/CommentsHub'
import CulturePage from './pages/CulturePage'
import EntryProloguePage from './pages/EntryProloguePage'
import HomePage from './pages/HomePage'
import ScientistsPage from './pages/ScientistsPage'
import TrainingCenterPage from './pages/TrainingCenterPage'

const KnowledgeQuiz = lazy(() => import('./pages/KnowledgeQuiz'))
const Gallery = lazy(() => import('./pages/Gallery'))
const UserCenter = lazy(() => import('./pages/UserCenter'))
const PuzzleGame = lazy(() => import('./pages/PuzzleGame'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

function ScrollToTopOnRouteChange() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  const [assistantUnlocked, setAssistantUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem(HOME_ENTRY_SESSION_KEY) === 'true'
  })

  useEffect(() => {
    if (location.pathname !== '/' || assistantUnlocked) return

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(HOME_ENTRY_SESSION_KEY, 'true')
      setAssistantUnlocked(true)
    }, HOME_ENTRY_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [assistantUnlocked, location.pathname])

  const hideFloatingChrome = location.pathname === '/auth' || location.pathname === '/prologue'

  useEffect(() => {
    if (hideFloatingChrome) {
      document.body.removeAttribute('data-scene-background')
      return
    }

    document.body.setAttribute('data-scene-background', 'dynamic')

    return () => {
      document.body.removeAttribute('data-scene-background')
    }
  }, [hideFloatingChrome])

  return (
    <>
      {!hideFloatingChrome ? <DynamicBackground /> : null}
      {!hideFloatingChrome && location.pathname !== '/' ? <StarField count={18} speed={0.45} /> : null}
      <div className="relative z-10 min-h-screen">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">加载中...</div>}>
          <Routes location={location}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/prologue" element={<RouteGate><EntryProloguePage /></RouteGate>} />
            <Route path="/" element={<RouteGate><HomePage /></RouteGate>} />
            <Route path="/achievement" element={<RouteGate><AchievementPage /></RouteGate>} />
            <Route path="/scientists" element={<RouteGate><ScientistsPage /></RouteGate>} />
            <Route path="/treatises" element={<RouteGate><BooksPage /></RouteGate>} />
            <Route path="/culture" element={<RouteGate><CulturePage /></RouteGate>} />
            <Route path="/architecture/:type" element={<RouteGate><ArchitectureDetail /></RouteGate>} />
            <Route path="/comments" element={<RouteGate><CommentsHub /></RouteGate>} />
            <Route path="/data" element={<Navigate to="/achievement" replace />} />
            <Route path="/digest" element={<Navigate to="/treatises" replace />} />
            <Route path="/knowledge-map" element={<Navigate to="/achievement" replace />} />
            <Route path="/quiz" element={<RouteGate><QuizPage /></RouteGate>} />
            <Route path="/knowledge-quiz" element={<RouteGate><KnowledgeQuiz /></RouteGate>} />
            <Route path="/gallery" element={<RouteGate><Gallery /></RouteGate>} />
            <Route path="/training-center" element={<RouteGate><TrainingCenterPage entryPath="/training-center" /></RouteGate>} />
            <Route path="/user" element={<RouteGate><UserCenter /></RouteGate>} />
            <Route path="/puzzle" element={<RouteGate><PuzzleGame /></RouteGate>} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Suspense>

        {!hideFloatingChrome ? <CommentDrawer /> : null}
        {!hideFloatingChrome && assistantUnlocked ? <AISprite /> : null}
      </div>
    </>
  )
}

function RouteGate({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [, setVersion] = useState(0)

  useEffect(() => {
    const handleAuthUpdated = () => setVersion((value) => value + 1)
    const unsubscribe = subscribeAuthState(() => {
      setVersion((value) => value + 1)
    })

    window.addEventListener('auth-updated', handleAuthUpdated)

    return () => {
      unsubscribe()
      window.removeEventListener('auth-updated', handleAuthUpdated)
    }
  }, [])

  if (!isAuthReady()) {
    return <div className="flex min-h-screen items-center justify-center">加载中...</div>
  }

  const mode = getCurrentSessionMode()

  if (!isAuthenticated() && mode !== 'guest') {
    return <Navigate to="/auth" replace />
  }

  if (location.pathname !== '/prologue' && isEntryProloguePending()) {
    return <Navigate to="/prologue" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <ScrollToTopOnRouteChange />
        <AnimatedRoutes />
        <ToastContainer />
      </HashRouter>
    </ToastProvider>
  )
}

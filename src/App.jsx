import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import styles from './App.module.css'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './components/LandingPage'
import AuthenticatedApp from './components/AuthenticatedApp'
import AuthModal from './components/auth/AuthModal'
import DiagnosticPanel from './components/DiagnosticPanel'
import { FaSignInAlt, FaCode } from 'react-icons/fa'
import { initializeSEO } from './utils/seoHelpers'

function App() {
  const [authMode, setAuthMode] = useState('landing')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')
  const [showDiagnostics, setShowDiagnostics] = useState(false)

  const { user, loading, error, devLogin } = useAuth()

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  // Enhanced error handling for development
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Supabase not configured. Running in demo mode.')
      console.warn('📝 To enable full functionality:')
      console.warn('1. Create a .env file in your project root')
      console.warn('2. Add VITE_SUPABASE_URL=your_supabase_url')
      console.warn('3. Add VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
      console.warn('4. Restart the development server')
    } else {
      console.log('✅ Supabase configuration detected')
    }
  }, [isSupabaseConfigured])

  // Check if this is a password reset callback
  const isPasswordReset = window.location.pathname.includes('reset-password') ||
                          window.location.hash.includes('type=recovery') ||
                          window.location.search.includes('type=recovery')

  // Check if this is a payment success callback
  const isPaymentSuccess = window.location.pathname.includes('payment-success') ||
                           window.location.search.includes('session_id')
  
  // Show diagnostics if there are persistent errors
  useEffect(() => {
    if (error && !user && !loading) {
      setShowDiagnostics(true)
    }
  }, [error, user, loading])
  // Initialize SEO optimizations
  useEffect(() => {
    initializeSEO()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Invoice Direct...</p>
        {error && (
          <div style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>
            <p>Connection issue: {error}</p>
            {!isSupabaseConfigured && (
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Running in demo mode - database not configured
              </p>
            )}
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '0.5rem 1rem', 
                background: '#4f46e5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
            <button 
              onClick={() => setShowDiagnostics(true)} 
              style={{ 
                padding: '0.5rem 1rem', 
                background: '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              Diagnose Issues
            </button>
          </div>
        )}
      </div>
    )
  }

  // Show authenticated app if user is logged in or if it's a payment callback
  if (user || isPaymentSuccess) {
    return (
      <ErrorBoundary>
        <AuthenticatedApp />
      </ErrorBoundary>
    )
  }

  const handleSignIn = () => {
    setAuthModalMode('signin')
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthModalMode('signup')
    setShowAuthModal(true)
  }

  // Show diagnostics panel if requested
  if (showDiagnostics) {
    return (
      <ErrorBoundary>
        <div className={styles.container}>
          <DiagnosticPanel />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => setShowDiagnostics(false)}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: '#4f46e5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Back to App
            </button>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
  // Show landing page with auth buttons
  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.landingHeader}>
          <div className={styles.headerContent}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ff05c99624a914652bdf806facc6f1fbd%2Fe01427c877184c61b1b4ab7c48ef7eb1"
              alt="invoice.direct"
              className={styles.logo}
            />
            <div className={styles.headerActions}>
              <div className={styles.authButtons}>
                {!isSupabaseConfigured && (
                  <button
                    onClick={devLogin}
                    className={styles.devButton}
                    title="Development mode - click to continue without database"
                  >
                    <FaCode />
                    Continue (Dev Mode)
                  </button>
                )}
                <button
                  onClick={handleSignIn}
                  className={styles.signInButton}
                >
                  <FaSignInAlt />
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className={styles.signUpButton}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowDiagnostics(true)}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  🔍 Diagnose
                </button>
              </div>
            </div>
          </div>
        </header>
        <LandingPage
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
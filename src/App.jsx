import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import styles from './App.module.css'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './components/LandingPage'
import AuthenticatedApp from './components/AuthenticatedApp'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import PasswordResetPage from './components/auth/PasswordResetPage'
import PasswordResetHandler from './components/auth/PasswordResetHandler'
import CheckoutSuccessPage from './components/CheckoutSuccessPage'
import { FaSignInAlt, FaCode } from 'react-icons/fa'
import { initializeSEO } from './utils/seoHelpers'

function App() {
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup' | 'reset'>('landing')

  const { user, loading, error, devLogin } = useAuth()

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  // Check if this is a password reset callback
  const isPasswordReset = window.location.pathname.includes('reset-password') ||
                          window.location.hash.includes('type=recovery') ||
                          window.location.search.includes('type=recovery')

  // Check if this is a checkout success page
  const isCheckoutSuccess = window.location.pathname.includes('/checkout/success')

  // Initialize SEO optimizations
  useEffect(() => {
    initializeSEO()
  }, [])

  // Show password reset handler if it's a password reset callback
  if (isPasswordReset) {
    return (
      <ErrorBoundary>
        <PasswordResetHandler />
      </ErrorBoundary>
    )
  }

  // Show checkout success page
  if (isCheckoutSuccess) {
    return (
      <ErrorBoundary>
        <CheckoutSuccessPage />
      </ErrorBoundary>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Invoice Direct...</p>
        {error && (
          <div style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>
            <p>Connection issue: {error}</p>
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
          </div>
        )}
      </div>
    )
  }

  // Show authenticated app if user is logged in
  if (user) {
    return (
      <ErrorBoundary>
        <AuthenticatedApp />
      </ErrorBoundary>
    )
  }

  // Show auth pages for non-authenticated users
  if (authMode === 'login') {
    return (
      <ErrorBoundary>
        <LoginPage
          onSwitchToSignup={() => setAuthMode('signup')}
          onSwitchToReset={() => setAuthMode('reset')}
        />
      </ErrorBoundary>
    )
  }

  if (authMode === 'signup') {
    return (
      <ErrorBoundary>
        <SignupPage
          onSwitchToLogin={() => setAuthMode('login')}
        />
      </ErrorBoundary>
    )
  }

  if (authMode === 'reset') {
    return (
      <ErrorBoundary>
        <PasswordResetPage
          onSwitchToLogin={() => setAuthMode('login')}
        />
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
                  onClick={() => setAuthMode('login')}
                  className={styles.signInButton}
                >
                  <FaSignInAlt />
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={styles.signUpButton}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </header>
        <LandingPage
          onSignUp={() => setAuthMode('signup')}
          onSignIn={() => setAuthMode('login')}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
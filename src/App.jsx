import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import styles from './App.module.css'
import ErrorBoundary from './components/ErrorBoundary'
import AuthModal from './components/auth/AuthModal'
import LandingPage from './components/LandingPage'
import AuthenticatedApp from './components/AuthenticatedApp'
import PasswordResetHandler from './components/auth/PasswordResetHandler'
import { FaSignInAlt } from 'react-icons/fa'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  const { user, loading, error } = useAuth()

  // Check if this is a password reset callback
  const isPasswordReset = window.location.hash.includes('type=recovery') || 
                          window.location.pathname.includes('reset-password')

  const handleAuthClick = (mode = 'signin') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  // Show password reset handler if it's a password reset callback
  if (isPasswordReset) {
    return (
      <ErrorBoundary>
        <PasswordResetHandler />
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

  // Always show homepage for non-authenticated users
  // Only show authenticated app if user is logged in
  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {!user ? (
          <>
            <header className={styles.landingHeader}>
              <div className={styles.headerContent}>
                <h1>Invoice Direct</h1>
                <div className={styles.headerActions}>
                  <div className={styles.authButtons}>
                    <button
                      onClick={() => handleAuthClick('signin')}
                      className={styles.signInButton}
                    >
                      <FaSignInAlt />
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className={styles.signUpButton}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <LandingPage
              onSignUp={() => handleAuthClick('signup')}
              onSignIn={() => handleAuthClick('signin')}
            />
          </>
        ) : (
          <AuthenticatedApp />
        )}

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authMode}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App

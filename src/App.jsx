import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import styles from './App.module.css'
import ErrorBoundary from './components/ErrorBoundary'
import AuthModal from './components/auth/AuthModal'
import LandingPage from './components/LandingPage'
import AuthenticatedApp from './components/AuthenticatedApp'
import ThemeToggle from './components/ThemeToggle'
import { FaSignInAlt } from 'react-icons/fa'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  const { user, loading } = useAuth()

  const handleAuthClick = (mode = 'signin') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {!user ? (
          <>
            <header className={styles.landingHeader}>
              <div className={styles.headerContent}>
                <h1>Invoice Direct</h1>
                <div className={styles.headerActions}>
                  <ThemeToggle />
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

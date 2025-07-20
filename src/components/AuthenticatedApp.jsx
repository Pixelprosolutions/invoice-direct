import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthenticatedApp.module.css'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'
import InvoiceHistory from './InvoiceHistory'
import Modal from './Modal'
import UserDashboard from './UserDashboard'
import { FaUser, FaHome, FaFileInvoice, FaHistory, FaSignOutAlt } from 'react-icons/fa'

const AuthenticatedApp = () => {
  const [activeView, setActiveView] = useState('home')
  const [showPreview, setShowPreview] = useState(false)
  const [showUserDashboard, setShowUserDashboard] = useState(false)
  const { user, canCreateInvoice, getRemainingInvoices, signOut } = useAuth()

  const handleCreateInvoice = () => {
    if (!canCreateInvoice()) {
      setShowUserDashboard(true)
      return
    }
    
    setActiveView('create')
  }

  const handlePreviewInvoice = () => {
    if (!canCreateInvoice()) {
      setShowUserDashboard(true)
      return
    }
    
    setShowPreview(true)
  }

  const handleSignOut = async () => {
    try {
      signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      // Force reload as fallback
      window.location.reload()
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <section className={styles.formSection}>
            <InvoiceForm onPreview={handlePreviewInvoice} />
          </section>
        )
      case 'history':
        return <InvoiceHistory setActiveView={setActiveView} />
      default:
        return (
          <div className={styles.homeContent}>
            <div className={styles.welcomeSection}>
              <h2>Welcome back!</h2>
              <p>Create professional invoices for your business</p>
              {canCreateInvoice() && (
                <div className={styles.remainingInvoices}>
                  {getRemainingInvoices() === Infinity ? (
                    <span className={styles.premium}>Premium Account - Unlimited Invoices</span>
                  ) : (
                    <span>
                      {getRemainingInvoices()} free invoice{getRemainingInvoices() !== 1 ? 's' : ''} remaining
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.quickActions}>
              <div className={styles.actionCard} onClick={handleCreateInvoice}>
                <div className={styles.actionIcon}>
                  <FaFileInvoice />
                </div>
                <h3>Create New Invoice</h3>
                <p>Generate a professional invoice in seconds</p>
              </div>
              
              <div className={styles.actionCard} onClick={() => setActiveView('history')}>
                <div className={styles.actionIcon}>
                  <FaHistory />
                </div>
                <h3>Invoice History</h3>
                <p>View and manage your past invoices</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.authenticatedApp}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 onClick={() => setActiveView('home')} className={styles.logo}>Invoice Direct</h1>
          <nav className={styles.navigation}>
            <button 
              className={`${styles.navButton} ${activeView === 'home' ? styles.active : ''}`}
              onClick={() => setActiveView('home')}
            >
              <FaHome /> Home
            </button>
            <button 
              className={`${styles.navButton} ${activeView === 'create' ? styles.active : ''}`}
              onClick={handleCreateInvoice}
            >
              <FaFileInvoice /> Create
            </button>
            <button 
              className={`${styles.navButton} ${activeView === 'history' ? styles.active : ''}`}
              onClick={() => setActiveView('history')}
            >
              <FaHistory /> History
            </button>
          </nav>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowUserDashboard(true)}
            className={styles.userButton}
            title="User Dashboard"
          >
            <FaUser />
            <span className={styles.userEmail}>{user.email}</span>
          </button>
          <button
            onClick={handleSignOut}
            className={styles.logoutButton}
            title="Sign Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {!canCreateInvoice() && (
        <div className={styles.limitBanner}>
          <p>
            You've reached your free invoice limit.
            <button
              onClick={() => setShowUserDashboard(true)}
              className={styles.upgradeLink}
            >
              Upgrade to Premium - $10 Lifetime
            </button>
          </p>
        </div>
      )}

      <main className={styles.main}>
        {renderContent()}
      </main>

      {showPreview && (
        <Modal onClose={() => setShowPreview(false)}>
          <InvoicePreview />
        </Modal>
      )}

      {showUserDashboard && (
        <Modal onClose={() => setShowUserDashboard(false)}>
          <UserDashboard onClose={() => setShowUserDashboard(false)} />
        </Modal>
      )}
    </div>
  )
}

export default AuthenticatedApp

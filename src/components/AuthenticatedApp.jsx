import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthenticatedApp.module.css'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'
import ThemeToggle from './ThemeToggle'
import Modal from './Modal'
import UserDashboard from './UserDashboard'
import { FaUser } from 'react-icons/fa'

const AuthenticatedApp = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [showUserDashboard, setShowUserDashboard] = useState(false)
  const { user, canCreateInvoice, getRemainingInvoices } = useAuth()

  const handleCreateInvoice = () => {
    if (!canCreateInvoice()) {
      setShowUserDashboard(true)
      return
    }
    
    setShowPreview(true)
  }

  return (
    <div className={styles.authenticatedApp}>
      <header className={styles.header}>
        <h1>Invoice Direct</h1>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <button
            onClick={() => setShowUserDashboard(true)}
            className={styles.userButton}
            title="User Dashboard"
          >
            <FaUser />
            <span className={styles.userEmail}>{user.email}</span>
          </button>
        </div>
      </header>

      {!canCreateInvoice() && (
        <div className={styles.limitBanner}>
          <p>
            You've used all {getRemainingInvoices() === 0 ? '3' : ''} free invoices.
            <button
              onClick={() => setShowUserDashboard(true)}
              className={styles.upgradeLink}
            >
              Upgrade to Premium for $10 lifetime
            </button>
          </p>
        </div>
      )}

      <main className={styles.main}>
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

        <section className={styles.formSection}>
          <InvoiceForm onPreview={handleCreateInvoice} />
        </section>
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

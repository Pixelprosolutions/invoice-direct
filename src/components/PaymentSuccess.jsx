import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaCheckCircle, FaCrown, FaRocket } from 'react-icons/fa'
import { toast } from 'react-toastify'
import styles from './PaymentSuccess.module.css'

const PaymentSuccess = ({ onContinue }) => {
  const { user, userProfile, refreshProfile } = useAuth()

  useEffect(() => {
    // Refresh user profile when component mounts
    refreshProfile()
    
    // Show success message
    toast.success('🎉 Payment successful! Welcome to Premium!')
  }, [refreshProfile])

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      // Redirect to dashboard or home
      window.location.href = '/'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>
        
        <h1>Payment Successful! 🎉</h1>
        
        <div className={styles.welcomeMessage}>
          <h2>
            <FaCrown className={styles.crownIcon} />
            Welcome to Invoice Direct Premium!
          </h2>
          <p>Your account has been upgraded and all premium features are now active.</p>
        </div>

        <div className={styles.features}>
          <h3>What's unlocked for you:</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Unlimited invoices forever</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>All watermarks removed</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Complete invoice history</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Advanced custom branding</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Payment tracking & reminders</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Revenue analytics & reports</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Priority email support</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Multiple template designs</span>
            </div>
          </div>
        </div>

        <div className={styles.userInfo}>
          <h4>Account Details:</h4>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Plan:</strong> Premium (Lifetime)</p>
          <p><strong>Payment Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> {userProfile?.transactionId || 'demo_' + Date.now()}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={handleContinue} className={styles.continueButton}>
            <FaRocket />
            Start Creating Premium Invoices
          </button>
        </div>

        <div className={styles.support}>
          <p>
            Questions about your upgrade? Contact us at{' '}
            <a href="mailto:support@invoicedirect.app">support@invoicedirect.app</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

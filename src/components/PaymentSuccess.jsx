import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaCheckCircle, FaCrown, FaRocket } from 'react-icons/fa'
import { toast } from 'react-toastify'
import styles from './PaymentSuccess.module.css'

const PaymentSuccess = ({ onContinue }) => {
  const { user, userProfile, refreshProfile, isPremium } = useAuth()

  useEffect(() => {
    // Check URL parameters for payment success
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    
    if (sessionId) {
      // Payment was successful, update user profile
      const updateUserToPremium = async () => {
        try {
          const userProfile = {
            id: user?.id || 'demo_user',
            email: user?.email || 'user@example.com',
            plan: 'premium',
            invoice_count: 0,
            created_at: new Date().toISOString(),
            upgraded_at: new Date().toISOString(),
            payment_method: 'stripe',
            transaction_id: sessionId
          }
          
          localStorage.setItem('userProfile', JSON.stringify(userProfile))
          await refreshProfile()
          
          toast.success('🎉 Payment confirmed! Premium features activated!')
        } catch (error) {
          console.error('Error updating user profile:', error)
          toast.error('Payment confirmed but there was an issue updating your account. Please contact support.')
        }
      }
      
      updateUserToPremium()
    }
    
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
          <p><strong>Plan:</strong> {isPremium() ? 'Premium (Lifetime)' : 'Free'}</p>
          <p><strong>Payment Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> {userProfile?.transaction_id || new URLSearchParams(window.location.search).get('session_id') || 'demo_' + Date.now()}</p>
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

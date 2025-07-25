import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe, STRIPE_CONFIG, simulatePayment, formatPrice } from '../lib/stripe'
import { useAuth } from '../context/AuthContext'
import { triggerPaymentSuccess } from './PaymentWebhookHandler'
import { FaLock, FaCheckCircle, FaSpinner, FaCreditCard, FaShieldAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import styles from './StripeCheckout.module.css'

const StripeCheckout = ({ onSuccess, onCancel, isOpen }) => {
  const { user, refreshProfile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleDemoPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      toast.info('Processing payment... This is a demo transaction.')
      
      const result = await simulatePayment(user.email, user.id)
      
      if (result.success) {
        setPaymentSuccess(true)
        toast.success('🎉 Payment successful! Welcome to Premium!')

        // Trigger webhook simulation
        triggerPaymentSuccess(result.sessionId, user.email)

        setTimeout(() => {
          onSuccess(result)
        }, 2000)
      }
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRealStripePayment = async () => {
    setIsProcessing(true)
    
    try {
      const stripe = await getStripe()
      
      // In a real implementation, you would call your backend to create a checkout session
      // const session = await createCheckoutSession(STRIPE_CONFIG.products.premium.priceId, user.email, user.id)
      
      // For now, we'll use the demo payment
      toast.info('Stripe integration ready! Using demo payment for now.')
      handleDemoPayment()
      
    } catch (error) {
      console.error('Stripe checkout failed:', error)
      toast.error('Payment system error. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  if (paymentSuccess) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <FaCheckCircle />
            </div>
            <h2>Payment Successful! 🎉</h2>
            <p>Welcome to Invoice Direct Premium!</p>
            <div className={styles.successFeatures}>
              <div className={styles.feature}>
                <FaCheckCircle />
                <span>Unlimited invoices activated</span>
              </div>
              <div className={styles.feature}>
                <FaCheckCircle />
                <span>All premium features unlocked</span>
              </div>
              <div className={styles.feature}>
                <FaCheckCircle />
                <span>Lifetime access confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Upgrade to Premium</h2>
          <button onClick={onCancel} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <h3>Invoice Direct Premium</h3>
              <div className={styles.price}>
                <span className={styles.amount}>$10</span>
                <span className={styles.period}>lifetime</span>
              </div>
            </div>
            
            <div className={styles.savings}>
              <span className={styles.savingsLabel}>💰 Save $39/year</span>
              <span className={styles.originalPrice}>Regular price: $49/year</span>
            </div>

            <div className={styles.features}>
              <h4>What you'll get:</h4>
              <ul>
                <li><FaCheckCircle /> Unlimited invoices forever</li>
                <li><FaCheckCircle /> Remove all watermarks</li>
                <li><FaCheckCircle /> Complete invoice history</li>
                <li><FaCheckCircle /> Advanced custom branding</li>
                <li><FaCheckCircle /> Payment tracking & reminders</li>
                <li><FaCheckCircle /> Revenue analytics & reports</li>
                <li><FaCheckCircle /> Priority email support</li>
                <li><FaCheckCircle /> Multiple template designs</li>
              </ul>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <div className={styles.securityBadges}>
              <div className={styles.securityBadge}>
                <FaLock />
                <span>256-bit SSL Encryption</span>
              </div>

            </div>

            <button 
              onClick={handleRealStripePayment}
              disabled={isProcessing}
              className={styles.paymentButton}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay {formatPrice(STRIPE_CONFIG.products.premium.price)} - Lifetime Access
                </>
              )}
            </button>

            <div className={styles.demoNotice}>
              <p>
                <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                Your account will be upgraded to Premium for testing purposes.
              </p>
            </div>

            <div className={styles.trust}>
              <p>✅ Instant access • ✅ No monthly fees • ✅ Cancel anytime</p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Questions? Contact support at <a href="mailto:support@invoicedirect.app">support@invoicedirect.app</a></p>
        </div>
      </div>
    </div>
  )
}

// Wrapper component with Stripe Elements provider
const StripeCheckoutWrapper = (props) => {
  return (
    <Elements stripe={getStripe()}>
      <StripeCheckout {...props} />
    </Elements>
  )
}

export default StripeCheckoutWrapper

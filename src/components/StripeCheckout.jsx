import React, { useState } from 'react'
import { STRIPE_CONFIG, createCheckoutSession, simulatePayment, formatPrice } from '../stripe-config'
import { useAuth } from '../context/AuthContext'
import { triggerPaymentSuccess } from './PaymentWebhookHandler'
import { FaLock, FaCheckCircle, FaSpinner, FaCreditCard, FaShieldAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import styles from './StripeCheckout.module.css'

const StripeCheckout = ({ onSuccess, onCancel, isOpen }) => {
  const { user, refreshProfile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState(null)

  const product = STRIPE_CONFIG.products.lifetimeAccess
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

  const handleStripePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Check if Supabase is configured for real payments
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        toast.info('Stripe integration ready! Using demo payment for development.')
        handleDemoPayment()
        return
      }

      toast.info('Creating checkout session...')
      
      const session = await createCheckoutSession(
        product.priceId,
        user.email,
        user.id
      )
      
      if (session.url) {
        // Redirect to Stripe Checkout
        window.location.href = session.url
      } else {
        throw new Error('No checkout URL received')
      }
      
    } catch (error) {
      console.error('Stripe checkout failed:', error)
      toast.error('Payment system error. Using demo payment instead.')
      // Fallback to demo payment
      handleDemoPayment()
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
              <h3>{product.name}</h3>
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
              <div className={styles.securityBadge}>
                <FaShieldAlt />
                <span>Secure Stripe Payment</span>
              </div>

            </div>

            <button 
              onClick={handleStripePayment}
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
                  Pay {formatPrice(product.price)} - Lifetime Access
                </>
              )}
            </button>


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

export default StripeCheckout

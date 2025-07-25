import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

// Component to handle payment webhook simulation
const PaymentWebhookHandler = () => {
  const { user, refreshProfile } = useAuth()

  useEffect(() => {
    // Listen for payment completion events (in demo mode)
    const handlePaymentComplete = (event) => {
      if (event.detail && event.detail.type === 'payment_success') {
        console.log('🔔 Payment webhook received:', event.detail)
        
        // Update user profile to premium
        const updateUserToPremium = async () => {
          try {
            // In demo mode, update localStorage
            const userProfile = {
              id: user?.id || 'demo_user',
              email: user?.email || event.detail.email,
              plan: 'premium',
              invoice_count: 0,
              created_at: new Date().toISOString(),
              upgraded_at: new Date().toISOString(),
              payment_method: 'stripe',
              transaction_id: event.detail.sessionId || 'demo_transaction_' + Date.now()
            }
            
            localStorage.setItem('userProfile', JSON.stringify(userProfile))
            
            // Refresh the auth context
            await refreshProfile()
            
            // Show success notification
            toast.success('🎉 Payment confirmed! Premium features activated!')
            
          } catch (error) {
            console.error('Error updating user profile:', error)
            toast.error('Payment confirmed but there was an issue updating your account. Please contact support.')
          }
        }
        
        updateUserToPremium()
      }
    }

    // Add event listener for custom payment events
    window.addEventListener('paymentComplete', handlePaymentComplete)
    
    // Cleanup
    return () => {
      window.removeEventListener('paymentComplete', handlePaymentComplete)
    }
  }, [user, refreshProfile])

  // This component doesn't render anything
  return null
}

// Utility function to trigger payment completion (for demo)
export const triggerPaymentSuccess = (sessionId, email) => {
  const event = new CustomEvent('paymentComplete', {
    detail: {
      type: 'payment_success',
      sessionId: sessionId,
      email: email,
      timestamp: new Date().toISOString()
    }
  })
  
  window.dispatchEvent(event)
}

export default PaymentWebhookHandler

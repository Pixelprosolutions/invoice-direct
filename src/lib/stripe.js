import { loadStripe } from '@stripe/stripe-js'

// Load Stripe publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51H1234567890_test_1234567890'

// Initialize Stripe
let stripePromise = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  products: {
    premium: {
      name: 'Invoice Direct Premium',
      description: 'Lifetime access with unlimited invoices and premium features',
      price: 1000, // $10.00 in cents
      priceId: 'price_1234567890', // This would be your actual Stripe price ID
    }
  }
}

// Create checkout session
export const createCheckoutSession = async (priceId, customerEmail, userId) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail,
        userId,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// For development/demo mode - simulate successful payment
export const simulatePayment = async (userEmail, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        sessionId: 'demo_session_' + Date.now(),
        customer: {
          email: userEmail,
          id: 'demo_customer_' + Date.now()
        }
      })
    }, 2000) // Simulate 2-second processing time
  })
}

// Validate payment completion
export const validatePayment = async (sessionId) => {
  try {
    const response = await fetch(`/api/validate-payment/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to validate payment')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error validating payment:', error)
    throw error
  }
}

// Format price for display
export const formatPrice = (amountInCents, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
}

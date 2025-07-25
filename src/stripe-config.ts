export const STRIPE_CONFIG = {
  currency: 'usd',
  products: {
    premium: {
      name: 'Invoice Direct Premium',
      description: 'Lifetime access with unlimited invoices and premium features',
      price: 1000, // $10.00 in cents
      priceId: 'price_1234567890', // TODO: Replace with your actual Stripe Price ID from Step 1.3
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

// Format price for display
export const formatPrice = (amountInCents, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
}
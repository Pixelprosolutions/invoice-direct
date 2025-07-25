export const STRIPE_CONFIG = {
  currency: 'usd',
  products: {
    lifetimeAccess: {
      id: 'prod_SkOfQw8tQa6xIf',
      name: 'Lifetime Access',
      description: 'One-time payment for unlimited invoices and premium features forever',
      price: 1000, // $10.00 in cents
      priceId: 'price_1Rots22OqqTomYvmdgVZW4H0',
      mode: 'payment'
    }
  }
}

// Create checkout session
export const createCheckoutSession = async (priceId, customerEmail, userId, userToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/`,
        mode: 'payment'
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
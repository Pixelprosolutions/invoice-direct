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
    // Validate inputs
    if (!priceId || !customerEmail || !userId || !userToken) {
      throw new Error('Missing required parameters for checkout session')
    }
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    console.log('🔄 Creating checkout session with Supabase Edge Function...')
    
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
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Checkout session error:', response.status, errorText)
      
      if (response.status === 401) {
        throw new Error('Authentication failed - please sign in again')
      } else if (response.status === 403) {
        throw new Error('Access denied - please check your account permissions')
      } else if (response.status >= 500) {
        throw new Error('Payment service temporarily unavailable')
      } else {
        throw new Error(`Payment setup failed (${response.status})`)
      }
    }

    const session = await response.json()
    console.log('✅ Checkout session created successfully')
    return session
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - payment service not responding')
    }
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection')
    }
    
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
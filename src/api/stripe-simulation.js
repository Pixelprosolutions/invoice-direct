// Stripe API simulation for development/demo purposes
// In production, this would be handled by your backend server

export const simulateStripeAPI = {
  // Simulate creating a checkout session
  createCheckoutSession: async (params) => {
    console.log('🔄 Simulating Stripe checkout session creation...', params)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessionId = 'cs_demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        
        resolve({
          id: sessionId,
          url: `https://checkout.stripe.com/pay/${sessionId}`,
          payment_status: 'unpaid',
          customer_email: params.customerEmail,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Invoice Direct Premium',
                  description: 'Lifetime access with unlimited invoices'
                },
                unit_amount: 1000, // $10.00
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          metadata: {
            userId: params.userId,
            plan: 'premium'
          }
        })
      }, 1500) // Simulate network delay
    })
  },

  // Simulate webhook events
  simulateWebhook: async (sessionId, eventType = 'checkout.session.completed') => {
    console.log('🔄 Simulating Stripe webhook...', { sessionId, eventType })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'evt_demo_' + Date.now(),
          type: eventType,
          data: {
            object: {
              id: sessionId,
              payment_status: 'paid',
              customer_email: 'user@example.com',
              amount_total: 1000,
              currency: 'usd',
              metadata: {
                userId: 'demo_user',
                plan: 'premium'
              }
            }
          },
          created: Math.floor(Date.now() / 1000)
        })
      }, 1000)
    })
  },

  // Simulate retrieving a session
  retrieveSession: async (sessionId) => {
    console.log('🔄 Simulating Stripe session retrieval...', sessionId)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: sessionId,
          payment_status: 'paid',
          customer_email: 'user@example.com',
          amount_total: 1000,
          currency: 'usd',
          created: Math.floor(Date.now() / 1000),
          metadata: {
            userId: 'demo_user',
            plan: 'premium'
          }
        })
      }, 800)
    })
  },

  // Simulate customer creation
  createCustomer: async (email) => {
    console.log('🔄 Simulating Stripe customer creation...', email)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'cus_demo_' + Date.now(),
          email: email,
          created: Math.floor(Date.now() / 1000)
        })
      }, 600)
    })
  }
}

// Mock API endpoints for frontend consumption
export const mockStripeEndpoints = {
  '/api/create-checkout-session': async (body) => {
    const session = await simulateStripeAPI.createCheckoutSession(body)
    return {
      id: session.id,
      url: session.url
    }
  },

  '/api/validate-payment': async (sessionId) => {
    const session = await simulateStripeAPI.retrieveSession(sessionId)
    return {
      success: session.payment_status === 'paid',
      session: session
    }
  },

  '/api/webhook': async (event) => {
    // Handle webhook events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      // In a real app, you would update the user's subscription in your database
      console.log('💳 Payment completed for user:', session.metadata.userId)
      
      return { received: true }
    }
    
    return { received: false }
  }
}

// Error simulation for testing
export const simulateStripeErrors = {
  cardDeclined: () => ({
    type: 'StripeCardError',
    code: 'card_declined',
    message: 'Your card was declined.',
    decline_code: 'generic_decline'
  }),

  insufficientFunds: () => ({
    type: 'StripeCardError', 
    code: 'card_declined',
    message: 'Your card has insufficient funds.',
    decline_code: 'insufficient_funds'
  }),

  expiredCard: () => ({
    type: 'StripeCardError',
    code: 'expired_card', 
    message: 'Your card has expired.'
  }),

  networkError: () => ({
    type: 'StripeConnectionError',
    message: 'Network communication error. Please check your internet connection and try again.'
  })
}

# Phase 3: Stripe Payment Integration

## Goal: Enable $10 Lifetime Premium Upgrades

### Current Status: ✅ Demo Mode Working
Your app already has a working demo payment system. Now we'll connect it to real Stripe payments.

## Step 1: Stripe Account Setup (15 minutes)

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (can start in test mode)
3. Note your account ID for reference

### 1.2 Get API Keys
1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)
4. **Keep Secret Key secure** - never put in frontend code

### 1.3 Create Product & Price
1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. **Product Details:**
   - Name: `Invoice Direct Premium`
   - Description: `Lifetime access with unlimited invoices and premium features`
4. **Pricing:**
   - Price: `$10.00`
   - Billing: `One time`
   - Currency: `USD`
5. **Save and copy the Price ID** (starts with `price_`)

## Step 2: Environment Configuration

Add to your `.env` file:
```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Note:** Secret key goes in Supabase Edge Functions (Step 3)

## Step 3: Supabase Edge Functions Setup

### 3.1 Create Stripe Checkout Function
The function `supabase/functions/stripe-checkout/index.ts` is already created and ready.

### 3.2 Create Stripe Webhook Function  
The function `supabase/functions/stripe-webhook/index.ts` is already created and ready.

### 3.3 Deploy Functions to Supabase
```bash
# These deploy automatically when connected to Supabase
# No manual deployment needed!
```

### 3.4 Set Environment Variables in Supabase
1. Go to Supabase Dashboard → Edge Functions → Settings
2. Add these environment variables:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Step 4: Webhook Configuration

### 4.1 Create Webhook Endpoint in Stripe
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://hlaqgqerwmegiyhzitse.supabase.co/functions/v1/stripe-webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. **Save and copy the Signing Secret** (starts with `whsec_`)

## Step 5: Update Frontend Configuration

Update your Stripe configuration with real values:

```javascript
// In src/stripe-config.ts
export const STRIPE_CONFIG = {
  currency: 'usd',
  products: {
    premium: {
      name: 'Invoice Direct Premium',
      description: 'Lifetime access with unlimited invoices and premium features',
      price: 1000, // $10.00 in cents
      priceId: 'price_your_actual_price_id_here', // Replace with real Price ID
    }
  }
}
```

## Step 6: Testing

### 6.1 Test Mode
- Use Stripe test cards: `4242 4242 4242 4242`
- Test the complete payment flow
- Verify user upgrades to premium

### 6.2 Test Cards for Different Scenarios
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **Insufficient Funds:** `4000 0000 0000 9995`

## Step 7: Go Live

### 7.1 Activate Stripe Account
1. Complete Stripe account verification
2. Switch to live mode in Stripe Dashboard
3. Get live API keys (start with `pk_live_` and `sk_live_`)

### 7.2 Update Environment Variables
Replace test keys with live keys in:
- `.env` file (publishable key)
- Supabase Edge Functions settings (secret key)
- Webhook endpoint (update URL if needed)

## Security Checklist ✅

- [ ] Secret keys never in frontend code
- [ ] Webhook signature verification enabled
- [ ] HTTPS only for all endpoints
- [ ] Environment variables properly secured
- [ ] Test mode thoroughly before going live

## Expected Results

After setup:
1. **Demo payment button** becomes **real Stripe checkout**
2. **$10 payments** process through Stripe
3. **Users automatically upgrade** to premium
4. **Webhook handles** payment confirmation
5. **Premium features unlock** immediately

## Troubleshooting

### Common Issues:
- **"Invalid API key"**: Check publishable key in `.env`
- **"No such price"**: Verify Price ID in stripe-config.ts
- **"Webhook failed"**: Check webhook URL and signing secret
- **"Payment not upgrading user"**: Check webhook event handling

### Support Resources:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Test Cards](https://stripe.com/docs/testing)

---

**Ready to start?** Begin with Step 1 (Stripe Account Setup) and work through each step systematically.

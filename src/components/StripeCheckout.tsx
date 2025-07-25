import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { STRIPE_CONFIG, type ProductId } from '../stripe-config';
import { FaSpinner, FaCreditCard, FaShieldAlt, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './StripeCheckout.module.css';

interface StripeCheckoutProps {
  productId: ProductId;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const product = STRIPE_CONFIG.products[productId];

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.productInfo}>
        <h2>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.price}>
          <span className={styles.amount}>{formatPrice(product.price)}</span>
          {product.mode === 'payment' && (
            <span className={styles.period}>one-time</span>
          )}
        </div>
      </div>

      <div className={styles.securityBadges}>
        <div className={styles.securityBadge}>
          <FaLock />
          <span>Secure Payment</span>
        </div>
        <div className={styles.securityBadge}>
          <FaShieldAlt />
          <span>SSL Protected</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={styles.checkoutButton}
      >
        {isLoading ? (
          <>
            <FaSpinner className={styles.spinner} />
            Processing...
          </>
        ) : (
          <>
            <FaCreditCard />
            Purchase {product.name}
          </>
        )}
      </button>

      {onCancel && (
        <button
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default StripeCheckout;
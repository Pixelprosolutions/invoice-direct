import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FaCrown, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import styles from './SubscriptionStatus.module.css';

interface SubscriptionData {
  subscription_status: string;
  price_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          setError('Failed to load subscription data');
        } else {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Active', color: '#10b981', icon: <FaCrown /> };
      case 'trialing':
        return { text: 'Trial', color: '#3b82f6', icon: <FaCrown /> };
      case 'past_due':
        return { text: 'Past Due', color: '#f59e0b', icon: <FaExclamationTriangle /> };
      case 'canceled':
        return { text: 'Canceled', color: '#ef4444', icon: <FaExclamationTriangle /> };
      case 'incomplete':
        return { text: 'Incomplete', color: '#f59e0b', icon: <FaExclamationTriangle /> };
      case 'not_started':
        return { text: 'Free Plan', color: '#6b7280', icon: null };
      default:
        return { text: status, color: '#6b7280', icon: null };
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <FaSpinner className={styles.spinner} />
        <span>Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <span>{error}</span>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className={styles.container}>
        <span className={styles.freePlan}>Free Plan</span>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(subscription.subscription_status);

  return (
    <div className={styles.container}>
      <div 
        className={styles.statusBadge}
        style={{ color: statusDisplay.color }}
      >
        {statusDisplay.icon}
        <span>{statusDisplay.text}</span>
      </div>
      
      {subscription.current_period_end && (
        <div className={styles.periodInfo}>
          <span className={styles.periodText}>
            {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
            {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
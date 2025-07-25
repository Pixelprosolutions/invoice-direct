import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaCrown, FaRocket, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './CheckoutSuccessPage.module.css';

const CheckoutSuccessPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh user profile to get updated subscription status
        if (refreshProfile) {
          await refreshProfile();
        }
        
        toast.success('🎉 Payment successful! Welcome to Lifetime Access!');
      } catch (error) {
        console.error('Error refreshing profile:', error);
        toast.warning('Payment successful, but there was an issue updating your account. Please contact support if needed.');
      } finally {
        setIsLoading(false);
      }
    };

    handleSuccess();
  }, [refreshProfile]);

  const handleContinue = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loadingIcon}>
            <FaSpinner className={styles.spinner} />
          </div>
          <h1>Processing your payment...</h1>
          <p>Please wait while we confirm your purchase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>
        
        <h1>Payment Successful! 🎉</h1>
        
        <div className={styles.welcomeMessage}>
          <h2>
            <FaCrown className={styles.crownIcon} />
            Welcome to Lifetime Access!
          </h2>
          <p>Your payment has been processed and you now have lifetime access to all features.</p>
        </div>

        <div className={styles.features}>
          <h3>What you now have access to:</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Unlimited invoice creation</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>All premium templates</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Advanced customization</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Priority support</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>No watermarks</span>
            </div>
            <div className={styles.feature}>
              <FaCheckCircle />
              <span>Export & analytics</span>
            </div>
          </div>
        </div>

        <div className={styles.userInfo}>
          <h4>Purchase Details:</h4>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Plan:</strong> Lifetime Access</p>
          <p><strong>Purchase Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={handleContinue} className={styles.continueButton}>
            <FaRocket />
            Start Using Your Lifetime Access
          </button>
        </div>

        <div className={styles.support}>
          <p>
            Questions about your purchase? Contact us at{' '}
            <a href="mailto:support@invoicedirect.app">support@invoicedirect.app</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
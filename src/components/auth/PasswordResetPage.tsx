import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner, FaShieldAlt, FaEnvelope, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './AuthPage.module.css';

interface PasswordResetPageProps {
  onSwitchToLogin: () => void;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message || 'Failed to send reset email');
      } else {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.headerIcon}>
              <FaCheck />
            </div>
            <h1>Check Your Email</h1>
            <p>We've sent a password reset link to {email}</p>
          </div>

          <div className={styles.successMessage}>
            <p>Please check your email and click the link to reset your password.</p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>

          <div className={styles.authFooter}>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={styles.linkButton}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.headerIcon}>
            <FaShieldAlt />
          </div>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} />
                Sending Email...
              </>
            ) : (
              'Send Reset Email'
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.linkButton}
            disabled={isLoading}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
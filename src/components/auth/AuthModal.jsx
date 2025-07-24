import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../Modal'
import styles from './AuthModal.module.css'
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const { signIn, signUp, resetPassword, error, loading, devLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match')
          return
        }
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters')
          return
        }
        
        console.log('🔄 Starting signup process...')
        const { error } = await signUp(email, password)
        console.log('📊 Signup result:', error ? 'Failed' : 'Success')
        
        if (!error) {
          setLocalError('')
          setLocalError('Account created successfully! Please check your email for verification.')
          onClose()
        } else {
          console.error('❌ Signup failed:', error.message || error)
          setLocalError(error.message || 'Failed to create account')
        }
      } else if (mode === 'signin') {
        console.log('🔄 Starting signin process...')
        const { error } = await signIn(email, password)
        console.log('📊 Signin result:', error ? 'Failed' : 'Success')
        
        if (!error) {
          onClose()
        } else {
          console.error('❌ Signin failed:', error.message || error)
          setLocalError(error.message || 'Failed to sign in')
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (!error) {
          setResetEmailSent(true)
        } else {
          setLocalError(error.message || 'Failed to send reset email')
        }
      }
    } catch (err) {
      console.error('❌ Auth error:', err)
      setLocalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setLocalError('')
    setResetEmailSent(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <Modal onClose={onClose} className={styles.authModal}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h2>
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p>
            {mode === 'signin' && 'Sign in to your Invoice Direct account'}
            {mode === 'signup' && 'Start creating professional invoices today'}
            {mode === 'reset' && 'Enter your email to reset your password'}
          </p>
        </div>

        {resetEmailSent ? (
          <div className={styles.successMessage}>
            <h3>Check your email</h3>
            <p>We've sent a password reset link to {email}</p>
            <button 
              onClick={() => switchMode('signin')}
              className={styles.linkButton}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            {mode !== 'reset' && (
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>
            )}

            {(error || localError) && (
              <div className={styles.errorMessage}>
                {localError || error}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  {mode === 'signin' && 'Signing In...'}
                  {mode === 'signup' && 'Creating Account...'}
                  {mode === 'reset' && 'Sending Email...'}
                </>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </>
              )}
            </button>
          </form>
        )}

        {!resetEmailSent && (
          <div className={styles.authFooter}>
            {mode === 'signin' && (
              <>
                <button 
                  onClick={() => switchMode('reset')}
                  className={styles.linkButton}
                >
                  Forgot your password?
                </button>
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => switchMode('signup')}
                    className={styles.linkButton}
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
            
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => switchMode('signin')}
                  className={styles.linkButton}
                >
                  Sign in
                </button>
              </p>
            )}
            
            {mode === 'reset' && (
              <button 
                onClick={() => switchMode('signin')}
                className={styles.linkButton}
              >
                Back to Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AuthModal

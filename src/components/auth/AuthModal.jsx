import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../Modal'
import styles from './AuthModal.module.css'
import { FaEye, FaEyeSlash, FaSpinner, FaCheck, FaExclamationTriangle, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaShieldAlt, FaGoogle } from 'react-icons/fa'

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const { signIn, signUp, signInWithGoogle, resetPassword, resendConfirmation, error, loading, devLogin } = useAuth()

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(email))
  }, [email])

  // Password strength calculation
  useEffect(() => {
    if (mode !== 'signup') return

    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25

    setPasswordStrength(strength)
  }, [password, mode])

  const validateField = (field, value) => {
    const errors = { ...fieldErrors }

    switch (field) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        } else {
          delete errors.email
        }
        break
      case 'password':
        if (!value) {
          errors.password = 'Password is required'
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters'
        } else {
          delete errors.password
        }
        break
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password'
        } else if (value !== password) {
          errors.confirmPassword = 'Passwords do not match'
        } else {
          delete errors.confirmPassword
        }
        break
    }

    setFieldErrors(errors)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#ef4444'
    if (passwordStrength < 75) return '#f59e0b'
    return '#10b981'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak'
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  const handleGoogleSignIn = async () => {
    setLocalError('')
    setIsSubmitting(true)

    try {
      console.log('🔄 Starting Google OAuth flow...')
      const { error } = await signInWithGoogle()
      if (error) {
        console.error('❌ Google OAuth error:', error)
        setLocalError(error.message || 'Failed to sign in with Google')
        setIsSubmitting(false)
      }
      // Note: If successful, user will be redirected to Google OAuth, then back to the app
      // The modal will close automatically when auth state changes
      // Don't reset isSubmitting here as the redirect is happening
    } catch (err) {
      console.error('❌ Google signin error:', err)
      setLocalError(err.message || 'Failed to sign in with Google')
      setIsSubmitting(false)
    }
  }

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
          setShowSuccess(true)
          setTimeout(() => {
            onClose()
          }, 2000)
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

          // Check if error is related to email confirmation
          if (error.message && (
            error.message.toLowerCase().includes('email not confirmed') ||
            error.message.toLowerCase().includes('not confirmed') ||
            error.message.toLowerCase().includes('confirm your email')
          )) {
            setNeedsEmailConfirmation(true)
            setLocalError('')
          } else {
            setLocalError(error.message || 'Failed to sign in')
          }
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

  const handleResendConfirmation = async () => {
    setIsSubmitting(true)
    setLocalError('')

    try {
      const { error } = await resendConfirmation(email)
      if (!error) {
        setConfirmationEmailSent(true)
        setLocalError('')
      } else {
        setLocalError(error.message || 'Failed to resend confirmation email')
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to resend confirmation email')
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
    setConfirmationEmailSent(false)
    setNeedsEmailConfirmation(false)
    setPasswordStrength(0)
    setFieldErrors({})
    setShowSuccess(false)
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
          <div className={styles.headerIcon}>
            {mode === 'signin' && <FaSignInAlt />}
            {mode === 'signup' && <FaUserPlus />}
            {mode === 'reset' && <FaShieldAlt />}
          </div>
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

        {showSuccess && (
          <div className={styles.successBanner}>
            <FaCheck className={styles.successIcon} />
            <div>
              <h3>Account Created Successfully!</h3>
              <p>Please check your email for verification. Redirecting...</p>
            </div>
          </div>
        )}

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
        ) : needsEmailConfirmation ? (
          <div className={styles.confirmationMessage}>
            <h3>Email Confirmation Required</h3>
            <p>Your account needs email verification before you can sign in.</p>
            <p>Please check your email at <strong>{email}</strong> for a confirmation link.</p>

            {confirmationEmailSent ? (
              <div className={styles.resendSuccess}>
                <p>✅ Confirmation email sent! Check your inbox and spam folder.</p>
              </div>
            ) : (
              <div className={styles.resendSection}>
                <p>Didn't receive the email?</p>
                <button
                  onClick={handleResendConfirmation}
                  className={styles.resendButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className={styles.spinner} />
                      Sending...
                    </>
                  ) : (
                    'Resend Confirmation Email'
                  )}
                </button>
              </div>
            )}

            <div className={styles.confirmationFooter}>
              <button
                onClick={() => {
                  setNeedsEmailConfirmation(false)
                  setConfirmationEmailSent(false)
                  setLocalError('')
                }}
                className={styles.linkButton}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.authForm}>
            {/* Google Sign-In Button */}
            {(mode === 'signin' || mode === 'signup') && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting || loading}
                  className={styles.googleButton}
                >
                  {isSubmitting && loading ? (
                    <>
                      <FaSpinner className={styles.spinner} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaGoogle />
                      Continue with Google
                    </>
                  )}
                </button>

                <div className={styles.divider}>
                  <span>or</span>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className={styles.emailForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={`${styles.inputWrapper} ${fieldErrors.email ? styles.inputError : ''} ${isEmailValid && email ? styles.inputValid : ''}`}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    validateField('email', e.target.value)
                  }}
                  onBlur={(e) => validateField('email', e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className={fieldErrors.email ? styles.errorInput : ''}
                />
                {isEmailValid && email && <FaCheck className={styles.validIcon} />}
              </div>
              {fieldErrors.email && (
                <span className={styles.fieldError}>
                  <FaExclamationTriangle />
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {mode !== 'reset' && (
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.password ? styles.inputError : ''}`}>
                  <FaLock className={styles.inputIcon} />
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        validateField('password', e.target.value)
                      }}
                      onBlur={(e) => validateField('password', e.target.value)}
                      required
                      placeholder="Enter your password"
                      minLength={6}
                      className={fieldErrors.password ? styles.errorInput : ''}
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
                {fieldErrors.password && (
                  <span className={styles.fieldError}>
                    <FaExclamationTriangle />
                    {fieldErrors.password}
                  </span>
                )}
                {mode === 'signup' && password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthProgress}
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                    <span
                      className={styles.strengthText}
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`${styles.inputWrapper} ${fieldErrors.confirmPassword ? styles.inputError : ''} ${confirmPassword && confirmPassword === password ? styles.inputValid : ''}`}>
                  <FaLock className={styles.inputIcon} />
                  <div className={styles.passwordInput}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        validateField('confirmPassword', e.target.value)
                      }}
                      onBlur={(e) => validateField('confirmPassword', e.target.value)}
                      required
                      placeholder="Confirm your password"
                      minLength={6}
                      className={fieldErrors.confirmPassword ? styles.errorInput : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.passwordToggle}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === password && <FaCheck className={styles.validIcon} />}
                </div>
                {fieldErrors.confirmPassword && (
                  <span className={styles.fieldError}>
                    <FaExclamationTriangle />
                    {fieldErrors.confirmPassword}
                  </span>
                )}
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
          </div>
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

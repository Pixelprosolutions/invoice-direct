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

  const { signIn, signUp, resetPassword, resendConfirmation, error, loading, devLogin } = useAuth()

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
        const { data, error } = await signUp(email, password)
        console.log('📊 Signup result:', error ? 'Failed' : 'Success')
        
        if (!error) {
          // Check if user was created successfully
          if (data?.user) {
            console.log('✅ User created successfully:', data.user.email)
            setShowSuccess(true)
            setTimeout(() => {
              onClose()
            }, 2000)
          } else {
            console.log('⚠️ Signup completed but no user data returned')
            setLocalError('Account created but please try signing in')
          }
        } else {
          console.error('❌ Signup failed:', error.message || error)
          // Handle specific signup errors
          if (error.message?.includes('already registered') || error.message?.includes('user_already_exists')) {
            // Automatically switch to sign-in mode and preserve email
            setMode('signin')
            setLocalError('This email is already registered. Please sign in with your password.')
            setPassword('')
            setConfirmPassword('')
          } else if (error.message?.includes('email')) {
            setLocalError('Please enter a valid email address')
          } else {
            setLocalError(error.message || 'Failed to create account. Please try again.')
          }
        }
      } else if (mode === 'signin') {
        console.log('🔄 Starting signin process...')
        const { data, error } = await signIn(email, password)
        console.log('📊 Signin result:', error ? 'Failed' : 'Success')

        if (!error) {
          console.log('✅ Sign in successful:', data?.user?.email)
          onClose()
        } else {
          console.error('❌ Signin failed:', error.message || error)

          // Handle specific signin errors
          if (error.message?.includes('Invalid login credentials')) {
            setLocalError('Invalid email or password. Please check your credentials and try again.')
          } else if (error.message?.includes('email not confirmed')) {
            setNeedsEmailConfirmation(true)
            setLocalError('')
          } else if (error.message?.includes('too many requests')) {
            setLocalError('Too many login attempts. Please wait a moment and try again.')
          } else {
            setLocalError(error.message || 'Failed to sign in. Please try again.')
          }
        }
      } else if (mode === 'reset') {
        if (!email) {
          setLocalError('Please enter your email address')
          return
        }
        
        const { error } = await resetPassword(email)
        if (!error) {
          setResetEmailSent(true)
        } else {
          setLocalError(error.message || 'Failed to send reset email. Please check your email address.')
        }
      }
    } catch (err) {
      console.error('❌ Auth error:', err)
      setLocalError('An unexpected error occurred. Please try again.')
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
                {typeof localError === 'string' ? localError : localError || error}
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

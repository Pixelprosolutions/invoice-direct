import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './PasswordResetHandler.module.css'

const PasswordResetHandler = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { supabase } = useAuth()

  useEffect(() => {
    // Check if this is a password reset callback from URL params or hash
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token')
    const type = urlParams.get('type') || hashParams.get('type')
    
    console.log('Password reset check:', { 
      search: window.location.search,
      hash: window.location.hash,
      accessToken: accessToken ? 'present' : 'missing', 
      type 
    })

    if (type === 'recovery' && accessToken) {
      // This is a valid password reset link
      console.log('Valid password reset link detected')
      
      // Set the session with the access token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: urlParams.get('refresh_token') || hashParams.get('refresh_token')
      }).then(() => {
        console.log('Session set for password reset')
      }).catch(err => {
        console.error('Failed to set session:', err)
        setError('Failed to authenticate reset link')
      })
      
      setIsLoading(false)
    } else {
      // Invalid or missing parameters
      console.log('Invalid password reset link')
      setError('Invalid password reset link')
      setIsLoading(false)
    }
  }
  )

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setIsLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)

    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.error}>
            <h2>Password Reset Error</h2>
            <p>{error}</p>
            <a href="/" className={styles.homeLink}>
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.success}>
            <h2>Password Updated Successfully!</h2>
            <p>Your password has been updated. You will be redirected to the login page shortly.</p>
            <a href="/" className={styles.homeLink}>
              Go to Homepage Now
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.form}>
          <h2>Reset Your Password</h2>
          <p>Enter your new password below</p>
          
          <form onSubmit={handlePasswordReset}>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter new password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordResetHandler

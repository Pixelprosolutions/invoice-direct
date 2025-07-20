import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, getUserProfile } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    
    // Set a maximum loading time of 10 seconds
    const maxLoadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timed out after 10 seconds')
        setLoading(false)
        setError('Connection timeout - using offline mode')
      }
    }, 10000)

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')
        
        // Try to get session with a shorter timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        )
        
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])
        
        if (!mounted) return
        
        if (sessionError) {
          console.warn('Session error:', sessionError.message)
          setError(sessionError.message)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email)
          setUser(session.user)
          
          // Try to load profile, but don't block on it
          try {
            const profile = await getUserProfile(session.user.id)
            if (mounted) {
              setUserProfile(profile || {
                id: session.user.id,
                email: session.user.email,
                plan: 'free',
                invoice_count: 0,
                created_at: new Date().toISOString()
              })
            }
          } catch (profileError) {
            console.warn('Profile load failed, using default:', profileError.message)
            if (mounted) {
              setUserProfile({
                id: session.user.id,
                email: session.user.email,
                plan: 'free',
                invoice_count: 0,
                created_at: new Date().toISOString()
              })
            }
          }
        } else {
          console.log('ℹ️ No existing session found')
        }
        
      } catch (error) {
        console.warn('Auth initialization failed:', error.message)
        if (mounted) {
          setError(error.message)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          clearTimeout(maxLoadingTimeout)
        }
      }
    }

    // Start initialization
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email)
        
        if (!mounted) return
        
        try {
          if (session?.user) {
            setUser(session.user)
            
            // Try to load profile
            try {
              const profile = await getUserProfile(session.user.id)
              setUserProfile(profile || {
                id: session.user.id,
                email: session.user.email,
                plan: 'free',
                invoice_count: 0,
                created_at: new Date().toISOString()
              })
            } catch (profileError) {
              console.warn('Profile load failed in auth change:', profileError.message)
              setUserProfile({
                id: session.user.id,
                email: session.user.email,
                plan: 'free',
                invoice_count: 0,
                created_at: new Date().toISOString()
              })
            }
          } else {
            setUser(null)
            setUserProfile(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(maxLoadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      console.log('🔄 Attempting signup for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('📊 Signup response:', { data, error })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signup failed:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      console.log('🔄 Attempting signin for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Signin response:', { data, error })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signin failed:', error)
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      
      // Clear all local state
      setUser(null)
      setUserProfile(null)
      
      // Clear any cached data from localStorage
      localStorage.removeItem('invoiceData')
      localStorage.removeItem('savedInvoices')
      
      // Try to sign out from Supabase, but don't block on it
      supabase.auth.signOut().catch(error => {
        console.warn('Supabase signout failed:', error.message)
      })
      
    } catch (error) {
      console.warn('Logout error:', error.message)
      // Even if there's an error, clear local state
      setUser(null)
      setUserProfile(null)
      localStorage.removeItem('invoiceData')
      localStorage.removeItem('savedInvoices')
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error }
    }
  }

  const canCreateInvoice = () => {
    if (!userProfile) return false
    if (userProfile.plan === 'premium') return true
    return userProfile.invoice_count < 3
  }

  const isPremium = () => {
    // Test account for development - remove in production
    if (user?.email === 'hello@pixelpro.solutions') {
      return true
    }
    return userProfile?.plan === 'premium'
  }

  const getRemainingInvoices = () => {
    if (!userProfile) return 0
    // Test account for development - remove in production
    if (user?.email === 'hello@pixelpro.solutions') {
      return Infinity
    }
    if (userProfile.plan === 'premium') return Infinity
    return Math.max(0, 3 - userProfile.invoice_count)
  }

  const refreshProfile = async () => {
    if (!user) return
    
    try {
      const profile = await getUserProfile(user.id)
      setUserProfile(profile || {
        id: user.id,
        email: user.email,
        plan: 'free',
        invoice_count: 0,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.warn('Profile refresh failed:', error.message)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    canCreateInvoice,
    isPremium,
    getRemainingInvoices,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
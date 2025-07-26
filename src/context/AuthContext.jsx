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
    
    // Set a maximum loading time of 5 seconds
    const maxLoadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timed out after 5 seconds')
        setLoading(false)
        setError(null) // Don't show error, just stop loading
      }
    }, 5000)

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')

        // Check if Supabase is configured and clear dev user if needed
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseKey) {
          // If Supabase is configured, clear any dev user session
          const currentUser = user || { id: localStorage.getItem('dev-user-id') }
          if (currentUser && currentUser.id === 'dev-user-123') {
            console.log('🔄 Clearing dev user session - Supabase is now configured')
            setUser(null)
            setUserProfile(null)
            localStorage.removeItem('dev-user-id')
          }
        }

        // Try to get session with a shorter timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        )
        
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])
        
        if (!mounted) return
        
        if (sessionError) {
          console.warn('Session error:', sessionError.message)
          if (!sessionError.message.includes('timeout')) {
            setError(sessionError.message)
          }
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email)
          setUser(session.user)
          
          // Load profile with timeout
          const profilePromise = getUserProfile(session.user.id)
          const profileTimeout = new Promise((resolve) =>
            setTimeout(() => resolve({
              id: session.user.id,
              email: session.user.email,
              plan: 'free',
              invoice_count: 0,
              created_at: new Date().toISOString()
            }), 2000)
          )
          
          const profile = await Promise.race([profilePromise, profileTimeout])
          if (mounted) {
            setUserProfile(profile)
          }
        } else {
          console.log('ℹ️ No existing session found')
        }
        
      } catch (error) {
        console.warn('Auth initialization failed:', error.message)
        if (mounted) {
          if (!error.message.includes('timeout')) {
            setError(error.message)
          }
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
            
            // Load profile with timeout for auth state changes
            const profilePromise = getUserProfile(session.user.id)
            const profileTimeout = new Promise((resolve) =>
              setTimeout(() => resolve({
                id: session.user.id,
                email: session.user.email,
                plan: 'free',
                invoice_count: 0,
                created_at: new Date().toISOString()
              }), 1500)
            )
            
            const profile = await Promise.race([profilePromise, profileTimeout])
            setUserProfile(profile)
          } else {
            setUser(null)
            setUserProfile(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          // Don't let profile errors block the auth flow
          if (session?.user) {
            setUserProfile({
              id: session.user.id,
              email: session.user.email,
              plan: 'free',
              invoice_count: 0,
              created_at: new Date().toISOString()
            })
          }
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
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Database not configured. Please set up Supabase credentials.')
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_confirm: false // Try to disable email confirmation
          }
        }
      })

      console.log('📊 Signup response:', { data, error })

      if (error) throw error
      
      // If user was created successfully, try to create profile
      if (data?.user && !error) {
        console.log('✅ User created, attempting to create profile...')
        // The profile should be created automatically by the trigger
        // But let's add a small delay to ensure it's processed
        setTimeout(async () => {
          try {
            await refreshProfile()
          } catch (profileError) {
            console.warn('Profile creation delayed, will retry later:', profileError)
          }
        }, 1000)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signup failed:', error.message || error)
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
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Signin response:', { data, error })

      if (error) throw error
      
      // Ensure profile is loaded after successful signin
      if (data?.user) {
        console.log('✅ Sign in successful, loading profile...')
        setTimeout(async () => {
          try {
            await refreshProfile()
          } catch (profileError) {
            console.warn('Profile load failed, using defaults:', profileError)
          }
        }, 500)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signin failed:', error.message || error)
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
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      console.error('❌ Signout failed:', error.message || error)
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)

      // Get the current origin dynamically
      const redirectTo = `${window.location.origin}/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error }
    }
  }

  const resendConfirmation = async (email) => {
    try {
      setError(null)
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error }
    }
  }
  const canCreateInvoice = () => {
    if (!userProfile) return true // New users should be able to create invoices
    if (userProfile.plan === 'premium') return true
    return userProfile.invoice_count < 3
  }

  const isPremium = () => {
    // Test account for development - remove in production
    if (user?.email === 'hello@pixelpro.solutions') {
      return true
    }
    
    // Check localStorage for premium upgrade (handles both demo and real payments)
    const localProfile = localStorage.getItem('userProfile')
    if (localProfile) {
      try {
        const parsedProfile = JSON.parse(localProfile)
        if (parsedProfile.id === user?.id && parsedProfile.plan === 'premium') {
          return true
        }
      } catch (e) {
        console.warn('Error parsing local profile:', e)
      }
    }
    
    return userProfile?.plan === 'premium'
  }

  const getRemainingInvoices = () => {
    if (!userProfile) return 3 // New users get 3 free invoices
    // Test account for development - remove in production
    if (user?.email === 'hello@pixelpro.solutions') {
      return Infinity
    }
    
    // Check localStorage for premium status
    const localProfile = localStorage.getItem('userProfile')
    if (localProfile) {
      try {
        const parsedProfile = JSON.parse(localProfile)
        if (parsedProfile.id === user?.id && parsedProfile.plan === 'premium') {
          return Infinity
        }
      } catch (e) {
        console.warn('Error parsing local profile:', e)
      }
    }
    
    if (userProfile.plan === 'premium') return Infinity
    return Math.max(0, 3 - userProfile.invoice_count)
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      // First check localStorage for premium upgrade (demo mode)
      const localProfile = localStorage.getItem('userProfile')
      if (localProfile) {
        try {
          const parsedProfile = JSON.parse(localProfile)
          if (parsedProfile.id === user.id) {
            setUserProfile(parsedProfile)
            return
          }
        } catch (e) {
          console.warn('Error parsing local profile:', e)
        }
      }

      // Fallback to Supabase profile
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

  const incrementLocalInvoiceCount = () => {
    if (!user || isPremium()) return
    
    const currentProfile = userProfile || {
      id: user.id,
      email: user.email,
      plan: 'free',
      invoice_count: 0,
      created_at: new Date().toISOString()
    }
    
    const updatedProfile = {
      ...currentProfile,
      invoice_count: (currentProfile.invoice_count || 0) + 1,
      updated_at: new Date().toISOString()
    }
    
    setUserProfile(updatedProfile)
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
  }
  const devLogin = () => {
    // Check if Supabase is configured - if so, don't allow dev login
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      console.warn('🚫 Dev login disabled - Supabase is configured. Please use Sign In/Sign Up.')
      setError('Development login is disabled when database is configured. Please sign in normally.')
      return
    }

    console.log('🔧 Dev login activated (Supabase not configured)')
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@invoicedirect.app',
      created_at: new Date().toISOString()
    }
    const mockProfile = {
      id: 'dev-user-123',
      email: 'dev@invoicedirect.app',
      plan: 'premium',
      invoice_count: 0,
      created_at: new Date().toISOString()
    }

    setUser(mockUser)
    setUserProfile(mockProfile)
    setError(null)
    setLoading(false)
  }

  const forceSignOut = () => {
    console.log('🔄 Force sign out - clearing all session data')
    setUser(null)
    setUserProfile(null)
    setError(null)
    localStorage.removeItem('invoiceData')
    localStorage.removeItem('savedInvoices')
    localStorage.removeItem('dev-user-id')
    localStorage.removeItem('userProfile')
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
    resendConfirmation,
    canCreateInvoice,
    isPremium,
    getRemainingInvoices,
    refreshProfile,
    incrementLocalInvoiceCount,
    devLogin,
    forceSignOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        try {
          if (session?.user) {
            setUser(session.user)
            await loadUserProfile(session.user.id)
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

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 10000)
      )
      
      const profile = await Promise.race([
        getUserProfile(userId),
        timeoutPromise
      ])
      
      if (profile) {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      
      // Set a default profile for development or when there are issues
      if (error.message.includes('Supabase not configured') || error.message.includes('timeout')) {
        setUserProfile({
          id: userId,
          email: 'demo@example.com',
          plan: 'free',
          invoice_count: 0,
          created_at: new Date().toISOString()
        })
      }
      
      setLoading(false)
    }
  }

  const signUp = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setError(null)
      if (user) {
        const updatedProfile = await updateUserProfile(user.id, updates)
        setUserProfile(updatedProfile)
        return { data: updatedProfile, error: null }
      }
    } catch (error) {
      setError(error.message)
      return { data: null, error }
    }
  }

  const canCreateInvoice = () => {
    if (!userProfile) return false
    if (userProfile.plan === 'premium') return true
    return userProfile.invoice_count < 3
  }

  const isPremium = () => {
    return userProfile?.plan === 'premium'
  }

  const getRemainingInvoices = () => {
    if (!userProfile) return 0
    if (userProfile.plan === 'premium') return Infinity
    return Math.max(0, 3 - userProfile.invoice_count)
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
    updateProfile,
    canCreateInvoice,
    isPremium,
    getRemainingInvoices,
    refreshProfile: () => user && loadUserProfile(user.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config Check:')
console.log('URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing')

// Create a mock client if environment variables are missing (for development)
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Creating real Supabase client')
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
} else {
  console.warn('⚠️ Supabase environment variables missing. Using mock client.')
  console.warn('📝 Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  
  // Mock client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured - please set up Google OAuth' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      resend: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    },
    from: () => ({
      insert: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
    }),
    rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  }
}

export { supabase }

// Database helper functions
export const createUserProfile = async (userId, email) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        plan: 'free',
        invoice_count: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

export const getUserProfile = async (userId) => {
  try {
    // Check if this is the test account
    const testUser = await supabase.auth.getUser()
    if (testUser.data?.user?.email === 'hello@pixelpro.solutions') {
      return {
        id: userId,
        email: 'hello@pixelpro.solutions',
        plan: 'premium',
        invoice_count: 0,
        created_at: new Date().toISOString()
      }
    }
    
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured, using local profile')
      return {
        id: userId,
        email: testUser.data?.user?.email || 'user@example.com',
        plan: 'free',
        invoice_count: 0,
        created_at: new Date().toISOString()
      }
    }
    
    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .abortSignal(controller.signal)
      .single()

    clearTimeout(timeoutId)

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - profile doesn't exist
        console.log('Profile not found for user:', userId)
        // Try to create a default profile
        try {
          const defaultProfile = {
            id: userId,
            email: testUser.data?.user?.email || 'user@example.com',
            plan: 'free',
            invoice_count: 0,
            created_at: new Date().toISOString()
          }
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([defaultProfile])
            .select()
            .single()
          
          if (!createError) {
            console.log('✅ Created default profile for user:', userId)
            return newProfile
          } else {
            console.warn('Failed to create profile, using default:', createError)
            return defaultProfile
          }
        } catch (createError) {
          console.warn('Profile creation failed, using default:', createError)
          return {
            id: userId,
            email: testUser.data?.user?.email || 'user@example.com',
            plan: 'free',
            invoice_count: 0,
            created_at: new Date().toISOString()
          }
        }
      }
      console.error('Profile fetch error:', error)
      // Return a default profile instead of null
      return {
        id: userId,
        email: testUser.data?.user?.email || 'user@example.com',
        plan: 'free',
        invoice_count: 0,
        created_at: new Date().toISOString()
      }
    }
    
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Profile fetch timed out')
      return {
        id: userId,
        email: 'user@example.com',
        plan: 'free',
        invoice_count: 0,
        created_at: new Date().toISOString()
      }
    }
    console.error('getUserProfile failed:', error)
    return {
      id: userId,
      email: 'user@example.com',
      plan: 'free',
      invoice_count: 0,
      created_at: new Date().toISOString()
    }
  }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0]
}

export const incrementInvoiceCount = async (userId) => {
  const { data, error } = await supabase.rpc('increment_invoice_count', {
    user_id: userId
  })

  if (error) throw error
  return data
}

export const saveInvoice = async (userId, invoiceData) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: userId,
        invoice_data: invoiceData,
        status: 'draft',
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

export const getUserInvoices = async (userId) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if environment variables are missing (for development)
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase environment variables missing. Using mock client for development.')
  console.warn('📝 Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  
  // Mock client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    },
    from: () => ({
      insert: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      order: () => Promise.resolve({ data: [], error: null })
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
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
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

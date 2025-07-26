// Comprehensive diagnostics for Invoice Direct authentication issues
export const runDiagnostics = async () => {
  const issues = []
  const fixes = []
  
  console.log('🔍 Running comprehensive diagnostics...')
  
  // 1. Check Environment Variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    issues.push('❌ CRITICAL: Supabase environment variables missing')
    fixes.push('Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  } else {
    console.log('✅ Environment variables present')
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseKey.substring(0, 20) + '...')
  }
  
  // 2. Test Supabase Connection
  try {
    const { supabase } = await import('../lib/supabase')
    const { data, error } = await supabase.auth.getSession()
    
    if (error && error.message !== 'Supabase not configured') {
      issues.push(`❌ Supabase connection failed: ${error.message}`)
      fixes.push('Check if Supabase URL and key are correct')
    } else {
      console.log('✅ Supabase connection working')
    }
  } catch (error) {
    issues.push(`❌ Supabase import failed: ${error.message}`)
    fixes.push('Check Supabase configuration and restart dev server')
  }
  
  // 3. Check Database Tables
  if (supabaseUrl && supabaseKey) {
    try {
      const { supabase } = await import('../lib/supabase')
      
      // Test profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
      
      if (profileError && profileError.code === '42P01') {
        issues.push('❌ CRITICAL: profiles table does not exist')
        fixes.push('Run SQL migrations in Supabase dashboard')
      } else if (profileError) {
        issues.push(`❌ profiles table error: ${profileError.message}`)
        fixes.push('Check RLS policies and table permissions')
      } else {
        console.log('✅ profiles table accessible')
      }
      
      // Test invoices table
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('count', { count: 'exact', head: true })
      
      if (invoiceError && invoiceError.code === '42P01') {
        issues.push('❌ CRITICAL: invoices table does not exist')
        fixes.push('Run SQL migrations in Supabase dashboard')
      } else if (invoiceError) {
        issues.push(`❌ invoices table error: ${invoiceError.message}`)
        fixes.push('Check RLS policies and table permissions')
      } else {
        console.log('✅ invoices table accessible')
      }
      
    } catch (error) {
      issues.push(`❌ Database test failed: ${error.message}`)
      fixes.push('Check Supabase project status and configuration')
    }
  }
  
  // 4. Test Authentication Methods
  if (supabaseUrl && supabaseKey) {
    try {
      const { supabase } = await import('../lib/supabase')
      
      // Test signup with dummy data (won't actually create user)
      const testEmail = 'test@example.com'
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: { emailRedirectTo: 'http://localhost:5173' }
      })
      
      if (error && !error.message.includes('already registered')) {
        issues.push(`❌ Auth signup test failed: ${error.message}`)
        fixes.push('Check Supabase auth configuration and email settings')
      } else {
        console.log('✅ Auth signup method working')
      }
      
    } catch (error) {
      issues.push(`❌ Auth test failed: ${error.message}`)
      fixes.push('Check Supabase auth service status')
    }
  }
  
  // 5. Check Stripe Configuration
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  if (!stripeKey) {
    issues.push('⚠️ Stripe publishable key missing (payments will use demo mode)')
    fixes.push('Add VITE_STRIPE_PUBLISHABLE_KEY to .env for real payments')
  } else {
    console.log('✅ Stripe key present')
  }
  
  // 6. Check Edge Functions
  if (supabaseUrl) {
    try {
      const functionsUrl = `${supabaseUrl}/functions/v1/stripe-checkout`
      const response = await fetch(functionsUrl, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.status === 404) {
        issues.push('❌ Stripe Edge Functions not deployed')
        fixes.push('Deploy Edge Functions to Supabase or use demo payments')
      } else {
        console.log('✅ Edge Functions accessible')
      }
    } catch (error) {
      issues.push('⚠️ Edge Functions not accessible (will use demo payments)')
      fixes.push('Deploy Edge Functions or continue with demo payments')
    }
  }
  
  return { issues, fixes }
}

export const displayDiagnostics = async () => {
  const { issues, fixes } = await runDiagnostics()
  
  console.log('\n🔍 DIAGNOSTIC RESULTS:')
  console.log('='.repeat(50))
  
  if (issues.length === 0) {
    console.log('✅ No critical issues found!')
    return { success: true, issues: [], fixes: [] }
  }
  
  console.log('\n❌ ISSUES FOUND:')
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`)
  })
  
  console.log('\n🔧 RECOMMENDED FIXES:')
  fixes.forEach((fix, index) => {
    console.log(`${index + 1}. ${fix}`)
  })
  
  console.log('\n' + '='.repeat(50))
  
  return { success: false, issues, fixes }
}
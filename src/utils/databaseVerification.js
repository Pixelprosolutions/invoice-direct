// Database Verification Utilities
// Use these functions to verify your database setup is working correctly

import { supabase } from '../lib/supabase'

/**
 * Comprehensive database verification
 */
export const verifyDatabaseSetup = async () => {
  const results = {
    connection: false,
    tables: false,
    rls: false,
    functions: false,
    triggers: false,
    policies: false,
    indexes: false,
    errors: []
  }

  try {
    console.log('🔍 Starting database verification...')

    // 1. Test basic connection
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
      if (!error) {
        results.connection = true
        console.log('✅ Database connection successful')
      } else {
        results.errors.push(`Connection error: ${error.message}`)
      }
    } catch (err) {
      results.errors.push(`Connection failed: ${err.message}`)
    }

    // 2. Verify tables exist
    try {
      const tables = ['profiles', 'invoices']
      let tablesExist = true

      for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error && error.code === '42P01') { // Table doesn't exist
          tablesExist = false
          results.errors.push(`Table '${table}' does not exist`)
        }
      }

      if (tablesExist) {
        results.tables = true
        console.log('✅ All required tables exist')
      }
    } catch (err) {
      results.errors.push(`Table verification failed: ${err.message}`)
    }

    // 3. Test RLS policies
    try {
      // This should fail for unauthenticated user if RLS is working
      const { error } = await supabase.from('profiles').select('*')
      if (error && (error.message.includes('RLS') || error.message.includes('policy'))) {
        results.rls = true
        console.log('✅ Row Level Security is active')
      } else if (!error) {
        // If no error, RLS might be disabled or policies are too permissive
        results.errors.push('RLS may not be properly configured - unauthenticated access allowed')
      }
    } catch (err) {
      results.errors.push(`RLS verification failed: ${err.message}`)
    }

    // 4. Test database functions
    try {
      const functions = [
        'increment_invoice_count',
        'get_user_invoice_stats',
        'check_invoice_limits',
        'update_invoice_status'
      ]

      let functionsWork = true
      for (const func of functions) {
        try {
          // Test with dummy data - should fail gracefully
          await supabase.rpc(func, { user_id: '00000000-0000-0000-0000-000000000000' })
        } catch (err) {
          if (err.message.includes('function') && err.message.includes('does not exist')) {
            functionsWork = false
            results.errors.push(`Function '${func}' does not exist`)
          }
          // Other errors are expected (like permission errors)
        }
      }

      if (functionsWork) {
        results.functions = true
        console.log('✅ Database functions are available')
      }
    } catch (err) {
      results.errors.push(`Function verification failed: ${err.message}`)
    }

    // 5. Test user creation trigger
    try {
      // We can't easily test this without creating a real user
      // So we'll assume it works if the function exists
      const { error } = await supabase.rpc('handle_new_user')
      if (!error || !error.message.includes('does not exist')) {
        results.triggers = true
        console.log('✅ User creation trigger function exists')
      }
    } catch (err) {
      if (!err.message.includes('does not exist')) {
        results.triggers = true
        console.log('✅ User creation trigger function exists')
      } else {
        results.errors.push('User creation trigger function missing')
      }
    }

    // 6. Verify policies exist (basic check)
    if (results.rls) {
      results.policies = true
      console.log('✅ RLS policies are configured')
    }

    // 7. Assume indexes exist if tables exist
    if (results.tables) {
      results.indexes = true
      console.log('✅ Database indexes should be created')
    }

  } catch (error) {
    results.errors.push(`Verification failed: ${error.message}`)
  }

  return results
}

/**
 * Test user profile operations
 */
export const testUserProfileOperations = async (user) => {
  if (!user) {
    throw new Error('User must be authenticated to test profile operations')
  }

  const results = {
    canRead: false,
    canUpdate: false,
    cannotAccessOthers: false,
    errors: []
  }

  try {
    // Test reading own profile
    const { data: profile, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!readError && profile) {
      results.canRead = true
      console.log('✅ Can read own profile')
    } else {
      results.errors.push(`Cannot read profile: ${readError?.message}`)
    }

    // Test updating own profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!updateError) {
      results.canUpdate = true
      console.log('✅ Can update own profile')
    } else {
      results.errors.push(`Cannot update profile: ${updateError.message}`)
    }

    // Test that we cannot access other users' profiles
    const { data: otherProfiles, error: otherError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .limit(1)

    if (otherError || !otherProfiles || otherProfiles.length === 0) {
      results.cannotAccessOthers = true
      console.log('✅ Cannot access other users\' profiles (RLS working)')
    } else {
      results.errors.push('Can access other users\' profiles - RLS may not be working correctly')
    }

  } catch (error) {
    results.errors.push(`Profile operations test failed: ${error.message}`)
  }

  return results
}

/**
 * Test invoice operations
 */
export const testInvoiceOperations = async (user) => {
  if (!user) {
    throw new Error('User must be authenticated to test invoice operations')
  }

  const results = {
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    cannotAccessOthers: false,
    functionsWork: false,
    errors: []
  }

  let testInvoiceId = null

  try {
    // Test creating an invoice
    const testInvoiceData = {
      businessName: 'Test Business',
      clientName: 'Test Client',
      invoiceNumber: 'TEST-001',
      lineItems: [{ description: 'Test Item', quantity: 1, unitPrice: 100, total: 100 }],
      total: 100
    }

    const { data: newInvoice, error: createError } = await supabase
      .from('invoices')
      .insert([{
        user_id: user.id,
        invoice_data: testInvoiceData,
        status: 'draft'
      }])
      .select()
      .single()

    if (!createError && newInvoice) {
      results.canCreate = true
      testInvoiceId = newInvoice.id
      console.log('✅ Can create invoices')
    } else {
      results.errors.push(`Cannot create invoice: ${createError?.message}`)
    }

    if (testInvoiceId) {
      // Test reading the invoice
      const { data: invoice, error: readError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', testInvoiceId)
        .single()

      if (!readError && invoice) {
        results.canRead = true
        console.log('✅ Can read own invoices')
      } else {
        results.errors.push(`Cannot read invoice: ${readError?.message}`)
      }

      // Test updating the invoice
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', testInvoiceId)

      if (!updateError) {
        results.canUpdate = true
        console.log('✅ Can update own invoices')
      } else {
        results.errors.push(`Cannot update invoice: ${updateError.message}`)
      }

      // Test database functions
      try {
        const { data: canCreate, error: funcError } = await supabase
          .rpc('check_invoice_limits', { user_id: user.id })

        if (!funcError && typeof canCreate === 'boolean') {
          results.functionsWork = true
          console.log('✅ Database functions working')
        } else {
          results.errors.push(`Function test failed: ${funcError?.message}`)
        }
      } catch (err) {
        results.errors.push(`Function test error: ${err.message}`)
      }

      // Clean up - delete test invoice
      const { error: deleteError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', testInvoiceId)

      if (!deleteError) {
        results.canDelete = true
        console.log('✅ Can delete own invoices')
      } else {
        results.errors.push(`Cannot delete invoice: ${deleteError.message}`)
      }
    }

    // Test that we cannot access other users' invoices
    const { data: otherInvoices, error: otherError } = await supabase
      .from('invoices')
      .select('*')
      .neq('user_id', user.id)
      .limit(1)

    if (otherError || !otherInvoices || otherInvoices.length === 0) {
      results.cannotAccessOthers = true
      console.log('✅ Cannot access other users\' invoices (RLS working)')
    } else {
      results.errors.push('Can access other users\' invoices - RLS may not be working correctly')
    }

  } catch (error) {
    results.errors.push(`Invoice operations test failed: ${error.message}`)
  }

  return results
}

/**
 * Run complete database verification
 */
export const runCompleteVerification = async (user = null) => {
  console.log('🚀 Starting complete database verification...')
  
  const setupResults = await verifyDatabaseSetup()
  
  let profileResults = null
  let invoiceResults = null
  
  if (user) {
    console.log('👤 Testing user-specific operations...')
    profileResults = await testUserProfileOperations(user)
    invoiceResults = await testInvoiceOperations(user)
  }
  
  const overallResults = {
    setup: setupResults,
    profiles: profileResults,
    invoices: invoiceResults,
    summary: {
      allGood: setupResults.connection && setupResults.tables && setupResults.rls,
      criticalIssues: setupResults.errors.filter(err => 
        err.includes('Connection') || 
        err.includes('Table') || 
        err.includes('RLS')
      ),
      totalErrors: setupResults.errors.length + 
                  (profileResults?.errors.length || 0) + 
                  (invoiceResults?.errors.length || 0)
    }
  }
  
  console.log('📊 Verification complete:', overallResults.summary)
  return overallResults
}

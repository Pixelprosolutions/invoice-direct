import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { verifyDatabaseSetup, testUserProfileOperations, testInvoiceOperations, runCompleteVerification } from '../utils/databaseVerification'
import styles from './DatabaseSetupChecker.module.css'
import { 
  FaDatabase, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimes, 
  FaSpinner,
  FaPlay,
  FaUser,
  FaFileInvoice,
  FaShieldAlt,
  FaCog,
  FaRedo
} from 'react-icons/fa'

const DatabaseSetupChecker = () => {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTest, setActiveTest] = useState('setup')

  useEffect(() => {
    // Auto-run setup verification on mount
    runSetupVerification()
  }, [])

  const runSetupVerification = async () => {
    setIsRunning(true)
    setActiveTest('setup')
    
    try {
      const setupResults = await verifyDatabaseSetup()
      setResults({ setup: setupResults })
    } catch (error) {
      console.error('Setup verification failed:', error)
      setResults({ 
        setup: { 
          connection: false, 
          errors: [error.message] 
        } 
      })
    } finally {
      setIsRunning(false)
    }
  }

  const runUserTests = async () => {
    if (!user) {
      alert('Please sign in to test user-specific operations')
      return
    }

    setIsRunning(true)
    setActiveTest('user')
    
    try {
      const profileResults = await testUserProfileOperations(user)
      const invoiceResults = await testInvoiceOperations(user)
      
      setResults(prev => ({
        ...prev,
        profiles: profileResults,
        invoices: invoiceResults
      }))
    } catch (error) {
      console.error('User tests failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const runCompleteTest = async () => {
    setIsRunning(true)
    setActiveTest('complete')
    
    try {
      const completeResults = await runCompleteVerification(user)
      setResults(completeResults)
    } catch (error) {
      console.error('Complete verification failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status) => {
    if (status === true) return <FaCheckCircle className={styles.successIcon} />
    if (status === false) return <FaTimes className={styles.errorIcon} />
    return <FaExclamationTriangle className={styles.warningIcon} />
  }

  const getStatusText = (status) => {
    if (status === true) return 'PASS'
    if (status === false) return 'FAIL'
    return 'WARN'
  }

  const renderSetupResults = () => {
    if (!results?.setup) return null

    const { setup } = results

    return (
      <div className={styles.resultSection}>
        <h3>
          <FaDatabase /> Database Setup Verification
        </h3>
        
        <div className={styles.testGrid}>
          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.connection)}
              <span>{getStatusText(setup.connection)}</span>
            </div>
            <div className={styles.testName}>Database Connection</div>
            <div className={styles.testDescription}>
              {setup.connection ? 'Successfully connected to Supabase' : 'Failed to connect to database'}
            </div>
          </div>

          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.tables)}
              <span>{getStatusText(setup.tables)}</span>
            </div>
            <div className={styles.testName}>Required Tables</div>
            <div className={styles.testDescription}>
              {setup.tables ? 'All tables (profiles, invoices) exist' : 'Some tables are missing'}
            </div>
          </div>

          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.rls)}
              <span>{getStatusText(setup.rls)}</span>
            </div>
            <div className={styles.testName}>Row Level Security</div>
            <div className={styles.testDescription}>
              {setup.rls ? 'RLS policies are active' : 'RLS may not be configured'}
            </div>
          </div>

          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.functions)}
              <span>{getStatusText(setup.functions)}</span>
            </div>
            <div className={styles.testName}>Database Functions</div>
            <div className={styles.testDescription}>
              {setup.functions ? 'Custom functions are available' : 'Some functions may be missing'}
            </div>
          </div>

          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.triggers)}
              <span>{getStatusText(setup.triggers)}</span>
            </div>
            <div className={styles.testName}>Database Triggers</div>
            <div className={styles.testDescription}>
              {setup.triggers ? 'User creation trigger exists' : 'Triggers may not be configured'}
            </div>
          </div>

          <div className={styles.testItem}>
            <div className={styles.testStatus}>
              {getStatusIcon(setup.policies)}
              <span>{getStatusText(setup.policies)}</span>
            </div>
            <div className={styles.testName}>Security Policies</div>
            <div className={styles.testDescription}>
              {setup.policies ? 'RLS policies are configured' : 'Policies need configuration'}
            </div>
          </div>
        </div>

        {setup.errors && setup.errors.length > 0 && (
          <div className={styles.errorList}>
            <h4>Issues Found:</h4>
            <ul>
              {setup.errors.map((error, index) => (
                <li key={index} className={styles.errorItem}>
                  <FaExclamationTriangle />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderUserResults = () => {
    if (!results?.profiles && !results?.invoices) return null

    return (
      <div className={styles.resultSection}>
        <h3>
          <FaUser /> User Operations Testing
        </h3>
        
        {results.profiles && (
          <div className={styles.subSection}>
            <h4>Profile Operations</h4>
            <div className={styles.testGrid}>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.profiles.canRead)}
                  <span>{getStatusText(results.profiles.canRead)}</span>
                </div>
                <div className={styles.testName}>Read Own Profile</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.profiles.canUpdate)}
                  <span>{getStatusText(results.profiles.canUpdate)}</span>
                </div>
                <div className={styles.testName}>Update Own Profile</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.profiles.cannotAccessOthers)}
                  <span>{getStatusText(results.profiles.cannotAccessOthers)}</span>
                </div>
                <div className={styles.testName}>Cannot Access Others</div>
              </div>
            </div>
          </div>
        )}

        {results.invoices && (
          <div className={styles.subSection}>
            <h4>Invoice Operations</h4>
            <div className={styles.testGrid}>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.invoices.canCreate)}
                  <span>{getStatusText(results.invoices.canCreate)}</span>
                </div>
                <div className={styles.testName}>Create Invoice</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.invoices.canRead)}
                  <span>{getStatusText(results.invoices.canRead)}</span>
                </div>
                <div className={styles.testName}>Read Own Invoices</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.invoices.canUpdate)}
                  <span>{getStatusText(results.invoices.canUpdate)}</span>
                </div>
                <div className={styles.testName}>Update Invoice</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.invoices.canDelete)}
                  <span>{getStatusText(results.invoices.canDelete)}</span>
                </div>
                <div className={styles.testName}>Delete Invoice</div>
              </div>
              <div className={styles.testItem}>
                <div className={styles.testStatus}>
                  {getStatusIcon(results.invoices.functionsWork)}
                  <span>{getStatusText(results.invoices.functionsWork)}</span>
                </div>
                <div className={styles.testName}>Database Functions</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const getOverallStatus = () => {
    if (!results?.setup) return 'unknown'
    
    const { setup } = results
    const criticalTests = [setup.connection, setup.tables, setup.rls]
    
    if (criticalTests.every(test => test === true)) return 'success'
    if (criticalTests.some(test => test === false)) return 'error'
    return 'warning'
  }

  const overallStatus = getOverallStatus()

  return (
    <div className={styles.databaseChecker}>
      <div className={styles.header}>
        <h2>
          <FaDatabase /> Database Setup Verification
        </h2>
        <p>Verify that your Supabase database schema and security are properly configured</p>
      </div>

      <div className={styles.controls}>
        <button
          onClick={runSetupVerification}
          disabled={isRunning}
          className={styles.testButton}
        >
          {isRunning && activeTest === 'setup' ? (
            <>
              <FaSpinner className={styles.spinner} />
              Testing Setup...
            </>
          ) : (
            <>
              <FaDatabase />
              Test Database Setup
            </>
          )}
        </button>

        <button
          onClick={runUserTests}
          disabled={isRunning || !user}
          className={styles.testButton}
          title={!user ? 'Sign in to test user operations' : ''}
        >
          {isRunning && activeTest === 'user' ? (
            <>
              <FaSpinner className={styles.spinner} />
              Testing User Ops...
            </>
          ) : (
            <>
              <FaUser />
              Test User Operations
            </>
          )}
        </button>

        <button
          onClick={runCompleteTest}
          disabled={isRunning}
          className={styles.testButton}
        >
          {isRunning && activeTest === 'complete' ? (
            <>
              <FaSpinner className={styles.spinner} />
              Running Complete Test...
            </>
          ) : (
            <>
              <FaPlay />
              Run Complete Test
            </>
          )}
        </button>
      </div>

      {results && (
        <div className={styles.overallStatus}>
          <div className={`${styles.statusCard} ${styles[overallStatus]}`}>
            <div className={styles.statusIcon}>
              {overallStatus === 'success' && <FaCheckCircle />}
              {overallStatus === 'warning' && <FaExclamationTriangle />}
              {overallStatus === 'error' && <FaTimes />}
            </div>
            <div className={styles.statusContent}>
              <h3>
                {overallStatus === 'success' && 'Database Ready ✅'}
                {overallStatus === 'warning' && 'Issues Detected ⚠️'}
                {overallStatus === 'error' && 'Critical Issues ❌'}
              </h3>
              <p>
                {overallStatus === 'success' && 'Your database is properly configured and ready for production use.'}
                {overallStatus === 'warning' && 'Some non-critical issues were found. Review the details below.'}
                {overallStatus === 'error' && 'Critical issues prevent proper database operation. Please fix these first.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.results}>
        {renderSetupResults()}
        {renderUserResults()}
      </div>

      {!user && (
        <div className={styles.signInPrompt}>
          <FaUser />
          <p>Sign in to test user-specific database operations and security policies</p>
        </div>
      )}

      <div className={styles.instructions}>
        <h3>Next Steps:</h3>
        <ol>
          <li>
            <strong>Run Database Migrations:</strong> Go to your Supabase dashboard → SQL Editor and run the migration files in order
          </li>
          <li>
            <strong>Test Database Setup:</strong> Click "Test Database Setup" to verify tables and functions
          </li>
          <li>
            <strong>Sign In & Test:</strong> Create a test account and run user operation tests
          </li>
          <li>
            <strong>Fix Any Issues:</strong> Address any failed tests before going to production
          </li>
        </ol>
      </div>
    </div>
  )
}

export default DatabaseSetupChecker
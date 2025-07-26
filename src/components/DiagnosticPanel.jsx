import React, { useState, useEffect } from 'react'
import { runDiagnostics } from '../utils/diagnostics'
import styles from './DiagnosticPanel.module.css'
import { FaPlay, FaCheckCircle, FaExclamationTriangle, FaTimes, FaSpinner } from 'react-icons/fa'

const DiagnosticPanel = () => {
  const [results, setResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [autoRun, setAutoRun] = useState(true)

  useEffect(() => {
    if (autoRun) {
      runDiagnostic()
    }
  }, [])

  const runDiagnostic = async () => {
    setIsRunning(true)
    try {
      const diagnosticResults = await runDiagnostics()
      setResults(diagnosticResults)
    } catch (error) {
      console.error('Diagnostic failed:', error)
      setResults({
        success: false,
        issues: [`Diagnostic failed: ${error.message}`],
        fixes: ['Check browser console for detailed errors']
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (success) => {
    if (success) return <FaCheckCircle className={styles.successIcon} />
    return <FaExclamationTriangle className={styles.errorIcon} />
  }

  return (
    <div className={styles.diagnosticPanel}>
      <div className={styles.header}>
        <h2>🔍 System Diagnostics</h2>
        <button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          className={styles.runButton}
        >
          {isRunning ? (
            <>
              <FaSpinner className={styles.spinner} />
              Running...
            </>
          ) : (
            <>
              <FaPlay />
              Run Diagnostics
            </>
          )}
        </button>
      </div>

      {results && (
        <div className={styles.results}>
          <div className={`${styles.statusCard} ${results.success ? styles.success : styles.error}`}>
            {getStatusIcon(results.success)}
            <div className={styles.statusContent}>
              <h3>
                {results.success ? 'All Systems Operational' : 'Issues Detected'}
              </h3>
              <p>
                {results.success 
                  ? 'Your Invoice Direct setup is working correctly!'
                  : `Found ${results.issues.length} issue(s) that need attention.`
                }
              </p>
            </div>
          </div>

          {!results.success && (
            <>
              <div className={styles.section}>
                <h3>❌ Issues Found:</h3>
                <ul className={styles.issuesList}>
                  {results.issues.map((issue, index) => (
                    <li key={index} className={styles.issueItem}>
                      <FaTimes className={styles.issueIcon} />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.section}>
                <h3>🔧 Recommended Fixes:</h3>
                <ol className={styles.fixesList}>
                  {results.fixes.map((fix, index) => (
                    <li key={index} className={styles.fixItem}>
                      {fix}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.quickActions}>
        <h3>🚀 Quick Actions:</h3>
        <div className={styles.actionButtons}>
          <button 
            onClick={() => {
              const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_key_here

# Stripe Configuration (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here`
              
              navigator.clipboard.writeText(envContent)
              alert('Environment template copied to clipboard! Create .env file and paste this content.')
            }}
            className={styles.actionButton}
          >
            📋 Copy .env Template
          </button>
          
          <button 
            onClick={() => {
              window.open('https://supabase.com/dashboard', '_blank')
            }}
            className={styles.actionButton}
          >
            🔗 Open Supabase Dashboard
          </button>
          
          <button 
            onClick={() => {
              window.location.reload()
            }}
            className={styles.actionButton}
          >
            🔄 Restart App
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiagnosticPanel
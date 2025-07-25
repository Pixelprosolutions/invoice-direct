import React, { useState, useEffect } from 'react'
import { checkSupabaseConfig, displayConfigStatus } from '../utils/configCheck'
import styles from './ConfigChecker.module.css'

const ConfigChecker = () => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const runCheck = async () => {
    setLoading(true)
    try {
      const configResults = await checkSupabaseConfig()
      displayConfigStatus(configResults)
      setResults(configResults)
    } catch (error) {
      console.error('Config check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runCheck()
  }, [])

  const getStatusIcon = (status) => status ? '✅' : '❌'
  const getStatusText = (status) => status ? 'Working' : 'Failed'

  if (!results && loading) {
    return (
      <div className={styles.container}>
        <h3>Checking Supabase Configuration...</h3>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  if (!results) return null

  const allGood = Object.values(results).every(Boolean)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Supabase Configuration Status</h3>
        <button onClick={runCheck} disabled={loading} className={styles.refreshButton}>
          {loading ? 'Checking...' : 'Refresh Check'}
        </button>
      </div>

      <div className={styles.statusGrid}>
        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.envVariables)}</span>
          <span className={styles.label}>Environment Variables</span>
          <span className={styles.status}>{getStatusText(results.envVariables)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.connection)}</span>
          <span className={styles.label}>Connection</span>
          <span className={styles.status}>{getStatusText(results.connection)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.auth)}</span>
          <span className={styles.label}>Authentication</span>
          <span className={styles.status}>{getStatusText(results.auth)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.database)}</span>
          <span className={styles.label}>Database Access</span>
          <span className={styles.status}>{getStatusText(results.database)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.tables)}</span>
          <span className={styles.label}>Required Tables</span>
          <span className={styles.status}>{getStatusText(results.tables)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.rls)}</span>
          <span className={styles.label}>Row Level Security</span>
          <span className={styles.status}>{getStatusText(results.rls)}</span>
        </div>

        <div className={styles.statusItem}>
          <span className={styles.icon}>{getStatusIcon(results.functions)}</span>
          <span className={styles.label}>Custom Functions</span>
          <span className={styles.status}>{getStatusText(results.functions)}</span>
        </div>
      </div>

      <div className={`${styles.overallStatus} ${allGood ? styles.success : styles.warning}`}>
        <h4>
          {allGood ? '✅ Configuration Complete' : '⚠️ Configuration Issues Detected'}
        </h4>
        <p>
          {allGood 
            ? 'All Supabase components are properly configured and working.'
            : 'Some components need attention. Check the console for detailed error messages.'
          }
        </p>
      </div>

      <div className={styles.actions}>
        <p className={styles.note}>
          Check the browser console for detailed logs and error messages.
        </p>
      </div>
    </div>
  )
}

export default ConfigChecker

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { generatePDF } from '../utils/pdfGenerator'
import { useInvoice } from '../context/InvoiceContext'
import { useAuth } from '../context/AuthContext'
import styles from './MVPStatusChecker.module.css'

const MVPStatusChecker = () => {
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const { invoiceData } = useInvoice()
  const { user } = useAuth()

  const runTests = async () => {
    setIsRunning(true)
    const results = {}

    // Test 1: Invoice Data
    try {
      results.invoiceData = {
        status: invoiceData ? 'PASS' : 'FAIL',
        message: invoiceData ? 'Invoice data loaded' : 'No invoice data found'
      }
    } catch (error) {
      results.invoiceData = { status: 'FAIL', message: error.message }
    }

    // Test 2: PDF Generation
    try {
      const testElement = document.createElement('div')
      testElement.innerHTML = '<h1>Test Invoice</h1><p>Test content</p>'
      document.body.appendChild(testElement)
      
      await generatePDF(testElement, 'test', true)
      document.body.removeChild(testElement)
      
      results.pdfGeneration = { status: 'PASS', message: 'PDF generation working' }
    } catch (error) {
      results.pdfGeneration = { status: 'FAIL', message: `PDF Error: ${error.message}` }
    }

    // Test 3: Authentication
    results.authentication = {
      status: user ? 'PASS' : 'INFO',
      message: user ? `Logged in as ${user.email}` : 'Not logged in (optional for MVP)'
    }

    // Test 4: Local Storage
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      results.localStorage = { status: 'PASS', message: 'Local storage working' }
    } catch (error) {
      results.localStorage = { status: 'FAIL', message: 'Local storage not available' }
    }

    // Test 5: Form Validation
    const hasRequiredFields = invoiceData?.businessName && invoiceData?.clientName && invoiceData?.lineItems?.length > 0
    results.formValidation = {
      status: hasRequiredFields ? 'PASS' : 'WARN',
      message: hasRequiredFields ? 'Required fields present' : 'Some required fields missing'
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return '#10B981'
      case 'FAIL': return '#EF4444'
      case 'WARN': return '#F59E0B'
      case 'INFO': return '#3B82F6'
      default: return '#6B7280'
    }
  }

  return (
    <div className={styles.checker}>
      <div className={styles.header}>
        <h3>MVP Status Checker</h3>
        <button 
          onClick={runTests} 
          disabled={isRunning}
          className={styles.testButton}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className={styles.results}>
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className={styles.testResult}>
              <div className={styles.testName}>{test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div 
                className={styles.testStatus}
                style={{ color: getStatusColor(result.status) }}
              >
                {result.status}
              </div>
              <div className={styles.testMessage}>{result.message}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.mvpChecklist}>
        <h4>MVP Requirements Checklist:</h4>
        <ul>
          <li>✅ Invoice form with business/client details</li>
          <li>✅ Line items with quantity, price, tax</li>
          <li>✅ Professional invoice preview</li>
          <li>❓ PDF download (test above)</li>
          <li>✅ Responsive design</li>
          <li>✅ Local storage persistence</li>
          <li>✅ Basic validation</li>
          <li>✅ Professional styling</li>
        </ul>
      </div>
    </div>
  )
}

export default MVPStatusChecker

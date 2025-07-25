import React from 'react'
import { FaCreditCard, FaUniversity, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import styles from './PaymentTermsForm.module.css'

const PaymentTermsForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    onChange({ [name]: type === 'checkbox' ? checked : value })
  }

  const handlePaymentMethodChange = (method, checked) => {
    const currentMethods = data.paymentMethods || []
    if (checked) {
      onChange({ paymentMethods: [...currentMethods, method] })
    } else {
      onChange({ paymentMethods: currentMethods.filter(m => m !== method) })
    }
  }

  const paymentTermsOptions = [
    { value: '0', label: 'Due immediately' },
    { value: '15', label: 'Net 15 days' },
    { value: '30', label: 'Net 30 days' },
    { value: '45', label: 'Net 45 days' },
    { value: '60', label: 'Net 60 days' },
    { value: 'custom', label: 'Custom terms' }
  ]

  const paymentMethods = [
    { value: 'Bank Transfer', label: 'Bank Transfer / ACH' },
    { value: 'Wire Transfer', label: 'Wire Transfer' },
    { value: 'Check', label: 'Check' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'Cryptocurrency', label: 'Cryptocurrency' }
  ]

  return (
    <div className={styles.paymentTermsForm}>
      <div className={styles.formSection}>
        <h3>
          <FaClock className={styles.sectionIcon} />
          Default Payment Terms
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="defaultPaymentTerms">Payment Terms</label>
            <select
              id="defaultPaymentTerms"
              name="defaultPaymentTerms"
              value={data.defaultPaymentTerms}
              onChange={handleChange}
            >
              {paymentTermsOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {data.defaultPaymentTerms === 'custom' && (
            <div className={styles.formGroup}>
              <label htmlFor="customTerms">Custom Payment Terms</label>
              <textarea
                id="customTerms"
                name="customTerms"
                value={data.customTerms || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your custom payment terms..."
              />
            </div>
          )}
        </div>

        <div className={styles.paymentMethodsSection}>
          <h4>Accepted Payment Methods</h4>
          <div className={styles.methodsGrid}>
            {paymentMethods.map(method => (
              <label key={method.value} className={styles.methodOption}>
                <input
                  type="checkbox"
                  checked={(data.paymentMethods || []).includes(method.value)}
                  onChange={(e) => handlePaymentMethodChange(method.value, e.target.checked)}
                />
                <span className={styles.methodLabel}>{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaUniversity className={styles.sectionIcon} />
          Bank Details
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={data.bankName}
              onChange={handleChange}
              placeholder="Your Bank Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bankAccountNumber">Account Number</label>
            <input
              type="text"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={data.bankAccountNumber}
              onChange={handleChange}
              placeholder="1234567890"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bankRoutingNumber">Routing Number</label>
            <input
              type="text"
              id="bankRoutingNumber"
              name="bankRoutingNumber"
              value={data.bankRoutingNumber}
              onChange={handleChange}
              placeholder="123456789"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bankSwiftCode">SWIFT/BIC Code</label>
            <input
              type="text"
              id="bankSwiftCode"
              name="bankSwiftCode"
              value={data.bankSwiftCode}
              onChange={handleChange}
              placeholder="ABCDUS33XXX"
            />
          </div>
        </div>

        <div className={styles.bankNote}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <p>Bank details will be displayed on invoices. Ensure accuracy before saving.</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaExclamationTriangle className={styles.sectionIcon} />
          Late Fees & Penalties
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="lateFee">Late Fee Amount</label>
            <div className={styles.inputGroup}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="number"
                id="lateFee"
                name="lateFee"
                value={data.lateFee}
                onChange={handleChange}
                placeholder="25.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lateFeePeriod">Late Fee Period</label>
            <select
              id="lateFeePeriod"
              name="lateFeePeriod"
              value={data.lateFeePeriod}
              onChange={handleChange}
            >
              <option value="15">After 15 days</option>
              <option value="30">After 30 days</option>
              <option value="45">After 45 days</option>
              <option value="60">After 60 days</option>
            </select>
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="lateFeeDescription">Late Fee Description</label>
            <textarea
              id="lateFeeDescription"
              name="lateFeeDescription"
              value={data.lateFeeDescription || ''}
              onChange={handleChange}
              rows={2}
              placeholder="A late fee will be applied to overdue invoices..."
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaCreditCard className={styles.sectionIcon} />
          Payment Instructions
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="paymentInstructions">Default Payment Instructions</label>
            <textarea
              id="paymentInstructions"
              name="paymentInstructions"
              value={data.paymentInstructions || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Please make payment within the specified terms. Include invoice number in payment reference..."
            />
          </div>
        </div>

        <div className={styles.instructionTips}>
          <h4>Tips for Payment Instructions:</h4>
          <ul>
            <li>Include specific payment methods you accept</li>
            <li>Provide clear bank details for wire transfers</li>
            <li>Mention any payment processing fees</li>
            <li>Add contact information for payment inquiries</li>
            <li>Include late fee policies if applicable</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PaymentTermsForm

import React from 'react'
import { FaTimes, FaEdit, FaCheck, FaCrown, FaEye } from 'react-icons/fa'
import styles from './TemplatePreview.module.css'

const TemplatePreview = ({ template, onClose, onEdit, onApply }) => {
  // Sample invoice data for preview
  const sampleData = {
    businessName: 'Your Business Name',
    businessAddress: '123 Business Street\nCity, State 12345',
    businessPhone: '(555) 123-4567',
    businessEmail: 'hello@yourbusiness.com',
    
    clientName: 'Sample Client',
    clientAddress: '456 Client Avenue\nClient City, State 67890',
    clientEmail: 'client@email.com',
    
    invoiceNumber: 'INV-001',
    invoiceDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    
    lineItems: [
      { description: 'Professional Consulting', quantity: 10, rate: 150, amount: 1500 },
      { description: 'Project Management', quantity: 5, rate: 120, amount: 600 },
      { description: 'Website Design', quantity: 1, rate: 2500, amount: 2500 }
    ],
    
    subtotal: 4600,
    tax: template.defaults.taxRate ? (4600 * template.defaults.taxRate / 100) : 0,
    total: 4600 + (template.defaults.taxRate ? (4600 * template.defaults.taxRate / 100) : 0),
    
    paymentTerms: template.defaults.paymentTerms,
    notes: template.defaults.notes
  }

  const getLayoutStyles = () => {
    const { branding, layout } = template
    
    return {
      '--primary-color': branding.primaryColor,
      '--secondary-color': branding.secondaryColor,
      '--accent-color': branding.accentColor,
      '--font-family': branding.fontFamily,
      '--font-size': branding.fontSize === 'small' ? '0.8rem' : 
                     branding.fontSize === 'large' ? '1.1rem' : '1rem'
    }
  }

  const getHeaderClass = () => {
    const { headerStyle } = template.layout
    return `${styles.invoiceHeader} ${styles[`header${headerStyle.charAt(0).toUpperCase() + headerStyle.slice(1)}`]}`
  }

  const getTableClass = () => {
    const { tableStyle } = template.layout
    return `${styles.itemsTable} ${styles[`table${tableStyle.charAt(0).toUpperCase() + tableStyle.slice(1)}`]}`
  }

  const getSpacingClass = () => {
    const { spacing } = template.layout
    return styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`]
  }

  return (
    <div className={styles.templatePreview}>
      <div className={styles.previewHeader}>
        <div className={styles.previewInfo}>
          <div className={styles.templateTitle}>
            <h2>{template.name}</h2>
            {template.isPremium && (
              <div className={styles.premiumBadge}>
                <FaCrown /> Premium
              </div>
            )}
          </div>
          <p>{template.description}</p>
          <div className={styles.templateMeta}>
            <span className={styles.industry}>{template.industry}</span>
            <span className={styles.category}>{template.category}</span>
          </div>
        </div>
        
        <div className={styles.previewActions}>
          <button onClick={onEdit} className={styles.editButton}>
            <FaEdit /> Customize
          </button>
          <button onClick={onApply} className={styles.applyButton}>
            <FaCheck /> Use Template
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
      </div>

      <div className={styles.previewContainer}>
        <div className={styles.invoiceContainer} style={getLayoutStyles()}>
          <div className={`${styles.invoice} ${getSpacingClass()}`}>
            
            {/* Invoice Header */}
            <div className={getHeaderClass()}>
              <div className={styles.businessSection}>
                <h1 className={styles.businessName}>{sampleData.businessName}</h1>
                <div className={styles.businessAddress}>
                  {sampleData.businessAddress.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className={styles.businessContact}>
                  <div>{sampleData.businessPhone}</div>
                  <div>{sampleData.businessEmail}</div>
                </div>
              </div>
              
              <div className={styles.invoiceTitle}>
                <h2>INVOICE</h2>
                <div className={styles.invoiceNumber}>#{sampleData.invoiceNumber}</div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className={styles.invoiceDetails}>
              <div className={styles.invoiceInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Invoice Date:</span>
                  <span className={styles.value}>{sampleData.invoiceDate}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Due Date:</span>
                  <span className={styles.value}>{sampleData.dueDate}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Payment Terms:</span>
                  <span className={styles.value}>{sampleData.paymentTerms}</span>
                </div>
              </div>
              
              <div className={styles.clientInfo}>
                <h3>Bill To:</h3>
                <div className={styles.clientName}>{sampleData.clientName}</div>
                <div className={styles.clientAddress}>
                  {sampleData.clientAddress.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className={styles.clientEmail}>{sampleData.clientEmail}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className={getTableClass()}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Subtotal</td>
                  <td>${sampleData.subtotal.toFixed(2)}</td>
                </tr>
                {sampleData.tax > 0 && (
                  <tr>
                    <td colSpan="3">Tax ({template.defaults.taxRate}%)</td>
                    <td>${sampleData.tax.toFixed(2)}</td>
                  </tr>
                )}
                <tr className={styles.totalRow}>
                  <td colSpan="3">Total</td>
                  <td>${sampleData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Notes */}
            {sampleData.notes && (
              <div className={styles.notesSection}>
                <h3>Notes</h3>
                <p>{sampleData.notes}</p>
              </div>
            )}

            {/* Footer */}
            {template.layout.footerIncluded && (
              <div className={styles.invoiceFooter}>
                <p>Thank you for your business!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview

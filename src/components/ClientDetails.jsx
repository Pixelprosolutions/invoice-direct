import React, { useState, useEffect } from 'react'
import { FaEdit, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaIdCard, FaStickyNote, FaFileInvoice, FaCalendar, FaDollarSign } from 'react-icons/fa'
import styles from './ClientDetails.module.css'

const ClientDetails = ({ client, onClose, onEdit }) => {
  const [invoiceHistory, setInvoiceHistory] = useState([])
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    averageAmount: 0,
    lastInvoiceDate: null
  })

  useEffect(() => {
    // Load invoice history for this client from localStorage
    const savedInvoices = localStorage.getItem('savedInvoices')
    if (savedInvoices) {
      try {
        const invoices = JSON.parse(savedInvoices)
        const clientInvoices = invoices.filter(invoice => 
          invoice.invoiceData?.clientDetails?.email === client.email ||
          invoice.invoiceData?.clientDetails?.name === client.name
        )
        
        setInvoiceHistory(clientInvoices)
        
        // Calculate stats
        const totalAmount = clientInvoices.reduce((sum, invoice) => 
          sum + (parseFloat(invoice.invoiceData?.total) || 0), 0
        )
        
        const stats = {
          totalInvoices: clientInvoices.length,
          totalAmount,
          averageAmount: clientInvoices.length > 0 ? totalAmount / clientInvoices.length : 0,
          lastInvoiceDate: clientInvoices.length > 0 ? 
            new Date(Math.max(...clientInvoices.map(inv => new Date(inv.date || inv.invoiceData?.date)))).toLocaleDateString() : 
            null
        }
        
        setStats(stats)
      } catch (error) {
        console.error('Error loading invoice history:', error)
      }
    }
  }, [client])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className={styles.clientDetails}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>{client.name}</h2>
          {client.company && <p className={styles.company}>{client.company}</p>}
          <span className={`${styles.statusBadge} ${styles[client.status || 'active']}`}>
            {client.status || 'Active'}
          </span>
        </div>
        <div className={styles.headerActions}>
          <button onClick={onEdit} className={styles.editButton}>
            <FaEdit /> Edit
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Contact Information */}
        <div className={styles.section}>
          <h3>Contact Information</h3>
          <div className={styles.contactGrid}>
            {client.email && (
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <div>
                  <label>Email</label>
                  <span>{client.email}</span>
                </div>
              </div>
            )}
            
            {client.phone && (
              <div className={styles.contactItem}>
                <FaPhone className={styles.icon} />
                <div>
                  <label>Phone</label>
                  <span>{client.phone}</span>
                </div>
              </div>
            )}
            
            {client.company && (
              <div className={styles.contactItem}>
                <FaBuilding className={styles.icon} />
                <div>
                  <label>Company</label>
                  <span>{client.company}</span>
                </div>
              </div>
            )}
            
            {client.taxId && (
              <div className={styles.contactItem}>
                <FaIdCard className={styles.icon} />
                <div>
                  <label>Tax ID</label>
                  <span>{client.taxId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        {(client.address || client.city || client.state || client.zipCode || client.country) && (
          <div className={styles.section}>
            <h3>Address</h3>
            <div className={styles.addressItem}>
              <FaMapMarkerAlt className={styles.icon} />
              <div className={styles.address}>
                {client.address && <div>{client.address}</div>}
                {(client.city || client.state || client.zipCode) && (
                  <div>
                    {client.city}{client.city && client.state && ', '}{client.state} {client.zipCode}
                  </div>
                )}
                {client.country && <div>{client.country}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Invoice Statistics */}
        <div className={styles.section}>
          <h3>Invoice Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <FaFileInvoice className={styles.statIcon} />
              <div>
                <h4>{stats.totalInvoices}</h4>
                <p>Total Invoices</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaDollarSign className={styles.statIcon} />
              <div>
                <h4>{formatCurrency(stats.totalAmount)}</h4>
                <p>Total Billed</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaDollarSign className={styles.statIcon} />
              <div>
                <h4>{formatCurrency(stats.averageAmount)}</h4>
                <p>Average Invoice</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaCalendar className={styles.statIcon} />
              <div>
                <h4>{stats.lastInvoiceDate || 'Never'}</h4>
                <p>Last Invoice</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className={styles.section}>
          <h3>Recent Invoices</h3>
          {invoiceHistory.length > 0 ? (
            <div className={styles.invoiceList}>
              {invoiceHistory.slice(0, 5).map((invoice, index) => (
                <div key={index} className={styles.invoiceItem}>
                  <div className={styles.invoiceInfo}>
                    <h4>Invoice #{invoice.invoiceData?.invoiceNumber || `INV-${index + 1}`}</h4>
                    <p>{formatDate(invoice.date || invoice.invoiceData?.date)}</p>
                  </div>
                  <div className={styles.invoiceAmount}>
                    {formatCurrency(invoice.invoiceData?.total)}
                  </div>
                </div>
              ))}
              {invoiceHistory.length > 5 && (
                <p className={styles.moreInvoices}>
                  And {invoiceHistory.length - 5} more invoice{invoiceHistory.length - 5 !== 1 ? 's' : ''}...
                </p>
              )}
            </div>
          ) : (
            <div className={styles.noInvoices}>
              <FaFileInvoice />
              <p>No invoices created for this client yet</p>
            </div>
          )}
        </div>

        {/* Notes */}
        {client.notes && (
          <div className={styles.section}>
            <h3>Notes</h3>
            <div className={styles.notesItem}>
              <FaStickyNote className={styles.icon} />
              <p>{client.notes}</p>
            </div>
          </div>
        )}

        {/* Client Created Date */}
        <div className={styles.section}>
          <h3>Client Information</h3>
          <div className={styles.metaInfo}>
            <p><strong>Added:</strong> {formatDate(client.createdAt)}</p>
            <p><strong>Status:</strong> {client.status || 'Active'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDetails

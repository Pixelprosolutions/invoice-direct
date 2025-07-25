import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { FaCopy, FaEnvelope, FaRedoAlt, FaSpinner, FaBolt } from 'react-icons/fa'
import { useInvoice } from '../context/InvoiceContext'
import { useAuth } from '../context/AuthContext'
import styles from './QuickActions.module.css'

const QuickActions = ({ onCreateInvoice, onSetActiveView }) => {
  const { updateInvoiceData, resetInvoiceData } = useInvoice()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(null)

  const getLastInvoice = () => {
    const savedInvoices = localStorage.getItem('savedInvoices')
    if (savedInvoices) {
      try {
        const invoices = JSON.parse(savedInvoices)
        return invoices.length > 0 ? invoices[invoices.length - 1] : null
      } catch (error) {
        console.error('Error loading invoices:', error)
        return null
      }
    }
    return null
  }

  const generateInvoiceNumber = () => {
    return `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  }

  const handleDuplicateLastInvoice = async () => {
    setIsLoading('duplicate')
    
    try {
      const lastInvoice = getLastInvoice()
      
      if (!lastInvoice) {
        toast.error('No previous invoices found to duplicate')
        return
      }

      // Create a copy with new invoice number and current date
      const duplicatedInvoice = {
        ...lastInvoice.invoiceData,
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending'
      }

      // Update the invoice context with duplicated data
      updateInvoiceData(duplicatedInvoice)
      
      // Switch to create view
      onSetActiveView('create')
      
      toast.success('Last invoice duplicated successfully!')
      
    } catch (error) {
      console.error('Error duplicating invoice:', error)
      toast.error('Failed to duplicate invoice')
    } finally {
      setIsLoading(null)
    }
  }

  const handleSendPaymentReminder = async () => {
    setIsLoading('reminder')
    
    try {
      const savedInvoices = localStorage.getItem('savedInvoices')
      let unpaidInvoices = []
      
      if (savedInvoices) {
        const invoices = JSON.parse(savedInvoices)
        unpaidInvoices = invoices.filter(invoice => 
          invoice.invoiceData?.status === 'pending' || 
          invoice.invoiceData?.status === 'overdue'
        )
      }

      if (unpaidInvoices.length === 0) {
        toast.info('No unpaid invoices found')
        return
      }

      // Get the most recent unpaid invoice for the reminder
      const invoiceToRemind = unpaidInvoices[unpaidInvoices.length - 1]
      const invoiceData = invoiceToRemind.invoiceData

      // Create email template
      const subject = `Payment Reminder: Invoice ${invoiceData.invoiceNumber}`
      const body = `Dear ${invoiceData.clientName || 'Valued Client'},

This is a friendly reminder that payment for Invoice ${invoiceData.invoiceNumber} is now due.

Invoice Details:
- Invoice Number: ${invoiceData.invoiceNumber}
- Amount Due: ${invoiceData.total ? `$${parseFloat(invoiceData.total).toFixed(2)}` : 'N/A'}
- Due Date: ${invoiceData.dueDate || 'N/A'}

Please process payment at your earliest convenience. If you have any questions or concerns, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${invoiceData.businessName || 'Your Business Name'}
${invoiceData.contactInfo?.email || 'your-email@business.com'}
${invoiceData.contactInfo?.phone || 'your-phone-number'}`

      // Open email client
      const emailUrl = `mailto:${invoiceData.clientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.location.href = emailUrl
      
      toast.success('Payment reminder email template opened!')
      
    } catch (error) {
      console.error('Error creating payment reminder:', error)
      toast.error('Failed to create payment reminder')
    } finally {
      setIsLoading(null)
    }
  }

  const handleCreateRecurringInvoice = async () => {
    setIsLoading('recurring')
    
    try {
      // Get business profile for template
      const businessProfile = localStorage.getItem('businessProfile')
      let businessData = {}
      
      if (businessProfile) {
        const profile = JSON.parse(businessProfile)
        businessData = {
          businessName: profile.businessName || 'Your Business Name',
          businessAddress: `${profile.businessAddress || ''}\n${profile.businessCity || ''}, ${profile.businessState || ''} ${profile.businessZip || ''}`.trim(),
          contactInfo: {
            email: profile.businessEmail || 'hello@yourbusiness.com',
            phone: profile.businessPhone || '+1 (555) 123-4567'
          }
        }
      }

      // Create recurring invoice template
      const recurringInvoice = {
        ...businessData,
        clientName: 'Recurring Client',
        clientAddress: 'Client Address\nCity, State ZIP',
        clientEmail: 'client@email.com',
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: [
          {
            id: Date.now().toString(),
            description: 'Monthly Service Fee',
            quantity: 1,
            unitPrice: 100,
            tax: 0
          }
        ],
        notes: 'This is a recurring invoice. Thank you for your continued business!',
        terms: 'Net 30 days. This invoice will be sent automatically each month.',
        status: 'pending',
        isRecurring: true,
        recurringFrequency: 'monthly'
      }

      // Update the invoice context
      updateInvoiceData(recurringInvoice)
      
      // Switch to create view
      onSetActiveView('create')
      
      toast.success('Recurring invoice template created!')
      
    } catch (error) {
      console.error('Error creating recurring invoice:', error)
      toast.error('Failed to create recurring invoice template')
    } finally {
      setIsLoading(null)
    }
  }

  const quickActions = [
    {
      id: 'duplicate',
      title: 'Duplicate Last Invoice',
      description: 'Copy your most recent invoice with updated details',
      icon: FaCopy,
      color: 'blue',
      onClick: handleDuplicateLastInvoice,
      loading: isLoading === 'duplicate'
    },
    {
      id: 'reminder',
      title: 'Send Payment Reminder',
      description: 'Generate email reminder for unpaid invoices',
      icon: FaEnvelope,
      color: 'orange',
      onClick: handleSendPaymentReminder,
      loading: isLoading === 'reminder'
    },
    {
      id: 'recurring',
      title: 'Create Recurring Invoice',
      description: 'Set up template for regular billing cycles',
      icon: FaRedoAlt,
      color: 'green',
      onClick: handleCreateRecurringInvoice,
      loading: isLoading === 'recurring'
    }
  ]

  return (
    <div className={styles.quickActions}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <FaBolt className={styles.headerIcon} />
          <div>
            <h3>Quick Actions</h3>
            <p>Common tasks to speed up your workflow</p>
          </div>
        </div>
      </div>

      <div className={styles.actionsGrid}>
        {quickActions.map(action => {
          const IconComponent = action.icon
          return (
            <button
              key={action.id}
              className={`${styles.actionButton} ${styles[action.color]} ${action.loading ? styles.loading : ''}`}
              onClick={action.onClick}
              disabled={action.loading}
            >
              <div className={styles.actionIcon}>
                {action.loading ? (
                  <FaSpinner className={styles.spinner} />
                ) : (
                  <IconComponent />
                )}
              </div>
              <div className={styles.actionContent}>
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
              <div className={styles.actionArrow}>→</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions

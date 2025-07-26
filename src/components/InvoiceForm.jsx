import React from 'react';
import { toast } from 'react-toastify';
import { useInvoice } from '../context/InvoiceContext';
import { useAuth } from '../context/AuthContext';
import LineItems from './LineItems';
import styles from './InvoiceForm.module.css';
import { FaSave, FaEye, FaUndo, FaArrowLeft } from 'react-icons/fa';

const InvoiceForm = ({ onPreview, onNavigateHome }) => {
  const { invoiceData, updateInvoiceData, resetInvoiceData, appliedTemplate } = useInvoice();
  const { canCreateInvoice, getRemainingInvoices, isPremium } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updateInvoiceData({
        [parent]: {
          ...invoiceData[parent],
          [child]: value
        }
      });
    } else {
      updateInvoiceData({ [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check invoice limits for free users
    if (!canCreateInvoice()) {
      toast.error(`You have reached your free invoice limit (3 invoices). Please upgrade to create more invoices.`);
      return;
    }
    // Basic validation
    if (!invoiceData.businessName || !invoiceData.clientName) {
      toast.error('Please fill in business name and client name');
      return;
    }
    
    if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }
    
    // Save to localStorage as backup
    try {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData));

      // Also save to invoice history for Quick Actions
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const invoiceRecord = {
        id: Date.now().toString(),
        invoiceData: { ...invoiceData },
        date: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Add to history (keep last 50 invoices)
      savedInvoices.push(invoiceRecord);
      if (savedInvoices.length > 50) {
        savedInvoices.shift(); // Remove oldest
      }

      localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
      toast.success('Invoice saved successfully!');

      // Trigger preview
      if (onPreview) {
        onPreview();
      }
    } catch (error) {
      console.error('Failed to save invoice:', error.message || error);
      toast.error(`Failed to save invoice: ${error.message || 'Please try again.'}`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      resetInvoiceData();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <div className={styles.headerContent}>
          <div className="title-row">
            <button
              type="button"
              onClick={onNavigateHome}
              className="back-button"
              title="Back to Home"
            >
              <FaArrowLeft />
            </button>
            <h2>Invoice Details</h2>
          </div>
          {!isPremium() && (
            <div className={styles.limitIndicator}>
              <span>📊 Free Plan: {getRemainingInvoices()} invoice{getRemainingInvoices() !== 1 ? 's' : ''} remaining</span>
            </div>
          )}
          {appliedTemplate && (
            <div className={styles.templateIndicator}>
              <span>📋 Using template: <strong>{appliedTemplate.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Business Information</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={invoiceData?.businessName || ''}
              onChange={handleChange}
              placeholder="Your Business Name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="businessAddress">Business Address</label>
            <textarea
              id="businessAddress"
              name="businessAddress"
              value={invoiceData?.businessAddress || ''}
              onChange={handleChange}
              placeholder="Your Business Address"
              rows="3"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="contactInfo.email">Email</label>
            <input
              type="email"
              id="contactInfo.email"
              name="contactInfo.email"
              value={invoiceData?.contactInfo?.email || ''}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="contactInfo.phone">Phone</label>
            <input
              type="tel"
              id="contactInfo.phone"
              name="contactInfo.phone"
              value={invoiceData?.contactInfo?.phone || ''}
              onChange={handleChange}
              placeholder="Your Phone Number"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Client Information</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={invoiceData?.clientName || ''}
              onChange={handleChange}
              placeholder="Client Name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="clientAddress">Client Address</label>
            <textarea
              id="clientAddress"
              name="clientAddress"
              value={invoiceData?.clientAddress || ''}
              onChange={handleChange}
              placeholder="Client Address"
              rows="3"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="clientEmail">Client Email</label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={invoiceData?.clientEmail || ''}
              onChange={handleChange}
              placeholder="client@email.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="clientPhone">Client Phone</label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={invoiceData?.clientPhone || ''}
              onChange={handleChange}
              placeholder="Client Phone Number"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Invoice Details</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="invoiceNumber">Invoice Number</label>
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={invoiceData?.invoiceNumber || ''}
              onChange={handleChange}
              placeholder="INV-001"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="invoiceDate">Invoice Date</label>
            <input
              type="date"
              id="invoiceDate"
              name="invoiceDate"
              value={invoiceData?.invoiceDate || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={invoiceData?.dueDate || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="poNumber">PO Number (Optional)</label>
            <input
              type="text"
              id="poNumber"
              name="poNumber"
              value={invoiceData?.poNumber || ''}
              onChange={handleChange}
              placeholder="PO-001"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Line Items</h3>
        <LineItems />
      </div>

      <div className={styles.formSection}>
        <h3>Payment Details</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="bankDetails.accountName">Account Name</label>
            <input
              type="text"
              id="bankDetails.accountName"
              name="bankDetails.accountName"
              value={invoiceData?.bankDetails?.accountName || ''}
              onChange={handleChange}
              placeholder="Account Name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="bankDetails.accountNumber">Account Number</label>
            <input
              type="text"
              id="bankDetails.accountNumber"
              name="bankDetails.accountNumber"
              value={invoiceData?.bankDetails?.accountNumber || ''}
              onChange={handleChange}
              placeholder="Account Number"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="bankDetails.sortCode">Sort Code</label>
            <input
              type="text"
              id="bankDetails.sortCode"
              name="bankDetails.sortCode"
              value={invoiceData?.bankDetails?.sortCode || ''}
              onChange={handleChange}
              placeholder="Sort Code"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Additional Info</h3>
        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={invoiceData?.notes || ''}
            onChange={handleChange}
            placeholder="Additional notes for the client"
            rows="3"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="terms">Terms & Conditions</label>
          <textarea
            id="terms"
            name="terms"
            value={invoiceData?.terms || ''}
            onChange={handleChange}
            placeholder="Terms and conditions"
            rows="3"
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button 
          type="button" 
          className={`${styles.button} ${styles.previewButton}`}
          onClick={onPreview}
        >
          <FaEye /> Preview
        </button>
        <button 
          type="submit" 
          className={`${styles.button} ${styles.saveButton}`}
        >
          <FaSave /> Save
        </button>
        <button 
          type="button" 
          className={`${styles.button} ${styles.resetButton}`}
          onClick={handleReset}
        >
          <FaUndo /> Reset
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;

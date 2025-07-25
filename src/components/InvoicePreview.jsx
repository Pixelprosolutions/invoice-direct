import React, { useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaDownload, FaPrint, FaEnvelope, FaShare } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { calculateTotals, formatCurrency, formatDate } from '../utils/helpers';
import { useInvoice } from '../context/InvoiceContext';
import { useAuth } from '../context/AuthContext';
import { saveInvoice, incrementInvoiceCount } from '../lib/supabase';
import styles from './InvoicePreview.module.css';
import ActionButtons from './ActionButtons';
import Watermark from './Watermark';

function InvoicePreview() {
  const { invoiceData, appliedTemplate } = useInvoice();
  const { user, userProfile, refreshProfile } = useAuth();
  
  // Ensure lineItems exists before calculating totals
  const lineItems = invoiceData?.lineItems || [];
  const { subtotal, tax, total } = useMemo(() =>
    calculateTotals(lineItems),
    [lineItems]
  );

  // Save invoice and increment count when component mounts
  useEffect(() => {
    const saveInvoiceData = async () => {
      if (user && invoiceData) {
        try {
          // Save invoice to database
          await saveInvoice(user.id, invoiceData);
          
          // Increment user's invoice count
          await incrementInvoiceCount(user.id);
          
          // Refresh user profile to update count
          await refreshProfile();
          
          toast.success('Invoice saved successfully!');
        } catch (error) {
          console.error('Failed to save invoice:', error.message || error);
          toast.error(`Failed to save invoice: ${error.message || 'Database connection issue'}`);
        }
      }
    };

    saveInvoiceData();
  }, [user, invoiceData, refreshProfile]);

  // Early return if data isn't loaded yet
  if (!invoiceData) {
    return <div className={styles.loading}>Loading invoice preview...</div>;
  }

  const handleDownload = async () => {
    try {
      // Show loading state
      toast.info('Generating PDF... Please wait');
      
      const element = document.getElementById('invoice-preview');
      if (!element) {
        throw new Error('Invoice preview not found');
      }
      
      await generatePDF(element, invoiceData.invoiceNumber);
      toast.success('Invoice PDF generated successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error(error.message || 'Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.businessName}`;
    const body = `Please find attached invoice ${invoiceData.invoiceNumber} for your records.\n\nAmount due: ${formatCurrency(total)}\nDue date: ${formatDate(invoiceData.dueDate)}\n\nThank you for your business.`;
    
    window.location.href = `mailto:${invoiceData.clientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast.info('Opening email client...');
  };

  const handleShare = async () => {
    try {
      toast.info('Preparing invoice for sharing...');
      
      // Generate PDF blob
      const element = document.getElementById('invoice-preview');
      if (!element) {
        throw new Error('Invoice preview not found');
      }
      
      const pdfBlob = await generatePDF(element, invoiceData.invoiceNumber, true);
      
      // Check if Web Share API is available
      if (navigator.share) {
        const file = new File([pdfBlob], `Invoice_${invoiceData.invoiceNumber}.pdf`, { 
          type: 'application/pdf' 
        });
        
        await navigator.share({
          title: `Invoice ${invoiceData.invoiceNumber}`,
          text: `Invoice from ${invoiceData.businessName}`,
          files: [file]
        });
        
        toast.success('Invoice shared successfully!');
      } else {
        // Fallback if Web Share API is not available
        toast.info('Web Share not available, downloading instead...');
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share invoice:', error);
      if (error.name !== 'AbortError') {
        toast.error(error.message || 'Failed to share invoice. Downloading instead...');
        handleDownload();
      }
    }
  };

  const getStatusClass = () => {
    switch (invoiceData.status) {
      case 'paid':
        return styles.statusPaid;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.previewHeader}>
        <div className={styles.previewTitle}>
          <h2>Preview</h2>
          <div className={styles.statusBadge + ' ' + getStatusClass()}>
            {invoiceData.status || 'Pending'}
          </div>
        </div>
        <div className={styles.previewActions}>
          <ActionButtons 
            onEmail={handleEmailInvoice}
            onShare={handleShare}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
        </div>
      </div>
      
      <div className={styles.previewWrapper}>
        <div
          id="invoice-preview"
          className={styles.preview}
          style={{
            '--primary-color': invoiceData.design?.colors?.primary || '#4F46E5',
            '--secondary-color': invoiceData.design?.colors?.secondary || '#6366F1',
            '--accent-color': invoiceData.design?.colors?.accent || '#10B981',
            '--text-color': invoiceData.design?.colors?.text || '#1F2937',
            '--background-color': invoiceData.design?.colors?.background || '#FFFFFF',
            '--font-family': invoiceData.design?.fonts?.body || 'Inter',
            '--header-font': invoiceData.design?.fonts?.header || 'Inter',
            '--accent-font': invoiceData.design?.fonts?.accent || 'Inter'
          }}
        >
          <div className={styles.invoiceHeader}>
            {/* Left: Business Info */}
            <div className={styles.businessInfo}>
              {invoiceData.logo && (
                <div className={styles.logo}>
                  <img src={invoiceData.logo} alt={`${invoiceData.businessName} Logo`} />
                </div>
              )}
              <h1>{invoiceData.businessName || 'Your Business Name'}</h1>
              <p>{invoiceData.businessAddress || 'Your Business Address'}</p>
              <div className={styles.contactInfo}>
                {invoiceData.contactInfo?.phone && <p>{invoiceData.contactInfo.phone}</p>}
                {invoiceData.contactInfo?.email && <p>{invoiceData.contactInfo.email}</p>}
              </div>
            </div>

            {/* Center: Invoice Title */}
            <div className={styles.invoiceTitle}>
              <h2>INVOICE</h2>
              <div className={styles.invoiceStatus + ' ' + getStatusClass()}>
                {invoiceData.status || 'Pending'}
              </div>
            </div>

            {/* Right: Client Info */}
            <div className={styles.clientInfo}>
              <h3>Bill To:</h3>
              <p className={styles.clientName}>{invoiceData.clientName || 'Client Name'}</p>
              <p className={styles.clientAddress}>{invoiceData.clientAddress || 'Client Address'}</p>
              {invoiceData.clientEmail && <p>{invoiceData.clientEmail}</p>}
              {invoiceData.clientPhone && <p>{invoiceData.clientPhone}</p>}
            </div>
          </div>

          <div className={styles.invoiceDetails}>
            <div className={styles.invoiceInfo}>
              <h3>Invoice Details</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Invoice Number:</span>
                <span className={styles.infoValue}>{invoiceData.invoiceNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Invoice Date:</span>
                <span className={styles.infoValue}>{formatDate(invoiceData.invoiceDate)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Due Date:</span>
                <span className={styles.infoValue}>{formatDate(invoiceData.dueDate)}</span>
              </div>
              {invoiceData.poNumber && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>PO Number:</span>
                  <span className={styles.infoValue}>{invoiceData.poNumber}</span>
                </div>
              )}
            </div>

            <div className={styles.paymentInfo}>
              <h3>Payment Terms</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Terms:</span>
                <span className={styles.infoValue}>{invoiceData.terms || 'Net 30'}</span>
              </div>
              {invoiceData.bankDetails?.accountName && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Account:</span>
                  <span className={styles.infoValue}>{invoiceData.bankDetails.accountName}</span>
                </div>
              )}
              {invoiceData.bankDetails?.sortCode && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Sort Code:</span>
                  <span className={styles.infoValue}>{invoiceData.bankDetails.sortCode}</span>
                </div>
              )}
            </div>
          </div>

          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.description || 'Item description'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{item.tax}%</td>
                  <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Subtotal</td>
                <td>{formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan="4">Tax</td>
                <td>{formatCurrency(tax)}</td>
              </tr>
              <tr className={styles.totalRow}>
                <td colSpan="4">Total</td>
                <td>{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>

          {(invoiceData.bankDetails?.accountName || 
            invoiceData.bankDetails?.sortCode || 
            invoiceData.bankDetails?.accountNumber) && (
            <div className={styles.paymentDetails}>
              <h3>Payment Details</h3>
              {invoiceData.bankDetails?.accountName && <p>Account Name: {invoiceData.bankDetails.accountName}</p>}
              {invoiceData.bankDetails?.sortCode && <p>Sort Code: {invoiceData.bankDetails.sortCode}</p>}
              {invoiceData.bankDetails?.accountNumber && <p>Account Number: {invoiceData.bankDetails.accountNumber}</p>}
              {invoiceData.paymentInstructions && (
                <div className={styles.paymentInstructions}>
                  <p>{invoiceData.paymentInstructions}</p>
                </div>
              )}
            </div>
          )}

          {invoiceData.notes && (
            <div className={styles.notes}>
              <h3>Notes</h3>
              <p>{invoiceData.notes}</p>
            </div>
          )}

          {invoiceData.terms && (
            <div className={styles.terms}>
              <h3>Terms & Conditions</h3>
              <p>{invoiceData.terms}</p>
            </div>
          )}

          <div className={styles.footer}>
            {invoiceData.customFooter ? (
              <p>{invoiceData.customFooter}</p>
            ) : (
              <p>Thank you for your business!</p>
            )}
          </div>
          
          {/* Watermark for free users */}
          <Watermark />
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;

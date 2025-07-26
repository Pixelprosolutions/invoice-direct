import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaDownload, FaPrint, FaEnvelope, FaShare } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { calculateTotals, formatCurrency, formatDate } from '../utils/helpers';
import { useInvoice } from '../context/InvoiceContext';
import { useAuth } from '../context/AuthContext';
import { saveInvoice, incrementInvoiceCount, updateUserProfile } from '../lib/supabase';
import styles from './InvoicePreview.module.css';
import ActionButtons from './ActionButtons';
import Watermark from './Watermark';

function InvoicePreview() {
  const { invoiceData, appliedTemplate } = useInvoice();
  const { user, userProfile, refreshProfile, canCreateInvoice, isPremium } = useAuth();

  // Track whether we've already saved this invoice to prevent duplicates
  const hasSaved = useRef(false);
  const savedInvoiceId = useRef(null);

  // Ensure lineItems exists before calculating totals
  const lineItems = invoiceData?.lineItems || [];
  const { subtotal, tax, total } = useMemo(() =>
    calculateTotals(lineItems),
    [lineItems]
  );

  // Create a stable invoice identifier for duplicate prevention
  const invoiceId = useMemo(() => {
    if (!invoiceData) return null;
    return `${invoiceData.invoiceNumber}-${invoiceData.invoiceDate}-${user?.id}`;
  }, [invoiceData?.invoiceNumber, invoiceData?.invoiceDate, user?.id]);

  // Save invoice and increment count when component mounts
  useEffect(() => {
    const saveInvoiceData = async () => {
      // Prevent duplicate saves
      if (!user || !invoiceData || !invoiceId) return;

      // Check if we've already saved this exact invoice
      if (hasSaved.current && savedInvoiceId.current === invoiceId) {
        console.log('📝 Invoice already saved, skipping duplicate save');
        return;
      }

      // Check if user can create more invoices (for free users)
      if (!canCreateInvoice()) {
        console.warn('User has reached invoice limit');
        toast.error('You have reached your free invoice limit. Please upgrade to continue.');
        return;
      }
      if (user && invoiceData) {
        try {
          // Check if Supabase is configured
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          // Validate user ID format for database operations
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id);

          if (supabaseUrl && supabaseKey && isValidUUID) {
            // Save to Supabase if configured and user ID is valid
            await saveInvoice(user.id, invoiceData);
            
            // Increment invoice count for free users
            if (!isPremium()) {
              await incrementInvoiceCount(user.id);
            }
            
            await refreshProfile();

            // Mark as saved to prevent duplicates
            hasSaved.current = true;
            savedInvoiceId.current = invoiceId;

            toast.success('Invoice saved to database successfully!');
          } else if (supabaseUrl && supabaseKey && !isValidUUID) {
            // Supabase is configured but user ID is invalid
            console.warn('Invalid user ID for database:', user.id);
            throw new Error('Please sign in with a valid account to save to database');
          } else {
            // Fallback to localStorage when Supabase is not configured
            const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
            const invoiceRecord = {
              id: Date.now().toString(),
              user_id: user.id,
              invoice_data: invoiceData,
              status: 'draft',
              created_at: new Date().toISOString()
            };

            savedInvoices.push(invoiceRecord);
            // Keep only last 100 invoices to prevent storage overflow
            if (savedInvoices.length > 100) {
              savedInvoices.splice(0, savedInvoices.length - 100);
            }

            localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));

            // Update local user profile for free users
            if (!isPremium()) {
              const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
              const updatedProfile = {
                ...currentProfile,
                id: user.id,
                email: user.email,
                plan: currentProfile.plan || 'free',
                invoice_count: (currentProfile.invoice_count || 0) + 1,
                created_at: currentProfile.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
              await refreshProfile();
            }
            // Mark as saved to prevent duplicates
            hasSaved.current = true;
            savedInvoiceId.current = invoiceId;

            toast.success('Invoice saved locally!');
          }
        } catch (error) {
          console.error('Failed to save invoice:', error.message || error);
          // If Supabase fails, fall back to localStorage
          if (error.message === 'Supabase not configured' || error.message.includes('Supabase not configured')) {
            try {
              const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
              const invoiceRecord = {
                id: Date.now().toString(),
                user_id: user.id,
                invoice_data: invoiceData,
                status: 'draft',
                created_at: new Date().toISOString()
              };

              savedInvoices.push(invoiceRecord);
              localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));

              // Update local user profile for free users
              if (!isPremium()) {
                const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const updatedProfile = {
                  ...currentProfile,
                  id: user.id,
                  email: user.email,
                  plan: currentProfile.plan || 'free',
                  invoice_count: (currentProfile.invoice_count || 0) + 1,
                  created_at: currentProfile.created_at || new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                await refreshProfile();
              }
              // Mark as saved to prevent duplicates
              hasSaved.current = true;
              savedInvoiceId.current = invoiceId;

              toast.success('Invoice saved locally (database not configured)');
            } catch (localError) {
              toast.error('Failed to save invoice locally');
            }
          } else {
            toast.error(`Failed to save invoice: ${error.message || 'Unknown error'}`);
          }
        }
      }
    };

    saveInvoiceData();
  }, [invoiceId]); // Only run when the invoice identity changes

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
            '--accent-font': invoiceData.design?.fonts?.accent || 'Inter',
            '--primary-color-rgb': invoiceData.design?.colors?.primary ?
              invoiceData.design.colors.primary.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ') :
              '79, 70, 229',
            '--secondary-color-rgb': invoiceData.design?.colors?.secondary ?
              invoiceData.design.colors.secondary.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ') :
              '99, 102, 241'
          }}
        >
          <div className={styles.invoiceHeader}>
            {/* Left: Business Info with Logo */}
            <div className={styles.businessSection}>
              {invoiceData.logo && (
                <div className={styles.logoContainer}>
                  <img src={invoiceData.logo} alt={`${invoiceData.businessName} Logo`} className={styles.logoImage} />
                </div>
              )}
              <div className={styles.businessInfo}>
                <h1>{invoiceData.businessName || 'Your Business Name'}</h1>
                <p>{invoiceData.businessAddress || 'Your Business Address'}</p>
                <div className={styles.contactInfo}>
                  {invoiceData.contactInfo?.phone && <p>{invoiceData.contactInfo.phone}</p>}
                  {invoiceData.contactInfo?.email && <p>{invoiceData.contactInfo.email}</p>}
                </div>
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

          {/* Compact Footer Section */}
          <div className={styles.footerSection}>
            {invoiceData.notes && (
              <div className={styles.notes}>
                <h3>Notes</h3>
                <p>{invoiceData.notes}</p>
              </div>
            )}

            {invoiceData.paymentInstructions && (
              <div className={styles.paymentInstructions}>
                <p>{invoiceData.paymentInstructions}</p>
              </div>
            )}
          </div>

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

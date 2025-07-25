import React, { useState, useEffect } from 'react';
import { FaFileInvoice, FaTrash, FaCopy, FaEye, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useInvoice } from '../context/InvoiceContext';
import styles from './InvoiceHistory.module.css';

const InvoiceHistory = ({ setActiveView, onNavigateHome }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loadInvoice, deleteInvoice } = useInvoice();

  useEffect(() => {
    const loadInvoices = () => {
      try {
        setIsLoading(true);
        const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];
        setInvoices(savedInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
        toast.error('Failed to load invoice history');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const handleViewInvoice = (invoice) => {
    loadInvoice(invoice.invoiceData || invoice);
    setActiveView('create');
    toast.info(`Loaded invoice #${invoice.invoiceData?.invoiceNumber || invoice.invoiceNumber || 'N/A'}`);
  };

  const handleDuplicateInvoice = (invoice) => {
    const invoiceData = invoice.invoiceData || invoice;
    const duplicatedInvoice = {
      ...invoiceData,
      invoiceNumber: `${invoiceData.invoiceNumber || 'INV'}-copy`,
      invoiceDate: format(new Date(), 'yyyy-MM-dd')
    };

    loadInvoice(duplicatedInvoice);
    setActiveView('create');
    toast.info(`Duplicated invoice #${invoiceData.invoiceNumber || 'N/A'}`);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      deleteInvoice(invoiceId);
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      toast.success('Invoice deleted successfully');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.loader}>Loading invoice history...</div>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <div className="title-row">
          <button
            onClick={onNavigateHome}
            className="back-button"
            title="Back to Home"
          >
            <FaArrowLeft />
          </button>
          <h2>Invoice History</h2>
        </div>
        <button
          className={styles.newInvoiceButton}
          onClick={() => setActiveView('create')}
        >
          <FaPlus /> Create New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <FaFileInvoice className={styles.emptyIcon} />
          <h3>No Invoices Yet</h3>
          <p>Create your first invoice to get started with managing your business finances.</p>
          <button 
            className={styles.createButton}
            onClick={() => setActiveView('create')}
          >
            <FaPlus /> Create First Invoice
          </button>
        </div>
      ) : (
        <div className={styles.invoiceList}>
          {invoices.map((invoice) => (
            <div key={invoice.id} className={styles.invoiceCard}>
              <div className={styles.invoiceCardHeader}>
                <h3>Invoice #{invoice.invoiceData?.invoiceNumber || invoice.invoiceNumber || 'N/A'}</h3>
                <div className={styles.invoiceActions}>
                  <button 
                    onClick={() => handleViewInvoice(invoice)}
                    className={styles.actionButton}
                    title="View Invoice"
                  >
                    <FaEye />
                  </button>
                  <button 
                    onClick={() => handleDuplicateInvoice(invoice)}
                    className={styles.actionButton}
                    title="Duplicate Invoice"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete Invoice"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className={styles.invoiceDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Client</span>
                  <span className={styles.detailValue}>
                    {invoice.invoiceData?.clientName || invoice.clientName || 'Unnamed Client'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>
                    {(invoice.invoiceData?.invoiceDate || invoice.invoiceDate) ?
                      format(new Date(invoice.invoiceData?.invoiceDate || invoice.invoiceDate), 'MMM dd, yyyy') :
                      'No date'
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Amount</span>
                  <span className={styles.detailValue}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(
                      (invoice.invoiceData?.lineItems || invoice.lineItems || []).reduce((sum, item) =>
                        sum + (parseFloat(item.total) || 0), 0
                      )
                    )}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={`${styles.status} ${styles[(invoice.invoiceData?.status || invoice.status || 'pending')]}`}>
                    {(invoice.invoiceData?.status || invoice.status || 'Pending').charAt(0).toUpperCase() + (invoice.invoiceData?.status || invoice.status || 'pending').slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;

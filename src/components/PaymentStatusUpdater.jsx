import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './PaymentStatusUpdater.module.css';
import { 
  FaCreditCard, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaTimes,
  FaCalendarAlt,
  FaCommentDots,
  FaSearch
} from 'react-icons/fa';

const PaymentStatusUpdater = ({ onClose }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, selectedStatus]);

  const loadInvoices = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const invoicesWithDefaults = savedInvoices.map(invoice => ({
        ...invoice,
        status: invoice.invoiceData?.status || 'pending',
        paymentDate: invoice.invoiceData?.paymentDate || null,
        paymentNotes: invoice.invoiceData?.paymentNotes || ''
      }));
      setInvoices(invoicesWithDefaults);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceData?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceData?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === selectedStatus);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredInvoices(filtered);
  };

  const updateInvoiceStatus = async (invoiceId, newStatus, paymentDate = null, notes = '') => {
    setIsLoading(true);
    try {
      const updatedInvoices = invoices.map(invoice => {
        if (invoice.id === invoiceId) {
          return {
            ...invoice,
            status: newStatus,
            paymentDate: newStatus === 'paid' ? (paymentDate || new Date().toISOString().split('T')[0]) : null,
            paymentNotes: notes,
            lastModified: new Date().toISOString(),
            invoiceData: {
              ...invoice.invoiceData,
              status: newStatus,
              paymentDate: newStatus === 'paid' ? (paymentDate || new Date().toISOString().split('T')[0]) : null,
              paymentNotes: notes
            }
          };
        }
        return invoice;
      });

      setInvoices(updatedInvoices);
      localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));

      const statusMessages = {
        pending: 'Invoice marked as pending',
        paid: 'Invoice marked as paid',
        overdue: 'Invoice marked as overdue',
        cancelled: 'Invoice cancelled'
      };

      toast.success(statusMessages[newStatus] || 'Invoice status updated');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <FaCheckCircle className={styles.paidIcon} />;
      case 'pending': return <FaClock className={styles.pendingIcon} />;
      case 'overdue': return <FaExclamationTriangle className={styles.overdueIcon} />;
      case 'cancelled': return <FaTimes className={styles.cancelledIcon} />;
      default: return <FaClock className={styles.pendingIcon} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#059669';
      case 'pending': return '#d97706';
      case 'overdue': return '#dc2626';
      case 'cancelled': return '#6b7280';
      default: return '#d97706';
    }
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems || !Array.isArray(lineItems)) return '0.00';
    return lineItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0).toFixed(2);
  };

  const isOverdue = (invoice) => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false;
    const dueDate = new Date(invoice.invoiceData?.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  const QuickStatusButton = ({ invoice, status, icon, label, color }) => (
    <button
      className={styles.quickStatusButton}
      style={{ backgroundColor: color, borderColor: color }}
      onClick={() => updateInvoiceStatus(invoice.id, status)}
      disabled={isLoading}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={styles.paymentStatusUpdater}>
      <div className={styles.header}>
        <h2>
          <FaCreditCard /> Payment Status
        </h2>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className={styles.invoiceList}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            <FaMoneyBillWave className={styles.emptyIcon} />
            <h3>No invoices found</h3>
            <p>Create your first invoice to track payments</p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div 
              key={invoice.id} 
              className={`${styles.invoiceCard} ${isOverdue(invoice) ? styles.overdue : ''}`}
            >
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceInfo}>
                  <h4>{invoice.invoiceData?.invoiceNumber || 'N/A'}</h4>
                  <p className={styles.clientName}>{invoice.invoiceData?.clientName || 'Unknown Client'}</p>
                </div>
                <div className={styles.invoiceAmount}>
                  <span className={styles.amount}>
                    ${calculateTotal(invoice.invoiceData?.lineItems)}
                  </span>
                  <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(invoice.status) }}>
                    {getStatusIcon(invoice.status)}
                    <span>{invoice.status?.toUpperCase() || 'PENDING'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.invoiceDates}>
                <div className={styles.dateInfo}>
                  <FaCalendarAlt className={styles.dateIcon} />
                  <span>Due: {new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}</span>
                </div>
                {invoice.paymentDate && (
                  <div className={styles.dateInfo}>
                    <FaCheckCircle className={styles.dateIcon} />
                    <span>Paid: {new Date(invoice.paymentDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {invoice.paymentNotes && (
                <div className={styles.paymentNotes}>
                  <FaCommentDots className={styles.notesIcon} />
                  <span>{invoice.paymentNotes}</span>
                </div>
              )}

              <div className={styles.actionButtons}>
                {invoice.status !== 'paid' && (
                  <QuickStatusButton
                    invoice={invoice}
                    status="paid"
                    icon={<FaCheckCircle />}
                    label="Mark Paid"
                    color="#059669"
                  />
                )}
                {invoice.status !== 'pending' && (
                  <QuickStatusButton
                    invoice={invoice}
                    status="pending"
                    icon={<FaClock />}
                    label="Pending"
                    color="#d97706"
                  />
                )}
                {invoice.status !== 'overdue' && (
                  <QuickStatusButton
                    invoice={invoice}
                    status="overdue"
                    icon={<FaExclamationTriangle />}
                    label="Overdue"
                    color="#dc2626"
                  />
                )}
                {invoice.status !== 'cancelled' && (
                  <QuickStatusButton
                    invoice={invoice}
                    status="cancelled"
                    icon={<FaTimes />}
                    label="Cancel"
                    color="#6b7280"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Total Invoices:</span>
          <strong>{filteredInvoices.length}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Pending:</span>
          <strong className={styles.pendingCount}>
            {filteredInvoices.filter(inv => inv.status === 'pending').length}
          </strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Paid:</span>
          <strong className={styles.paidCount}>
            {filteredInvoices.filter(inv => inv.status === 'paid').length}
          </strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Overdue:</span>
          <strong className={styles.overdueCount}>
            {filteredInvoices.filter(inv => inv.status === 'overdue' || isOverdue(inv)).length}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusUpdater;

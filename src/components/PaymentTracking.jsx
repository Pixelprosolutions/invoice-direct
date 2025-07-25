import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './PaymentTracking.module.css';
import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaSearch,
  FaFilter,
  FaBell,
  FaEnvelope,
  FaCalendarAlt,
  FaDollarSign,
  FaChartPie,
  FaEye,
  FaEdit,
  FaPlus,
  FaArrowLeft
} from 'react-icons/fa';

const PaymentTracking = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderInvoice, setReminderInvoice] = useState(null);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
    checkOverdueInvoices();
  }, [invoices, searchTerm, statusFilter]);

  const loadInvoices = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const invoicesWithStatus = savedInvoices.map(invoice => ({
        ...invoice,
        status: invoice.invoiceData?.status || 'unpaid',
        paymentDate: invoice.invoiceData?.paymentDate || null,
        remindersSent: invoice.invoiceData?.remindersSent || 0,
        lastReminderDate: invoice.invoiceData?.lastReminderDate || null
      }));
      setInvoices(invoicesWithStatus);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceData?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceData?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => {
        if (statusFilter === 'overdue') {
          return isOverdue(invoice) && invoice.status !== 'paid';
        }
        return invoice.status === statusFilter;
      });
    }

    // Sort by date (newest first, but overdue at top)
    filtered.sort((a, b) => {
      const aOverdue = isOverdue(a) && a.status !== 'paid';
      const bOverdue = isOverdue(b) && b.status !== 'paid';
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      return new Date(b.date) - new Date(a.date);
    });

    setFilteredInvoices(filtered);
  };

  const checkOverdueInvoices = () => {
    const overdue = invoices.filter(invoice => 
      isOverdue(invoice) && invoice.status !== 'paid'
    ).length;
    setOverdueCount(overdue);
  };

  const isOverdue = (invoice) => {
    if (!invoice.invoiceData?.dueDate) return false;
    const dueDate = new Date(invoice.invoiceData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getDaysOverdue = (invoice) => {
    if (!isOverdue(invoice)) return 0;
    const dueDate = new Date(invoice.invoiceData.dueDate);
    const today = new Date();
    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const updateInvoiceStatus = async (invoiceId, newStatus, paymentDate = null) => {
    try {
      const updatedInvoices = invoices.map(invoice => {
        if (invoice.id === invoiceId) {
          return {
            ...invoice,
            status: newStatus,
            paymentDate: newStatus === 'paid' ? (paymentDate || new Date().toISOString().split('T')[0]) : null,
            lastModified: new Date().toISOString(),
            invoiceData: {
              ...invoice.invoiceData,
              status: newStatus,
              paymentDate: newStatus === 'paid' ? (paymentDate || new Date().toISOString().split('T')[0]) : null
            }
          };
        }
        return invoice;
      });

      setInvoices(updatedInvoices);
      localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));

      const statusMessages = {
        paid: 'Invoice marked as paid',
        unpaid: 'Invoice marked as unpaid',
        overdue: 'Invoice marked as overdue'
      };

      toast.success(statusMessages[newStatus] || 'Invoice status updated');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const sendPaymentReminder = (invoice) => {
    setReminderInvoice(invoice);
    setShowReminderModal(true);
  };

  const handleSendReminder = (reminderData) => {
    try {
      const updatedInvoices = invoices.map(inv => {
        if (inv.id === reminderInvoice.id) {
          return {
            ...inv,
            remindersSent: (inv.remindersSent || 0) + 1,
            lastReminderDate: new Date().toISOString(),
            invoiceData: {
              ...inv.invoiceData,
              remindersSent: (inv.remindersSent || 0) + 1,
              lastReminderDate: new Date().toISOString()
            }
          };
        }
        return inv;
      });

      setInvoices(updatedInvoices);
      localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
      
      toast.success('Payment reminder sent successfully!');
      setShowReminderModal(false);
      setReminderInvoice(null);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems || !Array.isArray(lineItems)) return '0.00';
    return lineItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0).toFixed(2);
  };

  const getStatusIcon = (invoice) => {
    if (invoice.status === 'paid') return <FaCheckCircle className={styles.paidIcon} />;
    if (isOverdue(invoice) && invoice.status !== 'paid') return <FaExclamationTriangle className={styles.overdueIcon} />;
    return <FaClock className={styles.unpaidIcon} />;
  };

  const getStatusText = (invoice) => {
    if (invoice.status === 'paid') return 'PAID';
    if (isOverdue(invoice) && invoice.status !== 'paid') return 'OVERDUE';
    return 'UNPAID';
  };

  const getStatusColor = (invoice) => {
    if (invoice.status === 'paid') return '#059669';
    if (isOverdue(invoice) && invoice.status !== 'paid') return '#dc2626';
    return '#d97706';
  };

  const getTotalStats = () => {
    const paid = invoices.filter(inv => inv.status === 'paid').length;
    const unpaid = invoices.filter(inv => inv.status === 'unpaid' && !isOverdue(inv)).length;
    const overdue = invoices.filter(inv => isOverdue(inv) && inv.status !== 'paid').length;
    const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(calculateTotal(inv.invoiceData?.lineItems)), 0);
    const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + parseFloat(calculateTotal(inv.invoiceData?.lineItems)), 0);
    
    return { paid, unpaid, overdue, totalAmount, paidAmount, pendingAmount: totalAmount - paidAmount };
  };

  const stats = getTotalStats();

  return (
    <div className={styles.paymentTracking}>
      <div className={styles.header}>
        <h1>
          <FaCreditCard /> Payment Tracking
        </h1>
        {overdueCount > 0 && (
          <div className={styles.overdueAlert}>
            <FaBell className={styles.alertIcon} />
            <span>{overdueCount} overdue invoice{overdueCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#059669' }}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.paid}</h3>
            <p>Paid Invoices</p>
            <span className={styles.amount}>${stats.paidAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#d97706' }}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.unpaid}</h3>
            <p>Unpaid Invoices</p>
            <span className={styles.amount}>${(stats.pendingAmount - (invoices.filter(inv => isOverdue(inv) && inv.status !== 'paid').reduce((sum, inv) => sum + parseFloat(calculateTotal(inv.invoiceData?.lineItems)), 0))).toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dc2626' }}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.overdue}</h3>
            <p>Overdue Invoices</p>
            <span className={styles.amount}>${invoices.filter(inv => isOverdue(inv) && inv.status !== 'paid').reduce((sum, inv) => sum + parseFloat(calculateTotal(inv.invoiceData?.lineItems)), 0).toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#6366f1' }}>
            <FaChartPie />
          </div>
          <div className={styles.statContent}>
            <h3>{invoices.length}</h3>
            <p>Total Invoices</p>
            <span className={styles.amount}>${stats.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by client or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </select>

        <div className={styles.filterInfo}>
          <FaFilter />
          <span>{filteredInvoices.length} of {invoices.length} invoices</span>
        </div>
      </div>

      <div className={styles.invoiceList}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            <FaCreditCard className={styles.emptyIcon} />
            <h3>No invoices found</h3>
            <p>Create your first invoice to start tracking payments</p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className={`${styles.invoiceCard} ${isOverdue(invoice) && invoice.status !== 'paid' ? styles.overdue : ''}`}>
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceInfo}>
                  <h4>{invoice.invoiceData?.invoiceNumber || 'N/A'}</h4>
                  <p className={styles.clientName}>{invoice.invoiceData?.clientName || 'Unknown Client'}</p>
                  <p className={styles.dueDate}>
                    <FaCalendarAlt /> Due: {new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}
                    {isOverdue(invoice) && invoice.status !== 'paid' && (
                      <span className={styles.overdueDays}>({getDaysOverdue(invoice)} days overdue)</span>
                    )}
                  </p>
                </div>
                
                <div className={styles.invoiceAmount}>
                  <span className={styles.amount}>
                    <FaDollarSign />${calculateTotal(invoice.invoiceData?.lineItems)}
                  </span>
                  <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(invoice) }}>
                    {getStatusIcon(invoice)}
                    <span>{getStatusText(invoice)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.invoiceDetails}>
                {invoice.paymentDate && (
                  <p className={styles.paymentDate}>
                    <FaCheckCircle /> Paid on: {new Date(invoice.paymentDate).toLocaleDateString()}
                  </p>
                )}
                
                {invoice.remindersSent > 0 && (
                  <p className={styles.reminderInfo}>
                    <FaEnvelope /> {invoice.remindersSent} reminder{invoice.remindersSent !== 1 ? 's' : ''} sent
                    {invoice.lastReminderDate && (
                      <span> (last: {new Date(invoice.lastReminderDate).toLocaleDateString()})</span>
                    )}
                  </p>
                )}
              </div>

              <div className={styles.actionButtons}>
                {invoice.status !== 'paid' && (
                  <button
                    className={`${styles.actionButton} ${styles.paidButton}`}
                    onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                  >
                    <FaCheckCircle /> Mark Paid
                  </button>
                )}
                
                {invoice.status === 'paid' && (
                  <button
                    className={`${styles.actionButton} ${styles.unpaidButton}`}
                    onClick={() => updateInvoiceStatus(invoice.id, 'unpaid')}
                  >
                    <FaClock /> Mark Unpaid
                  </button>
                )}
                
                {invoice.status !== 'paid' && (
                  <button
                    className={`${styles.actionButton} ${styles.reminderButton}`}
                    onClick={() => sendPaymentReminder(invoice)}
                  >
                    <FaEnvelope /> Send Reminder
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showReminderModal && reminderInvoice && (
        <PaymentReminderModal
          invoice={reminderInvoice}
          onSend={handleSendReminder}
          onClose={() => {
            setShowReminderModal(false);
            setReminderInvoice(null);
          }}
        />
      )}
    </div>
  );
};

// Payment Reminder Modal Component
const PaymentReminderModal = ({ invoice, onSend, onClose }) => {
  const [reminderType, setReminderType] = useState('friendly');
  const [customMessage, setCustomMessage] = useState('');
  const [includeInvoice, setIncludeInvoice] = useState(true);

  const reminderTemplates = {
    friendly: {
      subject: `Friendly Payment Reminder - Invoice ${invoice.invoiceData?.invoiceNumber}`,
      message: `Hi ${invoice.invoiceData?.clientName || 'there'},\n\nI hope this message finds you well. This is a friendly reminder that Invoice ${invoice.invoiceData?.invoiceNumber} with a total of $${invoice.invoiceData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)} was due on ${new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}.\n\nIf you have already processed this payment, please disregard this message. If you have any questions or concerns, please don't hesitate to reach out.\n\nThank you for your business!\n\nBest regards`
    },
    formal: {
      subject: `Payment Reminder - Invoice ${invoice.invoiceData?.invoiceNumber}`,
      message: `Dear ${invoice.invoiceData?.clientName || 'Sir/Madam'},\n\nThis is to remind you that Invoice ${invoice.invoiceData?.invoiceNumber} dated ${new Date(invoice.date).toLocaleDateString()} for the amount of $${invoice.invoiceData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)} remains unpaid.\n\nThe payment was due on ${new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}. Please arrange for immediate payment to avoid any late fees.\n\nFor any clarifications, please contact us at your earliest convenience.\n\nSincerely`
    },
    urgent: {
      subject: `URGENT: Overdue Payment - Invoice ${invoice.invoiceData?.invoiceNumber}`,
      message: `Dear ${invoice.invoiceData?.clientName || 'Sir/Madam'},\n\nThis is an urgent notice regarding the overdue payment for Invoice ${invoice.invoiceData?.invoiceNumber}.\n\nAmount Due: $${invoice.invoiceData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}\nDue Date: ${new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}\nDays Overdue: ${Math.ceil((new Date() - new Date(invoice.invoiceData?.dueDate)) / (1000 * 60 * 60 * 24))} days\n\nImmediate payment is required to avoid further action. Please contact us immediately to resolve this matter.\n\nRegards`
    }
  };

  const handleSend = () => {
    const template = reminderTemplates[reminderType];
    const reminderData = {
      type: reminderType,
      subject: template.subject,
      message: customMessage || template.message,
      includeInvoice,
      sentDate: new Date().toISOString()
    };
    onSend(reminderData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.reminderModal}>
        <div className={styles.modalHeader}>
          <h3>
            <FaEnvelope /> Send Payment Reminder
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.invoiceInfo}>
            <h4>Invoice Details</h4>
            <p><strong>Invoice #:</strong> {invoice.invoiceData?.invoiceNumber}</p>
            <p><strong>Client:</strong> {invoice.invoiceData?.clientName}</p>
            <p><strong>Amount:</strong> ${invoice.invoiceData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}</p>
            <p><strong>Due Date:</strong> {new Date(invoice.invoiceData?.dueDate).toLocaleDateString()}</p>
            {invoice.remindersSent > 0 && (
              <p><strong>Previous Reminders:</strong> {invoice.remindersSent}</p>
            )}
          </div>

          <div className={styles.reminderOptions}>
            <h4>Reminder Type</h4>
            <div className={styles.reminderTypes}>
              <label className={styles.reminderType}>
                <input
                  type="radio"
                  value="friendly"
                  checked={reminderType === 'friendly'}
                  onChange={(e) => setReminderType(e.target.value)}
                />
                <span>Friendly Reminder</span>
              </label>
              <label className={styles.reminderType}>
                <input
                  type="radio"
                  value="formal"
                  checked={reminderType === 'formal'}
                  onChange={(e) => setReminderType(e.target.value)}
                />
                <span>Formal Notice</span>
              </label>
              <label className={styles.reminderType}>
                <input
                  type="radio"
                  value="urgent"
                  checked={reminderType === 'urgent'}
                  onChange={(e) => setReminderType(e.target.value)}
                />
                <span>Urgent Notice</span>
              </label>
            </div>
          </div>

          <div className={styles.messagePreview}>
            <h4>Message Preview</h4>
            <div className={styles.previewBox}>
              <strong>Subject:</strong> {reminderTemplates[reminderType].subject}
              <br /><br />
              <div className={styles.messageContent}>
                {customMessage || reminderTemplates[reminderType].message}
              </div>
            </div>
          </div>

          <div className={styles.customMessage}>
            <h4>Custom Message (Optional)</h4>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter custom message to override template..."
              className={styles.messageTextarea}
              rows="4"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.optionCheckbox}>
              <input
                type="checkbox"
                checked={includeInvoice}
                onChange={(e) => setIncludeInvoice(e.target.checked)}
              />
              <span>Include invoice attachment</span>
            </label>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.sendButton} onClick={handleSend}>
            <FaEnvelope /> Send Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracking;

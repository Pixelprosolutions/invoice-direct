import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './OverdueAlerts.module.css';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaTimes, 
  FaCreditCard,
  FaEnvelope,
  FaEye,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const OverdueAlerts = ({ onNavigateToPayments }) => {
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    checkOverdueInvoices();
    
    // Check for overdue invoices every minute
    const interval = setInterval(checkOverdueInvoices, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkOverdueInvoices = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdue = savedInvoices.filter(invoice => {
        if (invoice.invoiceData?.status === 'paid') return false;
        if (!invoice.invoiceData?.dueDate) return false;
        
        const dueDate = new Date(invoice.invoiceData.dueDate);
        return dueDate < today;
      });

      setOverdueInvoices(overdue);

      // Show toast notification for new overdue invoices
      const lastCheckKey = 'lastOverdueCheck';
      const lastCheck = localStorage.getItem(lastCheckKey);
      const currentCheck = Date.now().toString();
      
      if (lastCheck && overdue.length > 0) {
        const previousOverdueCount = parseInt(localStorage.getItem('previousOverdueCount') || '0');
        if (overdue.length > previousOverdueCount) {
          const newOverdue = overdue.length - previousOverdueCount;
          toast.warning(`${newOverdue} invoice${newOverdue !== 1 ? 's' : ''} became overdue!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }

      localStorage.setItem(lastCheckKey, currentCheck);
      localStorage.setItem('previousOverdueCount', overdue.length.toString());
    } catch (error) {
      console.error('Error checking overdue invoices:', error);
    }
  };

  const getDaysOverdue = (invoice) => {
    const dueDate = new Date(invoice.invoiceData.dueDate);
    const today = new Date();
    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems || !Array.isArray(lineItems)) return '0.00';
    return lineItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0).toFixed(2);
  };

  const getTotalOverdueAmount = () => {
    return overdueInvoices.reduce((total, invoice) => {
      return total + parseFloat(calculateTotal(invoice.invoiceData?.lineItems));
    }, 0).toFixed(2);
  };

  const handleSendReminder = (invoice) => {
    try {
      // Update reminder count
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const updatedInvoices = savedInvoices.map(inv => {
        if (inv.id === invoice.id) {
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

      localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
      toast.success(`Reminder sent for invoice ${invoice.invoiceData?.invoiceNumber}`);
      checkOverdueInvoices(); // Refresh the list
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem('overdueAlertsDismissed', 'true');
  };

  // Check if alerts were dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('overdueAlertsDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (overdueInvoices.length === 0 || isDismissed) {
    return null;
  }

  return (
    <div className={styles.overdueAlerts}>
      <div className={styles.alertHeader}>
        <div className={styles.alertTitle}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <span>
            <strong>{overdueInvoices.length}</strong> overdue invoice{overdueInvoices.length !== 1 ? 's' : ''} 
            <span className={styles.totalAmount}> • ${getTotalOverdueAmount()} total</span>
          </span>
        </div>
        
        <div className={styles.alertActions}>
          <button 
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand details'}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button 
            className={styles.viewAllButton}
            onClick={onNavigateToPayments}
            title="View all payments"
          >
            <FaCreditCard /> View All
          </button>
          <button 
            className={styles.dismissButton}
            onClick={handleDismiss}
            title="Dismiss for this session"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.alertDetails}>
          <div className={styles.overdueList}>
            {overdueInvoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className={styles.overdueItem}>
                <div className={styles.invoiceInfo}>
                  <strong>{invoice.invoiceData?.invoiceNumber || 'N/A'}</strong>
                  <span className={styles.clientName}>{invoice.invoiceData?.clientName || 'Unknown'}</span>
                  <span className={styles.daysOverdue}>
                    {getDaysOverdue(invoice)} day{getDaysOverdue(invoice) !== 1 ? 's' : ''} overdue
                  </span>
                </div>
                
                <div className={styles.invoiceAmount}>
                  ${calculateTotal(invoice.invoiceData?.lineItems)}
                </div>
                
                <div className={styles.quickActions}>
                  <button 
                    className={styles.reminderButton}
                    onClick={() => handleSendReminder(invoice)}
                    title="Send payment reminder"
                  >
                    <FaEnvelope />
                  </button>
                </div>
              </div>
            ))}
            
            {overdueInvoices.length > 5 && (
              <div className={styles.moreItems}>
                <button 
                  className={styles.viewAllLink}
                  onClick={onNavigateToPayments}
                >
                  +{overdueInvoices.length - 5} more overdue invoice{overdueInvoices.length - 5 !== 1 ? 's' : ''} 
                  <FaEye />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueAlerts;

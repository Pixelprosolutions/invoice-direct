import React, { useState } from 'react';
import styles from './FloatingActionButton.module.css';
import { FaPlus, FaMobile, FaBolt, FaCamera, FaCreditCard } from 'react-icons/fa';

const FloatingActionButton = ({ onQuickInvoice, onPhotoExpense, onPaymentStatus, onMobileHub }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: <FaBolt />,
      label: 'Quick Invoice',
      onClick: onQuickInvoice,
      color: '#4F46E5'
    },
    {
      icon: <FaCamera />,
      label: 'Photo Expense',
      onClick: onPhotoExpense,
      color: '#059669'
    },
    {
      icon: <FaCreditCard />,
      label: 'Payment Status',
      onClick: onPaymentStatus,
      color: '#dc2626'
    },
    {
      icon: <FaMobile />,
      label: 'Mobile Hub',
      onClick: onMobileHub,
      color: '#6366f1'
    }
  ];

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action) => {
    action.onClick();
    setIsExpanded(false);
  };

  return (
    <div className={styles.fabContainer}>
      {isExpanded && (
        <>
          <div className={styles.overlay} onClick={() => setIsExpanded(false)} />
          <div className={styles.actionButtons}>
            {actions.map((action, index) => (
              <button
                key={index}
                className={styles.actionButton}
                onClick={() => handleActionClick(action)}
                style={{ 
                  backgroundColor: action.color,
                  animationDelay: `${index * 0.1}s`
                }}
                title={action.label}
              >
                {action.icon}
                <span className={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
      
      <button
        className={`${styles.fab} ${isExpanded ? styles.expanded : ''}`}
        onClick={handleMainClick}
        title="Mobile Features"
      >
        <FaPlus className={styles.fabIcon} />
      </button>
    </div>
  );
};

export default FloatingActionButton;

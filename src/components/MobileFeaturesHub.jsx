import React, { useState } from 'react';
import styles from './MobileFeaturesHub.module.css';
import QuickInvoiceForm from './QuickInvoiceForm';
import PaymentStatusUpdater from './PaymentStatusUpdater';
import Modal from './Modal';
import { 
  FaMobile, 
  FaBolt, 
  FaCamera, 
  FaCreditCard, 
  FaTimes,
  FaPlus,
  FaChartLine
} from 'react-icons/fa';

const MobileFeaturesHub = ({ onClose }) => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'quick-invoice',
      title: 'Quick Invoice',
      description: 'Create invoices in seconds with simplified form',
      icon: <FaBolt />,
      color: '#4F46E5',
      component: QuickInvoiceForm
    },
    {
      id: 'photo-expenses',
      title: 'Photo Expenses',
      description: 'Capture receipts and add to invoices instantly',
      icon: <FaCamera />,
      color: '#059669',
      component: QuickInvoiceForm // Photo capture is integrated into QuickInvoiceForm
    },
    {
      id: 'payment-status',
      title: 'Payment Status',
      description: 'Update payment status with quick actions',
      icon: <FaCreditCard />,
      color: '#dc2626',
      component: PaymentStatusUpdater
    }
  ];

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  const handleFeatureClose = () => {
    setActiveFeature(null);
  };

  const handleFeatureComplete = () => {
    setActiveFeature(null);
    // Could trigger a refresh or callback here
  };

  return (
    <>
      <div className={styles.mobileFeaturesHub}>
        <div className={styles.header}>
          <h2>
            <FaMobile /> Mobile Features
          </h2>
        </div>

        <div className={styles.intro}>
          <p>Optimized tools for mobile invoice management</p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map(feature => (
            <div
              key={feature.id}
              className={styles.featureCard}
              onClick={() => handleFeatureClick(feature)}
              style={{ '--feature-color': feature.color }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <div className={styles.featureContent}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className={styles.featureAction}>
                <FaPlus />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mobileStats}>
          <div className={styles.statCard}>
            <FaChartLine className={styles.statIcon} />
            <div className={styles.statContent}>
              <h4>Mobile Optimized</h4>
              <p>Touch-friendly interface designed for smartphones and tablets</p>
            </div>
          </div>
        </div>

        <div className={styles.tips}>
          <h3>Mobile Tips</h3>
          <ul>
            <li>Use Quick Invoice for rapid billing on-the-go</li>
            <li>Capture receipt photos directly in the app</li>
            <li>Update payment status instantly from anywhere</li>
            <li>All features work offline and sync when connected</li>
          </ul>
        </div>
      </div>

      {activeFeature && (
        <Modal onClose={handleFeatureClose}>
          {React.createElement(activeFeature.component, {
            onClose: handleFeatureClose,
            onComplete: handleFeatureComplete
          })}
        </Modal>
      )}
    </>
  );
};

export default MobileFeaturesHub;

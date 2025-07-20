import React, { useState } from 'react';
import { FaEnvelope, FaShareAlt, FaPrint, FaFileDownload } from 'react-icons/fa';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onEmail, onShare, onPrint, onDownload }) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleAction = (action, handler) => {
    setActiveButton(action);
    handler();
    setTimeout(() => setActiveButton(null), 500);
  };

  return (
    <div className={styles.actionButtonsContainer}>
      <button 
        className={`${styles.actionButton} ${styles.emailButton} ${activeButton === 'email' ? styles.active : ''}`}
        onClick={() => handleAction('email', onEmail)}
        title="Email Invoice"
      >
        <div className={styles.buttonContent}>
          <FaEnvelope className={styles.icon} />
          <span className={styles.text}>Email</span>
        </div>
        <div className={styles.shine}></div>
        <div className={styles.background}>
          <div className={styles.tiles}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.tile}></div>
            ))}
          </div>
        </div>
      </button>

      <button 
        className={`${styles.actionButton} ${styles.shareButton} ${activeButton === 'share' ? styles.active : ''}`}
        onClick={() => handleAction('share', onShare)}
        title="Share Invoice"
      >
        <div className={styles.buttonContent}>
          <FaShareAlt className={styles.icon} />
          <span className={styles.text}>Share</span>
        </div>
        <div className={styles.shine}></div>
        <div className={styles.background}>
          <div className={styles.tiles}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.tile}></div>
            ))}
          </div>
        </div>
      </button>

      <button 
        className={`${styles.actionButton} ${styles.printButton} ${activeButton === 'print' ? styles.active : ''}`}
        onClick={() => handleAction('print', onPrint)}
        title="Print Invoice"
      >
        <div className={styles.buttonContent}>
          <FaPrint className={styles.icon} />
          <span className={styles.text}>Print</span>
        </div>
        <div className={styles.shine}></div>
        <div className={styles.background}>
          <div className={styles.tiles}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.tile}></div>
            ))}
          </div>
        </div>
      </button>

      <button 
        className={`${styles.actionButton} ${styles.downloadButton} ${activeButton === 'download' ? styles.active : ''}`}
        onClick={() => handleAction('download', onDownload)}
        title="Download PDF"
      >
        <div className={styles.buttonContent}>
          <FaFileDownload className={styles.icon} />
          <span className={styles.text}>Download PDF</span>
        </div>
        <div className={styles.shine}></div>
        <div className={styles.background}>
          <div className={styles.tiles}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.tile}></div>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;

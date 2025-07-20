import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

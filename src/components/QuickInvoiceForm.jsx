import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useInvoice } from '../context/InvoiceContext';
import { useAuth } from '../context/AuthContext';
import styles from './QuickInvoiceForm.module.css';
import { FaCamera, FaPlus, FaTimes, FaCheck, FaDollarSign, FaClock } from 'react-icons/fa';

const QuickInvoiceForm = ({ onClose, onComplete }) => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const { canCreateInvoice } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [quickData, setQuickData] = useState({
    clientName: '',
    description: '',
    amount: '',
    dueDate: '',
    photoExpenses: []
  });

  const handleInputChange = (field, value) => {
    setQuickData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            file: file,
            dataUrl: event.target.result,
            name: file.name,
            amount: ''
          };
          setQuickData(prev => ({
            ...prev,
            photoExpenses: [...prev.photoExpenses, newPhoto]
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select image files only');
      }
    });
  };

  const removePhoto = (photoId) => {
    setQuickData(prev => ({
      ...prev,
      photoExpenses: prev.photoExpenses.filter(photo => photo.id !== photoId)
    }));
  };

  const updatePhotoAmount = (photoId, amount) => {
    setQuickData(prev => ({
      ...prev,
      photoExpenses: prev.photoExpenses.map(photo =>
        photo.id === photoId ? { ...photo, amount } : photo
      )
    }));
  };

  const calculateTotal = () => {
    const baseAmount = parseFloat(quickData.amount) || 0;
    const photoTotal = quickData.photoExpenses.reduce((total, photo) => {
      return total + (parseFloat(photo.amount) || 0);
    }, 0);
    return (baseAmount + photoTotal).toFixed(2);
  };

  const handleSubmit = () => {
    if (!canCreateInvoice()) {
      toast.warning('You have reached your free invoice limit. Please upgrade to continue.');
      return;
    }

    if (!quickData.clientName || !quickData.description) {
      toast.error('Please fill in client name and description');
      return;
    }

    const totalAmount = calculateTotal();
    if (parseFloat(totalAmount) <= 0) {
      toast.error('Please add an amount or photo expenses');
      return;
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    
    // Create line items
    const lineItems = [];
    
    if (quickData.amount && parseFloat(quickData.amount) > 0) {
      lineItems.push({
        id: Date.now(),
        description: quickData.description,
        quantity: 1,
        rate: parseFloat(quickData.amount),
        total: parseFloat(quickData.amount)
      });
    }

    // Add photo expenses as line items
    quickData.photoExpenses.forEach((photo, index) => {
      if (photo.amount && parseFloat(photo.amount) > 0) {
        lineItems.push({
          id: Date.now() + index + 1,
          description: `Expense Receipt: ${photo.name}`,
          quantity: 1,
          rate: parseFloat(photo.amount),
          total: parseFloat(photo.amount)
        });
      }
    });

    // Set due date (default to 30 days if not specified)
    const dueDate = quickData.dueDate || 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Update invoice data
    updateInvoiceData({
      ...invoiceData,
      clientName: quickData.clientName,
      invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate,
      lineItems,
      notes: `Quick Invoice created with ${quickData.photoExpenses.length} photo expense(s)`,
      status: 'pending'
    });

    // Save to localStorage
    try {
      const invoiceRecord = {
        id: Date.now().toString(),
        invoiceData: {
          ...invoiceData,
          clientName: quickData.clientName,
          invoiceNumber,
          invoiceDate: new Date().toISOString().split('T')[0],
          dueDate,
          lineItems,
          photoExpenses: quickData.photoExpenses
        },
        date: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      savedInvoices.push(invoiceRecord);
      if (savedInvoices.length > 50) {
        savedInvoices.shift();
      }
      localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));

      toast.success('Quick invoice created successfully!');
      onComplete && onComplete();
      onClose();
    } catch (error) {
      console.error('Failed to save quick invoice:', error);
      toast.error('Failed to save invoice. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!quickData.clientName || !quickData.description)) {
      toast.error('Please fill in client name and description');
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className={styles.quickInvoiceForm}>
      <div className={styles.header}>
        <h2>
          <FaClock /> Quick Invoice
        </h2>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStep >= 1 ? styles.active : ''}`}>1</div>
          <span>Details</span>
        </div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStep >= 2 ? styles.active : ''}`}>2</div>
          <span>Amount</span>
        </div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${currentStep >= 3 ? styles.active : ''}`}>3</div>
          <span>Review</span>
        </div>
      </div>

      <div className={styles.formContent}>
        {currentStep === 1 && (
          <div className={styles.step}>
            <h3>Invoice Details</h3>
            <div className={styles.formGroup}>
              <label>Client Name</label>
              <input
                type="text"
                value={quickData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client name"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={quickData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="What are you billing for?"
                className={styles.textarea}
                rows="3"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Due Date (Optional)</label>
              <input
                type="date"
                value={quickData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.step}>
            <h3>Amount & Expenses</h3>
            <div className={styles.formGroup}>
              <label>Base Amount</label>
              <div className={styles.amountInput}>
                <FaDollarSign className={styles.dollarIcon} />
                <input
                  type="number"
                  value={quickData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.photoSection}>
              <label>Photo Expenses</label>
              <div className={styles.photoUpload}>
                <input
                  type="file"
                  id="photoInput"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className={styles.hiddenInput}
                />
                <label htmlFor="photoInput" className={styles.uploadButton}>
                  <FaCamera /> Add Receipt Photos
                </label>
              </div>

              <div className={styles.photoList}>
                {quickData.photoExpenses.map(photo => (
                  <div key={photo.id} className={styles.photoItem}>
                    <img src={photo.dataUrl} alt={photo.name} className={styles.photoThumb} />
                    <div className={styles.photoDetails}>
                      <span className={styles.photoName}>{photo.name}</span>
                      <input
                        type="number"
                        value={photo.amount}
                        onChange={(e) => updatePhotoAmount(photo.id, e.target.value)}
                        placeholder="Amount"
                        className={styles.photoAmountInput}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <button
                      className={styles.removePhoto}
                      onClick={() => removePhoto(photo.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.step}>
            <h3>Review & Create</h3>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span>Client:</span>
                <strong>{quickData.clientName}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Description:</span>
                <strong>{quickData.description}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Base Amount:</span>
                <strong>${quickData.amount || '0.00'}</strong>
              </div>
              {quickData.photoExpenses.length > 0 && (
                <div className={styles.summaryItem}>
                  <span>Photo Expenses:</span>
                  <strong>
                    ${quickData.photoExpenses.reduce((total, photo) => {
                      return total + (parseFloat(photo.amount) || 0);
                    }, 0).toFixed(2)}
                  </strong>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>Total Amount:</span>
                <strong>${calculateTotal()}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Due Date:</span>
                <strong>
                  {quickData.dueDate || 
                    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  }
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {currentStep > 1 && (
          <button className={styles.prevButton} onClick={prevStep}>
            Previous
          </button>
        )}
        {currentStep < 3 ? (
          <button className={styles.nextButton} onClick={nextStep}>
            Next
          </button>
        ) : (
          <button className={styles.createButton} onClick={handleSubmit}>
            <FaCheck /> Create Invoice
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickInvoiceForm;

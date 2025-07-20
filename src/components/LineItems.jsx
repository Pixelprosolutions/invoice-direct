import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useInvoice } from '../context/InvoiceContext';
import { calculateTotals, formatCurrency } from '../utils/helpers';
import styles from './LineItems.module.css';

const LineItems = () => {
  const { invoiceData, addLineItem, updateLineItem, removeLineItem } = useInvoice();
  
  // Ensure lineItems exists before calculating totals
  const lineItems = invoiceData?.lineItems || [];
  const { subtotal, tax, total } = calculateTotals(lineItems);

  const handleChange = (id, field, value) => {
    // Convert numeric values
    if (field === 'quantity' || field === 'unitPrice' || field === 'tax') {
      value = parseFloat(value) || 0;
    }
    
    updateLineItem(id, field, value);
  };

  // If invoiceData is not yet loaded, show a loading state
  if (!invoiceData) {
    return <div className={styles.loading}>Loading line items...</div>;
  }

  return (
    <div className={styles.lineItemsContainer}>
      <div className={styles.lineItemsTable}>
        <div className={styles.lineItemsHeader}>
          <div className={styles.description}>Description</div>
          <div className={styles.quantity}>Quantity</div>
          <div className={styles.unitPrice}>Unit Price</div>
          <div className={styles.tax}>Tax (%)</div>
          <div className={styles.amount}>Amount</div>
          <div className={styles.actions}></div>
        </div>
        
        <div className={styles.lineItemsList}>
          {lineItems.map((item) => (
            <div key={item.id} className={styles.lineItem}>
              <div className={styles.description}>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className={styles.quantity}>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => handleChange(item.id, 'quantity', e.target.value)}
                />
              </div>
              <div className={styles.unitPrice}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleChange(item.id, 'unitPrice', e.target.value)}
                />
              </div>
              <div className={styles.tax}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={item.tax}
                  onChange={(e) => handleChange(item.id, 'tax', e.target.value)}
                />
              </div>
              <div className={styles.amount}>
                {formatCurrency(item.quantity * item.unitPrice)}
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeLineItem(item.id)}
                  disabled={lineItems.length <= 1}
                  title={lineItems.length <= 1 ? "Cannot remove the last item" : "Remove item"}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.addItemRow}>
          <button
            type="button"
            className={styles.addButton}
            onClick={addLineItem}
          >
            <FaPlus /> Add Item
          </button>
        </div>
        
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <div className={styles.totalLabel}>Subtotal</div>
            <div className={styles.totalValue}>{formatCurrency(subtotal)}</div>
          </div>
          <div className={styles.totalRow}>
            <div className={styles.totalLabel}>Tax</div>
            <div className={styles.totalValue}>{formatCurrency(tax)}</div>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <div className={styles.totalLabel}>Total</div>
            <div className={styles.totalValue}>{formatCurrency(total)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItems;

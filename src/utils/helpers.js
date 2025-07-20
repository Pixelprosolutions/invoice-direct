/**
 * Calculates subtotal, tax, and total from line items
 * @param {Array} lineItems - Array of line items with quantity, unitPrice, and tax
 * @returns {Object} Object containing subtotal, tax, and total
 */
export const calculateTotals = (lineItems = []) => {
  // Ensure lineItems is an array
  if (!Array.isArray(lineItems)) {
    console.warn('calculateTotals received non-array:', lineItems);
    lineItems = [];
  }

  const subtotal = lineItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return sum + (quantity * unitPrice);
  }, 0);

  const tax = lineItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const taxRate = Number(item.tax) || 0;
    const itemTotal = quantity * unitPrice;
    return sum + (itemTotal * (taxRate / 100));
  }, 0);

  const total = subtotal + tax;

  return { subtotal, tax, total };
};

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  // Ensure amount is a number
  amount = Number(amount) || 0;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a date string
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Generates a random invoice number
 * @returns {string} Random invoice number
 */
export const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  
  return `${prefix}-${date}-${randomNum}`;
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Debounces a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InvoiceContext = createContext();

const defaultInvoiceData = {
  businessName: '',
  businessAddress: '',
  contactInfo: {
    email: '',
    phone: ''
  },
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',
  invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  poNumber: '',
  lineItems: [
    {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0
    }
  ],
  bankDetails: {
    accountName: '',
    accountNumber: '',
    sortCode: ''
  },
  notes: '',
  terms: '',
  status: 'pending',
  design: {
    colors: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#10B981'
    },
    fonts: {
      header: 'Inter',
      body: 'Inter',
      accent: 'Inter'
    },
    spacing: {
      pageMargins: 40,
      sectionSpacing: 24,
      lineHeight: 1.5
    },
    template: 'modern'
  }
};

export const InvoiceProvider = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState(() => {
    const savedInvoice = localStorage.getItem('invoiceData');
    return savedInvoice ? JSON.parse(savedInvoice) : defaultInvoiceData;
  });

  useEffect(() => {
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
  }, [invoiceData]);

  const updateInvoiceData = (newData) => {
    setInvoiceData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const resetInvoiceData = () => {
    setInvoiceData(defaultInvoiceData);
  };

  const addLineItem = () => {
    const newItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0
    };

    setInvoiceData(prevData => ({
      ...prevData,
      lineItems: [...prevData.lineItems, newItem]
    }));
  };

  const updateLineItem = (id, field, value) => {
    setInvoiceData(prevData => ({
      ...prevData,
      lineItems: prevData.lineItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLineItem = (id) => {
    setInvoiceData(prevData => ({
      ...prevData,
      lineItems: prevData.lineItems.filter(item => item.id !== id)
    }));
  };

  return (
    <InvoiceContext.Provider value={{
      invoiceData,
      updateInvoiceData,
      resetInvoiceData,
      addLineItem,
      updateLineItem,
      removeLineItem
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

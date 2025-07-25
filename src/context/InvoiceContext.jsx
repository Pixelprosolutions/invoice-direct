import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InvoiceContext = createContext();

const defaultInvoiceData = {
  businessName: 'Your Business Name',
  businessAddress: 'Your Business Address\nCity, State ZIP',
  contactInfo: {
    email: 'hello@yourbusiness.com',
    phone: '+1 (555) 123-4567'
  },
  clientName: 'Client Name',
  clientAddress: 'Client Address\nCity, State ZIP',
  clientEmail: 'client@email.com',
  clientPhone: '+1 (555) 987-6543',
  invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  poNumber: '',
  lineItems: [
    {
      id: uuidv4(),
      description: 'Web Development Services',
      quantity: 1,
      unitPrice: 1500,
      tax: 0
    }
  ],
  bankDetails: {
    accountName: 'Your Business Name',
    accountNumber: '12345678',
    sortCode: '12-34-56'
  },
  notes: 'Thank you for your business! Payment is due within 30 days.',
  terms: 'Payment is due within 30 days. Late payments may incur a 1.5% monthly service charge.',
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
  const [appliedTemplate, setAppliedTemplate] = useState(null);

  // Load and apply template on mount
  useEffect(() => {
    const loadTemplate = () => {
      const savedTemplate = localStorage.getItem('currentInvoiceTemplate');
      if (savedTemplate) {
        try {
          const template = JSON.parse(savedTemplate);
          setAppliedTemplate(template);
          applyTemplateToInvoice(template);
        } catch (error) {
          console.error('Error loading applied template:', error);
        }
      }
    };
    loadTemplate();
  }, []);

  const [invoiceData, setInvoiceData] = useState(() => {
    const savedInvoice = localStorage.getItem('invoiceData');
    return savedInvoice ? JSON.parse(savedInvoice) : defaultInvoiceData;
  });

  const applyTemplateToInvoice = (template) => {
    if (!template) return;

    // Load business profile if available
    const businessProfile = localStorage.getItem('businessProfile');
    let businessData = {};

    if (businessProfile) {
      try {
        const profile = JSON.parse(businessProfile);
        businessData = {
          businessName: profile.businessName || defaultInvoiceData.businessName,
          businessAddress: `${profile.businessAddress || ''}\n${profile.businessCity || ''}, ${profile.businessState || ''} ${profile.businessZip || ''}`.trim(),
          contactInfo: {
            email: profile.businessEmail || defaultInvoiceData.contactInfo.email,
            phone: profile.businessPhone || defaultInvoiceData.contactInfo.phone
          }
        };
      } catch (error) {
        console.error('Error loading business profile:', error);
      }
    }

    // Apply template design and defaults
    const templateData = {
      ...businessData,
      notes: template.defaults?.notes || defaultInvoiceData.notes,
      terms: template.defaults?.paymentTerms || defaultInvoiceData.terms,
      design: {
        colors: {
          primary: template.branding?.primaryColor || defaultInvoiceData.design.colors.primary,
          secondary: template.branding?.secondaryColor || defaultInvoiceData.design.colors.secondary,
          accent: template.branding?.accentColor || defaultInvoiceData.design.colors.accent,
          text: defaultInvoiceData.design.colors.text,
          background: defaultInvoiceData.design.colors.background
        },
        fonts: {
          header: template.branding?.fontFamily || defaultInvoiceData.design.fonts.header,
          body: template.branding?.fontFamily || defaultInvoiceData.design.fonts.body,
          accent: template.branding?.fontFamily || defaultInvoiceData.design.fonts.accent
        },
        spacing: {
          ...defaultInvoiceData.design.spacing,
          ...(template.layout?.spacing === 'compact' && { pageMargins: 20, sectionSpacing: 16 }),
          ...(template.layout?.spacing === 'spacious' && { pageMargins: 60, sectionSpacing: 32 })
        },
        template: template.id || 'modern',
        layout: {
          headerStyle: template.layout?.headerStyle || 'gradient',
          tableStyle: template.layout?.tableStyle || 'modern',
          footerIncluded: template.layout?.footerIncluded !== false
        }
      }
    };

    setInvoiceData(prevData => ({
      ...prevData,
      ...templateData
    }));
  };

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
      description: 'Service or Product',
      quantity: 1,
      unitPrice: 100,
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

  const applyTemplate = (template) => {
    setAppliedTemplate(template);
    localStorage.setItem('currentInvoiceTemplate', JSON.stringify(template));
    applyTemplateToInvoice(template);
  };

  return (
    <InvoiceContext.Provider value={{
      invoiceData,
      updateInvoiceData,
      resetInvoiceData,
      addLineItem,
      updateLineItem,
      removeLineItem,
      appliedTemplate,
      applyTemplate
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

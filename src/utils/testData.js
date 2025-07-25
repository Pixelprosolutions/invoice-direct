// Test data utility for populating the app with sample data
export const createSampleInvoices = () => {
  const sampleInvoices = [
    {
      id: '1703123456789',
      invoiceData: {
        businessName: 'Pixelpro Solutions',
        businessAddress: '123 Business Street\nNew York, NY 10001',
        contactInfo: {
          email: 'hello@pixelpro.solutions',
          phone: '+1 (555) 123-4567'
        },
        clientName: 'Acme Corporation',
        clientAddress: '456 Client Avenue\nLos Angeles, CA 90210',
        clientEmail: 'billing@acme.com',
        clientPhone: '+1 (555) 987-6543',
        invoiceNumber: 'INV-2024-001',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-14',
        poNumber: 'PO-ACME-2024-001',
        lineItems: [
          {
            id: 1,
            description: 'Website Design & Development',
            quantity: 1,
            rate: 2500.00,
            total: 2500.00
          },
          {
            id: 2,
            description: 'Logo Design',
            quantity: 1,
            rate: 500.00,
            total: 500.00
          },
          {
            id: 3,
            description: 'SEO Optimization',
            quantity: 3,
            rate: 200.00,
            total: 600.00
          }
        ],
        bankDetails: {
          accountName: 'Pixelpro Solutions LLC',
          accountNumber: '****1234',
          sortCode: '12-34-56'
        },
        notes: 'Thank you for your business! Payment is due within 30 days.',
        terms: 'Payment terms: Net 30 days. Late fees apply after due date.',
        status: 'paid',
        paymentDate: '2024-02-10'
      },
      date: '2024-01-15T10:30:00.000Z',
      lastModified: '2024-02-10T14:22:00.000Z'
    },
    {
      id: '1703223456789',
      invoiceData: {
        businessName: 'Pixelpro Solutions',
        businessAddress: '123 Business Street\nNew York, NY 10001',
        contactInfo: {
          email: 'hello@pixelpro.solutions',
          phone: '+1 (555) 123-4567'
        },
        clientName: 'TechStart Inc',
        clientAddress: '789 Startup Blvd\nSan Francisco, CA 94105',
        clientEmail: 'finance@techstart.com',
        clientPhone: '+1 (555) 246-8135',
        invoiceNumber: 'INV-2024-002',
        invoiceDate: '2024-02-01',
        dueDate: '2024-03-03',
        poNumber: 'PO-TECH-2024-002',
        lineItems: [
          {
            id: 1,
            description: 'Mobile App Development',
            quantity: 1,
            rate: 4500.00,
            total: 4500.00
          },
          {
            id: 2,
            description: 'UI/UX Design',
            quantity: 1,
            rate: 1200.00,
            total: 1200.00
          }
        ],
        bankDetails: {
          accountName: 'Pixelpro Solutions LLC',
          accountNumber: '****1234',
          sortCode: '12-34-56'
        },
        notes: 'Mobile app project for iOS and Android platforms.',
        terms: 'Payment terms: Net 30 days. Late fees apply after due date.',
        status: 'unpaid'
      },
      date: '2024-02-01T09:15:00.000Z',
      lastModified: '2024-02-01T09:15:00.000Z'
    },
    {
      id: '1703323456789',
      invoiceData: {
        businessName: 'Pixelpro Solutions',
        businessAddress: '123 Business Street\nNew York, NY 10001',
        contactInfo: {
          email: 'hello@pixelpro.solutions',
          phone: '+1 (555) 123-4567'
        },
        clientName: 'Global Enterprises',
        clientAddress: '321 Enterprise Way\nChicago, IL 60601',
        clientEmail: 'accounts@global-ent.com',
        clientPhone: '+1 (555) 369-2580',
        invoiceNumber: 'INV-2024-003',
        invoiceDate: '2024-01-20',
        dueDate: '2024-01-25',
        poNumber: 'PO-GLOBAL-2024-001',
        lineItems: [
          {
            id: 1,
            description: 'Emergency Website Fix',
            quantity: 8,
            rate: 150.00,
            total: 1200.00
          }
        ],
        bankDetails: {
          accountName: 'Pixelpro Solutions LLC',
          accountNumber: '****1234',
          sortCode: '12-34-56'
        },
        notes: 'Emergency fix for website downtime.',
        terms: 'Payment terms: Due immediately. Late fees apply after due date.',
        status: 'unpaid'
      },
      date: '2024-01-20T16:45:00.000Z',
      lastModified: '2024-01-20T16:45:00.000Z'
    },
    {
      id: '1703423456789',
      invoiceData: {
        businessName: 'Pixelpro Solutions',
        businessAddress: '123 Business Street\nNew York, NY 10001',
        contactInfo: {
          email: 'hello@pixelpro.solutions',
          phone: '+1 (555) 123-4567'
        },
        clientName: 'Creative Studio',
        clientAddress: '654 Design Street\nPortland, OR 97201',
        clientEmail: 'billing@creativestudio.com',
        clientPhone: '+1 (555) 147-2583',
        invoiceNumber: 'INV-2024-004',
        invoiceDate: '2024-02-15',
        dueDate: '2024-03-17',
        poNumber: 'PO-CREATIVE-2024-001',
        lineItems: [
          {
            id: 1,
            description: 'Brand Identity Package',
            quantity: 1,
            rate: 2800.00,
            total: 2800.00
          },
          {
            id: 2,
            description: 'Business Card Design',
            quantity: 1,
            rate: 300.00,
            total: 300.00
          }
        ],
        bankDetails: {
          accountName: 'Pixelpro Solutions LLC',
          accountNumber: '****1234',
          sortCode: '12-34-56'
        },
        notes: 'Complete brand identity including logo, colors, and typography.',
        terms: 'Payment terms: Net 30 days. Late fees apply after due date.',
        status: 'paid',
        paymentDate: '2024-03-15'
      },
      date: '2024-02-15T11:20:00.000Z',
      lastModified: '2024-03-15T13:30:00.000Z'
    },
    {
      id: '1703523456789',
      invoiceData: {
        businessName: 'Pixelpro Solutions',
        businessAddress: '123 Business Street\nNew York, NY 10001',
        contactInfo: {
          email: 'hello@pixelpro.solutions',
          phone: '+1 (555) 123-4567'
        },
        clientName: 'Local Restaurant',
        clientAddress: '987 Food Court\nAustin, TX 78701',
        clientEmail: 'owner@localrestaurant.com',
        clientPhone: '+1 (555) 789-4561',
        invoiceNumber: 'INV-2024-005',
        invoiceDate: '2024-03-01',
        dueDate: '2024-03-31',
        poNumber: 'PO-RESTO-2024-001',
        lineItems: [
          {
            id: 1,
            description: 'Restaurant Website',
            quantity: 1,
            rate: 1800.00,
            total: 1800.00
          },
          {
            id: 2,
            description: 'Online Menu Integration',
            quantity: 1,
            rate: 500.00,
            total: 500.00
          },
          {
            id: 3,
            description: 'Social Media Setup',
            quantity: 1,
            rate: 400.00,
            total: 400.00
          }
        ],
        bankDetails: {
          accountName: 'Pixelpro Solutions LLC',
          accountNumber: '****1234',
          sortCode: '12-34-56'
        },
        notes: 'Website with online ordering and social media integration.',
        terms: 'Payment terms: Net 30 days. Late fees apply after due date.',
        status: 'unpaid'
      },
      date: '2024-03-01T14:10:00.000Z',
      lastModified: '2024-03-01T14:10:00.000Z'
    }
  ];

  return sampleInvoices;
};

export const createSampleClients = () => {
  const sampleClients = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      phone: '+1 (555) 987-6543',
      address: '456 Client Avenue\nLos Angeles, CA 90210',
      contactPerson: 'John Smith',
      businessType: 'Technology',
      paymentTerms: 'Net 30',
      taxId: '12-3456789',
      notes: 'Large enterprise client. Always pays on time.',
      dateAdded: '2024-01-10T10:00:00.000Z',
      lastInvoice: '2024-01-15T10:30:00.000Z',
      totalInvoiced: 3600.00,
      totalPaid: 3600.00,
      invoiceCount: 1,
      status: 'active'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'finance@techstart.com',
      phone: '+1 (555) 246-8135',
      address: '789 Startup Blvd\nSan Francisco, CA 94105',
      contactPerson: 'Sarah Johnson',
      businessType: 'Startup',
      paymentTerms: 'Net 30',
      taxId: '98-7654321',
      notes: 'Fast-growing startup. Promising client.',
      dateAdded: '2024-01-28T15:30:00.000Z',
      lastInvoice: '2024-02-01T09:15:00.000Z',
      totalInvoiced: 5700.00,
      totalPaid: 0.00,
      invoiceCount: 1,
      status: 'active'
    },
    {
      id: '3',
      name: 'Global Enterprises',
      email: 'accounts@global-ent.com',
      phone: '+1 (555) 369-2580',
      address: '321 Enterprise Way\nChicago, IL 60601',
      contactPerson: 'Michael Brown',
      businessType: 'Enterprise',
      paymentTerms: 'Due Immediately',
      taxId: '55-9988776',
      notes: 'Emergency client. Quick turnaround required.',
      dateAdded: '2024-01-19T12:00:00.000Z',
      lastInvoice: '2024-01-20T16:45:00.000Z',
      totalInvoiced: 1200.00,
      totalPaid: 0.00,
      invoiceCount: 1,
      status: 'active'
    },
    {
      id: '4',
      name: 'Creative Studio',
      email: 'billing@creativestudio.com',
      phone: '+1 (555) 147-2583',
      address: '654 Design Street\nPortland, OR 97201',
      contactPerson: 'Emma Wilson',
      businessType: 'Design Agency',
      paymentTerms: 'Net 30',
      taxId: '33-2211445',
      notes: 'Creative agency. Collaborative and professional.',
      dateAdded: '2024-02-10T09:45:00.000Z',
      lastInvoice: '2024-02-15T11:20:00.000Z',
      totalInvoiced: 3100.00,
      totalPaid: 3100.00,
      invoiceCount: 1,
      status: 'active'
    },
    {
      id: '5',
      name: 'Local Restaurant',
      email: 'owner@localrestaurant.com',
      phone: '+1 (555) 789-4561',
      address: '987 Food Court\nAustin, TX 78701',
      contactPerson: 'Carlos Rodriguez',
      businessType: 'Restaurant',
      paymentTerms: 'Net 30',
      taxId: '77-4455881',
      notes: 'Local family restaurant. Focus on local SEO.',
      dateAdded: '2024-02-25T16:20:00.000Z',
      lastInvoice: '2024-03-01T14:10:00.000Z',
      totalInvoiced: 2700.00,
      totalPaid: 0.00,
      invoiceCount: 1,
      status: 'active'
    }
  ];

  return sampleClients;
};

export const createSampleBusinessProfile = () => {
  return {
    businessName: 'Pixelpro Solutions',
    legalName: 'Pixelpro Solutions LLC',
    address: '123 Business Street\nNew York, NY 10001\nUnited States',
    phone: '+1 (555) 123-4567',
    email: 'hello@pixelpro.solutions',
    website: 'https://pixelpro.solutions',
    taxId: '12-3456789',
    businessNumber: 'BN123456789',
    logo: null,
    
    // Payment details
    bankDetails: {
      bankName: 'First National Bank',
      accountName: 'Pixelpro Solutions LLC',
      accountNumber: '****1234',
      routingNumber: '****5678',
      sortCode: '12-34-56',
      iban: 'US12 3456 7890 1234 5678 90',
      swiftCode: 'FNBKUS33'
    },
    
    // Payment terms
    defaultPaymentTerms: 'Net 30',
    lateFeeRate: 1.5,
    lateFeeType: 'percentage', // or 'fixed'
    
    // Tax settings
    taxRate: 8.25,
    taxNumber: 'TAX123456789',
    taxLabel: 'Sales Tax',
    
    // Invoice settings
    invoicePrefix: 'INV',
    invoiceNumberStart: 1,
    defaultNotes: 'Thank you for your business! Payment is due within 30 days.',
    defaultTerms: 'Payment terms: Net 30 days. Late fees apply after due date.',
    
    // Created/updated timestamps
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-01T12:00:00.000Z'
  };
};

export const populateAppWithSampleData = () => {
  try {
    // Clear existing data
    localStorage.removeItem('savedInvoices');
    localStorage.removeItem('clients');
    localStorage.removeItem('businessProfile');
    
    // Add sample data
    localStorage.setItem('savedInvoices', JSON.stringify(createSampleInvoices()));
    localStorage.setItem('clients', JSON.stringify(createSampleClients()));
    localStorage.setItem('businessProfile', JSON.stringify(createSampleBusinessProfile()));
    
    console.log('Sample data populated successfully!');
    return true;
  } catch (error) {
    console.error('Error populating sample data:', error);
    return false;
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem('savedInvoices');
    localStorage.removeItem('clients');
    localStorage.removeItem('businessProfile');
    localStorage.removeItem('invoiceData');
    localStorage.removeItem('appliedTemplate');
    localStorage.removeItem('previousOverdueCount');
    localStorage.removeItem('lastOverdueCheck');
    
    console.log('All data cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

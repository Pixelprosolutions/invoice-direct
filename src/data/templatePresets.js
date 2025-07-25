// Invoice Template Presets
export const templatePresets = [
  // Professional Services Templates
  {
    id: 'professional-modern',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for consultants, lawyers, and professional services',
    category: 'professional',
    industry: 'Professional Services',
    thumbnail: '/templates/professional-modern.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#4f46e5',
      secondaryColor: '#7c3aed',
      accentColor: '#059669',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'gradient',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Net 30',
      notes: 'Thank you for your business! We appreciate the opportunity to work with you.',
      taxRate: 8.25,
      currency: 'USD'
    }
  },
  {
    id: 'professional-classic',
    name: 'Classic Professional',
    description: 'Traditional, formal design ideal for law firms and accounting practices',
    category: 'professional',
    industry: 'Professional Services',
    thumbnail: '/templates/professional-classic.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#1e293b',
      secondaryColor: '#475569',
      accentColor: '#059669',
      fontFamily: 'Georgia',
      fontSize: 'medium',
      logoPosition: 'top-center'
    },
    layout: {
      headerStyle: 'solid',
      spacing: 'spacious',
      tableStyle: 'classic',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: true
    },
    defaults: {
      paymentTerms: 'Due upon receipt',
      notes: 'Payment is due within the terms specified above.',
      taxRate: 8.25,
      currency: 'USD'
    }
  },

  // Creative Industry Templates
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    description: 'Colorful, modern design for creative agencies, designers, and artists',
    category: 'creative',
    industry: 'Creative & Design',
    thumbnail: '/templates/creative-vibrant.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#f59e0b',
      secondaryColor: '#ef4444',
      accentColor: '#8b5cf6',
      fontFamily: 'Poppins',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'gradient',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Net 15',
      notes: 'Thank you for choosing us for your creative project!',
      taxRate: 8.25,
      currency: 'USD'
    }
  },
  {
    id: 'creative-minimal',
    name: 'Minimal Creative',
    description: 'Clean, minimalist design for photographers and creative professionals',
    category: 'creative',
    industry: 'Creative & Design',
    thumbnail: '/templates/creative-minimal.jpg',
    isPremium: true,
    branding: {
      primaryColor: '#000000',
      secondaryColor: '#6b7280',
      accentColor: '#10b981',
      fontFamily: 'Inter',
      fontSize: 'large',
      logoPosition: 'top-center'
    },
    layout: {
      headerStyle: 'minimal',
      spacing: 'spacious',
      tableStyle: 'minimal',
      footerIncluded: false,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Net 30',
      notes: '',
      taxRate: 8.25,
      currency: 'USD'
    }
  },

  // Construction & Trades Templates
  {
    id: 'construction-bold',
    name: 'Construction Pro',
    description: 'Bold, professional design for contractors and construction companies',
    category: 'construction',
    industry: 'Construction & Trades',
    thumbnail: '/templates/construction-bold.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#ea580c',
      secondaryColor: '#dc2626',
      accentColor: '#0891b2',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'solid',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: true
    },
    defaults: {
      paymentTerms: 'Net 15',
      notes: 'Materials and labor as specified in contract. Thank you for your business!',
      taxRate: 8.25,
      currency: 'USD'
    }
  },

  // Retail & E-commerce Templates
  {
    id: 'retail-friendly',
    name: 'Retail Friendly',
    description: 'Warm, approachable design perfect for retail stores and online shops',
    category: 'retail',
    industry: 'Retail & E-commerce',
    thumbnail: '/templates/retail-friendly.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#0d9488',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'gradient',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Due upon receipt',
      notes: 'Thank you for your purchase! We hope you love your items.',
      taxRate: 8.25,
      currency: 'USD'
    }
  },

  // Technology Templates
  {
    id: 'tech-sleek',
    name: 'Tech Sleek',
    description: 'Modern, tech-forward design for software companies and IT services',
    category: 'technology',
    industry: 'Technology & IT',
    thumbnail: '/templates/tech-sleek.jpg',
    isPremium: true,
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      accentColor: '#10b981',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'gradient',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Net 30',
      notes: 'Thank you for choosing our technology solutions.',
      taxRate: 8.25,
      currency: 'USD'
    }
  },

  // Healthcare Templates
  {
    id: 'healthcare-clean',
    name: 'Healthcare Clean',
    description: 'Professional, clean design for medical practices and healthcare services',
    category: 'healthcare',
    industry: 'Healthcare & Medical',
    thumbnail: '/templates/healthcare-clean.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#0891b2',
      secondaryColor: '#0e7490',
      accentColor: '#059669',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-center'
    },
    layout: {
      headerStyle: 'solid',
      spacing: 'comfortable',
      tableStyle: 'classic',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: true
    },
    defaults: {
      paymentTerms: 'Due upon receipt',
      notes: 'Thank you for trusting us with your healthcare needs.',
      taxRate: 0, // Many healthcare services are tax-exempt
      currency: 'USD'
    }
  },

  // Custom/Blank Template
  {
    id: 'custom-blank',
    name: 'Custom Blank',
    description: 'Start from scratch and create your own unique template',
    category: 'custom',
    industry: 'Custom',
    thumbnail: '/templates/custom-blank.jpg',
    isPremium: false,
    branding: {
      primaryColor: '#6b7280',
      secondaryColor: '#9ca3af',
      accentColor: '#4f46e5',
      fontFamily: 'Inter',
      fontSize: 'medium',
      logoPosition: 'top-left'
    },
    layout: {
      headerStyle: 'minimal',
      spacing: 'comfortable',
      tableStyle: 'modern',
      footerIncluded: true,
      watermarkEnabled: false,
      showBorder: false
    },
    defaults: {
      paymentTerms: 'Net 30',
      notes: 'Thank you for your business!',
      taxRate: 8.25,
      currency: 'USD'
    }
  }
]

// Template Categories
export const templateCategories = [
  {
    id: 'all',
    name: 'All Templates',
    description: 'Browse all available templates',
    icon: 'FaPalette'
  },
  {
    id: 'professional',
    name: 'Professional Services',
    description: 'Consulting, legal, accounting, and professional services',
    icon: 'FaBriefcase'
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    description: 'Agencies, designers, photographers, and artists',
    icon: 'FaPaintBrush'
  },
  {
    id: 'construction',
    name: 'Construction & Trades',
    description: 'Contractors, builders, and trade professionals',
    icon: 'FaHammer'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'Stores, online shops, and product sales',
    icon: 'FaShoppingCart'
  },
  {
    id: 'technology',
    name: 'Technology & IT',
    description: 'Software companies, IT services, and tech consultants',
    icon: 'FaLaptopCode'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    description: 'Medical practices, clinics, and healthcare services',
    icon: 'FaHeartbeat'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Create your own unique templates',
    icon: 'FaCog'
  }
]

// Font options
export const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern)', category: 'modern' },
  { value: 'Georgia', label: 'Georgia (Classic)', category: 'classic' },
  { value: 'Poppins', label: 'Poppins (Friendly)', category: 'modern' },
  { value: 'Roboto', label: 'Roboto (Clean)', category: 'modern' },
  { value: 'Times New Roman', label: 'Times (Traditional)', category: 'classic' },
  { value: 'Arial', label: 'Arial (Standard)', category: 'standard' }
]

// Color palettes
export const colorPalettes = [
  {
    name: 'Professional Blue',
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#059669'
  },
  {
    name: 'Classic Black',
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#059669'
  },
  {
    name: 'Creative Orange',
    primary: '#f59e0b',
    secondary: '#ef4444',
    accent: '#8b5cf6'
  },
  {
    name: 'Tech Blue',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#10b981'
  },
  {
    name: 'Nature Green',
    primary: '#059669',
    secondary: '#0d9488',
    accent: '#f59e0b'
  },
  {
    name: 'Healthcare Teal',
    primary: '#0891b2',
    secondary: '#0e7490',
    accent: '#059669'
  }
]

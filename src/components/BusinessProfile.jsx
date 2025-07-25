import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaBuilding, FaCreditCard, FaPercent, FaSave, FaUndo, FaArrowLeft, FaHome } from 'react-icons/fa'
import BusinessInfoForm from './BusinessInfoForm'
import PaymentTermsForm from './PaymentTermsForm'
import TaxSettingsForm from './TaxSettingsForm'
import styles from './BusinessProfile.module.css'

const BusinessProfile = () => {
  const [activeTab, setActiveTab] = useState('business')
  const [businessData, setBusinessData] = useState({
    // Business Information
    businessName: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessCountry: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    businessLogo: '',
    taxId: '',
    
    // Payment Terms
    defaultPaymentTerms: '30',
    paymentMethods: ['Bank Transfer', 'Check'],
    bankName: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
    bankSwiftCode: '',
    lateFee: '',
    lateFeePeriod: '30',
    
    // Tax Settings
    defaultTaxRate: '0',
    taxName: 'Sales Tax',
    taxIncluded: false,
    multiTaxRates: [],
    companyRegNumber: ''
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Load saved business profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('businessProfile')
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setBusinessData(prev => ({ ...prev, ...parsedProfile }))
      } catch (error) {
        console.error('Error loading business profile:', error)
      }
    }
  }, [])

  const handleDataChange = (newData) => {
    setBusinessData(prev => ({ ...prev, ...newData }))
    setHasChanges(true)
  }

  const handleSave = () => {
    try {
      localStorage.setItem('businessProfile', JSON.stringify(businessData))
      setHasChanges(false)
      toast.success('Business profile saved successfully!')
    } catch (error) {
      console.error('Error saving business profile:', error)
      toast.error('Failed to save business profile')
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
      const savedProfile = localStorage.getItem('businessProfile')
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          setBusinessData(prev => ({ ...prev, ...parsedProfile }))
        } catch (error) {
          console.error('Error resetting profile:', error)
        }
      }
      setHasChanges(false)
      toast.info('Changes have been reset')
    }
  }

  const tabs = [
    { id: 'business', label: 'Business Info', icon: FaBuilding },
    { id: 'payment', label: 'Payment Terms', icon: FaCreditCard },
    { id: 'tax', label: 'Tax Settings', icon: FaPercent }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return (
          <BusinessInfoForm 
            data={businessData} 
            onChange={handleDataChange}
          />
        )
      case 'payment':
        return (
          <PaymentTermsForm 
            data={businessData} 
            onChange={handleDataChange}
          />
        )
      case 'tax':
        return (
          <TaxSettingsForm 
            data={businessData} 
            onChange={handleDataChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.businessProfile}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Business Profile</h2>
          <p>Manage your business information, payment terms, and tax settings</p>
        </div>
        {hasChanges && (
          <div className={styles.headerActions}>
            <button onClick={handleReset} className={styles.resetButton}>
              <FaUndo /> Reset
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              <FaSave /> Save Changes
            </button>
          </div>
        )}
      </div>

      {hasChanges && (
        <div className={styles.changesBanner}>
          <p>You have unsaved changes. Don't forget to save your business profile.</p>
        </div>
      )}

      <div className={styles.tabNavigation}>
        {tabs.map(tab => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent className={styles.tabIcon} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Floating Save Button for Mobile */}
      {hasChanges && (
        <div className={styles.floatingSave}>
          <button onClick={handleSave} className={styles.floatingSaveButton}>
            <FaSave /> Save
          </button>
        </div>
      )}
    </div>
  )
}

export default BusinessProfile

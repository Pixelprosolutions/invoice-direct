import React, { useState } from 'react'
import { FaUpload, FaTrash, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaIdCard } from 'react-icons/fa'
import styles from './BusinessInfoForm.module.css'

const BusinessInfoForm = ({ data, onChange }) => {
  const [logoPreview, setLogoPreview] = useState(data.businessLogo || '')

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const logoUrl = event.target.result
        setLogoPreview(logoUrl)
        onChange({ businessLogo: logoUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview('')
    onChange({ businessLogo: '' })
  }

  return (
    <div className={styles.businessInfoForm}>
      <div className={styles.formSection}>
        <h3>
          <FaBuilding className={styles.sectionIcon} />
          Company Information
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="businessName">Business Name *</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={data.businessName}
              onChange={handleChange}
              placeholder="Your Business Name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="taxId">Tax ID / EIN</label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={data.taxId}
              onChange={handleChange}
              placeholder="12-3456789"
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="businessAddress">Business Address</label>
            <input
              type="text"
              id="businessAddress"
              name="businessAddress"
              value={data.businessAddress}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessCity">City</label>
            <input
              type="text"
              id="businessCity"
              name="businessCity"
              value={data.businessCity}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessState">State/Province</label>
            <input
              type="text"
              id="businessState"
              name="businessState"
              value={data.businessState}
              onChange={handleChange}
              placeholder="State or Province"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessZip">ZIP/Postal Code</label>
            <input
              type="text"
              id="businessZip"
              name="businessZip"
              value={data.businessZip}
              onChange={handleChange}
              placeholder="ZIP code"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessCountry">Country</label>
            <input
              type="text"
              id="businessCountry"
              name="businessCountry"
              value={data.businessCountry}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaEnvelope className={styles.sectionIcon} />
          Contact Information
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="businessEmail">Business Email *</label>
            <input
              type="email"
              id="businessEmail"
              name="businessEmail"
              value={data.businessEmail}
              onChange={handleChange}
              placeholder="hello@yourbusiness.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessPhone">Business Phone</label>
            <input
              type="tel"
              id="businessPhone"
              name="businessPhone"
              value={data.businessPhone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="businessWebsite">Website</label>
            <input
              type="url"
              id="businessWebsite"
              name="businessWebsite"
              value={data.businessWebsite}
              onChange={handleChange}
              placeholder="https://www.yourbusiness.com"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaUpload className={styles.sectionIcon} />
          Business Logo
        </h3>
        
        <div className={styles.logoSection}>
          {logoPreview ? (
            <div className={styles.logoPreview}>
              <img src={logoPreview} alt="Business Logo" className={styles.logoImage} />
              <div className={styles.logoActions}>
                <label htmlFor="logoUpload" className={styles.changeLogo}>
                  <FaUpload /> Change Logo
                </label>
                <button type="button" onClick={removeLogo} className={styles.removeLogo}>
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.logoUpload}>
              <label htmlFor="logoUpload" className={styles.logoUploadArea}>
                <FaUpload className={styles.uploadIcon} />
                <h4>Upload Business Logo</h4>
                <p>PNG, JPG up to 2MB</p>
                <p>Recommended: 400x200px</p>
              </label>
            </div>
          )}
          
          <input
            type="file"
            id="logoUpload"
            accept="image/*"
            onChange={handleLogoUpload}
            className={styles.hiddenInput}
          />
        </div>

        <div className={styles.logoTips}>
          <h4>Logo Tips:</h4>
          <ul>
            <li>Use a high-quality image with transparent background</li>
            <li>Keep text readable at small sizes</li>
            <li>Horizontal layouts work best for invoices</li>
            <li>Your logo will appear on all invoices and documents</li>
          </ul>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaIdCard className={styles.sectionIcon} />
          Additional Information
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="companyRegNumber">Company Registration Number</label>
            <input
              type="text"
              id="companyRegNumber"
              name="companyRegNumber"
              value={data.companyRegNumber}
              onChange={handleChange}
              placeholder="Company registration or license number"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessInfoForm

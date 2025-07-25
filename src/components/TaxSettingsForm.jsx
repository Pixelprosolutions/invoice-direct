import React, { useState } from 'react'
import { FaPercent, FaPlus, FaTrash, FaCalculator, FaInfoCircle } from 'react-icons/fa'
import styles from './TaxSettingsForm.module.css'

const TaxSettingsForm = ({ data, onChange }) => {
  const [newTaxRate, setNewTaxRate] = useState({ name: '', rate: '', description: '' })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    onChange({ [name]: type === 'checkbox' ? checked : value })
  }

  const handleMultiTaxChange = (index, field, value) => {
    const updated = [...(data.multiTaxRates || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ multiTaxRates: updated })
  }

  const addTaxRate = () => {
    if (newTaxRate.name && newTaxRate.rate) {
      const updated = [...(data.multiTaxRates || []), { ...newTaxRate, id: Date.now() }]
      onChange({ multiTaxRates: updated })
      setNewTaxRate({ name: '', rate: '', description: '' })
    }
  }

  const removeTaxRate = (index) => {
    const updated = [...(data.multiTaxRates || [])]
    updated.splice(index, 1)
    onChange({ multiTaxRates: updated })
  }

  const taxPresets = [
    { name: 'Sales Tax', rate: '8.25', description: 'Standard sales tax' },
    { name: 'VAT', rate: '20', description: 'Value Added Tax' },
    { name: 'GST', rate: '10', description: 'Goods and Services Tax' },
    { name: 'HST', rate: '13', description: 'Harmonized Sales Tax' }
  ]

  return (
    <div className={styles.taxSettingsForm}>
      <div className={styles.formSection}>
        <h3>
          <FaPercent className={styles.sectionIcon} />
          Default Tax Settings
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="defaultTaxRate">Default Tax Rate (%)</label>
            <div className={styles.inputGroup}>
              <input
                type="number"
                id="defaultTaxRate"
                name="defaultTaxRate"
                value={data.defaultTaxRate}
                onChange={handleChange}
                placeholder="8.25"
                step="0.01"
                min="0"
                max="100"
              />
              <span className={styles.inputSuffix}>%</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="taxName">Tax Name</label>
            <input
              type="text"
              id="taxName"
              name="taxName"
              value={data.taxName}
              onChange={handleChange}
              placeholder="Sales Tax, VAT, GST, etc."
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="taxIncluded"
                checked={data.taxIncluded}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>Tax included in item prices</span>
              <span className={styles.checkboxNote}>
                Check this if your item prices already include tax
              </span>
            </label>
          </div>
        </div>

        <div className={styles.taxPresets}>
          <h4>Quick Tax Presets</h4>
          <div className={styles.presetsGrid}>
            {taxPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                className={styles.presetButton}
                onClick={() => onChange({ 
                  defaultTaxRate: preset.rate, 
                  taxName: preset.name 
                })}
              >
                <strong>{preset.name}</strong>
                <span>{preset.rate}%</span>
                <small>{preset.description}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaCalculator className={styles.sectionIcon} />
          Multiple Tax Rates
        </h3>
        
        <div className={styles.multiTaxSection}>
          <p className={styles.sectionDescription}>
            Configure multiple tax rates for different types of products or services.
          </p>

          {data.multiTaxRates && data.multiTaxRates.length > 0 && (
            <div className={styles.taxRatesList}>
              {data.multiTaxRates.map((taxRate, index) => (
                <div key={index} className={styles.taxRateItem}>
                  <div className={styles.taxRateGrid}>
                    <div className={styles.formGroup}>
                      <label>Tax Name</label>
                      <input
                        type="text"
                        value={taxRate.name}
                        onChange={(e) => handleMultiTaxChange(index, 'name', e.target.value)}
                        placeholder="Tax name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Rate (%)</label>
                      <div className={styles.inputGroup}>
                        <input
                          type="number"
                          value={taxRate.rate}
                          onChange={(e) => handleMultiTaxChange(index, 'rate', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                        <span className={styles.inputSuffix}>%</span>
                      </div>
                    </div>
                    <div className={styles.formGroup + ' ' + styles.fullWidth}>
                      <label>Description</label>
                      <input
                        type="text"
                        value={taxRate.description}
                        onChange={(e) => handleMultiTaxChange(index, 'description', e.target.value)}
                        placeholder="Tax description"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTaxRate(index)}
                    className={styles.removeTaxButton}
                    title="Remove this tax rate"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.addTaxRate}>
            <h4>Add New Tax Rate</h4>
            <div className={styles.addTaxGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="newTaxName">Tax Name</label>
                <input
                  type="text"
                  id="newTaxName"
                  value={newTaxRate.name}
                  onChange={(e) => setNewTaxRate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Luxury Tax, Export Tax"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newTaxRate">Rate (%)</label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    id="newTaxRate"
                    value={newTaxRate.rate}
                    onChange={(e) => setNewTaxRate(prev => ({ ...prev, rate: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <span className={styles.inputSuffix}>%</span>
                </div>
              </div>
              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label htmlFor="newTaxDescription">Description</label>
                <input
                  type="text"
                  id="newTaxDescription"
                  value={newTaxRate.description}
                  onChange={(e) => setNewTaxRate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of when this tax applies"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addTaxRate}
              className={styles.addTaxButton}
              disabled={!newTaxRate.name || !newTaxRate.rate}
            >
              <FaPlus /> Add Tax Rate
            </button>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FaInfoCircle className={styles.sectionIcon} />
          Tax Information
        </h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="taxRegistrationNumber">Tax Registration Number</label>
            <input
              type="text"
              id="taxRegistrationNumber"
              name="taxRegistrationNumber"
              value={data.taxRegistrationNumber || ''}
              onChange={handleChange}
              placeholder="Your tax registration or VAT number"
            />
          </div>

          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label htmlFor="taxFooterText">Tax Footer Text</label>
            <textarea
              id="taxFooterText"
              name="taxFooterText"
              value={data.taxFooterText || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Additional tax information to display on invoices..."
            />
          </div>
        </div>

        <div className={styles.taxTips}>
          <h4>Tax Configuration Tips:</h4>
          <ul>
            <li>Set your most commonly used tax rate as the default</li>
            <li>Use multiple tax rates for different product categories</li>
            <li>Consider whether your prices include or exclude tax</li>
            <li>Keep tax registration numbers up to date</li>
            <li>Consult with an accountant for complex tax situations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TaxSettingsForm

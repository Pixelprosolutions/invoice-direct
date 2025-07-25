import React, { useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'
import styles from './TemplateEditor.module.css'

const TemplateEditor = ({ template, onSave, onCancel }) => {
  const [templateData, setTemplateData] = useState(template)

  const handleSave = () => {
    onSave(templateData)
  }

  const handleChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBrandingChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value
      }
    }))
  }

  return (
    <div className={styles.templateEditor}>
      <div className={styles.header}>
        <h2>Customize Template</h2>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            <FaTimes /> Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            <FaSave /> Save Template
          </button>
        </div>
      </div>

      <div className={styles.editorContent}>
        <div className={styles.formSection}>
          <h3>Template Info</h3>
          <div className={styles.formGroup}>
            <label>Template Name</label>
            <input
              type="text"
              value={templateData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={templateData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe this template"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Colors</h3>
          <div className={styles.colorGrid}>
            <div className={styles.formGroup}>
              <label>Primary Color</label>
              <input
                type="color"
                value={templateData.branding.primaryColor}
                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secondary Color</label>
              <input
                type="color"
                value={templateData.branding.secondaryColor}
                onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Accent Color</label>
              <input
                type="color"
                value={templateData.branding.accentColor}
                onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Typography</h3>
          <div className={styles.formGroup}>
            <label>Font Family</label>
            <select
              value={templateData.branding.fontFamily}
              onChange={(e) => handleBrandingChange('fontFamily', e.target.value)}
            >
              <option value="Inter">Inter (Modern)</option>
              <option value="Georgia">Georgia (Classic)</option>
              <option value="Poppins">Poppins (Friendly)</option>
              <option value="Times New Roman">Times (Traditional)</option>
            </select>
          </div>
        </div>

        <p className={styles.note}>
          Full template editor with live preview coming soon! For now, you can adjust basic colors and save as a custom template.
        </p>
      </div>
    </div>
  )
}

export default TemplateEditor
